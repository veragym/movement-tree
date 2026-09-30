import {item,validateDoc} from './model.js';
import baseline from './content-pack.json' with {type:'json'};
export const reviewId='lower-review-v3';
export function applyLowerReview(document){
 if(document.contentPacks?.includes(reviewId))return document;
 const d=structuredClone(document),get=id=>d.nodes.find(n=>n.id===id);
 const rename=(id,label)=>{const n=get(id),old=baseline.nodes.find(x=>x.id===id);if(n&&(!old||n.label===old.label))n.label=label;};
 const note=(id,body,title='분류 안내')=>{const n=get(id);if(n)n.fields.push({id:reviewId+'-'+id,title,body,visible:true});};
 const add=(id,label,parent,level,kind='branch')=>{if(!get(id))d.nodes.push({...item(id,label,parent,kind),level});return id;};
 const move=(id,parent)=>{if(get(id))get(id).parent=parent;};
 rename('lunge','런지·편측 계열');
 rename('squat::복합관절::스쿼트::양측','두 발 지지');
 note('squat::복합관절::스쿼트','부하 위치와 발 간격은 서로 다른 기준입니다. 프론트·백·스모 분류는 조합될 수 있습니다.');
 rename('squat::복합관절::스쿼트 머신 패턴::수직','기구 유도 경로');
 note('squat::복합관절::스쿼트 머신 패턴','핵·V 스쿼트의 이동 경로는 기구에 따라 사선이나 원호 형태일 수 있습니다.');
 rename('hinge::복합관절::데드리프트::일반','일반 스탠스');rename('basic::데드리프트','컨벤셔널 데드리프트');
 const hip=add('hinge::hip-dominant','고관절 중심','hinge','joint');
 note(hip,'고관절 움직임이 중심인 계열입니다. 단일·다관절 여부는 무릎과 척추의 실제 움직임에 따라 달라집니다.');
 const dead=add(hip+'::deadlift','데드리프트',hip,'movement');
 move('hinge::복합관절::데드리프트::무릎 굴곡 적음',dead);
 note('basic::루마니안 데드리프트','무릎을 약간 굽힌 상태로 고관절을 뒤로 보내며 내립니다. 일반적으로 선 자세에서 시작하고, 바닥 접촉보다 자세를 유지할 수 있는 범위를 기준으로 합니다.');
 note('basic::스티프 레그 데드리프트','루마니안보다 무릎을 더 편 형태로 사용되는 명칭입니다. 시작 위치와 가동 범위는 지도 방식마다 달라 실제 수행 조건을 함께 확인합니다.');
 const ext='hinge::복합관절::힙 익스텐션';move(ext,hip);rename(ext,'고관절 신전');rename(ext+'::수평','등 상부 지지');
 const floor=add(ext+'::floor','바닥 지지',ext,'form');move('basic::글루트 브리지',floor);
 rename(ext+'::몸통 고정 / 고관절 신전','척추 중립 유지·고관절 중심');rename('basic::백 익스텐션','백 익스텐션(고관절 중심)');
 note('basic::백 익스텐션','척추 중립을 유지하며 고관절을 접었다 펴는 수행을 뜻합니다. 척추를 굽혔다 펴는 변형은 별도의 척추 신전 동작으로 구분합니다.');
 move('hinge::복합관절::굿모닝 패턴',hip);rename('hinge::복합관절::굿모닝 패턴::전후','선 자세·상체 숙였다 세우기');
 const single='hinge::단일관절::고관절 신전';rename(single+'::후방','선 자세·다리 뒤로 보내기');rename('basic::힙 익스텐션','스탠딩 힙 익스텐션');
 const kick=add(single+'::posture','자세별 변형',single,'form');move('basic::글루트 킥백',kick);
 note('basic::글루트 킥백','선 자세의 킥백은 스탠딩 힙 익스텐션과 겹치는 이름입니다. 엎드리거나 네 발로 지지하는 변형도 있어 이미지와 실제 자세를 확인합니다.');
 const alias=get('basic::아웃 타이'),canonical=get('basic::힙 어브덕션');
 if(alias&&canonical){
  for(const key of ['images','fields','meanings'])canonical[key].push(...alias[key].filter(v=>!canonical[key].some(x=>JSON.stringify(x)===JSON.stringify(v))));
  for(const n of d.nodes)if(n.parent===alias.id)n.parent=canonical.id;
  for(const link of d.links){if(link.source===alias.id)link.source=canonical.id;if(link.target===alias.id)link.target=canonical.id;}
  d.links=d.links.filter(l=>l.source!==l.target);d.nodes=d.nodes.filter(n=>n.id!==alias.id);note(canonical,'아웃 타이는 힙 어브덕션 머신 운동에 쓰이는 별칭입니다.','다른 이름');
 }
 rename('basic::아웃 타이::variant','머신 힙 어브덕션');
 for(const [old,label] of [['연속 전방','전진 이동'],['대각선','후방 교차']])rename('lunge::복합관절::런지::'+old,label);
 rename('basic::커시 런지','커트시 런지');rename('lunge::복합관절::스플릿 스쿼트::고정 자세','발 위치 고정');rename('lunge::복합관절::스플릿 스쿼트::후방 다리 거상','뒷발 높임');
 note('lunge','런지뿐 아니라 스플릿 스쿼트·스텝·싱글 레그 스쿼트를 함께 찾는 편측 운동 계열입니다.');
 const calf=add('squat::단일관절::ankle','발목 저측굴곡','squat::단일관절','movement');note(calf,'발목을 펴며 뒤꿈치를 들어 올리는 관련 보조운동입니다. 스쿼트의 한 종류는 아닙니다.');
 for(const [posture,name] of [['선 자세','스탠딩'],['앉은 자세','시티드']]){
  const form=add(calf+'::'+posture,posture,calf,'form'),basic=add('basic::'+name+' 카프 레이즈',name+' 카프 레이즈',form,'basic'),tool=add(basic+'::tool::머신','머신',basic,'tool');add(basic+'::variant','머신 '+name+' 카프 레이즈',tool,'variant','exercise');
 }
 d.contentPacks=[...(d.contentPacks||[]),reviewId];return validateDoc(d);
}
