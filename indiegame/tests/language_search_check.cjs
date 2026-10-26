const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const targets=[
 {name:'indiegame',url:process.env.INDIE_TEST_URL||'http://127.0.0.1:8892/index.html',prefix:'lo_'},
 {name:'game',url:process.env.GAME_TEST_URL||'http://127.0.0.1:8893/index.html',prefix:'mz_'}
].filter(t=>!process.env.LANGUAGE_TEST_TARGET||t.name===process.env.LANGUAGE_TEST_TARGET);
const results=[];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 try{
  for(const target of targets){
   const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce'});
   const page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
   await require('./auto_entrances.cjs')(context);await context.addInitScript(prefix=>{localStorage.setItem(prefix+'tutorial_v1','done');localStorage.setItem(prefix+'music_mute','1')},target.prefix);
   const check=async(name,fn)=>{try{const evidence=await fn();results.push({project:target.name,name,passed:true,...(evidence?{evidence}:{})});console.log('PASS',target.name,name)}catch(error){results.push({project:target.name,name,passed:false,error:error.message});console.log('FAIL',target.name,name,error.message)}};
   try{
    await page.goto(target.url);await page.waitForFunction(()=>window.BOOT?.ready&&typeof setGameLanguage==='function'&&typeof englishCardName==='function');
    await page.evaluate(()=>{mute=true;mmute=true;openInitiativeCoin=async()=> 'p';newRun()});await page.waitForFunction(()=>G&&!G.busy&&!drawRunning);
    await page.evaluate(()=>{infoPanel=null;if(typeof STORY!=='undefined'){STORY.pendingFriend=null;saveStory()}G.turn=2;G.enemyDeployedTurn=2;G.phase='player-deploy';G.mustDraw=0;G.p[1]={...makeCard(SQ),t:1};G.sel=G.hand.findIndex(c=>c.c===1);G.sac=new Set([1]);setGameLanguage('zh-CN');render();window.languageProof={game:G,turn:G.turn,deck:G.deck,hand:G.hand,cards:G.hand.slice(),board:G.p.slice(),selected:G.sel,sac:[...G.sac],hp:G.hp,ehp:G.ehp};});
    const proof=()=>page.evaluate(()=>({sameGame:G===languageProof.game,sameDeck:G.deck===languageProof.deck,sameHand:G.hand===languageProof.hand,sameCards:G.hand.every((c,i)=>c===languageProof.cards[i]),sameBoard:G.p.every((c,i)=>c===languageProof.board[i]),turn:G.turn,selected:G.sel,sac:[...G.sac],hp:G.hp,ehp:G.ehp,expected:{turn:languageProof.turn,selected:languageProof.selected,sac:languageProof.sac,hp:languageProof.hp,ehp:languageProof.ehp}}));
    await check('The battle language button immediately follows sound and toggles without changing the selected play',async()=>{
     for(const language of ['en','zh-CN']){
      const button=page.locator('.table-tools [data-language]');assert.equal(await button.count(),1);
      assert.equal(await button.getAttribute('data-language'),language);
      assert.equal(await button.evaluate(node=>node.previousElementSibling?.dataset.a),'mute');
      await button.click();assert.equal(await page.evaluate(()=>gameLanguage),language);
      const state=await proof();assert.ok(state.sameGame&&state.sameDeck&&state.sameHand&&state.sameCards&&state.sameBoard);assert.deepEqual({turn:state.turn,selected:state.selected,sac:state.sac,hp:state.hp,ehp:state.ehp},state.expected);
     }
    });
    let card;
    await check('Chinese and English card names work in the catalogue in either UI language, including case and spaces',async()=>{
     card=await page.evaluate(()=>{const c=G.deck.find(c=>c.s==='fly')||G.deck[0];return {id:c.n,zh:typeof shortCardName==='function'?shortCardName(c,'zh-CN'):c.n,en:englishCardName(c)}});
     for(const language of ['zh-CN','en']){
      await page.evaluate(language=>{DM=null;infoPanel=null;OV='catalog';catalogGame='all';catalogKind='all';catalogRarity='all';catalogPage=0;catalogSearch='';setGameLanguage(language);render()},language);
      for(const query of [card.zh,'  '+card.en.toUpperCase()+'  ']){
       await page.locator('#catsearch').fill(query);
       const found=await page.locator('.catalog-entry .card').evaluateAll((nodes,id)=>nodes.some(node=>node.dataset.cardName===id),card.id);assert.ok(found,`${language} catalogue query ${query} did not find ${card.id}`);
      }
     }
     return {canonical:card.id,chinese:card.zh,english:card.en};
    });
    await check('Deck management accepts both names in either language without changing the deck',async()=>{
     const baseline=await page.evaluate(()=>G.deck.map(c=>c.n));
     await page.evaluate(()=>{OV=null;infoPanel=null;openDeckManager('run')});
     for(const language of ['zh-CN','en']){
      await page.evaluate(language=>{setGameLanguage(language);DM.tab='active';DM.search='';render()},language);
      for(const query of [card.zh,'  '+card.en.toLowerCase()+'  ']){
       await page.locator('#dm-search').fill(query);
       const found=await page.locator('.managed-card .card').evaluateAll((nodes,id)=>nodes.some(node=>node.dataset.cardName===id),card.id);assert.ok(found,`${language} deck query ${query} did not find ${card.id}`);
      }
     }
     assert.deepEqual(await page.evaluate(()=>G.deck.map(c=>c.n)),baseline);
    });
    await check('English ability keywords find matching collected cards in both search modules in either language',async()=>{
     const keywordCards=await page.evaluate(()=>['fly','guard','heal'].map(key=>{const c=POOL.find(c=>c.rarity!=='rare'&&(key==='heal'?c.heal>0:c.s===key));if(c)collectCard(c);return c?{id:c.n,word:key==='fly'?'flying':key}:null}).filter(Boolean));
     assert.equal(keywordCards.length,3);
     for(const language of ['zh-CN','en']){
      await page.evaluate(language=>{DM=null;OV='catalog';infoPanel=null;catalogGame='all';catalogKind='all';catalogRarity='all';catalogSearch='';catalogPage=0;setGameLanguage(language);render()},language);
      for(const item of keywordCards){await page.locator('#catsearch').fill(item.word);assert.ok(await page.locator('.catalog-entry .card').evaluateAll((nodes,id)=>nodes.some(node=>node.dataset.cardName===id),item.id),`${language} catalogue missed ${item.word}`)}
      await page.evaluate(()=>{OV=null;openDeckManager('run');DM.tab='library';DM.search='';DM.page=0;render()});
      for(const item of keywordCards){await page.locator('#dm-search').fill(item.word);assert.ok(await page.locator('.managed-card .card').evaluateAll((nodes,id)=>nodes.some(node=>node.dataset.cardName===id),item.id),`${language} library missed ${item.word}`)}
     }
    });
    await check('English searches never reveal locked cards or offer an Add button for them',async()=>{
     const locked=await page.evaluate(()=>{const c=POOL.find(c=>!isCollected(c)&&c.rarity!=='rare');return {id:c.n,en:englishCardName(c)}});
     for(const language of ['zh-CN','en']){
      await page.evaluate(language=>{DM=null;OV='catalog';catalogSearch='';catalogPage=0;setGameLanguage(language);render()},language);await page.locator('#catsearch').fill(locked.en);
      assert.equal(await page.locator('.catalog-entry .card').evaluateAll((nodes,id)=>nodes.some(node=>node.dataset.cardName===id),locked.id),false);
      await page.evaluate(()=>{OV=null;openDeckManager('run');DM.tab='library';DM.search='';DM.page=0;render()});await page.locator('#dm-search').fill(locked.en);
      assert.equal(await page.locator('.managed-card .card').evaluateAll((nodes,id)=>nodes.some(node=>node.dataset.cardName===id),locked.id),false);
      assert.equal(await page.locator('[data-a="dm-add"]').evaluateAll((nodes,id)=>nodes.some(node=>node.dataset.n===id),locked.id),false);
     }
    });
    await check('Sound and language stay visible and clickable across phone and desktop battle headers',async()=>{
     await page.evaluate(()=>{DM=null;OV=null;infoPanel=null;render()});
     const evidence=[];
     for(const[width,height]of[[320,568],[390,759],[844,390],[1366,768]]){
      await page.setViewportSize({width,height});
      for(const language of ['zh-CN','en']){
       await page.evaluate(language=>{setGameLanguage(language);render()},language);
       assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width}x${height} ${language} page overflow`);
       for(const selector of ['.table-tools [data-a="mute"]','.table-tools [data-language]']){
        const button=page.locator(selector),box=await button.boundingBox();assert.ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=width+1&&box.y+box.height<=height+1,`${width}x${height} ${language} clipped ${selector}: ${JSON.stringify(box)}`);
        assert.ok(await button.evaluate(node=>{const r=node.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return hit===node||node.contains(hit)}),`${width}x${height} ${language} covered ${selector}`);
       }
       await page.screenshot({path:path.join('/tmp',`bilingual-${target.name}-${width}x${height}-${language}.png`)});
      }
      evidence.push({width,height});
     }
     return evidence;
    });
    await check('Language preference and canonical battle progress survive reload',async()=>{
     await page.evaluate(()=>{DM=null;OV=null;infoPanel=null;setGameLanguage('en');render();checkpointSave()});
     const state=()=>page.evaluate(()=>({turn:G.turn,hp:G.hp,ehp:G.ehp,deck:G.deck.map(c=>c.n),hand:G.hand.map(c=>c.n),p:G.p.map(c=>c&&{n:c.n,a:c.a,h:c.h,t:c.t}),e:G.e.map(c=>c&&{n:c.n,a:c.a,h:c.h,t:c.t})}));
     const before=await state();await page.reload();await page.waitForFunction(()=>window.BOOT?.ready&&G&&!G.busy);assert.equal(await page.evaluate(()=>gameLanguage),'en');assert.deepEqual(await state(),before);
     assert.equal(await page.evaluate(()=>localStorage.getItem(LANGUAGE_STORAGE)),'en');
    });
    await check('No browser errors',async()=>assert.deepEqual(errors,[]));
   }finally{await context.close()}
  }
 }finally{await browser.close();fs.writeFileSync(path.join(__dirname,'language-search-results.json'),JSON.stringify(results,null,2)+'\n')}
 const failed=results.filter(r=>!r.passed);console.log(JSON.stringify({passed:results.length-failed.length,failed:failed.length}));assert.deepEqual(failed,[]);
})().catch(error=>{console.error(error);process.exitCode=1});
