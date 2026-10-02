import {visibleNodes} from '../model.js';
export function questLayout(doc,expanded,heights={}){
 const visible=visibleNodes(doc,expanded),out=[];let cursor=0;
 function walk(n,depth){const children=visible.filter(x=>x.parent===n.id),start=cursor;
  const centers=children.map(c=>walk(c,depth+1));if(!children.length)cursor+=340;
  const x=children.length?(centers[0]+centers.at(-1))/2:start;
  out.push({...n,depth,position:{x,y:0}});return x;
 }
 visible.filter(n=>!n.parent).forEach(n=>{walk(n,0);cursor+=50});
 let y=0;for(let depth=0;depth<=Math.max(0,...out.map(n=>n.depth));depth++){
  const row=out.filter(n=>n.depth===depth);row.forEach(n=>n.position.y=y);
  y+=Math.max(200,...row.map(n=>heights[n.id]||((n.images?.length&&n.show?.image!==false?360:200)+(n.englishName?50:0)) ))+64;
 }return out;
}
