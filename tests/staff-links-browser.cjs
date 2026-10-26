const {chromium}=require('C:/Users/iksun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const BASE=(process.env.STAFF_TEST_URL||'http://127.0.0.1:5181').replace(/\/$/,'');
(async()=>{
 const {seed}=await import('../src/model.js');
 const {applyContentPack}=await import('../src/content-pack.js');
 const {MAIN_BASIC_KEY,MAIN_QUEST_KEY}=await import('../src/staff-workspaces.js');
 const basic=applyContentPack(seed()),quest=JSON.parse(fs.readFileSync('src/quest/offline-seed.json','utf8'));
 const docs=new Map([[MAIN_BASIC_KEY,{document:basic,revision:1}],[MAIN_QUEST_KEY,{document:quest,revision:1}]]);
 const original=structuredClone({basic,quest});
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
 const ctx=await browser.newContext({viewport:{width:1280,height:850}}),errors=[];
 ctx.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
 await ctx.route('**/rest/v1/rpc/mt_*',async route=>{
  const body=route.request().postDataJSON(),url=route.request().url(),old=docs.get(body.p_key);let data,status=200;
  if(url.endsWith('/mt_load'))data=old||null;
  else if(url.endsWith('/mt_version'))data=old?.revision||null;
  else if(body.p_expected!==(old?.revision||0)){data={code:'40001'};status=409;}
  else{data=(old?.revision||0)+1;docs.set(body.p_key,{document:body.p_doc,revision:data});}
  await route.fulfill({status,contentType:'application/json',body:JSON.stringify(data)});
 });
 const page=await ctx.newPage();await page.goto(BASE+'/');
 await page.locator('.atlas-status').filter({hasText:'클라우드 저장됨'}).waitFor();
 assert(page.url().includes(MAIN_BASIC_KEY));
 await page.getByRole('button',{name:'직원용 링크',exact:true}).click();
 const dialog=page.getByRole('dialog',{name:'직원용 링크 관리'});
 for(const name of ['직원 A','직원 B']){
  await dialog.getByLabel('직원 이름',{exact:true}).fill(name);
  await dialog.getByRole('button',{name:'직원용 링크 만들기',exact:true}).click();
  await dialog.getByLabel(name+' 전용 링크',{exact:true}).waitFor();
  await page.locator('.atlas-status').filter({hasText:'클라우드 저장됨'}).waitFor();
 }
 const entries=docs.get(MAIN_BASIC_KEY).document.staffDirectory;
 assert.equal(entries.length,2);assert.equal(docs.size,6);
 const [a,b]=entries;assert.notEqual(a.basicKey,b.basicKey);assert.notEqual(a.questKey,b.questKey);
 assert.deepEqual(docs.get(MAIN_BASIC_KEY).document.nodes,original.basic.nodes);
 assert.deepEqual(docs.get(MAIN_QUEST_KEY).document,original.quest);
 assert.deepEqual(docs.get(a.questKey).document.quest.members[0].records,{});
 assert.equal(docs.get(a.basicKey).document.staffDirectory,undefined);
 await page.screenshot({path:'.local/staff-links-desktop.png'});
 await page.setViewportSize({width:390,height:844});
 assert(await dialog.evaluate(e=>e.getBoundingClientRect().right<=innerWidth));
 await page.screenshot({path:'.local/staff-links-mobile.png'});
 await page.setViewportSize({width:1280,height:850});
 const staff=await ctx.newPage();await staff.goto(BASE+'/#tree='+a.basicKey);
 await staff.locator('.atlas-status').filter({hasText:'클라우드 저장됨'}).waitFor();
 assert.equal(await staff.getByRole('button',{name:'직원용 링크',exact:true}).count(),0);
 await staff.getByRole('button',{name:'편집',exact:true}).click();
 await staff.locator('.tree-card').filter({has:staff.locator('.card-name',{hasText:/^상체$/})}).click();
 await staff.getByLabel('한글 이름',{exact:true}).fill('직원 A만 수정');
 await staff.locator('.atlas-status').filter({hasText:'클라우드 저장됨'}).waitFor();
 assert.equal(docs.get(a.basicKey).document.nodes.find(n=>n.id==='upper').label,'직원 A만 수정');
 assert.equal(docs.get(b.basicKey).document.nodes.find(n=>n.id==='upper').label,'상체');
 assert.equal(docs.get(MAIN_BASIC_KEY).document.nodes.find(n=>n.id==='upper').label,'상체');
 await staff.getByRole('link',{name:'퀘스트',exact:true}).click();
 await staff.locator('.atlas-status').filter({hasText:'클라우드 저장됨'}).waitFor();
 assert(staff.url().includes(a.questKey));
 assert.equal(await staff.locator('.staff-workspace-badge').textContent(),'직원 A 전용');
 await staff.getByRole('link',{name:'기본 트리',exact:true}).click();
 await staff.locator('.atlas-status').filter({hasText:'클라우드 저장됨'}).waitFor();assert(staff.url().includes(a.basicKey));
 // Even after opening employee links, the original bare main address stays original.
 await staff.goto(BASE+'/');await staff.locator('.atlas-status').filter({hasText:'클라우드 저장됨'}).waitFor();assert(staff.url().includes(MAIN_BASIC_KEY));
 assert.deepEqual(errors,[]);console.log('Staff creation, desktop/mobile UI, record reset, isolated edits, paired navigation and main-address routing passed.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});

