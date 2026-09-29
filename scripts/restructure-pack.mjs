import fs from 'node:fs';
const old=JSON.parse(fs.readFileSync(new URL('../src/legacy-content-pack.json',import.meta.url)));
const nodes=[];const make=(id,label,parent,level)=>{let n={id,label,parent,kind:'branch',level,images:[],meanings:[],fields:[],show:{image:true,path:true,meanings:true}};nodes.push(n);return n};
make('upper','상체',null,'region');make('lower','하체',null,'region');
for(const [id,label,parent] of [['push','밀기','upper'],['pull','당기기','upper'],['squat','스쿼트','lower'],['hinge','힌지','lower'],['lunge','런지','lower']])make(id,label,parent,'pattern');
const definitions=[
['push','복합관절','프레스','수평','체스트 프레스|푸시업'],
['push','복합관절','프레스','상향 사선','인클라인 체스트 프레스'],
['push','복합관절','프레스','하향 사선','디클라인 체스트 프레스'],
['push','복합관절','프레스','수직','숄더 프레스'],
['push','복합관절','프레스','하향','딥스'],
['push','단일관절','플라이','수평','체스트 플라이'],
['push','단일관절','플라이','상향 사선','인클라인 플라이|로우 투 하이 플라이'],
['push','단일관절','플라이','하향 사선','하이 투 로우 플라이'],
['push','단일관절','레이즈','전방','프론트 레이즈'],
['push','단일관절','레이즈','측방','래터럴 레이즈'],
['push','단일관절','팔꿈치 신전','하향','트라이셉스 푸시다운'],
['push','단일관절','팔꿈치 신전','상향','오버헤드 트라이셉스 익스텐션'],
['push','단일관절','팔꿈치 신전','후방','트라이셉스 킥백'],
['pull','복합관절','로우','수평','시티드 로우|벤트오버 로우'],
['pull','복합관절','로우','상향 사선','하이 로우'],
['pull','복합관절','로우','하향 사선','로우 로우'],
['pull','복합관절','풀','수직 하향','랫 풀다운'],
['pull','복합관절','풀','수직 상향','풀업|친업'],
['pull','단일관절','어깨 신전','상향 → 하향','스트레이트 암 풀다운|풀오버'],
['pull','단일관절','후면 어깨 벌림','수평','리어 델트 플라이|리버스 플라이'],
['pull','단일관절','팔꿈치 굴곡','일반','바이셉스 컬'],
['pull','단일관절','팔꿈치 굴곡','중립 그립','해머 컬'],
['pull','단일관절','팔꿈치 굴곡','회내 그립','리버스 컬'],
['squat','복합관절','스쿼트','양측','스쿼트'],
['squat','복합관절','스쿼트','전방 부하','프론트 스쿼트'],
['squat','복합관절','스쿼트','후방 부하','백 스쿼트'],
['squat','복합관절','스쿼트','넓은 스탠스','스모 스쿼트'],
['squat','복합관절','프레스','양측','레그 프레스'],
['squat','복합관절','스쿼트 머신 패턴','수직','핵 스쿼트|V 스쿼트'],
['squat','단일관절','무릎 신전','전방','레그 익스텐션'],
['squat','단일관절','고관절 내전','내측','힙 어덕션'],
['hinge','복합관절','데드리프트','일반','데드리프트'],
['hinge','복합관절','데드리프트','무릎 굴곡 적음','루마니안 데드리프트|스티프 레그 데드리프트'],
['hinge','복합관절','데드리프트','넓은 스탠스','스모 데드리프트'],
['hinge','복합관절','힙 익스텐션','수평','힙 쓰러스트|글루트 브리지'],
['hinge','복합관절','힙 익스텐션','몸통 고정 / 고관절 신전','백 익스텐션'],
['hinge','복합관절','굿모닝 패턴','전후','굿모닝'],
['hinge','단일관절','무릎 굴곡','앉은 자세','시티드 레그 컬'],
['hinge','단일관절','무릎 굴곡','누운 자세','라잉 레그 컬'],
['hinge','단일관절','무릎 굴곡','선 자세','스탠딩 레그 컬'],
['hinge','단일관절','고관절 신전','후방','힙 익스텐션|글루트 킥백'],
['hinge','단일관절','고관절 외전','측방','힙 어브덕션|아웃 타이'],
['lunge','복합관절','런지','전방','포워드 런지'],
['lunge','복합관절','런지','후방','리버스 런지'],
['lunge','복합관절','런지','연속 전방','워킹 런지'],
['lunge','복합관절','런지','측방','사이드 런지'],
['lunge','복합관절','런지','대각선','커시 런지'],
['lunge','복합관절','스플릿 스쿼트','고정 자세','스플릿 스쿼트'],
['lunge','복합관절','스플릿 스쿼트','후방 다리 거상','불가리안 스플릿 스쿼트'],
['lunge','복합관절','스텝','상향','스텝업'],
['lunge','복합관절','스텝','하향','스텝다운'],
['lunge','복합관절','싱글 레그 Squat','한쪽 지지','싱글 레그 스쿼트|피스톨 스쿼트']
];
const basicMap={};
for(const [pattern,joint,group,form,names] of definitions){let parent=pattern;for(const [level,label] of [['joint',joint],['movement',group],['form',form]]){let id=parent+'::'+label;let n=nodes.find(n=>n.id===id)||make(id,label,parent,level);if(joint==='단일관절'&&['squat','hinge'].includes(pattern)&&level==='joint'){n.relation='related';n.fields=[{id:id+'-note',title:'관련 보조운동',body:'이 패턴 자체의 변형이 아니라 관련 부위의 보조운동을 함께 찾아보기 위한 분류입니다.',visible:true}]}parent=id;}for(const name of names.split('|')){let n=make('basic::'+name,name,parent,'basic');basicMap[name]=n;}}
const aliases={'컨벤셔널 데드리프트':'데드리프트','레그 컬':'시티드 레그 컬','커트시 런지':'커시 런지','원 암 하이 로우':'하이 로우','스탠딩 힙 익스텐션':'힙 익스텐션','고블릿 스쿼트':'스쿼트'};
const legacyMap={upper:'upper',lower:'lower',push:'push',pull:'pull',squat:'squat',hinge:'hinge',lunge:'lunge'};
for(const src of old.nodes.filter(n=>n.kind==='exercise')){
 const oldTool=old.nodes.find(n=>n.id===src.parent),tool=oldTool.label;
 const baseName=src.label.slice(tool.length+1);let base=basicMap[aliases[baseName]||baseName];if(!base)continue;
 let id=base.id+'::tool::'+tool;if(!nodes.some(n=>n.id===id)){let t=make(id,tool,base.id,'tool');t.fields=structuredClone(oldTool.fields)}
 const n={...structuredClone(src),parent:id,level:'variant',images:[]};delete n.aliases;nodes.push(n);legacyMap[src.id]=n.id;
 if(!base.meanings.length)base.meanings=structuredClone(src.meanings.filter(m=>!m.id.endsWith('-tool')));
}
// Missing variants use names only; all images are deliberately blank.
for(const [name,tool] of [['리버스 플라이','덤벨'],['V 스쿼트','머신'],['라잉 레그 컬','머신'],['스탠딩 레그 컬','케이블'],['아웃 타이','머신']]){if(!basicMap[name])continue;let b=basicMap[name],t=make(b.id+'::tool::'+tool,tool,b.id,'tool'),v=make(b.id+'::variant',tool+' '+name,t.id,'variant');v.kind='exercise';}
for(const [oldId,label] of [['press','프레스'],['row','로우'],['pulldown','랫 풀다운'],['fly','플라이'],['raise','레이즈'],['extension','팔꿈치 신전'],['curl','팔꿈치 굴곡'],['deadlift','데드리프트'],['rear','후면 어깨 벌림'],['straight','어깨 신전']]){let n=nodes.find(n=>n.label===label&&['movement','basic'].includes(n.level));if(n)legacyMap[oldId]=n.id;}
fs.writeFileSync(new URL('../src/content-pack.json',import.meta.url),JSON.stringify({id:'conversation-structure-v2-images-reset',nodes,legacyMap},null,2));
console.log(JSON.stringify({basics:Object.keys(basicMap).length,variants:nodes.filter(n=>n.kind==='exercise').length,nodes:nodes.length}));

