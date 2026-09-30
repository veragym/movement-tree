export const englishPackId='exercise-english-v5';
const pairs=`체스트 프레스|Chest Press
푸시업|Push-Up
인클라인 체스트 프레스|Incline Chest Press
디클라인 체스트 프레스|Decline Chest Press
숄더 프레스|Shoulder Press
딥스|Dips
체스트 플라이|Chest Fly
인클라인 플라이|Incline Fly
로우 투 하이 플라이|Low-to-High Fly
하이 투 로우 플라이|High-to-Low Fly
프론트 레이즈|Front Raise
래터럴 레이즈|Lateral Raise
트라이셉스 푸시다운|Triceps Pushdown
오버헤드 트라이셉스 익스텐션|Overhead Triceps Extension
트라이셉스 킥백|Triceps Kickback
시티드 로우|Seated Row
벤트오버 로우|Bent-Over Row
하이 로우|High Row
원 암 하이 로우|Single-Arm High Row
로우 로우|Low Row
랫 풀다운|Lat Pulldown
풀업|Pull-Up
친업|Chin-Up
스트레이트 암 풀다운|Straight-Arm Pulldown
풀오버|Pullover
리어 델트 플라이|Rear Delt Fly
리버스 플라이|Reverse Fly
바이셉스 컬|Biceps Curl
해머 컬|Hammer Curl
리버스 컬|Reverse Curl
스쿼트|Squat
프론트 스쿼트|Front Squat
백 스쿼트|Back Squat
스모 스쿼트|Sumo Squat
고블릿 스쿼트|Goblet Squat
레그 프레스|Leg Press
핵 스쿼트|Hack Squat
V 스쿼트|V-Squat
레그 익스텐션|Leg Extension
힙 어덕션|Hip Adduction
컨벤셔널 데드리프트|Conventional Deadlift
데드리프트|Deadlift
루마니안 데드리프트|Romanian Deadlift
스티프 레그 데드리프트|Stiff-Leg Deadlift
스모 데드리프트|Sumo Deadlift
힙 쓰러스트|Hip Thrust
글루트 브리지|Glute Bridge
백 익스텐션(고관절 중심)|Back Extension (Hip-Dominant)
백 익스텐션|Back Extension
굿모닝|Good Morning
레그 컬|Leg Curl
시티드 레그 컬|Seated Leg Curl
라잉 레그 컬|Lying Leg Curl
스탠딩 레그 컬|Standing Leg Curl
스탠딩 힙 익스텐션|Standing Hip Extension
글루트 킥백|Glute Kickback
힙 어브덕션|Hip Abduction
포워드 런지|Forward Lunge
리버스 런지|Reverse Lunge
워킹 런지|Walking Lunge
사이드 런지|Side Lunge
커트시 런지|Curtsy Lunge
스플릿 스쿼트|Split Squat
불가리안 스플릿 스쿼트|Bulgarian Split Squat
스텝업|Step-Up
스텝다운|Step-Down
싱글 레그 스쿼트|Single-Leg Squat
피스톨 스쿼트|Pistol Squat
스탠딩 카프 레이즈|Standing Calf Raise
시티드 카프 레이즈|Seated Calf Raise
프레스|Press
플라이|Fly
레이즈|Raise
로우|Row
풀|Pull
런지|Lunge
굿모닝 패턴|Good Morning`;
const names=Object.fromEntries(pairs.split('\n').map(s=>s.split('|')));
const tools={'머신':'Machine','덤벨':'Dumbbell','바벨':'Barbell','케이블':'Cable','맨몸':'Bodyweight','밴드':'Band','로만 체어':'Roman Chair'};
export function applyEnglishNames(document){
 if(document.contentPacks?.includes(englishPackId))return document;
 const d=structuredClone(document);
 for(const n of d.nodes){
  if(n.englishName?.trim())continue;
  // Exact known names only; explanatory branches and custom names are not guessed.
  if(!['basic','variant','movement'].includes(n.level)&&n.kind!=='exercise')continue;
  let english=names[n.label];
  if(!english)for(const [tool,en] of Object.entries(tools))if(n.label.startsWith(tool+' ')&&names[n.label.slice(tool.length+1)]){english=en+' '+names[n.label.slice(tool.length+1)];break;}
  if(english)n.englishName=english;
 }
 d.contentPacks=[...(d.contentPacks||[]),englishPackId];return d;
}
