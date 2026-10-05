import pack from './practice-pack.json' with {type:'json'};
export function applyPracticeCurriculum(source,now=new Date().toISOString()){
 if(source.quest?.practiceVersion===pack.version)return source;
 const doc=structuredClone(source),q=doc.quest;
 if(q?.schema!==2)throw Error('지원하지 않는 퀘스트 문서입니다.');
 for(const id of Object.keys(pack.bindings))if(!doc.nodes.some(n=>n.id===id))throw Error('가지가 없습니다: '+id);
 const previous=structuredClone({at:now,bindings:q.bindings,members:q.members});
 q.curriculumHistory=[...(q.curriculumHistory||[]),previous];
 for(const item of pack.library){if(q.library.some(c=>c.id===item.id))throw Error('평가 항목 ID 충돌: '+item.id);q.library.push(structuredClone(item));}
 for(const m of q.members)for(const [id,r] of Object.entries(m.records||{})){
  if(JSON.stringify(q.bindings[id]||[])===JSON.stringify(pack.bindings[id]||[]))continue;
  r.history=[...(r.history||[]),{at:now,type:'curriculum',label:'수행 중심 조건으로 재배치 · 이전 체크와 메모 보존',previousAchievedAt:r.achievedAt||null,previousFirstAchievedAt:r.firstAchievedAt||null}];
  r.achievedAt=null;r.firstAchievedAt=null;
 }
 q.bindings=structuredClone(pack.bindings);q.practiceVersion=pack.version;
 return doc;
}
