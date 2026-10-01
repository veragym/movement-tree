import {descendants,validateDoc} from './model.js';
export const lowerCableRemovalId='remove-lower-cables-v7';
export function removeLowerCables(document){
 if(document.contentPacks?.includes(lowerCableRemovalId))return document;
 const d=structuredClone(document),lower=descendants(d,'lower'),removed=new Set();
 for(const n of d.nodes)if(lower.has(n.id)&&(/케이블/.test(n.label)||/\bcable\b/i.test(n.englishName||'')))for(const id of descendants(d,n.id))removed.add(id);
 d.nodes=d.nodes.filter(n=>!removed.has(n.id));d.links=d.links.filter(l=>!removed.has(l.source)&&!removed.has(l.target));
 d.contentPacks=[...(d.contentPacks||[]),lowerCableRemovalId];return validateDoc(d);
}
