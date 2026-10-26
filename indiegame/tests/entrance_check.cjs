const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const ROOT=path.join(__dirname,'..'),BASE=process.env.INDIE_TEST_URL||'http://127.0.0.1:8932/indiegame/index.html';
const read=n=>JSON.parse(fs.readFileSync(path.join(ROOT,'data',n+'.json'),'utf8'));
const fixture=fs.readFileSync(path.join(__dirname,'story_check.cjs'),'utf8').match(/const LEGACY_SAVE=JSON\.parse\(zlib\.inflateSync\(Buffer\.from\('([^']+)'/);
const LEGACY=JSON.parse(zlib.inflateSync(Buffer.from(fixture[1],'base64')).toString('utf8'));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 const results=[],errors=[];const check=async(name,fn)=>{try{const evidence=await fn();results.push({name,passed:true,...(evidence?{evidence}:{})});console.log('PASS',name)}catch(e){results.push({name,passed:false,error:e.message});throw e}};
 try{
  const entrances=read('boss-entrances'),campaigns=read('campaigns'),identities=read('boss-identities');
  await check('All 96 campaign Bosses have complete bilingual entrances matched to their level and identity',()=>{
   const stages=Object.entries(campaigns).flatMap(([world,rows])=>rows.map((st,index)=>({world,level:index+1,boss:st.boss})));assert.equal(stages.length,96);assert.deepEqual(new Set(Object.keys(entrances)),new Set(stages.map(x=>x.boss)));
   for(const st of stages){const row=entrances[st.boss],id=identities[st.boss];assert.equal(row.world,st.world);assert.equal(row.level,st.level);for(const lang of ['zh','en']){const c=row[lang];assert.ok(c.title&&c.text);assert.ok(c.text.split('\n').filter(Boolean).length>=3,st.boss);assert.ok((c.title+c.text).includes(id[lang]),st.boss+' lacks '+lang+' name')}assert.ok(row.zh.text.length>=140);assert.ok(!/[\u3400-\u9fff]/.test(row.en.title+row.en.text))}
   return {entrances:96};
  });
  const context=await browser.newContext({viewport:{width:390,height:759},reducedMotion:'reduce'});await context.addInitScript(()=>{try{localStorage.setItem('lo_tutorial_v1','done');localStorage.setItem('lo_music_mute','1')}catch{}});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  const ready=()=>page.waitForFunction(()=>window.BOOT?.ready),settled=()=>page.waitForFunction(()=>G&&!G.busy&&!drawRunning&&!G.entrancePending),pending=()=>page.waitForFunction(()=>G?.entrancePending&&G.phase==='encounter-intro'&&!G.busy);
  const graph=()=>page.evaluate(()=>checkpointGraphEncode(G));
  const closeChapter=async()=>{if(await page.locator('.story-drawer:not(.boss-entrance)').count())await page.locator('.story-drawer:not(.boss-entrance) [data-a="closepanel"]').click()};
  await page.goto(BASE);await ready();await page.locator('#nm').fill('Rowan');await page.locator('[data-a="start"]').click();await pending();
  let prepared;
  await check('A new run shows its entrance before any deal, coin or enemy deployment',async()=>{
   assert.equal(await page.locator('.boss-entrance').count(),1);assert.equal(await page.locator('.initiative-coin-screen').count(),0);
   const r=await page.evaluate(()=>({phase:G.phase,hand:G.hand.length,enemyHand:G.eh.length,p:G.p.filter(Boolean).length,e:G.e.filter(Boolean).length,draw:G.draw.map(c=>c.n),ed:G.ed.map(c=>c.n),enemyTurn:G.enemyDeployedTurn,coin:G.coinBonusGranted}));assert.equal(r.phase,'encounter-intro');assert.deepEqual([r.hand,r.enemyHand,r.p,r.e,r.enemyTurn],[0,0,0,0,0]);assert.equal(r.coin,false);prepared=r;return {preparedPlayerDeck:r.draw.length,loadedScript:await page.evaluate(()=>[...document.scripts].find(n=>/pact\./.test(n.src))?.src.split('/').pop()),loadedStyle:await page.evaluate(()=>[...document.styleSheets].find(s=>s.href&&/table\./.test(s.href))?.href.split('/').pop())};
  });
  await check('Changing language, returning home and refreshing preserve the pending scene and exact prepared decks',async()=>{
   const before=await graph();await page.locator('.boss-entrance [data-language="en"]').click();assert.deepEqual(await graph(),before);assert.ok(await page.locator('.boss-entrance').evaluate(n=>{const copy=n.cloneNode(true);copy.querySelectorAll('[data-language]').forEach(x=>x.remove());return !/[\u3400-\u9fff]/.test(copy.textContent)}));
   await page.locator('.boss-entrance [data-boss-entrance="home"]').click();assert.equal(await page.evaluate(()=>G),null);await page.reload();await ready();assert.equal(await page.evaluate(()=>OV),'title');await page.locator('.home-start[data-checkpoint="continue"]').click();await pending();assert.deepEqual(await graph(),before);assert.equal(await page.locator('.initiative-coin-screen').count(),0);
  });
  await check('Skipping the scene opens the real coin and preserves the five/six-card opening and draw order',async()=>{
   await page.locator('[data-boss-entrance="skip"]').click();await page.locator('.initiative-coin-screen').waitFor();await page.locator('[data-coin-choice="heads"]').click();await page.locator('.initiative-coin-toss').click();await settled();await closeChapter();
   const r=await page.evaluate(()=>({first:G.campaignFirst,hand:G.hand.map(c=>c.n),enemyTotal:G.eh.length+G.e.filter(Boolean).length,p:G.p.filter(Boolean).length,enemyCosts:G.e.filter(Boolean).map(c=>c.c),draw:G.draw.map(c=>c.n),turn:G.turn}));assert.equal(r.hand.length,r.first==='p'?5:6);assert.equal(r.enemyTotal,r.first==='p'?6:5);assert.equal(r.p,0);assert.ok(r.enemyCosts.every(c=>c===0));assert.equal(r.turn,1);assert.deepEqual(r.hand.slice(0,4),prepared.draw.slice(-4).reverse());assert.deepEqual(r.draw,prepared.draw.slice(0,-4));
  });
  await check('A double start resolves only one opening deal and one coin',async()=>{
   await page.evaluate(()=>{openInitiativeCoin=async()=>{window.entranceCoinCalls=(window.entranceCoinCalls||0)+1;return 'p'};const take=takeCard;window.entranceDealCalls=0;takeCard=function(...args){entranceDealCalls++;return take(...args)};newRun()});await pending();
   const r=await page.evaluate(async()=>{const first=beginBossEncounter(),second=beginBossEncounter();const values=await Promise.all([first,second]);return {values,calls:entranceDealCalls,coins:entranceCoinCalls,hand:G.hand.length,enemy:G.eh.length,playerBoard:G.p.filter(Boolean).length,enemyBoard:G.e.filter(Boolean).length}});assert.deepEqual(r.values,[true,false]);assert.equal(r.calls,10);assert.equal(r.coins,1);assert.equal(r.hand,5);assert.equal(r.enemy,6);assert.equal(r.playerBoard,0);assert.equal(r.enemyBoard,0);await closeChapter();
  });
  await check('The next Boss introduction precedes its first enemy deployment and fresh sacrifices remain immature',async()=>{
   await page.evaluate(()=>{const deploy=deployEnemyForRound;window.entranceEnemyCalls=0;deployEnemyForRound=async function(...args){entranceEnemyCalls++;return deploy(...args)};G.campaignFirst='p';G.lv=2;battle()});await pending();assert.equal(await page.evaluate(()=>entranceEnemyCalls),0);assert.equal(await page.evaluate(()=>G.hand.length+G.eh.length+G.p.filter(Boolean).length+G.e.filter(Boolean).length),0);
   await page.locator('.boss-entrance [data-boss-entrance="begin"]').click();await settled();const r=await page.evaluate(()=>({enemyCalls:entranceEnemyCalls,lv:G.lv,first:G.encounterFirst,cards:G.e.map((c,i)=>c&&{cost:c.c,sac:canSacrificeCard('e',i)}).filter(Boolean)}));assert.equal(r.lv,2);assert.equal(r.first,'e');assert.equal(r.enemyCalls,1);assert.ok(r.cards.every(c=>c.cost===0&&!c.sac));
  });
  await check('Rereading the current entrance does not advance the turn, redeal or alter any combat card',async()=>{
   const before=await graph();await page.evaluate(()=>{infoPanel='story';render()});await page.locator('[data-boss-entrance="read"]').click();assert.equal(await page.locator('.boss-entrance [data-boss-entrance="begin"]').count(),0);await page.locator('.boss-entrance .drawer-head [data-boss-entrance="close"]').click();assert.deepEqual(await graph(),before);assert.equal(await page.evaluate(()=>infoPanel),null);
  });
  await check('Replaying a cleared Boss also introduces it first without replacing the saved main battle',async()=>{
   await page.locator('.table-tools [data-a="home"]').click();const raw=await page.evaluate(()=>localStorage.getItem(CHECKPOINT_STORAGE));await page.evaluate(()=>replaySaveClears(new Set(['mire:1'])));await page.locator('[data-replay="open"]').click();await page.locator('[data-replay="start"][data-replay-world="mire"][data-replay-level="1"]').click();await pending();assert.equal(await page.evaluate(()=>G.replay),true);assert.equal(await page.evaluate(()=>G.hand.length+G.eh.length),0);assert.equal(await page.locator('.initiative-coin-screen').count(),0);await page.locator('.boss-entrance [data-boss-entrance="home"]').click();assert.equal(await page.evaluate(()=>localStorage.getItem(CHECKPOINT_STORAGE)),raw);
  });
  await check('Old in-progress v1.0.1 checkpoints resume their exact battle without inserting a new entrance',async()=>{
   const legacy=await browser.newContext();await legacy.addInitScript(storage=>{for(const[k,v]of Object.entries(storage))localStorage.setItem(k,v)},LEGACY.storage);const q=await legacy.newPage();q.on('pageerror',e=>errors.push(e.message));await q.goto(BASE);await q.waitForFunction(()=>window.BOOT?.ready&&G&&!G.busy);const r=await q.evaluate(()=>({state:{turn:G.turn,hp:G.hp,ehp:G.ehp,deck:G.deck.map(c=>c.n),hand:G.hand.map(c=>c.n),draw:G.draw.map(c=>c.n),p:G.p.map(c=>c&&{n:c.n,a:c.a,h:c.h,c:c.c,t:c.t}),e:G.e.map(c=>c&&{n:c.n,a:c.a,h:c.h,c:c.c,t:c.t}),boss:G.st.boss},pending:!!G.entrancePending}));assert.deepEqual(r.state,LEGACY.state);assert.equal(r.pending,false);assert.equal(await q.locator('.boss-entrance').count(),0);await legacy.close();
  });
  await check('Long entrance paragraphs and start/home controls remain reachable on four screens in both languages',async()=>{
   await page.evaluate(()=>newRun());await pending();
   for(const[width,height]of[[320,568],[390,759],[844,390],[1366,768]])for(const language of ['zh-CN','en']){
    await page.setViewportSize({width,height});const last=await page.evaluate(language=>{setGameLanguage(language);render();return bossEntranceCopy().text.split('\n').filter(Boolean).at(-1)},language);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    const paragraph=page.locator('.boss-entrance .drawer-scroll p').filter({hasText:last}).last();await paragraph.scrollIntoViewIfNeeded();const pbox=await paragraph.boundingBox();assert.ok(pbox&&pbox.x>=0&&pbox.x+pbox.width<=width+1&&pbox.y<height&&pbox.y+pbox.height>0);
    for(const selector of ['.boss-entrance .drawer-head [data-boss-entrance="begin"]','.boss-entrance [data-boss-entrance="home"]']){const node=page.locator(selector),box=await node.boundingBox();assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height+1,`${width}/${language}: ${selector}`);assert.ok(await node.evaluate(n=>{const r=n.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===n||n.contains(hit)}))}
    await page.screenshot({path:`/tmp/entrance-${width}x${height}-${language}.png`});const before=await graph();await page.locator('.boss-entrance [data-boss-entrance="home"]').click();await page.locator('.home-start[data-checkpoint="continue"]').click();await pending();assert.deepEqual(await graph(),before);
   }
   return {layouts:8};
  });
  assert.deepEqual(errors,[]);results.push({name:'No browser errors during entrance, continuation and legacy scenarios',passed:true});await context.close();
 }finally{fs.writeFileSync(path.join(__dirname,'entrance-results.json'),JSON.stringify(results,null,2)+'\n');await browser.close()}
 console.log(JSON.stringify({passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length}));
})().catch(e=>{console.error(e);process.exitCode=1});
