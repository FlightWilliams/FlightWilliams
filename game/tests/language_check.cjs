const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const BASE=process.env.GAME_TEST_URL||'http://127.0.0.1:8893/index.html';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 const results=[];
 try{
  const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce'});
  await context.addInitScript(()=>{localStorage.setItem('mz_tutorial_v1','done');localStorage.setItem('mz_music_mute','1')});
  const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
  const check=async(name,fn)=>{const evidence=await fn();results.push({name,passed:true,...(evidence?{evidence}:{})});console.log('PASS',name)};
  await page.goto(BASE);await page.waitForFunction(()=>window.BOOT?.ready&&typeof setGameLanguage==='function');
  await check('All 988 cards have English names and original canonical identifiers',async()=>{
   const r=await page.evaluate(()=>{const normal=POOL.filter(c=>c.rarity!=='rare'),gold=POOL.filter(c=>c.rarity==='rare');return {cards:POOL.length,ids:new Set(POOL.map(c=>c.n)).size,coverage:POOL.every(c=>I18N_CARDS[c.n]?.name&&I18N_CARDS[c.n]?.lore),normal:normal.length,unique:new Set(normal.map(c=>I18N_CARDS[c.n].name)).size,paired:gold.every(c=>I18N_CARDS[c.n].name===I18N_CARDS[c.baseName].name)}});assert.equal(r.cards,988);assert.equal(r.ids,988);assert.equal(r.unique,r.normal);assert.ok(r.coverage&&r.paired);
  });
  await check('Homepage language choice persists across reloads',async()=>{
   await page.locator('[data-language="en"]').first().click();assert.equal(await page.evaluate(()=>gameLanguage),'en');assert.equal(await page.evaluate(()=>localStorage.getItem('mz_language_v1')),'en');await page.reload();await page.waitForFunction(()=>window.BOOT?.ready);assert.equal(await page.evaluate(()=>gameLanguage),'en');await page.locator('[data-language="zh-CN"]').first().click();assert.equal(await page.evaluate(()=>gameLanguage),'zh-CN');
  });
  await page.evaluate(()=>{openInitiativeCoin=async()=> 'p';newRun()});await page.waitForFunction(()=>G&&!G.busy&&!drawRunning);
  await check('The in-battle language button is immediately beside the sound button',async()=>{
   const toggle=page.locator('.table-tools [data-a="mute"] + button[data-language]');assert.equal(await toggle.count(),1);assert.equal((await toggle.innerText()).trim(),'English');await toggle.click();assert.equal(await page.evaluate(()=>gameLanguage),'en');assert.equal((await page.locator('.table-tools [data-a="mute"] + button[data-language]').innerText()).trim(),'中文');
  });
  await check('Toggling language preserves selected cards, live references, life and turn',async()=>{
   await page.locator('.hand [data-a="h"]').first().click();
   const r=await page.evaluate(()=>{const snapshot={game:G,deck:G.deck,hand:[...G.hand],p:[...G.p],e:[...G.e],turn:G.turn,hp:G.hp,ehp:G.ehp,sel:G.sel,collection:localStorage.getItem(COLLECTION_STORAGE)};window.languageSnapshot=snapshot;return {selected:G.sel}});assert.notEqual(r.selected,null);
   await page.locator('.table-tools [data-a="mute"] + button[data-language]').click();
   assert.deepEqual(await page.evaluate(()=>{const s=languageSnapshot;return {refs:s.game===G&&s.deck===G.deck&&s.hand.every((c,i)=>c===G.hand[i])&&s.p.every((c,i)=>c===G.p[i])&&s.e.every((c,i)=>c===G.e[i]),values:s.turn===G.turn&&s.hp===G.hp&&s.ehp===G.ehp&&s.sel===G.sel,collection:s.collection===localStorage.getItem(COLLECTION_STORAGE)}}),{refs:true,values:true,collection:true});
  });
  await check('Deck management accepts Chinese and mixed-case English search in either UI language',async()=>{
   const r=await page.evaluate(()=>{const card=G.deck.find(c=>I18N_CARDS[c.n]?.name);openDeckManager('run');const queries=[card.n,I18N_CARDS[card.n].name.toUpperCase(),I18N_CARDS[card.n].name.toLowerCase()],hits=[];for(const language of ['zh-CN','en']){setGameLanguage(language);for(const query of queries){DM.search=query;hits.push(managerEntries().some(e=>e.card.n===card.n))}}DM=null;render();return {hits}});assert.ok(r.hits.length===6&&r.hits.every(Boolean));
  });
  await check('Catalogue filtering and inspection retain raw names after English rendering',async()=>{
   const r=await page.evaluate(()=>{const c=G.deck[0];OV='catalog';catalogGame='all';catalogKind='all';catalogRarity='all';const hits=[];for(const language of ['zh-CN','en']){setGameLanguage(language);for(const query of [c.n,I18N_CARDS[c.n].name.toUpperCase()]){catalogSearch=query;catalogPage=0;render();hits.push([...document.querySelectorAll('.catalog-entry .card')].some(node=>node.dataset.cardName===c.n))}}catalogSearch='';render();const node=[...document.querySelectorAll('.catalog-entry .card')].find(node=>node.dataset.cardName===c.n);const inspected=cardHoldSource(node)?.card?.n;OV=null;render();return {hits,inspected,expected:c.n}});assert.ok(r.hits.every(Boolean));assert.equal(r.inspected,r.expected);
  });
  await check('Typing into the actual deck and catalogue search fields accepts either language',async()=>{
   const card=await page.evaluate(()=>{setGameLanguage('en');const c=G.deck[0];openDeckManager('run');return {zh:c.n,en:I18N_CARDS[c.n].name}});
   for(const query of [card.zh,card.en.toUpperCase()]){await page.locator('#dm-search').fill(query);assert.ok(await page.evaluate(name=>managerEntries().some(e=>e.card.n===name),card.zh))}
   await page.evaluate(()=>{closeDeckManager();OV='catalog';catalogSearch='';catalogPage=0;render()});
   for(const query of [card.zh,card.en.toLowerCase()]){await page.locator('#catsearch').fill(query);assert.ok(await page.evaluate(name=>[...document.querySelectorAll('.catalog-entry .card')].some(c=>c.dataset.cardName===name),card.zh))}
   await page.evaluate(()=>{OV=null;catalogSearch='';render()});
  });
  await check('Gilded card searches work in Chinese and English without unlocking hidden cards',async()=>{
   const r=await page.evaluate(()=>{const c=POOL.find(c=>c.rarity==='rare'),wasCollected=isCollected(c);const text=cardSearchText(c).toLowerCase();return {zh:text.includes(c.n.toLowerCase()),en:text.includes(I18N_CARDS[c.n].name.toLowerCase()),gilded:text.includes('gilded'),unchanged:wasCollected===isCollected(c)}});assert.deepEqual(r,{zh:true,en:true,gilded:true,unchanged:true});
  });
  await check('English ability, attribute and function queries work in either UI language',async()=>{
   const r=await page.evaluate(()=>{const cases=[['flying',POOL.find(c=>c.s==='fly'&&!I18N_CARDS[c.n].name.toLowerCase().includes('flying'))],['fire',POOL.find(c=>c.at==='火'&&!I18N_CARDS[c.n].name.toLowerCase().includes('fire'))],['draw',POOL.find(c=>c.dr>0)],['ash',SQ]],hits=[];for(const language of ['zh-CN','en']){setGameLanguage(language);for(const[query,card]of cases)hits.push(cardSearchText(card).toLowerCase().includes(query))}return hits});assert.ok(r.length===8&&r.every(Boolean));
  });
  await check('Reload keeps the saved battle and selected language',async()=>{
   await page.evaluate(()=>{infoPanel=null;DM=null;OV=null;setGameLanguage('en');checkpointSave()});const before=await page.evaluate(()=>({turn:G.turn,hp:G.hp,deck:G.deck.map(c=>c.n),hand:G.hand.map(c=>c.n),p:G.p.map(c=>c?.n),e:G.e.map(c=>c?.n)}));await page.reload();await page.waitForFunction(()=>window.BOOT?.ready&&G&&!G.busy);assert.equal(await page.evaluate(()=>gameLanguage),'en');assert.deepEqual(await page.evaluate(()=>({turn:G.turn,hp:G.hp,deck:G.deck.map(c=>c.n),hand:G.hand.map(c=>c.n),p:G.p.map(c=>c?.n),e:G.e.map(c=>c?.n)})),before);
  });
  await check('Phone header sound and language buttons stay visible in portrait and landscape',async()=>{
   for(const[width,height]of[[320,568],[844,390]]){await page.setViewportSize({width,height});for(const language of ['zh-CN','en']){await page.evaluate(language=>{setGameLanguage(language);render()},language);const toggle=page.locator('.table-tools [data-a="mute"] + button[data-language]');await toggle.scrollIntoViewIfNeeded();const rect=await toggle.boundingBox(),sound=await page.locator('.table-tools [data-a="mute"]').boundingBox();for(const box of [rect,sound])assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height+1,JSON.stringify({width,height,language,rect,sound}));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1))}await page.screenshot({path:path.join('/tmp',`game-language-battle-${width}x${height}.png`)})}
  });
  await check('Phone homepage language controls remain reachable in both languages',async()=>{
   await page.evaluate(()=>{G=null;OV='title';render()});for(const[width,height]of[[320,568],[844,390]]){await page.setViewportSize({width,height});for(const language of ['zh-CN','en']){await page.evaluate(language=>setGameLanguage(language),language);const target=page.locator('[data-language]').first(),rect=await target.boundingBox();assert.ok(rect&&rect.x>=0&&rect.y>=0&&rect.x+rect.width<=width+1&&rect.y+rect.height<=height+1,JSON.stringify({width,height,language,rect}));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1))}await page.screenshot({path:path.join('/tmp',`game-language-home-${width}x${height}.png`)})}
  });
  assert.deepEqual(errors,[]);results.push({name:'No browser errors',passed:true});await context.close();
 }finally{fs.writeFileSync(path.join(__dirname,'language-results.json'),JSON.stringify(results,null,2)+'\n');await browser.close()}
 console.log(JSON.stringify({passed:results.length,failed:0}));
})().catch(error=>{console.error(error);process.exitCode=1});
