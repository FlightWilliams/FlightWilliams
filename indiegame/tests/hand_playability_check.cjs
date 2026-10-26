const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const targets=[
 {name:'indiegame',url:process.env.INDIE_TEST_URL||'http://127.0.0.1:8001/indiegame/index.html',prefix:'lo_'},
 {name:'game',url:process.env.GAME_TEST_URL||'http://127.0.0.1:8001/game/index.html',prefix:'mz_'}
];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 let passed=0;
 try{
  for(const target of targets){
   const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce'});
   await require('./auto_entrances.cjs')(context);
   await context.addInitScript(prefix=>{localStorage.setItem(prefix+'tutorial_v1','done');localStorage.setItem(prefix+'music_mute','1')},target.prefix);
   const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
   const check=async(name,fn)=>{await fn();passed++;console.log('PASS',target.name,name)};
   try{
    await page.goto(target.url);await page.waitForFunction(()=>window.BOOT?.ready);
    await page.evaluate(()=>{mute=true;mmute=true;openInitiativeCoin=async()=> 'p';newRun()});
    await page.waitForFunction(()=>G&&!G.busy&&!drawRunning);
    await page.evaluate(()=>{
     window.resetHandFixture=()=>{
      infoPanel=null;HOLD_DETAIL=null;DM=null;TUT=null;OV=null;
      if(typeof STORY!=='undefined')STORY.pendingFriend=null;
      G.tutorial=false;G.turn=2;G.phase='player-deploy';G.entrancePending=false;G.enemyDeployedTurn=2;
      G.busy=0;G.mustDraw=0;G.freezeChoice=false;G.sel=null;G.moveSel=null;G.sac=new Set();
      G.p=Array(5).fill(null);G.e=Array(5).fill(null);G.hp=7;G.ehp=7;
      const one=POOL.find(c=>c.c===1&&!c.dr&&!c.heal&&!c.dd&&!c.death&&!c.x&&c.s!=='abyss'&&c.rarity!=='rare');
      G.hand=[makeCard({...SQ,fod:true}),makeCard({...one,c:1}),makeCard({...one,c:2}),makeCard({...POOL.find(c=>c.rarity==='rare'),c:1})];
     };
     resetHandFixture();render();
    });
    const states=()=>page.evaluate(()=>G.hand.map(canPlayHandCard));
    const classes=()=>page.locator('.hand [data-a="h"]').evaluateAll(nodes=>nodes.map(n=>({bright:n.classList.contains('hand-playable'),dark:n.classList.contains('hand-unplayable')})));
    await check('Free cards are bright, unaffordable cards are dark, and selecting sacrifices is not a prerequisite',async()=>{
     assert.deepEqual(await states(),[true,false,false,false]);
     assert.deepEqual(await classes(),[{bright:true,dark:false},{bright:false,dark:true},{bright:false,dark:true},{bright:false,dark:true}]);
     await page.evaluate(()=>{G.p[0]={...makeCard(SQ),t:1};render()});
     assert.deepEqual(await states(),[true,true,false,true]);
     await page.click('.hand [data-i="1"]');
     assert.equal(await page.evaluate(()=>G.sac.size),0);
     assert.deepEqual(await states(),[true,true,false,true]);
    });
    await check('Newly deployed and sacrifice-prohibited cards do not pay costs; maturity updates the same hand nodes',async()=>{
     assert.deepEqual(await page.evaluate(()=>{G.p[0].t=G.turn;renderSelection();return G.hand.map(canPlayHandCard)}),[true,false,false,false]);
     assert.equal((await classes())[1].dark,true);
     assert.deepEqual(await page.evaluate(()=>{G.p[0].t=1;G.p[0].bossNoSacrifice=true;renderSelection();return G.hand.map(canPlayHandCard)}),[true,false,false,false]);
     assert.deepEqual(await page.evaluate(()=>{delete G.p[0].bossNoSacrifice;G.p[1]={...makeCard(SQ),t:1};render();return G.hand.map(canPlayHandCard)}),[true,true,true,true]);
    });
    await check('A full board blocks zero-cost deployment but allows replacement through mature sacrifices',async()=>{
     await page.evaluate(()=>{G.p=Array.from({length:5},()=>({...makeCard(SQ),t:1}));render()});
     assert.deepEqual(await states(),[false,true,true,true]);
     assert.equal((await classes())[0].dark,true);
    });
    await check('Both freezing types darken cards; thawing and cost discounts refresh availability',async()=>{
     await page.evaluate(()=>{resetHandFixture();G.p[0]={...makeCard(SQ),t:1};G.hand[1].frozenUntil=3;G.hand[3].bossFrozenUntil=3;render()});
     assert.deepEqual(await states(),[true,false,false,false]);
     await page.evaluate(()=>{G.turn=3;thawHandCards();render()});
     assert.equal(await page.evaluate(()=>frozenTurns(G.hand[1])),0);
     assert.equal(await page.evaluate(()=>canPlayHandCard(G.hand[1])),true);
     assert.equal(await page.evaluate(()=>canPlayHandCard(G.hand[3])),true);
    });
    await check('Resolution, required draws, freeze choices and overlays suppress deployment brightness',async()=>{
     const result=await page.evaluate(()=>{
      resetHandFixture();const out=[];
      for(const key of ['busy','mustDraw','freezeChoice']){G[key]=1;updateHandPlayability();out.push(G.hand.every(c=>!canPlayHandCard(c)));G[key]=0}
      drawRunning=true;out.push(G.hand.every(c=>!canPlayHandCard(c)));drawRunning=false;
      OV='win';out.push(G.hand.every(c=>!canPlayHandCard(c)));OV=null;
      render();return out;
     });
     assert.ok(result.every(Boolean));
    });
    await check('Tutorial brightness follows the allowed ash and flyer steps, with every card dimmed during the overview',async()=>{
     const steps=await page.evaluate(()=>{
      resetHandFixture();const saved=G,savedTutorial=TUT;
      try{
       const flyerName=SQ.n==='余芯'?'苔庭铜缄掠风鸟':'巨鸦';
       G={...G,tutorial:true,turn:1,hand:[makeCard(SQ),makeCard(POOL.find(c=>c.n===flyerName)),makeCard({...POOL.find(c=>c.c===1),c:0})],p:Array(5).fill(null),sac:new Set()};
       TUT={step:'overview',overviewIndex:0,feedback:'',finished:false};
       const snapshot=()=>{render();return {step:TUT.step,eligible:G.hand.map(canPlayHandCard),bright:[...document.querySelectorAll('.hand [data-a="h"]')].map(n=>n.classList.contains('hand-playable'))}};
       const out=[snapshot()];
       TUT.overviewIndex=null;out.push(snapshot());
       G.sel=0;out.push(snapshot());
       G.sel=null;G.p[2]={...makeCard(SQ),t:1};out.push(snapshot());
       G.turn=2;out.push(snapshot());
       G.sel=1;out.push(snapshot());
       G.sac.add(2);out.push(snapshot());return out;
      }finally{G=saved;TUT=savedTutorial;resetHandFixture();render()}
     });
     const expected=[['overview',[false,false,false]],['ash',[true,false,false]],['place',[true,false,false]],['wait',[false,false,false]],['card',[false,true,false]],['sac',[false,true,false]],['summon',[false,true,false]]];
     assert.deepEqual(steps,expected.map(([step,eligible])=>({step,eligible,bright:eligible})));
    });
    await check('A drawn card changes from dim during its flight to the correct brightness when the animation finishes',async()=>{
     await page.emulateMedia({reducedMotion:'no-preference'});
     const during=await page.evaluate(()=>{
      resetHandFixture();render();takeCard('p',true);render();
      return {running:drawRunning,dim:[...document.querySelectorAll('.hand [data-a="h"]')].every(n=>n.classList.contains('hand-unplayable'))};
     });
     assert.ok(during.running&&during.dim);
     await page.evaluate(async()=>{await drawIdle});
     assert.deepEqual(await states(),[true,false,false,false,true]);
     assert.deepEqual(await classes(),[true,false,false,false,true].map(bright=>({bright,dark:!bright})));
     await page.emulateMedia({reducedMotion:'reduce'});
    });
    await check('Brightness remains distinct for normal and gold cards on desktop and phone',async()=>{
     await page.evaluate(()=>{resetHandFixture();G.hand[3].c=0;render()});
     for(const [width,height] of [[1366,768],[390,759]]){
      await page.setViewportSize({width,height});
      const proof=await page.locator('.hand [data-a="h"]').evaluateAll(nodes=>nodes.map(node=>({filter:getComputedStyle(node).filter,rare:node.classList.contains('rare-card'),events:getComputedStyle(node).pointerEvents})));
      const brightness=s=>Number((s.match(/brightness\(([^)]+)\)/)||[])[1]);
      assert.ok(brightness(proof[0].filter)>brightness(proof[1].filter));
      assert.ok(proof[3].rare&&brightness(proof[3].filter)>brightness(proof[1].filter));
      assert.ok(proof.every(p=>p.events!=='none'));
     }
     await page.screenshot({path:'/workspace/.onboarding/'+target.name+'-hand-brightness.png'});
    });
    await check('Dim cards can still be selected and inspected without being deployed',async()=>{
     await page.click('.hand [data-i="1"]');
     assert.equal(await page.evaluate(()=>G.sel),1);
     assert.ok(await page.locator('.hand [data-i="1"]').evaluate(node=>node.classList.contains('hand-unplayable')&&node.classList.contains('sel')));
     await page.click('.interaction-bar [data-a="details"]');
     await page.locator('.detail-card').waitFor();
     assert.equal(await page.evaluate(()=>G.hand.length),4);
     await page.evaluate(()=>{infoPanel=null;render()});
    });
    await check('Deploying a playable card consumes its sacrifice and immediately darkens newly unaffordable cards',async()=>{
     await page.evaluate(()=>{resetHandFixture();G.p[0]={...makeCard(SQ),t:1};render()});
     await page.click('.hand [data-i="1"]');await page.click('#c-p-0');await page.click('#c-p-0');
     await page.waitForFunction(()=>!G.busy&&!drawRunning&&G.hand.length===3);
     assert.equal(await page.evaluate(()=>G.p[0].t),2);
     assert.deepEqual(await states(),[true,false,false]);
     assert.deepEqual(await classes(),[{bright:true,dark:false},{bright:false,dark:true},{bright:false,dark:true}]);
    });
    await check('No browser errors',async()=>assert.deepEqual(errors,[]));
   }finally{await context.close()}
  }
  console.log(JSON.stringify({passed,failed:0}));
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
