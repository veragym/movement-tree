import test from 'node:test';import assert from 'node:assert/strict';import {focusNeighborhood} from '../src/focusNeighborhood.js';
test('focus includes parent and immediate children, excludes siblings and grandchildren',()=>{
 const nodes=[{id:'p'},{id:'s',parent:'p'},{id:'x',parent:'p'},{id:'c',parent:'s'},{id:'g',parent:'c'}];
 assert.deepEqual(focusNeighborhood({nodes},'s',nodes),[{id:'p'},{id:'s'},{id:'c'}]);
 assert.deepEqual(focusNeighborhood({nodes},'s',nodes.slice(0,3)),[{id:'p'},{id:'s'}]);
 assert.deepEqual(focusNeighborhood({nodes},'missing',nodes),[]);
});
