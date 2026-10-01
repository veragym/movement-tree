import {removeUnmatched,unmatchedRemovalId} from './remove-unmatched.js';
import {removeLowerCables,lowerCableRemovalId} from './remove-lower-cables.js';
import {applyEquipmentExpansion,equipmentPackId} from './equipment-expansion.js';
import {applyEnglishNames,englishPackId} from './english-names.js';
import {applyContentPack as applyInitial} from './initial-content-pack.js';
import {applyLowerReview,reviewId} from './lower-review.js';
export const pack={id:unmatchedRemovalId};
export function applyContentPack(document){
 if(document.contentPacks?.includes(pack.id))return document;
 const d=structuredClone(applyLowerReview(applyInitial(document)));
 const node=d.nodes.find(n=>n.id==='lunge::복합관절::싱글 레그 Squat');
 if(node&&node.label==='싱글 레그 Squat')node.label='싱글 레그 스쿼트';
 if(!d.contentPacks.includes('korean-squat-label-v4'))d.contentPacks.push('korean-squat-label-v4');
 return removeUnmatched(removeLowerCables(applyEquipmentExpansion(applyEnglishNames(d))));
}
