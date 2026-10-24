const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const BASE=process.env.INDIE_TEST_URL||'http://127.0.0.1:8770/index.html';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 try{
  const page=await browser.newPage();await page.goto(BASE);await page.waitForFunction(()=>window.BOOT?.ready);
  const baseline=JSON.parse(fs.readFileSync(path.join(__dirname,'combat-baseline.json'),'utf8'));
  const code=await page.evaluate(names=>Object.fromEntries(names.map(name=>[name,window[name].toString()])),Object.keys(baseline));
  const results=Object.entries(baseline).map(([name,digest])=>({name,passed:crypto.createHash('sha256').update(code[name]).digest('hex')===digest}));
  fs.writeFileSync(path.join(__dirname,'control-flow-results.json'),JSON.stringify(results,null,2)+'\n');
  assert.ok(results.every(r=>r.passed),'A protected combat rule changed');console.log(JSON.stringify({passed:results.length,failed:0}));
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
