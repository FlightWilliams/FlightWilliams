const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const BASE=process.env.INDIE_TEST_URL||'http://127.0.0.1:8005/indiegame/index.html';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});let passed=0;
 const context=await browser.newContext({viewport:{width:390,height:759},reducedMotion:'reduce'});
 await require('./auto_entrances.cjs')(context);
 await context.addInitScript(()=>{localStorage.setItem('lo_tutorial_v1','done');localStorage.setItem('lo_music_mute','1')});
 const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 const check=async(name,fn)=>{await fn();passed++;console.log('PASS',name)};
 const idle=()=>page.waitForFunction(()=>G&&!G.busy&&!drawRunning&&!G.entrancePending&&G.phase==='player-deploy');
 const closeStory=async()=>{if(await page.locator('.story-drawer .drawer-head [data-a="closepanel"]').count())await page.locator('.story-drawer .drawer-head [data-a="closepanel"]').click()};
 try{
  await page.goto(BASE);await page.waitForFunction(()=>window.BOOT?.ready);
  await page.evaluate(()=>{mute=true;mmute=true;openInitiativeCoin=async()=> 'p';newRun()});await idle();await closeStory();
  await check('The first journey retains the original enemy and player statistics across all 96 stages',async()=>{
   const data=await page.evaluate(()=>{
    const previous=difficulty,loop=G.spiralLoop,rows=[];
    try{G.spiralLoop=0;for(const [world,stages]of Object.entries(CAMPAIGNS)){difficulty=world;for(const stage of stages){const base=POOL.find(c=>c.n===stage.boss),card=eCard(stage.boss,stage);rows.push({a:card.a,h:card.h,c:card.c,base:{a:base.a,h:base.h,c:base.c},bonus:base.c>=2?RULES[world].bonus:0,player:makeCard(base)})}}}
    finally{difficulty=previous;G.spiralLoop=loop}return rows;
   });
   assert.equal(data.length,96);for(const row of data){assert.equal(row.a,row.base.a);assert.equal(row.h,row.base.h+row.bonus);assert.equal(row.c,row.base.c);assert.equal(row.player.a,row.base.a);assert.equal(row.player.h,row.base.h)}
  });
  await check('Every later cycle makes all 96 Bosses and their ordinary retinues stronger without editing the card pool',async()=>{
   const data=await page.evaluate(()=>{
    const previous=difficulty,loop=G.spiralLoop,pool=JSON.stringify(POOL),rows=[];
    try{for(const [world,stages]of Object.entries(CAMPAIGNS)){difficulty=world;for(const stage of stages){
     const ids=[...new Set([stage.boss,...stageDeck(stage)])];
     for(const id of ids){const source=POOL.find(c=>c.n===id);if(source.token||source.fod||source.n==='余芯')continue;const cards=[];for(const cycle of [0,1,2,3,8]){G.spiralLoop=cycle;cards.push(eCard(id,stage))}rows.push(cards.map(c=>({a:c.a,h:c.h,a0:c.a0,h0:c.h0,c:c.c,n:c.n})))}
    }}}finally{difficulty=previous;G.spiralLoop=loop}
    return {rows,unchanged:pool===JSON.stringify(POOL)};
   });
   assert.ok(data.unchanged);assert.ok(data.rows.length>=96);
   for(const cards of data.rows){const base=cards[0];assert.equal(cards[1].a,base.a+1);assert.equal(cards[1].h,base.h+1);assert.equal(cards[2].h,base.h+2);assert.equal(cards[3].a,base.a+2);for(let i=1;i<cards.length;i++){assert.ok(cards[i].h>cards[i-1].h);assert.ok(cards[i].a>=cards[i-1].a);assert.equal(cards[i].c,base.c);assert.equal(cards[i].n,base.n);assert.equal(cards[i].a0,cards[i].a);assert.equal(cards[i].h0,cards[i].h)}}
  });
  await check('Player cards, Wicks, summoned tokens and bounded AI search keep their existing rules',async()=>{
   const result=await page.evaluate(()=>{
    const loop=G.spiralLoop,source=POOL.find(c=>c.kind==='boss'&&c.rarity!=='rare'),player=makeCard(source),profile=aiProfile();
    try{G.spiralLoop=8;const wick=takeCard('e',true),token=bossSummon('e',{n:'Spiral Test Token',a:1,h:2,c:0,at:'物理'},{lane:4});const highProfile=aiProfile();G.e[4]=null;return {player:{a:player.a,h:player.h,c:player.c},source:{a:source.a,h:source.h,c:source.c},wick:{a:wick.a,h:wick.h,c:wick.c},token:{a:token.a,h:token.h,c:token.c},budget:[profile.depth,profile.beam,profile.rounds],highBudget:[highProfile.depth,highProfile.beam,highProfile.rounds]}}
    finally{G.spiralLoop=loop}
   });
   assert.deepEqual(result.player,result.source);assert.deepEqual(result.wick,{a:0,h:1,c:0});assert.deepEqual(result.token,{a:1,h:2,c:0});assert.deepEqual(result.highBudget,result.budget);
  });
  for(const nextLoop of [1,2,3])await check('Claiming the final chapter reward and continuing really starts cycle '+(nextLoop+1)+' at Fogtown',async()=>{
   const before=await page.evaluate(()=>{
    infoPanel=null;DM=null;HOLD_DETAIL=null;G.ehp=0;G.tierRecorded=false;G.rewardClaimed=false;
    difficulty='astral';STG.splice(0,STG.length,...CAMPAIGNS.astral.map(st=>({...st,dk:[]})));G.lv=STG.length;G.st=STG[G.lv-1];G.st.dk=stageDeck(G.st);G.wins=STG.length-1;G.bossFarewell=null;OV=null;
    journey.cleared=5;journey.unlocked=6;storeJourney();win();return {deck:G.deck.map(c=>c.n),friends:Object.keys(STORY.friends)};
   });
   await page.locator('.reward-row [data-a="rw"]').first().click();await page.waitForFunction(()=>OV==='clear'&&G.rewardClaimed);
   const chosen=await page.evaluate(()=>[...G.deck,...G.reserve].map(c=>c.n));
   await page.locator('.story-clear [data-a="nextdifficulty"]').click();await idle();
   const after=await page.evaluate(()=>({difficulty,lv:G.lv,loop:G.spiralLoop,globalLoop:journey.loops,cleared:journey.cleared,deck:[...G.deck,...G.reserve].map(c=>c.n),friends:Object.keys(STORY.friends),text:storyJournalHTML(),returnText:LOOP_STORY.loop.zh.returnText,enemy:[...G.ed,...G.eh,...G.e.filter(Boolean)].filter(c=>!c.fod&&c.n!=='余芯').map(c=>({a:c.a,h:c.h,base:POOL.find(p=>p.n===c.n)}))}));
   assert.equal(after.difficulty,'mire');assert.equal(after.lv,1);assert.equal(after.loop,nextLoop);assert.equal(after.globalLoop,nextLoop);assert.equal(after.cleared,0);
   for(const id of chosen)assert.ok(after.deck.includes(id));for(const id of before.friends)assert.ok(after.friends.includes(id));assert.ok(after.text.includes(after.returnText.split('\n')[0]));assert.ok(after.enemy.every(c=>c.a>c.base.a&&c.h>c.base.h));
   await closeStory();
  });
  await check('Reloading preserves the current cycle, actual upgraded battle cards and both language labels',async()=>{
   const before=await page.evaluate(()=>({loop:G.spiralLoop,world:difficulty,lv:G.lv,cards:checkpointGraphEncode({p:G.p,e:G.e,hand:G.hand,eh:G.eh,ed:G.ed,draw:G.draw})}));
   await page.reload();await page.waitForFunction(()=>window.BOOT?.ready&&G);await idle();
   const after=await page.evaluate(()=>({loop:G.spiralLoop,world:difficulty,lv:G.lv,cards:checkpointGraphEncode({p:G.p,e:G.e,hand:G.hand,eh:G.eh,ed:G.ed,draw:G.draw})}));assert.deepEqual(after,before);
   for(const language of ['zh-CN','en']){await page.evaluate(language=>setGameLanguage(language),language);const label=page.locator('.table-brand .spiral-difficulty');assert.equal(await label.innerText(),language==='en'?'Cycle 4':'第4周目');assert.match(await label.getAttribute('title'),language==='en'?/\+2 ATK, \+3 HP/:/攻击\+2、生命\+3/)}
   await page.evaluate(()=>setGameLanguage('zh-CN'));
  });
  await check('Older checkpoints with no cycle snapshot resume their exact cards at the saved journey cycle',async()=>{
   const before=await page.evaluate(()=>{
    const saved=checkpointRead(),game=checkpointGraphDecode(saved.graph);delete game.spiralLoop;delete saved.spiralLoop;delete saved.journeyLoops;saved.graph=checkpointGraphEncode(game);localStorage.setItem(CHECKPOINT_STORAGE,JSON.stringify(saved));
    return {loop:journey.loops,hand:G.hand.map(c=>[c.n,c.a,c.h]),enemy:[...G.eh,...G.ed].map(c=>[c.n,c.a,c.h])};
   });
   await page.reload();await page.waitForFunction(()=>window.BOOT?.ready&&G);await idle();
   assert.deepEqual(await page.evaluate(()=>({loop:G.spiralLoop,hand:G.hand.map(c=>[c.n,c.a,c.h]),enemy:[...G.eh,...G.ed].map(c=>[c.n,c.a,c.h])})),before);
  });
  await check('Cycle labels stay inside the battle header on small portrait and landscape screens in both languages',async()=>{
   for(const [width,height]of[[320,568],[390,759],[844,390]])for(const language of ['zh-CN','en']){
    await page.setViewportSize({width,height});await page.evaluate(language=>{setGameLanguage(language);layoutGame()},language);
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    const proof=await page.locator('.table-brand .spiral-difficulty.is-compact').evaluate(node=>{const r=node.getBoundingClientRect(),header=node.closest('.table-topbar').getBoundingClientRect();return {x:r.left,y:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height,header:{x:header.left,y:header.top,right:header.right,bottom:header.bottom},overflow:document.documentElement.scrollWidth>innerWidth+1}});
    assert.ok(proof.width>0&&proof.height>0&&proof.x>=0&&proof.y>=0&&proof.right<=width+1&&proof.bottom<=height+1&&!proof.overflow,JSON.stringify({width,height,language,proof}));
    assert.ok(proof.x>=proof.header.x-1&&proof.right<=proof.header.right+1&&proof.y>=proof.header.y-1&&proof.bottom<=proof.header.bottom+1,JSON.stringify({width,height,language,proof}));
   }
  });
  await check('The saved cycle metadata rejects stale loops and supports high-cycle enemy card statistics',async()=>{
   const result=await page.evaluate(()=>{
    const saved=checkpointRead(),game=checkpointGraphDecode(saved.graph),original=game.spiralLoop;game.spiralLoop=2000;
    const old=G;G=game;game.e[0]=eCard(game.st.boss,game.st);G=old;
    const high=checkpointGameValid(game,{...saved,spiralLoop:2000});
    const mismatch=checkpointGameValid(game,{...saved,spiralLoop:original});
    saved.journeyLoops=(journey.loops||0)+1;localStorage.setItem(CHECKPOINT_STORAGE,JSON.stringify(saved));const stale=checkpointRestore();
    return {high,mismatch,stale};
   });assert.deepEqual(result,{high:true,mismatch:false,stale:false});
  });
  await check('No browser errors',async()=>assert.deepEqual(errors,[]));
  console.log(JSON.stringify({passed,failed:0}));
 }finally{await context.close();await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
