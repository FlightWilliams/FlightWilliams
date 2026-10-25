const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const ROOT=path.join(__dirname,'..'),BASE=process.env.INDIE_TEST_URL||'http://127.0.0.1:8930/indiegame/index.html';
const archetypes=[['苔庭铠卫·雅恩','守夜人','Night Watch','nightwatch'],['炽砂修灯师·瑟罗','防火女','Fire Warden','firewarden'],['暮潮灯议长·艾汀','灯塔守护者','Lighthouse Warden','lighthouse']];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 const results=[];
 try{
  const context=await browser.newContext({viewport:{width:390,height:759},reducedMotion:'reduce'});
  await context.addInitScript(()=>{try{localStorage.setItem('lo_tutorial_v1','done');localStorage.setItem('lo_music_mute','1')}catch{}});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=async(name,fn)=>{const evidence=await fn();results.push({name,passed:true,...(evidence?{evidence}:{})});console.log('PASS',name)};
  await page.goto(BASE);await page.waitForFunction(()=>window.BOOT?.ready);
  await check('Core witnesses have matching bilingual names, distinct roles and case-file details',async()=>{
   const rows=await page.evaluate(archetypes=>archetypes.map(([id,zh,en,role])=>({id,zh:shortCardName(id,'zh-CN'),en:shortCardName(id,'en'),role:CARD_ART_PROFILES[id].role,lore:CARD_STORIES[id],joins:COMPANION_DIALOGUE[id],svg:cardPortraitHTML(POOL.find(c=>c.n===id))})),archetypes);
   rows.forEach((row,i)=>{assert.equal(row.zh,archetypes[i][1]);assert.equal(row.en,archetypes[i][2]);assert.equal(row.role,archetypes[i][3]);assert.ok(row.lore.zh.length>25&&row.lore.en.length>50);assert.ok(row.joins.join&&row.joins.joinEn)});
   assert.equal(new Set(rows.map(row=>row.svg)).size,3);
   assert.match(rows[0].lore.zh,/03:17/);assert.match(rows[1].lore.zh,/炉|封条/);assert.match(rows[2].lore.zh,/灯|回信/);
  });
  await check('All 988 portraits are valid static SVGs, cache their output and leave gameplay randomness untouched',async()=>{
   const result=await page.evaluate(()=>{
    const bad=[],random=Math.random,start=performance.now();let randomCalls=0;Math.random=()=>{randomCalls++;return random()};
    try{for(const c of POOL){const svg=cardPortraitHTML(c),doc=new DOMParser().parseFromString(svg,'image/svg+xml');if(doc.querySelector('parsererror,filter,animate,animateTransform')||/NaN|undefined/.test(svg)||cardPortraitHTML(c)!==svg)bad.push(c.n)}}finally{Math.random=random}
    return {bad,randomCalls,count:POOL.length,elapsedMs:Math.round(performance.now()-start)};
   });assert.equal(result.count,988);assert.deepEqual(result.bad,[]);assert.equal(result.randomCalls,0);return result;
  });
  await check('English home, chapter names and portrait readout labels use the current mystery setting',async()=>{
   await page.evaluate(()=>{setGameLanguage('en');G=null;OV='title';render()});
   const r=await page.evaluate(archetypes=>({heading:document.querySelector('.console-heading h2').textContent,chapters:Object.values(LOOP_STORY.chapters).map(c=>c.name.en),labels:archetypes.map(([id])=>new DOMParser().parseFromString(cardPortraitHTML(POOL.find(c=>c.n===id)),'image/svg+xml').documentElement.getAttribute('aria-label'))}),archetypes);
   assert.equal(r.heading,'Continue the Investigation');assert.deepEqual(r.chapters,['Fogtown','Bell Tower','Ash Works','Sunken Harbor','Snow Station','White Room']);assert.deepEqual(r.labels,archetypes.map(x=>x[2]));
   await page.evaluate(()=>setGameLanguage('zh-CN'));const zh=await page.evaluate(id=>new DOMParser().parseFromString(cardPortraitHTML(POOL.find(c=>c.n===id)),'image/svg+xml').documentElement.getAttribute('aria-label'),archetypes[0][0]);assert.equal(zh,'守夜人');
  });
  await page.evaluate(()=>{openInitiativeCoin=async()=> 'p';newRun()});await page.waitForFunction(()=>G&&!G.busy&&!drawRunning);
  await page.evaluate(()=>{infoPanel=null;render()});
  await check('All three witnesses show their own translated lore in the real long-press detail dialog',async()=>{
   for(const [id,zh,en]of archetypes)for(const lang of ['zh-CN','en']){
    const result=await page.evaluate(({id,lang})=>{setGameLanguage(lang);const c=POOL.find(c=>c.n===id);showCardHold({card:c,location:'catalog'});const text=document.querySelector('.card-hold-dialog').textContent,lore=CARD_STORIES[id][lang==='en'?'en':'zh'];closeCardHold();return {text,lore}}, {id,lang});
    assert.ok(result.text.includes(lang==='en'?en:zh));assert.ok(result.text.includes(result.lore));if(lang==='en')assert.ok(!/[\u3400-\u9fff]/.test(result.text),result.text);
   }
  });
  await check('Every defeat/death statement translates and stale saved testimony does not override the new file',async()=>{
   const r=await page.evaluate(()=>{
    setGameLanguage('en');const bad=[];for(const[boss,row]of Object.entries(BOSS_DIALOGUE))if(bossFarewellText({boss})!==row.farewellEn||bossDeathEchoText({boss})!==row.echoEn)bad.push(boss);
    const old=G.bossFarewell,echo=G.deathEcho;G.bossFarewell='OUTDATED SAVED TESTIMONY';G.deathEcho={boss:G.st.boss,text:'OUTDATED SAVED TESTIMONY'};
    const text=i18nText(bossFarewellHTML()+playerDeathEchoHTML());G.bossFarewell=old;G.deathEcho=echo;return {bad,count:Object.keys(BOSS_DIALOGUE).length,text};
   });assert.equal(r.count,490);assert.deepEqual(r.bad,[]);assert.ok(!r.text.includes('OUTDATED'));assert.ok(!/[\u3400-\u9fff]/.test(r.text.replace(/<[^>]*>/g,'')),r.text);
  });
  await check('Witnesses and the Gilded lighthouse remain recognizable on desktop and phone tables',async()=>{
   await page.evaluate(ids=>{setGameLanguage('zh-CN');G.p=ids.map(id=>makeCard(POOL.find(c=>c.n===id)));G.p.push(makeCard(POOL.find(c=>c.baseName===ids[2]&&c.rarity==='rare')),null);infoPanel=null;OV=null;render()},archetypes.map(x=>x[0]));
   for(const[width,height]of[[390,759],[1366,768]]){await page.setViewportSize({width,height});await page.evaluate(()=>render());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.equal(await page.locator('#c-p-3.rare-card .rarity-mark').count(),1);await page.screenshot({path:`/tmp/indie-horror-battle-${width}x${height}.png`})}
  });
  assert.deepEqual(errors,[]);results.push({name:'No browser errors',passed:true});
  fs.writeFileSync(path.join(__dirname,'horror-results.json'),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify({passed:results.length,failed:0}));await context.close();
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
