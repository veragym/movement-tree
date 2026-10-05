// Fit only the selected branch and its immediate, visible connections.
export function focusNeighborhood(doc,id,visibleNodes){
 const selected=doc.nodes.find(n=>n.id===id);if(!selected)return [];
 const wanted=new Set([id,selected.parent,...doc.nodes.filter(n=>n.parent===id).map(n=>n.id)]);
 return visibleNodes.filter(n=>wanted.has(n.id)).map(n=>({id:n.id}));
}
