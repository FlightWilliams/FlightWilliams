const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const BASE=process.env.INDIE_TEST_URL||'http://127.0.0.1:8005/indiegame/index.html';
const GAME=process.env.GAME_TEST_URL||new URL('../game/index.html',BASE).href;
const OUT=process.env.PALETTE_TEST_OUTPUT||'/tmp/chapter-table-palettes';
const worlds=['mire','brass','cinder','tide','frost','astral'];
const names=['雾镇','钟楼','灰厂','沉港','雪站','白室'];
const rgba=value=>value.match(/[\d.]+/g).map(Number);
const distance=(a,b)=>Math.sqrt(rgba(a).slice(0,3).reduce((sum,n,i)=>sum+(n-rgba(b)[i])**2,0));
const luminance=value=>rgba(value).slice(0,3).map(n=>n/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((sum,n,i)=>sum+n*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/(Math.min(luminance(a),luminance(b))+.05);
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});let passed=0;
 fs.mkdirSync(OUT,{recursive:true});
 const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce'});
 await require('./auto_entrances.cjs')(context);
 await context.addInitScript(()=>{for(const prefix of ['lo_','mz_']){localStorage.setItem(prefix+'tutorial_v1','done');localStorage.setItem(prefix+'music_mute','1')}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const idle=()=>page.waitForFunction(()=>G&&!G.busy&&!drawRunning&&!G.entrancePending);
 const frame=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const check=async(name,fn)=>{await fn();passed++;console.log('PASS',name)};
 const proof=()=>page.evaluate(()=>{
  const css=selector=>{const c=getComputedStyle(document.querySelector(selector));return {color:c.color,background:c.backgroundColor,image:c.backgroundImage,border:c.borderColor,top:c.borderTopColor,side:c.borderLeftColor,bottom:c.borderBottomColor}};
  return {chapter:document.documentElement.dataset.tableChapter||null,body:css('body'),shell:css('.game-shell'),arena:css('.table-arena'),dock:css('.player-dock'),slot:css('.player-board>.slot'),button:css('.ctl .pri')};
 });
 const reset=async(world,level=1,cycle=0)=>{await page.evaluate(({world,level,cycle})=>setPaletteFixture(world,level,cycle),{world,level,cycle});await frame()};
 try{
  await page.goto(GAME);await page.waitForFunction(()=>window.BOOT?.ready);
  await page.evaluate(()=>{mute=true;mmute=true;window.paletteNativeCoin=openInitiativeCoin;openInitiativeCoin=async()=> 'p';newRun()});await idle();await page.evaluate(()=>{infoPanel=null;render()});
  const warmReference=await proof();
  await page.goto(BASE);await page.waitForFunction(()=>window.BOOT?.ready);
  await page.evaluate(()=>{mute=true;mmute=true;window.paletteNativeCoin=openInitiativeCoin;openInitiativeCoin=async()=> 'p';newRun()});await idle();
  const installFixture=()=>page.evaluate(()=>{
   if(!window.paletteNativeCoin)window.paletteNativeCoin=openInitiativeCoin;
   openInitiativeCoin=async()=> 'p';mute=true;mmute=true;
   window.setPaletteFixture=(world,level=1,cycle=0)=>{
    infoPanel=null;detailCardOverride=null;HOLD_DETAIL=null;DM=null;TUT=null;OV=null;STORY.pendingFriend=null;
    difficulty=world;STG.splice(0,STG.length,...CAMPAIGNS[world].map(st=>({...st,dk:[]})));
    journey.cleared=DIFFICULTY_ORDER.indexOf(world);journey.unlocked=6;journey.loops=cycle;storeJourney();
    Object.assign(G,{lv:level,wins:level-1,st:STG[level-1],spiralLoop:cycle,busy:0,mustDraw:0,freezeChoice:false,entrancePending:false,tutorial:false,replay:false,phase:'player-deploy',turn:2,hp:3,ehp:7,sel:null,moveSel:null,sac:new Set(),campaignFirst:'p',encounterFirst:'p',enemyDeployedTurn:2,rewardClaimed:false,tierRecorded:false});
    G.st.dk=stageDeck(G.st);
    const core=STORY_CAST.core.map(id=>POOL.find(c=>c.n===id)),gold=POOL.find(c=>c.baseName===core[0].n&&c.rarity==='rare');
    [...core,gold].forEach(collectCard);
    G.p=[{...makeCard(core[0]),at:'火',t:1},null,{...makeCard(gold),at:'冰',t:1},null,null];
    G.e=[{...makeCard(core[1],true),at:'血',t:1},null,{...makeCard(core[2],true),at:'毒',t:1},null,null];
    G.hand=core.slice(1,5).map(c=>makeCard(c));render();
   };
  });
  await installFixture();
  const palettes={};
  await check('Each chapter has one stable palette across its first, middle and final encounter',async()=>{
   for(const world of worlds){
    for(const level of [1,8,16]){
     await reset(world,level);const value=await proof();assert.equal(value.chapter,world);
     if(level===1)palettes[world]=value;
     else assert.deepEqual({...value,chapter:null},{...palettes[world],chapter:null},world+' changes palette inside a chapter');
    }
   }
   assert.equal(new Set(worlds.map(world=>JSON.stringify([palettes[world].arena,palettes[world].button,palettes[world].body]))).size,6);
  });
  await check('Fogtown matches the warm game table and White Room preserves the existing cool endpoint',async()=>{
   const first=palettes.mire,last=palettes.astral;
   assert.ok(distance(first.arena.background,warmReference.arena.background)<15,'Warm felt differs substantially from game');
   assert.ok(distance(first.arena.side,warmReference.arena.side)<15,'Warm frame differs substantially from game');
   assert.equal(last.arena.background,'rgb(12, 27, 20)');assert.equal(last.arena.side,'rgb(57, 78, 61)');assert.equal(last.body.background,'rgb(11, 20, 17)');
   const warm=rgba(first.arena.side),cold=rgba(last.arena.side);assert.ok(warm[0]>warm[2]);assert.ok(cold[1]>cold[0]);
  });
  await check('Combat signs, gold cards and life flames keep their semantic colors in all six palettes',async()=>{
   const colors=[];
   for(const world of worlds){await reset(world);colors.push(await page.evaluate(()=>({up:getComputedStyle(document.querySelector('#c-p-0 > .element-matchup')).color,down:getComputedStyle(document.querySelector('#c-e-0 > .element-matchup')).color,flame:getComputedStyle(document.querySelector('.health-flame.is-lit')).color,gold:getComputedStyle(document.querySelector('#c-p-2.rare-card')).borderTopColor})));}
   for(const color of colors)assert.deepEqual(color,colors[0]);
   const up=rgba(colors[0].up),down=rgba(colors[0].down),flame=rgba(colors[0].flame);assert.ok(up[1]>up[0]&&up[1]>up[2]);assert.ok(down[0]>down[1]);assert.ok(flame[0]>flame[1]&&flame[1]>flame[2]);
  });
  await check('Round labels keep readable contrast against every chapter felt color',async()=>{
   for(const world of worlds){await reset(world);const colors=await page.evaluate(()=>({text:getComputedStyle(document.querySelector('.round-banner')).color,background:getComputedStyle(document.querySelector('.table-arena')).backgroundColor}));assert.ok(contrast(colors.text,colors.background)>=4.5,world+' round label contrast below 4.5:1');}
  });
  await check('Language and later cycles preserve the chapter palette without changing battle cards',async()=>{
   for(const world of worlds){
    await reset(world,8);const before=await proof();
    const refs=await page.evaluate(()=>{window.paletteCards=[...G.hand,...G.p,...G.e];setGameLanguage('en');return paletteCards.every((c,i)=>c===[...G.hand,...G.p,...G.e][i])});
    assert.ok(refs);const english=await proof();assert.equal(english.arena.background,before.arena.background);assert.equal(english.arena.side,before.arena.side);
    await reset(world,8,2);const later=await proof();assert.equal(later.arena.background,before.arena.background);assert.equal(later.arena.side,before.arena.side);await page.evaluate(()=>setGameLanguage('zh-CN'));
   }
  });
  await check('Palette surfaces and game controls fit phone portrait, landscape and desktop screens',async()=>{
   for(const [width,height]of[[320,568],[390,759],[844,390],[1366,768]]){
    await page.setViewportSize({width,height});
    for(const world of worlds){await reset(world);const box=await page.evaluate(()=>{const r=document.querySelector('.table-arena').getBoundingClientRect();return {page:document.documentElement.scrollWidth,left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:innerWidth,height:innerHeight}});assert.ok(box.page<=width+1,world+'/'+width);assert.ok(box.left>=-1&&box.right<=width+1&&box.top>=-1&&box.bottom<=height+1,JSON.stringify(box));
     if(width===390||width===1366)await page.screenshot({path:path.join(OUT,world+'-'+width+'.png')});
    }
   }
  });
  await check('A real chapter continue action selects the next warm-to-cool palette',async()=>{
   await reset('mire',16);await page.evaluate(()=>{G.wins=16;G.rewardClaimed=true;G.tierRecorded=true;journey.cleared=1;storeJourney();OV='clear';render()});
   await page.locator('[data-a="nextdifficulty"]').click();await idle();await page.evaluate(()=>{infoPanel=null;render()});assert.equal(await page.evaluate(()=>difficulty),'brass');assert.equal((await proof()).chapter,'brass');
  });
  await check('Reload restores the saved chapter palette and actual battle state',async()=>{
   await reset('tide',8);const before=await page.evaluate(()=>({boss:G.st.boss,hand:G.hand.map(c=>c.n),hp:G.hp}));assert.ok(await page.evaluate(()=>checkpointSave()));
   await page.reload();await page.waitForFunction(()=>window.BOOT?.ready&&G&&!G.busy&&!drawRunning);assert.equal((await proof()).chapter,'tide');assert.deepEqual(await page.evaluate(()=>({boss:G.st.boss,hand:G.hand.map(c=>c.n),hp:G.hp})),before);await installFixture();
  });
  await check('Replays use the chosen chapter palette and return to the main chapter palette',async()=>{
   await reset('mire',1);const started=await page.evaluate(()=>startBossReplay('frost',1));assert.ok(started);await idle();await page.evaluate(()=>{infoPanel=null;render()});assert.equal((await proof()).chapter,'frost');assert.ok(await page.evaluate(()=>returnBossReplay()));assert.equal((await proof()).chapter,'mire');
  });
  await check('Home and catalogue clear the table-only palette, then battle restores it',async()=>{
   await reset('cinder',1);await page.evaluate(()=>{OV='catalog';render()});assert.equal(await page.evaluate(()=>document.documentElement.dataset.tableChapter||null),null);
   await page.evaluate(()=>{OV=null;render()});assert.equal((await proof()).chapter,'cinder');
   assert.ok(await page.evaluate(()=>returnToHomepage()));assert.equal(await page.evaluate(()=>document.documentElement.dataset.tableChapter||null),null);
  });
  await check('Transparent deck controls and coin buttons stay transparent while drawer scrims stay opaque',async()=>{
   // The preceding real Home action clears G; start a fresh real run for controls.
   await page.evaluate(()=>{newRun()});await idle();await page.evaluate(()=>{infoPanel=null;render()});await reset('mire');
   const pile=await page.locator('.deck-access-pile').evaluate(n=>({background:getComputedStyle(n).backgroundColor,image:getComputedStyle(n).backgroundImage}));
   assert.equal(rgba(pile.background)[3],0);assert.equal(pile.image,'none');
   await page.evaluate(()=>{infoPanel='rules';render()});
   const scrim=await page.locator('.drawer-scrim').evaluate(n=>({background:getComputedStyle(n).backgroundColor,image:getComputedStyle(n).backgroundImage}));assert.ok(rgba(scrim.background)[3]>.5);assert.equal(scrim.image,'none');
   await page.evaluate(()=>{infoPanel=null;render();window.paletteCoinResult=paletteNativeCoin()});
   await page.locator('.initiative-coin-toss').waitFor();
   const coin=await page.locator('.initiative-coin-toss').evaluate(n=>({background:getComputedStyle(n).backgroundColor,image:getComputedStyle(n).backgroundImage}));assert.equal(rgba(coin.background)[3],0);assert.equal(coin.image,'none');
   await page.evaluate(()=>cancelInitiativeCoin());await page.locator('.initiative-coin-screen').waitFor({state:'detached'});
  });
  await check('Six-chapter screenshot overview is exported and the browser reports no errors',async()=>{
   const sheet=await context.newPage();try{
    const panels=worlds.map((w,i)=>`<section><h2>${i+1} · ${names[i]}</h2><img src="data:image/png;base64,${fs.readFileSync(path.join(OUT,w+'-1366.png')).toString('base64')}"></section>`).join('');
    await sheet.setViewportSize({width:1500,height:700});await sheet.setContent('<style>body{margin:0;background:#ded8c8;color:#263027;font:18px sans-serif}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;padding:12px}h2{font-size:17px;margin:6px}img{display:block;width:100%}section{background:#eee8da;padding:5px}</style><div class="grid">'+panels+'</div>');await sheet.screenshot({path:path.join(OUT,'chapter-overview.png'),fullPage:true});
   }finally{await sheet.close()}
   assert.deepEqual(errors,[]);fs.writeFileSync(path.join(OUT,'palette-proof.json'),JSON.stringify(palettes,null,2));
  });
 }finally{await context.close();await browser.close()}
 console.log(JSON.stringify({passed,failed:0,screenshots:OUT}));
})().catch(error=>{console.error(error);process.exitCode=1});
