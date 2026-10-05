import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {applyPracticeCurriculum} from '../src/quest/practice-curriculum.js';
const seed=JSON.parse(fs.readFileSync(new URL('../src/quest/offline-seed.json',import.meta.url)));
test('practice migration preserves tree and learner history without carrying achievement into new conditions',()=>{
 const before=structuredClone(seed);delete before.quest.practiceVersion; before.quest.library=before.quest.library.filter(c=>!c.id.startsWith("P-")); before.quest.bindings={"push::단일관절::플라이":["Q021"]};
 before.quest.members[0].records['push::단일관절::플라이']={checks:{Q021:{done:true}},note:'사용자 메모',achievedAt:'2026-10-01',firstAchievedAt:'2026-10-01',history:[]};
 const after=applyPracticeCurriculum(before);
 assert.deepEqual(after.nodes,before.nodes);assert.deepEqual(after.links,before.links);
 const record=after.quest.members[0].records['push::단일관절::플라이'];assert.equal(record.note,'사용자 메모');assert(record.checks.Q021.done);assert.equal(record.achievedAt,null);
 assert.deepEqual(after.quest.curriculumHistory.at(-1).members,before.quest.members);
 assert.deepEqual(applyPracticeCurriculum(after),after);
});
test('practice conditions are sparse and include distinct barbell and dumbbell skills',()=>{
 const d=applyPracticeCurriculum(seed),b=d.quest.bindings;
 for(const id of ['upper','lower','push','pull','squat','hinge','lunge'])assert(!b[id]);
 for(const ids of Object.values(b))assert(ids.length<=2);
 assert(Object.values(b).flat().length<=46);
 const bar=b['basic::숄더 프레스::tool::바벨'],db=b['basic::숄더 프레스::tool::덤벨'];assert(bar&&db);assert.notDeepEqual(bar,db);
 for(const ids of Object.values(b))assert(!ids.includes('Q012'));
});


 test('practice attachments reference existing nodes and never repeat along ancestry',()=>{
 const d=applyPracticeCurriculum(seed),ids=new Set(d.quest.library.map(c=>c.id));
 for(const [id,items] of Object.entries(d.quest.bindings)){
  let n=d.nodes.find(x=>x.id===id);assert(n);const seen=new Set();
  while(n){for(const cid of d.quest.bindings[n.id]||[]){assert(ids.has(cid));assert(!seen.has(cid));seen.add(cid)}n=d.nodes.find(x=>x.id===n.parent)}
 }
 });
