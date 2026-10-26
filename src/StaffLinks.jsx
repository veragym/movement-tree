import React,{useRef,useState,useEffect} from 'react';
import {rpc} from './storage';
import {MAIN_QUEST_KEY,copyWorkspacePair,createStaffPair,workspaceLinks,appendStaffEntry} from './staff-workspaces';
import './staff-links.css';

export function StaffLinks({sync,onClose,notify}){
 const [name,setName]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const pending=useRef(null),locked=useRef(false),dialog=useRef(null);
 const latest=useRef(sync);latest.current=sync;
 useEffect(()=>{const previous=document.activeElement;dialog.current?.querySelector('input')?.focus();return()=>previous?.focus()},[]);
 const entries=sync.doc.staffDirectory||[];
 async function create(e){
  e.preventDefault();if(locked.current)return;locked.current=true;setBusy(true);setError('');
  try{
   if(!pending.current){const remote=await rpc('mt_load',{p_key:MAIN_QUEST_KEY});if(!remote)throw Error('원본 퀘스트를 불러오지 못했습니다.');pending.current=copyWorkspacePair({basic:sync.doc,quest:remote.document,name});}
   const entry=await createStaffPair(pending.current,rpc);
   latest.current.replace(appendStaffEntry(latest.current.doc,entry));
   pending.current=null;setName('');notify('직원용 기본·퀘스트 링크를 만들었습니다.');
  }catch(e){setError(e.message==='OFFLINE'?'연결을 확인한 뒤 다시 생성해 주세요. 같은 복사본에서 이어갑니다.':e.message)}
  finally{locked.current=false;setBusy(false)}
 }
 async function copy(entry){try{await navigator.clipboard.writeText(new URL(workspaceLinks({staffWorkspace:entry}).basic,location.href).href);notify('직원용 링크를 복사했습니다.')}catch{setError('링크 복사가 되지 않았습니다. 아래 주소를 직접 복사해 주세요.')}}
 return <div className="staff-backdrop"><section ref={dialog} role="dialog" aria-modal="true" aria-label="직원용 링크 관리" className="staff-dialog" onKeyDown={e=>{if(e.key==='Escape'&&!busy)onClose();if(e.key==='Tab'){const all=dialog.current.querySelectorAll('button:not(:disabled),input,a[href]'),first=all[0],last=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}}>
  <header><h2>직원용 링크</h2><button disabled={busy} onClick={onClose} aria-label="직원용 링크 닫기">×</button></header>
  <p>현재 원본의 기본·퀘스트를 복사합니다. 직원이 편집해도 원본과 다른 직원의 트리는 바뀌지 않습니다.</p>
  <form onSubmit={create}><label>직원 이름<input aria-label="직원 이름" maxLength={40} value={name} disabled={busy||!!pending.current} onChange={e=>setName(e.target.value)} placeholder="예: 김민수"/></label><button className="staff-primary" disabled={busy||!name.trim()||sync.status!=='saved'}>{busy?'복사본 만드는 중…':pending.current?'생성 다시 시도':'직원용 링크 만들기'}</button></form>
  {sync.status!=='saved'&&<p className="staff-hint">원본 저장이 끝나면 링크를 만들 수 있습니다.</p>}
  {error&&<p role="alert" className="staff-error">{error}</p>}
  <p className="staff-hint">기존 회원 정보·평가 기록은 복사하지 않습니다. 생성 후 원본 수정은 직원 복사본에 자동 반영되지 않습니다. 링크를 가진 사람은 해당 복사본을 편집할 수 있습니다.</p>
  <div className="staff-list">{entries.length?entries.map(entry=>{const links=workspaceLinks({staffWorkspace:entry});return <article key={entry.basicKey}><div><strong>{entry.name}</strong><small>{new Date(entry.createdAt).toLocaleDateString('ko-KR')} 생성</small></div><div className="staff-link-actions"><a href={links.basic} target="_blank" rel="noopener noreferrer">기본 열기</a><a href={links.quest} target="_blank" rel="noopener noreferrer">퀘스트 열기</a><button onClick={()=>copy(entry)}>링크 복사</button></div><input aria-label={entry.name+' 전용 링크'} readOnly value={new URL(links.basic,location.href).href} onFocus={e=>e.target.select()}/></article>}):<p>아직 생성한 직원용 링크가 없습니다.</p>}</div>
 </section></div>;
}
