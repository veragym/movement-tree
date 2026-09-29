// Only exercise names are inputs. No source hierarchy or source design is read.
import fs from 'node:fs';
const inputs=JSON.parse(fs.readFileSync(new URL('../public/exercises.json',import.meta.url)));
const images=JSON.parse(fs.readFileSync(new URL('../public/images.json',import.meta.url)));
const rows=[];
function add(source,group,tool,image='',name=null){rows.push({source,group,tool,image,name:name||inputs.find(x=>x.id===source)?.name});}
add('chest_press','press','머신','체스트 프레스 (핀)');
add('push_up','press','맨몸','푸시업스');
add('incline_chest_press','press','바벨','바벨 인클라인 벤치 프레스');
add('decline_chest_press','press','바벨','바벨 디클라인 벤치 프레스');
add('shoulder_press','press','덤벨','덤벨 시티드 숄더 프레스');
add('dip','press','맨몸');
add('chest_fly','fly','덤벨','덤벨 플라이');
add('incline_fly','fly','덤벨','덤벨 인클라인 플라이');
add('low_to_high_fly','fly','케이블');
add('high_to_low_fly','fly','케이블');
add('front_raise','raise','덤벨','덤벨 프론트 레이즈');
add('lateral_raise','raise','덤벨','덤벨 스탠딩 래터럴 레이즈');
add('triceps_pushdown','extension','케이블','케이블 푸시다운');
add('overhead_triceps_extension','extension','덤벨','덤벨 스탠딩 트라이셉스 익스텐션');
add('triceps_kickback','extension','덤벨','덤벨 킥백');
add('seated_row','row','머신','시티드 로우 (핀)');
add('bent_over_row','row','바벨','바벨 벤트 오버 로우');
add('high_row','row','케이블','케이블 싱글 암 하이 로우','원 암 하이 로우');
add('low_row','row','머신');
add('lat_pulldown','pulldown','케이블','케이블 와이드 그립 랫 풀다운');
add('pull_up','pullup','맨몸','풀 업');
add('chin_up','pullup','맨몸','친 업');
add('straight_arm_pulldown','straight','케이블','케이블 스트레이트 암 풀다운');
add('pullover','straight','덤벨','덤벨 풀오버');
add('rear_delt_fly','rear','덤벨','덤벨 리어 델트 플라이');
add('biceps_curl','curl','덤벨','덤벨 바이셉스 컬');
add('hammer_curl','curl','덤벨','덤벨 해머 컬');
add('reverse_curl','curl','바벨','바벨 리버스 컬');
add('squat_basic','squat','맨몸','스쿼트');
add('front_squat','squat','바벨','바벨 프런트 스쿼트');
add('back_squat','squat','바벨','바벨 하이 바 스쿼트');
add('sumo_squat','squat','덤벨','덤벨 스모 스쿼트');
add('leg_press','squat','머신','시티드 레그 프레스 (핀)');
add('leg_extension','squatSupport','머신','레그 익스텐션 (핀)');
add('hip_adduction','hingeSupport','케이블','케이블 힙 어덕션');
add('deadlift','deadlift','바벨','바벨 데드리프트','컨벤셔널 데드리프트');
add('romanian_deadlift','deadlift','바벨','바벨 루마니안 데드리프트');
add('stiff_leg_deadlift','deadlift','바벨','바벨 스티프 레그 데드리프트');
add('sumo_deadlift','deadlift','바벨','바벨 스모 데드리프트');
add('hip_thrust','bridge','바벨','바벨 힙 쓰러스트');
add('glute_bridge','bridge','바벨','바벨 글루트 브릿지');
add('back_extension','hipExtension','로만 체어','45 디그리 백 익스텐션');
add('good_morning','hipExtension','바벨','바벨 굿 모닝');
add('leg_curl','hingeSupport','머신','시티드 레그 컬 (핀)');
add('glute_kickback','hipExtension','케이블','케이블 동키 킥백');
add('hip_abduction','hingeSupport','밴드','밴드 힙 어브덕션');
add('forward_lunge','lunge','맨몸','포워드 런지');
add('reverse_lunge','lunge','덤벨','덤벨 리어 런지');
add('walking_lunge','lunge','덤벨','덤벨 워킹 런지');
add('side_lunge','lunge','덤벨','덤벨 사이드 런지');
add('curtsy_lunge','lunge','바벨','바벨 커트시 런지','커트시 런지');
add('split_squat','lunge','맨몸','스플릿 스쿼트');
add('bulgarian_split_squat','lunge','맨몸','불가리안 스플릿 스쿼트');
add('step_up','lunge','맨몸','스텝 업');
add('step_down','lunge','맨몸');
add('single_leg_squat','squat','맨몸','','싱글 레그 스쿼트');
add('pistol_squat','squat','맨몸');
// Conversation additions and clear examples of equipment expansion.
add('goblet_squat','squat','덤벨','덤벨 고블렛 스쿼트','고블릿 스쿼트');
add('hack_squat','squat','머신','핵 스쿼트 (플레이트)','핵 스쿼트');
add('calf_raise','squatSupport','덤벨','덤벨 스탠딩 카프 레이즈','스탠딩 카프 레이즈');
add('lying_triceps_extension','extension','덤벨','덤벨 라잉 트라이셉스 익스텐션','라잉 트라이셉스 익스텐션');
add('hip_extension','hipExtension','케이블','케이블 스탠딩 힙 익스텐션','스탠딩 힙 익스텐션');
add('db_row','row','덤벨','덤벨 벤트 오버 로우','벤트오버 로우');
add('cable_row','row','케이블','케이블 시티드 로우','시티드 로우');
add('bb_chest_press','press','바벨','바벨 벤치 프레스','체스트 프레스');
add('db_chest_press','press','덤벨','덤벨 벤치 프레스','체스트 프레스');
add('machine_shoulder_press','press','머신','숄더 프레스 (플레이트)','숄더 프레스');
const groups=[
 ['upper','상체',null],['lower','하체',null],['push','밀기','upper'],['pull','당기기','upper'],
 ['squat','스쿼트','lower'],['hinge','힌지','lower'],['lunge','런지','lower'],
 ['press','프레스','push'],['fly','플라이','push'],['raise','레이즈','push','related'],['extension','팔꿈치 펴기','push','related'],
 ['row','로우','pull'],['pulldown','풀다운','pull'],['pullup','풀업·친업','pull'],['straight','스트레이트 암 풀','pull'],['rear','리어 델트 플라이','pull','related'],['curl','컬','pull','related'],
 ['deadlift','데드리프트','hinge'],['bridge','브리지·힙 쓰러스트','hinge'],['hipExtension','고관절 펴기','hinge'],
 ['squatSupport','관련 보조운동','squat','related'],['hingeSupport','관련 보조운동','hinge','related']
];
const notes={press:'팔을 뻗어 미는 움직임을 익힌 뒤, 도구와 몸의 각도를 바꿉니다.',row:'팔꿈치가 몸통 뒤쪽으로 이동하는 당기기 계열입니다. 도구마다 몸통 지지와 저항 방향을 따로 확인합니다.',pulldown:'위쪽에서 오는 저항을 아래로 당기는 움직임입니다.',squat:'무릎과 고관절을 함께 굽혔다 펴는 움직임을 익힙니다.',hinge:'고관절을 중심으로 몸통과 골반의 움직임을 익힙니다.',lunge:'발의 앞뒤·좌우 배치와 이동 방식에 따라 확장합니다.',squatSupport:'스쿼트의 종류가 아니라 관련 부위의 보조운동입니다.',hingeSupport:'힌지의 종류가 아니라 관련 부위의 보조운동입니다.',raise:'레이즈는 프레스와 다른 어깨 보조 움직임입니다. 옆으로 들기는 별도의 움직임으로 배웁니다.',rear:'등 운동과 함께 설명하는 어깨 보조 움직임입니다.'};
const nodes=[];
const node=(id,label,parent,kind='branch')=>({id,label,parent,kind,images:[],meanings:[],fields:[],show:{image:true,path:true,meanings:true}});
for(const [id,label,parent,relation] of groups){let n=node(id,label,parent);if(relation)n.relation=relation;if(notes[id])n.fields=[{id:id+'-concept',title:'먼저 배우는 공통점',body:notes[id],visible:true}];nodes.push(n)}
const toolIds={'머신':'machine','케이블':'cable','덤벨':'dumbbell','바벨':'barbell'};
const toolNotes={'머신':'좌석·패드·손잡이 위치와 기구의 이동 경로를 확인합니다.','케이블':'도르래 높이와 손잡이에 따라 저항이 오는 방향이 달라집니다.','덤벨':'양손을 각각 움직이며 도구와 몸통을 스스로 안정시킵니다.','바벨':'두 손이 하나의 바를 공유합니다. 그립과 바의 이동 경로를 확인합니다.','맨몸':'손과 발의 지지 위치, 몸의 각도에 따라 부담이 달라집니다.','밴드':'고정 위치와 늘어난 길이에 따라 저항이 달라집니다.','로만 체어':'패드 높이와 발 지지를 확인합니다.'};
const dictionary={
 '로우 투 하이':'아래에서 위로 향하는 경로','하이 투 로우':'위에서 아래로 향하는 경로','스티프 레그':'무릎 굽힘을 작게 유지하는 자세','스트레이트 암':'팔꿈치 각도를 비교적 일정하게 유지하는 방식','싱글 레그':'한 다리를 중심으로 수행','불가리안':'뒷발을 높은 지지대에 둔 스플릿 자세','컨벤셔널':'일반적인 데드리프트 방식','루마니안':'고관절을 뒤로 보내는 데드리프트 변형','인클라인':'등받이·벤치를 위쪽으로 기울인 각도','디클라인':'등받이·벤치를 아래쪽으로 기울인 각도','벤트오버':'몸통을 앞으로 기울인 자세','오버헤드':'머리 위에 팔을 둔 위치','트라이셉스':'상완삼두근','바이셉스':'상완이두근','리어 델트':'어깨 뒤쪽','체스트':'가슴','숄더':'어깨','래터럴':'옆쪽','프론트':'앞쪽 / 스쿼트에서는 중량의 앞쪽 위치','백':'뒤쪽 / 스쿼트에서는 중량의 뒤쪽 위치','고블릿':'중량을 가슴 앞에 받쳐 드는 방식','핵':'등받이·레일을 사용하는 스쿼트 변형','시티드':'앉은 자세','스탠딩':'선 자세','라잉':'누운 자세','스모':'발을 넓게 벌린 자세','힙':'엉덩이·고관절','글루트':'둔근','레그':'다리','카프':'종아리','포워드':'앞쪽으로 이동','리버스':'반대 방향 / 런지에서는 뒤로 이동','워킹':'걸으며 이동','사이드':'옆쪽','커트시':'뒤쪽으로 교차하는 발 배치','스플릿':'두 발을 앞뒤로 나눈 자세','피스톨':'한쪽 다리를 앞으로 뻗는 한 발 스쿼트','해머':'손바닥이 서로 마주보는 그립','원 암':'한 팔','하이':'높은 위치','로우':'당겨 모으는 움직임','프레스':'저항을 밀어 내는 움직임','플라이':'팔을 벌리거나 모으는 움직임','레이즈':'들어 올리는 움직임','푸시다운':'아래쪽으로 밀어 내리는 움직임','풀다운':'아래쪽으로 당기는 움직임','풀업':'매달린 몸을 끌어올리는 움직임','친업':'보통 손바닥을 몸쪽으로 둔 풀업','푸시업':'손으로 바닥을 밀어 몸을 올리는 움직임','딥스':'팔로 몸을 지지하며 몸을 내렸다 미는 움직임','풀오버':'팔을 머리 위쪽에서 몸통 쪽으로 가져오는 움직임','익스텐션':'관절을 펴는 움직임','컬':'관절을 굽히는 움직임','킥백':'팔이나 다리를 뒤로 보내는 움직임','스쿼트':'앉았다 일어서는 움직임','데드리프트':'고관절·무릎을 펴며 중량을 드는 움직임','쓰러스트':'골반을 들어 올리는 움직임','브리지':'몸을 지지하고 골반을 들어 올리는 움직임','어덕션':'몸의 중심 쪽으로 모으기','어브덕션':'몸의 중심에서 멀어지게 벌리기','런지':'두 다리의 위치를 나누어 몸을 낮추고 올리기','스텝업':'높은 지지대로 올라가기','스텝다운':'높은 지지대에서 내려가기','굿모닝':'상체를 숙였다 세우는 고관절 중심 움직임'};
function meanings(name,tool,id){let found=[],remaining=name;for(const word of Object.keys(dictionary).sort((a,b)=>b.length-a.length)){if(remaining.includes(word)){found.push({word,meaning:dictionary[word],position:name.indexOf(word)});remaining=remaining.replace(word,'')}}found.sort((a,b)=>a.position-b.position);return [{id:id+'-tool',word:tool,meaning:'이 예시에서 사용하는 도구·지지 방식'},...found.map(({word,meaning},i)=>({id:id+'-m'+i,word,meaning}))];}
for(const r of rows){
 let toolId=r.group==='row'&&toolIds[r.tool]?toolIds[r.tool]:`pack-tool-${r.group}-${r.tool}`;
 if(!nodes.some(n=>n.id===toolId)){let t=node(toolId,r.tool,r.group);t.fields=[{id:toolId+'-difference',title:'이번에 달라지는 점',body:toolNotes[r.tool],visible:true}];nodes.push(t)}
 let n=node('pack-ex-'+r.source,r.tool+' '+r.name,toolId,'exercise');n.sourceExerciseId=r.source;n.aliases=[inputs.find(x=>x.id===r.source)?.name,r.name].filter(Boolean);n.meanings=meanings(r.name,r.tool,n.id);
 if(r.image){const im=images.find(x=>x.name===r.image);if(!im)throw Error('Missing image: '+r.image);n.images=[{id:n.id+'-image',url:im.url,alt:im.name}];}
 if(r.source==='low_row')n.meanings=[{id:n.id+'-a',word:'머신',meaning:'도구'},{id:n.id+'-b',word:'로우 (low)',meaning:'낮은 위치'},{id:n.id+'-c',word:'로우 (row)',meaning:'당겨 모으는 움직임'}];
 if(r.source==='deadlift')n.fields=[{id:n.id+'-hybrid',title:'함께 알아두기',body:'고관절과 무릎의 움직임이 함께 나타나는 패턴입니다.',visible:false}];
 nodes.push(n);
}
for(const source of inputs)if(!rows.some(r=>r.source===source.id))throw Error('Missing exercise '+source.id);
fs.writeFileSync(new URL('../src/content-pack.json',import.meta.url),JSON.stringify({id:'conversation-2026-09',nodes},null,2));
console.log(JSON.stringify({exercises:rows.length,images:rows.filter(r=>r.image).length,branches:nodes.length-rows.length,inputNames:inputs.length}));

