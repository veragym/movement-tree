import React,{useEffect,useId,useRef,useState} from 'react';
import {groupedAssessments} from './assessment-catalog';
export function AssessmentPicker({items,value,onChange,disabled,emptyLabel}){
 const [open,setOpen]=useState(false),[preview,setPreview]=useState(null),[search,setSearch]=useState('');
 const root=useRef(null),trigger=useRef(null),id=useId();
 const selected=items.find(c=>c.id===value),groups=groupedAssessments(items,{search});
 useEffect(()=>{if(!open)return;const outside=e=>{if(!root.current?.contains(e.target))setOpen(false)};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside)},[open]);
 useEffect(()=>{if(disabled)setOpen(false)},[disabled]);
 function close(){setOpen(false);trigger.current?.focus()}
 return <div className="assessment-picker" ref={root} onKeyDown={e=>{if(e.key==='Escape'&&open){e.stopPropagation();e.preventDefault();close()}}}>
 <button type="button" className="picker-trigger" ref={trigger} aria-label="평가 조건 선택" aria-expanded={open} aria-controls={id} disabled={disabled} onClick={()=>{setOpen(v=>!v);setPreview(value||null);setSearch('')}}>{selected?.label||emptyLabel}<span aria-hidden="true">{open?'▴':'▾'}</span></button>
 {open&&<div className="picker-menu" id={id} role="region" aria-label="평가 조건 목록"><input aria-label="연결할 평가 항목 검색" placeholder="항목 검색" value={search} onChange={e=>{setSearch(e.target.value);setPreview(null)}}/><div className="picker-options">{groups.map(g=><div key={g.name}>{g.families.map(f=><section key={f.name}><h4>{g.name} · {f.name}</h4>{f.items.map(c=><div className={'picker-option '+(preview===c.id?'previewing':'')} key={c.id} onPointerEnter={e=>{if(e.pointerType==='mouse')setPreview(c.id)}}><button type="button" aria-pressed={value===c.id} aria-describedby={preview===c.id?id+'-description':undefined} onFocus={()=>setPreview(c.id)} onClick={()=>{onChange(c.id);close()}}>{c.label}{value===c.id&&<span aria-hidden="true"> ✓</span>}</button>{preview===c.id&&<p id={id+'-description'}>{c.description||'등록된 부가설명이 없습니다.'}</p>}</div>)}</section>)}</div>)}{!groups.length&&<p className="hint">검색 결과가 없습니다.</p>}</div></div>}
 </div>;
}
