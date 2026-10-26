import test from 'node:test';
import assert from 'node:assert/strict';
import {MAIN_BASIC_KEY,MAIN_QUEST_KEY,workspaceKey,workspaceLinks,copyWorkspacePair,createStaffPair,preserveWorkspaceIdentity,appendStaffEntry} from '../src/staff-workspaces.js';
import {seed} from '../src/model.js';
const basic=seed();
basic.staffDirectory=[{name:'existing private directory'}];
const quest={...seed(),quest:{schema:2,library:[{id:'q',label:'criteria'}],bindings:{upper:['q']},members:[{id:'private-person',name:'private name',records:{upper:{checked:true}}}]}};
const keys={basicKey:'11111111-1111-4111-8111-111111111111',questKey:'22222222-2222-4222-8222-222222222222'};
test('bare main address always resolves to original, never last employee workspace',()=>{
 assert.equal(workspaceKey('', 'basic'),MAIN_BASIC_KEY);
 assert.equal(workspaceKey('', 'quest'),MAIN_QUEST_KEY);
 assert.equal(workspaceKey('#tree='+keys.basicKey,'basic'),keys.basicKey);
 assert.equal(workspaceKey('#tree=invalid','basic'),MAIN_BASIC_KEY);
});
test('staff documents are independent snapshots, paired links never point to original',()=>{
 const before=structuredClone({basic,quest});
 const pair=copyWorkspacePair({basic,quest,name:'직원 A',...keys});
 pair.basic.nodes[0].label='A only';
 assert.deepEqual({basic,quest},before);
 assert.equal(pair.basic.staffDirectory,undefined);
 assert.equal(pair.quest.staffDirectory,undefined);
 assert.equal(pair.quest.quest.members.length,1);
 assert.deepEqual(pair.quest.quest.members[0].records,{});
 assert(!JSON.stringify(pair).includes('private-person'));
 assert.deepEqual(pair.quest.quest.library,quest.quest.library);
 assert.deepEqual(pair.quest.quest.bindings,quest.quest.bindings);
 assert.equal(workspaceLinks(pair.basic).quest,'./quest.html#tree='+keys.questKey);
 assert.equal(workspaceLinks(pair.quest).basic,'./index.html#tree='+keys.basicKey);
});
test('copy rejects original keys and local-only images rather than publishing broken copies',()=>{
 assert.throws(()=>copyWorkspacePair({basic,quest,name:'A',basicKey:MAIN_BASIC_KEY,questKey:keys.questKey}));
 const local=structuredClone(basic);local.nodes[0].images=[{url:'local:missing'}];
 assert.throws(()=>copyWorkspacePair({basic:local,quest,name:'A',...keys}),/이미지/);
});
test('restoring a backup preserves the destination pair and original directory',()=>{
 const pair=copyWorkspacePair({basic,quest,name:'A',...keys});
 const staff=preserveWorkspaceIdentity(pair.basic,basic,keys.basicKey);
 assert.equal(workspaceLinks(staff).quest,'./quest.html#tree='+keys.questKey);
 assert.equal(staff.staffDirectory,undefined);
 const main=preserveWorkspaceIdentity(basic,pair.basic,MAIN_BASIC_KEY);
 assert.equal(main.staffWorkspace,undefined);
 assert.deepEqual(main.staffDirectory,basic.staffDirectory);
});
test('directory append uses current content and retains entries from a refresh',()=>{
 const newer={...seed(),staffDirectory:[{basicKey:'other',name:'other'}]};
 newer.nodes[0].label='new original edit';
 const next=appendStaffEntry(newer,{...keys,name:'A'});
 assert.equal(next.nodes[0].label,'new original edit');assert.equal(next.staffDirectory.length,2);
 assert.equal(appendStaffEntry(next,{...keys,name:'A'}).staffDirectory.length,2);
});
test('creation retries same pair after partial failure without overwriting staff edits',async()=>{
 const docs=new Map();let fail=true;
 const rpc=async(name,args)=>{
  if(name==='mt_load')return docs.get(args.p_key)||null;
  if(args.p_key===keys.questKey&&fail){fail=false;throw Error('offline');}
  assert.equal(args.p_expected,0);assert(!docs.has(args.p_key));
  docs.set(args.p_key,{document:structuredClone(args.p_doc),revision:1});return 1;
 };
 const pair=copyWorkspacePair({basic,quest,name:'A',...keys});
 await assert.rejects(createStaffPair(pair,rpc));
 docs.get(keys.basicKey).document.nodes[0].label='already edited';
 await createStaffPair(pair,rpc);
 assert.equal(docs.size,2);
 assert.equal(docs.get(keys.basicKey).document.nodes[0].label,'already edited');
 assert(!docs.has(MAIN_BASIC_KEY));assert(!docs.has(MAIN_QUEST_KEY));
});
