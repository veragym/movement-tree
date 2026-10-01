import ids from './unmatched-exercises.json' with {type:'json'};
import {descendants,validateDoc} from './model.js';
export const unmatchedRemovalId='remove-unmatched-v8';
export function removeUnmatched(document){
 if(document.contentPacks?.includes(unmatchedRemovalId))return document;
 const d=structuredClone(document),removed=new Set(),parents=new Set();
 for(const id of ids){const n=d.nodes.find(n=>n.id===id);if(n){parents.add(n.parent);for(const child of descendants(d,id))removed.add(child)}}
 d.nodes=d.nodes.filter(n=>!removed.has(n.id));
 for(const id of parents){const n=d.nodes.find(n=>n.id===id);if(n?.level==='tool'&&!d.nodes.some(x=>x.parent===id)&&!n.images.length&&!n.fields.length&&!n.meanings.length){removed.add(id);d.nodes=d.nodes.filter(x=>x.id!==id)}}
 d.links=d.links.filter(l=>!removed.has(l.source)&&!removed.has(l.target));d.contentPacks=[...(d.contentPacks||[]),unmatchedRemovalId];return validateDoc(d);
}
