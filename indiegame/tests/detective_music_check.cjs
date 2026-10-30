const {chromium}=require('playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const BASE=process.env.INDIE_TEST_URL||'http://127.0.0.1:8005/indiegame/index.html';
const OUT=process.env.MUSIC_PREVIEW_DIR||'/tmp/lantern-detective-music';
const worlds=['mire','brass','cinder','tide','frost','astral'];

(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 let passed=0;const results=[];fs.mkdirSync(OUT,{recursive:true});
 try{
  const context=await browser.newContext({viewport:{width:390,height:759},reducedMotion:'reduce'});
  await require('./auto_entrances.cjs')(context);
  await context.addInitScript(()=>{localStorage.setItem('lo_music_mute','1');localStorage.setItem('lo_tutorial_v1','done')});
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  const check=async(name,fn)=>{const evidence=await fn();passed++;results.push({name,...(evidence?{evidence}:{})});console.log('PASS',name)};
  try{
   await page.goto(BASE);await page.waitForFunction(()=>window.BOOT?.ready&&typeof createCampaignSynth==='function');
   await page.evaluate(()=>{
    // Suspend offline rendering at the same short look-ahead cadence as live
    // playback. Scheduling an entire track up front would steal future voices
    // from the real 28-voice pool and would not test what the player hears.
    window.renderDetectiveMusic=async({key,seconds=8,instrument=null,wav=false})=>{
     const sampleRate=22050,c=new OfflineAudioContext(2,Math.ceil(seconds*sampleRate),sampleRate),g=c.createGain();
     const score=instrument?{tempo:60,dynamics:.52,events:[{b:0,p:60,d:1.3,v:.3,i:instrument}]}:musicScore(key);
     g.gain.value=score.dynamics;g.connect(c.destination);
     if(wav){g.gain.setValueAtTime(score.dynamics,Math.max(0,seconds-.6));g.gain.linearRampToValueAtTime(0,seconds-.02)}
     const synth=createCampaignSynth(c,g),events=[...score.events].sort((a,b)=>a.b-b.b),beat=60/score.tempo;
     let index=0,maxVoices=0;
     const schedule=()=>{
      const horizon=c.currentTime+.24;
      while(index<events.length&&.02+events[index].b*beat<horizon){
       const e=events[index++],when=.02+e.b*beat;
       if(when<seconds-.05)synth.play(e,when,e.d*beat,1);
      }
      maxVoices=Math.max(maxVoices,synth.voices.size);
     };
     schedule();
     const stops=[];for(let tick=.2;tick<seconds-.02;tick+=.2)stops.push(c.suspend(tick));
     const rendering=c.startRendering();
     for(const stop of stops){await stop;schedule();c.resume()}
     const buffer=await rendering,channels=[buffer.getChannelData(0),buffer.getChannelData(1)];
     let sum=0,peak=0,nonfinite=0,clipped=0,active=0;
     for(const values of channels)for(const n of values){if(!Number.isFinite(n)){nonfinite++;continue}const a=Math.abs(n);sum+=n*n;peak=Math.max(peak,a);if(a>=.9999)clipped++;if(a>.0001)active++}
     const stats={key:key||instrument,seconds,peak,rms:Math.sqrt(sum/(buffer.length*2)),nonfinite,clipped,activeFraction:active/(buffer.length*2),maxVoices};
     if(wav){
      const raw=new ArrayBuffer(44+buffer.length*4),v=new DataView(raw),write=(offset,text)=>{for(let i=0;i<text.length;i++)v.setUint8(offset+i,text.charCodeAt(i))};
      write(0,'RIFF');v.setUint32(4,36+buffer.length*4,true);write(8,'WAVE');write(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,2,true);v.setUint32(24,sampleRate,true);v.setUint32(28,sampleRate*4,true);v.setUint16(32,4,true);v.setUint16(34,16,true);write(36,'data');v.setUint32(40,buffer.length*4,true);
      for(let i=0;i<buffer.length;i++)for(let ch=0;ch<2;ch++){const n=Math.max(-1,Math.min(1,channels[ch][i]));v.setInt16(44+i*4+ch*2,n<0?n*32768:n*32767,true)}
      const bytes=new Uint8Array(raw);let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));stats.wav=btoa(binary);
     }
     synth.dispose();return stats;
    };
   });

   await check('Thirty distinct chapter scores route all 96 encounters and the home, victory and defeat states',async()=>{
    const proof=await page.evaluate(()=>{
     const saved={G,OV,difficulty,stages:STG.slice()},routes=[];
     try{
      for(const world of DIFFICULTY_ORDER){difficulty=world;STG.splice(0,STG.length,...CAMPAIGNS[world]);for(let lv=1;lv<=16;lv++){G={lv,tutorial:false,st:STG[lv-1]};OV=null;const [key,loop]=wantTrack();routes.push({world,lv,key,loop,present:!!SCORE_BY_ID[key]})}}
      G=null;OV='title';const home=wantTrack();G={lv:1,tutorial:false};OV='win';const victory=wantTrack();OV='dead';const defeat=wantTrack();return {routes,home,victory,defeat,scoreCount:CAMPAIGN_SCORES.length};
     }finally{({G,OV,difficulty}=saved);STG.splice(0,STG.length,...saved.stages)}
    });
    assert.equal(proof.routes.length,96);assert.equal(proof.scoreCount,30);assert.equal(new Set(proof.routes.map(x=>x.key)).size,30);
    for(const r of proof.routes){assert.ok(r.present&&r.loop);assert.equal(r.key,r.world+(r.lv===16?'-final':r.lv<=4?'':'-act'+Math.ceil(r.lv/4)))}
    assert.deepEqual(proof.home,['home',true]);assert.deepEqual(proof.victory,['victory',false]);assert.deepEqual(proof.defeat,['defeat',false]);
    return {encounters:96,scores:30};
   });

   const soundProof=(proof)=>{
    assert.equal(proof.nonfinite,0,proof.key);assert.equal(proof.clipped,0,proof.key);
    assert.ok(proof.peak>.002&&proof.peak<.95,JSON.stringify(proof));
    assert.ok(proof.rms>.00025&&proof.rms<.22,JSON.stringify(proof));
    assert.ok(proof.activeFraction>.02,JSON.stringify(proof));assert.ok(proof.maxVoices<=28,JSON.stringify(proof));
   };
   await check('The new guitar, upright and electric-piano voices render distinct audible, unclipped sounds',async()=>{
    const hashes=[],proofs=[];
    for(const instrument of ['guitar','upright','rhodes']){
     const proof=await page.evaluate(opts=>renderDetectiveMusic(opts),{instrument,seconds:3,wav:true});soundProof(proof);
     hashes.push(crypto.createHash('sha256').update(Buffer.from(proof.wav,'base64')).digest('hex'));delete proof.wav;proofs.push(proof);
    }
    assert.equal(new Set(hashes).size,3,'New voices must not all fall back to the same generic oscillator');return proofs;
   });
   await check('Every chapter score and home/result cue produces audible finite samples without clipping',async()=>{
    const keys=await page.evaluate(()=>[...CAMPAIGN_SCORES.map(s=>s.id),'home','victory','defeat']),proofs=[];
    for(const key of keys){const proof=await page.evaluate(opts=>renderDetectiveMusic(opts),{key,seconds:8});soundProof(proof);proofs.push(proof)}
    return proofs;
   });

   await check('The actual music button stops scheduled voices and resumes the current chapter',async()=>{
    await page.evaluate(()=>{mute=true;openInitiativeCoin=async()=> 'p';newRun()});
    await page.waitForFunction(()=>G&&!G.busy&&!drawRunning&&G.phase==='player-deploy');
    await page.evaluate(()=>{infoPanel=null;render()});
    await page.locator('.table-tools [data-a="mus"]').click();
    await page.waitForFunction(()=>!mmute&&musicDebugState().timer&&musicDebugState().voices>0);
    await page.locator('.table-tools [data-a="mus"]').click();
    await page.waitForFunction(()=>mmute&&!musicDebugState().timer&&musicDebugState().groupCount===0);
    assert.equal(await page.evaluate(()=>musicDebugState().voices),0);
    await page.locator('.table-tools [data-a="mus"]').click();
    await page.waitForFunction(()=>!mmute&&musicDebugState().timer&&musicDebugState().voices>0);
    assert.equal(await page.evaluate(()=>musicDebugState().key),'mire');
   });
   await check('Changing acts, backgrounding and returning leave one live score with bounded voices',async()=>{
    await page.evaluate(()=>{G.lv=5;G.st=STG[4];render()});
    await page.waitForFunction(()=>musicDebugState().key==='mire-act2'&&musicDebugState().groupCount===1);
    await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'))});
    await page.waitForFunction(()=>musicDebugState().suspended&&!musicDebugState().timer&&musicDebugState().groupCount===0);
    assert.equal(await page.evaluate(()=>musicDebugState().voices),0);
    await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'))});
    await page.waitForFunction(()=>!musicDebugState().suspended&&musicDebugState().timer);
    const proof=await page.evaluate(()=>{
     const snapshots=[];
     for(const lv of [9,13,16,1,5,9,13,16,1]){G.lv=lv;G.st=STG[lv-1];render();snapshots.push(musicDebugState())}
     return snapshots;
    });assert.ok(proof.every(s=>s.groupCount<=2&&s.voices<=56));
    await page.waitForFunction(()=>musicDebugState().groupCount===1);return {switches:proof.length,maxGroups:Math.max(...proof.map(s=>s.groupCount))};
   });
   await check('A saturated synth steals voices safely and dispose releases the remaining sources',async()=>{
    await page.evaluate(()=>{
     window.saturatedMusicSynth=createCampaignSynth(AC,AC.mg||AC.destination);
     for(let i=0;i<50;i++)saturatedMusicSynth.play({i:'guitar',p:50+i%12,v:.015},AC.currentTime+.02,.2);
    });assert.ok(await page.evaluate(()=>saturatedMusicSynth.voices.size<=28));
    await page.evaluate(()=>saturatedMusicSynth.dispose());
    await page.waitForFunction(()=>saturatedMusicSynth.voices.size===0);assert.ok(await page.evaluate(()=>saturatedMusicSynth.disposed));
   });

   await check('Representative chapter and home excerpts are exported as playable stereo WAV previews',async()=>{
    const previews=[];
    for(const key of [...worlds,'home']){
     const seconds=key==='home'?10:20,proof=await page.evaluate(opts=>renderDetectiveMusic(opts),{key,seconds,wav:true});soundProof(proof);
     const file=path.join(OUT,key+'.wav');fs.writeFileSync(file,Buffer.from(proof.wav,'base64'));delete proof.wav;previews.push({...proof,file});
    }
    const html='<!doctype html><meta charset="utf-8"><title>灯誓牌 · 新配乐试听</title><style>body{max-width:720px;margin:40px auto;padding:0 20px;background:#eee8dc;color:#30372b;font:16px/1.7 sans-serif}audio{width:100%}section{margin:24px 0}</style><h1>灯誓牌 · 新配乐试听</h1><p>原创侦探器乐：吉他、钢琴、木贝斯和轻刷鼓。</p>'+previews.map(p=>'<section><h2>'+p.key+'</h2><audio controls preload="none" src="'+path.basename(p.file)+'"></audio></section>').join('');
    fs.writeFileSync(path.join(OUT,'index.html'),html);fs.writeFileSync(path.join(OUT,'preview-results.json'),JSON.stringify(previews,null,2));return previews;
   });
   await check('The standalone edition plays the same new score without external music requests',async()=>{
    const other=await context.newPage(),requests=[];other.on('pageerror',e=>errors.push(e.message));other.on('request',r=>{if(/\.(?:wav|mp3|ogg)(?:\?|$)/.test(r.url()))requests.push(r.url())});
    try{
     await other.goto(BASE.replace('index.html','standalone.html'));await other.waitForFunction(()=>window.BOOT?.ready);
     // The second page shares this test context's real checkpoint. Explicitly
     // show the home screen instead of mistaking a correct battle restore for
     // a wrong music route.
     await other.evaluate(async()=>{G=null;OV='title';infoPanel=null;render();mute=true;await au().resume();musicMute(false)});
     await other.waitForFunction(()=>musicDebugState().timer&&musicDebugState().voices>0);
     assert.equal(await other.evaluate(()=>musicDebugState().key),'home');assert.deepEqual(requests,[]);
     await other.evaluate(()=>musicMute(true));await other.waitForFunction(()=>musicDebugState().groupCount===0);
    }finally{await other.close()}
   });
   await check('No browser errors',async()=>assert.deepEqual(errors,[]));
   fs.writeFileSync(path.join(OUT,'check-results.json'),JSON.stringify(results,null,2));
  }finally{await context.close()}
 }finally{await browser.close()}
 console.log(JSON.stringify({passed,failed:0,previews:OUT}));
})().catch(error=>{console.error(error);process.exitCode=1});
