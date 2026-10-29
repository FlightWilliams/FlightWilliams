const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const targets=[
 {name:'indiegame',url:process.env.INDIE_TEST_URL||'http://127.0.0.1:8005/indiegame/index.html',prefix:'lo_'},
 {name:'game',url:process.env.GAME_TEST_URL||'http://127.0.0.1:8005/game/index.html',prefix:'mz_'}
];
const layer='#lifted-card-layer',hand='.game-shell .hand [data-a="h"]';

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 let passed=0;
 try{
  for(const target of targets)for(const mobile of [false,true]){
   const context=await browser.newContext({viewport:mobile?{width:390,height:759}:{width:1366,height:768},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'});
   await require('./auto_entrances.cjs')(context);
   await context.addInitScript(prefix=>{localStorage.setItem(prefix+'tutorial_v1','done');localStorage.setItem(prefix+'music_mute','1')},target.prefix);
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const cdp=mobile?await context.newCDPSession(page):null;
   const check=async(name,fn)=>{await fn();passed++;console.log('PASS',target.name,mobile?'touch':'desktop',name)};
   const center=async selector=>{const rect=await page.locator(selector).boundingBox();assert.ok(rect,selector+' is visible');return {x:rect.x+rect.width/2,y:rect.y+rect.height/2}};
   const click=async selector=>{if(mobile)await page.locator(selector).tap();else await page.locator(selector).click()};
   const touch=async(type,point)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints:point?[{...point,id:1,radiusX:1,radiusY:1,force:1}]:[]});
   const preview=async lane=>{
    const point=await center('#c-p-'+lane);
    if(mobile)await touch('touchStart',point);else await page.mouse.move(point.x,point.y);
    await page.waitForFunction(lane=>document.querySelector('#lifted-card-layer')?.dataset.lane===String(lane),lane);
   };
   const slide=async lane=>{
    const point=await center('#c-p-'+lane);
    if(mobile)await touch('touchMove',point);else await page.mouse.move(point.x,point.y);
    await page.waitForFunction(lane=>document.querySelector('#lifted-card-layer')?.dataset.lane===String(lane),lane);
   };
   const ghostGone=()=>page.locator(layer).waitFor({state:'detached'});
   const idle=()=>page.waitForFunction(()=>!G.busy&&!drawRunning);
   const reset=async options=>{await idle();await page.evaluate(options=>resetPickupFixture(options),options||{});await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))))};
   const gameState=()=>page.evaluate(()=>JSON.stringify({hand:G.hand,p:G.p,e:G.e,sel:G.sel,sac:[...G.sac],hp:G.hp,ehp:G.ehp}));
   const badge=()=>page.locator(layer+' > .card > .element-matchup');
   try{
    await page.goto(target.url);await page.waitForFunction(()=>window.BOOT?.ready);
    await page.evaluate(()=>{mute=true;mmute=true;openInitiativeCoin=async()=> 'p';newRun()});
    await page.waitForFunction(()=>G&&!G.busy&&!drawRunning&&G.phase==='player-deploy');
    await page.evaluate(()=>{
     window.resetPickupFixture=(options={})=>{
      OV=null;infoPanel=null;HOLD_DETAIL=null;DM=null;TUT=null;detailCardOverride=null;
      if(typeof STORY!=='undefined')STORY.pendingFriend=null;
      G.tutorial=false;G.turn=2;G.phase='player-deploy';G.entrancePending=false;G.enemyDeployedTurn=2;
      G.busy=0;G.mustDraw=0;G.freezeChoice=false;G.sel=null;G.moveSel=null;G.sac=new Set();G.hp=7;G.ehp=7;
      const card=(n,at='火',c=0)=>makeCard({n,a:2,h:10,c,at,kind:'mob'});
      G.hand=[card('Pickup Fire'),card('Pickup Paid','火',1),card('Pickup Frozen')];G.hand[2].frozenUntil=3;
      G.p=Array(5).fill(null);G.e=[card('Enemy Blood','血'),card('Enemy Thunder','雷'),card('Enemy Physical','物理'),null,card('Enemy Ice','冰')];
      if(options.sacrifices){G.p[0]={...makeCard(SQ),t:1};G.p[2]={...makeCard(SQ),t:2}}
      if(options.existingPair)G.p[0]={...card('Existing Magic','魔'),t:1};
      if(options.manyCards)G.hand=Array.from({length:14},(_,i)=>card('Scroll '+i));
      bossAbilitiesInitBattle();render();
     };resetPickupFixture();
    });

    await check('Clicking a hand card lifts one visual copy while preserving hand layout and game state',async()=>{
     const before=await page.locator(hand).first().boundingBox();
     await click(hand+'[data-i="0"]');await page.locator(layer).waitFor();
     assert.equal(await page.evaluate(()=>G.sel),0);assert.equal(await page.evaluate(()=>G.hand.length),3);
     assert.equal(await page.locator(layer+' > .card').count(),1);
     assert.equal(await page.locator(layer+' [data-a],'+layer+' [id]').count(),0,'The ghost must not duplicate actionable elements or board IDs');
     const after=await page.locator(hand).first().boundingBox();assert.ok(Math.abs(before.width-after.width)<1&&Math.abs(before.x-after.x)<1);
     assert.equal(await page.locator(hand+'[data-i="0"]').evaluate(n=>n.classList.contains('card-is-lifted')),true);
     assert.equal(await page.locator(layer).evaluate(n=>getComputedStyle(n).pointerEvents),'none');
    });

    await check('Moving over lanes previews green/red and neutral matchups without changing the game',async()=>{
     const before=await gameState();
     await preview(0);
     assert.equal(await badge().textContent(),'↑');assert.equal(await page.locator('#c-e-0 > .element-matchup').textContent(),'↓');
     const first=await page.locator(layer).boundingBox();
     await slide(1);assert.equal(await badge().textContent(),'↓');assert.equal(await page.locator('#c-e-1 > .element-matchup').textContent(),'↑');
     assert.equal(await page.locator('#c-e-0 > .element-matchup').count(),0,'Leaving a lane removes its temporary opponent arrow');
     const second=await page.locator(layer).boundingBox();assert.ok(Math.abs(second.x-first.x)>5,'The held card follows the pointer/finger');
     await slide(2);assert.equal(await badge().count(),0,'Physical matchup has no arrow');
     await slide(3);assert.equal(await badge().count(),0,'An empty opposing lane has no arrow');
     await slide(4);assert.equal(await badge().textContent(),'↑');
     assert.equal(await gameState(),before,'Hovering must not change cards, sacrifices, selection or life');
     await page.screenshot({path:`/tmp/${target.name}-pickup-${mobile?'touch':'desktop'}-preview.png`});
     if(mobile)await touch('touchCancel');else await page.keyboard.press('Escape');
     await ghostGone();assert.equal(await page.locator('.card-drop-preview,.card-matchup-preview').count(),0);
    });

    await check('A second tap/click deploys exactly once and keeps reciprocal arrows on the table',async()=>{
     await reset();await click(hand+'[data-i="0"]');await click('#c-p-0');await idle();await ghostGone();
     assert.deepEqual(await page.evaluate(()=>({hand:G.hand.length,placed:G.p.filter(Boolean).length,name:G.p[0]?.n,selected:G.sel})),{hand:2,placed:1,name:'Pickup Fire',selected:null});
     assert.equal(await page.locator('#c-p-0 > .element-matchup').textContent(),'↑');
     assert.equal(await page.locator('#c-e-0 > .element-matchup').textContent(),'↓');
     assert.equal(await page.locator('.card-is-lifted,.card-drop-preview,.card-matchup-preview').count(),0);
     await page.screenshot({path:`/tmp/${target.name}-pickup-${mobile?'touch':'desktop'}-placed.png`});
    });

    if(mobile)await check('Press, slide across lanes and release deploys only into the final lane',async()=>{
     await reset();await click(hand+'[data-i="0"]');await preview(0);await slide(1);
     assert.equal(await badge().textContent(),'↓');assert.equal(await page.evaluate(()=>G.p.filter(Boolean).length),0);
     await touch('touchEnd');await idle();await ghostGone();
     assert.deepEqual(await page.evaluate(()=>({hand:G.hand.length,lanes:G.p.map(c=>c?.n||null)})),{hand:2,lanes:[null,'Pickup Fire',null,null,null]});
     assert.equal(await page.locator('#c-p-1 > .element-matchup').textContent(),'↓');
     assert.equal(await page.locator('#c-e-1 > .element-matchup').textContent(),'↑');
    });

    if(mobile)await check('Releasing outside the board never plays into the original captured lane',async()=>{
     await reset();await click(hand+'[data-i="0"]');await preview(0);
     await touch('touchMove',{x:2,y:2});await touch('touchEnd');
     await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
     assert.equal(await page.evaluate(()=>G.hand.length),3);
     assert.equal(await page.evaluate(()=>G.p.filter(Boolean).length),0);
     await click('.interaction-bar [data-a="cancel"]');await ghostGone();
    });

    await check('Costs and maturity still require explicit sacrifice selection before a card can be dropped',async()=>{
     await reset({sacrifices:true});await click(hand+'[data-i="1"]');
     await click('#c-p-2');assert.deepEqual(await page.evaluate(()=>[...G.sac]),[],'A newly played ally is not a sacrifice');
     await click('#c-p-1');assert.equal(await page.evaluate(()=>G.p[1]),null,'No free paid deployment');
     await click('#c-p-0');assert.deepEqual(await page.evaluate(()=>[...G.sac]),[0]);
     assert.equal(await page.evaluate(()=>G.hand.length),3,'Selecting the first sacrifice must not also deploy');
     await click('#c-p-1');await idle();await ghostGone();
     assert.deepEqual(await page.evaluate(()=>({hand:G.hand.length,paid:G.p[1]?.n,used:G.p[0],fresh:G.p[2]?.t})),{hand:2,paid:'Pickup Paid',used:null,fresh:2});
     assert.equal(await page.locator('#c-p-1 > .element-matchup').textContent(),'↓');
    });

    await check('Frozen or unaffordable cards remain inspectable and cannot be placed',async()=>{
     for(const index of [1,2]){
      await reset();await click(hand+`[data-i="${index}"]`);await click('#c-p-0');await idle();
      assert.equal(await page.evaluate(()=>G.hand.length),3);assert.equal(await page.evaluate(()=>G.p.filter(Boolean).length),0);
      await click('.interaction-bar [data-a="details"]');await page.locator('.detail-card').waitFor();await ghostGone();
      await click('.drawer-head [data-a="closepanel"]');
     }
    });

    await check('Cancel, repeated selection and details remove floating cards and restore actual board arrows',async()=>{
     await reset({existingPair:true});
     const before=await page.locator('#c-e-0 > .element-matchup').count();
     await click(hand+'[data-i="0"]');
     if(!mobile){await preview(0);await page.keyboard.press('Escape')}
     else await click('.interaction-bar [data-a="cancel"]');
     await ghostGone();assert.equal(await page.locator('#c-e-0 > .element-matchup').count(),before);
     await click(hand+'[data-i="0"]');await click(hand+'[data-i="0"]');await ghostGone();
     assert.equal(await page.evaluate(()=>G.sel),null);
     await click(hand+'[data-i="0"]');await click('.interaction-bar [data-a="details"]');await ghostGone();
     assert.equal(await page.locator('.card-drop-preview,.card-matchup-preview').count(),0);
     await click('.drawer-head [data-a="closepanel"]');
     if(!mobile){
      await reset();await click(hand+'[data-i="0"]');await page.locator('#c-p-1').click({button:'right'});await ghostGone();
      assert.equal(await page.evaluate(()=>G.sel),null);
     }
    });

    await check('Phase changes and leaving the window clear the lifted presentation without deploying',async()=>{
     await reset();await click(hand+'[data-i="0"]');
     await page.evaluate(()=>{G.phase='enemy-deploy';render()});await ghostGone();
     await click('#c-p-0');await idle();
     assert.equal(await page.evaluate(()=>G.hand.length),3);
     assert.equal(await page.evaluate(()=>G.p.filter(Boolean).length),0);
     await reset();await click(hand+'[data-i="0"]');
     await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await ghostGone();
     assert.equal(await page.evaluate(()=>G.hand.length),3);
    });

    await check('The held card stays inside the viewport and exposes readable matchup arrows in English',async()=>{
     await page.evaluate(()=>setGameLanguage('en'));
     for(const [width,height]of(mobile?[[320,568],[390,759],[844,390]]:[[1366,768]])){
      await page.setViewportSize({width,height});await reset();await click(hand+'[data-i="0"]');await preview(4);
      const proof=await page.locator(layer).evaluate(n=>{
       const rect=n.getBoundingClientRect(),badge=n.querySelector('.element-matchup'),b=badge?.getBoundingClientRect();
       return {left:rect.left,top:rect.top,right:rect.right,bottom:rect.bottom,width:innerWidth,height:innerHeight,label:badge?.getAttribute('aria-label'),inside:!!b&&b.left>=rect.left-1&&b.right<=rect.right+1&&b.top>=rect.top-1&&b.bottom<=rect.bottom+1};
      });
      assert.ok(proof.left>=0&&proof.top>=0&&proof.right<=proof.width+1&&proof.bottom<=proof.height+1,`${width}: ghost extends outside the viewport`);
      assert.ok(proof.inside);assert.ok(proof.label&&!/[\u3400-\u9fff]/.test(proof.label),'Preview arrow needs a localized accessible label');
      if(mobile)await touch('touchCancel');else await page.keyboard.press('Escape');
      await ghostGone();
     }
     if(mobile)await page.setViewportSize({width:390,height:759});
     await page.evaluate(()=>setGameLanguage('zh-CN'));
    });

    if(mobile){
     await check('Long-press details remain available and do not play a card',async()=>{
      await reset();const point=await center(hand+'[data-i="0"]');await touch('touchStart',point);
      await page.locator('.card-hold-dialog').waitFor();await touch('touchEnd');await ghostGone();
      assert.deepEqual(await page.evaluate(()=>({hand:G.hand.length,placed:G.p.filter(Boolean).length})),{hand:3,placed:0});
      await click('.card-hold-head [data-a="hold-close"]');
     });
     await check('Horizontal hand scrolling does not pick up or play a card',async()=>{
      await reset({manyCards:true});
      const start=await center(hand+'[data-i="3"]'),handRect=await page.locator('.game-shell .hand').boundingBox();
      const initialScroll=await page.locator('.game-shell .hand').evaluate(n=>n.scrollLeft);
      const end={x:Math.max(handRect.x+8,start.x-160),y:start.y};
      await touch('touchStart',start);
      for(let step=1;step<=5;step++)await touch('touchMove',{x:start.x+(end.x-start.x)*step/5,y:start.y});
      await touch('touchEnd');await ghostGone();
      await page.waitForFunction(initial=>document.querySelector('.game-shell .hand').scrollLeft>initial,initialScroll);
      assert.equal(await page.evaluate(()=>G.sel),null);assert.equal(await page.evaluate(()=>G.hand.length),14);
      assert.equal(await page.evaluate(()=>G.p.filter(Boolean).length),0);
     });
    }
    await check('Tutorial pickup previews only the instructed lane and still uses the real placement rules',async()=>{
     await page.evaluate(async()=>{await startTutorial();TUT.overviewIndex=null;render()});await idle();
     const index=await page.evaluate(()=>G.hand.findIndex(c=>c.n===SQ.n));
     const board=await page.evaluate(()=>G.p.map(c=>c?.n||null));
     await click(hand+`[data-i="${index}"]`);await page.locator(layer).waitFor();
     await preview(0);assert.equal(await page.locator(layer).getAttribute('data-valid'),'false');
     assert.deepEqual(await page.evaluate(()=>G.p.map(c=>c?.n||null)),board);
     await slide(2);assert.equal(await page.locator(layer).getAttribute('data-valid'),'true');
     if(mobile)await touch('touchEnd');else await click('#c-p-2');
     await idle();await ghostGone();assert.equal(await page.evaluate(()=>G.p[2]?.n===SQ.n),true);
    });
    await check('No browser errors',async()=>assert.deepEqual(errors,[]));
   }finally{await context.close()}
  }
  console.log(JSON.stringify({passed,failed:0}));
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
