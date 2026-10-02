import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {pathTo} from '../src/model.js';
const pack=JSON.parse(fs.readFileSync(new URL('../docs/quest-curriculum/foundation72.json',import.meta.url)));
const doc=JSON.parse(fs.readFileSync(new URL('../src/quest/offline-seed.json',import.meta.url)));
test('all 72 source quests have a traced disposition and valid node targets',()=>{
 assert.equal(pack.audit.length,72);assert.equal(new Set(pack.audit.map(a=>a.sourceId)).size,72);
 assert.equal(pack.library.length,70);assert.equal(pack.library.filter(c=>c.reserved).length,4);
 const ids=new Set(pack.library.map(c=>c.id));
 for(const [node,criteria] of Object.entries(pack.bindings)){assert(doc.nodes.some(n=>n.id===node));assert.equal(new Set(criteria).size,criteria.length);criteria.forEach(c=>assert(ids.has(c)));}
 for(const item of pack.audit)assert(ids.has(item.canonicalId));
});
test('a quest only appears once on each ancestor path',()=>{
 for(const n of doc.nodes){const seen=new Set();for(const parent of pathTo(doc,n.id))for(const cid of pack.bindings[parent.id]||[]){assert(!seen.has(cid),`${cid} repeated on ${n.id}`);seen.add(cid);}}
});
test('straight-arm skill is not inherited by elbow flexion or extension',()=>{
 for(const n of doc.nodes.filter(n=>/팔꿈치 (굴곡|신전)/.test(n.id))){const ids=pathTo(doc,n.id).flatMap(n=>pack.bindings[n.id]||[]);assert(!ids.includes('Q021'));}
 assert(!pack.bindings.squat.includes('Q021'));assert(!pack.bindings.hinge.includes('Q021'));
});
