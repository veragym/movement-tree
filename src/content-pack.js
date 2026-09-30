import {applyContentPack as applyInitial} from './initial-content-pack.js';
import {applyLowerReview,reviewId} from './lower-review.js';
export const pack={id:reviewId};
export function applyContentPack(document){
 if(document.contentPacks?.includes(pack.id))return document;
 return applyLowerReview(applyInitial(document));
}
