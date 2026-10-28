const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 let passed=0;
 try{
  for(const [project,url]of [['indiegame',process.env.INDIE_TEST_URL||'http://127.0.0.1:8005/indiegame/index.html'],['game',process.env.GAME_TEST_URL||'http://127.0.0.1:8005/game/index.html']]){
   const page=await browser.newPage();await page.goto(url);await page.waitForFunction(()=>window.BOOT?.ready);
   const result=await page.evaluate(()=>{
    const failed=[],pairs=POOL.filter(card=>card.rarity==='rare');
    for(const language of ['zh-CN','en']){
     gameLanguage=language;
     for(const rare of pairs){
      const base=POOL.find(card=>card.n===rare.baseName),label=displayedCardName(rare),expected=displayedCardName(base),node=document.createElement('div');
      node.innerHTML=cardHTML(rare);document.body.appendChild(node);localizeRoot(node);
      const card=node.querySelector('.card');
      if(label!==expected||card.querySelector('.top b').textContent!==expected||card.dataset.cardName!==rare.n||!card.classList.contains('rare-card'))failed.push({language,id:rare.n,label,expected});
      node.remove();
     }
    }
    return {pairs:pairs.length,failed};
   });
   assert.equal(result.pairs,108);assert.deepEqual(result.failed,[]);passed++;
   console.log('PASS',project,'all normal/gold names match in both languages while gold IDs and styles remain distinct');
   const tokens=await page.evaluate(project=>{
    const ids=project==='indiegame'?['鎏金灯蛛','鎏金余芯']:['金色小蜘蛛','金色余灰'];
    return ids.map(n=>{const c=makeCard({n,a:0,h:1,c:0,rarity:'rare',token:true,at:'物理'}),out={};for(const language of ['zh-CN','en']){gameLanguage=language;const node=document.createElement('div');node.innerHTML=cardHTML(c);document.body.appendChild(node);localizeRoot(node);out[language]=node.querySelector('.top b').textContent;node.remove()}return out});
   },project);
   assert.deepEqual(tokens,project==='indiegame'?[{'zh-CN':'灯蛛',en:'Wick Spider'},{'zh-CN':'余芯',en:'Wick'}]:[{'zh-CN':'小蜘蛛',en:'Spiderling'},{'zh-CN':'余灰',en:'Ash'}]);passed++;
   console.log('PASS',project,'gold token names omit rarity wording');
   await page.close();
  }
  console.log(JSON.stringify({passed,failed:0}));
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
