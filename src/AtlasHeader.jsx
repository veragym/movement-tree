import React from 'react';
import './atlas-header.css';
export const BASIC_URL='./index.html#tree=27ce43fa-489c-4367-b6ff-891b478abe3e';
export const QUEST_URL='./quest.html';
export function AtlasHeader({page,status,children,notify}){
 const labels={loading:'불러오는 중',pending:'저장 대기',saving:'저장 중',saved:'클라우드 저장됨',offline:'기기에 보관 · 연결 필요',setup:'연결 설정 필요',conflict:'저장 충돌 확인',preview:'이 기기에만 저장'};
 function switchPage(e){if(['pending','saving','loading','conflict'].includes(status)){e.preventDefault();notify(status==='conflict'?'저장 충돌을 해결한 뒤 전환해 주세요.':'저장을 마친 뒤 전환해 주세요.')}}
 return <header className="app-header atlas-header"><div className="atlas-brand"><span aria-hidden="true">⑂</span><strong>MOVEMENT ATLAS</strong></div><div className="atlas-switch" role="navigation" aria-label="트리 전환"><a href={BASIC_URL} aria-current={page==='basic'?'page':undefined} onClick={switchPage}>기본 트리</a><a href={QUEST_URL} aria-current={page==='quest'?'page':undefined} onClick={switchPage}>퀘스트</a></div><div className="atlas-actions"><span className="atlas-status" role="status">{labels[status]||'연결 중'}</span>{children}</div></header>
}
