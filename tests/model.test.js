import test from 'node:test';
import assert from 'node:assert/strict';
import {validateDoc,moveNode,deleteBranch,pathTo,visibleNodes,seed,layout} from '../src/model.js';
test('reject moving a parent under its descendant',()=>assert.throws(()=>moveNode(seed(),'upper','row')));
test('deleting a branch removes only its descendants and related links',()=>{let d=deleteBranch(seed(),'pull');assert(!d.nodes.some(n=>n.id==='row'));assert(d.nodes.some(n=>n.id==='push'));validateDoc(d)});
test('breadcrumbs reflect new parent and renamed ancestors',()=>{let d=moveNode(seed(),'row','push');d.nodes.find(n=>n.id==='push').label='변경';assert.deepEqual(pathTo(d,'row').map(n=>n.label),['상체','변경','로우'])});
test('initially only roots are visible',()=>assert.equal(visibleNodes(seed(),new Set()).length,2));
test('collapsed parent hides all descendants',()=>assert(!visibleNodes(seed(),new Set(['pull','row'])).some(n=>n.id==='row')));
test('reject broken imports',()=>{let d=seed();d.nodes[0].parent='missing';assert.throws(()=>validateDoc(d));assert.throws(()=>validateDoc({nodes:[]}));});
test('layout has no sibling overlap',()=>{let nodes=layout(seed(),new Set(['upper','lower','pull','row']));let rows=Object.groupBy(nodes,n=>n.position.y);for(let row of Object.values(rows)){row.sort((a,b)=>a.position.x-b.position.x);for(let i=1;i<row.length;i++)assert(row[i].position.x-row[i-1].position.x>=240)}});

test('image cards leave room before the next level',()=>{let d=seed();d.nodes.find(n=>n.id==='upper').images=[{url:'https://example.com/image.jpg'}];let nodes=layout(d,new Set(['upper','lower']));let upper=nodes.find(n=>n.id==='upper'),push=nodes.find(n=>n.id==='push'),squat=nodes.find(n=>n.id==='squat');assert(push.position.y>=upper.position.y+312+44);assert.equal(push.position.y,squat.position.y)});
