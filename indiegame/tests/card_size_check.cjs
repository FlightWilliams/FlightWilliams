const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const targets=[
 {name:'indiegame',url:process.env.INDIE_TEST_URL||'http://127.0.0.1:8005/indiegame/index.html',prefix:'lo_'},
 {name:'game',url:process.env.GAME_TEST_URL||'http://127.0.0.1:8005/game/index.html',prefix:'mz_'}
];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 let passed=0;
 try{
  for(const target of targets){
   const context=await browser.newContext({viewport:{width:390,height:759},reducedMotion:'reduce'});
   await require('./auto_entrances.cjs')(context);
   await context.addInitScript(prefix=>{localStorage.setItem(prefix+'tutorial_v1','done');localStorage.setItem(prefix+'music_mute','1')},target.prefix);
   const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
   try{
    await page.goto(target.url);await page.waitForFunction(()=>window.BOOT?.ready);
    await page.evaluate(()=>{mute=true;mmute=true;openInitiativeCoin=async()=> 'p';newRun()});
    await page.waitForFunction(()=>G&&!G.busy&&!drawRunning&&G.phase==='player-deploy');
    await page.evaluate(()=>{
     infoPanel=null;HOLD_DETAIL=null;DM=null;OV=null;
     if(typeof STORY!=='undefined')STORY.pendingFriend=null;
     G.turn=2;G.mustDraw=0;G.sel=null;G.sac=new Set();
     const boss=POOL.find(c=>c.kind==='boss'&&c.rarity!=='rare'&&POOL.some(g=>g.rarity==='rare'&&g.baseName===c.n));
     const gold=POOL.find(c=>c.rarity==='rare'&&c.baseName===boss.n),plain=POOL.find(c=>c.kind==='mob'&&c.rarity!=='rare');
     G.p=[makeCard({...plain,at:'火'}),makeCard({...boss,at:'血'}),makeCard({...gold,at:'冰'}),null,null];
     G.e=[makeCard({...plain,at:'冰'},true),makeCard({...boss,at:'火'},true),makeCard({...gold,at:'毒'},true),null,null];
     G.hand=[makeCard(plain),makeCard(boss),makeCard(gold)];render();
    });
    for(const[width,height]of[[320,568],[390,759],[844,390],[1366,768]])for(const language of ['zh-CN','en']){
     await page.setViewportSize({width,height});await page.evaluate(language=>{setGameLanguage(language);render()},language);
     const proof=await page.evaluate(()=>{
      const rect=node=>{const r=node.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom}};
      return{
       pageWidth:document.documentElement.scrollWidth,
       zones:['.player-board','.enemy-board','.hand'].map(selector=>[...document.querySelectorAll(selector+' .card')].map(rect)),
       badges:[...document.querySelectorAll('.board .card')].map(node=>({card:rect(node),badge:node.querySelector('.element-matchup')?rect(node.querySelector('.element-matchup')):null,rarity:node.querySelector('.rarity-mark')?rect(node.querySelector('.rarity-mark')):null}))
      };
     });
     for(const zone of proof.zones){
      assert.equal(zone.length,3);
      for(const card of zone){assert.ok(Math.abs(card.w-zone[0].w)<.2,`${target.name}/${width}/${language}: normal, Boss and gold widths differ`);assert.ok(Math.abs(card.h-zone[0].h)<.2,`${target.name}/${width}/${language}: normal, Boss and gold heights differ`)}
     }
     assert.ok(proof.pageWidth<=width+1,`${target.name}/${width}/${language}: page overflow`);
     assert.equal(proof.badges.length,6);
     for(const{card,badge,rarity}of proof.badges){
      assert.ok(badge,`${target.name}: occupied counter lane has no indicator`);
      assert.ok(badge.x>=card.x&&badge.y>=card.y&&badge.right<=card.right&&badge.bottom<=card.bottom,`${target.name}: indicator exceeds card bounds`);
      if(rarity)assert.ok(badge.bottom<=rarity.y||rarity.bottom<=badge.y||badge.right<=rarity.x||rarity.right<=badge.x,`${target.name}: indicator overlaps rarity mark`);
     }
     passed++;console.log('PASS',target.name,width,height,language,'standard card sizes and separated matchup badges');
    }
    assert.deepEqual(errors,[]);
   }finally{await context.close()}
  }
  console.log(JSON.stringify({passed,failed:0}));
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
