import {useEffect,useState} from 'react';
import {themes} from './model';
import {rpc} from './storage';
export const BASIC_KEY='27ce43fa-489c-4367-b6ff-891b478abe3e';
const CACHE='movement-atlas-theme';
function read(){try{return JSON.parse(localStorage.getItem(CACHE))}catch{return null}}
function publish(theme){if(!themes[theme])return;try{localStorage.setItem(CACHE,JSON.stringify({theme,at:Date.now()}))}catch{}}
// The basic tree owns the shared visual preference. Reading a quest never saves it.
export function useAtlasTheme({owner=false,ready=false,theme}){
 const [shared,setShared]=useState(()=>read()?.theme||theme);
 useEffect(()=>{if(owner&&ready){publish(theme);setShared(theme)}},[owner,ready,theme]);
 useEffect(()=>{if(owner)return;let live=true;const changed=e=>{if(e.key===CACHE){const cached=read();if(themes[cached?.theme])setShared(cached.theme)}};window.addEventListener('storage',changed);
 const start=Date.now();rpc('mt_load',{p_key:BASIC_KEY}).then(remote=>{if(!live)return;const cached=read();if(cached?.at>start){setShared(cached.theme);return}if(themes[remote?.document?.theme]){setShared(remote.document.theme);publish(remote.document.theme)}}).catch(()=>{});
 return()=>{live=false;window.removeEventListener('storage',changed)};
 },[owner]);
 return owner?theme:(themes[shared]?shared:theme);
}
