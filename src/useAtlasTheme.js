import {useEffect,useState} from 'react';
import {themes} from './model';
import {rpc} from './storage';
export const BASIC_KEY='27ce43fa-489c-4367-b6ff-891b478abe3e';
const CACHE='movement-atlas-theme';
function read(key){try{return JSON.parse(localStorage.getItem(key))}catch{return null}}
function publish(theme,key){if(!themes[theme])return;try{localStorage.setItem(key,JSON.stringify({theme,at:Date.now()}))}catch{}}
// The basic tree owns the shared visual preference. Reading a quest never saves it.
export function useAtlasTheme({owner=false,ready=false,theme,basicKey=BASIC_KEY}){
 const cache=basicKey===BASIC_KEY?CACHE:CACHE+':'+basicKey;
 const [shared,setShared]=useState(()=>read(cache)?.theme||theme);
 useEffect(()=>{if(owner&&ready){publish(theme,cache);setShared(theme)}},[owner,ready,theme,cache]);
 useEffect(()=>{if(owner||!ready)return;let live=true;const changed=e=>{if(e.key===cache){const cached=read(cache);if(themes[cached?.theme])setShared(cached.theme)}};window.addEventListener('storage',changed);
 const start=Date.now();rpc('mt_load',{p_key:basicKey}).then(remote=>{if(!live)return;const cached=read(cache);if(cached?.at>start){setShared(cached.theme);return}if(themes[remote?.document?.theme]){setShared(remote.document.theme);publish(remote.document.theme,cache)}}).catch(()=>{});
 return()=>{live=false;window.removeEventListener('storage',changed)};
 },[owner,ready,basicKey,cache]);
 return owner?theme:(themes[shared]?shared:theme);
}
