const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const BASE=process.env.INDIE_TEST_URL||'http://127.0.0.1:8770/index.html';

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 try{
  const page=await browser.newPage({viewport:{width:1366,height:768},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{localStorage.setItem('lo_tutorial_v1','done');localStorage.setItem('lo_music_mute','1')});
  await page.goto(BASE);await page.waitForFunction(()=>window.BOOT?.ready&&typeof aiEvaluatePosition==='function');
  const results=await page.evaluate(()=>{
   const saved={game:G,difficulty,overlay:OV};const results=[];
   const card=(n,a,h,c=0,more={})=>({n,a,h,c,a0:a,h0:h,t:1,poison:0,moved:0,rk:0,at:'物理',...more});
   const wick=(n='余芯',more={})=>card(n,0,1,0,{fod:true,...more});
   const setup=(options={})=>{
    difficulty=options.world||'mire';OV=null;
    G={lv:options.lv||1,turn:4,hp:7,ehp:7,p:Array(5).fill(null),e:Array(5).fill(null),hand:[],eh:[],draw:[],ed:[],deck:[],reserve:[],discard:{p:[],e:[]},log:[],history:[],kills:0,sac:new Set(),busy:0,phase:'enemy-deploy',enemyDeployedTurn:4,encounterFirst:'p',st:{boss:'AI_TEST',games:[difficulty],pas:'',f:'k'},...options};
    if(options.first)G.encounterFirst=G.turn%2?options.first:otherSide(options.first);
    bossAbilitiesInitBattle();return G;
   };
   const assert=(value,message)=>{if(!value)throw new Error(message)};
   const eq=(value,expected,message)=>assert(JSON.stringify(value)===JSON.stringify(expected),(message||'Unexpected result')+': '+JSON.stringify({value,expected}));
   const chosen=()=>{const c=aiChooseDeployment();return c?{name:c.c.n,lane:c.lane,sacs:c.sacs,score:c.score}:null};
   const check=(name,fn)=>{try{const evidence=fn();results.push({name,passed:true,...(evidence?{evidence}:{})})}catch(error){results.push({name,passed:false,error:error.message})}};
   try{
    check('Keep an advantageous fighter rather than sacrifice it for a weaker body',()=>{
     setup({first:'p'});G.e[0]=card('Established fighter',3,4,1);G.p[0]=card('Weaker opponent',1,4,1);G.eh=[card('Tempting but weaker replacement',1,1,1)];
     eq(chosen(),null);
    });
    check('Block the exact lethal lane with an affordable surviving defender',()=>{
     setup({first:'p',ehp:2});G.e[0]=wick();G.p[3]=card('Lethal attacker',4,5,2);G.eh=[card('Defender',1,6,1)];
     const c=chosen();assert(c?.name==='Defender'&&c.lane===3&&c.sacs.length===1&&c.sacs[0]===0,'Did not block lethal: '+JSON.stringify(c));return c;
    });
    check('Use guard against a lethal flyer instead of a larger ordinary blocker',()=>{
     setup({first:'p',ehp:2});G.e[0]=wick();G.p[4]=card('Flyer',3,5,2,{s:'fly'});G.eh=[card('Ordinary fighter',4,6,1),card('Air guard',1,6,1,{s:'guard'})];
     const c=chosen();assert(c?.name==='Air guard'&&c.lane===4,'Did not counter flying: '+JSON.stringify(c));return c;
    });
    check('Search past the cheapest sacrifice and retain the guard protecting hero life',()=>{
     setup({first:'p',ehp:2});G.e[0]=card('Critical air guard',0,5,1,{s:'guard'});G.p[0]=card('Flyer',3,5,2,{s:'fly'});G.e[1]=card('Unopposed attacker',2,2,1);G.p[3]=card('Lethal ground attacker',3,5,2);G.eh=[card('Emergency blocker',0,6,1)];
     const c=chosen();assert(c?.lane===3&&c.sacs.length===1&&c.sacs[0]===1,'Spent the critical guard or failed to defend: '+JSON.stringify(c));return c;
    });
    check('The first guardian considers a safe sacrifice beyond the first equal-cost Wick',()=>{
     setup({first:'p'});G.e[0]=wick();G.e[1]=wick();for(const lane of [2,3,4])G.e[lane]=wick('Fresh occupied lane '+lane,{t:G.turn});G.p[0]=card('Lethal lane for a small fighter',3,1,1);G.p[1]=card('Harmless lane',0,1,0);G.eh=[card('Small fighter',2,2,1)];
     const c=chosen();assert(c?.name==='Small fighter'&&c.lane===1&&c.sacs.length===1&&c.sacs[0]===1,'Missed the safe sacrifice/placement: '+JSON.stringify(c));return c;
    });
    check('Two- and three-cost forecasts remove every sacrifice while triggering a stage passive only once',()=>{
     for(const cost of [2,3]){
      setup({world:'tide',first:'e',ehp:4});G.st.pas='血';G.e[0]=wick();G.e[1]=card('First ally',1,3,1);G.e[2]=wick();G.e[3]=card('Second ally',1,3,1);const newCard=card('Multi-cost replacement',2,5,cost,{heal:2});G.eh=[newCard];
      const sacs=cost===2?[0,2]:[0,1,2],before=JSON.stringify(G),position=openingForecast({c:newCard,i:0,sacs,lane:0},{combat:false});
      eq(position.e.filter(Boolean).map(c=>c.n),cost===2?['Multi-cost replacement','First ally','Second ally']:['Multi-cost replacement','Second ally']);
      eq(position.e[1]?.a,cost===2?2:undefined,'Passive applied incorrectly to the first ally');eq(position.e[3]?.a,1,'Stage passive triggered more than once');eq(position.e[2],null);eq(position.ehp,6);eq(position.e[0].t,G.turn,'New card was incorrectly mature');eq(JSON.stringify(G),before,'Precombat forecast changed live sacrifices');
     }
    });
    check('Fresh sacrifices stay illegal at every intelligence level',()=>{
     for(const world of DIFFICULTY_ORDER){setup({world,lv:16,turn:1,enemyDeployedTurn:1,first:'p'});G.e[2]=wick('余芯',{t:1});G.p[4]=card('Threat',5,5,2);G.eh=[card('Fighter',5,6,1)];eq(openingSacrificeSets(G.eh[0]),[]);eq(chosen(),null)}
    });
    check('A shield is spent by the first hit and does not absorb the follow-up hit',()=>{
     setup({first:'e'});G.e[0]=card('Double strike',1,6,1,{bossEffects:{extraDamage:2}});G.p[0]=card('Shielded target',0,5,1,{bossEffects:{shield:1}});
     const f=aiEvaluatePosition(G.e,G.p,{first:'e',rounds:1});eq(f.p[0]?.h,3,'Second hit reused the first shield');assert(!f.p[0]?.bossEffects?.shield,'Consumed shield survived');
    });
    check('Skip attack and delayed attack forecasts match their actual turn order',()=>{
     setup({first:'e'});G.e[0]=card('Skipped attacker',4,4,1,{bossEffects:{skipAttack:true}});
     eq(aiEvaluatePosition(G.e,G.p,{first:'e',rounds:1}).hp,7);
     G.e[0]=card('Delayed attacker',2,1,1,{bossEffects:{lateAttack:true}});G.p[0]=card('Intervening fighter',1,3,1);
     const f=aiEvaluatePosition(G.e,G.p,{first:'e',rounds:1});eq(f.e[0],null,'Delayed fighter attacked before being killed');eq(f.p[0]?.h,3);
    });
    check('Tactical forecast matches real combat for core card effects in both initiative orders',()=>{
     const fixtures=[
      ['guard versus flying',()=>[card('Air guard',1,5,1,{s:'guard'}),card('Flyer',3,5,2,{s:'fly'})]],
      ['parry',()=>[card('Light attacker',1,4,1),card('Parrying defender',2,4,1,{s:'parry'})]],
      ['shield and extra hit',()=>[card('Follow-up attacker',1,5,1,{bossEffects:{extraDamage:2}}),card('Shielded defender',1,5,1,{bossEffects:{shield:1}})]],
      ['thorns and vampire',()=>[card('Vampire',2,3,1,{s:'vamp',h0:5}),card('Thorn defender',1,4,1,{s:'thorn'})]],
      ['poison and regeneration',()=>[card('Poison blade',1,5,1,{s:'poison'}),card('Regenerating defender',1,5,1,{s:'regen',h0:6})]],
      ['pushing survivor',()=>[card('Pushing fighter',1,5,1,{mv:'push'}),card('Movable defender',1,5,1)]],
      ['kill growth',()=>[card('Growing fighter',2,4,1,{growth:true}),card('Fragile fighter',1,1,1)]],
      ['delayed attacker',()=>[card('Delayed fighter',3,1,1,{bossEffects:{lateAttack:true}}),card('Quick defender',1,5,1)]],
      ['single-use parry and elemental weakness',()=>[card('Flame fighter',2,4,1,{at:'火'}),card('Frail parry',1,5,1,{bossEffects:{parryOnce:1,fireWeakness:1}})]],
      ['death summons',()=>[card('Summoning fighter',1,1,1,{death:'spiders'}),card('Executioner',2,4,1)]]
     ];
     for(const first of ['e','p'])for(const[name,make]of fixtures){
      setup({first});const[e,p]=make();G.e[2]=e;G.p[2]=p;
      const forecast=aiEvaluatePosition(G.e,G.p,{first,rounds:1});
      const actors={p:[...G.p].filter(Boolean),e:[...G.e].filter(Boolean)},delayed=[];
      combat:for(const side of battleAttackOrder())for(const c of actors[side]){const index=G[side].indexOf(c);if(index<0||c.bossEffects?.skipAttack)continue;if(c.bossEffects?.lateAttack)delayed.push({side,card:c});else atk(side,index);if(G.hp<=0||G.ehp<=0)break combat}
      if(G.hp>0&&G.ehp>0)for(const{side,card:c}of delayed){const index=G[side].indexOf(c);if(index>=0&&!c.bossEffects?.skipAttack)atk(side,index);if(G.hp<=0||G.ehp<=0)break}
      if(G.hp>0&&G.ehp>0){for(const side of ['p','e'])for(const c of [...G[side]]){if(!c||!G[side].includes(c))continue;if(c.poison){c.poison--;bossTakeCardDamage(side,c,1,null,{kind:'poison'})}if(G[side].includes(c)&&c.s==='regen'&&c.h<c.h0)c.h++}bossAbilitiesRoundEnd()}
      const units=board=>board.map(c=>c?{n:c.n,a:c.a,h:c.h,poison:c.poison||0}:null);
      eq({hp:forecast.hp,ehp:forecast.ehp,e:units(forecast.e),p:units(forecast.p)},{hp:G.hp,ehp:G.ehp,e:units(G.e),p:units(G.p)},first+' first, '+name);
     }
     return {combatCases:fixtures.length*2};
    });
    check('Forecasting clones nested effects and never mutates battle state or rolls RNG',()=>{
     setup({world:'astral',lv:16,first:'e'});G.e[0]=card('Poison blade',1,5,1,{s:'poison',bossEffects:{skills:['vamp'],extraDamage:1}});G.e[2]=wick();G.p[0]=card('Shield bearer',1,5,1,{bossEffects:{shield:2}});G.eh=[card('Replacement',2,5,1,{heal:1,dr:1})];G.ed=[card('Unseen own draw',2,3,1)];
     const before=JSON.stringify(G),original=Math.random;let randomCalls=0;
     try{Math.random=()=>{randomCalls++;throw new Error('Forecast used RNG')};aiEvaluatePosition(G.e,G.p,{rounds:2});openingForecast({c:G.eh[0],i:0,sacs:[2],lane:2})}finally{Math.random=original}
     eq(randomCalls,0);eq(JSON.stringify(G),before,'Forecast changed the live game');
    });
    check('All 96 encounters monotonically increase search rank, depth and beam',()=>{
     const profiles=[];for(const world of DIFFICULTY_ORDER)for(let lv=1;lv<=16;lv++){setup({world,lv});profiles.push(aiProfile())}
     profiles.forEach((p,i)=>{eq(p.rank,i,'Rank');assert(Number.isFinite(p.depth)&&Number.isFinite(p.beam),'Missing search bounds');if(i){assert(p.depth>=profiles[i-1].depth,'Depth regressed');assert(p.beam>=profiles[i-1].beam,'Beam regressed')}});
     assert(profiles[95].depth>profiles[0].depth&&profiles[95].beam>profiles[0].beam,'Final guardians did not search more deeply');return {first:profiles[0],last:profiles[95]};
    });
    check('Changing hidden player hand and deck contents never changes deployment decisions',()=>{
     setup({world:'astral',lv:16,first:'p',ehp:3});G.e[0]=wick();G.p[3]=card('Visible threat',3,4,2);G.eh=[card('Defender',2,5,1),card('Attacker',4,2,1)];G.hand=[card('Secret small card',1,1,1)];G.draw=Array.from({length:24},()=>card('Secret small future card',1,1,1));
     const before=chosen();G.hand=[card('Secret flying giant',99,99,0,{s:'fly'})];G.draw=Array.from({length:24},()=>card('Secret future card',50,50,0));const after=chosen();
     assert(before&&after,'Scenario had no legal decision');eq({name:after.name,lane:after.lane,sacs:after.sacs},{name:before.name,lane:before.lane,sacs:before.sacs});
    });
    check('Later forecasts account for the next round after temporary suppression expires',()=>{
     setup({world:'astral',lv:16,first:'e',ehp:2});G.p[3]=card('Suppressed lethal threat',3,5,2,{bossEffects:{skipAttack:true}});
     const now=aiEvaluatePosition(G.e,G.p,{first:'e',rounds:1}),next=aiEvaluatePosition(G.e,G.p,{first:'e',rounds:2});
     eq(now.ehp,2);eq(next.ehp,0,'Ignored the next-round lethal threat');assert(aiProfile().depth>=2,'Final guardian only sees one round');
    });
    check('A temporary attack buff expires exactly once over a two-round forecast',()=>{
     setup({world:'astral',lv:16,first:'e'});G.e[0]=card('Temporarily strengthened fighter',2,7,1);G.e[0].a=4;G.p[0]=card('Durable zero-attack defender',0,20,1);G.bossSkill.temp=[{card:G.e[0],key:'a',delta:2}];
     const forecast=aiEvaluatePosition(G.e,G.p,{first:'e',rounds:2});eq(forecast.p[0]?.h,14,'Wrong damage across buff expiry');eq(forecast.e[0]?.a,2,'Temporary buff was removed more than once');eq(G.e[0].a,4,'Live buff was consumed by planning');eq(G.bossSkill.temp.length,1);
    });
    check('Two-deployment planning respects the remaining paid budget and never reuses its fresh summon',()=>{
     setup({world:'astral',lv:16,first:'e'});G.e[0]=wick();G.e[1]=wick();G.eh=[card('First paid fighter',2,4,1),card('Second paid fighter',4,4,1)];
     const plan={c:G.eh[0],i:0,sacs:[0],lane:0};plan.after=openingForecast(plan);
     eq(aiFollowupValue(plan,{paidRemaining:0},null),0,'Planned a paid follow-up with zero allowance');eq(aiFollowupValue(plan,{paidRemaining:1},null),0,'Spent the last allowance twice');
     assert(aiFollowupValue(plan,{paidRemaining:2},null)>0,'Failed to recognize a legal second paid deployment');
     G.e[1]=null;plan.after=openingForecast(plan);eq(aiFollowupValue(plan,{paidRemaining:2},null),0,'Sacrificed the fresh first fighter for a second paid card');
    });
    check('Movement never uncovers a lethal flying lane merely to chase another target',()=>{
     setup({world:'astral',lv:16,first:'p',ehp:2});G.e[1]=card('Mobile air guard',1,6,1,{s:'guard',mv:'shift'});G.p[1]=card('Lethal flyer',3,5,2,{s:'fly'});G.p[0]=card('Tempting ground target',1,1,1);
     eq(aiChooseMove(1),null);
    });
    check('A full late-game board stays within a bounded interactive decision budget',()=>{
     setup({world:'astral',lv:16,first:'e'});G.e=Array.from({length:5},(_,i)=>card('Own fighter '+i,i%3,3+i%2,1,{s:i===1?'guard':i===2?'poison':undefined}));G.p=Array.from({length:5},(_,i)=>card('Visible opponent '+i,1+i%3,4,1,{s:i===3?'fly':undefined}));G.eh=Array.from({length:12},(_,i)=>card('Candidate '+i,1+i%4,2+i%5,1+i%3,{s:i%4===0?'guard':undefined,heal:i%5===0?1:undefined}));
     aiChooseDeployment();const ms=[];for(let i=0;i<7;i++){const start=performance.now();aiChooseDeployment();ms.push(performance.now()-start)}ms.sort((a,b)=>a-b);
     assert(ms[3]<=120,'Median AI decision exceeds 120 ms: '+JSON.stringify(ms));assert(ms[6]<=400,'AI search has an unbounded latency spike: '+JSON.stringify(ms));return {medianMs:Math.round(ms[3]*100)/100,worstMs:Math.round(ms[6]*100)/100};
    });
   }finally{G=saved.game;difficulty=saved.difficulty;OV=saved.overlay}
   return results;
  });
  results.push({name:'No browser errors during AI scenarios',passed:errors.length===0,...(errors.length?{errors}:{})});
  fs.writeFileSync(path.join(__dirname,'ai-results.json'),JSON.stringify(results,null,2)+'\n');
  for(const result of results)console.log(result.passed?'PASS':'FAIL',result.name,result.error||'');
  const failed=results.filter(result=>!result.passed);console.log(JSON.stringify({passed:results.length-failed.length,failed:failed.length}));
  assert.deepEqual(failed,[],'AI regression scenarios failed');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
