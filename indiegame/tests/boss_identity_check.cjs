const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const ROOT=path.join(__dirname,'..'),BASE=process.env.INDIE_TEST_URL||'http://127.0.0.1:8930/indiegame/index.html';
const read=file=>JSON.parse(fs.readFileSync(path.join(ROOT,'data',file+'.json'),'utf8'));
// Reuse the captured v1.0.1 fixture without executing its browser test suite.
const captured=fs.readFileSync(path.join(__dirname,'story_check.cjs'),'utf8').match(/const LEGACY_SAVE=JSON\.parse\(zlib\.inflateSync\(Buffer\.from\('([^']+)'/);
assert.ok(captured,'Missing legacy checkpoint fixture');
const LEGACY_SAVE=JSON.parse(zlib.inflateSync(Buffer.from(captured[1],'base64')).toString('utf8'));
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 const results=[],errors=[];
 const check=async(name,fn)=>{try{const evidence=await fn();results.push({name,passed:true,...(evidence?{evidence}:{})});console.log('PASS',name)}catch(error){results.push({name,passed:false,error:error.message});console.log('FAIL',name,error.message)}};
 try{
  const identities=read('boss-identities'),abilities=read('boss-abilities'),names=read('card-names'),cards=read('cards');
  await check('All 108 personal identities stay unique while normal and Gilded labels put the role before the name',()=>{
   assert.equal(Object.keys(identities).length,108);assert.deepEqual(new Set(Object.keys(identities)),new Set(abilities.map(a=>a.boss)));
   assert.equal(new Set(Object.values(identities).map(x=>x.zh)).size,108);assert.equal(new Set(Object.values(identities).map(x=>x.en)).size,108);
   for(const[id,entry]of Object.entries(identities)){
    assert.ok(entry.zh.length>=2&&entry.zh.length<=4,entry.zh);assert.ok(entry.en.length<=17&&!/[\u3400-\u9fff]/.test(entry.en),entry.en);assert.ok(entry.roleZh&&entry.roleEn);
    assert.equal(names[id].zh,entry.roleZh+entry.zh);assert.equal(names[id].en,entry.roleEn+' '+entry.en);
    for(const card of cards.filter(c=>c.baseName===id&&c.rarity==='rare')){assert.equal(names[card.n].zh,entry.roleZh+entry.zh);assert.equal(names[card.n].en,entry.roleEn+' '+entry.en)}
   }
   assert.equal(names['苔庭铠卫·雅恩'].zh,'守夜人诺亚');
   assert.equal(new Set(abilities.map(a=>a.name)).size,108);assert.equal(new Set(abilities.map(a=>a.nameEn)).size,108);
   for(const a of abilities){assert.ok(a.name&&a.name.length<=5&&!a.name.includes('·'));assert.ok(a.nameEn&&a.flavor&&a.flavorEn&&!/[\u3400-\u9fff]/.test(a.nameEn+a.flavorEn));assert.equal(a.ashCost,1);assert.equal(a.cooldownRounds,1)}
   return {bosses:108,mainEncounters:Object.values(read('campaigns')).flat().length};
  });
  const context=await browser.newContext({viewport:{width:390,height:759},reducedMotion:'reduce'});
  await require('./auto_entrances.cjs')(context);await context.addInitScript(()=>{try{localStorage.setItem('lo_tutorial_v1','done');localStorage.setItem('lo_music_mute','1')}catch{}});
  const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
  await page.goto(BASE);await page.waitForFunction(()=>window.BOOT?.ready);
  await check('A captured old checkpoint keeps its exact board, hand, deck and Boss key while showing the new identity',async()=>{
   await page.evaluate(storage=>{localStorage.clear();for(const[k,v]of Object.entries(storage))localStorage.setItem(k,v)},LEGACY_SAVE.storage);await page.reload();await page.waitForFunction(()=>window.BOOT?.ready&&G&&!G.busy);
   const r=await page.evaluate(()=>({state:{turn:G.turn,hp:G.hp,ehp:G.ehp,deck:G.deck.map(c=>c.n),hand:G.hand.map(c=>c.n),draw:G.draw.map(c=>c.n),p:G.p.map(c=>c&&{n:c.n,a:c.a,h:c.h,c:c.c,t:c.t}),e:G.e.map(c=>c&&{n:c.n,a:c.a,h:c.h,c:c.c,t:c.t}),boss:G.st.boss},label:document.querySelector('.boss-name')?.textContent,language:gameLanguage}));
   assert.deepEqual(r.state,LEGACY_SAVE.state);assert.equal(r.label,names[r.state.boss][r.language==='en'?'en':'zh']);
  });
  await page.evaluate(()=>{openInitiativeCoin=async()=> 'p';newRun()});await page.waitForFunction(()=>G&&!G.busy&&!drawRunning);await page.evaluate(()=>{infoPanel=null;render()});
  await check('All 216 normal and Gilded cards render role-prefixed names in both languages without changing IDs',async()=>{
   const failed=await page.evaluate(identities=>{
    const failed=[];
    for(const language of ['zh-CN','en']){
     setGameLanguage(language);
     for(const [id,entry]of Object.entries(identities))for(const card of POOL.filter(c=>c.n===id||c.baseName===id)){
     const expected=language==='en'?entry.roleEn+' '+entry.en:entry.roleZh+entry.zh;
     const node=document.createElement('div');node.innerHTML=cardHTML(card);document.body.appendChild(node);localizeRoot(node);
     const label=node.querySelector('.top b')?.textContent,key=node.querySelector('.card')?.dataset.cardName;
     if(label!==expected||displayedCardName(card)!==expected||shortCardName(card,language)!==expected||key!==card.n)failed.push({id:card.n,language,label,expected});node.remove();
     }
    }
    return failed;
   },identities);assert.deepEqual(failed,[]);
  });
  await check('All 108 live bilingual Boss headers and English skill popovers show role before name and unchanged rules',async()=>{
   const failed=await page.evaluate(identities=>{
    const failed=[],original=G.st;
    for(const language of ['zh-CN','en'])for(const a of BOSS_ABILITIES){
     setGameLanguage(language);
     const entry=identities[a.boss];G.st={...original,boss:a.boss,n:a.boss};render();openBossAbilityPopover(true);const panel=document.getElementById('boss-ability-panel');localizeRoot(panel);
     const text=panel?.textContent||'',header=document.querySelector('.boss-name')?.textContent,reason=[];
     const expected=language==='en'?entry.roleEn+' '+entry.en:entry.roleZh+entry.zh;
     if(header!==expected)reason.push('header');if(!text.includes(language==='en'?a.nameEn:a.name))reason.push('ability');if(!text.includes(language==='en'?a.flavorEn:a.flavor))reason.push('flavor');if(!text.includes(i18nText(a.description)))reason.push('rules');if(language==='en'&&/[\u3400-\u9fff]/.test(text))reason.push('untranslated');if(typeof BOSS_SKILL_HANDLERS[a.boss]!=='function')reason.push('handler');
     if(reason.length)failed.push({boss:entry.en,language,reason,text:text.slice(0,700)});closeBossAbilityPopover(false);
    }
    G.st=original;render();return failed;
   },identities);assert.deepEqual(failed,[]);return {bilingualLiveHeaders:216,translatedLivePopovers:108};
  });
  const core=['苔庭铠卫·雅恩','暮潮灯议长·艾汀'];
  await check('Core Boss card details retain their occupation and show translated identities and abilities',async()=>{
   for(const id of core)for(const language of ['zh-CN','en']){
    const r=await page.evaluate(({id,language})=>{setGameLanguage(language);showCardHold({card:POOL.find(c=>c.n===id),location:'catalog'});const text=document.querySelector('.card-hold-dialog').textContent;closeCardHold();return {text}}, {id,language});
    const e=identities[id],a=abilities.find(a=>a.boss===id);assert.ok(r.text.includes(e[language==='en'?'en':'zh']),r.text);assert.ok(r.text.includes(e[language==='en'?'roleEn':'roleZh']),r.text);assert.ok(r.text.includes(language==='en'?a.nameEn:a.name),r.text);if(language==='en')assert.ok(!/[\u3400-\u9fff]/.test(r.text),r.text);
   }
  });
  await check('Chinese and English Boss names and active skill names find the same collected cards in catalogue and deck library',async()=>{
   for(const id of core){
    await page.evaluate(id=>collectCard(POOL.find(c=>c.n===id)),id);const entry=identities[id],a=abilities.find(a=>a.boss===id);
    for(const language of ['zh-CN','en']){
     await page.evaluate(language=>{DM=null;infoPanel=null;OV='catalog';catalogGame='all';catalogKind='all';catalogRarity='all';catalogSearch='';catalogPage=0;setGameLanguage(language);render()},language);
     for(const query of [entry.zh,entry.en,a.name,a.nameEn]){await page.locator('#catsearch').fill(query);assert.ok(await page.locator('.catalog-entry .card').evaluateAll((nodes,id)=>nodes.some(node=>node.dataset.cardName===id),id),`${language}: catalogue missed ${query}`)}
     await page.evaluate(()=>{OV=null;openDeckManager('run');DM.tab='library';DM.search='';DM.page=0;render()});
     for(const query of [entry.zh,entry.en,a.name,a.nameEn]){await page.locator('#dm-search').fill(query);assert.ok(await page.locator('.managed-card .card').evaluateAll((nodes,id)=>nodes.some(node=>node.dataset.cardName===id),id),`${language}: library missed ${query}`)}
     await page.evaluate(()=>{DM=null;OV=null;render()});
    }
   }
  });
  await check('Previously saved skill names render as their new story names without changing historical Boss keys',async()=>{
   const r=await page.evaluate(()=>{const source='苔庭铠卫·雅恩发动「护灯·回路」',a=BOSS_ABILITIES.find(a=>a.boss==='苔庭铠卫·雅恩');setGameLanguage('zh-CN');const zh=i18nText(source);setGameLanguage('en');const en=i18nText(source);return {zh,en,name:a.name,nameEn:a.nameEn}});
   assert.ok(r.zh.includes(identities[core[0]].zh)&&r.zh.includes(r.name),r.zh);assert.ok(!r.zh.includes('护灯·回路'),r.zh);assert.ok(r.en.includes(identities[core[0]].en)&&r.en.includes(r.nameEn),r.en);assert.ok(!/[\u3400-\u9fff]/.test(r.en),r.en);
  });
  await check('A renamed normal or Gilded Boss still equips the same paid healing and shield skill through its saved key',async()=>{
   const r=await page.evaluate(id=>{
    infoPanel=null;DM=null;OV=null;G.turn=3;G.phase='player-deploy';G.mustDraw=0;G.freezeChoice=false;G.enemyDeployedTurn=3;const base=POOL.find(c=>c.n===id),gold=POOL.find(c=>c.baseName===id&&c.rarity==='rare'),source=makeCard(base);source.h0=Math.max(source.h0,2);source.h=source.h0-1;source.t=1;G.p=[source,null,null,null,null];G.hand=[makeCard(SQ)];G.bossSkill.temp=[];playerBossSkillsInitBattle();const before=source.h,equipped=equipPlayerBossSkill(0),used=usePlayerBossSkill(),again=usePlayerBossSkill(),state=playerBossSkillState();const value={equipped,used,again,healed:source.h-before,shield:source.bossEffects?.shield,remainingHand:G.hand.length,equippedKey:state.equippedBoss,sameSource:state.source===source,history:state.history.map(x=>({boss:x.boss,name:x.name})),normalSkill:playerBossSkillForCard(base)?.id,goldSkill:playerBossSkillForCard(gold)?.id};render();return value;
   },core[0]);assert.equal(r.equipped,true);assert.equal(r.used,true);assert.equal(r.again,false);assert.equal(r.healed,1);assert.equal(r.shield,1);assert.equal(r.remainingHand,0);assert.equal(r.equippedKey,core[0]);assert.equal(r.sameSource,true);assert.equal(r.normalSkill,'boss-49');assert.equal(r.goldSkill,'boss-49');assert.deepEqual(r.history,[{boss:core[0],name:abilities.find(a=>a.boss===core[0]).name}]);
  });
  await check('Boss names and skill controls are reachable on four screen sizes in both languages',async()=>{
   for(const[width,height]of[[320,568],[390,759],[844,390],[1366,768]])for(const language of ['zh-CN','en']){
    await page.setViewportSize({width,height});await page.evaluate(language=>{setGameLanguage(language);render()},language);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    const trigger=page.locator('.boss-ability-trigger'),box=await trigger.boundingBox();assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height+1,`${width}/${language}: skill outside viewport`);assert.ok((await page.locator('.boss-name').innerText()).length>0);await trigger.hover();const panel=page.locator('#boss-ability-panel');if(!await panel.isVisible())await trigger.click();await panel.waitFor();assert.ok(await panel.isVisible());await panel.locator('[data-boss-ability="close"]').click();await page.screenshot({path:`/tmp/boss-identities-${width}x${height}-${language}.png`});
   }
   return {layouts:8};
  });
  await check('Longest Boss labels use standard card sizes and remain complete in details',async()=>{
   for(const[width,height]of[[320,568],[390,759],[844,390],[1366,768]])for(const language of ['zh-CN','en']){
    const key=language==='en'?'en':'zh',id=Object.keys(identities).sort((a,b)=>names[b][key].length-names[a][key].length)[0];
    await page.setViewportSize({width,height});
    const result=await page.evaluate(({id,language})=>{
     const saved={stage:G.st,p:G.p,e:G.e,hand:G.hand,sel:G.sel};
     try{
      const normal=POOL.find(c=>c.n===id),gold=POOL.find(c=>c.baseName===id&&c.rarity==='rare'),plain=POOL.find(c=>c.kind==='mob'&&c.rarity!=='rare');
      G.st={...G.st,boss:id,n:id};G.p=[makeCard(plain),makeCard(normal),makeCard(gold),null,null];G.e=Array(5).fill(null);G.hand=[makeCard(plain),makeCard(normal),makeCard(gold)];G.sel=null;
      setGameLanguage(language);render();
      const bar=document.querySelector('.table-topbar').getBoundingClientRect(),name=document.querySelector('.boss-name').getBoundingClientRect(),button=document.querySelector('.boss-ability-trigger').getBoundingClientRect();
      const zones=['.hand','.player-board'].map(selector=>[...document.querySelectorAll(selector+' .card')].map(node=>{const r=node.getBoundingClientRect();return {width:r.width,height:r.height,bottom:r.bottom,statsBottom:node.querySelector('.st').getBoundingClientRect().bottom}}));
      const details=[normal,gold].map(card=>{
       const expected=displayedCardName(card);showCardHold({card,location:'hand'});
       const title=document.querySelector('.card-hold-head h2')?.textContent||'';closeCardHold();return {expected,title};
      });
      return {barBottom:bar.bottom,nameBottom:name.bottom,buttonBottom:button.bottom,zones,details};
     }finally{G.st=saved.stage;G.p=saved.p;G.e=saved.e;G.hand=saved.hand;G.sel=saved.sel;render()}
    },{id,language});
    assert.ok(result.nameBottom<=result.barBottom+1&&result.buttonBottom<=result.barBottom+1,`${width}/${language}: Boss name or skill overlaps life row`);
    for(const zone of result.zones){
     assert.equal(zone.length,3);
     for(const card of zone){
      assert.ok(Math.abs(card.width-zone[0].width)<.2&&Math.abs(card.height-zone[0].height)<.2,`${width}/${language}: Boss or gold card differs from the normal card size`);
      assert.ok(card.statsBottom<=card.bottom+1,`${width}/${language}: stats exceed the standard card`);
     }
    }
    for(const detail of result.details)assert.equal(detail.title,detail.expected,`${width}/${language}: details omit the full Boss name`);
   }
   return {layouts:8};
  });
  assert.deepEqual(errors,[]);results.push({name:'No browser errors in identity and skill migration scenarios',passed:true});await context.close();
 }finally{fs.writeFileSync(path.join(__dirname,'boss-identity-results.json'),JSON.stringify(results,null,2)+'\n');await browser.close()}
 const failed=results.filter(x=>!x.passed);console.log(JSON.stringify({passed:results.length-failed.length,failed:failed.length}));assert.deepEqual(failed,[]);
})().catch(error=>{console.error(error);process.exitCode=1});
