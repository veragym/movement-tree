import {applyContentPack as applyInitial} from './initial-content-pack.js';
import {applyLowerReview,reviewId} from './lower-review.js';
export const pack={id:'korean-squat-label-v4'};
export function applyContentPack(document){
 if(document.contentPacks?.includes(pack.id))return document;
 const d=structuredClone(applyLowerReview(applyInitial(document)));
 const node=d.nodes.find(n=>n.id==='lunge::복합관절::싱글 레그 Squat');
 if(node&&node.label==='싱글 레그 Squat')node.label='싱글 레그 스쿼트';
 d.contentPacks=[...(d.contentPacks||[]),pack.id];
 return d;
}
