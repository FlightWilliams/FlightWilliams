const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const SPEC=JSON.parse(fs.readFileSync(path.join(__dirname,'../data/story-cast.json'),'utf8'));
const BASE=process.env.INDIE_TEST_URL||'http://127.0.0.1:8005/indiegame/index.html';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 let passed=0;
 try{
  const context=await browser.newContext({viewport:{width:390,height:759},reducedMotion:'reduce'});
  await require('./auto_entrances.cjs')(context);
  await context.addInitScript(()=>{localStorage.setItem('lo_tutorial_v1','done');localStorage.setItem('lo_music_mute','1')});
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  const check=async(name,fn)=>{await fn();passed++;console.log('PASS',name)};
  await page.goto(BASE);await page.waitForFunction(()=>window.BOOT?.ready&&typeof storyChapterLeads==='function');
  await page.evaluate(()=>{mute=true;mmute=true;openInitiativeCoin=async()=> 'p';newRun()});
  await page.waitForFunction(()=>G&&!G.busy&&!drawRunning);
  await page.evaluate(spec=>{
   window.castSpec=spec;
   window.resetCastFixture=world=>{
    difficulty=world;STG.splice(0,STG.length,...CAMPAIGNS[world].map(st=>({...st,dk:[]})));
    G.lv=STG.length;G.wins=STG.length;G.st=STG[G.lv-1];G.st.dk=STARTER.map(n=>collectionCard(n));
    G.turn=3;G.hp=7;G.ehp=0;G.phase='player-deploy';G.busy=0;G.mustDraw=0;G.freezeChoice=false;G.entrancePending=false;
    G.p=Array(5).fill(null);G.e=Array(5).fill(null);G.hand=[];G.eh=[];G.draw=[];G.ed=[];G.sel=null;G.moveSel=null;G.sac=new Set();
    G.deck=Array.from({length:12},()=>makeCard(SQ));G.reserve=[];G.log=[];G.history=[];G.tutorial=false;G.replay=false;
    G.rewardClaimed=false;G.rewardSelection=new Set();G.rewardFeedback='';G.tierRecorded=true;G.defeatedBosses=STG.map(st=>st.boss);
    infoPanel=null;DM=null;HOLD_DETAIL=null;TUT=null;OV='win';
    STORY.friends={};STORY.pendingFriend=null;collectedNames.clear();
   };
  },SPEC);
  await check('Six recurring leads define three distinct choices per chapter, including the requested first trio',async()=>{
   assert.equal(SPEC.core.length,6);assert.equal(new Set(SPEC.core).size,6);assert.equal(Object.keys(SPEC.chapters).length,6);
   assert.deepEqual(SPEC.chapters.mire,['苔庭铠卫·雅恩','苔庭潜印客·莫恩','苔庭裂角客领誓·阿珀']);
   for(const leads of Object.values(SPEC.chapters)){assert.equal(leads.length,3);assert.equal(new Set(leads).size,3);assert.ok(leads.every(id=>SPEC.core.includes(id)))}
   const runtime=await page.evaluate(()=>Object.fromEntries(Object.keys(castSpec.chapters).map(world=>[world,storyChapterLeads(world)])));
   assert.deepEqual(runtime,SPEC.chapters);
  });
  await check('Every chapter always offers its own three leads for fresh, partially owned and exhausted gold collections',async()=>{
   const cases=await page.evaluate(()=>{
    const out=[];
    for(const world of Object.keys(castSpec.chapters))for(const mode of ['fresh','partial-collected','partial-portfolio','all-gold-collected']){
     resetCastFixture(world);const leads=castSpec.chapters[world],firstGold=leads.map(id=>POOL.find(c=>c.baseName===id&&c.rarity==='rare')).find(Boolean);
     if(mode==='partial-collected'&&firstGold)collectCard(firstGold);
     if(mode==='partial-portfolio'&&firstGold)G.reserve=[makeCard(firstGold)];
     if(mode==='all-gold-collected')for(const card of POOL.filter(c=>c.rarity==='rare'))collectCard(card);
     const choices=rewardCards();
     const expected=leads.map(id=>{const gold=POOL.find(c=>c.rarity==='rare'&&c.baseName===id);return gold&&goldRewardEligible(gold,G.deck,G.reserve)?gold.n:id});
     out.push({world,mode,leads,ids:choices.map(c=>c.n),baseIds:choices.map(c=>c.baseName||c.n),expected});
    }
    return out;
   });
   assert.equal(cases.length,24);
   for(const test of cases){assert.equal(test.ids.length,3,`${test.world}/${test.mode}`);assert.equal(new Set(test.baseIds).size,3);assert.deepEqual([...test.baseIds].sort(),[...test.leads].sort());assert.deepEqual([...test.ids].sort(),[...test.expected].sort())}
  });
  await check('Claiming a gold lead recruits only that person and cannot add a duplicate rare copy',async()=>{
   const r=await page.evaluate(()=>{
    resetCastFixture('mire');G.rw=rewardCards();const index=G.rw.findIndex(c=>c.rarity==='rare'),chosen=G.rw[index],beforeDeck=G.deck.map(c=>c.n),beforeReserve=G.reserve.map(c=>c.n);
    claimReward(index);const afterDeck=G.deck.map(c=>c.n),afterReserve=G.reserve.map(c=>c.n),duplicate=addCampaignReward(chosen);
    return {chosen:chosen.n,base:chosen.baseName||chosen.n,friends:Object.keys(STORY.friends),beforeDeck,beforeReserve,afterDeck,afterReserve,claimed:G.rewardClaimed,duplicate,rareCount:[...G.deck,...G.reserve].filter(c=>c.n===chosen.n).length,newRewards:G.newRewards.map(c=>c.n)};
   });
   assert.deepEqual(r.friends,[r.base]);assert.ok(r.claimed);assert.deepEqual(r.newRewards,[r.chosen]);assert.deepEqual(r.afterDeck.slice(0,-1),r.beforeDeck);assert.equal(r.afterDeck.at(-1),r.chosen);assert.deepEqual(r.afterReserve,r.beforeReserve);assert.equal(r.duplicate,null);assert.equal(r.rareCount,1);
  });
  await check('The ordinary renamed lead can be chosen and recruited despite having no gold variant or Boss kind',async()=>{
   const r=await page.evaluate(()=>{
    resetCastFixture('cinder');const id='炽砂修灯师·瑟罗';G.rw=rewardCards();const index=G.rw.findIndex(c=>(c.baseName||c.n)===id),candidate=G.rw[index];
    const before=G.deck.map(c=>c.n);claimReward(index);
    return {id,index,kind:candidate.kind,rare:candidate.rarity==='rare',hasGold:POOL.some(c=>c.baseName===id&&c.rarity==='rare'),friends:Object.keys(STORY.friends),deck:G.deck.map(c=>c.n),before,claimed:G.rewardClaimed};
   });
   assert.ok(r.index>=0);assert.equal(r.hasGold,false);assert.equal(r.rare,false);assert.notEqual(r.kind,'boss');assert.deepEqual(r.friends,[r.id]);assert.ok(r.claimed);assert.deepEqual(r.deck,[...r.before,r.id]);
  });
  await check('Owned gold falls back to the same three ordinary leads; full decks and normal copy limits keep rewards in reserve',async()=>{
   const r=await page.evaluate(()=>{
    resetCastFixture('mire');for(const c of POOL.filter(c=>c.rarity==='rare'))collectCard(c);
    const id=castSpec.chapters.mire[0],normal=POOL.find(c=>c.n===id);G.deck=[makeCard(normal),makeCard(normal),...Array.from({length:34},()=>makeCard(SQ))];
    const priorReserve=makeCard(POOL.find(c=>c.n===castSpec.chapters.mire[1]));G.reserve=[priorReserve];G.rw=rewardCards();const index=G.rw.findIndex(c=>c.n===id),beforeDeck=G.deck.map(c=>c.n),beforeReserve=G.reserve.map(c=>c.n),choices=G.rw.map(c=>({id:c.n,rare:c.rarity==='rare'}));
    claimReward(index);
    return {id,choices,beforeDeck,beforeReserve,deck:G.deck.map(c=>c.n),reserve:G.reserve.map(c=>c.n),copies:G.deck.filter(c=>c.n===id).length,friends:Object.keys(STORY.friends),overlay:OV};
   });
   assert.equal(r.choices.length,3);assert.ok(r.choices.every(c=>!c.rare));assert.deepEqual(r.deck,r.beforeDeck);assert.deepEqual(r.reserve,[...r.beforeReserve,r.id]);assert.equal(r.copies,2);assert.deepEqual(r.friends,[r.id]);assert.equal(r.overlay,'camp');
  });
  await check('Antagonist and other non-core awards never turn into helping companions',async()=>{
   const r=await page.evaluate(()=>{
    resetCastFixture('mire');const noncore=POOL.find(c=>c.kind==='boss'&&c.rarity!=='rare'&&!castSpec.core.includes(c.n));
    const identity=storyBossIdentity(noncore),joined=recordStoryCompanion(noncore);addCampaignReward(noncore);
    return {id:noncore.n,identity,joined,friends:Object.keys(STORY.friends),pending:STORY.pendingFriend};
   });
   assert.ok(!SPEC.core.includes(r.id));assert.equal(r.identity,null);assert.equal(r.joined,false);assert.deepEqual(r.friends,[]);assert.equal(r.pending,null);
  });
  await check('Old non-core companion records survive saves and reloads but disappear from journal and toasts',async()=>{
   const expected=await page.evaluate(()=>{
    resetCastFixture('mire');const legacy=POOL.find(c=>c.kind==='boss'&&c.rarity!=='rare'&&!castSpec.core.includes(c.n)).n,core=castSpec.core[0];
    STORY.friends={[legacy]:{firstLoop:7,legacyNote:'keep this old record'},[core]:{firstLoop:0}};STORY.pendingFriend={boss:legacy,repeat:false,gold:false};saveStory();OV=null;G.ehp=7;
    const journals=[];
    for(const language of ['zh-CN','en']){gameLanguage=language;const root=document.createElement('div');root.innerHTML=storyJournalHTML();const heading=[...root.querySelectorAll('h3')].find(node=>/同行|Witnesses/i.test(node.textContent));journals.push({text:heading.nextElementSibling.textContent,legacy:shortCardName(legacy,language),core:shortCardName(core,language)})}
    render();renderStoryToast();const hidden=!document.querySelector('#story-companion-toast');
    const stored=JSON.parse(localStorage.getItem(STORY_STORAGE));return {legacy,core,journals,hidden,friends:stored.friends};
   });
   assert.ok(expected.hidden);for(const row of expected.journals){assert.ok(row.text.includes(row.core));assert.ok(!row.text.includes(row.legacy))}assert.equal(expected.friends[expected.legacy].legacyNote,'keep this old record');
   await page.reload();await page.waitForFunction(()=>window.BOOT?.ready);
   assert.deepEqual(await page.evaluate(()=>STORY.friends),expected.friends);
   assert.equal(await page.evaluate(()=>storyCompanionText()),'');
  });
  await check('No browser errors during chapter rewards and companion migration',async()=>assert.deepEqual(errors,[]));
  console.log(JSON.stringify({passed,failed:0}));await context.close();
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
