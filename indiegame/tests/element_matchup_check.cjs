const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs');
const targets=[
 {name:'indiegame',url:process.env.INDIE_TEST_URL||'http://127.0.0.1:8005/indiegame/index.html',prefix:'lo_'},
 {name:'game',url:process.env.GAME_TEST_URL||'http://127.0.0.1:8005/game/index.html',prefix:'mz_'}
];
const edges=[['火','血'],['火','冰'],['血','光'],['光','暗'],['暗','雷'],['雷','火'],['魔','火'],['冰','毒'],['毒','魔']];
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 let passed=0;
 try{
  for(const target of targets){
   const context=await browser.newContext({viewport:{width:1366,height:768},reducedMotion:'reduce'});
   await require('./auto_entrances.cjs')(context);
   await context.addInitScript(prefix=>{localStorage.setItem(prefix+'tutorial_v1','done');localStorage.setItem(prefix+'music_mute','1')},target.prefix);
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   const check=async(name,fn)=>{await fn();passed++;console.log('PASS',target.name,name)};
   try{
    await page.goto(target.url);await page.waitForFunction(()=>window.BOOT?.ready);
    await page.evaluate(()=>{mute=true;mmute=true;openInitiativeCoin=async()=> 'p';newRun()});
    await page.waitForFunction(()=>G&&!G.busy&&!drawRunning&&G.phase==='player-deploy');
    await page.evaluate(()=>{
     window.elementTestCard=(at,n='Test Card',extra={})=>makeCard({n,a:2,h:10,c:0,at,kind:'mob',...extra});
     window.resetElementFixture=()=>{
      OV=null;infoPanel=null;HOLD_DETAIL=null;DM=null;TUT=null;if(typeof STORY!=='undefined')STORY.pendingFriend=null;
      G.turn=2;G.phase='player-deploy';G.entrancePending=false;G.busy=0;G.mustDraw=0;G.freezeChoice=false;G.sel=null;G.moveSel=null;G.sac=new Set();G.hp=7;G.ehp=7;
      G.p=[elementTestCard('火','Fire'),elementTestCard('物理','Physical'),elementTestCard('魔','Magic'),elementTestCard('冰','Ice'),null];
      G.e=[elementTestCard('血','Blood'),elementTestCard('冰','Opposing Ice'),elementTestCard('毒','Poison'),null,elementTestCard('火','Opposing Fire')];
      G.hand=[G.p[0],elementTestCard('雷','Hand Card')];bossAbilitiesInitBattle();render();
     };resetElementFixture();
    });
    await check('All elemental pairs match damage bonuses and penalties; Physical and equal elements remain neutral',async()=>{
     const matrix=await page.evaluate(()=>{
      const elements=['物理','火','血','光','暗','雷','魔','冰','毒'];
      return elements.flatMap(a=>elements.map(b=>{const attacker=elementTestCard(a),defender=elementTestCard(b);return {a,b,relation:elementMatchup(attacker,defender),normal:dealt(attacker,defender),boss:bossAttackDamage(attacker,defender)}}));
     });
     for(const row of matrix){const relation=edges.some(([a,b])=>a===row.a&&b===row.b)?1:edges.some(([a,b])=>a===row.b&&b===row.a)?-1:0;assert.deepEqual(row,{a:row.a,b:row.b,relation,normal:2+relation,boss:2+relation})}
     assert.equal(matrix.length,81);
    });
    await check('Only occupied opposing lanes display reciprocal arrows, including temporary-element effects',async()=>{
     const badges=()=>page.locator('.board .element-matchup').evaluateAll(nodes=>nodes.map(n=>({id:n.parentElement.id,arrow:n.textContent,advantage:n.classList.contains('is-advantage'),label:n.getAttribute('aria-label')})));
     const initial=await badges();assert.equal(initial.length,4);
     assert.deepEqual(initial.map(x=>[x.id,x.arrow,x.advantage]).sort(),[['c-e-0','↓',false],['c-e-2','↑',true],['c-p-0','↑',true],['c-p-2','↓',false]].sort());
     assert.ok(initial.every(x=>x.label&&x.label.includes('属性')));
     assert.equal(await page.locator('.hand .element-matchup,.sidebar-inspection .element-matchup').count(),0);
     assert.equal(await page.evaluate(()=>cardHTML(G.p[0]).includes('element-matchup')),false,'A board instance rendered as a preview must not inherit its board arrow');
     await page.evaluate(()=>{bossTemp(G.p[0],{at:'血'});bossTemp(G.e[0],{at:'火'});renderSelection()});
     assert.equal(await page.locator('#c-p-0 > .element-matchup').textContent(),'↓');assert.equal(await page.locator('#c-e-0 > .element-matchup').textContent(),'↑');
     await page.evaluate(()=>{bossStripRoundEffects(G.p[0]);bossStripRoundEffects(G.e[0]);renderSelection()});
     assert.equal(await page.locator('#c-p-0 > .element-matchup').textContent(),'↑');
    });
    await check('Moving into another lane and removing an opponent refreshes both board indicators',async()=>{
     await page.evaluate(async()=>{G.p[3].mv='shift';await moveCard('p',3,1,false)});
     assert.equal(await page.locator('#c-p-4 > .element-matchup').textContent(),'↓');assert.equal(await page.locator('#c-e-4 > .element-matchup').textContent(),'↑');
     await page.evaluate(()=>{kill('e',0,G.p[0]);renderSelection()});
     assert.equal(await page.locator('#c-p-0 > .element-matchup').count(),0);assert.equal(await page.locator('#c-p-0').evaluate(n=>n.classList.contains('has-element-matchup')),false);
    });
    await check('Actual card attacks use elemental damage while direct Flying attacks and zero Attack do not gain it',async()=>{
     const result=await page.evaluate(()=>{
      resetElementFixture();atk('p',0);const strong=G.e[0].h;
      resetElementFixture();atk('e',0);const weak=G.p[0].h;
      resetElementFixture();G.p[0].s='fly';atk('p',0);const flying={hp:G.ehp,cardHp:G.e[0].h};
      resetElementFixture();G.p[0].a=0;atk('p',0);const zero=G.e[0].h;
      resetElementFixture();G.p[0].a=1;G.p[0].at='血';G.e[0].at='火';atk('p',0);const minimum=G.e[0].h;
      resetElementFixture();return {strong,weak,flying,zero,minimum};
     });assert.deepEqual(result,{strong:7,weak:9,flying:{hp:5,cardHp:10},zero:10,minimum:10});
    });
    await check('Rules list every counter and explain neutral/direct damage; arrows stay accessible in both languages',async()=>{
     for(const language of ['zh-CN','en']){
      await page.evaluate(language=>{setGameLanguage(language);infoPanel='rules';render()},language);
      const rules=await page.locator('.rules-copy').innerText();
      assert.equal(await page.locator('.element-counter-rules li').count(),8);
      for(const [a,b]of edges){const row=await page.evaluate(({a,b})=>[...document.querySelectorAll('.element-counter-rules li')].some(n=>n.textContent.includes(i18nText(a))&&n.textContent.includes(i18nText(b))),{a,b});assert.ok(row,`${language}: missing ${a} -> ${b}`)}
      if(language==='en'){assert.match(rules,/Physical/);assert.match(rules,/Direct attacks on life/);assert.ok(!/[\u3400-\u9fff]/.test(rules));}
      else{assert.match(rules,/最低为0/);assert.match(rules,/直击/)}
      await page.evaluate(()=>{infoPanel=null;render()});
      const label=await page.locator('#c-p-0 > .element-matchup').getAttribute('aria-label');assert.ok(label);if(language==='en')assert.ok(!/[\u3400-\u9fff]/.test(label));
     }
    });
    await check('Green/red arrows occupy the top-right corner without extending outside normal or gold cards',async()=>{
     await page.evaluate(()=>{setGameLanguage('zh-CN');resetElementFixture();G.p[0]={...makeCard(POOL.find(c=>c.rarity==='rare')),a:2,h:10,at:'火'};render()});
     for(const[width,height]of[[320,568],[390,759],[844,390],[1366,768]]){
      await page.setViewportSize({width,height});await page.evaluate(()=>layoutGame());
      const proof=await page.locator('.board .element-matchup').evaluateAll(nodes=>nodes.map(n=>{const a=n.getBoundingClientRect(),b=n.parentElement.getBoundingClientRect();return {color:getComputedStyle(n).color,top:a.top-b.top,right:b.right-a.right,inside:a.left>=b.left-1&&a.top>=b.top-1&&a.right<=b.right+1&&a.bottom<=b.bottom+1,advantage:n.classList.contains('is-advantage')}}));
      assert.ok(proof.every(x=>x.inside&&x.top<8&&x.right<8),`${width}: badge is not inside top-right`);
      const colors=new Set(proof.map(x=>x.color));assert.equal(colors.size,2,'Advantage/disadvantage must have different green/red colors');
      for(const badge of proof){const[r,g,b]=badge.color.match(/\d+/g).map(Number);assert.ok(badge.advantage?g>r&&g>b:r>g&&r>b,`${width}: arrow has the wrong advantage/disadvantage color`)}
     }
    });
    await check('No browser errors',async()=>assert.deepEqual(errors,[]));
   }finally{await context.close()}
  }
  console.log(JSON.stringify({passed,failed:0}));
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
