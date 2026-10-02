export const TEST_KEY='a9cc68be-9241-4d05-a023-84840d08e212';
export function createSimpleQuest(doc,old){
 const library=[{id:'straight-arm',label:'팔꿈치를 살짝 굽힌 팔 형태를 유지하며 동작한다',description:'스트레이트 암: 팔꿈치 약 5° 굽힘을 설명 예시로 사용합니다. 각도 측정보다 형태 유지에 집중합니다.'},{id:'hip-hinge',label:'고관절을 중심으로 접었다 펴는 움직임을 원활하게 수행한다',description:''},{id:'stable-trunk',label:'동작 중 정한 몸통 자세를 유지한다',description:''}];
 const bindings={};const single=doc.nodes.find(n=>n.parent==='push'&&n.label.includes('단일'));if(single)bindings[single.id]=['straight-arm'];if(doc.nodes.some(n=>n.id==='hinge'))bindings.hinge=['hip-hinge'];
 return {schema:2,library,bindings,members:(old?.members?.length?old.members:[{id:'demo-a',name:'테스트 회원 A'},{id:'demo-b',name:'테스트 회원 B'}]).map(m=>({id:m.id,name:m.name,records:{}}))};
}
export const criteriaFor=(q,id)=>(q.bindings[id]||[]).map(k=>q.library.find(c=>c.id===k)).filter(Boolean);
export const record=(member,id)=>member?.records?.[id]||{checks:{},note:'',history:[]};
export function progress(q,member,id){const items=criteriaFor(q,id),r=record(member,id),checked=items.filter(c=>!!r.checks?.[c.id]?.done).length;return {total:items.length,checked,done:items.length>0&&checked===items.length};}
export function stats(q,member){const ids=Object.keys(q.bindings).filter(id=>criteriaFor(q,id).length);const done=ids.filter(id=>progress(q,member,id).done).length;return {total:ids.length,done,percent:ids.length?Math.round(done/ids.length*100):0};}
export function setCheck(q,memberId,nodeId,criterionId,done,now=new Date().toISOString()){
 if(!criteriaFor(q,nodeId).some(c=>c.id===criterionId))throw Error('연결된 평가 항목이 아닙니다.');const m=q.members.find(x=>x.id===memberId);if(!m)throw Error('학습자가 없습니다.');const before=progress(q,m,nodeId),r=record(m,nodeId);
 const next={...r,checks:{...r.checks,[criterionId]:{done,updatedAt:now}},history:[...(r.history||[]),{at:now,type:done?'check':'uncheck',criterionId,label:q.library.find(c=>c.id===criterionId).label}]};m.records[nodeId]=next;
 if(progress(q,m,nodeId).done&&!before.done){next.firstAchievedAt=next.firstAchievedAt||now;next.achievedAt=now;}if(!progress(q,m,nodeId).done)next.achievedAt=null;
}
export function linkCriterion(q,nodeId,id){if(!q.library.some(c=>c.id===id))throw Error('평가 항목이 없습니다.');if((q.bindings[nodeId]||[]).includes(id))return;q.bindings[nodeId]=[...(q.bindings[nodeId]||[]),id];for(const m of q.members){if(m.records[nodeId])m.records[nodeId].achievedAt=null;}}
export function unlinkCriterion(q,nodeId,id,now=new Date().toISOString()){
 q.bindings[nodeId]=(q.bindings[nodeId]||[]).filter(x=>x!==id);if(!q.bindings[nodeId].length)delete q.bindings[nodeId];
 for(const m of q.members){const r=m.records[nodeId];if(!r)continue;delete r.checks[id];r.history=[...(r.history||[]),{at:now,type:'unlink',criterionId:id}];const done=progress(q,m,nodeId).done;r.achievedAt=done?(r.achievedAt||now):null;if(done)r.firstAchievedAt=r.firstAchievedAt||now;}
}
export function deleteCriterion(q,id){for(const node of Object.keys(q.bindings))if(q.bindings[node].includes(id))unlinkCriterion(q,node,id);q.library=q.library.filter(c=>c.id!==id);}
export function removeMember(q,id){if(q.members.length<=1)throw Error('학습자는 최소 1명이 필요합니다.');q.members=q.members.filter(m=>m.id!==id);}

