const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),zlib=require('node:zlib');
const ROOT=path.join(__dirname,'..'),BASE=process.env.INDIE_TEST_URL||'http://127.0.0.1:8871/index.html';

// Captured from release 1.0.1 (7f9d9e3) after a real deal, a saved deck and
// a round-four player checkpoint. Kept compressed so this test needs no Git history.
const LEGACY_SAVE=JSON.parse(zlib.inflateSync(Buffer.from('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','base64')).toString('utf8'));

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 const results=[],errors=[];
 const check=async(name,fn)=>{try{const evidence=await fn();results.push({name,passed:true,...(evidence?{evidence}:{})});console.log('PASS',name)}catch(error){results.push({name,passed:false,error:error.message});console.log('FAIL',name,error.message)}};
 try{
  const context=await browser.newContext({viewport:{width:390,height:759},isMobile:true,hasTouch:true,reducedMotion:'reduce'});
  await require('./auto_entrances.cjs')(context);await context.addInitScript(()=>{localStorage.setItem('lo_tutorial_v1','done');localStorage.setItem('lo_music_mute','1')});
  const page=await context.newPage();page.on('pageerror',error=>errors.push(error.message));
  await check('All 988 short names are unique, bounded and retain matching Gilded identities',()=>{
   const names=JSON.parse(fs.readFileSync(path.join(ROOT,'data/card-names.json'),'utf8')),cards=JSON.parse(fs.readFileSync(path.join(ROOT,'data/cards.json'),'utf8'));
   assert.equal(Object.keys(names).length,988);assert.equal(new Set(Object.values(names).map(x=>x.zh)).size,988);assert.equal(new Set(Object.values(names).map(x=>x.en)).size,988);
   for(const card of cards){const n=names[card.n];assert.ok(n&&n.zh&&n.en);assert.ok(n.zh.length<=(card.rarity==='rare'?8:5),card.n+': '+n.zh);assert.ok(n.en.length<=25,n.en);assert.ok(!/[\u3400-\u9fff]/.test(n.en));if(card.rarity==='rare'){assert.equal(n.zh,'鎏金·'+names[card.baseName].zh);assert.equal(n.en,'Gilded '+names[card.baseName].en)}}
   return {cards:cards.length,maxChineseLength:Math.max(...Object.values(names).map(x=>x.zh.length)),maxEnglishLength:Math.max(...Object.values(names).map(x=>x.en.length))};
  });
  await check('Every card has new bilingual narrative and every chapter foreshadows the loop',()=>{
   const cards=JSON.parse(fs.readFileSync(path.join(ROOT,'data/cards.json'),'utf8')),stories=JSON.parse(fs.readFileSync(path.join(ROOT,'data/card-stories.json'),'utf8')),story=JSON.parse(fs.readFileSync(path.join(ROOT,'data/loop-story.json'),'utf8'));
   assert.equal(Object.keys(stories).length,988);for(const card of cards){assert.ok(stories[card.n]?.zh);assert.ok(stories[card.n]?.en);assert.ok(!/[\u3400-\u9fff]/.test(stories[card.n].en))}
   assert.equal(Object.keys(story.chapters).length,6);assert.ok(story.chapters.astral.clear.zh.text.includes(story.chapters.mire.name.zh));assert.ok(story.chapters.astral.clear.en.text.includes(story.chapters.mire.name.en));
  });
  let legacyState;
  await check('A genuine v1.0.1 save resumes with its board, hand, deck and health intact',async()=>{
   legacyState=LEGACY_SAVE.state;await page.goto(new URL('__legacy_story_test__.html',BASE).href);
   await page.evaluate(storage=>{localStorage.clear();for(const[key,value]of Object.entries(storage))localStorage.setItem(key,value)},LEGACY_SAVE.storage);
   await page.goto(BASE);await page.waitForFunction(()=>window.BOOT?.ready&&typeof shortCardName==='function'&&G&&!G.busy);
   const current=await page.evaluate(()=>({turn:G.turn,hp:G.hp,ehp:G.ehp,deck:G.deck.map(c=>c.n),hand:G.hand.map(c=>c.n),draw:G.draw.map(c=>c.n),p:G.p.map(c=>c&&{n:c.n,a:c.a,h:c.h,c:c.c,t:c.t}),e:G.e.map(c=>c&&{n:c.n,a:c.a,h:c.h,c:c.c,t:c.t}),boss:G.st.boss}));assert.deepEqual(current,legacyState);
   return {savedTurn:current.turn,savedHealth:current.hp,deckSize:current.deck.length};
  });
  await check('Card labels, search and details use the short names while identifiers remain stable',async()=>{
   const result=await page.evaluate(()=>{
    gameLanguage='zh-CN';OV='catalog';catalogGame='all';catalogKind='all';catalogRarity='all';const card=G.deck[0];catalogSearch=shortCardName(card);catalogPage=0;render();
    const node=[...document.querySelectorAll('.catalog-entry .card')].find(n=>n.dataset.cardName===card.n);
    if(!node)throw Error('Short Chinese search did not find saved card');
    const zh=node.querySelector('.top b').textContent,raw=node.dataset.cardName,search=cardSearchText(card);showCardHold(cardHoldSource(node));
    const zhDetails=document.querySelector('.card-hold-dialog').textContent;closeCardHold();setGameLanguage('en');render();
    const enNode=[...document.querySelectorAll('.catalog-entry .card')].find(n=>n.dataset.cardName===card.n);if(!enNode)throw Error('English switch lost Chinese short-name search: '+catalogSearch);const en=enNode.querySelector('.top b').textContent;
    showCardHold(cardHoldSource(enNode));const enDetails=document.querySelector('.card-hold-dialog').textContent;closeCardHold();infoPanel=null;detailCardOverride=null;OV=null;setGameLanguage('zh-CN');render();
    return {zh,en,expectedZh:shortCardName(card,'zh-CN'),expectedEn:shortCardName(card,'en'),raw,stable:card.n,searchContains:search.includes(shortCardName(card,'zh-CN')),zhDetails,enDetails,lore:cardNarrative(card)};
   });
   assert.equal(result.zh,result.expectedZh);assert.equal(result.en,result.expectedEn);assert.equal(result.raw,result.stable);assert.ok(result.searchContains);assert.ok(result.zhDetails.includes(result.zh));assert.ok(result.enDetails.includes(result.en));assert.ok(!result.zhDetails.includes(result.stable));assert.ok(result.lore.length>0);
  });
  await check('Generated identity labels stay compact while their saved IDs and personal names remain intact',async()=>{
   const result=await page.evaluate(()=>{
    const saved=gameLanguage,c={...makeCard({n:'Ada·死亡遗骸·第4轮',a:2,h:3,c:1}),identity:true,permanent:true,kind:'identity',game:'identity'},rows=[];
    for(const lang of ['zh-CN','en']){gameLanguage=lang;const node=document.createElement('div');node.innerHTML=cardHTML(c);document.body.appendChild(node);localizeRoot(node);rows.push({lang,label:node.querySelector('.top b').textContent,expected:shortCardName(c,lang),id:node.querySelector('.card').dataset.cardName});node.remove()}
    gameLanguage=saved;return {rows,stable:c.n,custom:shortCardName({n:'My Cat',identity:true},'en')};
   });
   for(const row of result.rows){assert.equal(row.label,row.expected);assert.equal(row.id,result.stable);assert.ok(row.label.length<=24);assert.ok(!row.label.includes('死亡遗骸'))}assert.equal(result.custom,'My Cat');
  });
  await check('Offering a Boss does not recruit it; choosing its reward recruits only that Boss',async()=>{
   const result=await page.evaluate(()=>{
    const boss=POOL.find(c=>c.n===CAMPAIGNS.mire[0].boss),other=POOL.find(c=>c.n===CAMPAIGNS.mire[1].boss),ordinary=POOL.find(c=>c.kind==='mob'&&c.rarity!=='rare');
    STORY.friends={};STORY.pendingFriend=null;G.rewardClaimed=false;G.rw=[makeCard(boss),makeCard(other),makeCard(ordinary)];G.rewardSelection=new Set();G.rewardFeedback='';G.defeatedBosses=[boss.n];OV='win';render();
    const offered=Object.keys(STORY.friends).length,finish=finishCampaignRewards;let chosen=[];try{finishCampaignRewards=cards=>{chosen=cards.map(c=>c.n)};claimReward(0)}finally{finishCampaignRewards=finish}
    const joined=Object.keys(STORY.friends),selectedInDeck=[...G.deck,...G.reserve].some(c=>c.n===boss.n),first=STORY.pendingFriend;
    const before=Object.keys(STORY.friends).length;G.rewardClaimed=false;G.rw=[makeCard(ordinary)];OV='win';try{finishCampaignRewards=()=>{};claimReward(0)}finally{finishCampaignRewards=finish}
    return {offered,joined,boss:boss.n,other:other.n,chosen,selectedInDeck,notice:!!first,ordinaryDidNotRecruit:Object.keys(STORY.friends).length===before};
   });
   assert.equal(result.offered,0);assert.deepEqual(result.joined,[result.boss]);assert.ok(!result.joined.includes(result.other));assert.deepEqual(result.chosen,[result.boss]);assert.ok(result.selectedInDeck&&result.notice&&result.ordinaryDidNotRecruit);
  });
  await check('The loop cannot restart before the final chapter and claimed reward',async()=>{
   const result=await page.evaluate(()=>{const saved={...journey},overlay=OV,claimed=G.rewardClaimed;journey.cleared=3;journey.unlocked=3;const before=JSON.stringify(journey),value=beginNextStoryLoop(),after=JSON.stringify(journey);journey.cleared=6;OV='win';G.rewardClaimed=false;const pendingReward=beginNextStoryLoop();Object.assign(journey,saved);OV=overlay;G.rewardClaimed=claimed;return {value,pendingReward,unchanged:before===after}});assert.equal(result.value,false);assert.equal(result.pendingReward,false);assert.ok(result.unchanged);
  });
  let carried;
  await check('The final return preserves companions, deck, reserve, collection and all replay unlocks',async()=>{
   carried=await page.evaluate(()=>{
    difficulty='astral';STG.splice(0,STG.length,...CAMPAIGNS.astral.map(st=>({...st,dk:[]})));G.lv=16;G.wins=16;G.st=STG[15];G.rewardClaimed=true;G.tierRecorded=true;G.defeatedBosses=Object.values(CAMPAIGNS).flat().map(st=>st.boss);G.busy=0;OV='clear';
    const reserve=POOL.find(c=>c.kind==='mob'&&c.rarity!=='rare'&&!G.deck.some(d=>d.n===c.n));collectCard(reserve);G.reserve.push(makeCard(reserve));
    journey.cleared=6;journey.unlocked=6;journey.loops=0;localStorage.setItem(JOURNEY_STORAGE,JSON.stringify({version:3,...journey}));savePlayerDeck();
    const before={deck:G.deck.map(c=>c.n),reserve:G.reserve.map(c=>c.n),friends:Object.keys(STORY.friends),collection:[...collectedNames].sort()};
    const started=beginNextStoryLoop(),again=beginNextStoryLoop(),saved=getLatestSavedDeck();return {before,started,again,journey:{...journey},active:activeDifficulty(),savedDeck:saved.deck.map(c=>c.n),savedReserve:saved.reserve.map(c=>c.n),friends:Object.keys(STORY.friends),collection:[...collectedNames].sort(),replays:replayClearedKeys().size};
   });
   assert.equal(carried.started,true);assert.equal(carried.again,false);assert.equal(carried.journey.cleared,0);assert.equal(carried.journey.unlocked,6);assert.equal(carried.journey.loops,1);assert.equal(carried.active,'mire');assert.equal(carried.replays,96);assert.deepEqual(carried.savedDeck,carried.before.deck);assert.deepEqual(carried.savedReserve,carried.before.reserve);assert.deepEqual(carried.friends,carried.before.friends);assert.deepEqual(carried.collection,carried.before.collection);
   return {loop:carried.journey.loops,deckSize:carried.savedDeck.length,replayUnlocks:carried.replays};
  });
  await check('Loop progress survives reload and the next run begins in the first world with the saved party',async()=>{
   await page.reload();await page.waitForFunction(()=>window.BOOT?.ready&&typeof beginNextStoryLoop==='function');
   const saved=await page.evaluate(()=>({active:activeDifficulty(),loops:journey.loops,unlocked:journey.unlocked,friends:Object.keys(STORY.friends)}));assert.equal(saved.active,'mire');assert.equal(saved.loops,1);assert.equal(saved.unlocked,6);assert.deepEqual(saved.friends,carried.before.friends);
   await page.evaluate(()=>{openInitiativeCoin=async()=> 'p';newRun()});await page.waitForFunction(()=>G&&!G.busy&&!drawRunning);const next=await page.evaluate(()=>({difficulty,lv:G.lv,deck:G.deck.map(c=>c.n),reserve:G.reserve.map(c=>c.n)}));assert.equal(next.difficulty,'mire');assert.equal(next.lv,1);assert.deepEqual(next.deck,carried.before.deck);assert.deepEqual(next.reserve,carried.before.reserve);
   await page.locator('.story-drawer').waitFor();assert.ok((await page.locator('.story-drawer').innerText()).includes(await page.evaluate(()=>storyCopy('loop','returnTitle'))));const close=page.locator('.drawer-head [data-a="closepanel"]');await close.click();assert.equal(await page.evaluate(()=>infoPanel),null);assert.equal(await page.locator('[data-a="end"]').isDisabled(),false);
  });
  await check('The English journal and loop ending contain fully translated story text',async()=>{
   await page.evaluate(()=>{window.storyTestGame=G;G=null;OV='title';infoPanel=null;setGameLanguage('en');render()});await page.locator('[data-story-journal]').first().click();
   const journal=await page.locator('.info-drawer').innerText();assert.ok(journal.length>80);assert.ok(!/[\u3400-\u9fff]/.test(journal),journal);await page.locator('.drawer-head [data-a="closepanel"]').click();
   await page.evaluate(()=>{difficulty='astral';STG.splice(0,STG.length,...CAMPAIGNS.astral.map(st=>({...st,dk:[]})));journey.cleared=6;G=window.storyTestGame;Object.assign(G,{lv:16,wins:16,st:STG[15],busy:0,identityRecorded:false});OV='clear';render()});const ending=await page.locator('.journey-clear').innerText();assert.ok(ending.includes(await page.evaluate(()=>LOOP_STORY.chapters.mire.name.en)));assert.ok(!/[\u3400-\u9fff]/.test(ending),ending);
  });
  await check('Portrait and landscape phones keep story controls inside the viewport',async()=>{
   for(const[width,height]of[[320,568],[844,390]]){
    await page.setViewportSize({width,height});await page.evaluate(()=>render());assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
    const next=page.locator('[data-a="nextdifficulty"]');await next.scrollIntoViewIfNeeded();const box=await next.boundingBox();assert.ok(box&&box.x>=0&&box.x+box.width<=width+1&&box.y>=0&&box.y+box.height<=height+1);
    await page.screenshot({path:path.join('/tmp',`indie-story-${width}x${height}.png`)});
    await page.evaluate(()=>{G=null;OV='title';infoPanel=null;render()});const journalButton=page.locator('[data-story-journal]').first(),journalBox=await journalButton.boundingBox();assert.ok(journalBox&&journalBox.x>=0&&journalBox.y>=0&&journalBox.x+journalBox.width<=width+1&&journalBox.y+journalBox.height<=height+1,'Homepage journal button is outside the viewport');await page.screenshot({path:path.join('/tmp',`indie-story-home-${width}x${height}.png`)});await journalButton.click();const close=page.locator('.drawer-head [data-a="closepanel"]');await close.scrollIntoViewIfNeeded();const head=await close.boundingBox();assert.ok(head&&head.x>=0&&head.x+head.width<=width+1&&head.y>=0&&head.y+head.height<=height+1);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join('/tmp',`indie-story-journal-${width}x${height}.png`)});await close.click();
    await page.evaluate(()=>{window.storyTestLoops=journey.loops;journey.loops=0;difficulty='mire';infoPanel='story';render()});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:path.join('/tmp',`indie-story-opening-${width}x${height}.png`)});await page.locator('.drawer-head [data-a="closepanel"]').click();await page.evaluate(()=>{journey.loops=window.storyTestLoops});
    await page.evaluate(()=>{difficulty='astral';STG.splice(0,STG.length,...CAMPAIGNS.astral.map(st=>({...st,dk:[]})));journey.cleared=6;G=window.storyTestGame;Object.assign(G,{lv:16,wins:16,st:STG[15],busy:0,identityRecorded:false});OV='clear';render()});
   }
  });
  await check('Every chapter remains readable to its final paragraph on portrait and landscape phones in both languages',async()=>{
   for(const[width,height]of[[320,568],[844,390]])for(const language of ['zh-CN','en'])for(const world of ['mire','brass','cinder','tide','frost','astral']){
    await page.setViewportSize({width,height});
    const expected=await page.evaluate(({language,world})=>{G=null;OV='title';journey.loops=0;difficulty=world;infoPanel='story';setGameLanguage(language);render();return storyChapter(world).text.split('\n').filter(Boolean).at(-1)},{language,world});
    const last=page.locator('.story-drawer .drawer-scroll p').filter({hasText:expected}).last();await last.scrollIntoViewIfNeeded();
    const box=await last.boundingBox();assert.ok(box&&box.x>=0&&box.x+box.width<=width+1&&box.y<height&&box.y+box.height>0,`${language}/${world} cannot reach its final paragraph`);
    const storyText=await page.locator('.story-drawer').innerText();assert.ok(storyText.includes(expected));if(language==='en')assert.ok(!/[\u3400-\u9fff]/.test(storyText),storyText);
    const close=page.locator('.story-drawer .drawer-head [data-a="closepanel"]');await close.click();assert.equal(await page.evaluate(()=>infoPanel),null);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   }
   return {readableChapterLayouts:24};
  });
  results.push({name:'No browser errors during story and legacy-save scenarios',passed:errors.length===0,...(errors.length?{errors}:{})});await context.close();
 }finally{fs.writeFileSync(path.join(__dirname,'story-results.json'),JSON.stringify(results,null,2)+'\n');await browser.close()}
 const failed=results.filter(r=>!r.passed);console.log(JSON.stringify({passed:results.length-failed.length,failed:failed.length}));assert.deepEqual(failed,[]);
})().catch(error=>{console.error(error);process.exitCode=1});
