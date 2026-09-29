import pack from './content-pack.json' with {type:'json'};
import legacy from './legacy-content-pack.json' with {type:'json'};
import {validateDoc} from './model.js';
export {pack};
export function applyContentPack(document){
 if(document.contentPacks?.includes(pack.id))return document;
 const d={...structuredClone(document),nodes:structuredClone(pack.nodes),links:[]};
 const mapping=new Map(Object.entries(pack.legacyMap));
 const previous=new Map(legacy.nodes.map(n=>[n.id,n]));
 const destination=id=>d.nodes.find(n=>n.id===id);
 // Map obsolete equipment branches to their exercise's new equipment position.
 for(const old of document.nodes)if(!mapping.has(old.id)){
  const child=document.nodes.find(n=>n.parent===old.id&&mapping.has(n.id));
  const target=child&&destination(mapping.get(child.id));
  if(old.kind==='branch'&&target?.level==='variant')mapping.set(old.id,target.parent);
 }
 const changed=(old,field)=>JSON.stringify(old[field]||[])!==JSON.stringify(previous.get(old.id)?.[field]||[]);
 const retained=[];
 for(const old of document.nodes){
  const target=destination(mapping.get(old.id));
  if(target){
   for(const field of ['fields','meanings'])if(changed(old,field))target[field]=structuredClone(old[field]||[]);
   if(old.show)target.show=structuredClone(old.show);
   // Keep custom exercise names; structural labels follow the approved hierarchy.
   if(target.level==='variant'&&previous.has(old.id)&&old.label!==previous.get(old.id).label)target.label=old.label;
   if(target.level!=='variant'&&previous.has(old.id)&&old.label!==previous.get(old.id).label)target.fields.push({id:old.id+'-previous-name',title:'이전 이름',body:old.label,visible:false});
  }else if(!previous.has(old.id)||(old.fields.length&&changed(old,'fields'))||(old.meanings.length&&changed(old,'meanings'))||old.label!==previous.get(old.id).label){
   let n=structuredClone(old);n.images=[];retained.push(n);mapping.set(old.id,old.id);
  }
 }
 for(const n of retained){
  let parent=n.parent,seen=new Set();while(parent&&!mapping.has(parent)&&!seen.has(parent)){seen.add(parent);parent=document.nodes.find(x=>x.id===parent)?.parent}
  n.parent=mapping.get(parent)||'lower';d.nodes.push(n);
 }
 for(const link of document.links){let source=mapping.get(link.source),target=mapping.get(link.target);if(source&&target&&source!==target&&destination(source)&&destination(target))d.links.push({...link,source,target})}
 // One-time reset of all image references, including custom nodes. No Storage deletion.
 for(const n of d.nodes)n.images=[];
 d.contentPacks=[...(d.contentPacks||[]),pack.id];return validateDoc(d);
}

