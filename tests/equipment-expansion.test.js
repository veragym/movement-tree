import test from 'node:test';import assert from 'node:assert/strict';
import baseline from '../src/content-pack.json' with {type:'json'};
import {applyContentPack} from '../src/content-pack.js';
import {applyEnglishNames} from '../src/english-names.js';
import {applyLowerReview} from '../src/lower-review.js';
import {applyEquipmentExpansion,equipmentMatrix} from '../src/equipment-expansion.js';
import {validateDoc} from '../src/model.js';
const before=()=>applyEnglishNames(applyLowerReview({version:1,theme:'purple',nodes:structuredClone(baseline.nodes),links:[],contentPacks:[baseline.id]}));
test('reviews all basics, normalizes machine names and preserves every existing attachment',()=>{
 const d=before();const n=d.nodes.find(n=>n.id==='pack-ex-chest_press');n.images=[{id:'mine',url:'https://example.com/image.jpg'}];n.fields=[{id:'note',title:'내 설명',body:'유지',visible:true}];const next=applyEquipmentExpansion(d);
 assert(d.nodes.filter(n=>n.level==='basic').every(n=>Object.hasOwn(equipmentMatrix,n.id)));
 for(const old of d.nodes){const current=next.nodes.find(n=>n.id===old.id);assert(current);assert.deepEqual(current.images,old.images);assert.deepEqual(current.fields,old.fields);assert.equal(current.parent,old.parent);}
 assert.equal(next.nodes.find(n=>n.id==='pack-ex-chest_press').label,'체스트 프레스 머신');
 assert(!next.nodes.some(n=>n.label.startsWith('머신 ')));assert(!next.nodes.some(n=>/^Machine /.test(n.englishName||'')));
 validateDoc(next);assert.deepEqual(applyEquipmentExpansion(next),next);
});
test('adds suitable equipment and distinguishes Smith and assistance without impossible blanket combinations',()=>{
 const d=applyContentPack({version:1,theme:'purple',nodes:structuredClone(baseline.nodes),links:[],contentPacks:[baseline.id]});
 for(const label of ['인클라인 체스트 프레스 머신','덤벨 인클라인 체스트 프레스','케이블 인클라인 체스트 프레스','인클라인 체스트 프레스 스미스 머신','어시스티드 풀업 머신'])assert(d.nodes.some(n=>n.label===label),label);
 assert(!d.nodes.some(n=>n.label==='바벨 체스트 플라이'||n.label==='덤벨 랫 풀다운'));
 assert.equal(d.nodes.filter(n=>n.level==='basic').length,65);
 assert(d.nodes.filter(n=>n.level==='variant').every(n=>n.englishName));
});
test('preserves user English and does not recreate deleted items on repeat migration',()=>{
 const d=before();d.nodes.find(n=>n.id==='pack-ex-chest_press').englishName='My Custom Chest Press';const next=applyEquipmentExpansion(d);assert.equal(next.nodes.find(n=>n.id==='pack-ex-chest_press').englishName,'My Custom Chest Press');next.nodes=next.nodes.filter(n=>n.id!=='basic::체스트 프레스::equipment-v6::C');assert.deepEqual(applyEquipmentExpansion(next),next);
});
