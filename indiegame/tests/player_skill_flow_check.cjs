// Exercise the real equipment/activation path and printed number feedback in both games.
const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const OUT=process.env.PLAYER_SKILL_TEST_OUTPUT||'/tmp/player-skill-flow';
const TARGETS=[
 {name:'game',url:process.env.GAME_TEST_URL||'http://127.0.0.1:8005/game/index.html'},
 {name:'indiegame',url:process.env.INDIE_TEST_URL||'http://127.0.0.1:8005/indiegame/index.html'}
];
const trigger='.player-boss-skill-trigger',panel='#player-boss-skill-panel',use=panel+' [data-player-boss-skill="use"]';
(async()=>{
 fs.mkdirSync(OUT,{recursive:true});
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 const results=[];
 const check=async(target,name,fn)=>{try{const proof=await fn();results.push({target,name,passed:true,...(proof?{proof}:{})});console.log('PASS',target,name)}catch(error){results.push({target,name,passed:false,error:error.stack||error.message});console.log('FAIL',target,name,error.message)}};
 const install=async(page)=>{
  await page.evaluate(()=>{
   window.setPlayerSkillFixture=(id='boss-09',options={})=>{
    closePlayerBossSkillPopover(false);closeBossAbilityPopover(false);
    infoPanel=null;detailCardOverride=null;HOLD_DETAIL=null;DM=null;TUT=null;OV=null;
    if(typeof STORY!=='undefined')STORY.pendingFriend=null;
    const ability=BOSS_ABILITIES.find(a=>a.id===id),template=POOL.find(c=>c.n===ability.boss);
    const source=makeCard(template),enemy=makeCard(POOL.find(c=>c.n===BOSS_ABILITIES.find(a=>a.id==='boss-01').boss),true);
    collectCard(template);source.t=1;enemy.t=1;
    if(!options.pristine){source.a=source.a0=2;source.h=source.h0=4;source.at='物理'}
    Object.assign(enemy,{a:2,a0:2,h:5,h0:5,at:'物理'});
    if(options.injured)source.h--;
    G={...G,p:[source,null,null,null,null],e:options.noTarget?Array(5).fill(null):[enemy,null,null,null,null],hand:options.noWick?[]:[makeCard(SQ)],eh:[makeCard(SQ)],hp:7,ehp:7,turn:options.turn||3,busy:0,mustDraw:0,freezeChoice:false,sel:null,moveSel:null,sac:new Set(),phase:'player-deploy',enemyDeployedTurn:options.turn||3,tutorial:false,replay:false,entrancePending:false,playerBossSkill:null};
    G.bossSkill={...G.bossSkill,temp:[],deferred:[],turnUsed:-1,usedCount:0,history:[]};
    playerBossSkillsInitBattle();render();
    return {boss:ability.boss,name:ability.name,a:source.a,h:source.h,hand:G.hand.length};
   };
  });
 };
 const prepare=async(context,url)=>{
  await require('./auto_entrances.cjs')(context);
  await context.addInitScript(()=>{for(const p of ['mz_','lo_']){localStorage.setItem(p+'tutorial_v1','done');localStorage.setItem(p+'music_mute','1')}});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.setDefaultTimeout(6000);await page.goto(url);await page.waitForFunction(()=>window.BOOT?.ready);
  await page.evaluate(()=>{mute=true;mmute=true;openInitiativeCoin=async()=> 'p';newRun()});
  await page.waitForFunction(()=>G&&!G.busy&&!drawRunning&&!G.entrancePending);
  await install(page);return {page,errors};
 };
 const reset=(page,id='boss-09',options={})=>page.evaluate(({id,options})=>setPlayerSkillFixture(id,options),{id,options});
 const state=page=>page.evaluate(()=>({turn:G.turn,hand:G.hand.map(c=>c.n),used:G.playerBossSkill.usedCount,turnUsed:G.playerBossSkill.turnUsed,armed:G.playerBossSkill.armed,a:G.p[0]?.a,h:G.p[0]?.h,enemyH:G.e[0]?.h}));
 const equip=async(page,id='boss-09',options={})=>{
  const fixture=await reset(page,id,options);await page.locator(trigger).click();
  assert.equal(await page.locator(panel).getAttribute('data-mode'),'equip');
  await page.locator(panel+' [data-player-boss-skill="equip"][data-player-skill-lane="0"]').click();
  await page.locator(panel).waitFor({state:'detached'});assert.equal(await page.locator(trigger+' .player-boss-skill-label').textContent(),'发动战技');return fixture;
 };
 const open=async page=>{await page.locator(trigger).click();await page.locator(panel).waitFor();assert.equal(await page.locator(panel).getAttribute('data-mode'),'effect')};
 const delta=(page,stat,n)=>page.locator(`.player-skill-delta[data-stat="${stat}"][data-delta="${n}"]`);
 try{
  for(const target of TARGETS){
   const context=await browser.newContext({viewport:{width:1366,height:768}}),{page,errors}=await prepare(context,target.url);
   await check(target.name,'Equipment closes the explanation and changes the visible action button',async()=>{
    await reset(page);assert.equal(await page.locator(trigger+' .player-boss-skill-label').textContent(),'装备战技');
    await equip(page);assert.equal(await page.locator(panel).count(),0);assert.equal(await page.evaluate(()=>G.playerBossSkill.usedCount),0);
   });
   await check(target.name,'Desktop hover describes the owned skill without spending or activating it',async()=>{
    await equip(page);await page.mouse.move(2,2);await page.waitForTimeout(700);const before=await state(page);
    await page.locator(trigger).hover();await page.locator(panel).waitFor();assert.equal(await page.locator(panel).getAttribute('data-mode'),'effect');
    assert.equal(await page.locator(panel+' .player-boss-skill-options').count(),0);
    assert.ok((await page.locator(panel).textContent()).includes(await page.evaluate(()=>playerBossSkillEquippedAbility().name)));
    assert.deepEqual(await state(page),before);assert.equal(await page.locator('.player-skill-delta').count(),0);
    await page.locator(panel).hover();assert.ok(await page.locator(panel).isVisible());await page.mouse.move(2,2);await page.locator(panel).waitFor({state:'detached'});
   });
   await check(target.name,'Keyboard inspection and Escape work without activating or immediately reopening',async()=>{
    await equip(page);const before=await state(page);await page.locator(trigger).focus();await page.keyboard.press('Enter');await page.locator(panel).waitFor();
    await page.keyboard.press('Escape');await page.locator(panel).waitFor({state:'detached'});await page.waitForTimeout(250);assert.equal(await page.locator(panel).count(),0);assert.deepEqual(await state(page),before);
   });
   await check(target.name,'A paid attack buff updates and animates its printed number exactly once',async()=>{
    await equip(page);const before=await state(page);await open(page);await page.locator(use).click();await page.locator(panel).waitFor({state:'detached'});
    const after=await state(page);assert.equal(after.a,before.a+1);assert.equal(after.hand.length,before.hand.length-1);assert.equal(after.used,1);assert.equal(after.turnUsed,3);
    await delta(page,'attack',1).first().waitFor();
    const printed=await page.locator('#c-p-0 .st>span:first-child').evaluate(n=>({text:n.textContent,animations:n.getAnimations().length,name:getComputedStyle(n).animationName}));
    assert.equal(Number(printed.text),after.a);assert.ok(printed.animations>0||printed.name!=='none','changed printed ATK has no pulse');
    await page.evaluate(()=>{render();render()});assert.equal(await delta(page,'attack',1).count(),1);
    assert.equal(await page.evaluate(()=>usePlayerBossSkill()),false);assert.deepEqual(await state(page),after);
    await page.screenshot({path:path.join(OUT,target.name+'-attack-buff-desktop.png')});return {before,after,printed};
   });
   await check(target.name,'Healing and shielding report their real distinct changes',async()=>{
    await equip(page,'boss-49',{injured:true});const before=await state(page);await open(page);await page.locator(use).click();
    assert.equal((await state(page)).h,before.h+1);assert.equal(await page.evaluate(()=>G.p[0].bossEffects.shield),1);
    await delta(page,'health',1).first().waitFor();await delta(page,'shield',1).first().waitFor();
    assert.equal(Number(await page.locator('#c-p-0 .st>span:last-child').textContent()),before.h+1);assert.equal(await delta(page,'health',2).count(),0);
   });
   await check(target.name,'A damage skill animates the enemy card health reduction',async()=>{
    await equip(page,'boss-03');const before=await state(page);await open(page);await page.locator(use).click();assert.equal((await state(page)).enemyH,before.enemyH-1);
    await delta(page,'health',-1).first().waitFor();assert.equal(Number(await page.locator('#c-e-0 .st>span:last-child').textContent()),before.enemyH-1);
   });
   await check(target.name,'Missing targets preserve the payment and create no visual success',async()=>{
    await equip(page,'boss-03',{noTarget:true});const before=await state(page);await open(page);
    if(await page.locator(use).isEnabled())await page.locator(use).click();else assert.equal(await page.evaluate(()=>usePlayerBossSkill()),false);
    assert.deepEqual(await state(page),before);assert.equal(await page.locator('.player-skill-delta').count(),0);
   });
   await check(target.name,'First-turn, payment and cooldown limits remain inspectable and unchanged',async()=>{
    await reset(page,'boss-09',{turn:1});await page.locator(trigger).click();assert.ok(await page.locator(panel+' [data-player-boss-skill="equip"]').first().isDisabled());assert.equal(await page.evaluate(()=>equipPlayerBossSkill(0)),false);
    await equip(page,'boss-09',{noWick:true});await open(page);assert.ok(await page.locator(use).isDisabled());assert.equal(await page.evaluate(()=>usePlayerBossSkill()),false);
    await equip(page);await open(page);await page.locator(use).click();await page.evaluate(()=>{G.turn=4;G.phase='player-deploy';G.hand=[makeCard(SQ)];render()});await open(page);assert.ok(await page.locator(use).isDisabled());assert.equal(await page.evaluate(()=>usePlayerBossSkill()),false);
   });
   await check(target.name,'After-attack powers animate only when their armed effect actually resolves',async()=>{
    await equip(page,'boss-10');const before=await state(page);await open(page);await page.locator(use).click();await page.locator(panel).waitFor({state:'detached'});
    const armed=await state(page);assert.ok(armed.armed);assert.equal(armed.used,0);assert.deepEqual(armed.hand,before.hand);assert.equal(armed.enemyH,before.enemyH);assert.equal(await page.locator('.player-skill-delta').count(),0);
    const resolved=await page.evaluate(()=>{G.playerBossSkill.enemyDirectDamage=1;G.phase='attacks-done';const result=runPlayerBossAbility('after_attack');render();return result});assert.ok(resolved);
    assert.equal((await state(page)).enemyH,before.enemyH-1);assert.equal((await state(page)).used,1);await delta(page,'health',-1).first().waitFor();
   });
   await check(target.name,'Delayed charge and summoned growth show their changes after viewing rules',async()=>{
    for(const id of ['boss-20','boss-47']){
     await equip(page,id);await open(page);await page.locator(use).click();
     assert.equal(await delta(page,'attack',1).count(),0,'preparing a delayed change must not show early ATK gains');
     const lane=id==='boss-47'?1:0;
     const before=await page.evaluate(lane=>({a:G.p[lane].a,h:G.p[lane].h}),lane);
     await page.evaluate(()=>{infoPanel='rules';render();infoPanel=null;render();bossAbilitiesRoundEnd();G.turn++;bossAbilitiesRoundStart();render()});
     const after=await page.evaluate(lane=>({a:G.p[lane].a,h:G.p[lane].h}),lane);
     assert.equal(after.a,before.a+1);if(id==='boss-47')assert.equal(after.h,before.h+1);
     await delta(page,'attack',1).first().waitFor();
     assert.equal(Number(await page.locator('#c-p-'+lane+' .st>span:first-child').textContent()),after.a);
     if(id==='boss-47')await delta(page,'health',1).first().waitFor();
    }
   });
   await check(target.name,'Next-turn equipment changes remain available and source departure restores Equip',async()=>{
    await equip(page);await page.evaluate(()=>{G.turn++;G.p[1]=makeCard(POOL.find(c=>c.n===BOSS_ABILITIES.find(a=>a.id==='boss-01').boss));G.p[1].t=1;render()});await open(page);
    await page.locator(panel+' [data-player-boss-skill="change"]').click();assert.equal(await page.locator(panel).getAttribute('data-mode'),'equip');await page.locator(panel+' [data-player-boss-skill="equip"][data-player-skill-lane="1"]').click();await page.locator(panel).waitFor({state:'detached'});
    assert.equal(await page.evaluate(()=>playerBossSkillEquippedAbility().id),'boss-01');await open(page);await page.evaluate(()=>{G.p[1]=null;render()});await page.locator(panel).waitFor({state:'detached'});assert.equal(await page.locator(trigger+' .player-boss-skill-label').textContent(),'装备战技');
   });
   await check(target.name,'Modal transitions and replacement battles clean up old numeric feedback',async()=>{
    await equip(page);await open(page);await page.locator(use).click();await delta(page,'attack',1).first().waitFor();await page.evaluate(()=>{infoPanel='rules';render()});assert.equal(await page.locator('.player-skill-delta').count(),0);
    await reset(page);assert.equal(await page.locator('.player-skill-delta').count(),0);await page.locator(trigger).click();await page.evaluate(()=>{OV='title';render()});await page.locator(panel).waitFor({state:'detached'});
   });
   await check(target.name,'Reduced-motion feedback remains readable and stationary, then expires',async()=>{
    await page.emulateMedia({reducedMotion:'reduce'});await equip(page);await open(page);await page.locator(use).click();const node=delta(page,'attack',1).first();await node.waitFor();const first=await node.boundingBox();await page.waitForTimeout(60);const second=await node.boundingBox();assert.ok(first&&second);assert.ok(Math.abs(first.x-second.x)<1&&Math.abs(first.y-second.y)<1);await node.waitFor({state:'detached',timeout:2200});await page.emulateMedia({reducedMotion:'no-preference'});
   });
   await check(target.name,'Reload restores equipped mechanics without persisting tooltips or animation nodes',async()=>{
    await equip(page,'boss-01',{pristine:true});const boss=await page.evaluate(()=>G.playerBossSkill.equippedBoss);await open(page);assert.ok(await page.evaluate(()=>checkpointSave()));await page.reload();await page.waitForFunction(()=>window.BOOT?.ready&&G&&!G.busy&&!drawRunning);assert.equal(await page.evaluate(()=>G.playerBossSkill.equippedBoss),boss);assert.equal(await page.locator(panel).count(),0);assert.equal(await page.locator('.player-skill-delta').count(),0);assert.equal(await page.locator(trigger+' .player-boss-skill-label').textContent(),'发动战技');await install(page);
   });
   assert.deepEqual(errors,[]);await context.close();
   const mobile=await browser.newContext({viewport:{width:390,height:759},hasTouch:true,isMobile:true}),setup=await prepare(mobile,target.url),phone=setup.page;
   await check(target.name,'A real mobile tap inspects first and the explicit second action activates once',async()=>{
    await reset(phone);await phone.locator(trigger).tap();await phone.locator(panel+' [data-player-boss-skill="equip"][data-player-skill-lane="0"]').tap();await phone.locator(panel).waitFor({state:'detached'});const before=await state(phone);
    await phone.locator(trigger).tap();await phone.locator(panel).waitFor();assert.deepEqual(await state(phone),before);assert.equal(await phone.locator('.player-skill-delta').count(),0);await phone.locator(use).tap();await phone.locator(panel).waitFor({state:'detached'});assert.equal((await state(phone)).a,before.a+1);assert.equal((await state(phone)).used,1);await delta(phone,'attack',1).first().waitFor();await phone.screenshot({path:path.join(OUT,target.name+'-attack-buff-phone.png')});
   });
   await check(target.name,'Equip and Activate labels and compact hints fit four viewports in both languages',async()=>{
    const proof=[];for(const [width,height]of[[320,568],[390,759],[844,390],[1366,768]]){await phone.setViewportSize({width,height});for(const language of ['zh-CN','en']){
     await reset(phone);await phone.evaluate(language=>{setGameLanguage(language);render()},language);
     const before=await phone.locator(trigger+' .player-boss-skill-label').textContent();assert.equal(before,language==='en'?'Equip Skill':'装备战技');await phone.evaluate(()=>{equipPlayerBossSkill(0);render()});assert.equal(await phone.locator(trigger+' .player-boss-skill-label').textContent(),language==='en'?'Activate Skill':'发动战技');
     const button=await phone.locator(trigger).evaluate(n=>{const r=n.getBoundingClientRect(),s=n.querySelector('.player-boss-skill-label'),label=s.getBoundingClientRect(),style=getComputedStyle(s);return {x:r.x,y:r.y,right:r.right,bottom:r.bottom,labelWidth:label.width,display:style.display,visibility:style.visibility,page:document.documentElement.scrollWidth}});assert.ok(button.x>=0&&button.right<=width+1&&button.y>=0&&button.bottom<=height+1,JSON.stringify(button));assert.ok(button.page<=width+1);assert.ok(button.labelWidth>24&&button.display!=='none'&&button.visibility!=='hidden',JSON.stringify(button));
     await phone.locator(trigger).tap();await phone.locator(panel).waitFor();await phone.locator(use).scrollIntoViewIfNeeded();const rect=await phone.locator(panel).boundingBox();assert.ok(rect&&rect.x>=0&&rect.y>=0&&rect.x+rect.width<=width+1&&rect.y+rect.height<=height+1,JSON.stringify(rect));if(language==='en')assert.ok(!/[\u3400-\u9fff]/.test(await phone.locator(panel).textContent()),await phone.locator(panel).textContent());
     if(language==='zh-CN'&&(width===390||width===844))await phone.screenshot({path:path.join(OUT,`${target.name}-hint-${width}.png`)});proof.push({width,height,language,button,panel:rect});await phone.locator(panel+' [data-player-boss-skill="close"]').tap();
    }}return proof;
   });
   await check(target.name,'Touching outside a compact hint dismisses it without activation',async()=>{
    await phone.setViewportSize({width:390,height:759});await reset(phone);await phone.evaluate(()=>{setGameLanguage('zh-CN');equipPlayerBossSkill(0);render()});const before=await state(phone);await phone.locator(trigger).tap();await phone.locator(panel).waitFor();await phone.touchscreen.tap(2,2);await phone.locator(panel).waitFor({state:'detached'});assert.deepEqual(await state(phone),before);assert.deepEqual(setup.errors,[]);
   });
   await mobile.close();
  }
 }finally{await browser.close();fs.writeFileSync(path.join(OUT,'results.json'),JSON.stringify(results,null,2)+'\n')}
 const failed=results.filter(r=>!r.passed);console.log(JSON.stringify({passed:results.length-failed.length,failed:failed.length,output:OUT}));assert.deepEqual(failed,[]);
})().catch(error=>{console.error(error);process.exitCode=1});
