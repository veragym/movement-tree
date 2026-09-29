const {chromium}=require('C:/Users/iksun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 let remote=null,revision=0,delayVersion=false;
 const contexts=[];
 async function client(){
  const ctx=await browser.newContext();contexts.push(ctx);
  await ctx.route('**/rest/v1/rpc/mt_*',async route=>{
   const name=route.request().url().split('/').pop(),body=route.request().postDataJSON();
   let result,status=200;
   if(name==='mt_version'){if(delayVersion)await new Promise(r=>setTimeout(r,2200));result=revision||null}
   else if(name==='mt_load')result=remote?{revision,document:remote}:null;
   else if(body.p_expected!==revision){status=409;result={code:'40001'}}
   else{remote=body.p_doc;result=++revision}
   await route.fulfill({status,contentType:'application/json',body:JSON.stringify(result)});
  });
  const p=await ctx.newPage();await p.goto('http://127.0.0.1:5180/#tree=00000000-0000-4000-8000-000000000002');await p.waitForSelector('.tree-card');await p.waitForTimeout(1800);return p;
 }
 const a=await client(),b=await client();
 await a.getByRole('button',{name:'설정',exact:true}).click();
 delayVersion=true;await a.getByRole('button',{name:'연결 확인',exact:true}).click();
 await a.getByRole('button',{name:'빨강 테마',exact:true}).click();
 await a.waitForTimeout(4200);assert.equal(remote.theme,'red','edit while refresh busy must eventually save');delayVersion=false;
 await b.getByRole('button',{name:'설정',exact:true}).click();await b.getByRole('button',{name:'보라 테마',exact:true}).click();
 await b.getByRole('dialog',{name:'다른 기기에서도 수정했어요'}).waitFor();assert.equal(remote.theme,'red','conflict must not overwrite');
 await b.getByRole('button',{name:'서버 버전 사용',exact:true}).click();await b.waitForFunction(()=>document.querySelector('[aria-label="빨강 테마"]').classList.contains('chosen'));
 await contexts[1].setOffline(true);await b.getByRole('button',{name:'초록 테마',exact:true}).click();await b.waitForTimeout(1400);
 await contexts[1].setOffline(false);await b.getByRole('button',{name:'연결 확인',exact:true}).click();await b.waitForTimeout(2500);assert.equal(remote.theme,'green');
 await b.reload();await b.waitForSelector('.tree-card');await b.waitForTimeout(500);assert.equal(await b.locator('.tree-card').count(),2);
 console.log('PASS delayed refresh save, two-device conflict, offline recovery, reload');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
