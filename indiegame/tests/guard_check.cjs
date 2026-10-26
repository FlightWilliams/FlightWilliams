const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const [name,url] of [['indiegame',process.env.INDIE_TEST_URL||'http://127.0.0.1:8001/indiegame/index.html'],['game',process.env.GAME_TEST_URL||'http://127.0.0.1:8001/game/index.html']]){
   const page=await browser.newPage();await page.goto(url);await page.waitForFunction(()=>window.BOOT?.ready);
   const result=await page.evaluate(()=>{
    const target={n:'Guard',a:0,h:20,s:'guard',at:'物理'};
    return [0,1,2,3,5].map(a=>{
     const attacker={n:'Attacker',a,h:20,at:'物理'};
     return {a,normal:dealt(attacker,target),boss:bossAttackDamage(attacker,target),piercing:bossAttackDamage(attacker,target,true),unguarded:dealt(attacker,{...target,s:null})};
    });
   });
   assert.deepEqual(result,[0,1,2,3,5].map(a=>({a,normal:a>=2?a-1:a,boss:a>=2?a-1:a,piercing:a,unguarded:a})));
   console.log('PASS',name,'Guard thresholds, normal/Boss calculations, piercing and unguarded damage');
   const shields=await page.evaluate(()=>{
    const saved=G,results=[];
    try{
     for(const side of ['p','e'])for(const strength of [1,2])for(const damage of [1,7]){
      const card={n:'Shield',a:0,h:20,bossEffects:{shield:strength}};
      G={p:[],e:[],turn:2};G[side]=[card];
      const zero=bossTakeCardDamage(side,card,0),retained=card.bossEffects.shield===strength;
      const first=bossTakeCardDamage(side,card,damage),consumed=!card.bossEffects.shield;
      const second=bossTakeCardDamage(side,card,damage);
      results.push(zero===0&&retained&&first===0&&consumed&&second===damage&&card.h===20-damage);
     }
     const attacker={n:'Attack',a:7,h:20,at:'物理',bossEffects:{}},target={n:'Shield',a:0,h:20,at:'物理',bossEffects:{shield:1}};
     G={p:[attacker],e:[target],turn:2};
     bossResolveAttack('p',0);results.push(target.h===20&&!target.bossEffects.shield);
     bossResolveAttack('p',0);results.push(target.h===13);
     return results;
    }finally{G=saved}
   });
   assert.ok(shields.every(Boolean));
   console.log('PASS',name,'Shield fully blocks one damage event on either side, preserves zero-damage shields, and is consumed once');

   if(name==='indiegame'){
    const names=await page.evaluate(()=>PLAYER_NAMES);
    assert.ok(names.some(n=>n.zh==='艾兰'&&n.en==='Alan'));assert.ok(names.some(n=>n.zh==='汤姆'&&n.en==='Tom'));
    await page.fill('#nm','');await page.click('[data-a="start"]');
    const chosen=await page.evaluate(()=>localStorage.getItem('lo_name'));
    assert.ok(names.some(n=>n.zh===chosen||n.en===chosen));
    console.log('PASS indiegame empty name selects a simple name from the bilingual pool');
   }
   await page.close();
  }
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
