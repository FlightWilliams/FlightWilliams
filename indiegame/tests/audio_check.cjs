const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const ROOT=path.resolve(__dirname,'..'),GAME=path.resolve(ROOT,'../game');
const INDIE_URL=process.env.INDIE_TEST_URL||'http://127.0.0.1:8920/indiegame/index.html';
const GAME_URL=process.env.GAME_TEST_URL||'http://127.0.0.1:8920/game/index.html';
const results=[],hash=value=>crypto.createHash('sha256').update(value).digest('hex');
async function check(name,fn){const evidence=await fn();results.push({name,passed:true,...(evidence?{evidence}:{})});console.log('PASS',name)}
(async()=>{
 await check('The deferred sound asset is byte-identical in both editions',()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'audio/shared-manifest.json'))),a=fs.readFileSync(path.join(ROOT,manifest.asset)),b=fs.readFileSync(path.join(GAME,manifest.asset));
  assert.ok(a.equals(b));assert.equal(hash(a),manifest.sha256);return {sha256:hash(a)};
 });
 await check('All twelve independent sound files match the original files and their manifest',()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'audio/manifest.json')));
  for(const entry of manifest){const a=fs.readFileSync(path.join(ROOT,'audio',entry.id+'.wav')),b=fs.readFileSync(path.join(GAME,'audio',entry.id+'.wav'));assert.ok(a.equals(b),entry.id);assert.equal(hash(a),entry.wav_sha256)}assert.equal(manifest.length,12);
 });
 await check('Thirty independent detective scores retain the campaign routes and valid musical events',()=>{
  const scores=JSON.parse(fs.readFileSync(path.join(ROOT,'data/music-scores.json')));
  assert.equal(scores.length,30);assert.equal(new Set(scores.map(s=>s.id)).size,30);
  const instruments=new Set(['guitar','upright','rhodes','piano','brush','strings']);
  for(const world of ['mire','brass','cinder','tide','frost','astral']){
   for(const[act,stages]of [[1,[1,4]],[2,[5,8]],[3,[9,12]],[4,[13,15]],[5,[16,16]]]){
    const id=world+(act===5?'-final':act===1?'':'-act'+act),s=scores.find(row=>row.id===id);
    assert.ok(s,id);assert.equal(s.game,world);assert.deepEqual(s.stages,stages);assert.equal(s.final,act===5);
    assert.ok(s.tempo>0&&s.beatsPerBar>0&&s.bars>0&&s.events.length>0);
    for(const e of s.events){assert.ok(instruments.has(e.i),id+': '+e.i);assert.ok(Number.isFinite(e.b)&&e.b>=0&&e.b<s.bars*s.beatsPerBar);assert.ok(Number.isInteger(e.p)&&e.p>=12&&e.p<=108);assert.ok(e.d>0&&e.v>0&&e.v<=1)}
   }
  }
 });
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 try{
  const context=await browser.newContext(),errors=[];context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
  await require('./auto_entrances.cjs')(context);await context.addInitScript(()=>{try{localStorage.setItem('lo_music_mute','1');localStorage.setItem('mz_music_mute','1');localStorage.setItem('lo_tutorial_v1','done');localStorage.setItem('mz_tutorial_v1','done')}catch{}});
  const pages=[];for(const url of [GAME_URL,INDIE_URL]){const page=await context.newPage();await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.BOOT?.ready);await page.waitForFunction(()=>window.LANTERN_AUDIO?.audioReady||window.XINHUO_WEB?.audioReady);pages.push(page)}
  await check('Both players load all eleven legacy, seven paper and twelve combat samples',async()=>{
   const snapshots=[];for(const page of pages)snapshots.push(await page.evaluate(()=>({legacy:JSON.stringify(SMP),paper:JSON.stringify(CARD_AUDIO_SAMPLES),combat:JSON.stringify(COMBAT_AUDIO_SAMPLES),counts:[Object.keys(SMP).length,Object.keys(CARD_AUDIO_SAMPLES).length,Object.keys(COMBAT_AUDIO_SAMPLES).length]})));
   assert.deepEqual(snapshots[0],snapshots[1]);assert.deepEqual(snapshots[0].counts,[11,7,12]);
  });
  await check('Rendered cues match within floating-point mixing precision',async()=>{
   const waves=[];
   for(const page of pages){
    await page.evaluate(()=>{au();loadSmp()});await page.waitForFunction(()=>Object.keys(BUF).length===Object.keys(SMP).length);
    waves.push(await page.evaluate(async()=>{
     const out={},nativeAu=au,nativeRandom=Math.random,wasMute=mute;
     try{mute=false;
      const cues=['draw','shuffle','place','eplace','burn','heal','rare','hit','kill','clang','die','win','whoosh','blade','beast','beastBird','beastBull','magic','bow','spirit','impact'];
      for(const cue of cues){const c=new OfflineAudioContext(1,44100*3,44100);au=()=>c;let seed=7;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
       if(SND[cue])SND[cue]();else if(cue==='beastBird'||cue==='beastBull')playCombatSound('beast',c,cue);else playCombatSound(cue,c);
       const buffer=await c.startRendering(),values=buffer.getChannelData(0);if(!values.some(v=>v!==0))throw Error('Silent cue '+cue);
       // The files are checked byte-for-byte above. Native Web Audio DSP may
       // round mixing/filter operations differently; test rendered precision.
       out[cue]={rms:Math.sqrt(values.reduce((sum,n)=>sum+n*n,0)/values.length),probe:Array.from(values.filter((_,i)=>i%16===0))};
      }
     }finally{au=nativeAu;Math.random=nativeRandom;mute=wasMute}out.compositeSource=['kill','die','clang','win'].flatMap(key=>[SND[key].toString(),OLD[key].toString()]).concat([tone.toString(),nz.toString()]);return out;
    }));
   }
   let maxWaveError=0;
   for(const cue of Object.keys(waves[0])){
    const a=waves[0][cue],b=waves[1][cue];
    if(cue==='compositeSource'){assert.deepEqual(a,b,cue);continue}
    assert.equal(a.probe.length,b.probe.length);assert.ok(Math.abs(a.rms-b.rms)<1e-7,cue+' RMS');
    for(let i=0;i<a.probe.length;i++)maxWaveError=Math.max(maxWaveError,Math.abs(a.probe[i]-b.probe[i]));
   }
   assert.ok(maxWaveError<2e-6);return {cues:Object.keys(waves[0]).length-1,maxWaveError};
  });
  await check('Bird and bull actors select the matching shared creature recording',async()=>{
   assert.deepEqual(await pages[1].evaluate(()=>{
    const play=playCombatSound,proof=[];try{playCombatSound=(kind,c,variant)=>{proof.push({kind,variant});return true};
     for(const family of ['bird','bull']){const actor=POOL.find(c=>CARD_ART_PROFILES[c.n]?.family===family&&cardAttackSoundType(c)==='beast');if(!actor)throw Error('Missing '+family);playCardAttackSound(actor)}
    }finally{playCombatSound=play}return proof;
   }),[{kind:'beast',variant:'beastBird'},{kind:'beast',variant:'beastBull'}]);
  });
  await check('The actual sound switch immediately stops paper and combat voices',async()=>{
   const r=await pages[1].evaluate(()=>{mute=false;SND.shuffle();SND.burn();const playing=activeRecordedCardSources.size+activeCombatSources.size;const button=document.createElement('button');button.dataset.a='mute';document.body.appendChild(button);button.click();button.remove();return {playing,remaining:activeRecordedCardSources.size+activeCombatSources.size,mute}});
   assert.ok(r.playing>0);assert.equal(r.remaining,0);assert.equal(r.mute,true);
  });
  await check('Unavailable optional audio never blocks boot or starting a battle',async()=>{
   const page=await context.newPage();await page.route('**/sounds.*.js',route=>route.abort());await page.goto(INDIE_URL,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.BOOT?.ready);await page.evaluate(()=>{mute=false;LANTERN_AUDIO.loadAudio();SND.draw();SND.burn();playCardAttackSound(POOL[0]);openInitiativeCoin=async()=> 'p';newRun()});await page.waitForFunction(()=>G&&!G.busy&&!drawRunning);assert.equal(await page.evaluate(()=>LANTERN_AUDIO.audioReady),false);await page.close();
  });
  await check('The single-file edition includes every sample and makes no sample request',async()=>{
   const page=await context.newPage(),requests=[];page.on('request',r=>{if(/sounds\..*\.js/.test(r.url()))requests.push(r.url())});await page.goto(INDIE_URL.replace('index.html','standalone.html'),{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.BOOT?.ready&&window.LANTERN_AUDIO?.audioReady);await page.evaluate(()=>{LANTERN_AUDIO.loadAudio();mute=false;SND.draw()});assert.deepEqual(requests,[]);assert.deepEqual(await page.evaluate(()=>[Object.keys(SMP).length,Object.keys(CARD_AUDIO_SAMPLES).length,Object.keys(COMBAT_AUDIO_SAMPLES).length]),[11,7,12]);await page.close();
  });
  assert.deepEqual(errors,[]);results.push({name:'No browser errors in shared sound and fallback scenarios',passed:true});await context.close();
 }finally{await browser.close()}
 fs.writeFileSync(path.join(__dirname,'audio-results.json'),JSON.stringify(results,null,2)+'\n');console.log(JSON.stringify({passed:results.length,failed:0}));
})().catch(error=>{console.error(error);process.exitCode=1});
