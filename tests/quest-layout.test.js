import test from 'node:test';
import assert from 'node:assert/strict';
import {questLayout} from '../src/quest/layout.js';
test('measured tall cards leave space for the next row and siblings',()=>{
 const doc={nodes:[{id:'a',parent:null},{id:'b',parent:'a'},{id:'c',parent:'a'},{id:'d',parent:'b'}]};
 const result=questLayout(doc,new Set(['a','b']),{a:480,b:650,c:200});
 const n=Object.fromEntries(result.map(n=>[n.id,n]));
 assert.ok(n.b.position.y>=480+56);
 assert.ok(n.d.position.y>=n.b.position.y+650+56);
 assert.ok(n.c.position.x-n.b.position.x>=340);
 assert.equal(n.a.position.x,(n.b.position.x+n.c.position.x)/2);
});
