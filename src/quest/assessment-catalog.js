export const assessmentCategories=['몸통·골반','견갑골·어깨','팔꿈치·손목·그립','고관절','무릎','발목·발','공통 수행·패턴','도구·지지 조건','사용자 항목'];
const defaults={};
function assign(ids,category,family,application){for(const id of ids.split(' '))defaults[id]={category,family,application};}
assign('Q001 Q008','몸통·골반','척추·머리 정렬','운동에 맞춰 정한 척추와 머리 자세를 평가합니다.');
assign('Q002 Q003 Q004','몸통·골반','몸통 안정·브레이싱','호흡과 정한 몸통 자세를 함께 확인합니다.');
assign('Q005 Q038 Q039','몸통·골반','골반 자세·안정','양발·한발 지지 등 해당 운동의 지지 조건에서 확인합니다.');
assign('Q006 Q007','몸통·골반','몸통 회전·측굴 조절','몸통 움직임을 억제하는 것이 목표인 운동에서 적용합니다.');
assign('Q009 Q010 Q011 Q012 Q013','견갑골·어깨','견갑골 움직임 조절','후인·하강·전인·상방회전은 서로 다른 움직임입니다. 운동과 가동범위에 필요한 항목을 선택하며 한 자세로 고정하지 않습니다.');
assign('Q014 Q015','견갑골·어깨','어깨 회전','운동에 필요한 위팔 회전과 통제 가능한 범위에서 확인합니다.');
assign('Q016 Q017 Q018','견갑골·어깨','팔 올리기·내리기','개인별로 정한 범위에서 어깨와 몸통의 움직임을 확인합니다.');
assign('Q019 Q020','견갑골·어깨','팔 모으기·벌리기','가슴 앞에서 모으거나 벌리는 해당 움직임에 적용합니다.');
assign('Q021 P-arm-angle','팔꿈치·손목·그립','팔꿈치 각도 유지','플라이·스트레이트 암 계열처럼 팔꿈치 각도를 유지하는 운동에 적용합니다. 굽히고 펴는 운동에는 일괄 적용하지 않습니다.');
assign('Q022 P-curl','팔꿈치·손목·그립','팔꿈치 굴곡 조절','컬 등 팔꿈치를 굽히는 운동에서 확인합니다.');
assign('Q023 P-elbow-extend','팔꿈치·손목·그립','팔꿈치 신전 조절','팔꿈치를 펴는 운동에서 위팔 위치와 복귀 과정을 확인합니다.');
assign('Q024 Q025 P-press','팔꿈치·손목·그립','팔꿈치 궤적·손목 정렬','운동 각도와 저항 방향에 맞춘 정렬을 확인합니다.');
assign('Q026 Q027 Q028 Q029 Q030','팔꿈치·손목·그립','그립 방향·너비·압력','회내·회외·중립 그립을 구분하며 사용하는 손잡이에 맞춰 평가합니다.');
assign('Q031 Q032 P-hip-extend','고관절','고관절 굴곡·신전','골반과 몸통을 유지할 수 있는 범위에서 고관절 움직임을 확인합니다.');
assign('Q033 P-hinge','고관절','힙 힌지','고관절에서 접는 원리와 동작 중 몸통 자세 유지를 구분해 평가합니다.');
assign('Q034 Q035 P-abduct P-adduct','고관절','고관절 벌림·모음','외전과 내전은 같은 묶음에서 각각 평가합니다.');
assign('Q036 Q037','고관절','고관절 회전','필요한 운동에서 허벅지의 내회전·외회전을 구분해 확인합니다.');
assign('Q040 P-legcurl','무릎','무릎 굴곡 조절','레그 컬 등 무릎 굴곡 운동에서 지지 자세를 확인합니다.');
assign('Q041 Q043 P-knee-extend','무릎','무릎 신전 조절','무릎을 펴는 능력과 끝 범위의 조절을 구분합니다.');
assign('Q042','무릎','발·무릎 방향 정렬','스쿼트·런지 등에서 정한 발 방향에 맞춘 무릎 움직임을 확인합니다.');
assign('Q044 Q045 P-calf','발목·발','발목 움직임 조절','배측굴곡·저측굴곡과 저항을 조절하며 돌아오는 수행을 구분합니다.');
assign('Q046 Q047 Q049','발목·발','발 지지·아치','뒤꿈치 지지가 필요한 운동 등 해당 지지 조건에 맞춰 선택합니다.');
assign('Q050 Q051 Q052 Q053 Q054 Q055','공통 수행·패턴','체중 분배·균형','양발·한발·분할 자세의 차이에 맞춰 필요한 항목을 선택합니다.');
assign('Q056 Q057','공통 수행·패턴','자세 만들기·유지하기','처음 자세를 만드는 것과 반복 중 유지하는 것을 각각 확인합니다.');
assign('Q058 Q059 P-shoulder-range','공통 수행·패턴','설정 범위·끝 범위 조절','최대 범위를 일괄 요구하지 않습니다. 수행 평가 항목은 숄더 프레스의 몸통·등받이 조건에 적용합니다.');
assign('Q060 Q061 Q062','공통 수행·패턴','수축·이완·정지 조절','저항에 따라 수축 구간과 이완 구간을 구분합니다.');
assign('Q063 Q064 Q065 P-raise','공통 수행·패턴','궤적·템포·반동 조절','수행 평가 항목은 레이즈 수행, 기초 항목은 필요한 운동에서 선택합니다.');
assign('Q066 Q067 P-pushup','공통 수행·패턴','밀기 패턴','수평·수직 밀기를 구분합니다. 수행 평가 항목은 푸시업 수행에 적용합니다.');
assign('Q068 Q069 P-row P-pulldown','공통 수행·패턴','당기기 패턴','수평·수직 당기기의 차이에 맞춰 선택합니다.');
assign('Q070 P-squat','공통 수행·패턴','스쿼트 패턴','개인별로 정한 깊이와 발 지지를 확인합니다.');
assign('Q072 P-lunge P-split P-step','공통 수행·패턴','런지·편측 패턴','이동·분할 자세·스텝의 추가 조건을 구분해 평가합니다.');
assign('P-barbell P-dumbbell','도구·지지 조건','중량을 받치는 팔 조절','바벨의 연결된 양손과 덤벨의 독립적인 양팔을 각각 평가합니다.');
assign('P-bent-support P-legpress','도구·지지 조건','몸통·골반 지지','벤트오버의 자체 지지와 레그 프레스의 등받이 지지는 각각 다른 조건입니다.');
export function assessmentMeta(c){const base=defaults[c.id]||{category:'사용자 항목',family:'직접 등록한 항목',application:''};return {category:assessmentCategories.includes(c.category)?c.category:base.category,family:c.family?.trim()||base.family,application:c.application??base.application,type:c.id.startsWith('Q')?'기초 능력':c.id.startsWith('P-')?'수행 평가':'사용자 등록'};}
export function groupedAssessments(library,{category='',search=''}={}){
 const query=search.trim().toLocaleLowerCase();return assessmentCategories.filter(name=>!category||name===category).map(name=>{
  const families=new Map();for(const c of library){const m=assessmentMeta(c);if(m.category!==name||query&&![c.label,c.description,m.family,m.application].join(' ').toLocaleLowerCase().includes(query))continue;if(!families.has(m.family))families.set(m.family,[]);families.get(m.family).push(c)}
  return {name,count:[...families.values()].flat().length,families:[...families].map(([name,items])=>({name,items}))};
 }).filter(g=>g.count);
}
