import {useEffect,useRef,useState,useCallback} from 'react';
import {seed,validateDoc} from './model';
import {readLocal,writeLocal,rpc,uploadImage} from './storage';
export function useDocument(key){
 const [doc,setDoc]=useState(seed),[ready,setReady]=useState(false),[status,setStatus]=useState('loading'),[conflict,setConflict]=useState(null),[error,setError]=useState('');
 const [wake,setWake]=useState(0);
 const live=useRef({doc:seed(),revision:0,dirty:false,known:false}),busy=useRef(false),mounted=useRef(true);
 const persist=async()=>{try{await writeLocal(key,{doc:live.current.doc,revision:live.current.revision,dirty:live.current.dirty});}catch{setError('기기 저장 공간이 부족합니다. 백업을 먼저 내보내 주세요.')}};
 const replace=(d)=>{validateDoc(d);live.current.doc=d;live.current.dirty=true;setDoc(d);setStatus('pending');persist()};
 const refresh=useCallback(async()=>{
  if(busy.current)return;busy.current=true;
  try{if(live.current.known&&!live.current.dirty){let version=await rpc('mt_version',{p_key:key});if(version===live.current.revision){setStatus('saved');return}}let remote=await rpc('mt_load',{p_key:key});if(remote)validateDoc(remote.document);let l=live.current;
   if(remote&&l.dirty&&remote.revision!==l.revision){setConflict(remote);setStatus('conflict');return}
   if(remote&&!l.dirty){l.doc=remote.document;l.revision=remote.revision;setDoc(l.doc)}
   if(!remote&&!l.dirty){l.dirty=true}
   l.known=true;setStatus(l.dirty?'pending':'saved');await persist();
  }catch(e){setStatus(e.message==='SETUP'?'setup':'offline');if(!['SETUP','OFFLINE'].includes(e.message))setError(e.message)}finally{busy.current=false;setReady(true);setWake(v=>v+1)}
 },[key]);
 useEffect(()=>{mounted.current=true;(async()=>{let cached;try{cached=await readLocal(key)}catch{setError('기기 저장소를 열지 못했습니다. 클라우드 연결을 확인합니다.')}if(!mounted.current)return;if(cached){try{validateDoc(cached.doc);live.current={...cached,known:false};setDoc(cached.doc)}catch{setError('기기 저장본 형식을 확인할 수 없습니다.');setReady(true);return}}await refresh()})();return()=>{mounted.current=false}},[key]);
 useEffect(()=>{if(!ready||!live.current.dirty||conflict||status==='offline'||status==='setup')return;let timer=setTimeout(async()=>{
  if(busy.current)return;
  if(!live.current.known){await refresh();return}
  busy.current=true;setStatus('saving');let source=live.current.doc,revision=live.current.revision;let toSave=structuredClone(source);
  try{
   // Create the workspace before uploading its first local asset.
   if(revision===0){revision=await rpc('mt_save',{p_key:key,p_expected:0,p_doc:{...toSave,nodes:toSave.nodes.map(n=>({...n,images:n.images.filter(i=>!i.url.startsWith('local:'))}))}});live.current.revision=revision;}
   let replacements=new Map();for(let n of toSave.nodes)for(let im of n.images){if(im.url.startsWith('local:')){if(!replacements.has(im.url))replacements.set(im.url,await uploadImage(key,im.url));im.url=replacements.get(im.url)}}
   let next=await rpc('mt_save',{p_key:key,p_expected:revision,p_doc:toSave});live.current.revision=next;
   let current=live.current.doc;
   if(current===source){live.current.doc=toSave;live.current.dirty=false;setDoc(toSave);setStatus('saved')}
   else {let patched=structuredClone(current);for(let n of patched.nodes)for(let im of n.images)if(replacements.has(im.url))im.url=replacements.get(im.url);live.current.doc=patched;setDoc(patched);setStatus('pending')}
   await persist();
  }catch(e){if(e.message==='CONFLICT'){let remote=await rpc('mt_load',{p_key:key}).catch(()=>null);setConflict(remote||{revision:null});setStatus('conflict')}else{setStatus(e.message==='SETUP'?'setup':'offline');setError(e.message==='OFFLINE'?'연결이 끊겼습니다. 내용은 이 기기에 보관됩니다.':e.message)}await persist()}
  finally{busy.current=false}
 },1000);return()=>{clearTimeout(timer)}
 },[doc,ready,status==='pending',conflict,wake]);
 useEffect(()=>{let callback=()=>{if(document.visibilityState==='visible'&&!live.current.dirty)refresh();else if(navigator.onLine&&!busy.current&&live.current.dirty&&!conflict){live.current.known=false;refresh()}};let timer=setInterval(callback,60000);window.addEventListener('online',callback);document.addEventListener('visibilitychange',callback);return()=>{clearInterval(timer);window.removeEventListener('online',callback);document.removeEventListener('visibilitychange',callback)}},[refresh,conflict]);
 const resolve=async(choice)=>{if(!conflict?.document)return;let old=structuredClone(live.current.doc);await writeLocal(key+':conflict-'+Date.now(),{doc:old,revision:live.current.revision,dirty:true});live.current.revision=conflict.revision;live.current.known=true;if(choice==='remote'){live.current.doc=conflict.document;live.current.dirty=false;setDoc(conflict.document);setStatus('saved')}else{live.current.dirty=true;setDoc({...live.current.doc});setStatus('pending')}setConflict(null);persist()};
 return {doc,replace,ready,status,refresh,conflict,resolve,error,clearError:()=>setError('')};
}
