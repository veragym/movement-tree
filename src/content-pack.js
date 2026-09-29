import pack from './content-pack.json' with {type:'json'};
import {validateDoc} from './model.js';
export {pack};
const normal=s=>s.replace(/\s+/g,'').toLowerCase();
export function applyContentPack(document){
 if(document.contentPacks?.includes(pack.id))return document;
 const d=structuredClone(document),mapped=new Map();
 for(const source of pack.nodes){
  const parent=source.parent===null?null:mapped.get(source.parent);
  if(source.parent!==null&&!parent)throw Error('자료의 소속 가지를 찾지 못했습니다.');
  let target=d.nodes.find(n=>n.id===source.id)||d.nodes.find(n=>n.kind===source.kind&&normal(n.label)===normal(source.label)&&(source.kind==='exercise'||n.parent===parent));
  if(!target&&source.kind==='exercise')target=d.nodes.find(n=>n.kind==='exercise'&&n.parent===parent&&source.aliases?.some(a=>normal(a)===normal(n.label)));
  if(target){
   // Preserve names, hierarchy, visibility, and every existing content value.
   for(const field of ['images','meanings','fields'])if(target[field].length===0)target[field]=structuredClone(source[field]);
   if(source.sourceExerciseId&&!target.sourceExerciseId)target.sourceExerciseId=source.sourceExerciseId;
  }else {target={...structuredClone(source),parent};delete target.aliases;d.nodes.push(target)}
  mapped.set(source.id,target.id);
 }
 d.contentPacks=[...(d.contentPacks||[]),pack.id];return validateDoc(d);
}
