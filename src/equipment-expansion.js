import {item,validateDoc} from './model.js';
export const equipmentPackId='equipment-expansion-v6';
// M: dedicated machine, S: Smith machine (a separate machine variant).
export const equipmentMatrix=Object.fromEntries(`체스트 프레스|M B D C S
푸시업|
인클라인 체스트 프레스|M B D C S
디클라인 체스트 프레스|M B D C S
숄더 프레스|M B D C S
딥스|M
체스트 플라이|M D C
인클라인 플라이|D C
로우 투 하이 플라이|C
하이 투 로우 플라이|C
프론트 레이즈|B D C
래터럴 레이즈|M D C
트라이셉스 푸시다운|C
오버헤드 트라이셉스 익스텐션|B D C
트라이셉스 킥백|D C
시티드 로우|M C
벤트오버 로우|B D C S
하이 로우|M C
로우 로우|M C
랫 풀다운|M C
풀업|M
친업|M
스트레이트 암 풀다운|C
풀오버|M B D C
리어 델트 플라이|M D C
리버스 플라이|M D C
바이셉스 컬|M B D C
해머 컬|D C
리버스 컬|B D C
스쿼트|M B D C S
프론트 스쿼트|B D S
백 스쿼트|B S
스모 스쿼트|B D C S
레그 프레스|M
핵 스쿼트|M
V 스쿼트|M
레그 익스텐션|M C
힙 어덕션|M C
데드리프트|B D
루마니안 데드리프트|B D C S
스티프 레그 데드리프트|B D S
스모 데드리프트|B D C S
힙 쓰러스트|M B D S
글루트 브리지|M B D
백 익스텐션|D
굿모닝|B D C S
시티드 레그 컬|M
라잉 레그 컬|M C
스탠딩 레그 컬|M C
힙 익스텐션|M C
글루트 킥백|M C
힙 어브덕션|M C
포워드 런지|B D
리버스 런지|B D C S
워킹 런지|B D
사이드 런지|B D C
커시 런지|B D C
스플릿 스쿼트|B D C S
불가리안 스플릿 스쿼트|B D C S
스텝업|B D C
스텝다운|D
싱글 레그 스쿼트|D C
피스톨 스쿼트|D C
스탠딩 카프 레이즈|M B D S
시티드 카프 레이즈|M B D S`.split('\n').map(row=>{const [name,codes]=row.split('|');return ['basic::'+name,codes?codes.split(' '):[]]}));
const tools={M:['머신','Machine'],S:['머신','Smith Machine'],B:['바벨','Barbell'],D:['덤벨','Dumbbell'],C:['케이블','Cable']};
const machineAssist=new Set(['basic::딥스','basic::풀업','basic::친업']);
export function applyEquipmentExpansion(document){
 if(document.contentPacks?.includes(equipmentPackId))return document;
 const d=structuredClone(document);
 // Move only the equipment prefix; keep exercise wording, IDs, images and notes.
 for(const n of d.nodes){
  if(n.label.startsWith('머신 '))n.label=n.label.slice(3)+' 머신';
  if(/^Machine\s+/i.test(n.englishName||''))n.englishName=n.englishName.replace(/^Machine\s+/i,'')+' Machine';
 }
 for(const [id,codes] of Object.entries(equipmentMatrix)){
  const basic=d.nodes.find(n=>n.id===id);if(!basic)continue;
  for(const code of codes){
   const [tool,enTool]=tools[code];
   let branch=d.nodes.find(n=>n.parent===id&&n.label===tool);
   if(!branch){branch={...item(id+'::tool::'+tool,tool,id),level:'tool'};if(d.nodes.some(n=>n.id===branch.id))branch.id+='::v6';d.nodes.push(branch);}
   const children=d.nodes.filter(n=>n.parent===branch.id&&n.kind==='exercise');
   if(code==='S'?children.some(n=>/스미스|Smith/i.test(n.label+' '+(n.englishName||''))):children.some(n=>!/스미스|Smith/i.test(n.label+' '+(n.englishName||''))))continue;
   const assistance=code==='M'&&machineAssist.has(id);
   const label=code==='S'?basic.label+' 스미스 머신':code==='M'?(assistance?'어시스티드 ':'')+basic.label+' 머신':tool+' '+basic.label;
   const englishName=code==='S'?basic.englishName+' Smith Machine':code==='M'?(assistance?'Assisted ':'')+basic.englishName+' Machine':enTool+' '+basic.englishName;
   const n={...item(id+'::equipment-v6::'+code,label,branch.id,'exercise'),level:'variant',englishName};
   n.meanings=[{id:n.id+'-tool',word:enTool,meaning:code==='S'?'도구: 스미스 머신':'도구: '+tool},{id:n.id+'-movement',word:basic.englishName||basic.label,meaning:basic.label}];
   if(code==='M'||code==='S')n.meanings.reverse();
   let body=code==='S'?'바가 레일을 따라 움직입니다. 레일 방향과 발·벤치 위치를 확인하고 안전 걸이를 설정합니다.':code==='M'?'해당 동작을 지원하는 전용 기구가 필요합니다. 좌석·패드·회전축과 손잡이 위치를 몸에 맞춥니다.':code==='C'?'케이블 높이와 몸의 위치에 따라 저항 방향이 달라집니다. 손잡이와 지지 자세를 확인합니다.':code==='B'?'양손이 하나의 바에 연결됩니다. 그립 간격과 바의 이동 경로를 확인합니다.':'양손의 무게를 각각 제어합니다. 벤치나 몸통 지지 여부를 확인합니다.';
   if(assistance)body='보조 중량이 몸을 들어 올려 수행을 돕습니다. 보조 중량과 발·무릎 지지대 사용법을 확인합니다.';
   if(code==='C'&&['basic::레그 익스텐션','basic::라잉 레그 컬','basic::스탠딩 레그 컬','basic::힙 어덕션','basic::힙 익스텐션','basic::글루트 킥백','basic::힙 어브덕션'].includes(id))body+=' 발목 스트랩을 사용하고 몸통과 지지 다리를 안정시킵니다.';
   if(code==='C'&&['basic::싱글 레그 스쿼트','basic::피스톨 스쿼트'].includes(id))body='케이블을 잡아 균형과 일어서기를 보조하는 변형입니다. 단순히 무게를 더하는 변형과 구분합니다.';
   n.fields=[{id:n.id+'-difference',title:'이번에 달라지는 점',body,visible:true}];
   if(!d.nodes.some(x=>x.id===n.id))d.nodes.push(n);
  }
 }
 d.contentPacks=[...(d.contentPacks||[]),equipmentPackId];return validateDoc(d);
}
