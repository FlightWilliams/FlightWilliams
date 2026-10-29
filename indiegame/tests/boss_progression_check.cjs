const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const targets=[
 {name:'indiegame',url:process.env.INDIE_TEST_URL||'http://127.0.0.1:8005/indiegame/index.html',prefix:'lo_'},
 {name:'game',url:process.env.GAME_TEST_URL||'http://127.0.0.1:8005/game/index.html',prefix:'mz_'}
];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});let passed=0;
 try{for(const target of targets){
  const context=await browser.newContext({viewport:{width:390,height:759},hasTouch:true,isMobile:true,reducedMotion:'reduce'});
  await require('./auto_entrances.cjs')(context);
  await context.addInitScript(prefix=>{localStorage.setItem(prefix+'tutorial_v1','done');localStorage.setItem(prefix+'music_mute','1')},target.prefix);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=async(name,fn)=>{await fn();passed++;console.log('PASS',target.name,name)};
  const idle=()=>page.waitForFunction(()=>G&&!G.busy&&!drawRunning&&!G.entrancePending);
  try{
   await page.goto(target.url);await page.waitForFunction(()=>window.BOOT?.ready);
   await page.evaluate(()=>{mute=true;mmute=true;openInitiativeCoin=async()=> 'p';newRun()});await idle();
   if(target.name==='indiegame')await check('The first chapter and first entrance explicitly explain the trapped night and reliable records',async()=>{
    const premise='灰厂起火以后，镇上就困在这一夜里。有些路走着走着又绕回来，人的记忆也留不全；他不知道这一切怎么开始的，只知道纸和录音比人的记性可靠。';
    const story=await page.evaluate(()=>({intro:storyChapter('mire','intro').text,entrance:bossEntranceCopy(CAMPAIGNS.mire[0].boss).text,journal:storyJournalHTML()}));
    assert.ok(story.intro.includes(premise));assert.ok(story.entrance.includes(premise));assert.ok(story.journal.includes(premise));
   });
   for(const full of [false,true])await check((full?'Full':'Normal')+' deck reward goes directly to the next Boss and survives reload',async()=>{
    await page.evaluate(full=>{
     infoPanel=null;DM=null;HOLD_DETAIL=null;
     if(full)while(G.deck.length<DECK_MAX)G.deck.push(makeCard(SQ));
     G.ehp=0;win();
    },full);
    await page.locator('.reward-screen').waitFor();
    assert.equal(await page.locator('.reward-screen [data-a="home"]').count(),0);
    assert.match(await page.locator('.reward-continue-note').innerText(),/下一位Boss/);
    const before=await page.evaluate(()=>({lv:G.lv,boss:G.st.boss,deck:G.deck.length,reserve:G.reserve.length,reward:G.rw[0].n}));
    await page.locator('.reward-row [data-a="rw"]').first().tap();await idle();
    const after=await page.evaluate(()=>({lv:G.lv,boss:G.st.boss,overlay:OV,manager:!!DM,deck:G.deck.length,reserve:G.reserve.length}));
    assert.equal(after.lv,before.lv+1);assert.notEqual(after.boss,before.boss);assert.equal(after.overlay,null);assert.equal(after.manager,false);
    if(full){assert.equal(after.deck,36);assert.equal(after.reserve,before.reserve+1)}
    assert.ok(await page.evaluate(name=>[...G.deck,...G.reserve].some(c=>c.n===name),before.reward));
    await page.reload();await page.waitForFunction(()=>window.BOOT?.ready);await idle();
    assert.deepEqual(await page.evaluate(()=>({lv:G.lv,boss:G.st.boss,overlay:OV,manager:!!DM})),{lv:after.lv,boss:after.boss,overlay:null,manager:false});
   });
   for(const legacy of [false,true])await check((legacy?'Legacy camp save':'Reward transition save')+' resumes the next Boss exactly once',async()=>{
    const transition=await page.evaluate(()=>{
     infoPanel=null;G.ehp=0;win();const prior=nextStage,lv=G.lv;let saved;
     try{nextStage=()=>{saved=checkpointRead()};claimReward(0)}finally{nextStage=prior}
     return {lv,mode:saved.mode,overlay:saved.overlay,reserve:G.reserve.map(c=>c.n)};
    });
    assert.equal(transition.mode,'next');assert.equal(transition.overlay,null);
    if(legacy)await page.evaluate(()=>{const saved=checkpointRead();saved.overlay='camp';saved.mode='state';localStorage.setItem(CHECKPOINT_STORAGE,JSON.stringify(saved))});
    await page.reload();await page.waitForFunction(()=>window.BOOT?.ready);await idle();
    assert.deepEqual(await page.evaluate(()=>({lv:G.lv,overlay:OV,manager:!!DM,reserve:G.reserve.map(c=>c.n)})),{lv:transition.lv+1,overlay:null,manager:false,reserve:transition.reserve});
   });
   await check('Final rewards keep chapter conclusions instead of going home or opening deck management',async()=>{
    await page.evaluate(()=>{G.lv=STG.length;G.st=STG[G.lv-1];G.st.dk=stageDeck(G.st);G.ehp=0;G.tierRecorded=false;G.bossFarewell=null;win()});
    await page.locator('.reward-screen').waitFor();assert.equal(await page.locator('.reward-row [data-a="rw"]').count(),3);
    await page.locator('.reward-row [data-a="rw"]').first().tap();
    assert.deepEqual(await page.evaluate(()=>({overlay:OV,manager:!!DM,saved:checkpointRead()?.overlay})),{overlay:'clear',manager:false,saved:'clear'});
   });
   await check('No browser errors',async()=>assert.deepEqual(errors,[]));
  }finally{await context.close()}
 }}finally{await browser.close()}
 console.log(JSON.stringify({passed,failed:0}));
})().catch(error=>{console.error(error);process.exitCode=1});
