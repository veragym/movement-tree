export function layoutBounds(rows,heights={}){
 if(!rows.length)return null;
 const boxes=rows.map(n=>({x:n.position.x,y:n.position.y,width:240,height:heights[n.id]||((n.show?.image!==false&&n.images?.length?312:176)+(n.englishName?.trim()?60:0))}));
 const x=Math.min(...boxes.map(b=>b.x)),y=Math.min(...boxes.map(b=>b.y));return {x,y,width:Math.max(...boxes.map(b=>b.x+b.width))-x,height:Math.max(...boxes.map(b=>b.y+b.height))-y};
}
export function layoutViewport(bounds,width,height){
 const zoom=Math.max(.005,Math.min(1,width/(bounds.width*1.44),height/(bounds.height*1.44)));
 return {x:width/2-(bounds.x+bounds.width/2)*zoom,y:height/2-(bounds.y+bounds.height/2)*zoom,zoom};
}
