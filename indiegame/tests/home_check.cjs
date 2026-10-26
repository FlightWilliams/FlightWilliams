const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const BASE=process.env.INDIE_TEST_URL||'http://127.0.0.1:8930/indiegame/index.html';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 const results=[];
 try{
  const context=await browser.newContext({viewport:{width:390,height:759},reducedMotion:'reduce'});
  await require('./auto_entrances.cjs')(context);await context.addInitScript(()=>{try{localStorage.setItem('lo_tutorial_v1','done');localStorage.setItem('lo_music_mute','1')}catch{}});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=async(name,fn)=>{const evidence=await fn();results.push({name,passed:true,...(evidence?{evidence}:{})});console.log('PASS',name)};
  const ready=()=>page.waitForFunction(()=>window.BOOT?.ready);
  const settled=()=>page.waitForFunction(()=>G&&!G.busy&&!drawRunning);
  const snapshot=()=>page.evaluate(()=>({game:checkpointGraphEncode(G),overlay:OV,name:pname,difficulty}));
  const home=async()=>{await page.locator('[data-a="home"]:visible').last().click();await page.waitForFunction(()=>OV==='title'&&G===null)};
  const resume=async()=>{await page.locator('.home-start[data-checkpoint="continue"]').click();await settled()};
  const coin=async()=>{await page.locator('.initiative-coin-screen').waitFor();await page.locator('[data-coin-choice="heads"]').click();await page.locator('.initiative-coin-toss').click();await settled()};
  await page.goto(BASE);await ready();const loadedScript=await page.evaluate(()=>[...document.scripts].map(script=>script.src).find(src=>src.includes('/assets/pact.')).split('/').pop()),loadedStyle=await page.evaluate(()=>document.querySelector('link[rel="stylesheet"]').href.split('/').pop());const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'../build-manifest.json'),'utf8'));assert.equal('assets/'+loadedScript,manifest.script);assert.equal('assets/'+loadedStyle,manifest.style);await page.locator('[data-language="en"]').click();
  const playerName='Eleanor Nightingale';await page.locator('#nm').fill(playerName);await page.locator('[data-a="start"]').click();await coin();
  if(await page.locator('.story-drawer').count())await page.locator('.story-drawer [data-a="closepanel"]').click();
  const wick=await page.evaluate(()=>G.hand.findIndex(c=>c.n==='余芯'));assert.ok(wick>=0);
  await page.locator(`.hand [data-a="h"][data-i="${wick}"]`).click();await page.locator('#c-p-2').click();await settled();
  await page.locator('[data-a="end"]').click();await page.waitForFunction(()=>G.turn===2&&!G.busy&&!drawRunning);
  let liveState,liveSaved;
  await check('A real second-round battle returns home and continues without redealing or losing the draw choice',async()=>{
   assert.equal(await page.evaluate(()=>G.p[2]?.n),'余芯');assert.equal(await page.evaluate(()=>G.mustDraw),1);
   liveState=await snapshot();await home();assert.match(await page.locator('.home-start').innerText(),/Continue Game/);
   assert.equal(await page.evaluate(()=>homepageRequested()),true);liveSaved=await page.evaluate(()=>localStorage.getItem(CHECKPOINT_STORAGE));
   await resume();assert.deepEqual(await snapshot(),liveState);assert.equal(await page.evaluate(()=>homepageRequested()),false);
   return {round:2,playerName,loadedScript,loadedStyle,preservedChoice:'draw from finite deck or Wick'};
  });
  await check('Reloading after Return Home stays on the homepage and the English player name survives Continue',async()=>{
   await home();await page.reload();await ready();assert.equal(await page.evaluate(()=>G),null);assert.equal(await page.evaluate(()=>OV),'title');assert.equal(await page.locator('.home-start[data-checkpoint="continue"]').count(),1);
   await resume();assert.deepEqual(await snapshot(),liveState);assert.equal(await page.evaluate(()=>pname),playerName);
  });
  await check('An unresolved freeze choice and active Boss skill state survive the home round trip',async()=>{
   await page.evaluate(()=>{G.freezeChoice=true;G.bossSkill.turnUsed=G.turn;G.bossSkill.usedCount++;render()});const before=await snapshot();await home();await resume();assert.deepEqual(await snapshot(),before);assert.equal(await page.evaluate(()=>G.freezeChoice),true);
   await page.evaluate(()=>{G.freezeChoice=false;render()});
  });
  await check('Resolving combat or a running draw disables Home and refuses programmatic exit',async()=>{
   for(const kind of ['combat','draw']){
    const r=await page.evaluate(kind=>{const original=G;G.busy=kind==='combat'?1:0;drawRunning=kind==='draw';render();const disabled=document.querySelector('.table-tools [data-a="home"]').disabled,returned=returnToHomepage(),kept=G===original&&OV===null;G.busy=0;drawRunning=false;render();return {disabled,returned,kept}},kind);
    assert.deepEqual(r,{disabled:true,returned:false,kept:true});
   }
  });
  await check('A storage write failure leaves the current cards and decision on the table',async()=>{
   const before=await page.evaluate(()=>{G.hp=Math.max(1,G.hp-1);const original=Storage.prototype.setItem;window.restoreStorageForHomeTest=()=>{Storage.prototype.setItem=original};Storage.prototype.setItem=function(key,value){if(key===CHECKPOINT_STORAGE)throw new DOMException('Quota exceeded','QuotaExceededError');return original.call(this,key,value)};render();return {game:checkpointGraphEncode(G),overlay:OV,name:pname,difficulty}});
   await page.locator('.table-tools [data-a="home"]').click();assert.deepEqual(await snapshot(),before);assert.equal(await page.evaluate(()=>OV),null);assert.ok(await page.getByText('Your progress could not be saved. Please try again.',{exact:true}).isVisible());
   await page.evaluate(()=>{restoreStorageForHomeTest();render()});
  });
  let rewardState;
  await check('Unclaimed rewards remain identical when Home is used from the reward overlay',async()=>{
   await page.evaluate(()=>{G.ehp=0;win()});await settled();assert.equal(await page.evaluate(()=>OV),'win');rewardState=await snapshot();
   assert.ok(await page.locator('.reward-screen [data-a="home"]').isVisible());await home();await resume();assert.deepEqual(await snapshot(),rewardState);assert.equal(await page.evaluate(()=>G.rewardClaimed),false);
  });
  await check('Leaving tutorial practice restores and saves the main campaign instead of the practice board',async()=>{
   await page.evaluate(()=>startTutorial());await page.waitForFunction(()=>G?.tutorial&&!G.busy&&!drawRunning);
   await home();const saved=await page.evaluate(()=>checkpointGraphDecode(checkpointRead().graph));assert.ok(!saved.tutorial);await resume();assert.deepEqual(await snapshot(),rewardState);
  });
  await check('Leaving a Boss replay from Home keeps the saved main rewards intact',async()=>{
   await home();const before=await page.evaluate(()=>localStorage.getItem(CHECKPOINT_STORAGE));await page.locator('[data-replay="open"]').click();await page.locator('[data-replay="start"][data-replay-world="mire"][data-replay-level="1"]').click();await coin();assert.equal(await page.evaluate(()=>G.replay),true);
   await home();assert.equal(await page.evaluate(()=>localStorage.getItem(CHECKPOINT_STORAGE)),before);await resume();assert.deepEqual(await snapshot(),rewardState);
  });
  await check('Home and Continue stay visible and clickable on four screens in both UI languages',async()=>{
   await page.evaluate(raw=>{G=null;OV='title';localStorage.setItem(CHECKPOINT_STORAGE,raw);setHomepageRequested(true);render()},liveSaved);
   for(const[width,height]of[[320,568],[390,759],[844,390],[1366,768]])for(const language of ['zh-CN','en']){
    await page.setViewportSize({width,height});await page.evaluate(language=>{setGameLanguage(language);render()},language);
    const button=page.locator('.home-start[data-checkpoint="continue"]'),box=await button.boundingBox();assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height+1,`${width}/${language}: Continue is outside viewport`);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    await page.screenshot({path:`/tmp/home-menu-${width}x${height}-${language}.png`});await resume();
    const header=page.locator('.table-tools [data-a="home"]'),bounds=await header.boundingBox();assert.ok(bounds&&bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=width+1&&bounds.y+bounds.height<=height+1,`${width}/${language}: Home is outside viewport`);
    assert.ok(await page.evaluate(()=>document.querySelector('[data-a="mute"]').nextElementSibling?.matches('.language-toggle')));
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:`/tmp/home-battle-${width}x${height}-${language}.png`});await home();
   }
   return {layouts:8};
  });
  await check('An unreadable saved game shows a restore message without leaving a broken battle',async()=>{
   await page.evaluate(()=>localStorage.setItem(CHECKPOINT_STORAGE,'not a valid saved game'));
   await page.locator('.home-start[data-checkpoint="continue"]').click();assert.equal(await page.evaluate(()=>G),null);assert.equal(await page.evaluate(()=>OV),'title');assert.ok(await page.getByText('Your progress could not be restored. Please try again.',{exact:true}).isVisible());
   await page.evaluate(raw=>{localStorage.setItem(CHECKPOINT_STORAGE,raw);render()},liveSaved);await resume();assert.deepEqual(await snapshot(),liveState);
  });
  assert.deepEqual(errors,[]);results.push({name:'No browser errors in save and navigation scenarios',passed:true});await context.close();
 }finally{fs.writeFileSync(path.join(__dirname,'home-results.json'),JSON.stringify(results,null,2)+'\n');await browser.close()}
 console.log(JSON.stringify({passed:results.length,failed:0}));
})().catch(error=>{console.error(error);process.exitCode=1});
