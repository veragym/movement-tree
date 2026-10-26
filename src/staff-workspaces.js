import {validateDoc} from './model.js';

export const MAIN_BASIC_KEY='27ce43fa-489c-4367-b6ff-891b478abe3e';
export const MAIN_QUEST_KEY='a9cc68be-9241-4d05-a023-84840d08e212';
const uuid=/^[\da-f]{8}(-[\da-f]{4}){3}-[\da-f]{12}$/i;
export function workspaceKey(hash,page='basic'){
 const key=new URLSearchParams(hash.replace(/^#/,'')).get('tree');
 return uuid.test(key||'')?key:page==='quest'?MAIN_QUEST_KEY:MAIN_BASIC_KEY;
}
export function workspaceLinks(doc){
 const pair=doc?.staffWorkspace;
 if(pair&&uuid.test(pair.basicKey)&&uuid.test(pair.questKey))return {basic:'./index.html#tree='+pair.basicKey,quest:'./quest.html#tree='+pair.questKey};
 return {basic:'./index.html#tree='+MAIN_BASIC_KEY,quest:'./quest.html'};
}
export function preserveWorkspaceIdentity(current,incoming,key,{directoryUpdate=false}={}){
 const d=structuredClone(incoming),pair=current?.staffWorkspace;
 delete d.staffWorkspace;delete d.staffDirectory;
 if(pair&&(key===pair.basicKey||key===pair.questKey))d.staffWorkspace=structuredClone(pair);
 const directory=directoryUpdate?incoming.staffDirectory:current.staffDirectory;
 if(key===MAIN_BASIC_KEY&&directory)d.staffDirectory=structuredClone(directory);
 return d;
}
export function appendStaffEntry(current,entry){
 return {...current,staffDirectory:[...(current.staffDirectory||[]).filter(x=>x.basicKey!==entry.basicKey),entry]};
}
export function copyWorkspacePair({basic,quest,name,basicKey=crypto.randomUUID(),questKey=crypto.randomUUID()}){
 name=name.trim();
 if(!name||name.length>40)throw Error('직원 이름을 40자 이내로 입력해 주세요.');
 if(![basicKey,questKey].every(k=>uuid.test(k)&&![MAIN_BASIC_KEY,MAIN_QUEST_KEY].includes(k))||basicKey===questKey)throw Error('독립된 저장 공간을 만들지 못했습니다.');
 validateDoc(basic);validateDoc(quest);
 if(quest.quest?.schema!==2)throw Error('원본 퀘스트를 불러온 뒤 다시 시도해 주세요.');
 for(const d of [basic,quest])if(d.nodes.some(n=>n.images.some(i=>i.url.startsWith('local:'))))throw Error('이미지를 클라우드에 저장한 뒤 생성해 주세요.');
 const metadata={version:1,name,basicKey,questKey,createdAt:new Date().toISOString()};
 const b=structuredClone(basic),q=structuredClone(quest);
 for(const d of [b,q]){delete d.staffDirectory;d.staffWorkspace={...metadata};}
 // Never distribute existing client identities or assessment history to employees.
 delete b.quest;
 q.quest.members=[{id:crypto.randomUUID(),name:'새 학습자',records:{}}];
 return {basic:b,quest:q,entry:metadata};
}
export async function createStaffPair(pair,rpc){
 for(const [kind,key]of [['basic',pair.entry.basicKey],['quest',pair.entry.questKey]]){
  const existing=await rpc('mt_load',{p_key:key});
  if(existing){
   const m=existing.document?.staffWorkspace;
   if(m?.basicKey!==pair.entry.basicKey||m?.questKey!==pair.entry.questKey)throw Error('이미 사용 중인 주소입니다.');
   continue; // Retrying partial creation must never overwrite an employee's changes.
  }
  await rpc('mt_save',{p_key:key,p_expected:0,p_doc:pair[kind]});
  const saved=await rpc('mt_load',{p_key:key});
  if(saved?.document?.staffWorkspace?.basicKey!==pair.entry.basicKey||saved?.document?.staffWorkspace?.questKey!==pair.entry.questKey)throw Error('복사본 저장을 확인하지 못했습니다. 다시 시도해 주세요.');
 }
 return pair.entry;
}
