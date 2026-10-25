
const SG={fly:'飞行',thorn:'尖刺',bones:'遗骨'};
const SGD={fly:'飞行：越过阻挡，直击生命',thorn:'尖刺：被攻击时反伤1',bones:'遗骨：死后留下1/1的骨'};
Object.assign(SG,{parry:'弹反',vamp:'嗜血',regen:'再生'});
Object.assign(SGD,{parry:'弹反：被攻击力≤2的卡攻击时免伤并反伤1',vamp:'嗜血：命中卡牌后回复1血',regen:'再生：每回合结束回复1血'});
const POOL=[],EN=[],FN={k:'契卫',s:'行者',h:'舟客',c:'织雾者',r:'观星者',d:'矿客'};const AT={},ATC={火:'#d9541e',雷:'#b8960c',光:'#c9b24a',暗:'#5b3f7a',血:'#a31c28',物理:'#6e6e6e'},RING={};function glyph(c){return c.fod?'flame':c.s==='fly'?'wing':'helm'}
const STG=[];
let SEEN=new Set();try{SEEN=new Set(JSON.parse(localStorage.getItem('lo_seen')||'[]'))}catch(e){}
const unlock=n=>{SEEN.add(n);try{localStorage.setItem('lo_seen',JSON.stringify([...SEEN]))}catch(e){}};
const fodder=st=>({n:st.fod,a:0,h:1,h0:1,c:0,e:1,fod:1,f:st.f,t:G.turn});
function eCard(n,st){const c=cp(POOL.find(p=>p.n===n));c.e=1;c.h+=st.hb;c.h0=c.h;return c}
function sacFx(x){if(!x.fod)return;const st=G.st,al=G.e.filter(c=>c&&!c.fod);
  if(st.pas==='血'&&al.length){const c=pick(al);if(c.a<6)c.a++}
  else if(st.pas==='环'&&al.length){const c=pick(al);if(c.h0<12){c.h++;c.h0++}}
  else if(st.pas==='狼'){const ls=[0,1,2,3,4].filter(i=>G.p[i]);if(ls.length){const i=pick(ls);G.p[i].h--;if(G.p[i].h<=0)kill('p',i,null)}}}
async function enemyPlay(anim){
  const st=G.st,E=G.e,emp=()=>[0,1,2,3,4].filter(i=>!E[i]);
  if(G.ed.length){takeCard('e');render();await drawIdle;}
  for(let k=0;k<st.fp;k++){const f=emp();if(f.length){E[pick(f)]=fodder(st);if(anim){render();snd('eplace');await wait(550)}}}
  const order=k=>[0,1,2,3,4].filter(i=>E[i]&&(E[i].t||0)<G.turn).sort((x,y)=>(E[x].fod?0:1)-(E[y].fod?0:1)||(E[x].a+E[x].h)-(E[y].a+E[y].h)).slice(0,k);
  for(let p=0;p<st.pp;p++){
    let best=null,bs=[];
    G.eh.forEach((c,i)=>{
      const sc=c.c?order(c.c):[];
      if(sc.length<c.c)return;
      if(!c.c&&!emp().length)return;
      if(sc.some(j=>!E[j].fod&&E[j].a+E[j].h>=c.a+c.h))return;
      if(!best||c.a+c.h>best.c.a+best.c.h){best={c,i};bs=sc}
    });
    if(!best)break;
    if(anim&&bs.length){snd('burn');bs.forEach(j=>{const e=el('e',j);if(e)burn(e)});await wait(650)}
    G.eh.splice(best.i,1);
    bs.forEach(j=>{const x=E[j];E[j]=null;sacFx(x)});
    const f=emp(),lane=bs.length?pick(bs):pick(f);
    best.c.t=G.turn;E[lane]=best.c;
    if(anim){render();snd('eplace');await wait(250)}
  }
}
const NAMES=["苔庭铠卫·欧恩", "苔庭铠卫·乌恩", "苔庭铠卫·依恩", "苔庭铠卫·雅恩", "苔庭巡灯使·诺恩", "苔庭峰脊巨灵·瑟恩", "苔庭缄骨客·维恩", "苔庭观灯师·希恩", "苔庭观灯师·洛恩", "苔庭观灯师·米恩", "苔庭观灯师·岚恩", "苔庭巡灯使·索恩", "苔庭织光蛛·莱恩", "苔庭修灯师·岑恩", "苔庭修灯师·塔恩", "苔庭潜印客·莫恩"];
const SQ={n:'余芯',a:0,h:1,c:0},BONE={n:'碎灯偶',a:1,h:1,c:0};
const SX={soul:'吸辉',ember:'灯火',rekindle:'复燃'};
const SGX={soul:'吸辉：击杀敌人后，攻击+1',ember:'灯火：放置时，回复你1点生命（上限7）',rekindle:'复燃：死亡时回到手牌（每场一次）'};
const rnd=n=>Math.floor(Math.random()*n),cp=o=>({...o,h0:o.h0??o.h}),wait=ms=>new Promise(r=>setTimeout(r,ms));
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
let grave=[];try{grave=JSON.parse(localStorage.getItem('lo_grave')||'[]')}catch(e){}
let pname='';try{pname=localStorage.getItem('lo_name')||''}catch(e){}
const GL={helm:'<path d="M12 10h16l5 24H7Z"/><path d="M15 20h10" stroke="#dfc891" fill="none"/>',flame:'<path d="M19 3c14 17 19 25 7 32-12 6-24-4-18-14l7-10 3 10q6-9 1-18Z"/>'};
const svg=g=>`<svg viewBox="0 0 40 40" aria-hidden="true">${GL[g]||GL.helm}</svg>`;
const ART={};
GL.katana=`<path d='M33 3L9 29l3 3L35 6z'/><path d='M5 27l8 8M3 37l5-5' stroke='currentColor' stroke-width='3'/>`;
GL.hat=`<path d='M2 27h36l-7 4H9z'/><path d='M10 27c0-13 4-20 10-20s10 7 10 20z'/>`;
GL.scythe=`<path d='M12 38V3' stroke='currentColor' stroke-width='3'/><path d='M12 3c14 0 24 7 24 17-6-7-14-10-24-10z'/>`;
GL.claw=`<path d='M5 37C5 22 10 12 13 2c2 8 4 14 3 22M15 37c0-12 6-20 9-31 3 8 2 16 0 26M25 37c2-10 8-17 13-27 1 13-3 22-7 27z'/>`;
GL.eye=`<path d='M2 20C10 8 30 8 38 20 30 32 10 32 2 20z'/><circle cx='20' cy='20' r='6' fill='#000a'/><circle cx='20' cy='20' r='2.5' fill='#fff'/>`;
GL.tent=`<circle cx='20' cy='13' r='9'/><path d='M10 20c-4 8-2 14-6 16M16 22c0 8-2 12 0 16M24 22c0 8 2 12 0 16M30 20c4 8 2 14 6 16' stroke='currentColor' stroke-width='3' fill='none'/>`;

let mute=false,AC;
function au(){try{if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();const d=AC.destination,lp=AC.createBiquadFilter(),mg=AC.createGain();lp.type='lowpass';lp.frequency.value=3000;mg.gain.value=.8;lp.connect(mg);mg.connect(d);AC.mg=mg;Object.defineProperty(AC,'destination',{get:()=>lp});setTimeout(()=>{loadSmp();loadMus()},0)}if(AC.state==='suspended')Promise.resolve(AC.resume()).catch(()=>{});return AC}catch(e){}}
function tone(f1,f2,d,ty='sine',v=.25,t0=0){const c=au();if(!c||mute)return;const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+t0;o.type=ty;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d)}
function nz(d,v,f1,f2,t0=0){const c=au();if(!c||mute)return;const n=Math.floor(c.sampleRate*d),b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=Math.random()*2-1;const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime+t0;s.buffer=b;f.type='bandpass';f.frequency.setValueAtTime(f1,t);f.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(g);g.connect(c.destination);s.start(t)}
const SND={whoosh:()=>{nz(.16,.7,7000,1200);nz(.2,.35,2500,600,.02)},hit:()=>{nz(.07,.8,5000,2500);tone(2400,1200,.12,'square',.07);tone(160,45,.18,'sine',.45);nz(.1,.5,1200,400,.03)},kill:()=>{nz(.07,.9,5000,2000);tone(2000,900,.15,'square',.08);tone(110,30,.35,'sawtooth',.35);nz(.25,.6,1000,150,.04)},clang:()=>{nz(.06,.8,6000,3000);tone(1320,1300,.5,'triangle',.18);tone(1980,1960,.4,'sine',.1);tone(880,860,.4,'triangle',.12)},place:()=>{nz(.05,.8,4500,1800);tone(170,60,.09,'sine',.55)},draw:()=>nz(.1,.3,3000,1200),burn:()=>{nz(.35,.5,500,3500);nz(.8,.3,350,120);for(let k=0;k<16;k++)nz(.02+Math.random()*.03,.5,2500+Math.random()*4000,1500,Math.random()*.7)},win:()=>{tone(330,330,.25,'triangle',.3);tone(495,495,.4,'triangle',.3,.2)},die:()=>tone(220,40,1.2,'sawtooth',.3)};
const snd=k=>{try{SND[k]()}catch(e){}};
Object.assign(SND,{
 whoosh:()=>nz(.16,.22,1400,500),
 hit:()=>{tone(150,60,.16,'sine',.38);nz(.07,.2,1000,500)},
 kill:()=>{tone(180,55,.5,'sine',.4);tone(135,45,.6,'triangle',.18,.05);nz(.35,.12,700,200)},
 clang:()=>{tone(660,655,.7,'sine',.12);tone(990,985,.5,'sine',.06,.02)},
 place:()=>{nz(.06,.3,1600,700);tone(120,70,.1,'sine',.3)},
 draw:()=>{nz(.07,.18,2200,1100);nz(.05,.12,1800,900,.07)},
 shuffle:()=>{for(let k=0;k<16;k++)nz(.03,.1+Math.random()*.08,1500+Math.random()*1500,900,k*.032+Math.random()*.01)},
 burn:()=>{nz(.5,.18,600,1500);nz(.9,.1,300,180);for(let k=0;k<12;k++)nz(.025,.2,1500+Math.random()*1500,900,Math.random()*.8)},
 win:()=>{tone(392,392,.8,'sine',.14);tone(523,523,.9,'sine',.12,.18);tone(659,659,1.1,'sine',.1,.36)},
 die:()=>{tone(196,60,1.4,'sine',.3);tone(147,50,1.6,'triangle',.15,.1)}
});
const SMP={};
const BUF={};
async function loadSmp(){const c=AC;if(!c||loadSmp.done)return;loadSmp.done=1;for(const k in SMP){try{const u=Uint8Array.from(atob(SMP[k]),ch=>ch.charCodeAt(0));BUF[k]=await c.decodeAudioData(u.buffer)}catch(e){}}}
function smp(k,v=.8,r=1){const c=au();if(!c||mute||!BUF[k])return false;const s=c.createBufferSource(),g=c.createGain();s.buffer=BUF[k];s.playbackRate.value=r;g.gain.value=v;s.connect(g);g.connect(c.mg||c.destination);s.start();return true}
const rr=()=>.95+Math.random()*.1,pick=a=>a[Math.floor(Math.random()*a.length)];
const OLD={...SND};
Object.assign(SND,{
 shuffle:()=>smp('s01',.9)||OLD.shuffle(),
 draw:()=>smp(pick(['d08','d07']),.8,rr())||OLD.draw(),
 place:()=>smp('p14',.9,rr())||OLD.place(),
 eplace:()=>smp('p13',.8,rr())||OLD.place(),
 whoosh:()=>smp('d09',.7,1.05+Math.random()*.1)||OLD.whoosh(),
 hit:()=>smp('p15',.9,rr())||OLD.hit(),
 kill:()=>{smp('c19',.6);OLD.kill()},
 clang:()=>{smp('p16',.8);OLD.clang()},
 win:()=>{smp('d10',.9);OLD.win()},
 die:()=>{smp('f21',.9);OLD.die()}
});
ART['余芯']='flame';

const CAMPAIGN_SCORES=__DATA_MUSIC_SCORES__;
// Original procedural instruments. No recordings, samples or external assets.
// Each note uses at most three oscillators; ambience is a shared, non-feedback room.
const CAMPAIGN_SYNTH_CACHE=new WeakMap();
function campaignSynthCache(context){
 let cache=CAMPAIGN_SYNTH_CACHE.get(context);if(cache)return cache;
 const noise=context.createBuffer(1,Math.ceil(context.sampleRate*.8),context.sampleRate),data=noise.getChannelData(0);let seed=0x53f2a617;
 for(let i=0;i<data.length;i++){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;data[i]=((seed>>>0)/4294967296*2-1)*.62}
 cache={noise,waves:new Map()};CAMPAIGN_SYNTH_CACHE.set(context,cache);return cache;
}
function campaignSynthWave(context,name){
 const cache=campaignSynthCache(context);if(cache.waves.has(name))return cache.waves.get(name);
 const harmonics={choir:[1,.14,.29,.055,.085,.02,.025],strings:[1,.38,.17,.09,.05,.028,.016,.01],organ:[1,.43,.21,.15,.075,.04],piano:[1,.23,.085,.025],flute:[1,.055,.015],bass:[1,.23,.07,.025]}[name]||[1];
 const real=new Float32Array(harmonics.length+1),imag=new Float32Array(real.length);harmonics.forEach((n,i)=>imag[i+1]=n);
 const wave=context.createPeriodicWave(real,imag);cache.waves.set(name,wave);return wave;
}
function createCampaignSynth(context,destination){
 const c=context,voices=new Set(),rack=[],mix=c.createGain(),low=c.createBiquadFilter(),dry=c.createGain();let disposed=false,disposeAt=Infinity,roomTimer=0,roomClosed=false;
 const keep=node=>(rack.push(node),node);keep(mix);keep(low);keep(dry);low.type='lowpass';low.frequency.value=5800;low.Q.value=.32;dry.gain.value=.9;mix.connect(low);low.connect(dry);dry.connect(destination);
 for(const [seconds,amount,cutoff]of [[.149,.115,3200],[.277,.075,2400],[.421,.04,1800]]){
  const delay=keep(c.createDelay(.5)),tone=keep(c.createBiquadFilter()),wet=keep(c.createGain());delay.delayTime.value=seconds;tone.type='lowpass';tone.frequency.value=cutoff;tone.Q.value=.25;wet.gain.value=amount;low.connect(delay);delay.connect(tone);tone.connect(wet);wet.connect(destination);
 }
 function closeRoom(){
  if(roomClosed||!disposed||voices.size)return;
  if(c.currentTime+.002<disposeAt){if(!roomTimer&&typeof setTimeout==='function')roomTimer=setTimeout(()=>{roomTimer=0;closeRoom()},Math.min(2000,Math.max(15,(disposeAt-c.currentTime+.03)*1000)));return}
  roomClosed=true;if(roomTimer&&typeof clearTimeout==='function')clearTimeout(roomTimer);roomTimer=0;for(const node of rack)try{node.disconnect()}catch{}
 }
 function play(event,when,durationSeconds,level=1){
  if(disposed||c.state==='closed'||!event||!Number.isFinite(event.p))return null;
  const velocity=Math.max(0,Math.min(1,Number(event.v)||0))*Math.max(0,Math.min(2,Number(level)||0));if(velocity<=0)return null;
  const now=c.currentTime,t=Math.max(now+.001,Number.isFinite(when)?when:now),beatDuration=Math.max(.04,Math.min(14,Number(durationSeconds)||.2)),frequency=440*Math.pow(2,(Math.max(12,Math.min(108,event.p))-69)/12),kind=event.i||'piano';
  while(voices.size>=28){const old=voices.values().next().value;old.stop(now+.002);old.cleanup()}
  const nodes=[],sources=[],envelope=c.createGain(),filter=c.createBiquadFilter();let pending=0,ended=false,stopAt=Infinity,panner=null;
  const node=n=>(nodes.push(n),n);node(envelope);node(filter);filter.type='lowpass';filter.frequency.value=2600;filter.Q.value=.45;envelope.connect(filter);
  if(typeof c.createStereoPanner==='function'){panner=node(c.createStereoPanner());panner.pan.value=Math.max(-.85,Math.min(.85,Number(event.pan)||0));filter.connect(panner);panner.connect(mix)}else filter.connect(mix);
  let attack=.02,release=.3,gate=beatDuration,strength=.3,decay=false,body=.7;
  const voice={startAt:t,endAt:t+gate+release,nodes,stop,cleanup};voices.add(voice);
  function cleanup(){if(ended)return;ended=true;voices.delete(voice);for(const n of nodes)try{n.disconnect()}catch{}closeRoom()}
  function source(s){node(s);sources.push(s);pending++;s.onended=()=>{pending--;if(!pending)cleanup()};return s}
  function oscillator(ratio=1,amount=1,type='sine',detune=0,shape=null){
   const o=source(c.createOscillator()),g=node(c.createGain());o.type=type;if(shape)try{o.setPeriodicWave(campaignSynthWave(c,shape))}catch{o.type='triangle'}o.frequency.setValueAtTime(frequency*ratio,t);o.detune.value=detune;g.gain.value=amount;o.connect(g);g.connect(envelope);return o;
  }
  function noise(amount,cutoff=1600,q=.6){
   const s=source(c.createBufferSource()),f=node(c.createBiquadFilter()),g=node(c.createGain());s.buffer=campaignSynthCache(c).noise;s.loop=true;f.type='bandpass';f.frequency.value=cutoff;f.Q.value=q;g.gain.value=amount;s.connect(f);f.connect(g);g.connect(envelope);return s;
  }
  function vibrato(o,cents=2.5,speed=5.1){const lfo=source(c.createOscillator()),g=node(c.createGain());lfo.frequency.value=speed;g.gain.value=cents;lfo.connect(g);g.connect(o.detune)}
  function stop(at=c.currentTime){
   if(ended)return;const cut=Math.max(c.currentTime,Number.isFinite(at)?at:c.currentTime),tail=.035;if(cut>=stopAt)return;stopAt=cut;if(cut>=voice.endAt)return;voice.endAt=Math.min(voice.endAt,cut+tail);
   try{if(cut<=t){envelope.gain.cancelScheduledValues(cut);envelope.gain.setValueAtTime(.00001,cut)}else if(typeof envelope.gain.cancelAndHoldAtTime==='function')envelope.gain.cancelAndHoldAtTime(cut);else{envelope.gain.cancelScheduledValues(cut);envelope.gain.setValueAtTime(Math.max(.00001,envelope.gain.value),cut)}envelope.gain.linearRampToValueAtTime(.00001,cut+tail)}catch{}
   for(const s of sources)try{s.stop(cut+tail+.005)}catch{}
  }
  try{
   switch(kind){
    case 'choir':attack=Math.min(.48,gate*.18);release=.85;strength=.25;filter.frequency.value=1950;filter.Q.value=.65;oscillator(1,.53,'sine',-3,'choir');oscillator(1,.47,'sine',4,'choir');break;
    case 'strings':attack=Math.min(.32,gate*.14);release=.65;strength=.25;filter.frequency.value=2300;oscillator(1,.52,'sine',-5,'strings');oscillator(1,.48,'sine',5,'strings');break;
    case 'organ':attack=.075;release=.55;strength=.25;filter.frequency.value=2900;oscillator(1,1,'sine',0,'organ');break;
    case 'piano':attack=.006;release=.22;gate=Math.min(gate,5);strength=.42;decay=true;body=.35;filter.frequency.value=3600;oscillator(1,.83,'sine',0,'piano');oscillator(2.004,.17,'sine');break;
    case 'bell':attack=.004;release=.32;gate=Math.min(gate,4.5);strength=.34;decay=true;body=.34;filter.frequency.value=5200;oscillator(1,.7);oscillator(2.756,.23);oscillator(5.404,.07);break;
    case 'harp':attack=.005;release=.2;gate=Math.min(gate,2.7);strength=.4;decay=true;body=.25;filter.frequency.value=3400;oscillator(1,.82,'sine',0,'piano');oscillator(2.003,.18);break;
    case 'koto':{attack=.003;release=.16;gate=Math.min(gate,2);strength=.4;decay=true;body=.22;filter.frequency.value=3400;const a=oscillator(1,.77,'sine',0,'piano'),b=oscillator(2.006,.2);a.frequency.setValueAtTime(frequency*1.015,t);a.frequency.exponentialRampToValueAtTime(frequency,t+.055);b.frequency.setValueAtTime(frequency*2.025,t);b.frequency.exponentialRampToValueAtTime(frequency*2.006,t+.065);noise(.03,2300,1.2);break}
    case 'flute':{attack=Math.min(.11,gate*.15);release=.23;strength=.35;filter.frequency.value=3100;const o=oscillator(1,.94,'sine',0,'flute');noise(.06,1800,.8);vibrato(o,2.8,4.9);break}
    case 'bass':attack=.018;release=.25;strength=.34;filter.frequency.value=780;oscillator(1,1,'sine',0,'bass');break;
    case 'taiko':{attack=.003;release=.16;gate=Math.min(gate,.95);strength=.53;decay=true;body=.18;filter.frequency.value=850;const o=oscillator(1,.9);o.frequency.setValueAtTime(frequency*1.38,t);o.frequency.exponentialRampToValueAtTime(Math.max(32,frequency*.69),t+Math.min(.45,gate));noise(.1,450,.7);break}
    case 'timpani':{attack=.006;release=.24;gate=Math.min(gate,1.4);strength=.45;decay=true;body=.22;filter.frequency.value=1400;const o=oscillator(1,.75);o.frequency.setValueAtTime(frequency*1.12,t);o.frequency.exponentialRampToValueAtTime(frequency,t+.12);oscillator(1.51,.17);noise(.08,800,.7);break}
    case 'metal':attack=.004;release=.22;gate=Math.min(gate,1.7);strength=.23;decay=true;body=.2;filter.frequency.value=4500;oscillator(1,.6);oscillator(1.414,.26);oscillator(2.39,.14);break;
    case 'brush':attack=.012;release=.13;gate=Math.min(gate,.55);strength=.27;decay=true;body=.2;filter.frequency.value=2700;noise(1,1450,.55);break;
    default:attack=.02;release=.25;strength=.3;oscillator(1,1,'triangle');
   }
   const amplitude=Math.max(.00001,velocity*strength),peak=t+Math.max(.002,Math.min(attack,gate*.3)),end=t+gate;voice.endAt=end+release;
   envelope.gain.setValueAtTime(.00001,t);envelope.gain.linearRampToValueAtTime(amplitude,peak);
   if(decay){const knee=Math.min(end-.001,peak+Math.max(.02,gate*.22));envelope.gain.exponentialRampToValueAtTime(Math.max(.00001,amplitude*body),knee);envelope.gain.exponentialRampToValueAtTime(Math.max(.00001,amplitude*.025),end)}else{envelope.gain.exponentialRampToValueAtTime(Math.max(.00001,amplitude*body),Math.min(end,peak+.24));envelope.gain.setValueAtTime(Math.max(.00001,amplitude*body),end)}
   envelope.gain.exponentialRampToValueAtTime(.00001,end+release);
   for(const s of sources){s.start(t);s.stop(voice.endAt+.02)}
   return voice;
  }catch{for(const s of sources)try{s.stop()}catch{}cleanup();return null}
 }
 function dispose(at=c.currentTime){const cut=Math.max(c.currentTime,Number.isFinite(at)?at:c.currentTime);if(disposed&&cut>=disposeAt)return;disposed=true;disposeAt=cut;if(roomTimer&&typeof clearTimeout==='function')clearTimeout(roomTimer);roomTimer=0;for(const voice of [...voices])voice.stop(disposeAt);closeRoom()}
 return {play,voices,dispose,get disposed(){return disposed}};
}

// Original scores are scheduled a few notes ahead, never decoded or fetched.
const SCORE_BY_ID=CAMPAIGN_SCORES.reduce((scores,score)=>(scores[score.id]=score,scores),{});
const MUSIC_MUTE_STORAGE='lo_music_mute',MUSIC_BUS_VOLUME=.9;
let mmute=false,MM=null,MC=null;
try{mmute=localStorage.getItem(MUSIC_MUTE_STORAGE)==='1'}catch{}
const MUSIC_STATE={key:null,timer:0,groups:new Set(),generation:0,scheduledEvents:0,paused:false,saved:null,contexts:new WeakSet(),busContext:null,limiter:null};
const MUSIC_CUES={
 home:{id:'home',title:'灯台余声',tempo:52,beatsPerBar:4,bars:8,dynamics:.64,events:[
  ...[[50,53,57],[46,50,53],[48,53,57],[48,52,55]].reduce((events,chord,i)=>events.concat(chord.map((p,j)=>({b:i*8,p,d:7.2,v:.16,i:'choir',pan:(j-1)*.25}))),[]),
  ...[[2,69],[6,65],[10,62],[14,65],[18,69],[22,67],[26,64],[30,62]].map(([b,p])=>({b,p,d:1.8,v:.25,i:'bell',pan:.18}))]},
 victory:{id:'victory',title:'灯火尚存',tempo:78,beatsPerBar:4,bars:3,dynamics:.8,events:[
  ...[[0,[50,57,62]],[4,[53,57,65]],[8,[50,54,57,62]]].reduce((events,[b,chord])=>events.concat(chord.map((p,j)=>({b,p,d:3.5,v:.2,i:'strings',pan:(j-1)*.2}))),[]),
  ...[[0,62],[1,65],[2,69],[4,67],[6,69],[8,74]].map(([b,p])=>({b,p,d:b===8?3:1.3,v:.3,i:'harp',pan:.16}))]},
 defeat:{id:'defeat',title:'灰中留名',tempo:48,beatsPerBar:4,bars:2,dynamics:.65,events:[
  ...[38,45,50].map((p,j)=>({b:0,p,d:7,v:.19,i:'choir',pan:(j-1)*.22})),
  ...[[0,65],[2,64],[4,62],[6,57]].map(([b,p])=>({b,p,d:1.8,v:.28,i:'piano',pan:-.1}))]}
};
function wantTrack(){
 if(OV==='title'||!G||G.tutorial)return ['home',true];
 if(OV==='dead')return ['defeat',false];
 if(OV==='replay-result')return [typeof REPLAY_SESSION!=='undefined'&&REPLAY_SESSION?.result?.won?'victory':'defeat',false];
 if(['win','clear','camp'].includes(OV))return ['victory',false];
 const game=Object.prototype.hasOwnProperty.call(SCORE_BY_ID,typeof difficulty==='string'?difficulty:'')?difficulty:G.st?.games?.find(key=>SCORE_BY_ID[key])||'mire';
 const final=G.lv===16&&(!Array.isArray(STG)||G.lv===STG.length);
 const act=Math.max(1,Math.min(4,Math.floor(((Number.isFinite(G.lv)?G.lv:1)-1)/4)+1));
 return [game+(final?'-final':act===1?'':'-act'+act),true];
}
function musicScore(key){return SCORE_BY_ID[key]||MUSIC_CUES[key]||SCORE_BY_ID.mire}
function musicNowTitle(){const [key]=wantTrack(),score=musicScore(key);return `${score.title}${key.endsWith('-final')?' · 最终Boss':SCORE_BY_ID[key]?` · 第${score.stages?.[0]||1}–${score.stages?.[1]||4}关`:''}`}
function musicPosition(group=MC){
 if(!group||!MUSIC_STATE.busContext)return MUSIC_STATE.saved?.position||0;
 const elapsed=Math.max(0,MUSIC_STATE.busContext.currentTime-group.start);
 return group.loop?elapsed%group.seconds:Math.min(elapsed,group.seconds);
}
function musicParamFade(param,value,when,duration){
 try{if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(when);else{const previous=param.value;param.cancelScheduledValues(when);param.setValueAtTime(previous,when)}param.linearRampToValueAtTime(value,when+duration)}catch{param.value=value}
}
function musicClearTimer(){if(MUSIC_STATE.timer){clearInterval(MUSIC_STATE.timer);MUSIC_STATE.timer=0}}
function musicDropGroup(group,fade=.05){
 if(!group||group.retiring)return;group.retiring=true;
 const c=MUSIC_STATE.busContext,t=c?.currentTime||0;
 musicParamFade(group.g.gain,0,t,fade);
 try{group.synth.dispose(t+fade+.015)}catch{}
 const cleanup=()=>{try{group.g.disconnect()}catch{}MUSIC_STATE.groups.delete(group);group.cleanupTimer=0};
 if(fade>0)group.cleanupTimer=setTimeout(cleanup,(fade+.06)*1000);else cleanup();
}
function musicStopGroups(save=true,fade=.05){
 if(save&&MC)MUSIC_STATE.saved={key:MC.k,position:musicPosition(MC)};
 musicClearTimer();for(const group of [...MUSIC_STATE.groups]){
  if(group.retiring){clearTimeout(group.cleanupTimer);try{group.synth.dispose()}catch{}try{group.g.disconnect()}catch{}MUSIC_STATE.groups.delete(group)}
  else musicDropGroup(group,fade);
 }
 MC=null;
}
function musicAttachContext(c){
 if(!c||c.state==='closed')return false;
 if(MUSIC_STATE.busContext!==c){
  musicStopGroups(false,0);try{MM?.disconnect();MUSIC_STATE.limiter?.disconnect()}catch{}
  MM=c.createGain();MM.gain.value=mmute?0:MUSIC_BUS_VOLUME;
  const limiter=c.createDynamicsCompressor();limiter.threshold.value=-17;limiter.knee.value=12;limiter.ratio.value=3;limiter.attack.value=.012;limiter.release.value=.28;
  MM.connect(limiter);limiter.connect(c.mg||c.destination);MUSIC_STATE.busContext=c;MUSIC_STATE.limiter=limiter;
 }
 if(!MUSIC_STATE.contexts.has(c)){
  MUSIC_STATE.contexts.add(c);
  c.addEventListener?.('statechange',()=>{
   if(c!==MUSIC_STATE.busContext)return;
   if(c.state!=='running')musicStopGroups(true,0);
   else if(!document.hidden&&!MUSIC_STATE.paused&&!mmute)syncMusic();
  });
 }
 return true;
}
function musicSeek(group,time){
 const elapsed=Math.max(0,time-group.start),beat=elapsed/group.beatSeconds;
 group.cycle=group.loop?Math.floor(beat/group.beats):0;
 const within=group.loop?beat%group.beats:beat;
 group.index=group.events.findIndex(event=>event.b>=within-.0001);
 if(group.index<0){group.index=0;group.cycle++;if(!group.loop)group.finished=true}
}
function musicSchedule(){
 const c=MUSIC_STATE.busContext,group=MC;
 if(!c||c.state!=='running'||mmute||MUSIC_STATE.paused||document.hidden){musicClearTimer();return}
 if(!group||group.retiring){musicClearTimer();return}
 const now=c.currentTime,horizon=now+.24;
 if(group.lastTick!=null&&now-group.lastTick>.65)musicSeek(group,now+.012);
 group.lastTick=now;let count=0;
 while(!group.finished&&count++<96){
  const event=group.events[group.index];
  if(!event){group.finished=true;break}
  const time=group.start+(group.cycle*group.beats+event.b)*group.beatSeconds;
  if(time>horizon)break;
  group.index++;if(group.index>=group.events.length){group.index=0;if(group.loop)group.cycle++;else group.finished=true}
  if(time<now-.04)continue;
  const duration=Math.max(.035,event.d*group.beatSeconds),when=Math.max(time,now+.004);
  try{if(group.synth.play(event,when,duration,1)){MUSIC_STATE.scheduledEvents++;group.endAt=Math.max(group.endAt,when+duration+1.5)}}catch{}
 }
 if(group.finished&&now>group.endAt+.2){group.complete=true;musicClearTimer();try{group.synth.dispose()}catch{}}
}
function syncMusic(){
 const [key,loop]=wantTrack();MUSIC_STATE.key=key;
 if(MUSIC_STATE.saved&&MUSIC_STATE.saved.key!==key)MUSIC_STATE.saved=null;
 const c=typeof AC!=='undefined'?AC:null;
 if(!c||c.state!=='running'||mmute||MUSIC_STATE.paused||document.hidden)return;
 if(MC?.k===key)return;
 if(!musicAttachContext(c))return;
 // At most one retiring group and the current score can coexist.
 for(const group of [...MUSIC_STATE.groups])if(group!==MC){clearTimeout(group.cleanupTimer);try{group.synth.dispose()}catch{}try{group.g.disconnect()}catch{}MUSIC_STATE.groups.delete(group)}
 if(MC)musicDropGroup(MC,.85);
 const score=musicScore(key),g=c.createGain(),t=c.currentTime,position=MUSIC_STATE.saved?.key===key?MUSIC_STATE.saved.position:0;
 MUSIC_STATE.saved=null;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(score.dynamics||.8,t+.8);g.connect(MM);
 const group={k:key,loop,score,g,synth:createCampaignSynth(c,g),events:[...score.events].sort((a,b)=>a.b-b.b),beats:score.bars*score.beatsPerBar,beatSeconds:60/score.tempo,seconds:score.bars*score.beatsPerBar*60/score.tempo,start:t+.025-position,index:0,cycle:0,endAt:t,retiring:false,finished:false,complete:false};
 musicSeek(group,t+.02);MUSIC_STATE.groups.add(group);MC=group;MUSIC_STATE.generation++;
 // Restore a held chord when returning mid-phrase, instead of waiting in silence.
 if(position>0){const beat=position/group.beatSeconds;let restored=0;for(const event of group.events){
  if(restored>=8)break;
  if(['choir','strings','organ','bass'].includes(event.i)&&event.b<beat&&event.b+event.d>beat+.15){
   try{if(group.synth.play({...event,v:event.v*.8},t+.02,(event.b+event.d-beat)*group.beatSeconds,1)){MUSIC_STATE.scheduledEvents++;restored++}}catch{}
  }
 }}
 musicParamFade(MM.gain,MUSIC_BUS_VOLUME,t,.08);
 musicSchedule();if(!MUSIC_STATE.timer&&!group.complete)MUSIC_STATE.timer=setInterval(musicSchedule,85);
}
function loadMus(){syncMusic()}
function musicResumeContext(context){
 if(!context||context.state==='running'||context.state==='closed'||typeof context.resume!=='function')return;
 try{Promise.resolve(context.resume()).then(syncMusic).catch(()=>{})}catch{}
}
function musicMute(value){
 mmute=!!value;try{localStorage.setItem(MUSIC_MUTE_STORAGE,mmute?'1':'0')}catch{}
 const c=MUSIC_STATE.busContext;
 if(mmute){if(MM&&c)musicParamFade(MM.gain,0,c.currentTime,.04);musicStopGroups(true,.045)}
 else{MUSIC_STATE.paused=false;const context=au();musicResumeContext(context);syncMusic()}
 return mmute;
}
function pauseCampaignMusic(){MUSIC_STATE.paused=true;musicStopGroups(true,.04)}
function resumeCampaignMusic(){
 MUSIC_STATE.paused=false;const c=typeof AC!=='undefined'?AC:null;
 musicResumeContext(c);
 syncMusic();
}
function musicUnlock(){
 if(document.hidden||mmute&&typeof mute!=='undefined'&&mute)return;
 const c=au();if(!c)return;
 musicAttachContext(c);
 musicResumeContext(c);
 syncMusic();
}
function musicDebugState(){
 const c=typeof AC!=='undefined'?AC:null;
 return {key:MC?.k||MUSIC_STATE.key||wantTrack()[0],voices:[...MUSIC_STATE.groups].reduce((n,g)=>n+g.synth.voices.size,0),timer:!!MUSIC_STATE.timer,muted:mmute,contextState:c?.state||'unavailable',suspended:MUSIC_STATE.paused||document.hidden||!!c&&c.state!=='running',scheduledEvents:MUSIC_STATE.scheduledEvents,generation:MUSIC_STATE.generation,groupCount:MUSIC_STATE.groups.size,loopSeconds:MC?.seconds||musicScore(wantTrack()[0]).bars*musicScore(wantTrack()[0]).beatsPerBar*60/musicScore(wantTrack()[0]).tempo,position:musicPosition()};
}
document.addEventListener('pointerdown',musicUnlock,{passive:true});
document.addEventListener('keydown',event=>{if(['Enter',' ','ArrowLeft','ArrowRight'].includes(event.key))musicUnlock()},{passive:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseCampaignMusic();else resumeCampaignMusic()});
window.addEventListener('pagehide',pauseCampaignMusic);window.addEventListener('pageshow',resumeCampaignMusic);

let G=null,OV='title';


let drawQueue=[],drawRunning=false,drawIdle=Promise.resolve();

const LIFE_ICONS={
 '魂':{name:'游辉',icon:'<path d="m18 3 10 17-10 15L8 20Z" fill="currentColor"/><circle cx="18" cy="20" r="4" fill="#f6edc4"/>'},
 '狼':{name:'霜瓣',icon:'<path d="m18 5 5 10 10 4-10 5-5 10-5-10L3 19l10-4Z" fill="currentColor"/><circle cx="18" cy="19" r="3" fill="#f6edc4"/>'},
 '血':{name:'潮露',icon:'<path d="M18 3Q3 21 8 29q10 12 20 0Q33 21 18 3Z" fill="currentColor"/><path d="M12 23q-2 5 3 7" stroke="#f6edc4" fill="none"/>'},
 '环':{name:'星辉',icon:'<path d="m18 2 4 11 11 5-11 4-4 13-4-13L2 18l12-5Z" fill="currentColor"/><circle cx="18" cy="18" r="3" fill="#f6edc4"/>'}
};
function healthHTML(side){
 const theme=G.st.pas,life=LIFE_ICONS[theme],hp=G.hp;
 return side==='e'?`<section class="life-panel enemy-life theme-${theme}" id="enemy-health" aria-label="敌方生命 ${G.ehp}/7"><div class="life-title"><span>${life.name}</span><b>${G.ehp}<small> / 7</small></b></div><div class="life-tokens">${Array.from({length:7},(_,i)=>`<svg class="life-token ${i<G.ehp?'lit':'spent'}" viewBox="0 0 36 38" aria-hidden="true">${life.icon}</svg>`).join('')}</div></section>`:`<section class="life-panel player-life" id="player-health" aria-label="玩家生命 ${hp}/7"><div class="bonfire-stage"><img class="bonfire" src="${hp&&!matchMedia('(prefers-reduced-motion:reduce)').matches?BONFIRE_GIF:BONFIRE_STILL}" alt="${hp?hp+'档燃烧灯台':'灯台熄灭'}" style="--fire-size:${hp?(.38+hp*.088):.38};${hp?'':'filter:grayscale(1) brightness(.3);opacity:.5'}"></div><div class="candle-panel"><div class="life-title"><span>不灭灯火</span><b>${hp}<small> / 7</small></b></div><div class="candles">${Array.from({length:7},(_,i)=>`<span class="candle ${i<hp?'burning':'out'}" style="--delay:-${i*.23}s" aria-hidden="true"><i class="wick"></i><i class="candle-flame"></i></span>`).join('')}</div></div></section>`;
}
const BONFIRE_STILL='assets/lantern-rest.svg';
const BONFIRE_GIF='assets/lantern-alight.svg';

function pileHTML(side){
 const n=side==='p'?G.draw.length:G.ed.length,total=side==='p'?G.deck.length:G.st.dk.length,layers=Math.min(n,40),depth=Math.min(n*.55,26);
 return `<div class="deck-wrap"><div class="deck-pile" id="deck-${side}" role="img" aria-label="${side==='p'?'我方':'敌方'}牌堆，剩余${n}张">${n?Array.from({length:layers},(_,i)=>`<div class="deck-layer" style="transform:translate(${i*depth/Math.max(1,layers-1)}px,${-i*depth/Math.max(1,layers-1)}px)"></div>`).join(''):'<span class="deck-empty">已抽空</span>'}</div><div class="deck-info">${side==='p'?'我方':'敌方'}牌堆<br><b>${n}</b> / ${total}</div></div>`;
}
function takeCard(side,ash=false){
 const deck=side==='p'?G.draw:G.ed,hand=side==='p'?G.hand:G.eh;if(!ash&&!deck.length)return;
 const c=ash?{...cp(SQ),fod:true,e:side==='e'?1:undefined}:deck.pop();hand.push(c);
 drawQueue.push({game:G,side,c,source:document.getElementById(ash&&side==='p'?'ash-source':'deck-'+side)?.getBoundingClientRect()});return c;
}
function flushDraws(){
 if(drawRunning||!drawQueue.length)return drawIdle;drawRunning=true;
 drawIdle=(async()=>{try{while(drawQueue.length){
 const item=drawQueue.shift();if(item.game!==G||OV)continue;
 const index=(item.side==='p'?G.hand:G.eh).indexOf(item.c);
 const target=document.querySelector(item.side==='p'?`.hand [data-i="${index}"]`:`.enemy-hand [data-index="${index}"]`);
 const source=item.source||document.getElementById('deck-'+item.side)?.getBoundingClientRect();if(!target||!source)continue;
 if(item.side==='p'){const area=target.closest('.hand'),r=target.getBoundingClientRect(),b=area.getBoundingClientRect();if(r.right>b.right)area.scrollLeft+=r.right-b.right+5;else if(r.left<b.left)area.scrollLeft-=b.left-r.left+5;}
 const dest=target.getBoundingClientRect();if(dest.width<=0||dest.height<=0){snd('draw');continue}
 snd('draw');if(matchMedia('(prefers-reduced-motion:reduce)').matches)continue;
 const style=getComputedStyle(target),ghost=document.createElement('div'),rack=document.createElement('div'),copy=target.cloneNode(true);
 ghost.className='draw-flight game-shell';ghost.setAttribute('aria-hidden','true');
 ghost.style.cssText=`position:fixed;left:${dest.left}px;top:${dest.top}px;width:${dest.width}px;height:${dest.height}px;min-width:0;min-height:0;max-width:none;margin:0;padding:0;display:block;overflow:visible;pointer-events:none;z-index:110;box-sizing:border-box;--hand-card-width:${dest.width}px;--battle-card-width:${dest.width}px;--cw:${dest.width}px;--ch:${dest.height}px`;
 rack.className=item.side==='p'?'hand':'enemy-hand';rack.style.cssText='display:block;position:relative;width:100%;height:100%;margin:0;padding:0;overflow:visible;pointer-events:none;box-sizing:border-box';
 copy.removeAttribute('id');copy.removeAttribute('data-a');copy.removeAttribute('data-i');copy.removeAttribute('data-index');copy.removeAttribute('tabindex');
 copy.style.cssText+=`;width:${dest.width}px;height:${dest.height}px;min-width:0;min-height:0;margin:0;transform:none;transition:none;visibility:visible;box-sizing:border-box;font-size:${style.fontSize};line-height:${style.lineHeight};padding:${style.padding};pointer-events:none`;
 rack.appendChild(copy);ghost.appendChild(rack);document.body.appendChild(ghost);
 const previousVisibility=target.style.visibility;target.style.visibility='hidden';let animation=null,timer=null;
 try{
  const dx=source.left+source.width/2-dest.left-dest.width/2,dy=source.top+source.height/2-dest.top-dest.height/2;
  if(typeof ghost.animate==='function'){
   animation=ghost.animate([{transform:`translate(${dx}px,${dy}px)`,opacity:.78},{transform:'translate(0px,0px)',opacity:1}],{duration:210,easing:'cubic-bezier(.2,.7,.3,1)'});
   await Promise.race([animation.finished,new Promise(resolve=>{timer=setTimeout(resolve,280)})]);
  }
 }catch{}finally{if(timer!==null)clearTimeout(timer);if(animation)try{animation.cancel()}catch{}target.style.visibility=previousVisibility;ghost.remove()}
 }}finally{drawRunning=false;}})();return drawIdle;
}

function newRun(){
  G={lv:1,wins:0,kills:0,deck:[0,0,1,2,2,4,3].map(i=>cp(POOL[i])).concat(cp(POOL.find(p=>p.n==='苔庭铜缄线尾鼠')),grave.slice(-5).map(cp)),sel:null,sac:new Set(),busy:0,msg:''};
  battle();
}
async function battle(){
  Object.assign(G,{hp:7,ehp:7,p:Array(5).fill(null),e:Array(5).fill(null),turn:1,sel:null,busy:0,killer:null,lastHit:null});
  G.sac.clear();G.st=STG[G.lv-1];G.ed=shuf(G.st.dk.map(n=>eCard(n,G.st)));G.eh=[];G.draw=shuf(G.deck.map(cp));snd('shuffle');
  G.hand=[];G.mustDraw=1;G.busy=1;OV=null;render();
  for(const side of ['e','p','e','p']){takeCard(side);render();await drawIdle}
  takeCard('p',true);render();await drawIdle;await enemyPlay(1);G.busy=0;render();
}
function cardHTML(c,cls='',at=''){
  return `<div class="card ${c.d?'dead':''} ${c.e?'e':''} ${c.f?'f-'+c.f:''} ${cls}"${cardTip(c)?` data-tip="${cardTip(c)}"`:''} ${at}><div class="top"><b>${c.n}</b><i>${'●'.repeat(c.c||0)}</i></div><div class="art">${c.f?`<em class="fc">${FN[c.f]}</em>`:''}${c.at?`<i class="at" style="background:${ATC[c.at]}">${c.at[0]}</i>`:''}<svg viewBox="0 0 40 40">${GL[glyph(c)]}</svg></div><div class="sg">${c.s?`<span class="sk">${SG[c.s]}</span>`:''}${c.x?`<span class="sk x">${SX[c.x]}</span>`:''}${c.dr?`<span class="sk x">抽${c.dr}</span>`:''}${c.dd?`<span class="sk x">死抽${c.dd}</span>`:''}</div><div class="st"><span>${c.a}</span><span>${c.h}</span></div></div>`;
}
function render(){
  hideTip();const A=document.getElementById('app');let h='';
  if(G){
    const hc=G.sel!=null?G.hand[G.sel]:null;
    let m=G.mustDraw?'每回合免费得到一张余芯。再抽一张：卡组，或者再来一张余芯':hc?(G.sac.size<hc.c?`再选 ${hc.c-G.sac.size} 张己方卡献祭${G.p.filter(x=>x&&(x.t||0)<G.turn).length<hc.c?'（可献祭的卡不够：刚打出的下回合才能献祭）':''}`:'点击格子放置'):'选一张手牌，或结束回合';
    h+=`<div class="hdr"><span>${G.st.n}</span><span>余芯 ${Math.min(5,grave.length)} 张</span><span>牌堆 ${G.draw.length}</span><span data-a="mute" style="cursor:pointer">${mute?'音效关':'音效开'}</span><span data-a="mus" style="cursor:pointer">${mmute?'音乐关':'音乐开'}</span></div>`;
    h+=healthHTML('e');
    h+=`<div class="msg" style="color:var(--bone);opacity:.75;font-size:12px"><b style="color:#ff7a54;font-size:14px">【敌】${G.st.n}</b> · 献祭「${G.st.fod}」· ${G.st.pd} · 敌手牌 ${G.eh.length}</div>`;
    h+=`<div class="supply enemy-supply">${pileHTML('e')}<div class="enemy-hand" aria-label="敌方手牌">${G.eh.map((c,i)=>`<div class="card-back" data-index="${i}" aria-label="敌方手牌，牌面隐藏"></div>`).join('')}</div></div>`;
    h+=`<div class="row board">${G.e.map((c,i)=>c?cardHTML(c,'',`id="c-e-${i}"`):`<div class="slot" id="c-e-${i}" style="cursor:default"></div>`).join('')}</div>`;
    h+=`<div class="row board">${G.p.map((c,i)=>{
      const ok=hc&&G.sac.size>=hc.c&&(!c||G.sac.has(i)),sac=G.sac.has(i);
      return c?cardHTML(c,(ok?'ok ':'')+(sac?'sac ':'')+(c.t===G.turn?'fresh':''),`id="c-p-${i}" data-a="s" data-i="${i}" tabindex="0" style="${sac?'outline:3px solid var(--blood)':ok?'outline:3px solid var(--candle)':''}"`):`<div class="slot ${ok?'ok':''}" id="c-p-${i}" data-a="s" data-i="${i}" tabindex="0"></div>`}).join('')}</div>`;
    h+=healthHTML('p');
    h+=`<div class="msg">${G.busy?'……':m}</div>`;
    if(hc&&(hc.s||hc.x||hc.at))h+=`<div class="msg" style="color:var(--bone);opacity:.7;font-size:12px">${[hc.s&&SGD[hc.s],hc.x&&SGX[hc.x],hc.at&&hc.at!=='物理'&&`属性${hc.at}：克${RING[hc.at]}，被${Object.keys(RING).find(k=>RING[k]===hc.at)}克`].filter(Boolean).join('；')}</div>`;
    h+=`<div class="supply player-supply">${pileHTML('p')}<span class="deck-info">第 ${G.turn} 回合<br>手牌 ${G.hand.length} 张</span><div class="ash-source" id="ash-source">余芯</div></div>`;
    h+=`<div class="hand">${G.hand.map((c,i)=>cardHTML(c,i===G.sel?'sel':'',`data-a="h" data-i="${i}" tabindex="0"`)).join('')}</div>`;
    h+=`<div class="ctl">${G.mustDraw?`<button data-a="deck" ${G.draw.length?'':'disabled'}>${G.draw.length?'抽卡组':'卡组已空'}</button><button data-a="sq">抽余芯</button>`:`<button class="pri" data-a="end">结束回合</button>`}</div>`;
  }
  if(OV==='title')h+=`<div class="ov"><h1>灯誓牌</h1><p style="margin-top:-6px"><span style="font-size:12px;opacity:.6;letter-spacing:.3em">作者</span><br><span class="sig">Will Wang</span></p><p style="font-size:12px;opacity:.55">点击屏幕任意处，开启背景音乐</p><p>你与敌人各有 7 点生命，双方各有五个战斗格。<br>越过空位或飞行直击会扣除对方生命，生命归零即落败。<br>灯台与七根蜡烛代表你的生命；灯火效果回复 1 点生命。<br>刚打出的牌要等到下一回合，才能被献祭。</p><p>献祭己方卡牌来支付费用（●）。<br>每次死亡，你的遗骸会以你的名字变成一张带特殊能力的<b>余芯</b>卡，永远留在之后的卡组里。</p><p>属性相克：火→血→光→暗→雷→火。<br>克制时伤害+1，被克制时伤害-1。余芯卡继承致命一击者的属性。</p>${grave.length?`<p>坟场里已有 ${grave.length} 张遗契之牌</p><div class="row">${grave.slice(-3).map(c=>cardHTML(c)).join('')}</div>`:''}<p>共 8 关：魂 → 暮潮港湾 → 霜枝高地 → 星铸天穹。敌人也要献祭才能出牌，每一关用专属卡组。打赢后从敌人的较强卡里选一张。<br>卡牌图鉴 ${SEEN.size} / ${POOL.length}</p><input id="nm" maxlength="5" value="${pname}" placeholder="自己起名，或留空随机" style="width:200px;padding:12px;text-align:center;font:inherit;background:var(--wood2);color:var(--bone);border:2px solid #6b4e2e;border-radius:6px"><button style="flex:none;width:200px" data-a="rnd">随机命名</button><button class="pri" style="flex:none;width:200px" data-a="start">点燃蜡烛</button></div>`;
  if(OV==='clear')h+=`<div class="ov"><h1 style="font-size:34px">灯火传续</h1><p>你击败了八关的敌人，把灯火传给了下一位苔庭暖灰缄骨客。</p><p>本次卡组 ${G.deck.length} 张，图鉴 ${SEEN.size} / ${POOL.length}</p><button class="pri" style="flex:none;width:200px" data-a="title">回到灯台</button></div>`;
  if(OV==='win')h+=`<div class="ov"><h2>你击败了${G.st.n}</h2><p>从敌人卡组里的两张较强牌，和一张抽牌牌中选一张</p><div class="row">${G.rw.map((c,i)=>cardHTML(c,'',`data-a="rw" data-i="${i}" tabindex="0"`)).join('')}</div></div>`;
  if(OV==='dead')h+=`<div class="ov"><h2>你死了</h2><p>死于「${G.dc.by}」。你撑过了 ${G.wins} 场战斗，击杀 ${G.kills} 个敌人。<br>你的遗骸化作一张牌：</p>${cardHTML(G.dc)}<p>${SGD[G.dc.s]}<br><b style="color:var(--candle)">${SGX[G.dc.x]}</b><br>费用 ${G.dc.c}。下一次轮回，它会在你的卡组里。</p><button class="pri" style="flex:none;width:200px" data-a="title">再入轮回</button></div>`;
  A.innerHTML=h;syncMusic();flushDraws();
}
function kill(side,i,by){
  const b=side==='p'?G.p:G.e,c=b[i];b[i]=null;snd('kill');
  if(side==='p'&&by)G.killer=by;if(side==='e')G.kills++;
  if(c.s==='bones')b[i]=bone();else if(side==='e'&&G.st.pas==='魂'&&!c.fod)b[i]=fodder(G.st);
  if(side==='p'&&c.x==='rekindle'&&!c.rk)G.hand.push({...c,a:c.a0??c.a,h:c.h0??c.h,rk:1});
  if(c.dd){if(side==='p'){if(G.draw.length){takeCard('p')}}else if(G.ed.length)takeCard('e')}
}
function atk(side,i){
  const me=side==='p'?G.p:G.e,ot=side==='p'?G.e:G.p,a=me[i];
  if(!a||a.a<=0)return;
  const t=ot[i];
  if(a.s==='fly'||!t){if(side==='p')G.ehp=Math.max(0,G.ehp-a.a);else G.hp=Math.max(0,G.hp-a.a);if(side==='e')G.lastHit=a;return}
  if(t.s==='parry'&&a.a<=2){a.h-=1}else{t.h-=dealt(a,t);if(t.s==='thorn')a.h-=1;if(a.s==='vamp'&&a.h<(a.h0||a.h))a.h++}
  if(t.h<=0){kill(side==='p'?'e':'p',i,a);if(a.x==='soul'&&a.h>0)a.a++}
  if(a.h<=0&&me[i]===a)kill(side,i,t);
}
function chk(){
  if(G.ehp<=0){win();return 1}
  if(G.hp<=0){lose();return 1}
  return 0;
}
const el=(s,i)=>document.getElementById(`c-${s}-${i}`);
function burn(e){
  if(!e||typeof e.animate!=='function')return;
  try{
  e.style.zIndex=9;
  const fade=e.animate([{filter:'none',opacity:1,transform:'none'},{filter:'brightness(1.5) sepia(1) saturate(5) hue-rotate(-15deg)',opacity:1,offset:.4},{filter:'brightness(.2)',opacity:0,transform:'scale(.82) translateY(-6px)'}],{duration:650,fill:'forwards',easing:'ease-in'});if(fade?.finished)Promise.resolve(fade.finished).catch(()=>{});
  for(let k=0;k<5;k++){
    const f=document.createElement('div');
    f.innerHTML=`<svg viewBox='0 0 40 40' style='width:100%;height:100%;fill:${k%2?'#ffd23a':'#ff6a1a'}'>${GL.flame}</svg>`;
    f.style.cssText=`position:absolute;bottom:${rnd(30)}%;left:${k*18-4}%;width:${34+rnd(20)}%;height:${40+rnd(25)}%;pointer-events:none;z-index:10;transform-origin:50% 100%`;
    e.appendChild(f);
    const flame=f.animate([{transform:'scale(.3)',opacity:0},{transform:'scale(1.1)',opacity:1,offset:.35},{transform:'translateY(-40px) scale(.6)',opacity:0}],{duration:600,delay:k*40,fill:'both'});if(flame?.finished)Promise.resolve(flame.finished).catch(()=>{});
  }
  }catch{}
}
function pop(e,txt,col){if(!e)return;const s=document.createElement('b');s.textContent=txt;s.style.cssText=`position:absolute;left:0;right:0;top:30%;text-align:center;font-size:20px;color:${col};text-shadow:0 0 6px #000;z-index:10;pointer-events:none`;e.appendChild(s);try{if(typeof s.animate==='function'){const motion=s.animate([{transform:'translateY(0)',opacity:1},{transform:'translateY(-26px)',opacity:0}],{duration:650,fill:'forwards'});if(motion?.finished)Promise.resolve(motion.finished).catch(()=>{})}}catch{}setTimeout(()=>s.remove(),700)}
async function strike(s,i){
  const me=s==='p'?G.p:G.e,o=s==='p'?'e':'p',ot=s==='p'?G.e:G.p,a=me[i];
  if(!a||a.a<=0)return;
  const t=ot[i],ae=el(s,i),te=el(o,i),fl=a.s==='fly';
  if(!ae||!te||matchMedia('(prefers-reduced-motion:reduce)').matches){atk(s,i);return}
  const dy=(te.getBoundingClientRect().top-ae.getBoundingClientRect().top)*(fl?1.1:.8);
  ae.style.zIndex=9;snd('whoosh');
  ae.animate([{transform:'none'},{transform:`translateY(${dy}px) scale(${fl?1.5:1.18}) rotate(${fl?(s==='p'?-8:8):0}deg)`,offset:.5},{transform:'none'}],{duration:440,easing:'ease-in-out'});
  await wait(220);
  const direct=a.s==='fly'||!t,dmg=direct?a.a:(t.s==='parry'&&a.a<=2?0:dealt(a,t)),rel=!direct&&dmg>a.a?'克制':!direct&&dmg<a.a?'被抗':'';
  atk(s,i);
  if(direct){snd('clang');const sc=document.getElementById(s==='p'?'enemy-health':'player-health');pop(sc||te,`${fl&&t?'飞越！':''}生命 -${dmg}`,'#e5a53d');if(sc)sc.animate([{filter:'brightness(1)'},{filter:'brightness(2.2)'},{filter:'brightness(1)'}],{duration:360})}
  else{snd('hit');pop(te,'-'+dmg+(rel?' '+rel:''),rel==='克制'?'#ffd23a':'#ff6b4a');te.animate([{transform:'translateX(0)',filter:'brightness(2.2)'},{transform:'translateX(-7px)'},{transform:'translateX(7px)'},{transform:'translateX(0)',filter:'none'}],{duration:300});if(t.s==='thorn')pop(ae,'-1','#ff6b4a')}
  await wait(240);
}
async function endTurn(){
  if(G.busy||G.mustDraw)return;
  G.busy=1;G.sel=null;G.sac.clear();render();
  for(const s of['p','e']){
    for(let i=0;i<5;i++){await strike(s,i);render();await drawIdle;if(chk())return;await wait(100)}
  }
  [...G.p,...G.e].forEach(c=>{if(c&&c.s==='regen'&&c.h<(c.h0||c.h))c.h++});
  G.turn++;await enemyPlay(1);takeCard('p',true);G.mustDraw=1;render();await drawIdle;G.busy=0;render();
}
function win(){
  G.wins++;G.rw=[...shuf([...new Set(G.st.dk)].map(n=>POOL.find(p=>p.n===n)).sort((x,y)=>(y.a+y.h+y.c)-(x.a+x.h+x.c)).slice(0,5)).slice(0,2),(()=>{const d=POOL.filter(p=>p.dr||p.dd),nw=d.filter(p=>!G.deck.some(k=>k.n===p.n));return pick(nw.length?nw:d)})()].map(cp);OV='win';snd('win');render();
}
function lose(){
  const k=G.lastHit||G.killer||{n:'未知',s:null};
  const a=1+Math.floor(G.wins/2)+(G.kills>=5?1:0),h=2+Math.floor((G.wins+G.kills)/3);
  G.dc={n:pname+'余芯',a,h,a0:a,h0:h,c:a+h>5?2:1,s:k.s||'bones',x:G.kills>=6?'soul':G.wins>=2?'ember':'rekindle',d:1,by:k.n,at:k.at||'暗'};
  grave.push(cp(G.dc));
  try{localStorage.setItem('lo_grave',JSON.stringify(grave))}catch(e){}
  OV='dead';snd('die');render();
}
async function commit(i){
  const c=G.hand[G.sel],sacs=[...G.sac];G.busy=1;
  if(sacs.length){snd('burn');sacs.forEach(j=>{const e=el('p',j);if(e)burn(e)});await wait(650)}
  G.hand.splice(G.sel,1);
  G.sac.forEach(j=>{const x=G.p[j];G.p[j]=x.s==='bones'?bone():null});
  G.p[i]=cp(c);G.p[i].t=G.turn;G.sel=null;G.sac.clear();G.busy=0;
  if(c.dr){G.busy=1;for(let k=0;k<c.dr&&G.draw.length;k++){takeCard('p');render();await drawIdle}G.busy=0;}
  if(c.x==='ember'){G.hp=Math.min(7,G.hp+1);snd('clang')}
  if(chk())return;render();
  const nw=el('p',i);if(nw)nw.animate([{transform:'translateY(-34px) scale(1.3)',opacity:.4},{transform:'none',opacity:1}],{duration:170,easing:'ease-in'});
  setTimeout(()=>snd('place'),120);
}
const TIP=document.getElementById('tip');
const SGS={fly:'越过拦截，直击生命',thorn:'被攻击时反伤1',bones:'死后留下1/1的骨',parry:'被攻击≤2的卡攻击时免伤并反伤1',vamp:'命中卡牌后回复1血',regen:'每回合结束回复1血'};
const SXS={soul:'击杀敌人后攻击+1',ember:'放置时回复你1点生命（上限7）',rekindle:'死亡时回到手牌（每场一次）'};
function cardTip(c){const L=[];
 if(c.fod)L.push('祭品：敌方用来献祭的牌');
 else if(c.n==='余芯'&&!c.d)L.push('余芯：0费免费牌，用来献祭');
 else if(c.n==='碎灯偶')L.push('骨：遗骨留下的1/1小卡');
 if(c.d)L.push('余芯卡：你死亡后化成的牌');
 if(c.c&&!c.e)L.push(`费用${'●'.repeat(c.c)}：需献祭${c.c}张己方卡`);
 if(c.s)L.push(`${SG[c.s]}：${SGS[c.s]}`);
 if(c.x)L.push(`${SX[c.x]}：${SXS[c.x]}`);
 if(c.dr)L.push(`抽牌：放置时再抽${c.dr}张牌`);
 if(c.dd)L.push(`死亡抽牌：被击杀时再抽${c.dd}张牌`);
 if(G&&c.t===G.turn&&!c.e)L.push('刚打出：下回合才能被献祭');
 if(c.at)L.push(atTip(c.at));
 return L.join('¦')}

function showTip(t){const x=t.dataset.tip;if(!x)return;TIP.innerHTML=x.split('¦').map(l=>{const[h,...r]=l.split('：');return r.length?`<div><b>${h}</b>${r.join('：')}</div>`:`<div>${l}</div>`}).join('');TIP.style.display='block';const b=t.getBoundingClientRect(),w=TIP.offsetWidth,hh=TIP.offsetHeight;TIP.style.left=Math.min(Math.max(6,b.left+b.width/2-w/2),innerWidth-w-6)+'px';let tp=b.top-hh-8;if(tp<6)tp=b.bottom+8;TIP.style.top=tp+'px'}
function hideTip(){TIP.style.display='none'}
document.addEventListener('mouseover',e=>{if(!matchMedia('(hover:hover)').matches)return;const t=e.target.closest('[data-tip]');if(t)showTip(t)});
document.addEventListener('mouseout',e=>{if(e.target.closest('[data-tip]'))hideTip()});


const BOSS_DECKS=__DATA_BOSS_DECKS__;

const CARD_NAME_ALIASES={};
const CARD_ART_PROFILES=__DATA_PORTRAITS__;
const BOSS_ABILITIES=__DATA_BOSS_ABILITIES__;
const CAMPAIGNS=__DATA_CAMPAIGNS__;
POOL.splice(0,POOL.length,...__DATA_CARDS__);
STG.splice(0,STG.length,...CAMPAIGNS.mire);
const STARTER_BASE=["苔庭暖灰缄骨客", "苔庭银露缄骨客", "苔庭铜缄线尾鼠", "苔庭铜缄掠风鸟", "苔庭铠卫·乌恩", "苔庭铠卫·欧恩", "苔庭缄骨客·维翎", "炽砂修灯师·瑟罗", "霜枝银露铠卫", "霜枝藤印铠卫", "霜枝藤印潜印客", "苔庭石封铠卫"];
const STARTER=[...STARTER_BASE,"苔庭暖灰缄骨客","苔庭银露缄骨客","苔庭铜缄线尾鼠","苔庭铜缄掠风鸟"];
const RECOMMENDED_STARTER=[...STARTER_BASE,...STARTER_BASE];
// Stage powers consume one hand ash, then rest for one complete round.
const BOSS_SKILL_HANDLERS=Object.create(null);
function bossAbilityForStage(){if(typeof G==='undefined'||!G?.st||G.tutorial||typeof BOSS_ABILITIES==='undefined')return null;const all=Array.isArray(BOSS_ABILITIES)?BOSS_ABILITIES:Object.values(BOSS_ABILITIES);return all.find(x=>x.boss===G.st.boss)||null}
function bossAbilitiesInitBattle(){if(!G)return;G.discard={p:[],e:[]};G.bossSkill={boss:G.st?.boss,turnUsed:-1,usedCount:0,playerDirectDamage:0,enemyDirectDamage:0,enemyDeaths:0,temp:[],deferred:[],fireSeed:null,heroRedirect:null,history:[]};if(typeof playerBossSkillsInitBattle==='function')playerBossSkillsInitBattle()}
function bossSkillState(){if(!G)return null;if(!G.bossSkill||G.bossSkill.boss!==G.st?.boss)bossAbilitiesInitBattle();return G.bossSkill}
function bossAbilityUsed(){return !!G&&G.bossSkill?.turnUsed===G.turn}
function bossSkillCooldownTurns(state){return !G||!state||!Number.isFinite(state.turnUsed)||state.turnUsed<0?0:Math.max(0,state.turnUsed+2-G.turn)}
function bossSkillReady(state){return !!G&&G.turn>=2&&!!state&&bossSkillCooldownTurns(state)===0}
function bossSkillWickIndex(side='e'){
 const hand=side==='p'?G?.hand:G?.eh;
 return Array.isArray(hand)?hand.findIndex(c=>c&&c.n==='余芯'&&c.c===0&&c.a===0&&c.h===1&&!c.bossWickOriginal&&!(c.frozenUntil>G.turn)&&!(c.bossFrozenUntil>G.turn)):-1;
}
function bossSkillWickCard(side='e'){const i=bossSkillWickIndex(side);return i<0?null:(side==='p'?G.hand:G.eh)[i]}
function bossAbilityCanReserveWick(){return !!bossAbilityForStage()&&bossSkillReady(bossSkillState())&&bossSkillWickIndex('e')>=0}
function bossExecutePaidAbility(owner,state,cfg,source=null){
 const handler=cfg&&BOSS_SKILL_HANDLERS[cfg.boss];
 if(!cfg||typeof handler!=='function'||!bossSkillReady(state))return false;
 const hand=owner==='p'?G.hand:G.eh,index=bossSkillWickIndex(owner);if(index<0)return false;
 // Reserve the mandatory ash before printed discard costs. Failed conditions
 // restore the same card at the same hand position; no death/discard is fired.
 const ash=hand.splice(index,1)[0];let applied=false;
 try{applied=handler(bossContext(owner,state,source))===true}finally{if(!applied)hand.splice(Math.min(index,hand.length),0,ash)}
 if(applied){logBattle(`${owner==='p'?'我方':'敌方'}消耗1张手牌余芯，技能将在第${G.turn+2}回合恢复。`);if(typeof snd==='function')snd('burn')}
 return applied;
}
function bossAbilityStateLabel(){const cfg=bossAbilityForStage(),state=bossSkillState();if(!cfg)return '无主动技能';if(G.turn<2)return '第2回合启用';if(bossAbilityUsed())return '本回合已使用';if(!bossSkillReady(state))return '冷却中 · 本回合休息';if(bossSkillWickIndex('e')<0)return '缺少1张可用手牌余芯';if(G.busy)return cfg.timing==='after_attack'?'攻击结束时判定':'部署阶段判定';return cfg.timing==='after_attack'?'等待攻击结束':G.enemyDeployedTurn!==G.turn?'等待Boss部署':'条件不足，本回合未使用'}
function bossUnits(side){return (side==='p'?G.p:G.e).map((card,index)=>({card,index})).filter(x=>x.card)}
function bossCardSide(card){return G.p.includes(card)?'p':G.e.includes(card)?'e':null}
function bossCardAttack(card){if(!card)return 0;if(typeof aiBossPreviewAttack==='function'){const attack=aiBossPreviewAttack(card);if(attack!==null)return attack}const side=bossCardSide(card),board=side==='p'?G.p:side==='e'?G.e:null,index=board?.indexOf(card)??-1,target=index>=0?(side==='p'?G.e:G.p)[index]:null;return typeof effectiveCardAttack==='function'?effectiveCardAttack(card,target):card.a}
function bossChoose(list){return list?.length?list[Math.floor(Math.random()*list.length)]:null}
function bossCardEffects(card){return card?.bossEffects||{}}
function bossHasSkill(card,key){return !!card&&(card.s===key||(card.bossEffects?.skills||[]).includes(key)||(key==='push'&&card.mv==='push'))}
function bossEffect(card,patch){if(!card)return card;card.bossEffects={...(card.bossEffects||{}),...patch};return card}
function bossTemp(card,patch){const state=bossSkillState();if(!card||!state)return card;for(const [key,value]of Object.entries(patch)){if(key==='a'){bossBuff(card,value-card.a);continue}let entry=state.temp.find(x=>x.card===card&&x.key===key);if(!entry){entry={card,key,had:Object.prototype.hasOwnProperty.call(card,key),value:card[key]};state.temp.push(entry)}card[key]=value}return card}
function bossBuff(card,delta,permanent=false){if(!card||!Number.isFinite(delta))return card;const amount=Math.max(0,card.a+delta)-card.a;card.a+=amount;if(permanent&&Number.isFinite(card.a0))card.a0=Math.max(0,card.a0+amount);if(!permanent){const state=bossSkillState();let entry=state.temp.find(x=>x.card===card&&x.key==='a');if(!entry){entry={card,key:'a',delta:0};state.temp.push(entry)}entry.delta+=amount}return card}
function bossShield(card,n=1){if(card)bossEffect(card,{shield:Math.max(card.bossEffects?.shield||0,n)});return card}
function bossDeferred(card,kind,data={}){if(card)bossSkillState().deferred.push({card,kind,turn:G.turn+1,...data});return card}
function bossHealCard(card,n){if(!card||n<=0)return 0;const before=card.h;card.h=Math.min(card.h0??card.h,card.h+n);return card.h-before}
function bossHealHero(side,n){const key=side==='p'?'hp':'ehp',before=G[key];G[key]=Math.min(7,G[key]+n);return G[key]-before}
function bossIsToken(card){return !!card&&(card.token||card.fod||card.bossWickOriginal||['余芯','碎灯偶'].includes(card.n))}
function bossStripRoundEffects(card){const state=G?.bossSkill;if(!card)return card;if(state){for(const entry of state.temp.filter(x=>x.card===card)){if(entry.key==='a')card.a=Math.max(0,card.a-entry.delta);else if(entry.had)card[entry.key]=entry.value;else delete card[entry.key]}state.temp=state.temp.filter(x=>x.card!==card)}delete card.bossEffects;delete card.bossFrozenUntil;return card}
function bossDiscardOne(side='e'){const hand=side==='p'?G.hand:G.eh;if(!hand?.length)return null;const index=hand.map((card,index)=>({card,index,value:card.a*1.8+card.h*.7+(card.dr||0)+(card.heal||0)-card.c*.3})).sort((a,b)=>a.value-b.value)[0].index;const card=hand.splice(index,1)[0];bossStripRoundEffects(card);if(!bossIsToken(card))G.discard[side].push(card);logBattle(`${side==='p'?'我方':'敌方'}丢弃${card.n}`);return card}
function bossDraw(side,n){let count=0;for(let i=0;i<n;i++)if(takeCard(side))count++;return count}
function bossConsumeDiscard(side,predicate=()=>true){const list=G.discard?.[side]||[],index=list.findIndex(predicate);return index<0?null:list.splice(index,1)[0]}
function bossSummon(side,template,opts={}){const board=side==='p'?G.p:G.e;const index=Number.isInteger(opts.lane)?opts.lane:board.findIndex(x=>!x);if(index<0||index>=board.length||board[index])return null;const card=makeCard({...template,c:template.c??0,token:true,kind:template.kind||'mob',game:template.game||G.st.games?.[0],f:template.f||G.st.f,at:template.at||'物理'},side==='e');card.t=G.turn;if(opts.cannotSacrifice)card.bossNoSacrifice=true;if(opts.expiresTurn!=null)card.bossExpiresTurn=opts.expiresTurn;board[index]=card;logBattle(`${side==='p'?'我方':'敌方'}第${index+1}格出现${card.n}`);return card}
function bossMove(side,card,delta,swap=false){const board=side==='p'?G.p:G.e,index=board.indexOf(card),target=index+delta;if(index<0||target<0||target>=board.length||Math.abs(delta)!==1||card.moved===G.turn||card.bossEffects?.lockMove)return false;const other=board[target];if(other&&(!swap||other.moved===G.turn||other.bossEffects?.lockMove))return false;board[target]=card;board[index]=other||null;card.moved=G.turn;if(other)other.moved=G.turn;return true}
function bossReturnToHand(side,card){const board=side==='p'?G.p:G.e,index=board.indexOf(card);if(index<0)return false;board[index]=null;bossStripRoundEffects(card);card.h=card.h0??card.h;card.poison=0;G.bossSkill.deferred=G.bossSkill.deferred.filter(entry=>entry.card!==card);delete card.t;delete card.moved;(side==='p'?G.hand:G.eh).push(card);return true}
function bossPlayerLockUntil(owner='e'){const first=typeof roundFirstSide==='function'?roundFirstSide():'p';const target=owner==='e'?'p':'e';return G.turn+(owner==='p'?(G.enemyDeployedTurn===G.turn?2:1):(G.phase==='enemy-deploy'&&first===target?2:1))}
function bossWick(card,owner='e'){const side=owner==='e'?'p':'e',board=side==='p'?G.p:G.e,index=board.indexOf(card);if(index<0||bossIsToken(card)||card.bossWickImmuneUntil>G.turn||board.some(c=>c?.bossWickOriginal))return false;const beforeTarget=owner==='e'?G.phase==='enemy-deploy'&&typeof roundFirstSide==='function'&&roundFirstSide()==='e':G.phase==='player-deploy'&&G.enemyDeployedTurn!==G.turn;const ash={n:'余芯',a:0,h:1,a0:0,h0:1,c:0,at:'物理',fod:true,e:side==='e'?1:undefined,t:card.t||0,bossWickOriginal:card,bossWickRestoreTurn:G.turn+(beforeTarget?1:2),lore:'暂时化作余芯；经历下一次完整行动后恢复。被击杀或献祭则原卡本场不再恢复。'};board[index]=ash;logBattle(`${card.n}暂时化作余芯，将在第${ash.bossWickRestoreTurn}回合部署开始时恢复`);return true}
function bossRedirect(card,n=1,state=bossSkillState()){if(card&&state)state.heroRedirect={card,amount:n,untilTurn:G.turn}}
function bossCleanse(card){if(!card)return false;card.poison=0;delete card.bossFrozenUntil;const state=bossSkillState();for(const entry of state.temp.filter(x=>x.card===card&&x.key==='a'&&x.delta<0)){card.a-=entry.delta;state.temp.splice(state.temp.indexOf(entry),1)}return true}
// Handlers use a relative view: 'e' is the skill owner and 'p' is its opponent.
// This proxy never replaces global G; draws, deaths and asynchronous animations keep real ownership.
function bossContext(owner='e',providedState=null,source=null){
 const map=side=>owner==='p'?(side==='e'?'p':'e'):side,state=providedState||(owner==='p'&&typeof playerBossSkillState==='function'?playerBossSkillState():bossSkillState());
 const fields={p:'e',e:'p',hand:'eh',eh:'hand',draw:'ed',ed:'draw',hp:'ehp',ehp:'hp'},discard=owner==='p'?new Proxy({}, {get:(_,key)=>G.discard?.[map(key)],set:(_,key,value)=>{G.discard[map(key)]=value;return true}}):null;
 const view=owner==='e'?G:new Proxy(G,{get:(target,key)=>key==='discard'?discard:key==='bossSkill'?state:target[fields[key]||key],set:(target,key,value)=>{target[fields[key]||key]=value;return true}});
 return {G:view,state,owner,units:side=>bossUnits(map(side)),choose:bossChoose,shield:bossShield,temp:bossTemp,buff:bossBuff,effect:bossEffect,deferred:bossDeferred,healCard:bossHealCard,healHero:(side,n)=>bossHealHero(map(side),n),discardOne:(side='e')=>bossDiscardOne(map(side)),draw:(side,n)=>bossDraw(map(side),n),consumeDiscard:(side,predicate)=>bossConsumeDiscard(map(side),predicate),summon:(side,template,opts)=>bossSummon(map(side),source?.game?{...template,game:source.game,f:source.f}:template,opts),move:(side,...args)=>bossMove(map(side),...args),returnToHand:(side,card)=>bossReturnToHand(map(side),card),ash:card=>bossWick(card,owner),redirect:(card,n)=>bossRedirect(card,n,state),cleanse:bossCleanse,hasSkill:bossHasSkill,hurt:(side,...args)=>bossTakeCardDamage(map(side),...args),kill:(side,...args)=>kill(map(side),...args),lockUntil:()=>bossPlayerLockUntil(owner),forecast:owner==='e'&&typeof openingForecast==='function'?()=>openingForecast():null};
}
function runBossAbility(phase){const cfg=bossAbilityForStage(),state=bossSkillState();if(!cfg||G.tutorial||!bossSkillReady(state)||cfg.timing!==phase||G.hp<=0||G.ehp<=0)return false;if(typeof aiShouldUseBossAbility==='function'&&!aiShouldUseBossAbility(cfg,phase))return false;const applied=bossExecutePaidAbility('e',state,cfg);if(applied){state.turnUsed=G.turn;state.usedCount++;state.history.push({turn:G.turn,boss:cfg.boss,name:cfg.name,phase});logBattle(`${cfg.boss}发动「${cfg.name}」`)}return applied}
function bossRecordDirect(attackingSide,amount){const state=bossSkillState();if(!state||amount<=0)return;if(attackingSide==='e')state.playerDirectDamage+=amount;else state.enemyDirectDamage+=amount;const own=G.playerBossSkill;if(own){if(attackingSide==='p')own.playerDirectDamage+=amount;else own.enemyDirectDamage+=amount}}
function bossRecordDeath(side,card,reason,by){const state=bossSkillState();if(!state||!card)return;if(side==='e')state.enemyDeaths++;if(side==='p'&&G.playerBossSkill)G.playerBossSkill.enemyDeaths++;if(reason==='combat'&&by?.h>0&&by?.bossEffects?.healOnKill){bossHealCard(by,by.bossEffects.healOnKill);delete by.bossEffects.healOnKill}bossStripRoundEffects(card);if(bossIsToken(card)||card.x==='rekindle'&&!card.rk)return;if(!G.discard[side].includes(card))G.discard[side].push(card)}
function bossDamageHero(side,amount,by=null,meta={}){const state=side==='p'?G.playerBossSkill:bossSkillState(),board=side==='p'?G.p:G.e;let n=Math.max(0,amount);if(state?.heroRedirect?.untilTurn===G.turn&&board.includes(state.heroRedirect.card)&&n>0){const redirect=state.heroRedirect;state.heroRedirect=null;const take=Math.min(n,redirect.amount);n-=take;bossTakeCardDamage(side,redirect.card,take,by,{kind:'redirect'})}const key=side==='p'?'hp':'ehp',actual=Math.min(G[key],n);G[key]=Math.max(0,G[key]-n);if(meta.direct)bossRecordDirect(side==='p'?'e':'p',actual);if(side==='p'&&by)G.lastHit=by;return actual}
function bossTakeCardDamage(side,card,n,by=null,meta={}){const board=side==='p'?G.p:G.e,index=board.indexOf(card);if(index<0||n<=0)return 0;let amount=n,effects=card.bossEffects||{},shield=Number.isFinite(meta.attackShield)?meta.attackShield:effects.shield||0;if(shield>0){amount-=Math.min(amount,shield);delete effects.shield}if(amount<=0)return 0;card.h-=amount;if(card.h<=0&&board[index]===card&&!meta.deferDeath){kill(side,index,by,meta.kind==='sacrifice'?'sacrifice':'combat');if(meta.growth&&by?.h>0){if(by.growth)by.a++;else if(by.x==='soul')by.a=Math.max(by.a,Math.min(3,by.a+1))}}return amount}
function bossAttackDamage(attacker,defender,ignoreGuard=false){let damage=typeof effectiveCardAttack==='function'?effectiveCardAttack(attacker,defender):attacker.a;if((COUNTERS[attacker.at]||[]).includes(defender.at))damage++;else if((COUNTERS[defender.at]||[]).includes(attacker.at))damage--;if(bossHasSkill(defender,'guard')&&!ignoreGuard)damage--;return Math.max(0,damage)}
function bossResolveAttack(side,index){
 const board=side==='p'?G.p:G.e,otherSide=side==='p'?'e':'p',other=otherSide==='p'?G.p:G.e,a=board[index],target=other[index],state=G.bossSkill;
 if(!a)return false;
 if(!a.bossEffects&&!target?.bossEffects&&!state?.heroRedirect&&!G.playerBossSkill?.heroRedirect)return false;
 const baseAttack=typeof effectiveCardAttack==='function'?effectiveCardAttack(a,target):a.a;
 if(baseAttack<=0||a.bossEffects?.skipAttack)return true;
 const fx=a.bossEffects||{},reduction=fx.attackReduction||0;
 if(reduction)delete fx.attackReduction;
 const attackAmount=Math.max(0,baseAttack-reduction),direct=!target||(bossHasSkill(a,'fly')&&!bossHasSkill(target,'guard'));
 if(direct){const actual=bossDamageHero(otherSide,attackAmount,a,{direct:true});logBattle(`${a.n}直击${actual}点生命`);if(fx.selfDamage&&board.includes(a))bossTakeCardDamage(side,a,fx.selfDamage,null,{kind:'self'});return true}
 let damage=Math.max(0,bossAttackDamage(a,target,!!fx.pierce)-reduction);
 if(fx.pierce)delete fx.pierce;
 const tf=target.bossEffects||{},attackShield=tf.shield||0;
 // A card attack consumes the shield even when guard or parry negates damage.
 if(attackShield>0)delete tf.shield;
 if(a.at==='火'&&tf.fireWeakness){damage+=tf.fireWeakness;delete tf.fireWeakness}
 const parried=bossHasSkill(target,'parry')&&damage<=1;let reflect=0,actualDamage=0;
 if(tf.parryOnce){damage=Math.max(0,damage-1);reflect++;delete tf.parryOnce}
 if(parried)reflect++;else{actualDamage+=bossTakeCardDamage(otherSide,target,damage,a,{kind:'attack',deferDeath:true,attackShield});if(bossHasSkill(target,'thorn'))reflect++}
 // Resolve reflected damage before deciding whether the attacker survived its kill.
 if(reflect)bossTakeCardDamage(side,a,reflect,target,{kind:'reflect',deferDeath:true});
 if(fx.extraDamage){
  const extra=fx.extraDamage,element=fx.extraElement;delete fx.extraDamage;
  if(element==='雷'&&fx.reflectParry&&bossHasSkill(target,'parry'))bossTakeCardDamage(side,a,extra,target,{kind:'reflect',deferDeath:true});
  else if(target.h>0){let value=extra;if(element==='火'&&tf.fireWeakness){value+=tf.fireWeakness;delete tf.fireWeakness}actualDamage+=bossTakeCardDamage(otherSide,target,value,a,{kind:'attack',deferDeath:true})}
 }
 if(actualDamage>0){
  if(bossHasSkill(a,'vamp'))bossHealCard(a,1);
  if(bossHasSkill(a,'poison')&&target.h>0)target.poison=Math.max(target.poison||0,2);
  if(fx.healOnHit){bossHealCard(a,fx.healOnHit);delete fx.healOnHit}
  if(fx.heroHealOnHit){bossHealHero(side,fx.heroHealOnHit);delete fx.heroHealOnHit}
 }
 if(target.h<=0&&other.includes(target)){
  kill(otherSide,other.indexOf(target),a,'combat');
  if(a.h>0){if(a.growth){a.a++;logBattle(`${a.n}击杀成长，攻击升至${a.a}`)}else if(a.x==='soul')a.a=Math.max(a.a,Math.min(3,a.a+1))}
 }
 if(a.h<=0&&board.includes(a))kill(side,board.indexOf(a),target,'combat');
 if(board.includes(a)&&a.h>0&&other.includes(target)&&actualDamage>0&&!parried&&(bossHasSkill(a,'push')||a.mv==='push'))pushTarget(otherSide,other.indexOf(target));
 if(fx.selfDamage&&board.includes(a))bossTakeCardDamage(side,a,fx.selfDamage,null,{kind:'self'});
 logBattle(`${a.n}攻击${target.n}：${parried?'被弹反':actualDamage+'伤害'}`);return true;
}
function bossOnUnitDeploy(side,index,card){const state=side==='p'?bossSkillState():G.playerBossSkill,seed=state?.fireSeed,board=side==='p'?G.p:G.e;if(!seed||seed.lane!==index||seed.expiresTurn<G.turn||board[index]!==card)return false;state.fireSeed=null;bossTakeCardDamage(side,card,1,null,{kind:'skill'});logBattle(`穿刺火种灼烧${card.n}，造成1点伤害`);return true}
function bossOnPlayerDeploy(index,card){return bossOnUnitDeploy('p',index,card)}
function bossAbilitiesRoundEnd(){if(!G||G.tutorial)return;const state=bossSkillState();for(const side of ['p','e'])for(const {card}of [...bossUnits(side)]){if(card.bossEffects?.roundEndDamage)bossTakeCardDamage(side,card,card.bossEffects.roundEndDamage,null,{kind:'self'});if(card.bossExpiresTurn!=null&&card.bossExpiresTurn<=G.turn){const board=side==='p'?G.p:G.e,index=board.indexOf(card);if(index>=0)board[index]=null}}
 for(const entry of [...state.temp]){if(entry.key==='a')entry.card.a=Math.max(0,entry.card.a-entry.delta);else if(entry.had)entry.card[entry.key]=entry.value;else delete entry.card[entry.key]}state.temp=[];for(const c of [...G.p,...G.e,...G.hand,...G.eh,...G.discard.p,...G.discard.e])if(c){delete c.bossEffects;if(c.bossWickOriginal)delete c.bossWickOriginal.bossEffects;}for(const power of [state,G.playerBossSkill].filter(Boolean)){if(power.heroRedirect?.untilTurn<=G.turn)power.heroRedirect=null;if(power.fireSeed?.expiresTurn<=G.turn)power.fireSeed=null}}
function bossAbilitiesRoundStart(){if(!G||G.tutorial)return;const state=bossSkillState();for(const power of [state,G.playerBossSkill].filter(Boolean)){power.playerDirectDamage=0;power.enemyDirectDamage=0;power.enemyDeaths=0;if(power===G.playerBossSkill){power.armed=false;power.feedback=''}}for(const board of [G.p,G.e])for(let i=0;i<board.length;i++){const c=board[i];if(c?.bossWickOriginal&&c.bossWickRestoreTurn<=G.turn){const original=c.bossWickOriginal;original.bossWickImmuneUntil=G.turn+1;board[i]=original;logBattle(`${original.n}从余芯恢复`)} }
 const pending=state.deferred;state.deferred=[];for(const entry of pending){if(entry.turn>G.turn){state.deferred.push(entry);continue}const card=entry.card;if(!G.p.includes(card)&&!G.e.includes(card))continue;if(entry.kind==='charge')bossBuff(card,entry.delta||1);if(entry.kind==='grow'){card.a=entry.a??1;card.h=entry.h??2;card.a0=card.a;card.h0=card.h;if(entry.name)card.n=entry.name}}
 for(const c of [...G.hand,...G.eh])if(c?.bossFrozenUntil<=G.turn){delete c.bossFrozenUntil;c.bossFreezeImmuneUntil=G.turn+1;}}
// The first sixteen stage powers. All mutations use the shared round lifecycle.
function storyBossBest(ctx,list,score){
 if(!list.length)return null;
 const highest=Math.max(...list.map(score));return ctx.choose(list.filter(x=>score(x)===highest));
}
function storyBossValue(unit){return unit.card.a*2+unit.card.h+(unit.card.fod?-5:0)}
function storyBossMovements(ctx,side){
 const board=side==='p'?ctx.G.p:ctx.G.e,other=side==='p'?ctx.G.e:ctx.G.p,result=[];
 for(const unit of ctx.units(side)){
  if(unit.card.moved===ctx.G.turn||unit.card.bossEffects?.lockMove)continue;
  for(const delta of [-1,1]){const to=unit.index+delta;if(to<0||to>=board.length||board[to])continue;const target=other[to];result.push({...unit,delta,to,score:(target?target.a*2+Math.min(unit.card.a,target.h)+2:unit.card.a+1)+storyBossValue(unit)*.1})}
 }
 return result;
}
function storyBossWickTargets(ctx){return ctx.units('p').filter(({card})=>!bossIsToken(card)&&!(card.bossWickImmuneUntil>ctx.G.turn)&&!ctx.G.p.some(c=>c?.bossWickOriginal))}
Object.assign(BOSS_SKILL_HANDLERS,{
 '砂镜铠卫领誓·塔安':ctx=>{
  const target=storyBossBest(ctx,ctx.units('e').filter(x=>(x.card.bossEffects?.shield||0)<1),storyBossValue);if(!target)return false;
  ctx.shield(target.card,1);return true;
 },
 '砂镜铠卫领誓·诺翎':ctx=>{
  const target=storyBossBest(ctx,ctx.units('p').filter(x=>bossCardAttack(x.card)>0),x=>x.card.a);if(!target)return false;
  ctx.buff(target.card,-1);return true;
 },
 '苔庭裂角客领誓·阿珀':ctx=>{
  const target=storyBossBest(ctx,ctx.units('p'),x=>x.card.h);if(!target)return false;
  ctx.hurt('p',target.card,1);return true;
 },
 '苔庭灯议长·图珀':ctx=>{
  const ashes=ctx.units('e').filter(x=>x.card.n==='余芯'&&(x.card.t||0)<ctx.G.turn&&!x.card.bossNoSacrifice);
  const options=ashes.reduce((options,ash)=>options.concat(ctx.units('e').filter(x=>x.card!==ash.card).map(target=>({ash,target}))),[]);
  const chosen=storyBossBest(ctx,options,x=>storyBossValue(x.target));if(!chosen)return false;
  ctx.kill('e',chosen.ash.index,null,'sacrifice');ctx.buff(chosen.target.card,1);ctx.temp(chosen.target.card,{at:'火'});return true;
 },
 '铜钟铠卫领誓·瑟翎':ctx=>{
  const chosen=storyBossBest(ctx,storyBossMovements(ctx,'e'),x=>x.score);if(!chosen||!ctx.move('e',chosen.card,chosen.delta))return false;
  ctx.buff(chosen.card,1);return true;
 },
 '铜钟铠卫领誓·阿雅':ctx=>{
  const targets=ctx.G.hand.filter(card=>card.c>0&&frozenTurns(card)===0&&!(card.bossFreezeImmuneUntil>ctx.G.turn)),target=ctx.choose(targets);if(!target)return false;
  target.bossFrozenUntil=ctx.lockUntil();logBattle(`${target.n}被冰封契环冻结，下一次行动不能打出`);return true;
 },
 '炽砂铠卫领誓·维弥':ctx=>{
  const sacrifices=ctx.units('e').filter(x=>x.card.kind!=='boss'&&(x.card.t||0)<ctx.G.turn&&!x.card.bossNoSacrifice);
  const options=sacrifices.reduce((options,sac)=>options.concat(ctx.units('e').filter(x=>x.card!==sac.card).map(target=>({sac,target}))),[]);
  const chosen=storyBossBest(ctx,options,x=>storyBossValue(x.target)-storyBossValue(x.sac)*.8);if(!chosen)return false;
  ctx.kill('e',chosen.sac.index,null,'sacrifice');ctx.buff(chosen.target.card,1);ctx.healCard(chosen.target.card,1);return true;
 },
 '炽砂灯议长·诺罗':ctx=>{
  if(!ctx.G.eh.length)return false;
  const target=storyBossBest(ctx,ctx.units('e').filter(x=>(x.card.bossGaelGrowth||0)<2),storyBossValue);if(!target)return false;
  if(!ctx.discardOne('e'))return false;ctx.buff(target.card,1,true);target.card.bossGaelGrowth=(target.card.bossGaelGrowth||0)+1;return true;
 },
 '暮潮灯议长·岑尘':ctx=>{
  const target=storyBossBest(ctx,ctx.units('e'),storyBossValue);if(!target)return false;
  ctx.buff(target.card,1);ctx.effect(target.card,{selfDamage:1});return true;
 },
 '暮潮灯议长·希汀':ctx=>{
  if(ctx.state.enemyDirectDamage<=0)return false;const target=ctx.choose(ctx.units('p'));if(!target)return false;
  ctx.hurt('p',target.card,1);return true;
 },
 '霜枝铠卫领誓·泽芙':ctx=>{
  const chosen=storyBossBest(ctx,storyBossMovements(ctx,'e'),x=>x.score+(ctx.G.p[x.to]?5:0));if(!chosen||!ctx.move('e',chosen.card,chosen.delta))return false;
  const target=ctx.G.p[ctx.G.e.indexOf(chosen.card)];if(target)ctx.hurt('p',target,1,chosen.card,{kind:'skill'});return true;
 },
 '霜枝灯议长·诺诺':ctx=>{
  const target=storyBossBest(ctx,ctx.units('e').filter(x=>!x.card.bossEffects?.parryOnce),storyBossValue);if(!target)return false;
  ctx.effect(target.card,{parryOnce:true});return true;
 },
 '星铸灯议长·泽烙':ctx=>{
  if(!ctx.G.eh.length||!ctx.G.ed.length)return false;
  if(!ctx.discardOne('e'))return false;ctx.draw('e',2);return true;
 },
 '星铸折面星客领誓·瑟玟':ctx=>{
  if(ctx.state.playerDirectDamage>0)return false;const target=ctx.choose(storyBossWickTargets(ctx));return !!target&&ctx.ash(target.card);
 },
 '折光镜瞳山猫领誓·塔岚':ctx=>{
  const mode=ctx.state.danceMode||0;let applied=false;
  if(mode===0){const choices=storyBossMovements(ctx,'p'),chosen=ctx.choose(choices);if(chosen)applied=ctx.move('p',chosen.card,chosen.delta)}
  else if(mode===1){const target=ctx.choose(ctx.units('p'));if(target){ctx.hurt('p',target.card,1,null,{kind:'skill'});applied=true}}
  else{const target=ctx.choose(ctx.units('p').filter(x=>bossCardAttack(x.card)>0));if(target){ctx.buff(target.card,-1);applied=true}}
  if(applied)ctx.state.danceMode=(mode+1)%3;return applied;
 },
 '折光铠卫领誓·芮岚':ctx=>{
  const target=storyBossBest(ctx,ctx.units('p').filter(x=>x.index!==2||bossCardAttack(x.card)>0),x=>Math.abs(x.index-2));if(!target)return false;
  const delta=target.index<2?1:target.index>2?-1:0;
  if(delta&&ctx.move('p',target.card,delta))return true;
  if(target.card.a<=0)return false;ctx.buff(target.card,-1);return true;
 }
});
// 灯火轮回：每次只提交一个已满足条件的关卡主动技。
(()=>{
 const living=(ctx,side='e',predicate=()=>true)=>ctx.units(side).filter(x=>predicate(x.card,x.index));
 const pickBest=(ctx,list,score)=>{if(!list.length)return null;const values=list.map(x=>({x,score:score(x)})),best=Math.max(...values.map(x=>x.score));return ctx.choose(values.filter(x=>x.score===best).map(x=>x.x))};
 const attacker=(ctx)=>pickBest(ctx,living(ctx,'e',c=>bossCardAttack(c)>0&&!c.bossEffects?.skipAttack),x=>x.card.a*3+x.card.h*.2);
 const empty=(ctx,side='e')=>(side==='p'?ctx.G.p:ctx.G.e).map((card,index)=>card?-1:index).filter(index=>index>=0);
 const token=(n,a,h,extra={})=>({n,a,h,c:0,at:'物理',kind:'mob',token:true,lore:'Boss主动技能召唤的衍生物，不进入永久卡库或弃牌堆。',...extra});
 Object.assign(BOSS_SKILL_HANDLERS,{
  '砂镜铠卫领誓·莫安':ctx=>{const target=pickBest(ctx,living(ctx,'e',c=>bossCardAttack(c)>0&&!c.bossEffects?.skipAttack),x=>(ctx.G.p[x.index]&&ctx.hasSkill(ctx.G.p[x.index],'guard')?20:0)+x.card.a*2);if(!target)return false;ctx.effect(target.card,{pierce:true});return true},
  '砂镜潮纹游鱼领誓·依瑟':ctx=>{if(!ctx.G.eh.length||!empty(ctx).length)return false;if(!ctx.discardOne('e'))return false;return !!ctx.summon('e',token('风暴鳐',1,1,{s:'fly',at:'雷',tokenKind:'bird'}),{cannotSacrifice:true})},
  '苔庭绛纹蝶领誓·乌珀':ctx=>{const targets=living(ctx,'p');if(!ctx.G.eh.length||!targets.length)return false;const selected=[targets[0]];if(targets.length>1)selected.push(targets[targets.length-1]);if(!ctx.discardOne('e'))return false;for(const {card}of selected)ctx.hurt('p',card,1,null,{kind:'skill'});return true},
  '苔庭铠卫领誓·阿恩':ctx=>{const previous=ctx.state.lastCharge,target=pickBest(ctx,living(ctx,'e',c=>bossCardAttack(c)>0&&!c.bossEffects?.skipAttack&&!(previous?.card===c&&previous.turn===ctx.G.turn-1)),x=>x.card.a*3+x.card.h*.2);if(!target)return false;ctx.effect(target.card,{skipAttack:true});ctx.deferred(target.card,'charge',{delta:1,turn:ctx.G.turn+1});ctx.state.lastCharge={card:target.card,turn:ctx.G.turn};return true},
  '铜钟织光蛛领誓·阿温':ctx=>{const room=empty(ctx).length;if(!ctx.G.eh.length||!room)return false;if(!ctx.discardOne('e'))return false;let count=0;for(let i=0;i<Math.min(2,room);i++)if(ctx.summon('e',token('蛛巢小蜘蛛',0,1,{tokenKind:'spider'})))count++;return count>0},
  '铜钟铠卫领誓·乌温':ctx=>{if(!empty(ctx).length||!(ctx.G.discard?.e||[]).length)return false;if(!ctx.consumeDiscard('e'))return false;return !!ctx.summon('e',token('镜盾幻影',0,2,{s:'guard'}),{expiresTurn:ctx.G.turn,cannotSacrifice:true})},
  '炽砂铠卫领誓·依弥':ctx=>{const target=pickBest(ctx,living(ctx,'p',c=>bossCardAttack(c)>0),x=>x.card.a*2+(x.card.mv?2:0));if(!target)return false;ctx.effect(target.card,{lockMove:true,attackReduction:1});return true},
  '炽砂灯议长·米弥':ctx=>{if(!ctx.G.eh.length||!empty(ctx).length)return false;if(!ctx.discardOne('e'))return false;return !!ctx.summon('e',token('双剑残影',1,1,{at:'暗'}),{expiresTurn:ctx.G.turn,cannotSacrifice:true})},
  '暮潮星枝鹿领誓·莱尘':ctx=>{const target=pickBest(ctx,living(ctx,'e',c=>bossCardAttack(c)>0&&c.h<(c.h0??c.h)),x=>x.card.a*2+(x.card.h0-x.card.h));if(!target)return false;ctx.buff(target.card,1);ctx.effect(target.card,{healOnKill:1});return true},
  '暮潮灯议长·乌汀':ctx=>{const options=[];for(const unit of living(ctx,'e',c=>c.moved!==ctx.G.turn&&!c.bossEffects?.lockMove))for(const delta of [-1,1]){const other=ctx.G.e[unit.index+delta];if(!other||other.moved===ctx.G.turn||other.bossEffects?.lockMove)continue;const destination=ctx.G.p[unit.index+delta],source=ctx.G.p[unit.index];options.push({...unit,delta,score:unit.card.a*2+(destination?Math.min(unit.card.a,destination.h):unit.card.a)-(source?0:1)})}const selected=pickBest(ctx,options,x=>x.score);if(!selected||!ctx.move('e',selected.card,selected.delta,true))return false;ctx.shield(selected.card,1);return true},
  '霜枝潜印客领誓·图芙':ctx=>{const target=pickBest(ctx,living(ctx,'e',c=>!c.token&&!c.fod&&!c.bossWickOriginal),x=>(x.card.h0-x.card.h)*2+(x.card.dr||0)*2+(x.card.heal||0)-x.card.a*.4);if(!target)return false;const lane=target.index;if(!ctx.returnToHand('e',target.card))return false;return !!ctx.summon('e',token('幻蝶残像',0,1,{at:'魔'}),{lane,expiresTurn:ctx.G.turn,cannotSacrifice:true})},
  '霜枝铠卫领誓·芮芙':ctx=>{const target=attacker(ctx);if(!target)return false;ctx.effect(target.card,{extraDamage:1,extraElement:'雷',reflectParry:true});return true},
  '星铸灯议长·图烙':ctx=>{if(ctx.G.p.some(c=>c?.bossWickOriginal))return false;const target=ctx.choose(living(ctx,'p',c=>c.c<=2&&!c.fod&&!c.token&&c.n!=='余芯'&&c.n!=='碎灯偶'&&!(c.bossWickImmuneUntil>ctx.G.turn)));return !!target&&ctx.ash(target.card)},
  '星铸铠卫领誓·维玟':ctx=>{const target=attacker(ctx);if(!target)return false;ctx.effect(target.card,{healOnHit:1,heroHealOnHit:1});return true},
  '折光铠卫领誓·岑岚':ctx=>{const targets=living(ctx);if(targets.length<2)return false;let best=null;for(const fire of targets)for(const magic of targets){if(fire.card===magic.card)continue;const score=(ctx.G.p[fire.index]?.at==='血'||ctx.G.p[fire.index]?.at==='冰'?3:0)+(ctx.G.p[magic.index]?.at==='火'?3:0)+fire.card.a+magic.card.a;if(!best||score>best.score)best={fire,magic,score}}if(!best)return false;ctx.temp(best.fire.card,{at:'火'});ctx.temp(best.magic.card,{at:'魔'});return true},
  '折光灯议长·索岚':ctx=>{const spaces=empty(ctx,'p');if(ctx.state.fireSeed?.expiresTurn>=ctx.G.turn||!ctx.G.eh.length||!spaces.length)return false;const best=pickBest(ctx,spaces.map(index=>({index})),x=>(ctx.G.e[x.index]?.a||0)*2+(x.index===2?1:0));if(!ctx.discardOne('e'))return false;ctx.state.fireSeed={lane:best.index,expiresTurn:ctx.G.turn+1};return true}
 });
})();
// Deep Abyss campaign powers. Only a successful handler consumes the round's use.
function bossChallengeFighter(ctx){return ctx.units('e').filter(x=>bossCardAttack(x.card)>0&&!x.card.fod).sort((a,b)=>(b.card.a*2+b.card.h)-(a.card.a*2+a.card.h))[0]?.card||null}
function bossChallengeWickTargets(ctx){if(ctx.G.p.some(c=>c?.bossWickOriginal))return [];return ctx.units('p').filter(({card})=>!card.token&&!card.fod&&!card.bossWickOriginal&&!['余芯','碎灯偶'].includes(card.n)&&!(card.bossWickImmuneUntil>ctx.G.turn))}
Object.assign(BOSS_SKILL_HANDLERS,{
 '砂镜织光蛛领誓·阿瑟':ctx=>{const target=ctx.choose(ctx.units('p').filter(x=>!x.card.fod));if(!target)return false;ctx.effect(target.card,{lockMove:true,fireWeakness:1});return true},
 '砂镜灯议长·维瑟':ctx=>{const target=ctx.units('e').filter(x=>!x.card.fod).sort((a,b)=>b.card.h-a.card.h)[0];if(!target)return false;ctx.redirect(target.card,1);return true},
 '苔庭缄骨客领誓·米珀':ctx=>{if(!ctx.G.e.some(c=>!c))return false;const eligible=c=>!c.token&&!c.fod&&c.rarity!=='rare'&&c.c<=1;if(!(ctx.G.discard?.e||[]).some(eligible))return false;const corpse=ctx.consumeDiscard('e',eligible);if(!corpse)return false;return !!ctx.summon('e',{n:'骸骨仆从',a:1,h:1,c:0,at:'暗',lore:'归灯守卫消耗遗骸召来的苔庭悬灯缄骨客，须存活到下一回合才可献祭。'})},
 '苔庭裂角客领誓·伊恩':ctx=>{const target=ctx.choose(bossChallengeWickTargets(ctx));if(!target||!ctx.G.eh.length)return false;if(!ctx.discardOne('e'))return false;return ctx.ash(target.card)},
 '铜钟裂角客领誓·佩拉':ctx=>{const card=bossChallengeFighter(ctx);if(!card)return false;ctx.temp(card,{at:'火'});ctx.effect(card,{extraDamage:1,extraElement:'火',roundEndDamage:1});return true},
 '铜钟铠卫领誓·佩温':ctx=>{if(ctx.G.ehp>3)return false;const target=ctx.units('e').filter(x=>bossCardAttack(x.card)>0&&!x.card.fod&&!x.card.bossRaimeBlessed).sort((a,b)=>(b.card.a*2+b.card.h)-(a.card.a*2+a.card.h))[0];if(!target)return false;ctx.buff(target.card,1,true);target.card.at='暗';target.card.bossRaimeBlessed=true;return true},
 '炽砂铠卫领誓·芮弥':ctx=>{
  const fighter=bossChallengeFighter(ctx),options=[],last=ctx.state.lastSoulStance;
  if(fighter&&last!=='sword')options.push({kind:'sword',run:()=>{ctx.buff(fighter,1);return true}});
  const lancer=ctx.units('e').filter(x=>bossCardAttack(x.card)>0&&!ctx.hasSkill(x.card,'push')).sort((a,b)=>(b.card.a+b.card.h)-(a.card.a+a.card.h))[0]?.card;
  if(lancer&&last!=='spear')options.push({kind:'spear',run:()=>{ctx.effect(lancer,{skills:[...new Set([...(lancer.bossEffects?.skills||[]),'push'])]});return true}});
  const moves=[];for(const {card,index}of ctx.units('e'))if(card.moved!==ctx.G.turn&&!card.bossEffects?.lockMove)for(const delta of [-1,1])if(index+delta>=0&&index+delta<ctx.G.e.length&&!ctx.G.e[index+delta])moves.push({card,delta});
  if(moves.length&&last!=='curve')options.push({kind:'curve',run:()=>{const move=ctx.choose(moves);return ctx.move('e',move.card,move.delta)}});
  if(ctx.G.eh.length&&ctx.G.ed.length&&last!=='staff')options.push({kind:'staff',run:()=>{if(!ctx.discardOne('e'))return false;ctx.draw('e',1);return true}});
  const option=ctx.choose(options);if(!option||!option.run())return false;ctx.state.lastSoulStance=option.kind;return true;
 },
 '炽砂晶棘蜥龙领誓·雅罗':ctx=>{const targets=ctx.units('p').filter(x=>x.index>=1&&x.index<=3);if(!targets.length||!ctx.G.eh.length)return false;if(!ctx.discardOne('e'))return false;targets.forEach(({card})=>ctx.hurt('p',card,1,null,{kind:'skill',element:'暗'}));return true},
 '暮潮踏铃驹领誓·雅汀':ctx=>{const card=bossChallengeFighter(ctx);if(!card)return false;if(ctx.G.ehp>3){ctx.buff(card,1);ctx.effect(card,{selfDamage:1})}else{ctx.temp(card,{at:'魔'});ctx.shield(card,1)}return true},
 '暮潮灯议长·维汀':ctx=>{const card=bossChallengeFighter(ctx);if(!card||ctx.G.ehp<=1)return false;ctx.G.ehp--;logBattle('暮潮灯议长·维汀消耗1点生命，释放血焰');ctx.buff(card,1);ctx.effect(card,{extraDamage:1,extraElement:'火'});return true},
 '霜枝攀钟猿领誓·艾诺':ctx=>{const eligible=c=>!c.token&&!c.fod&&c.c<=2&&!c.bossApeRevived;if(!(ctx.G.discard?.e||[]).some(eligible))return false;const card=ctx.consumeDiscard('e',eligible);if(!card)return false;card.h=card.h0=1;card.poison=0;card.bossApeRevived=true;delete card.t;delete card.moved;ctx.G.eh.push(card);logBattle(`${card.n}断首再起，回到${ctx.owner==='p'?'我方':'敌方'}手牌；再次部署仅1血`);return true},
 '霜枝裂角客领誓·瑟诺':ctx=>{if(!ctx.state.enemyDeaths)return false;const target=ctx.choose(ctx.units('p'));if(!target)return false;ctx.hurt('p',target.card,1,null,{kind:'skill',element:'火'});return true},
 '星铸裂角客领誓·佩烙':ctx=>{const target=ctx.units('p').filter(x=>bossCardAttack(x.card)>0).sort((a,b)=>b.card.a-a.card.a)[0];if(!target)return false;ctx.effect(target.card,{lateAttack:true});return true},
 '星铸灯议长·诺玟':ctx=>{const target=ctx.units('e').filter(x=>!x.card.fod).sort((a,b)=>((b.card.poison||0)*10+b.card.a+b.card.h)-((a.card.poison||0)*10+a.card.a+a.card.h))[0];if(!target)return false;ctx.cleanse(target.card);ctx.shield(target.card,1);return true},
 '折光枝灯树灵领誓·希泽':ctx=>{if((ctx.state.treeSummons||0)>=3||ctx.G.e.some(c=>c?.bossTreeSpawn)||!ctx.G.e.some(c=>!c))return false;const card=ctx.summon('e',{n:'树影幼苗',a:0,h:1,c:0,at:'光',lore:'存活至下一次Boss部署时，成长为1攻2血的树影分身。'});if(!card)return false;card.bossTreeSpawn=true;ctx.state.treeSummons=(ctx.state.treeSummons||0)+1;ctx.deferred(card,'grow',{a:1,h:2,turn:ctx.G.turn+1,name:'树影分身'});return true},
 '折光晶棘蜥龙领誓·莱岚':ctx=>{const card=bossChallengeFighter(ctx);if(!card||!ctx.G.eh.length)return false;if(!ctx.discardOne('e'))return false;ctx.buff(card,1);ctx.effect(card,{skills:[...new Set([...(card.bossEffects?.skills||[]),'fly'])],selfDamage:1});return true}
});
// Six worlds: encounter powers use the shared temporary-effect / discard lifecycle.
// Helpers deliberately choose from live cards and return false before paying any cost.
(()=>{
 const units=(ctx,side='e',filter=()=>true)=>ctx.units(side).filter(x=>filter(x.card,x.index));
 const best=(ctx,list,score=x=>x.card.a*2+x.card.h)=>{if(!list.length)return null;const n=Math.max(...list.map(score));return ctx.choose(list.filter(x=>score(x)===n))};
 const friend=(ctx,filter=()=>true)=>best(ctx,units(ctx,'e',(c,i)=>!c.fod&&filter(c,i)));
 const foe=(ctx,filter=()=>true,score=x=>x.card.a*2+x.card.h)=>best(ctx,units(ctx,'p',filter),score);
 const wounded=(ctx)=>friend(ctx,c=>c.h<(c.h0??c.h));
 const free=ctx=>ctx.G.e.some(c=>!c);
 const discard=(ctx)=>!!ctx.discardOne('e');
 const extra=(ctx,c,at)=>{ctx.effect(c,{extraDamage:1,extraElement:at,...(at==='雷'?{reflectParry:true}:{})});return true};
 const skill=(ctx,c,s)=>ctx.effect(c,{skills:[...new Set([...(c.bossEffects?.skills||[]),s])]});
 const token=(n,a,h,more={})=>({n,a,h,c:0,at:'物理',kind:'mob',token:true,lore:'Boss技能召唤的衍生物，不进入永久卡库。',...more});
 const moves=(ctx,side='e')=>{const board=side==='e'?ctx.G.e:ctx.G.p,out=[];for(const u of units(ctx,side,c=>c.moved!==ctx.G.turn&&!c.bossEffects?.lockMove))for(const delta of [-1,1])if(u.index+delta>=0&&u.index+delta<board.length&&!board[u.index+delta])out.push({...u,delta,to:u.index+delta});return out};
 const moveBest=(ctx,side='e')=>best(ctx,moves(ctx,side),u=>{const opposing=(side==='e'?ctx.G.p:ctx.G.e)[u.to];return (opposing?Math.min(u.card.a,opposing.h)+opposing.a: u.card.a)+u.card.h*.1});
 const ashTargets=ctx=>ctx.G.p.some(c=>c?.bossWickOriginal)?[]:units(ctx,'p',c=>!bossIsToken(c)&&!(c.bossWickImmuneUntil>ctx.G.turn));
 const safeOffering=(ctx,sacrifice,target,{heal=1,at=null}={})=>{if(ctx.owner==='p')return true;if(typeof ctx.forecast!=='function')return !ctx.G.p[sacrifice.index];const before=ctx.forecast(),saved=ctx.G.e[sacrifice.index],a=target.card.a,h=target.card.h,oldAt=target.card.at;try{ctx.G.e[sacrifice.index]=null;target.card.a++;target.card.h=Math.min(target.card.h0??target.card.h,target.card.h+heal);if(at)target.card.at=at;const after=ctx.forecast();return !(after.ehp<=0&&before.ehp>0)&&after.score>before.score+.05}finally{ctx.G.e[sacrifice.index]=saved;target.card.a=a;target.card.h=h;target.card.at=oldAt}};
 const recallChoice=ctx=>{if(ctx.owner==='p')return best(ctx,units(ctx,'e',c=>!bossIsToken(c)),u=>Math.max(0,(u.card.h0??u.card.h)-u.card.h)*2+(u.card.dr||0)*2+(u.card.heal||0)-u.card.a*.4);const forecast=typeof ctx.forecast==='function',before=forecast?ctx.forecast():null,options=[];for(const u of units(ctx,'e',c=>!bossIsToken(c))){const c=u.card,missing=Math.max(0,(c.h0??c.h)-c.h),resources=(c.dr||0)+(c.heal||0)+(c.x==='ember'?1:0),doomed=!!before&&!before.e.some(x=>x?.origin===c);if((!missing&&!doomed)||(!missing&&!resources))continue;if(!forecast){if(!ctx.G.p[u.index]&&(missing>=2||resources>0)&&c.a<=1)options.push({...u,score:missing+resources});continue}const saved=ctx.G.e[u.index];let after;try{ctx.G.e[u.index]={...token('幻蝶残像',0,1,{at:'魔'}),h0:1,a0:0,t:ctx.G.turn,bossNoSacrifice:true,bossExpiresTurn:ctx.G.turn};after=ctx.forecast()}finally{ctx.G.e[u.index]=saved}if(after.ehp<=0&&before.ehp>0||before.hp<=0&&after.hp>0)continue;const salvage=missing*.65+resources*.8+(doomed?(c.a*1.8+(c.h0??c.h)*.55)*.65:0)-c.c*.25,gain=after.score-before.score+salvage;if(gain>.15)options.push({...u,score:gain})}return best(ctx,options,x=>x.score)};
 const revive=(ctx,mark)=>{const eligible=c=>!bossIsToken(c)&&c.c<=2&&!c[mark];if(!(ctx.G.discard?.e||[]).some(eligible))return false;const c=ctx.consumeDiscard('e',eligible);if(!c)return false;c.h=c.h0=1;c.poison=0;c[mark]=true;delete c.t;delete c.moved;ctx.G.eh.push(c);return true};
 Object.assign(BOSS_SKILL_HANDLERS,{
  // The first pact: a route through the old lantern roads.
  '苔庭铠卫·雅恩':ctx=>{const u=wounded(ctx);if(!u)return false;ctx.healCard(u.card,1);ctx.shield(u.card,1);return true},
  '苔庭赤角兽领誓·艾珀':ctx=>{const u=best(ctx,units(ctx,'e',c=>bossCardAttack(c)>0).filter(x=>ctx.G.p[x.index]),x=>ctx.G.p[x.index].h);if(!u)return false;ctx.hurt('p',ctx.G.p[u.index],1,u.card,{kind:'skill'});return true},
  '苔庭裂角客领誓·欧珀':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0&&!ctx.hasSkill(c,'fly'));if(!u)return false;skill(ctx,u.card,'fly');ctx.temp(u.card,{at:'火'});return true},
  '苔庭潜印客·莫恩':ctx=>{const u=ctx.choose(units(ctx,'p',c=>bossCardAttack(c)>0));if(!u)return false;const options=moves(ctx,'p').filter(x=>x.card===u.card),move=ctx.choose(options);if(move&&ctx.move('p',u.card,move.delta))return true;ctx.buff(u.card,-1);return true},
  '苔庭铠卫·欧恩':ctx=>{const u=wounded(ctx);if(!u)return false;ctx.healCard(u.card,1);ctx.temp(u.card,{at:'光'});return true},
  '苔庭织光蛛领誓·雅珀':ctx=>{const lanes=ctx.G.p.map((c,i)=>c?-1:i).filter(i=>i>=0);if(!lanes.length||!ctx.G.eh.length||ctx.state.fireSeed?.expiresTurn>=ctx.G.turn)return false;const lane=best(ctx,lanes.map(index=>({index})),u=>(ctx.G.e[u.index]?.a||0)*2);if(!discard(ctx))return false;ctx.state.fireSeed={lane:lane.index,expiresTurn:ctx.G.turn+1};return true},
  '苔庭峰脊巨灵领誓·瑟珀':ctx=>{const u=foe(ctx,c=>bossCardAttack(c)>0,x=>x.card.h);if(!u)return false;ctx.effect(u.card,{lockMove:true,attackReduction:1});return true},
  '苔庭铠卫领誓·维珀':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0);if(!u)return false;ctx.temp(u.card,{at:'雷'});return extra(ctx,u.card,'雷')},
  '苔庭铠卫领誓·希珀':ctx=>{const u=foe(ctx,()=>true,x=>Math.min(x.index,ctx.G.p.length-1-x.index));if(!u)return false;ctx.hurt('p',u.card,1,null,{kind:'skill'});return true},
  '苔庭晶棘蜥龙领誓·艾恩':ctx=>{const u=foe(ctx,c=>bossCardAttack(c)>0);if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.buff(u.card,-1);ctx.effect(u.card,{fireWeakness:1});return true},
  // Brassbell Citadel: corpses, curses and the cost of desiring another throne.
  '铜钟峰脊巨灵领誓·维拉':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0&&c.h>1);if(!u)return false;ctx.buff(u.card,1);ctx.effect(u.card,{selfDamage:1});return true},
  '铜钟峰脊巨灵领誓·岚拉':ctx=>{if(!free(ctx)||!ctx.G.eh.length)return false;if(!discard(ctx))return false;return !!ctx.summon('e',token('执行者盾影',0,2,{s:'guard'}),{cannotSacrifice:true,expiresTurn:ctx.G.turn})},
  '铜钟灯议长·莱拉':ctx=>{const u=friend(ctx);if(!u)return false;ctx.temp(u.card,{at:'暗'});ctx.shield(u.card,1);return true},
  '铜钟缄骨客领誓·岑拉':ctx=>{if(!free(ctx)||!(ctx.G.discard?.e||[]).length)return false;if(!ctx.consumeDiscard('e'))return false;return !!ctx.summon('e',token('骸骨车轮',1,1,{mv:'push',at:'暗'}),{cannotSacrifice:true})},
  '铜钟环藤蛇领誓·伦拉':ctx=>{const u=foe(ctx,c=>!c.poison);if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;u.card.poison=1;ctx.healHero('e',1);return true},
  '铜钟裂角客领誓·泽拉':ctx=>{const targets=units(ctx,'p',(_,i)=>i>=1&&i<=3);if(!targets.length||!ctx.G.eh.length)return false;if(!discard(ctx))return false;for(const u of targets)ctx.hurt('p',u.card,1,null,{kind:'skill',element:'火'});return true},
  '铜钟缄骨客领誓·欧温':ctx=>{const u=wounded(ctx);if(!u||!(ctx.G.discard?.e||[]).length)return false;if(!ctx.consumeDiscard('e'))return false;return ctx.healCard(u.card,2)>0},
  '铜钟缄骨客领誓·洛温':ctx=>{const u=ctx.choose(ashTargets(ctx));if(!u||!(ctx.G.discard?.e||[]).length)return false;if(!ctx.consumeDiscard('e'))return false;return ctx.ash(u.card)},
  '铜钟枝灯树灵领誓·诺温':ctx=>{const u=friend(ctx);if(!u)return false;ctx.temp(u.card,{at:ctx.G.ehp>3?'火':'魔'});if(ctx.G.ehp>3)ctx.shield(u.card,1);else extra(ctx,u.card,'魔');return true},
  '铜钟铠卫领誓·泽温':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0);if(!u||!ctx.G.p[u.index]||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.effect(u.card,{pierce:true});ctx.effect(ctx.G.p[u.index],{lateAttack:true});return true},
  // Cinderglass Foundry: the last embers need no needless sacrifice of a winning board.
  '炽砂铠卫领誓·乌弥':ctx=>{const u=moveBest(ctx);if(!u||!ctx.move('e',u.card,u.delta))return false;skill(ctx,u.card,'push');return true},
  '炽砂灯议长·诺弥':ctx=>{if(!free(ctx)||!ctx.G.eh.length)return false;if(!discard(ctx))return false;return !!ctx.summon('e',token('结晶分身',1,1,{at:'魔'}),{cannotSacrifice:true,expiresTurn:ctx.G.turn})},
  '炽砂灯议长·瑟弥':ctx=>{if(units(ctx).length<3||ctx.G.ehp>=7)return false;return ctx.healHero('e',1)>0},
  '炽砂缄骨客领誓·希弥':ctx=>{const targets=units(ctx,'p');if(targets.length<3||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.hurt('p',targets[0].card,1,null,{kind:'skill',element:'暗'});ctx.hurt('p',targets[targets.length-1].card,1,null,{kind:'skill',element:'暗'});return true},
  '炽砂峰脊巨灵领誓·索弥':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0&&c.h>1),t=foe(ctx,()=>true,x=>x.card.h);if(!u||!t||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.buff(u.card,1);ctx.effect(u.card,{selfDamage:1});ctx.hurt('p',t.card,1,u.card,{kind:'skill'});return true},
  '炽砂铠卫领誓·莱弥':ctx=>{const u=moveBest(ctx);if(!u||!ctx.move('e',u.card,u.delta))return false;ctx.temp(u.card,{at:'火'});return extra(ctx,u.card,'火')},
  '炽砂铠卫领誓·莫弥':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0);if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.shield(u.card,1);return extra(ctx,u.card,'雷')},
  '炽砂灯议长·伦弥':ctx=>revive(ctx,'bossTwinRevived'),
  '炽砂灯议长·图弥':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0);if(!u)return false;skill(ctx,u.card,'fly');ctx.temp(u.card,{at:'雷'});return true},
  '炽砂灯议长·伊罗':ctx=>{const phase=ctx.state.friedePhase||0;if(phase===0){const u=foe(ctx,c=>bossCardAttack(c)>0);if(!u)return false;ctx.buff(u.card,-1)}else if(phase===1){const u=friend(ctx,c=>bossCardAttack(c)>0);if(!u)return false;ctx.temp(u.card,{at:'火'});extra(ctx,u.card,'火')}else if(!revive(ctx,'bossFriedeRevived'))return false;ctx.state.friedePhase=(phase+1)%3;return true},
  // Dusk-Tide Harbor: healing has conditions; summons and discarded corpses cannot multiply forever.
  '暮潮裂角客领誓·莫尘':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0&&c.h<(c.h0??c.h));if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;skill(ctx,u.card,'vamp');skill(ctx,u.card,'poison');return true},
  '暮潮星枝鹿领誓·伦尘':ctx=>{const u=wounded(ctx);if(!u)return false;ctx.healCard(u.card,1);ctx.healHero('e',1);return true},
  '暮潮灯议长·佩尘':ctx=>{if(!free(ctx)||!(ctx.G.discard?.e||[]).length)return false;if(!ctx.consumeDiscard('e'))return false;return !!ctx.summon('e',token('墓地伏影',0,2,{s:'guard',at:'暗'}),{cannotSacrifice:true,expiresTurn:ctx.G.turn})},
  '暮潮潜印客领誓·泽尘':ctx=>{if(!free(ctx)||!ctx.G.eh.length)return false;if(!discard(ctx))return false;return !!ctx.summon('e',token('禁忌蛇影',1,1,{s:'poison',at:'血'}),{cannotSacrifice:true,expiresTurn:ctx.G.turn})},
  '暮潮织光蛛领誓·图尘':ctx=>{const u=best(ctx,units(ctx),x=>x.card.h-x.card.a*2);if(!u)return false;ctx.shield(u.card,2);ctx.effect(u.card,{skipAttack:true});return true},
  '暮潮缄骨客领誓·阿汀':ctx=>{if(!ctx.state.enemyDeaths)return false;const u=foe(ctx,()=>true,x=>-x.card.h);if(!u)return false;ctx.hurt('p',u.card,1,null,{kind:'skill'});return true},
  '暮潮灯议长·艾汀':ctx=>{const u=foe(ctx,()=>true,x=>x.card.c*3+x.card.a);if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.hurt('p',u.card,1,null,{kind:'skill',element:'魔'});ctx.draw('e',1);return true},
  '暮潮浮辉使领誓·塔尘':ctx=>{const u=friend(ctx),t=foe(ctx,c=>bossCardAttack(c)>0);if(!u||!t||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.shield(u.card,1);ctx.effect(t.card,{lateAttack:true});return true},
  '暮潮折面星客领誓·依汀':ctx=>{if(!ctx.state.enemyDirectDamage)return false;const u=foe(ctx,c=>!c.fod);if(!u)return false;ctx.hurt('p',u.card,1,null,{kind:'skill',element:'血'});ctx.healHero('e',1);return true},
  '暮潮星枝鹿领誓·诺汀':ctx=>{if(ctx.G.ehp>3){const u=friend(ctx,c=>bossCardAttack(c)>0&&c.h>1);if(!u)return false;ctx.temp(u.card,{at:'火'});ctx.buff(u.card,1);ctx.effect(u.card,{selfDamage:1});return true}const u=ctx.choose(units(ctx,'p'));if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.hurt('p',u.card,1,null,{kind:'skill',element:'火'});return true},
  // Frostbough March: posture, deception and a limited return from death.
  '霜枝铜缄裂角客':ctx=>{const options=moves(ctx,'p').filter(u=>ctx.G.e[u.to]),u=best(ctx,options,x=>ctx.G.e[x.to].a+x.card.a);if(!u||!ctx.move('p',u.card,u.delta))return false;ctx.hurt('p',u.card,1,null,{kind:'skill'});return true},
  '霜枝苔痕赤角兽':ctx=>{const u=moveBest(ctx);if(!u||u.card.h<=1||!ctx.move('e',u.card,u.delta))return false;ctx.temp(u.card,{at:'火'});ctx.buff(u.card,1);ctx.effect(u.card,{selfDamage:1});return true},
  '霜枝攀钟猿领誓·阿诺':ctx=>{const target=ctx.choose(ctx.G.hand.filter(c=>c.c>0&&frozenTurns(c)===0&&!(c.bossFreezeImmuneUntil>ctx.G.turn)));if(!target)return false;target.bossFrozenUntil=ctx.lockUntil();return true},
  '霜枝攀钟猿领誓·伊诺':ctx=>{if(!free(ctx)||!(ctx.G.discard?.e||[]).length)return false;if(!ctx.consumeDiscard('e'))return false;return !!ctx.summon('e',token('猿伴残影',1,1,{mv:'push'}),{cannotSacrifice:true,expiresTurn:ctx.G.turn})},
  '霜枝灯议长·欧诺':ctx=>{const u=friend(ctx);if(!u)return false;ctx.temp(u.card,{at:'魔'});ctx.shield(u.card,1);return true},
  '霜枝潜印客领誓·依诺':ctx=>{const u=foe(ctx,c=>!c.poison);if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;u.card.poison=1;ctx.effect(u.card,{lockMove:true});return true},
  '霜枝灯议长·乌诺':ctx=>{const u=wounded(ctx);if(!u||!(ctx.G.discard?.e||[]).length)return false;if(!ctx.consumeDiscard('e'))return false;ctx.healCard(u.card,2);if(!u.card.bossMonkBlessed){ctx.buff(u.card,1,true);u.card.bossMonkBlessed=true}return true},
  '霜枝晶棘蜥龙领誓·维诺':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0);if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.temp(u.card,{at:'雷'});ctx.effect(u.card,{parryOnce:true});return true},
  '霜枝灯议长·希诺':ctx=>{const u=best(ctx,units(ctx),x=>-x.card.h);if(!u||ctx.G.ehp>3)return false;ctx.healHero('e',1);ctx.shield(u.card,1);return true},
  '霜枝潜印客领誓·雅诺':ctx=>{const u=friend(ctx),t=foe(ctx,c=>bossCardAttack(c)>0);if(!u||!t||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.effect(t.card,{lateAttack:true,attackReduction:1});return true},
  // Starforged Expanse: the final world pays for its strongest combinations.
  '星铸铠卫领誓·洛玟':ctx=>{const u=friend(ctx);if(!u)return false;skill(ctx,u.card,'guard');ctx.shield(u.card,1);return true},
  '星铸巡影狼领誓·阿霖':ctx=>{const u=moveBest(ctx);if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;if(!ctx.move('e',u.card,u.delta))return false;ctx.temp(u.card,{at:'魔'});return extra(ctx,u.card,'魔')},
  '星铸铠卫领誓·芮烙':ctx=>{const u=foe(ctx,c=>bossCardAttack(c)>0||c.moved!==ctx.G.turn,x=>Math.abs(x.index-2));if(!u)return false;const delta=Math.sign(2-u.index);if(delta&&ctx.move('p',u.card,delta)){ctx.effect(u.card,{lockMove:true});return true}if(u.card.a<=0)return false;ctx.buff(u.card,-1);return true},
  '星铸铠卫领誓·米玟':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0);if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.shield(u.card,1);ctx.temp(u.card,{at:'雷'});return extra(ctx,u.card,'雷')},
  '星铸裂角客领誓·伊玟':ctx=>{const u=foe(ctx,c=>bossCardAttack(c)>0&&!c.poison);if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;u.card.poison=1;ctx.effect(u.card,{lateAttack:true});return true},
  '星铸环藤蛇领誓·阿玟':ctx=>{const u=wounded(ctx);if(!u||!(ctx.G.discard?.e||[]).length)return false;if(!ctx.consumeDiscard('e'))return false;ctx.healCard(u.card,1);ctx.healHero('e',1);return true},
  '星铸裂角客领誓·艾玟':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0);if(!u||ctx.G.ehp<=1)return false;ctx.G.ehp--;ctx.buff(u.card,1);ctx.effect(u.card,{healOnHit:1});return true},
  '星铸峰脊巨灵领誓·欧玟':ctx=>{const u=friend(ctx,c=>bossCardAttack(c)>0),t=foe(ctx,()=>true,x=>x.card.h);if(!u||!t||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.temp(u.card,{at:'火'});ctx.hurt('p',t.card,1,u.card,{kind:'skill',element:'火'});return true},
  '星铸巡影狼领誓·乌玟':ctx=>{const u=foe(ctx,c=>!c.poison,x=>-x.card.h);if(!u||!ctx.G.eh.length)return false;if(!discard(ctx))return false;ctx.hurt('p',u.card,1,null,{kind:'skill',element:'暗'});if(ctx.G.p.includes(u.card))u.card.poison=1;return true},
  '星铸灯议长·雅玟':ctx=>{const targets=units(ctx,'p');if(!targets.length||!ctx.G.eh.length)return false;if(!discard(ctx))return false;const selected=[targets[0]];if(targets.length>1)selected.push(targets[targets.length-1]);for(const u of selected){ctx.effect(u.card,{lockMove:true});ctx.hurt('p',u.card,1,null,{kind:'skill'})}return true},
  // These powers share the deployment AI's rule: keep a winning board and a life-saving blocker.
  '苔庭灯议长·图珀':ctx=>{const ashes=units(ctx,'e',c=>c.n==='余芯'&&(c.t||0)<ctx.G.turn&&!c.bossNoSacrifice),options=[];for(const ash of ashes)for(const target of units(ctx,'e',c=>c!==ash.card&&bossCardAttack(c)>0))if(safeOffering(ctx,ash,target,{heal:0,at:'火'}))options.push({ash,target,score:target.card.a*2+target.card.h});const choice=best(ctx,options,x=>x.score);if(!choice)return false;ctx.kill('e',choice.ash.index,null,'sacrifice');ctx.buff(choice.target.card,1);ctx.temp(choice.target.card,{at:'火'});return true},
  '霜枝潜印客领誓·图芙':ctx=>{const target=recallChoice(ctx);if(!target)return false;const lane=target.index;if(!ctx.returnToHand('e',target.card))return false;return !!ctx.summon('e',token('幻蝶残像',0,1,{at:'魔'}),{lane,cannotSacrifice:true,expiresTurn:ctx.G.turn})},
  '炽砂铠卫领誓·维弥':ctx=>{const sacrifices=units(ctx,'e',c=>c.a===0&&c.h===1&&(c.fod||c.n==='余芯'||(!c.s&&!c.x&&!c.mv&&!c.dr&&!c.heal&&!c.death))&&(c.t||0)<ctx.G.turn&&!c.bossNoSacrifice);const target=friend(ctx,c=>bossCardAttack(c)>0);if(!target||!sacrifices.length)return false;const sacrifice=ctx.choose(sacrifices.filter(s=>safeOffering(ctx,s,target)));if(!sacrifice)return false;ctx.kill('e',sacrifice.index,null,'sacrifice');ctx.buff(target.card,1);ctx.healCard(target.card,1);return true}
 });
})();
// Explain temporary Boss effects without changing any printed card template.
function bossCardStatusRows(c){
 const rows=[],effects=c?.bossEffects||{};
 if(c?.bossWickOriginal)rows.push(['余芯封印','原卡为'+c.bossWickOriginal.n+'。暂时成为0攻1血余芯，失去原技能；覆盖下一次完整行动后恢复。被击杀或献祭则不恢复，也不触发原卡亡语。']);
 if(effects.shield>0)rows.push(['护盾'+effects.shield,'下一次受到攻击或伤害时，最多抵消'+effects.shield+'点伤害，随后整个护盾消失；该次攻击被守护或弹反挡住时仍消耗护盾。未触发则本轮结束失效。']);
 if(effects.parryOnce)rows.push(['见切反击','本轮第一次受到卡牌攻击时减伤1，并对攻击者反伤1。']);
 if(effects.pierce)rows.push(['贯盾','本轮首次攻击卡牌时无视守护减伤。']);
 if(effects.skipAttack)rows.push(['蓄势','本轮不能攻击，若存活到下一轮可获得蓄势加攻。']);
 if(effects.lockMove)rows.push(['禁移','本轮不能移动或换位。']);
 if(effects.attackReduction)rows.push(['冻伤','本轮第一次攻击造成的伤害减少'+effects.attackReduction+'。']);
 if(effects.fireWeakness)rows.push(['焦油易燃','本轮首次受到火属性攻击时额外受到'+effects.fireWeakness+'点伤害。']);
 if(effects.lateAttack)rows.push(['迟击','本轮在所有其他卡牌之后攻击，仍然只攻击一次。']);
 if(effects.extraDamage>0)rows.push(['附加'+(effects.extraElement||'')+'伤','本轮首次攻击卡牌时额外造成'+effects.extraDamage+'点'+(effects.extraElement||'')+'伤害。']);
 if(effects.healOnHit||effects.heroHealOnHit)rows.push(['猩红汲取','本轮首次对卡牌实际造成伤害后回复自身与Boss生命，直击不触发。']);
 if(effects.healOnKill)rows.push(['狂怒汲血','本轮击杀敌卡后回复自身生命。']);
 if(effects.selfDamage)rows.push(['攻击反噬','攻击结束后自身受到'+effects.selfDamage+'点伤害。']);
 if(effects.roundEndDamage)rows.push(['熔炉反噬','本轮结束时自身受到'+effects.roundEndDamage+'点伤害。']);
 for(const skill of effects.skills||[])if(skill!==c.s&&skill!==c.mv)rows.push([SG[skill]||MOVE_LABEL[skill]||skill,SGS[skill]||MOVE_HELP[skill]||'Boss赋予的本轮临时能力。']);
 if(c?.bossExpiresTurn!=null)rows.push(['短暂幻影','本轮结束后消散，不触发死亡与亡语，不进入弃牌堆。']);
 if(c?.bossNoSacrifice)rows.push(['不可献祭','此Boss衍生物不能作为召唤祭品。']);
 return rows;
}
function bossCardStatusHTML(c){return bossCardStatusRows(c).slice(0,3).map(([name])=>`<span class="sk boss-effect-sigil">${esc(name)}</span>`).join('')}
function bossDiscardHTML(){
 if(!G)return '<p>进入战斗后可查看双方弃牌堆。</p>';
 const piles=G.discard||{p:[],e:[]};
 return `<p>主动弃手牌不触发亡语、死亡抽牌或复燃。死亡的非衍生卡进入弃牌堆，回收时移走原牌；余芯、骨与衍生物不进入。</p>${['p','e'].map(side=>`<section class="discard-pile"><h3>${side==='p'?'我方':'敌方'}弃牌 · ${(piles[side]||[]).length}张</h3><div class="discard-card-list">${(piles[side]||[]).map(c=>`<article>${cardHTML({...c,h:Math.max(1,c.h0||c.h)})}<p>${esc(c.n)}</p></article>`).join('')||'<p>暂时没有弃牌。</p>'}</div></section>`).join('')}`;
}

__PORTRAIT_SOURCE__
// Each encounter draws from its own named retainers, with a playable sacrifice curve.
// The recipe contains normal templates only: portraits, stats and card skills stay unchanged.
function bossDeckProfile(st){
 if(!st||typeof BOSS_DECKS!=='object')return null;
 const profile=BOSS_DECKS[st.boss];
 return profile&&st.games?.includes(profile.game)?profile:null;
}
function bossDeckTagMatches(card,tag){
 if(!card)return false;
 if(tag==='low')return card.c<=1;
 if(tag==='swarm')return card.c<=1||card.dd>0||card.death==='spiders';
 if(tag==='guard')return card.s==='guard'||card.h>=3;
 if(tag==='heal')return card.heal>0||card.s==='regen'||card.s==='vamp'||card.h>=3;
 if(tag==='death')return card.dd>0||card.s==='bones'||card.x==='rekindle'||!!card.death||card.c<=1;
 if(tag==='discard')return card.dr>0||card.dd>0||card.c<=1;
 if(tag==='draw')return card.dr>0||card.dd>0||card.death==='draw';
 if(tag==='move')return !!card.mv||card.s==='fly';
 if(tag==='poison')return card.at==='毒'||card.s==='poison';
 if(tag==='fire')return card.at==='火'||card.x==='ember';
 if(tag==='magic')return card.at==='魔'||card.dr>0;
 if(tag==='dark')return card.at==='暗'||card.x==='soul';
 if(tag==='light'||tag==='holy')return card.at==='光'||card.heal>0;
 if(tag==='lightning')return card.at==='雷';
 if(tag==='blood')return card.at==='血'||card.s==='vamp';
 if(tag==='ice')return card.at==='冰';
 if(tag==='parry')return card.s==='parry';
 if(tag==='fly')return card.s==='fly';
 if(tag==='growth')return !!card.growth||card.x==='soul';
 if(tag==='attack')return card.a>0;
 return false;
}
function bossStageDeck(st){
 const profile=bossDeckProfile(st);if(!profile)return null;
 const byName=new Map(POOL.filter(c=>c.rarity!=='rare'&&!c.token&&!c.identity&&c.game===profile.game).map(c=>[c.n,c]));
 const signature=byName.get(st.boss);if(!signature)return null;
 const names=[...new Set([st.boss,...profile.companions])],candidates=names.map(name=>byName.get(name)).filter(Boolean);
 const tier=Math.max(1,Math.min(3,st.tier||1)),wanted=14+tier*2;
 const capacity=candidates.reduce((sum,c)=>sum+(c.n===st.boss?1:2),0),total=Math.min(wanted,capacity);
 const list=[signature],copies=new Map([[signature.n,1]]),focus=profile.focus||[];
 const available=c=>copies.get(c.n)<(c.n===st.boss?1:2)||!copies.has(c.n);
 const count=predicate=>list.filter(predicate).length;
 function addMatching(predicate){
  const choices=candidates.filter(c=>available(c)&&predicate(c));if(!choices.length)return false;
  // Introduce different named companions before repeating one; then favor the
  // active power's resources. RNG changes draws within this Boss's theme only.
  const ranked=choices.map(c=>({card:c,score:(copies.has(c.n)?0:20)+focus.reduce((n,tag)=>n+(bossDeckTagMatches(c,tag)?1:0),0)+Math.random()*.8})).sort((a,b)=>b.score-a.score);
  const card=ranked[0].card;list.push(card);copies.set(card.n,(copies.get(card.n)||0)+1);return true;
 }
 const cheapTarget=Math.ceil(total*.55),midTarget=tier===1?4:tier===2?5:6,highMax=tier===1?2:3;
 while(count(c=>c.c<=1)<cheapTarget&&list.length<total&&addMatching(c=>c.c<=1)){}
 while(count(c=>c.c===2)<midTarget&&list.length<total&&addMatching(c=>c.c===2)){}
 // Expensive support is optional. A regional squad is preferable to inserting
 // unrelated Bosses merely to fill a three-cost quota.
 while(list.length<total&&addMatching(c=>c.c<3||count(x=>x.c===3)<highMax)){}
 return list.map(c=>c.n);
}
// 五格 · 轮换先手 · 统一进场/死亡结算
const GAME_META={"mire":["苔雾荒庭","k","魂"],"brass":["铜钟堡垒","k","魂"],"cinder":["炽砂熔城","k","魂"],"tide":["暮潮港湾","h","血"],"frost":["霜枝高地","s","狼"],"astral":["星铸天穹","r","环"],"vault":["砂镜地窟","d","魂"],"rift":["折光边境","r","环"]};
const KIND_LABEL={mob:'小怪',elite:'精英',boss:'Boss',npc:'NPC',identity:'死亡身份'};
const RULES={"mire":{"name":"苔雾荒庭","heal":3,"bonus":0},"brass":{"name":"铜钟堡垒","heal":3,"bonus":0},"cinder":{"name":"炽砂熔城","heal":2,"bonus":0},"tide":{"name":"暮潮港湾","heal":2,"bonus":0},"frost":{"name":"霜枝高地","heal":1,"bonus":1},"astral":{"name":"星铸天穹","heal":1,"bonus":1}};
const DIFFICULTY_ORDER=['mire','brass','cinder','tide','frost','astral'];
const JOURNEY_STORAGE='lo_journey_progress_v1';
let journey={cleared:0,unlocked:0,loops:0};
try{const saved=JSON.parse(localStorage.getItem(JOURNEY_STORAGE)||'null');if(saved&&Number.isInteger(saved.cleared)&&saved.cleared>=0&&saved.cleared<=DIFFICULTY_ORDER.length)journey={cleared:saved.cleared,unlocked:Math.min(6,Math.max(saved.cleared,Number.isInteger(saved.unlocked)?saved.unlocked:0)),loops:Number.isSafeInteger(saved.loops)&&saved.loops>=0?saved.loops:0}}catch{}
function activeDifficulty(){return DIFFICULTY_ORDER[Math.min(journey.cleared,DIFFICULTY_ORDER.length-1)]}
let difficulty=activeDifficulty(),catalogGame='all',catalogKind='all',catalogRarity='all',catalogSearch='',catalogPage=0,returnOV='title',customDeck=[];
try{customDeck=JSON.parse(localStorage.getItem('lo_custom_deck')||'[]')}catch{}
if(!Array.isArray(customDeck))customDeck=[];else customDeck=customDeck.map(canonicalCardName);
function completeDifficulty(){
 const index=DIFFICULTY_ORDER.indexOf(difficulty);
 if(!G||G.tutorial||G.lv!==STG.length||G.wins<STG.length)return;
 identityCompleteCampaign();saveCampaignCarry();
 if(G.tierRecorded||index!==journey.cleared)return;
 G.tierRecorded=true;journey.cleared=Math.min(DIFFICULTY_ORDER.length,journey.cleared+1);journey.unlocked=Math.max(journey.unlocked||0,journey.cleared);
 storeJourney();
}
function journeyHTML(){
 const complete=journey.cleared===DIFFICULTY_ORDER.length;
 const note=complete?storyCopy('loop','notice'):(gameLanguage==='en'?`Current site: ${storyWorldName(activeDifficulty())}. Complete all 16 encounters to open the next file.`:`当前现场：${storyWorldName(activeDifficulty())}。完成16场问询，寻找下一份案卷。`);
 return `<div class="journey-panel"><div class="journey-label">${gameLanguage==='en'?'Six sites · 96 witnesses':'六处现场 · 96位知情人'} · ${esc(storyCopy('loop','countLabel',{loop:(journey.loops||0)+1}))}</div><ol class="journey-steps" aria-label="旅途进度">${DIFFICULTY_ORDER.map((key,index)=>`<li class="${index<journey.cleared?'complete':key===activeDifficulty()?'current':'locked'}" ${index===journey.cleared?'aria-current="step"':''}><span class="journey-number">${index<journey.cleared?'✓':index+1}</span><b data-realm-short="${key}">${esc(storyWorldName(key))}</b><small>${index<journey.cleared?(gameLanguage==='en'?'Passed':'已走过'):key===activeDifficulty()?(gameLanguage==='en'?'Here':'身在此处'):(gameLanguage==='en'?'Ahead':'尚未抵达')}</small></li>`).join('')}</ol><p class="journey-description">${esc(note)}</p></div>`;
}
function campaignIndex(){return Math.max(0,DIFFICULTY_ORDER.indexOf(difficulty))}
function otherSide(side){return side==='p'?'e':'p'}
function encounterFirstSide(){if(G?.replay)return G.campaignFirst||'p';const first=G?.campaignFirst||'p';return ((G?.lv||1)-1)%2?otherSide(first):first}
function roundFirstSide(){const first=G?.encounterFirst||'p';return ((G?.turn||1)-1)%2?otherSide(first):first}
function battleAttackOrder(){const first=roundFirstSide();return [first,otherSide(first)]}
async function deployEnemyForRound(){
 if(!G||G.tutorial||G.enemyDeployedTurn===G.turn)return;
 const game=G,phase=G.phase;G.enemyDeployedTurn=G.turn;G.phase='enemy-deploy';
 await enemyPlay(true,G.turn===1);if(G!==game)return;
 await enemyMoves();if(G!==game)return;G.phase=phase;
}
const MATCH_LIMIT=36,LANES=5,LANE_LIST=[0,1,2,3,4];
const COUNTERS={火:['血','冰'],血:['光'],光:['暗'],暗:['雷'],雷:['火'],魔:['火'],冰:['毒'],毒:['魔']};
Object.assign(ATC,{魔:'#5878d1',冰:'#60a8b9',毒:'#689147'});
Object.assign(SG,{guard:'守护',poison:'毒刃'});
Object.assign(SGD,{guard:'守护：拦截飞行，受到卡牌攻击伤害减1',poison:'毒刃：造成伤害后施加2回合中毒，每回合失去1血',parry:'弹反：本次伤害≤1时免伤并反伤1',vamp:'嗜血：对卡牌造成伤害后回复1血',regen:'再生：每回合结束回复1血'});
Object.assign(SGS,{guard:'拦截飞行，受到卡牌攻击伤害减1',poison:'造成伤害后施加2回合中毒（每回合1血）',parry:'本次伤害≤1时免伤并反伤1',vamp:'对卡牌造成伤害后回复1血'});
SG.abyss='折时封契';
SGS.abyss='出场时，可选择自己的一张手牌冻结两回合（本回合与下一回合不能打出）；第三回合开始解冻，献祭费用减少1，最低为0。本次对战有效。';
SGD.abyss=SG.abyss+'：'+SGS.abyss;
const GROWTH_HELP='自身攻击击杀一张敌方卡牌后，攻击力永久增加1（仅限本次对战，无3攻上限）。直击玩家、献祭及中毒等间接击杀不触发。';
const DEATH_HELP={spiders:'死亡或被献祭时召唤两只鎏金灯蛛（0攻／1血／0费），优先原格与最近空格，位置不足的进入己方手牌。',draw:'死亡或被献祭时从己方有限卡组抽2张，牌堆不足时只抽取剩余的牌。',heal:'死亡或被献祭时回复己方2点生命，上限7。',emberling:'死亡或被献祭时召唤一只鎏金余芯（1攻／1血／0费），优先原格与最近空格，无空格则进入己方手牌。'};
function rarityText(c){return c.rarity==='rare'?'鎏金稀有':''}
function cardSearchText(c){return [c.n,shortCardName(c,'zh-CN'),shortCardName(c,'en'),c.baseName,c.alias,cardNarrative(c),c.at,rarityText(c),c.growth&&'成长 击杀',c.death&&'亡语 '+DEATH_HELP[c.death],SG[c.s]||'',MOVE_LABEL[c.mv]||''].filter(Boolean).join(' ')}
GL.spider='<ellipse cx="20" cy="24" rx="6" ry="8" fill="currentColor"/><circle cx="20" cy="14" r="4" fill="currentColor"/><path d="m15 15-6-6-5 1m11 10L6 17l-3 3m12 4-9 4-1 6m11-6-5 8m14-21 6-6 5 1m-11 10 9-3 3 3m-12 4 9 4 1 6m-11-6 5 8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
const MOVE_LABEL={shift:'横移',swap:'换位',push:'击退'};
const MOVE_HELP={shift:'每回合可向左或右移动一格，只能移到空格',swap:'每回合可左右移动一格，或与相邻友军交换；双方本回合都不能再移动',push:'攻击卡牌造成伤害后，把存活目标推到相邻空格；不追加攻击'};
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function effectiveCardAttack(card,opponent=null){
 if(!card)return 0;
 const base=Math.max(0,Number(card.a)||0),ambush=Number(card.zeroAttackPunish)||0;
 return base+(ambush>0&&opponent&&opponent.h>0&&Math.max(0,Number(opponent.a)||0)===0?ambush:0);
}
function displayedCardAttack(card){
 if(!card||!card.zeroAttackPunish||!G)return card?.a||0;
 const mine=G.p?.indexOf(card),enemy=G.e?.indexOf(card);
 return effectiveCardAttack(card,mine>=0?G.e[mine]:enemy>=0?G.p[enemy]:null);
}
function canSacrificeCard(side,index,turn=G?.turn){
 const board=side==='p'?G?.p:side==='e'?G?.e:null,card=board?.[index];
 return !!card&&!card.bossNoSacrifice&&Number.isInteger(card.t)&&card.t>=0&&card.t<turn;
}
function sacrificeStatusHTML(c){
 if(!G||!c.fod&&c.n!=='余芯')return '';
 const side=G.p?.includes(c)?'p':G.e?.includes(c)?'e':null;if(!side)return '';
 const ready=canSacrificeCard(side,(side==='p'?G.p:G.e).indexOf(c));
 return `<span class="sacrifice-status ${ready?'is-mature':'is-fresh'}" aria-label="第${c.t}回合入场，${ready?'可以献祭':'当前不可献祭'}">${ready?'可献祭':'新入场'}</span>`;
}
function dealt(a,t){let d=effectiveCardAttack(a,t);if(d<=0)return 0;if((COUNTERS[a.at]||[]).includes(t.at))d++;else if((COUNTERS[t.at]||[]).includes(a.at))d--;if(t.s==='guard')d--;return Math.max(0,d)}
function atTip(at){const strong=COUNTERS[at]||[],weak=Object.keys(COUNTERS).filter(k=>COUNTERS[k].includes(at));return at==='物理'?'物理：无属性克制':`${at}：克${strong.join('、')||'无'}；被${weak.join('、')||'无'}克制`}
function makeCard(c,enemy=false){return {...c,a0:c.a,h0:c.h,e:enemy?1:undefined,poison:0,moved:0,rk:0}}
function frozenTurns(c){return Math.max(0,Math.max(c?.frozenUntil||0,c?.bossFrozenUntil||0)-(G?.turn||0))}
function freezeHandCard(side,index){
 const hand=side==='p'?G.hand:G.eh,c=hand[index];if(!c||frozenTurns(c))return false;
 c.frozenUntil=G.turn+2;logBattle(`${side==='p'?'我方':'敌方'}苔庭潜印客·莫恩将${c.n}冻结两回合；第${c.frozenUntil}回合开始解冻并减1费（最低0）。`);
 if(side==='p'){G.freezeChoice=false;G.sel=null;G.moveSel=null;G.sac.clear()}return true;
}
function thawHandCards(){
 for(const side of ['p','e'])for(const c of side==='p'?G.hand:G.eh){
  if(c.bossFrozenUntil!=null&&c.bossFrozenUntil<=G.turn){delete c.bossFrozenUntil;logBattle(`${side==='p'?'我方':'敌方'}${c.n}的契环冰封已解除，费用不变。`)}
  if(c.frozenUntil==null||c.frozenUntil>G.turn)continue;
  delete c.frozenUntil;const before=c.c||0;c.c=Math.max(0,before-1);c.abyssDiscount=(c.abyssDiscount||0)+before-c.c;
  logBattle(`${side==='p'?'我方':'敌方'}${c.n}解冻，费用${before} → ${c.c}。`);
 }
}
function logBattle(text){if(!G)return;G.log=G.log||[];G.log.push(text);if(G.log.length>60)G.log.shift()}
function cardTip(c){const L=[`${displayedCardName(c)}：${GAME_META[c.game]?.[0]||(c.identity?'死亡身份':'灯火遗物')} · ${rarityText(c)?rarityText(c)+' · ':''}${KIND_LABEL[c.kind]||'祭品'}`];if(c.quality==='named')L.push('具名角色：拥有与其角色风格相符的强化属性。');if(c.identity)L.push(c.permanent?'永久死亡身份：已归档，可自由组卡':'暂存死亡身份：本轮最多1张，通关16关后才永久归档');const bossAbility=typeof playerBossSkillForCard==='function'?playerBossSkillForCard(c):null;if(bossAbility)L.push(`可装备Boss技能「${bossAbility.name}」：此卡在我方场上时，点击生命旁的技能按钮装备；每回合最多装备一次、发动一次，来源卡离场后失效。`);if(c.zeroAttackPunish)L.push(`伺机：平时基础攻击为0；正对面的存活卡攻击为0时，以${c.zeroAttackPunish}点基础攻击发动攻击。对位空着时仍为0，已有攻击强化另算。`);if(c.alias)L.push(`别称：${c.alias}`);if(c.token)L.push('亡语召唤物：不计入稀有收集卡，不加入实际卡组');if(c.growth)L.push('击杀成长：'+GROWTH_HELP);if(c.death)L.push('亡语：'+DEATH_HELP[c.death]);if(cardNarrative(c))L.push(cardNarrative(c));if(c.c)L.push(`献祭：需要${c.c}张友军`);if(c.s)L.push(`${SG[c.s]}：${SGS[c.s]}`);if(c.mv)L.push(`${MOVE_LABEL[c.mv]}：${MOVE_HELP[c.mv]}`);if(c.x)L.push(`${SX[c.x]}：${SXS[c.x]}`);if(c.dr)L.push(`出场抽牌：${c.dr}张`);if(c.dd)L.push(`死亡抽牌：${c.dd}张（含献祭）`);if(c.heal)L.push(`引火：出场回复己方${c.heal}点生命，上限7`);if(c.poison)L.push(`中毒：剩余${c.poison}回合`);if(frozenTurns(c))L.push(c.bossFrozenUntil>G.turn&&!(c.frozenUntil>G.turn)?`Boss冰封：当前不能打出，覆盖下一次行动后解除，费用不变。`:`冻结：还需${frozenTurns(c)}回合不能打出，第${c.frozenUntil}回合开始解冻并减1费（最低0）`);if(c.abyssDiscount)L.push(`裂辉减费：本次对战已减${c.abyssDiscount}费，当前${c.c}费`);if(c.at)L.push(atTip(c.at));for(const row of bossCardStatusRows(c))L.push(row[0]+'：'+row[1]);return L.join('¦')}
function cardHTML(c,cls='',at=''){
 return `<div class="card ${c.d?'dead':''} ${c.e?'e':''} ${c.f?'f-'+c.f:''} ${c.mv?'mobile':''} ${frozenTurns(c)?'is-frozen':''} ${c.rarity==='rare'?'rare-card':''} ${cls}" data-card-name="${esc(c.n)}" data-tip="${esc(cardTip(c))}" ${at}>${c.rarity==='rare'?'<span class="rarity-mark" aria-label="鎏金稀有卡">稀</span>':''}<div class="top"><b>${esc(displayedCardName(c))}</b><i>${'●'.repeat(c.c||0)}</i></div><div class="art">${c.f?`<em class="fc">${KIND_LABEL[c.kind]||FN[c.f]||''}</em>`:''}${c.at?`<i class="at" style="background:${ATC[c.at]||'#666'}">${c.at[0]}</i>`:''}${cardPortraitHTML(c)}${sacrificeStatusHTML(c)}</div>${frozenTurns(c)?`<span class="freeze-status">❄ 冻结 ${frozenTurns(c)}</span>`:''}<div class="sg">${bossCardStatusHTML(c)}${c.zeroAttackPunish?'<span class="sk">伺机</span>':''}${c.growth?'<span class="sk growth-sigil">成长</span>':''}${c.death?'<span class="sk death-sigil">亡语</span>':''}${c.abyssDiscount?'<span class="sk discount-sigil">减费</span>':''}${c.s?`<span class="sk">${SG[c.s]}</span>`:''}${c.mv?`<span class="sk move-sigil">${MOVE_LABEL[c.mv]}</span>`:''}${c.x?`<span class="sk x">${SX[c.x]}</span>`:''}${c.dr?`<span class="sk">抽${c.dr}</span>`:''}${c.dd?`<span class="sk">亡抽${c.dd}</span>`:''}${c.heal?'<span class="sk">引火</span>':''}</div><div class="st"><span>${displayedCardAttack(c)}</span><span>${c.h}${c.poison?'·毒':''}</span></div></div>`;
}
function stagePool(st){return POOL.filter(c=>c.rarity!=='rare'&&st.games.includes(c.game)&&c.c>0)}
function stageDeck(st){
 if(typeof bossStageDeck==='function'){const themed=bossStageDeck(st);if(themed?.length)return themed}
 const pool=stagePool(st),low=pool.filter(c=>c.c===1),mid=pool.filter(c=>c.c===2),high=pool.filter(c=>c.c===3);
 const take=(p,n)=>shuf(p.length?p:pool).slice(0,n);
 const list=[...take(low,9),...take(mid,st.tier===1?4:5),...take(high,st.tier===1?1:3)];
 // The boss card is a late draw, while the first hand always has a playable one-cost card.
 const boss=POOL.find(c=>c.n===st.boss);if(boss&&!list.some(c=>c.n===boss.n))list.push(boss);
 return list.map(c=>c.n);
}
function opening(deck){const cheap=deck.findIndex(c=>c.c===1);if(cheap>=0)deck.push(deck.splice(cheap,1)[0]);return deck}
function newRun(){
 if(typeof checkpointClear==='function')checkpointClear();
 cancelInitiativeCoin();
 TUT=null;DM=null;HOLD_DETAIL=null;infoPanel=null;detailCardOverride=null;
 difficulty=activeDifficulty();
 STG.splice(0,STG.length,...CAMPAIGNS[difficulty].map(st=>({...st,dk:[]})));
 const carry=getCampaignCarry(difficulty),names=validDeck(customDeck)?customDeck:STARTER;
 G={lv:1,wins:0,kills:0,deck:carry?carry.deck.map(c=>makeCard(c)):names.map(n=>makeCard(collectionCard(n))),reserve:carry?carry.reserve.map(c=>makeCard(c)):[],defeatedBosses:carry?[...carry.defeatedBosses]:[],sel:null,sac:new Set(),busy:1,log:[],history:[],identityRecorded:false};
 const remnant=identityForRun();if(remnant&&!G.deck.some(c=>c.n===remnant.n)&&!G.reserve.some(c=>c.n===remnant.n)){const c=makeCard(remnant);if(G.deck.length<DECK_MAX&&collectionHasCopyRoom(c,G.deck))G.deck.push(c);else G.reserve.push(c)}
 G.deck.forEach(collectCard);battle();
}
function awardCoinWick(first){
 if(!G||G.coinBonusGranted||!['p','e'].includes(first))return false;
 const side=otherSide(first),ash={...makeCard(SQ,side==='e'),fod:true};
 (side==='p'?G.hand:G.eh).push(ash);G.coinBonusSide=side;G.coinBonusGranted=true;
 logBattle(`金币化作余芯交给${side==='p'?'你':'Boss'}：后手起手6张，多获得1张余芯；需要自行部署并存活一回合才能献祭。`);render();return true;
}
async function battle(){
 const game=G,carry=G.hp;Object.assign(G,{hp:G.lv===1?7:Math.min(7,Math.max(4,carry+RULES[difficulty].heal)),ehp:7,p:Array(5).fill(null),e:Array(5).fill(null),turn:1,passiveTurn:-1,sel:null,moveSel:null,freezeChoice:false,busy:1,killer:null,lastHit:null,log:[],rewardClaimed:false,rewardSelection:new Set(),rewardFeedback:"",newRewards:[],newReward:null,bossFarewell:null,deathEcho:null,mustDraw:1,enemyDeployedTurn:0,phase:'opening',coinBonusSide:null,coinBonusGranted:false});
 G.sac.clear();G.st=STG[G.lv-1];G.st.dk=stageDeck(G.st);G.ed=opening(shuf(G.st.dk.map(n=>eCard(n,G.st))));G.eh=[];G.draw=opening(shuf(G.deck.map(c=>makeCard(c))));G.hand=[];bossAbilitiesInitBattle();OV=null;
 render();snd('shuffle');
 for(const side of ['e','p','e','p','e','p','e','p']){takeCard(side);render();await drawIdle;if(G!==game)return}
 for(const side of ['p','e']){const ash=takeCard(side,true);if(side==='e')ash.e=1;render();await drawIdle;if(G!==game)return}
 if(G.lv===1||!G.campaignFirst){const first=await openInitiativeCoin();if(G!==game||!first)return;G.campaignFirst=first;awardCoinWick(first)}
 G.encounterFirst=encounterFirstSide();G.roundFirst=roundFirstSide();G.phase='player-deploy';
 logBattle(`空牌桌开场，双方基础起手各5张（含1张余芯）；本关${G.encounterFirst==='p'?'我方':'Boss'}先部署并先攻。下一位Boss交替先手。`);
 if(roundFirstSide()==='e'){await deployEnemyForRound();if(G!==game||chk())return}
 G.mustDraw=0;G.busy=0;logBattle('首回合无需再抽牌。请自行部署余芯或零费牌，新出场卡须存活到下一回合才能献祭。');render();
}
function eCard(n,st){const c=makeCard(POOL.find(c=>c.n===n),true);c.h+=c.c>=2?(RULES[difficulty]?.bonus||0):0;c.h0=c.h;return c}
function sacrificeCandidates(c){return LANE_LIST.filter(i=>canSacrificeCard('e',i)).sort((x,y)=>{const a=G.e[x],b=G.e[y];return (a.fod?0:10+a.a*2+a.h)-(b.fod?0:10+b.a*2+b.h)}).slice(0,c.c)}
function laneScore(c,lane){const target=G.p[lane];if(!target)return c.s==='fly'?2:1;const threat=effectiveCardAttack(target,c),attack=effectiveCardAttack(c,target);return threat*2+(threat>=G.hp?10:0)+(c.s==='guard'&&target.s==='fly'?5:0)+(c.h>dealt(target,c)?2:0)+(attack>=target.h?3:0)}
// The opening opponent compares legal deployments with keeping its current board.
// This forecast is local: it never mutates combat cards, draws cards or rolls RNG.
// Pure tactical forecasts are supplied by the AI source module below.
async function enterEffects(side,c){
 for(let k=0;k<(c.dr||0);k++){if(takeCard(side)){render();await drawIdle}}
 const heal=(c.heal||0)+(c.x==='ember'?1:0);if(heal){const key=side==='p'?'hp':'ehp';G[key]=Math.min(7,G[key]+heal);snd('heal');logBattle(`${c.n}回复${heal}点生命`)}
 if(c.s==='abyss'){
  const hand=side==='p'?G.hand:G.eh,targets=hand.map((card,index)=>({card,index})).filter(({card})=>!frozenTurns(card));
  if(!targets.length)logBattle(`${side==='p'?'我方':'敌方'}苔庭潜印客·莫恩没有可冻结的手牌。`);
  else if(side==='p'){G.freezeChoice=true;G.sel=null;G.moveSel=null;G.sac.clear()}
  else{targets.sort((a,b)=>b.card.c-a.card.c||b.card.a-a.card.a);freezeHandCard(side,targets[0].index)}
 }
}
function sacFx(x){
 if(!x?.fod||G.passiveTurn===G.turn||(campaignIndex()===0&&G.turn%2===1))return;const st=G.st,al=G.e.filter(c=>c&&!c.fod);let triggered=false;
 if(st.pas==='血'&&al.length){const c=al.find(c=>c.a<3);if(c){c.a++;triggered=true}}
 else if(st.pas==='环'&&al.length&&G.turn%2===0){const c=al.find(c=>c.h0<6);if(c){c.h++;c.h0++;triggered=true}}
 else if(st.pas==='狼'){const target=G.p.filter(c=>c&&c.h>1).sort((a,b)=>b.h-a.h)[0];if(target){target.h--;triggered=true;logBattle(`裂霜使${target.n}失去1血`)}}
 if(triggered)G.passiveTurn=G.turn;
}
async function enemyPlay(anim=true,initial=false){return enemyPlay6(anim,initial)}

function summonDeathTokens(side,i,c){
 const board=side==='p'?G.p:G.e,hand=side==='p'?G.hand:G.eh,spiders=c.death==='spiders',count=spiders?2:1;
 for(let k=0;k<count;k++){
  const token=makeCard({n:spiders?'鎏金灯蛛':'鎏金余芯',a:spiders?0:1,h:1,c:0,rarity:'rare',token:true,tokenKind:spiders?'spider':'flame',game:c.game,f:c.f,kind:'mob',at:'物理',lore:spiders?'织光领誓亡语召来的幼蛛。零费部署，须存活到下一回合才能献祭。':'归灯守卫亡语留下的一粒鎏金余芯。零费部署，须存活到下一回合才能献祭。'},side==='e');
  const lane=LANE_LIST.filter(j=>!board[j]).sort((a,b)=>Math.abs(a-i)-Math.abs(b-i)||a-b)[0];
  if(lane==null){hand.push(token);logBattle(`${token.n}因战场已满进入${side==='p'?'我方':'敌方'}手牌`)}
  else{board[lane]=token;token.t=G.turn;logBattle(`${token.n}在${side==='p'?'我方':'敌方'}第${lane+1}格诞生`)}
 }
}
function resolveDeath({side,i,card:c}){
 if(c.death==='spiders'||c.death==='emberling')summonDeathTokens(side,i,c);
 else if(c.death==='draw'){let drawn=0;for(let k=0;k<2;k++)if(takeCard(side))drawn++;logBattle(`${c.n}亡语抽取${drawn}张卡组牌`)}
 else if(c.death==='heal'){const key=side==='p'?'hp':'ehp',before=G[key];G[key]=Math.min(7,G[key]+2);if(G[key]>before)snd('heal');logBattle(`${c.n}亡语回复${G[key]-before}点生命`)}
}
function kill(side,i,by,reason='combat',deaths=null){
 const board=side==='p'?G.p:G.e,c=board[i];if(!c)return;if(side==='e')recordBossFarewell(c,reason);board[i]=null;bossRecordDeath(side,c,reason,by);
 if(reason==='combat'){snd('kill');if(side==='e'&&!c.fod)G.kills++;if(side==='p'&&by)G.killer=by}
 if(c.s==='bones')board[i]={...BONE,e:side==='e'?1:undefined,t:G.turn};
 if(c.x==='rekindle'&&!c.rk)(side==='p'?G.hand:G.eh).push({...c,a:c.a0??c.a,h:c.h0??c.h,rk:1,poison:0});
 for(let n=0;n<(c.dd||0);n++)takeCard(side);
 logBattle(reason==='sacrifice'?`第${G.turn}回合：${side==='p'?'我方':'敌方'}第${i+1}格的${c.n}被献祭（第${c.t}回合入场）`:`${c.n}退场`);
 if(c.death){const event={side,i,card:c};if(deaths)deaths.push(event);else resolveDeath(event)}
}
function pushTarget(side,lane){const b=side==='p'?G.p:G.e;if(!b[lane]||b[lane].bossEffects?.lockMove)return;const dir=lane<2?1:-1;for(const d of [dir,-dir]){const to=lane+d;if(to>=0&&to<5&&!b[to]){b[to]=b[lane];b[lane]=null;logBattle(`${b[to].n}被击退到第${to+1}格`);return to}}}
function atk(side,i){
 if(bossResolveAttack(side,i))return;
 const me=side==='p'?G.p:G.e,other=side==='p'?'e':'p',ot=other==='p'?G.p:G.e,a=me[i],t=ot[i],attack=effectiveCardAttack(a,t);if(!a||attack<=0)return;
 const direct=!t||(a.s==='fly'&&t.s!=='guard');
 if(direct){const key=side==='p'?'ehp':'hp';const dealtDirect=Math.min(G[key],attack);G[key]=Math.max(0,G[key]-attack);bossRecordDirect(side,dealtDirect);if(side==='e')G.lastHit=a;logBattle(`${a.n}直击${attack}点生命`);return}
 const damage=dealt(a,t),parried=t.s==='parry'&&damage<=1;
 if(parried)a.h--;else{t.h-=damage;if(t.s==='thorn')a.h--;if(damage>0&&a.s==='vamp')a.h=Math.min(a.h0,a.h+1);if(damage>0&&a.s==='poison')t.poison=Math.max(t.poison||0,2)}
 logBattle(`${a.n}攻击${t.n}：${parried?'被弹反':damage+'伤害'}`);
 if(t.h<=0){kill(other,i,a);if(a.growth&&a.h>0){a.a++;logBattle(`${a.n}击杀成长，攻击升至${a.a}`)}else if(a.x==='soul'&&a.h>0)a.a=Math.max(a.a,Math.min(3,a.a+1))}
 if(a.h<=0&&me[i]===a)kill(side,i,t);
 if(!parried&&damage>0&&t.h>0&&ot[i]===t&&a.h>0&&a.mv==='push')pushTarget(other,i);
}
function canMove(side,i,d){const b=side==='p'?G.p:G.e,c=b[i],j=i+d;if(!c||c.bossEffects?.lockMove||!['shift','swap'].includes(c.mv)||c.moved===G.turn||j<0||j>=5)return false;if(!b[j])return true;return c.mv==='swap'&&b[j].moved!==G.turn&&!b[j].bossEffects?.lockMove}
async function moveCard(side,i,d,animate=true){if(!canMove(side,i,d))return false;const b=side==='p'?G.p:G.e,j=i+d,c=b[i],other=b[j];b[j]=c;b[i]=other||null;c.moved=G.turn;if(other)other.moved=G.turn;G.moveSel=side==='p'?j:null;logBattle(`${c.n}${other?'与'+other.n+'换位':'移动到第'+(j+1)+'格'}`);render();if(animate){const node=el(side,j),width=node?.getBoundingClientRect().width||60;if(node&&typeof node.animate==='function')try{const motion=node.animate([{transform:`translateX(${-d*(width+5)}px)`},{transform:'none'}],{duration:200,easing:'ease-out'});if(motion?.finished)await Promise.race([Promise.resolve(motion.finished).catch(()=>{}),wait(300)])}catch{}}return true}
async function enemyMoves(){for(const c of [...G.e]){const i=G.e.indexOf(c);if(i<0||!c||!['shift','swap'].includes(c.mv))continue;const dirs=[-1,1].filter(d=>canMove('e',i,d));const best=dirs.sort((a,b)=>laneScore(c,i+b)-laneScore(c,i+a))[0];if(best&&laneScore(c,i+best)>laneScore(c,i)+1)await moveCard('e',i,best,true)}}
async function strike(side,i){
 const a=(side==='p'?G.p:G.e)[i],opponent=(side==='p'?G.e:G.p)[i];if(!a||effectiveCardAttack(a,opponent)<=0||a.bossEffects?.skipAttack)return;
 const node=el(side,i),target=el(side==='p'?'e':'p',i);
 if(node&&target&&typeof node.animate==='function'&&!matchMedia('(prefers-reduced-motion:reduce)').matches)try{const dy=(target.getBoundingClientRect().top-node.getBoundingClientRect().top)*.6;node.style.zIndex=9;const motion=node.animate([{transform:'none'},{transform:`translateY(${dy}px) scale(1.08)`},{transform:'none'}],{duration:300});if(motion?.finished)Promise.resolve(motion.finished).catch(()=>{});await wait(150)}catch{}
 playCardAttackSound(a);const before=side==='p'?G.ehp:G.hp;atk(side,i);const after=side==='p'?G.ehp:G.hp;
 if(after<before){const health=document.getElementById(side==='p'?'enemy-health':'player-health');if(health)pop(health,'生命 -'+(before-after),'#ffab65')}
 await wait(150);
}
async function announceRoundStart(){
 const game=G,first=roundFirstSide();G.phase='round-start';
 logBattle(`—— 第${G.turn}回合开始 · ${first==='p'?'我方':'Boss'}先部署、先攻 ——`);
 render();await drawIdle;if(G!==game||OV)return false;
 // A former second player can act first now. Show the boundary before the
 // second deployment so two legal rounds never look like one immediate sacrifice.
 if(first==='e')await wait(900);
 if(G!==game||OV)return false;G.phase='player-deploy';return true;
}
async function endTurn(){
 if(G.busy||G.mustDraw||G.freezeChoice||drawRunning||OV)return;const game=G;G.busy=1;G.sel=null;G.moveSel=null;G.sac.clear();render();await deployEnemyForRound();if(G!==game||chk())return;G.phase='combat';
 const order=battleAttackOrder(),delayed=[];const actors={p:[...G.p].filter(Boolean),e:[...G.e].filter(Boolean)};
 for(const side of order){for(const c of actors[side]){const i=(side==='p'?G.p:G.e).indexOf(c);if(i<0||c.bossEffects?.skipAttack)continue;if(c.bossEffects?.lateAttack){delayed.push({side,card:c});continue}await strike(side,i);render();await drawIdle;if(chk())return}}
 for(const actor of delayed){const i=(actor.side==='p'?G.p:G.e).indexOf(actor.card);if(i<0||actor.card.bossEffects?.skipAttack)continue;await strike(actor.side,i);render();await drawIdle;if(chk())return}
 for(const side of ['p','e']){const b=side==='p'?G.p:G.e;for(const c of [...b]){if(!c)continue;const i=b.indexOf(c);if(i<0)continue;if(c.poison){c.poison--;bossTakeCardDamage(side,c,1,null,{kind:'poison'});if(b.indexOf(c)<0)continue}if(c.s==='regen'&&c.h<c.h0)c.h++}}
 render();await drawIdle;if(chk())return;
 for(const side of order){if(side==='e')runBossAbility('after_attack');else if(typeof runPlayerBossAbility==='function')runPlayerBossAbility('after_attack');render();await drawIdle;if(chk())return}
 bossAbilitiesRoundEnd();render();await drawIdle;if(chk())return;
 if(G.turn>=MATCH_LIMIT){const score=side=>(side==='p'?G.p:G.e).reduce((v,c)=>v+(c&&!c.fod?c.a+c.h:0),0);if(G.hp>G.ehp||(G.hp===G.ehp&&score('p')>=score('e'))){logBattle('回合上限：按生命、场面结算');win()}else lose('灯息耗尽');return}
 G.turn++;G.roundFirst=roundFirstSide();bossAbilitiesRoundStart();thawHandCards();takeCard('p',true);G.mustDraw=1;if(!await announceRoundStart())return;
 if(roundFirstSide()==='e'){await deployEnemyForRound();if(G!==game||chk())return}
 G.busy=0;render();
}
function chk(){if(OV==='win'||OV==='dead'||OV==='clear')return 1;if(G.hp<=0){lose();return 1}if(G.ehp<=0){win();return 1}return 0}
function rewardCards(){
 const owned=new Set([...G.deck,...(G.reserve||[])].map(c=>c.n)),eligible=c=>typeof goldRewardEligible!=='function'||goldRewardEligible(c,G.deck,G.reserve||[]);
 G.rewardGoldExhausted=false;
 if(isCampaignFinalReward()){
  const defeated=new Set(STG.map(st=>st.boss)),gold=POOL.filter(c=>c.rarity==='rare'&&G.st.games.includes(c.game)&&defeated.has(c.baseName)&&eligible(c));
  const final=gold.find(c=>c.baseName===G.st.boss),result=final?[final]:[];
  while(result.length<3){const available=gold.filter(c=>!result.some(r=>r.n===c.n)),chosen=available.length?pick(available):null;if(!chosen)break;result.push(chosen)}
  if(result.length)return result.map(c=>makeCard(c));
  G.rewardGoldExhausted=true;
 }
 const rareDrop=!G.rewardGoldExhausted&&Math.random()<.05,common=POOL.filter(c=>c.rarity!=='rare'&&!c.identity);
 const stage=stagePool(G.st).filter(c=>!owned.has(c.n)),all=common.filter(c=>!owned.has(c.n));
 const choose=(pool,except=[])=>{const available=pool.filter(c=>!except.includes(c.n));return available.length?pick(available):null},result=[];
 for(const candidates of [stage.filter(c=>c.c>=2),all.filter(c=>c.mv),all.filter(c=>c.dr||c.dd||c.heal)]){const c=choose(candidates.length?candidates:all.length?all:common,result.map(c=>c.n));if(c)result.push(makeCard(c))}
 if(rareDrop){const c=POOL.find(c=>c.rarity==='rare'&&c.baseName===G.st.boss&&eligible(c));if(c)result[0]=makeCard(c)}
 return result;
}
function win(){if(G.tutorial){G.busy=0;TUT.finished=true;render();return}if(typeof isBossReplay==='function'&&isBossReplay()){finishBossReplay(true);return}if(OV==='win'||OV==='clear')return;recordBossFarewell();G.wins++;G.defeatedBosses=[...new Set([...(G.defeatedBosses||[]),G.st.boss])];if(typeof recordReplayClear==='function')recordReplayClear();G.history.push({stage:G.st.n,boss:G.st.boss,turns:G.turn,hp:G.hp,farewell:G.bossFarewell});G.rewardSelection=new Set();G.rewardFeedback='';G.rw=rewardCards();completeDifficulty();G.busy=0;OV='win';snd(G.rw.some(c=>c.rarity==='rare')?'rare':'win');render()}
function lose(reason){if(G.tutorial){G.busy=0;TUT.finished=true;render();return}if(typeof isBossReplay==='function'&&isBossReplay()){finishBossReplay(false);return}if(OV==='dead')return;const k=G.lastHit||G.killer||{n:reason||'灯息耗尽',s:'bones'};G.dc={n:pname+'余芯',a:Math.min(3,1+Math.floor(G.wins/4)),h:Math.min(5,2+Math.floor(G.wins/4)),c:G.wins>=4?2:1,s:k.s||'bones',x:G.kills>=12?'soul':G.wins>=2?'ember':'rekindle',d:1,by:reason||k.n,at:k.at||'暗'};G.dc.a0=G.dc.a;G.dc.h0=G.dc.h;recordPlayerDeathEcho();identityOnDeath(G.dc);G.busy=0;OV='dead';snd('die');render()}
async function commit(i){
 if(G.busy||G.freezeChoice||G.sel==null)return;const c=G.hand[G.sel],sacs=[...G.sac];if(!c||frozenTurns(c)||sacs.length!==c.c||G.p[i]&&!G.sac.has(i)||sacs.some(j=>!canSacrificeCard('p',j)))return;
 G.busy=1;if(sacs.length){sacs.forEach(j=>{const node=el('p',j);if(node)burn(node)});snd('burn');await wait(250)}
 G.hand.splice(G.sel,1);const deaths=[];sacs.forEach(j=>kill('p',j,null,'sacrifice',deaths));const placed=makeCard(c);placed.rk=c.rk||0;G.p[i]=placed;placed.t=G.turn;deaths.forEach(resolveDeath);G.sel=null;G.sac.clear();render();await drawIdle;await enterEffects('p',placed);bossOnPlayerDeploy(i,placed);G.busy=0;logBattle(`你在第${i+1}格召唤${c.n}`);snd('place');render();chk();
}
function deckCost(names){return names.reduce((n,name)=>n+(collectionCard(name)?.c||0),0)}
function validDeck(names){return !starterIssue(names)}
function catalogueHTML(){return collectionCatalogueHTML()}

let infoPanel=null,detailCardOverride=null,boardObserver=null,layoutFrame=0;
function pileHTML(side){
 const n=side==='p'?G.draw.length:G.ed.length,total=side==='p'?G.deck.length:G.st.dk.length,layers=Math.min(n,40),depth=Math.min(n*.55,22);
 return `<div class="deck-wrap">${side==='p'?'<button class="deck-access-pile" data-a="deckmanager" aria-label="查看并管理我的卡组">':''}<div class="deck-pile" id="deck-${side}" role="img" aria-label="${side==='p'?'我方':'敌方'}牌堆，剩余${n}张">${n?Array.from({length:layers},(_,i)=>`<div class="deck-layer" style="transform:translate(${i*depth/Math.max(1,layers-1)}px,${-i*depth/Math.max(1,layers-1)}px)"></div>`).join(''):'<span class="deck-empty">空</span>'}</div><div class="deck-info"><span class="deck-name">${side==='p'?'我方':'敌方'}牌堆</span><span class="deck-count"><b>${n}</b><small> / ${total}</small></span></div>${side==='p'?'<span class="deck-management-hint" aria-hidden="true">≡</span></button>':''}</div>`;
}
function rulesHTML(){return `<div class="rules-copy"><p class="drawer-eyebrow">FIELD PROCEDURE</p><h2>落牌之前</h2><p>你与敌人各有7点生命、五个战斗格。攻击空位或飞越对手会直击生命，生命归零即落败。</p><button class="tutorial-home-link" data-a="tutorial">重看新手指引 · 界面与出牌</button><button class="tutorial-home-link" data-a="catalog">浏览全部卡牌图鉴</button><h3>卡组与备用</h3><p>出战上限36张，推荐24张；起始卡组至少12张。点牌堆图标查看卡组，按费用、功能、属性或名称排序。排序只改变显示，不改变抽牌顺序。默认初始卡组16张，推荐24张。奖励卡直接加入出战，达到36张上限后才提示整理；已满36张时新奖励放入备用，备用不参加抽牌。</p><h3>抽牌与献祭</h3><p>双方基础起手各5张，包含1张余芯，首回合无需再抽牌。每轮回首关掷币后，金币化为1张额外余芯交给后手：先手5张、后手6张。额外余芯不消耗牌库，仍需自行部署并存活到下一回合才能献祭。正式对战由空牌桌开场，双方自行部署；新部署的祭品须存活到下一回合才能献祭。之后每回合免费获得1张余芯，再选择抽1张卡组牌或再取余芯。费用●代表需要献祭的友军数量；新召唤的牌下回合才能献祭。场上余芯标明“新入场”或“可献祭”，敌我使用相同规则。</p><h3>永久收藏与死亡身份</h3><p>未获得的牌以问号背面封存，不能查看能力或自由编入；获得并实际加入出战后才永久解锁。备用中的新牌须先编入并保存。普通出战同名最多2张；鎏金在出战与备用中合计最多1张，余芯不受同名限制。每轮16关内最多暂存1张死亡身份，第二次死亡可保留旧卡或替换新卡；重试自动携带，通关本轮16关后才永久归档并可自由组卡。</p><h3>死亡余芯的成长</h3><p>正式战斗的死亡次数在当前浏览器累计保存。每第3次死亡（第3、6、9次等）单独有33%概率生成比上一份死亡遗骸更强的身份；费用可为1、2或3费，成长存在上限。没有命中不会消耗或削弱已保留的身份。每轮仍最多暂存一张，第二次死亡可比较旧卡与新卡后保留或替换；通关16关后才永久归档，练习不计死亡。</p><h3>我方装备Boss技能</h3><p>与守关Boss同名的普通或鎏金卡部署在我方场上后，可点击我方生命旁的技能按钮装备其专属主动技能；仅在手牌或卡组中不能装备。每回合最多装备一次，从第2回合开始启用。每次成功发动额外消耗一张未冻结的手牌余芯；发动后下一回合冷却，再下一回合才能再次发动，原技能的弃牌、生命等代价仍需另外支付。部署技能在我方部署阶段点击发动；攻击后技能先点击准备，在双方攻击结束后结算。效果中的友军、敌军与代价按我方视角计算。已装备技能可沿用至下回合，来源卡离场或暂时化灰后失效，不能靠换卡或换技能绕过次数限制。</p><h3>Boss主动技能与弃牌</h3><p>每位守关者使用与自身角色和技能搭配的专属卡组。Boss名字旁显示专属技能，点按或悬停阅读时机、代价与本回合状态。从第2回合开始，每次成功发动消耗一张未冻结的手牌余芯，随后跳过下一回合，再下一回合才能重用；没有目标或代价不足时，不扣余芯也不进入冷却，敌我一致。部署类在敌方部署时使用，攻击后类在双方攻击结算后使用。主动丢弃手牌不触发亡语、死亡抽牌或复燃，抽牌仍消耗有限牌堆。双方弃牌堆可在战斗记录中查看。</p><p>暂时余芯化会覆盖玩家下一次完整行动，之后恢复原卡当前攻血与成长，不回满血、不重复入场。余芯被杀或献祭后不再恢复，也不触发原卡亡语；刚恢复的卡有一轮再次变形免疫。</p><h3>鎏金稀有与亡语</h3><p>共有${POOL.filter(c=>c.rarity==='rare'&&!c.token).length}张鎏金卡，含全部96位轮回Boss与旧版收藏，攻防均高于对应普通版。普通通关奖励有5%概率出现当前Boss的鎏金，可从三张中任选一张。每个轮回通关第16关后，必定出现该作品三张不同Boss鎏金卡，任选一张加入卡组。成长卡每次以自身攻击击杀敌方卡牌后攻击加1，直击生命或中毒击杀不触发。亡语在死亡和献祭时触发。鎏金灯蛛优先生成于原格与最近空格，位置不足则进入手牌；召唤物须存活到下一回合才能献祭。亡语召唤物不计入稀有收集卡。</p><h3>苔庭潜印客·莫恩与冻结</h3><p>苔庭潜印客·莫恩出场后，可选一张自己的手牌冻结。冻结本回合与下一回合，期间不能打出；第三回合开始自动解冻并减少1点献祭费用，最低0费。手牌上显示剩余回合。右键、Esc或“跳过”可放弃本次效果；已完成的部署不会撤回。冻结与减费仅在本次对战中有效。</p><h3>走位与先攻</h3><p>点选手牌，再选祭品与落点。选错时按鼠标右键或Esc，手机点击“取消”，即可清除选牌、祭品和位移选择。取消仅清除待确认选择，已完成的出牌或移动不会撤回。未选手牌时，点击带横移／换位的友军，再用左右按钮调整位置，每回合一次。换位后双方均不能再次移动；击退不追加攻击。</p><p>每轮回首关，先选契币正反，再点击灯契币投掷：猜中我方先手，否则Boss先手。金币伴随叮声和旋转声落定，再化成余芯交给后手。之后每位Boss的开场先手交替；同一场内逐回合交换先部署与先攻的一方。后手转先手时，Boss可能在回合切换前后连续部署；中央会显示新回合提示，战斗记录按回合分隔，这不代表新放下的余芯可在同回合献祭。双方都部署后才结算攻击，每张存活卡每回合最多攻击一次。守护可以拦截飞行；吸血和中毒只有造成伤害才生效。</p><h3>护盾与重战</h3><p>护盾只保护下一次受攻击，承受一次攻击后即失效；即使守护或弹反将伤害降为0，也会消耗护盾。普通敌卡死亡不再因魂系关卡规则自动生成余芯，只有卡牌自身明确写出的能力才会留下遗骸；新生成的牌仍须等下一回合才能献祭。</p><p>首页和第一关可选择重战已经击败的单个Boss，未通关关卡锁定。重战使用最近保存的卡组，不覆盖主线存档，也不发通关奖励或累计死亡成长。</p><h3>轮回配乐</h3><p>每个轮回按第1–4、5–8、9–12、13–15关分段切换原创配乐，第16关另用最终Boss曲，共30首。顶部音乐按钮可独立开关，按钮说明显示当前曲名与关卡段；静音偏好保存在当前浏览器，切后台暂停、返回恢复。游戏内本地合成，无需额外下载音乐。</p><h3>回去的路</h3><p>你是误入异界的旅人。选择守关者的奖励卡，意味着接受对方同行；走过最后一扇门后会回到雾林，伙伴、收藏、牌组与重战解锁都会保留。每次循环仍有六个世界、九十六场对局。</p><p>苔雾荒庭 → 铜钟堡垒 → 炽砂熔城 → 暮潮港湾 → 霜枝高地 → 星铸天穹。每轮16位不同守关者，共96关；难度与电脑决策逐轮提升。通关后沿用已获得的出战卡组与备用牌。晋阶和跨难度卡组保存在当前浏览器，回到首页可继续管理；主线在安全出牌节点及关卡结束后自动保存，重新载入会继续上次未完成的位置；未领取奖励保留。第36回合仍未分胜负时，按生命、场面战力裁决；完全同分玩家获胜。</p><p class="drawer-note">手牌较多时可左右滑动；手机长按卡牌查看介绍与完整技能，也可选牌后点“详情”。主线安全节点自动保存；新手与重战不覆盖主线存档。</p></div>`}
function selectedCard(){return G?.sel!=null?G.hand[G.sel]:G?.moveSel!=null?G.p[G.moveSel]:null}
function drawerHTML(){
 let title='灯台手册',content=storyJournalButton()+rulesHTML();
 if(infoPanel==='logs'){title='战斗记录';content=`${G?`<button data-a="discard">查看双方弃牌堆 · ${(G.discard?.p||[]).length} / ${(G.discard?.e||[]).length}</button>`:''}<div class="log-copy">${(G?.log||[]).slice(-40).map(t=>`<p>${esc(t)}</p>`).join('')||'<p>牌局尚未开始。</p>'}</div>`}
 if(infoPanel==='discard'){title='双方弃牌堆';content=bossDiscardHTML()}
 if(infoPanel==='details'){const c=detailCardOverride||selectedCard();title=c?displayedCardName(c):'卡牌详情';content=c?`<div class="detail-card">${cardHTML(c)}<p>${esc(cardNarrative(c)||'灯火未熄，继续你的旅途。')}</p><dl>${cardTip(c).split('¦').map(line=>`<div>${esc(line)}</div>`).join('')}</dl></div>`:'<p>选择一张手牌或战场上的友军，即可查看完整属性。</p>'}
 return `<div class="drawer-backdrop"><button class="drawer-scrim" data-a="closepanel" aria-label="关闭面板"></button><section class="info-drawer" role="dialog" aria-modal="true" aria-labelledby="drawer-title"><div class="drawer-head"><h2 id="drawer-title">${esc(title)}</h2><button data-a="closepanel" aria-label="关闭面板">关闭 ×</button></div><div class="drawer-scroll">${content}</div></section></div>`;
}
function battleMessage(){const hc=selectedCard();return G.busy?'烛火摇曳，战斗结算中…':G.freezeChoice?'苔庭潜印客·莫恩：点一张手牌冻结两回合，解冻减1费；取消可跳过':G.mustDraw?'已获余芯。选择抽卡，或再取余芯。':G.sel!=null?frozenTurns(hc)?hc.bossFrozenUntil>G.turn&&!(hc.frozenUntil>G.turn)?'Boss冰封：当前不能打出，恢复后费用不变':`冻结剩余 ${frozenTurns(hc)} 回合，不能打出；解冻后减1费（最低0）`:G.sac.size<hc.c?`选择 ${hc.c-G.sac.size} 张祭品，新牌下回合可献祭`:'点击空格或选中的祭品位置落牌':G.moveSel!=null?MOVE_HELP[hc.mv]||'点详情阅读卡牌能力，或选择手牌部署':'选择手牌部署，或点选位移卡调整位置'}
function homepageHTML(){return `<main class="home-screen title-screen"><section class="home-hero"><div class="home-brand"><span class="home-eyebrow">${esc(storyCopy('home','eyebrow'))}</span><h1>灯誓牌</h1><p class="subtitle">${esc(storyCopy('home','subtitle'))}</p></div><div class="home-fire"><img src="${BONFIRE_GIF}" alt="燃烧的剑与灯台"></div><p class="home-caption">${esc(storyCopy('home','caption'))}</p><p class="home-tribute">${esc(storyCopy('home','text'))}</p><div class="home-stats"><span><b>5</b> 席战场</span><span><b>7</b> 点灯火</span><span><b>${POOL.length}</b> 张卡牌</span></div></section><section class="home-console"><div class="console-heading"><span>REOPEN THE FILE</span><h2>继续调查</h2></div>${journeyHTML()}<p class="home-mode">第${campaignIndex()+1}轮 · ${GAME_META[difficulty][0]} · 关间回复${RULES[difficulty].heal}点灯火</p><label class="name-label" for="nm">行灯者姓名</label><input id="nm" maxlength="${typeof i18nNameLimit==='function'?i18nNameLimit():5}" value="${esc(pname)}" placeholder="输入姓名，或留空随机" autocomplete="off"><button class="pri home-start" data-a="start">${esc(storyCopy('home',journey.cleared===DIFFICULTY_ORDER.length||journey.loops?'return':'start'))}<span aria-hidden="true">✦</span></button><div class="home-secondary"><button class="deck-access" data-a="deckmanager">${deckIconHTML()}我的卡组 · ${getCampaignCarry(activeDifficulty())?.deck.length||(validDeck(customDeck)?customDeck.length:STARTER.length)}</button><button data-a="rules">玩法手册</button>${typeof replayButtonHTML==='function'?replayButtonHTML():''}</div><p class="home-cancel-hint">鼠标右键 / Esc 取消选择 · 手机点“取消”</p><p class="home-save-note">主线进度自动保存 · 重新载入继续未完成的战斗</p>${identityHomepageHTML()}${checkpointHomepageHTML()}</section><footer class="author-credit" aria-label="作者：Will Wang">${typeof languageSwitchHTML==='function'?languageSwitchHTML():''}${storyJournalButton()}<span class="author-signature"><span class="author-label">作者：</span><span class="sig">Will Wang</span></span></footer></main>`}
function selectionControlsHTML(){
 const mc=G.moveSel!=null?G.p[G.moveSel]:null,selected=selectedCard();let h='';
 if(mc&&['shift','swap'].includes(mc.mv))h+=`<div class="move-controls"><button data-a="move" data-d="-1" ${canMove('p',G.moveSel,-1)&&!G.busy&&!G.mustDraw?'':'disabled'} aria-label="左移一格">← 左移</button><span>${esc(mc.n)}<small>${mc.moved===G.turn?'本回合已移动':MOVE_LABEL[mc.mv]+' · 每回合一次'}</small></span><button data-a="move" data-d="1" ${canMove('p',G.moveSel,1)&&!G.busy&&!G.mustDraw?'':'disabled'} aria-label="右移一格">右移 →</button></div>`;
 else h+=`<p class="msg battle-message" aria-live="polite">${esc(battleMessage())}</p>`;
 if(hasSelection())h+=`<button class="cancel-selection" data-a="cancel" ${G.busy?'disabled':''} aria-label="${G.freezeChoice?'跳过苔庭潜印客·莫恩的冻结效果':'取消当前选择'}">${G.freezeChoice?'跳过':'取消'}</button>`;
 h+=`<button class="card-info-button" data-a="${selected?'details':'logs'}" aria-label="${selected?'卡牌详情':'战斗记录'}">${selected?'详情':'记录'}</button>`;
 return h;
}
function selectionInspectionHTML(selected){return selected?`<div class="inspection-card">${cardHTML(selected)}</div><p>${esc(cardNarrative(selected)||'灯火仍在，命运未定。')}</p><button data-a="details">阅读完整能力</button>`:`<div class="table-seal" aria-hidden="true">✦</div><h3>读懂战局，再落一牌</h3><p>点选手牌查看属性。<br>带绿色刻印的友军可调整位置。</p>`}
let renderedBattleSelection=null;
function rememberBattleSelection(){
 renderedBattleSelection=G&&OV===null?{game:G,turn:G.turn,hand:[...G.hand],p:[...G.p],e:[...G.e],freezeChoice:G.freezeChoice}:null;
}
function renderSelection(){
 const A=document.getElementById('app'),saved=renderedBattleSelection,shell=A.querySelector('.game-shell');
 if(!G||OV!==null||G.tutorial||DM||HOLD_DETAIL||infoPanel||drawRunning||!shell||!saved||saved.game!==G||saved.turn!==G.turn||saved.freezeChoice!==G.freezeChoice||A.querySelector('.drawer-backdrop,.deck-manager-backdrop,.card-hold-backdrop,.tutorial-layer')||['hand','p','e'].some(key=>G[key].length!==saved[key].length||G[key].some((c,i)=>c!==saved[key][i]))){render();return}
 hideTip();cancelPendingCardHold();
 const hc=G.sel!=null?G.hand[G.sel]:null,selected=selectedCard();
 const toggle=(node,key,on)=>{if(node.classList.contains(key)!==!!on)node.classList.toggle(key,!!on)};
 shell.querySelectorAll('.hand [data-a="h"]').forEach((node,i)=>toggle(node,'sel',i===G.sel));
 G.p.forEach((c,i)=>{
  const node=document.getElementById('c-p-'+i);if(!node)return;
  const sac=G.sac.has(i),ok=!!hc&&!frozenTurns(hc)&&G.sac.size===hc.c&&(!c||sac);
  if(c){toggle(node,'sacrificing',sac);toggle(node,'move-selected',G.moveSel===i);toggle(node,'can-move',['shift','swap'].includes(c.mv)&&c.moved!==G.turn);toggle(node,'fresh',c.t===G.turn);const outline=ok?'2px solid var(--candle)':'';if(node.style.outline!==outline)node.style.outline=outline}
  else toggle(node,'ok',ok);
 });
 const controls=shell.querySelector('.interaction-bar'),markup=selectionControlsHTML();
 if(controls._selectionMarkup!==markup){controls.innerHTML=markup;controls._selectionMarkup=markup}
 const inspection=shell.querySelector('.sidebar-inspection');
 if(inspection._selectionCard!==selected){inspection.innerHTML=selectionInspectionHTML(selected);inspection._selectionCard=selected}
}
function render(){
 hideTip();cancelPendingCardHold();const A=document.getElementById('app');boardObserver?.disconnect();
 A.classList.toggle('catalog-mode',OV==='catalog');A.classList.toggle('home-mode',OV==='title');A.classList.toggle('battle-mode',!!G&&OV!=='title'&&OV!=='catalog');
 if(OV==='catalog'){A.innerHTML=catalogueHTML()+(DM?deckManagerHTML():'')+cardHoldHTML();const catalog=A.querySelector('.catalog-shell');if(catalog)catalog.inert=!!DM||!!HOLD_DETAIL;const manager=A.querySelector('.deck-manager-backdrop');if(manager)manager.inert=!!HOLD_DETAIL;return}
 let h='';
 if(G&&OV!=='title'){
 const hc=G.sel!=null?G.hand[G.sel]:null,mc=G.moveSel!=null?G.p[G.moveSel]:null,selected=hc||mc,drawPreview=tutorialOverviewDraw();
 h+=`<main class="game-shell"><header class="hdr table-topbar"><div class="table-brand"><span class="table-emblem" aria-hidden="true">✦</span><div><strong>灯誓牌</strong><small>${bossStageLabelHTML()}</small></div></div><nav class="table-tools" aria-label="游戏设置">${typeof replayButtonHTML==='function'?replayButtonHTML():''}<button class="icon-toggle" data-a="mute" aria-pressed="${!mute}" aria-label="${mute?'开启':'关闭'}音效">音效 ${mute?'关':'开'}</button>${languageToggleHTML()}<button class="icon-toggle" data-a="mus" aria-pressed="${!mmute}" aria-label="${mmute?'开启':'关闭'}音乐；${esc(musicNowTitle())}" title="${esc(musicNowTitle())}">音乐 ${mmute?'关':'开'}</button><button class="deck-access" data-a="deckmanager" aria-label="查看我的卡组">${deckIconHTML()}卡组</button><button data-a="rules" aria-label="玩法手册">规则</button></nav></header>`;
 h+=`<section class="opponent-hud side-hud" aria-label="敌方生命与牌库">${healthHTML('e')}<div class="opponent-stock side-stock">${pileHTML('e')}<div class="enemy-hand" aria-label="敌方手牌${G.eh.length}张">${G.eh.map((c,i)=>`<div class="card-back ${i<G.eh.length-5?'hand-tucked':''} ${frozenTurns(c)?'is-frozen':''}" data-index="${i}" aria-label="${frozenTurns(c)?'冻结中的敌方手牌，剩余'+frozenTurns(c)+'回合':'隐藏的敌方手牌'}"></div>`).join('')}<span class="enemy-hand-count">${G.eh.length}</span></div></div></section>`;
 h+=`<section class="table-arena" aria-label="五席战场">${G.phase==='round-start'&&roundFirstSide()==='e'?`<div class="round-start-notice" role="status"><small>上一回合已结束</small><strong>第 ${G.turn} 回合</strong><span>Boss先部署 · 旧祭品已可献祭</span></div>`:''}<div class="row board enemy-board">${G.e.map((c,i)=>c?cardHTML(c,c.t===G.turn?'fresh':'',`id="c-e-${i}" data-a="enemyinfo" data-i="${i}" tabindex="0"`):`<div class="slot" id="c-e-${i}"><small>${i+1}</small><span aria-hidden="true">◇</span></div>`).join('')}</div><div class="round-banner"><span>第 ${G.turn} / ${MATCH_LIMIT} 回合</span><i aria-hidden="true"></i><b>${roundFirstSide()==='p'?'我方':'Boss'}先手</b><i aria-hidden="true"></i><span>双方各结算一次</span></div><div class="row board player-board">${G.p.map((c,i)=>{const ok=hc&&!frozenTurns(hc)&&G.sac.size===hc.c&&(!c||G.sac.has(i)),sac=G.sac.has(i),mobile=c&&['shift','swap'].includes(c.mv)&&c.moved!==G.turn;return c?cardHTML(c,(sac?'sacrificing ':'')+(G.moveSel===i?'move-selected ':'')+(mobile?'can-move ':'')+(c.t===G.turn?'fresh':''),`id="c-p-${i}" data-a="s" data-i="${i}" tabindex="0" ${ok?'style="outline:2px solid var(--candle)"':''}`):`<div class="slot ${ok?'ok':''}" id="c-p-${i}" data-a="s" data-i="${i}" tabindex="0"><small>${i+1}</small><span aria-hidden="true">◇</span></div>`}).join('')}</div></section>`;
 h+=`<section class="player-vitals side-hud" aria-label="我方生命与牌库">${healthHTML('p')}<div class="opponent-stock player-stock side-stock">${pileHTML('p')}<div class="reserve-summary"><div class="ash-source" id="ash-source" role="img" aria-label="余芯来源">灰</div><span class="own-hand-count" aria-label="我方手牌${G.hand.length}张"><small>手牌</small><b>${G.hand.length}</b></span></div></div></section><section class="interaction-bar">`;
 h+=selectionControlsHTML()+'</section>';
 h+=`<aside class="table-sidebar"><div class="sidebar-heading"><span>CASE FILE · 03:17</span><b>${RULES[difficulty].name.split(' · ')[0]}轮回</b></div><p class="stage-rule">${esc(G.st.pd)}</p><div class="sidebar-inspection">${selectionInspectionHTML(selected)}</div><div class="sidebar-actions"><button data-a="logs">战斗记录</button><button data-a="rules">灯台手册</button></div></aside>`;
 h+=`<section class="player-dock"><div class="hand-rack"><div class="hand" aria-label="我方手牌，可左右滑动">${G.hand.map((c,i)=>cardHTML(c,(i===G.sel?'sel ':'')+(G.freezeChoice&&!frozenTurns(c)?'freeze-target':''),`data-a="h" data-i="${i}" tabindex="0" aria-label="${esc(c.n)}${frozenTurns(c)?'，冻结剩余'+frozenTurns(c)+'回合，不能打出':G.freezeChoice?'，点击冻结两回合，解冻减1费':''}"`)).join('')}</div></div><div class="action-column"><span class="action-caption">${G.mustDraw||drawPreview?'DRAW FROM THE FILE':'ENTER INTO RECORD'}</span><div class="ctl">${G.mustDraw||drawPreview?`<button class="pri" data-a="deck" ${G.draw.length&&!G.busy?'':'disabled'}>抽卡组 · ${G.draw.length}</button><button data-a="sq" ${G.busy?'disabled':''}>再取余芯</button>`:`<button class="pri" data-a="end" ${G.busy||G.freezeChoice?'disabled':''}>${G.busy?'战斗结算中…':G.freezeChoice?'请选择冻结手牌':'结束部署'}<small>${roundFirstSide()==='p'?'我方':'Boss'}先手</small></button>`}</div></div></section></main>`;
 }
 if(OV==='title')h=homepageHTML();
 if(OV==='win')h+=campaignRewardHTML();
 if(OV==='replay-result'&&typeof replayResultHTML==='function')h+=replayResultHTML();
 if(OV==='camp')h+=`<div class="ov modal-screen camp-screen"><span class="modal-kicker">REVIEW THE FILE</span><h2>灯台旁 · 整理卡组</h2><p>已领取「${esc(G.newReward?.n||'奖励卡')}」<br>出战 ${G.deck.length}/36 张 · 备用 ${(G.reserve||[]).length} 张 · 推荐24张</p><p>已达到36张出战上限。可以保留当前卡组，或将卡移入备用，再把需要的卡重新编入。</p><button class="deck-access" data-a="deckmanager">${deckIconHTML()}管理本轮卡组</button><button class="pri" data-a="camp-continue">${G.lv>=STG.length?'完成本轮挑战':'继续下一关'}</button></div>`;
 if(OV==='dead')h+=`<div class="ov modal-screen identity-death-screen"><h2>你死了</h2><p>死于「${esc(G.dc.by)}」<br>通过 ${G.wins}/${STG.length} 关 · 击杀 ${G.kills} 个敌人</p>${playerDeathEchoHTML()}${G.identityChoice?'':cardHTML(G.dc,'','id="death-identity-card"')}${identityDeathHTML()}<button class="pri" data-a="title" ${G.identityChoice?'disabled':''}>回到灯台</button></div>`;
 if(OV==='clear')h+=storyClearHTML();
 if(infoPanel)h+=drawerHTML();if(DM)h+=deckManagerHTML();h+=cardHoldHTML();
 A.innerHTML=h;const surface=A.querySelector('.game-shell,.home-screen');if(surface)surface.inert=!!HOLD_DETAIL||!!DM||!!infoPanel||(surface.classList.contains('game-shell')&&OV!==null);
 A.querySelectorAll('.deck-manager-backdrop,.drawer-backdrop,.modal-screen').forEach(node=>node.inert=!!HOLD_DETAIL);
 layoutGame();const arena=A.querySelector('.table-arena');if(arena&&window.ResizeObserver){if(!boardObserver)boardObserver=new ResizeObserver(scheduleLayout);boardObserver.observe(arena)}
 rememberBattleSelection();syncMusic();flushDraws();renderTutorial();if(typeof checkpointSave==='function')checkpointSave();
}
function layoutGame(){
 const shell=document.querySelector('.game-shell'),row=document.querySelector('.row.board'),hand=document.querySelector('.hand');
 let battleWidth=null,handWidth=null;
 if(shell&&row){const r=row.getBoundingClientRect(),gap=parseFloat(getComputedStyle(row).gap)||4;const w=Math.floor(Math.min(144,(r.width-gap*4)/5,r.height/1.4));battleWidth=Math.max(24,w)+'px'}
 if(shell&&hand){const r=hand.getBoundingClientRect(),w=Math.floor(Math.min(88,(r.width-26)/5,(r.height-15)/1.4));handWidth=Math.max(28,w)+'px'}
 if(battleWidth&&shell.style.getPropertyValue('--battle-card-width')!==battleWidth)shell.style.setProperty('--battle-card-width',battleWidth);
 if(handWidth&&shell.style.getPropertyValue('--hand-card-width')!==handWidth)shell.style.setProperty('--hand-card-width',handWidth);
 positionTutorial();
}
let layoutTimer=0;
function scheduleLayout(){
 if(layoutFrame||layoutTimer)return;
 const run=()=>{if(layoutFrame)cancelAnimationFrame(layoutFrame);clearTimeout(layoutTimer);layoutFrame=0;layoutTimer=0;layoutGame()};
 layoutTimer=setTimeout(run,60);layoutFrame=requestAnimationFrame(run);
}
function updateViewport(){const view=window.visualViewport;document.documentElement.classList.toggle('keyboard-open',!!view&&view.height<window.innerHeight*.75&&['INPUT','TEXTAREA'].includes(document.activeElement?.tagName));if(!view||view.scale===1){const height=(view?.height||window.innerHeight)+'px';if(document.documentElement.style.getPropertyValue('--app-height')!==height)document.documentElement.style.setProperty('--app-height',height)}scheduleLayout()}
window.addEventListener('resize',updateViewport);window.addEventListener('orientationchange',updateViewport);window.visualViewport?.addEventListener('resize',updateViewport);updateViewport();

function hasSelection(){return !!G&&(G.freezeChoice||G.sel!=null||G.moveSel!=null||G.sac.size>0)}
function cancelSelection(){
 if(!G||DM||HOLD_DETAIL||OV!==null||G.busy||drawRunning||!hasSelection())return false;
 if(G.freezeChoice){G.freezeChoice=false;logBattle('已跳过苔庭潜印客·莫恩的冻结效果，苔庭潜印客·莫恩保持在场。')}
 G.sel=null;G.moveSel=null;G.sac.clear();
 if(infoPanel==='details'){infoPanel=null;detailCardOverride=null}
 renderSelection();return true;
}
document.addEventListener('contextmenu',event=>{
 if(!document.getElementById('app').contains(event.target)||event.target.closest('input,textarea,select,[contenteditable]'))return;
 if(cancelSelection())event.preventDefault();
});
function nextStage(){if(G.lv>=STG.length){OV='clear';render();return}G.lv++;battle()}
document.addEventListener('click',async event=>{
 if(tutorialOverviewClick(event))return;
 const t=event.target.closest('[data-a]');if(!t)return;const action=t.dataset.a,i=Number(t.dataset.i);
 if(cardHoldClick(action))return;
 if(deckManagerClick(action,t))return;
 if(action==='closepanel'){infoPanel=null;detailCardOverride=null;render();return}
 if(action==='cancel'){cancelSelection();return}
 if(action==='identity-keep'||action==='identity-replace'){identityChoose(action==='identity-keep'?'keep':'replace');return}
 if(G?.busy||drawRunning)return;
 if(tutorialHandle(action,i))return;
 if(action==='enemyinfo'&&G&&!OV&&G.e[i]){detailCardOverride=G.e[i];infoPanel='details';render();requestAnimationFrame(()=>document.querySelector('.drawer-head button')?.focus());return}
 if(['rules','logs','details','discard'].includes(action)){detailCardOverride=null;infoPanel=action;render();requestAnimationFrame(()=>document.querySelector('.drawer-head button')?.focus());return}
 if(action==='catalog'){infoPanel=null;detailCardOverride=null;returnOV=OV;OV='catalog';catalogPage=0;render();return}
 if(action==='closecat'){OV=returnOV;render();return}
 if(OV==='catalog'){
 if(action==='prev')catalogPage=Math.max(0,catalogPage-1);if(action==='next')catalogPage++;render();return;
 }
 if(action==='title'){if(G?.identityChoice)return;if(typeof checkpointSave==='function')checkpointSave();G=null;difficulty=activeDifficulty();OV='title';render();return}
 if(action==='nextdifficulty'&&OV==='clear'){const current=DIFFICULTY_ORDER.indexOf(difficulty);if(current<DIFFICULTY_ORDER.length-1&&journey.cleared<=current)return;if(current===DIFFICULTY_ORDER.length-1&&!beginNextStoryLoop())return;newRun();return}
 if(action==='mute'){mute=!mute;render();return}
 if(action==='mus'){musicMute(!mmute);render();return}
 if(action==='start'){const name=document.getElementById('nm');pname=(name?.value.trim().slice(0,typeof i18nNameLimit==='function'?i18nNameLimit():5))||(typeof gameLanguage!=='undefined'&&gameLanguage==='en'?englishCardName(NAMES[rnd(NAMES.length)]):shortCardName(NAMES[rnd(NAMES.length)]));try{localStorage.setItem('lo_name',pname)}catch{}if(tutorialNeeded())startTutorial();else{if(journey.cleared===DIFFICULTY_ORDER.length&&!beginNextStoryLoop())return;newRun()}return}
 if(action==='rw'&&OV==='win'){claimReward(i);return}
 if(action==='rw-confirm'&&OV==='win'){confirmCampaignReward();return}
 if(!G||OV)return;
 if(G.freezeChoice){if(action==='h'&&freezeHandCard('p',i))render();return}
 if(action==='end'){await endTurn();return}
 if(action==='deck'&&G.mustDraw&&G.draw.length){takeCard('p');G.mustDraw=0;render();await drawIdle;render();return}
 if(action==='sq'&&G.mustDraw){takeCard('p',true);G.mustDraw=0;render();await drawIdle;render();return}
 if(G.mustDraw)return;
 if(action==='h'){G.sel=G.sel===i?null:i;G.moveSel=null;G.sac.clear();renderSelection();return}
 if(action==='move'&&G.moveSel!=null){G.busy=1;await moveCard('p',G.moveSel,Number(t.dataset.d));G.busy=0;render();return}
 if(action==='s'){
 if(G.sel==null){G.moveSel=G.p[i]?i:null;renderSelection();return}
 const c=G.hand[G.sel],occupant=G.p[i];if(!c||frozenTurns(c))return;
 if(G.sac.has(i)&&G.sac.size===c.c){await commit(i);return}
 if(occupant){if(G.sac.has(i))G.sac.delete(i);else if(G.sac.size<c.c&&canSacrificeCard('p',i))G.sac.add(i)}else if(G.sac.size===c.c){await commit(i);return}renderSelection();
 }
});
document.addEventListener('change',event=>{const t=event.target;if(t.id==='catgame'){catalogGame=t.value;catalogPage=0;render()}if(t.id==='catkind'){catalogKind=t.value;catalogPage=0;render()}if(t.id==='catrarity'&&['all','rare','common'].includes(t.value)){catalogRarity=t.value;catalogPage=0;render()}});
document.addEventListener('input',event=>{if(event.target.id!=='catsearch')return;const pos=event.target.selectionStart;catalogSearch=event.target.value;catalogPage=0;render();const input=document.getElementById('catsearch');input?.focus();input?.setSelectionRange(pos,pos)});
document.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-a][tabindex]')){event.preventDefault();event.target.click()}});

document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(DM){event.preventDefault();closeDeckManager();return}if(infoPanel){infoPanel=null;detailCardOverride=null;render();return}if(cancelSelection())event.preventDefault()});
document.addEventListener('focusin',updateViewport);document.addEventListener('focusout',()=>requestAnimationFrame(updateViewport));
__AI_SOURCE__
__BOSS_AI_POLICY_SOURCE__
async function aiDeployChoice(choice,animate){
 if(!choice||!G)return false;
 const {c,i,sacs,lane}=choice,game=G;
 // Recheck the exact live instances before spending: forecast plans are never authority.
 if(!c||!Number.isInteger(i)||G.eh[i]!==c||frozenTurns(c)||!Array.isArray(sacs)||sacs.length!==(c.c||0)||new Set(sacs).size!==sacs.length||!Number.isInteger(lane)||lane<0||lane>=G.e.length||G.e[lane]&&!sacs.includes(lane)||sacs.some(j=>!canSacrificeCard('e',j)))return false;
 G.eh.splice(i,1);
 if(animate&&sacs.length){sacs.forEach(j=>{const node=el('e',j);if(node)burn(node)});snd('burn');await wait(250);if(G!==game)return false}
 const deaths=[];
 for(const j of sacs){const card=G.e[j];kill('e',j,null,'sacrifice',deaths);sacFx(card)}
 aiNormaliseWick(c);G.e[lane]=c;c.t=G.turn;deaths.forEach(resolveDeath);
 logBattle(`敌方在第${lane+1}格召唤${c.n}`);render();await drawIdle;if(G!==game)return false;
 await enterEffects('e',c);if(G!==game)return false;
 if(typeof bossOnUnitDeploy==='function')bossOnUnitDeploy('e',lane,c);
 if(animate){snd('eplace');await wait(180)}
 return G===game;
}
async function enemyPlay6(animate=true,initial=false){
 if(G.tutorial)return;const game=G;
 if(!initial){
  if(takeCard('e')){render();await drawIdle;if(G!==game)return}
  const ash=takeCard('e',true);aiNormaliseWick(ash);render();await drawIdle;if(G!==game)return;
 }
 // Zero-cost fighters and the one ash have their own small deployment budget;
 // ash is actually played from hand, and cannot be sacrificed immediately.
 let ashPlayed=false,zeroPlayed=0;
 const paidBudget=aiPaidPlayBudget();let paid=0;
 for(let step=0;step<paidBudget+3;step++){
  const choice=aiChooseDeployment({noWick:ashPlayed,noPaid:paid>=paidBudget,noZero:zeroPlayed>=1,paidRemaining:paidBudget-paid});if(!choice)break;
  if(aiWick(choice.c)){if(ashPlayed)break;ashPlayed=true}
  else if(choice.c.c===0){if(zeroPlayed>=1)break;zeroPlayed++}
  else{if(paid>=paidBudget)break;paid++}
  if(!await aiDeployChoice(choice,animate)||G.hp<=0||G.ehp<=0)return;
 }
 // A high-scoring paid candidate may have exhausted its budget before the
 // ash candidate was reached. Still provide at most one useful future ash.
 if(!ashPlayed){const ash=aiChooseDeployment({ashOnly:true});if(ash&&!await aiDeployChoice(ash,animate))return}
 if(G!==game)return;const applied=runBossAbility('deploy');render();await drawIdle;
 // A failed deployment power may release its held ash as next-round material.
 // Attack-end powers keep it in hand because their conditions are evaluated later.
 if(G!==game)return;
 if(!applied&&!ashPlayed&&typeof bossAbilityForStage==='function'&&bossAbilityForStage()?.timing==='deploy'){
  const ash=aiChooseDeployment({ashOnly:true,ignoreSkillReserve:true});if(ash)await aiDeployChoice(ash,animate);
 }
}
enemyPlay=enemyPlay6;

async function enemyMoves6(){
 const game=G;
 for(const c of [...G.e]){
  const i=G.e.indexOf(c);if(i<0||!c||!['shift','swap'].includes(c.mv))continue;
  const choice=aiChooseMove(i);if(choice)await moveCard('e',i,choice.d,true);
  if(G!==game)return;
 }
}
enemyMoves=enemyMoves6;
/* Campaign initiative: an original engraved dragon coin, drawn inline for offline play. */
let INITIATIVE_COIN_SESSION = null;

// A short original metallic chime and decelerating ring; effects bus only.
const INITIATIVE_COIN_SOUND_VOICES=new Set();
let initiativeCoinSoundPlays=0;
function stopInitiativeCoinSounds(){for(const voice of [...INITIATIVE_COIN_SOUND_VOICES]){try{voice.source.stop()}catch{}voice.cleanup()}}
function initiativeCoinAudioState(){return {voices:INITIATIVE_COIN_SOUND_VOICES.size,plays:initiativeCoinSoundPlays}}
function playInitiativeCoinSound(phase='toss',seconds=1.05){
 if(document.hidden||typeof mute!=='undefined'&&mute)return false;
 const c=typeof au==='function'?au():null;if(!c||c.state==='closed')return false;
 const now=c.currentTime+.006,output=c.mg||c.destination;
 const note=(frequency,offset,duration,volume,ratio=1)=>{
  let source,gain,voice;
  try{
   source=c.createOscillator();gain=c.createGain();source.type='sine';source.frequency.setValueAtTime(frequency,now+offset);source.frequency.exponentialRampToValueAtTime(frequency*ratio,now+offset+duration);
   gain.gain.setValueAtTime(.00001,now+offset);gain.gain.linearRampToValueAtTime(volume,now+offset+.002);gain.gain.exponentialRampToValueAtTime(.00001,now+offset+duration);
   source.connect(gain);gain.connect(output);let cleaned=false;
   voice={source,cleanup(){if(cleaned)return;cleaned=true;INITIATIVE_COIN_SOUND_VOICES.delete(voice);try{source.disconnect();gain.disconnect()}catch{}}};
   INITIATIVE_COIN_SOUND_VOICES.add(voice);source.onended=voice.cleanup;source.start(now+offset);source.stop(now+offset+duration+.01);
  }catch{try{source?.stop();source?.disconnect();gain?.disconnect()}catch{}if(voice)INITIATIVE_COIN_SOUND_VOICES.delete(voice)}
 };
 initiativeCoinSoundPlays++;
 if(phase==='toss'){
  note(1760,0,.29,.095);note(3529,0,.2,.029);note(5118,.002,.13,.013);
  const span=Math.max(.27,Math.min(1.2,seconds));
  [.09,.15,.225,.315,.425,.55,.69,.825,.94].forEach((x,i)=>{
   const t=x*span,pitch=[2790,3460,2340,3890,2570,3280,2210,3100,2680][i];
   note(pitch,t,.024+i*.003,.024-i*.001,1.025);note(pitch*1.47,t+.002,.018+i*.003,.009-i*.0004,.985);
  });
 }else if(phase==='land'){note(2480,0,.12,.037);note(3717,.025,.11,.016);note(1660,.063,.15,.022)}
 else if(phase==='ash'){note(493.9,0,.18,.021,1.18);note(741,.035,.23,.01,1.12)}
 return true;
}

function initiativeCoinWickHTML(){
 if(typeof cardHTML==='function'&&typeof SQ!=='undefined')return cardHTML({...SQ,fod:true},'coin-bonus-card');
 return '<div class="card coin-bonus-card"><div class="top"><b>余芯</b></div><div class="art"><span>灰</span></div><div class="sg">祭品</div><div class="st"><span>0</span><span>1</span></div></div>';
}

__COIN_SOURCE__
function cancelInitiativeCoin() {
 const session = INITIATIVE_COIN_SESSION;
 if (session) session.finish(null);
}

function openInitiativeCoin() {
 cancelInitiativeCoin();
 return new Promise(resolve => {
  const previousFocus = document.activeElement;
  const wrapper = document.createElement('div');
  const suffix = Date.now().toString(36);
  const session = { wrapper, timers: [], flights: [], animations: [], choice: null, tossing: false, finished: false };
  INITIATIVE_COIN_SESSION = session;
  wrapper.className = 'initiative-coin-screen';
  wrapper.dataset.coinFace = 'heads';
  wrapper.innerHTML = `<section class="initiative-coin-panel" role="dialog" aria-modal="true" aria-labelledby="initiative-coin-heading" aria-describedby="initiative-coin-help" tabindex="-1">
   <span class="initiative-coin-kicker">命运的第一掷</span>
   <h2 id="initiative-coin-heading">以灯塔，定先手</h2>
   <p id="initiative-coin-help">选择正面或反面，再点击金币掷出。<br>猜中你先手，否则 Boss 先手。</p>
   <div class="initiative-coin-table">
    <button type="button" class="initiative-coin-choice" data-coin-choice="heads" aria-pressed="false"><span>正面</span><small>灯塔纹章</small></button>
    <div class="initiative-coin-stage">
     <span class="initiative-coin-halo" aria-hidden="true"></span>
     <button type="button" class="initiative-coin-toss" aria-label="请先选择正面或反面" disabled>
      <span class="initiative-coin-disc"><span class="initiative-coin-face initiative-coin-heads">${initiativeCoinArtwork('heads', suffix)}</span><span class="initiative-coin-face initiative-coin-tails">${initiativeCoinArtwork('tails', suffix)}</span></span>
     </button>
     <span class="initiative-coin-shadow" aria-hidden="true"></span>
    </div>
    <button type="button" class="initiative-coin-choice" data-coin-choice="tails" aria-pressed="false"><span>反面</span><small>罗盘纹章</small></button>
   </div>
   <div class="initiative-coin-result" role="status" aria-live="polite" aria-atomic="true"><b>先选择正反</b><span>然后点击中间的金币</span></div>
   <p class="initiative-coin-note">本轮回首关由金币决定先手。<br>后手额外获得1张余芯：先手5张，后手6张。<br>此后的 Boss 战，双方逐关交替先手出牌。</p>
  </section>`;
  const panel = wrapper.querySelector('.initiative-coin-panel');
  const tossButton = wrapper.querySelector('.initiative-coin-toss');
  const choiceButtons = [...wrapper.querySelectorAll('[data-coin-choice]')];
  const result = wrapper.querySelector('.initiative-coin-result');
  session.finish = winner => {
   if (session.finished) return;
   session.finished = true;
   session.timers.forEach(timer => clearTimeout(timer));
   session.animations.forEach(animation=>{try{animation.cancel()}catch{}});
   session.flights.forEach(flight=>flight.remove());
   stopInitiativeCoinSounds();
   wrapper.remove();
   if (INITIATIVE_COIN_SESSION === session) INITIATIVE_COIN_SESSION = null;
   if (previousFocus && previousFocus.isConnected && previousFocus.focus) previousFocus.focus({ preventScroll: true });
   resolve(winner);
  };
  const later = (callback, delay) => session.timers.push(setTimeout(() => { if (!session.finished) callback(); }, delay));
  const showStatus = (title, detail) => {
   result.querySelector('b').textContent = title;
   result.querySelector('span').textContent = detail;
  };
  choiceButtons.forEach(button => button.addEventListener('click', () => {
   if (session.tossing) return;
   session.choice = button.dataset.coinChoice;
   wrapper.dataset.coinFace = session.choice;
   wrapper.style.setProperty('--coin-start',session.choice === 'heads' ? '0deg' : '180deg');
   choiceButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
   tossButton.disabled = false;
   const label = session.choice === 'heads' ? '正面' : '反面';
   tossButton.setAttribute('aria-label', '已选择' + label + (session.choice === 'heads' ? '灯塔' : '罗盘') + '，点击掷出金币');
   showStatus('你选了' + label, '点击金币，掷出命运');
  }));
  tossButton.addEventListener('click', () => {
   if (!session.choice || session.tossing || session.finished) return;
   session.tossing = true;
   tossButton.disabled = true;
   choiceButtons.forEach(button => { button.disabled = true; });
   let bit;
   try {
    const random = new Uint32Array(1);
    window.crypto.getRandomValues(random);
    bit = random[0] & 1;
   } catch (_) { bit = Math.random() < .5 ? 0 : 1; }
   const face = bit === 0 ? 'heads' : 'tails';
   const winner = face === session.choice ? 'p' : 'e';
   const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
   const duration = reduced ? 120 : 1050;
   wrapper.style.setProperty('--coin-final', face === 'heads' ? '0deg' : '180deg');
   wrapper.classList.add('is-tossing');
   playInitiativeCoinSound('toss',duration/1000);
   showStatus('金币已掷出…', '火光之中，命运翻转');
   // A bounded timer also completes on iPhone/WeChat when animationend is not delivered.
   later(() => {
    wrapper.dataset.coinFace = face;
    wrapper.classList.remove('is-tossing');
    wrapper.classList.add('has-landed');
    playInitiativeCoinSound('land');
    const label = face === 'heads' ? '正面 · 灯塔纹章' : '反面 · 罗盘纹章';
    tossButton.setAttribute('aria-label', '投掷结果：' + label);
    showStatus(label, winner === 'p' ? '猜中了，你先手出牌' : 'Boss 先手出牌');
    later(() => {
     const loser=winner==='p'?'e':'p',who=loser==='p'?'你':'Boss';
     wrapper.dataset.bonusSide=loser;wrapper.classList.add('is-transmuting');
     showStatus('金币化作余芯',`${who}是后手，额外获得1张余芯`);
     const ash=document.createElement('div');ash.className='initiative-coin-ash';ash.setAttribute('aria-label','后手补偿：余芯，0攻1血0费');ash.innerHTML=initiativeCoinWickHTML();
     wrapper.querySelector('.initiative-coin-stage').appendChild(ash);playInitiativeCoinSound('ash');
     later(()=>{
      const from=ash.getBoundingClientRect(),target=document.querySelector(loser==='p'?'.hand':'.enemy-hand'),to=target?.getBoundingClientRect();
      const endX=to?.width?to.left+to.width*(loser==='p'?.68:.5):innerWidth*.5,endY=to?.height?to.top+to.height*.5:innerHeight*(loser==='p'?.83:.2);
      const flight=ash.cloneNode(true);flight.className='initiative-coin-flight';flight.dataset.bonusSide=loser;
      flight.style.cssText=`left:${from.left}px;top:${from.top}px;width:${from.width}px;height:${from.height}px`;session.flights.push(flight);wrapper.appendChild(flight);ash.style.visibility='hidden';wrapper.classList.add('is-awarding');
      const dx=endX-from.left-from.width/2,dy=endY-from.top-from.height/2,travel=reduced?160:650;
      try{const animation=flight.animate(reduced?[{opacity:1},{opacity:0}]:[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx*.36}px,${dy*.24-18}px) scale(.9)`,opacity:1,offset:.38},{transform:`translate(${dx}px,${dy}px) scale(.48)`,opacity:.16}],{duration:travel,easing:'cubic-bezier(.25,.55,.4,1)',fill:'forwards'});session.animations.push(animation)}catch{flight.style.transform=`translate(${dx}px,${dy}px) scale(.48)`}
      // No animation promise is awaited: old iOS/WeChat cannot strand the deal.
      later(()=>session.finish(winner),travel+40);
     },reduced?80:300);
    },700);
   }, duration);
  });
  wrapper.addEventListener('contextmenu', event => { event.preventDefault(); event.stopPropagation(); });
  wrapper.addEventListener('keydown', event => {
   if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); return; }
   if (event.key !== 'Tab') return;
   const focusable = [...wrapper.querySelectorAll('button:not(:disabled)')];
   if (!focusable.length) { event.preventDefault(); panel.focus({ preventScroll: true }); return; }
   const first = focusable[0], last = focusable[focusable.length - 1];
   if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) { event.preventDefault(); last.focus(); }
   else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.body.appendChild(wrapper);
  panel.focus({ preventScroll: true });
 });
}

// A later effects toggle must also silence already scheduled coin ticks.
document.addEventListener('click',event=>{if(event.target.closest('[data-a]')?.dataset.a==='mute'&&typeof mute!=='undefined'&&mute)stopInitiativeCoinSounds()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopInitiativeCoinSounds()});
window.addEventListener('pagehide',stopInitiativeCoinSounds);
// Combatant names keep their existing table positions and share one type scale.
function bossStageLabelHTML(){
 const stage=G.st;if(G.tutorial)return esc(stage.n);
 const boss=stage.boss||stage.n,split=stage.n.lastIndexOf(boss),region=split>=0?stage.n.slice(0,split).replace(/[\s·]+$/,''):'';
 return `${region?`<span class="stage-region">${esc(region)} · </span>`:''}<span class="combatant-name boss-name" title="${esc(boss)}">${esc(boss)}</span>${typeof bossAbilityButtonHTML==='function'?bossAbilityButtonHTML():''}<span class="stage-progress"> · ${G.lv}/${STG.length}关</span>`;
}
function healthHTML(side){
 const theme=G.st.pas,life=LIFE_ICONS[theme],hp=G.hp;
 return side==='e'?`<section class="life-panel enemy-life theme-${theme}" id="enemy-health" aria-label="敌方生命 ${G.ehp}/7"><div class="life-title"><span>${life.name}</span><b>${G.ehp}<small> / 7</small></b></div><div class="life-tokens">${Array.from({length:7},(_,i)=>`<svg class="life-token ${i<G.ehp?'lit':'spent'}" viewBox="0 0 36 38" aria-hidden="true">${life.icon}</svg>`).join('')}</div></section>`:`<section class="life-panel player-life" id="player-health" aria-label="${esc(pname)}，玩家生命 ${hp}/7"><div class="bonfire-stage"><img class="bonfire" src="${hp&&!matchMedia('(prefers-reduced-motion:reduce)').matches?BONFIRE_GIF:BONFIRE_STILL}" alt="${hp?hp+'档燃烧灯台':'灯台熄灭'}" style="--fire-size:${hp?(.38+hp*.088):.38};${hp?'':'filter:grayscale(1) brightness(.3);opacity:.5'}"></div><div class="candle-panel"><div class="life-title"><span class="combatant-name player-name" title="${esc(pname)} · 不灭灯火">${esc(pname)}</span>${typeof playerBossSkillButtonHTML==='function'?playerBossSkillButtonHTML():''}<b>${hp}<small> / 7</small></b></div><div class="candles">${Array.from({length:7},(_,i)=>`<span class="candle ${i<hp?'burning':'out'}" style="--delay:-${i*.23}s" aria-hidden="true"><i class="wick"></i><i class="candle-flame"></i></span>`).join('')}</div></div></section>`;
}
// Independent help popover: reading a skill never redraws or pauses the battle.
let BOSS_ABILITY_UI=null,bossAbilityUITimer=0,bossAbilityUICloseTimer=0,bossAbilityUIIgnoreClickUntil=0;
function bossAbilityUIConfig(){
 if(!G||G.tutorial)return null;
 if(typeof bossAbilityForStage==='function')return bossAbilityForStage();
 if(typeof BOSS_ABILITIES==='undefined')return null;
 return Array.isArray(BOSS_ABILITIES)?BOSS_ABILITIES.find(ability=>ability.boss===G.st.boss):BOSS_ABILITIES[G.st.boss];
}
function bossAbilityButtonHTML(){
 const ability=bossAbilityUIConfig();if(!ability)return '';
 return `<button class="boss-ability-trigger" type="button" data-boss-ability="open" aria-haspopup="dialog" aria-expanded="false" aria-controls="boss-ability-panel" aria-label="查看${esc(G.st.boss)}的技能：${esc(ability.name)}"><span aria-hidden="true">◇</span><span>${esc(ability.name)}</span><span class="boss-ability-help-mark" aria-hidden="true">?</span></button>`;
}
function bossAbilityUIStatus(){
 if(typeof bossAbilityStateLabel==='function')return bossAbilityStateLabel();
 return '每回合满足条件时发动';
}
function bossAbilityUIDescriptionHTML(ability){
 const deckProfile=typeof bossDeckProfile==='function'?bossDeckProfile(G?.st):null;
 const rows=[['触发时机',ability.triggerText||(ability.timing==='after_attack'?'敌方攻击结算后。':'敌方部署阶段。')],['发动冷却','从第2回合启用。成功发动后休息下一完整回合，第2个回合才可再次发动。'],['发动代价','固定消耗1张未被冻结的手牌余芯；'+(ability.costText||ability.costDescription||'具体额外代价见技能效果说明。').replace(/无额外代价。/g,'没有其他代价。')+'弃牌、生命或场上献祭等原技能代价另行支付；条件不足保留余芯。']];
 if(/(?:变成|变为|化作|化为)余芯/.test(ability.description))rows.push(['暂时化灰','目标变为0攻1血、无技能的余芯，覆盖玩家下一个完整行动回合；之后在Boss部署阶段恢复原牌及原有攻血状态，不回满生命，不触发入场效果。余芯死亡或被献祭，原牌本场不再恢复，也不触发原牌亡语；刚恢复的牌免疫一轮化灰。']);
 return `<p class="boss-ability-description">${esc(ability.description)}</p>${deckProfile?`<p class="boss-deck-theme"><strong>专属卡组 · ${esc(deckProfile.theme)}</strong><br>${esc(deckProfile.plan)}</p>`:''}<dl class="boss-ability-rules">${rows.map(([name,description])=>`<div><dt>${name}</dt><dd>${esc(description)}</dd></div>`).join('')}</dl>`;
}
function positionBossAbilityPopover(){
 const state=BOSS_ABILITY_UI;if(!state)return;
 const panel=document.getElementById('boss-ability-panel'),trigger=document.querySelector('.boss-ability-trigger');if(!panel||!trigger)return;
 const view=window.visualViewport,w=view?.width||window.innerWidth,h=view?.height||window.innerHeight,ox=view?.offsetLeft||0,oy=view?.offsetTop||0,r=trigger.getBoundingClientRect();
 panel.style.maxWidth=Math.max(220,w-16)+'px';panel.style.maxHeight=Math.max(160,h-16)+'px';
 const size=panel.getBoundingClientRect(),left=Math.max(ox+8,Math.min(r.left,ox+w-size.width-8)),below=r.bottom+6,top=below+size.height<=oy+h-8?below:Math.max(oy+8,r.top-size.height-6);
 panel.style.left=left+'px';panel.style.top=top+'px';
}
function refreshBossAbilityPopover(){
 const state=BOSS_ABILITY_UI;if(!state)return;
 const ability=bossAbilityUIConfig();if(!G||state.game!==G||state.boss!==G.st.boss||!ability||OV!==null){closeBossAbilityPopover(false);return}
 const status=document.querySelector('#boss-ability-panel .boss-ability-status'),text=bossAbilityUIStatus();if(status&&status.textContent!==text)status.textContent=text;
 document.querySelector('.boss-ability-trigger')?.setAttribute('aria-expanded','true');
 positionBossAbilityPopover();
}
function openBossAbilityPopover(pinned=true){
 const ability=bossAbilityUIConfig(),trigger=document.querySelector('.boss-ability-trigger');if(!ability||!trigger||OV!==null)return;
 clearTimeout(bossAbilityUICloseTimer);
 if(BOSS_ABILITY_UI){BOSS_ABILITY_UI.pinned=BOSS_ABILITY_UI.pinned||pinned;refreshBossAbilityPopover();if(pinned)document.querySelector('#boss-ability-panel [data-boss-ability="close"]')?.focus({preventScroll:true});return}
 const panel=document.createElement('section');panel.id='boss-ability-panel';panel.className='boss-ability-popover';panel.setAttribute('role','dialog');panel.setAttribute('aria-labelledby','boss-ability-title');panel.setAttribute('aria-describedby','boss-ability-description');
 panel.innerHTML=`<header class="boss-ability-panel-head"><div><small>${esc(G.st.boss)} · Boss技能</small><h2 id="boss-ability-title">${esc(ability.name)}</h2></div><button type="button" data-boss-ability="close" aria-label="关闭Boss技能说明">关闭 ×</button></header><div class="boss-ability-panel-scroll" id="boss-ability-description"><p class="boss-ability-status" role="status">${esc(bossAbilityUIStatus())}</p>${bossAbilityUIDescriptionHTML(ability)}<p class="boss-ability-reading-note">这里只查看说明，不改变当前选牌或战斗进程。</p></div>`;
 BOSS_ABILITY_UI={game:G,boss:G.st.boss,pinned};document.body.appendChild(panel);trigger.setAttribute('aria-expanded','true');positionBossAbilityPopover();bossAbilityUITimer=setInterval(refreshBossAbilityPopover,250);
 if(pinned)panel.querySelector('[data-boss-ability="close"]')?.focus({preventScroll:true});
}
function closeBossAbilityPopover(restoreFocus=true){
 if(!BOSS_ABILITY_UI)return;
 const pinned=BOSS_ABILITY_UI.pinned;BOSS_ABILITY_UI=null;clearTimeout(bossAbilityUICloseTimer);clearInterval(bossAbilityUITimer);bossAbilityUITimer=0;document.getElementById('boss-ability-panel')?.remove();
 const trigger=document.querySelector('.boss-ability-trigger');trigger?.setAttribute('aria-expanded','false');if(restoreFocus&&pinned)trigger?.focus({preventScroll:true});
}
function deferCloseBossAbilityPopover(){
 clearTimeout(bossAbilityUICloseTimer);if(BOSS_ABILITY_UI&&!BOSS_ABILITY_UI.pinned)bossAbilityUICloseTimer=setTimeout(()=>closeBossAbilityPopover(false),180);
}
document.addEventListener('click',event=>{
 const action=event.target.closest('[data-boss-ability]')?.dataset.bossAbility;
 if(action){event.preventDefault();event.stopImmediatePropagation();if(action==='close')closeBossAbilityPopover();else openBossAbilityPopover(true);return}
 if(performance.now()<bossAbilityUIIgnoreClickUntil){event.preventDefault();event.stopImmediatePropagation()}
},true);
document.addEventListener('pointerover',event=>{
 if(event.pointerType==='touch'||!matchMedia('(hover:hover)').matches)return;
 const target=event.target.closest('.boss-ability-trigger,#boss-ability-panel');if(!target)return;
 clearTimeout(bossAbilityUICloseTimer);if(target.classList.contains('boss-ability-trigger'))openBossAbilityPopover(false);
});
document.addEventListener('pointerout',event=>{
 if(event.pointerType==='touch'||!event.target.closest('.boss-ability-trigger,#boss-ability-panel')||event.relatedTarget?.closest?.('.boss-ability-trigger,#boss-ability-panel'))return;deferCloseBossAbilityPopover();
});
document.addEventListener('pointerdown',event=>{
 if(event.button!==0||!BOSS_ABILITY_UI||event.target.closest('.boss-ability-trigger,#boss-ability-panel'))return;
 closeBossAbilityPopover(false);bossAbilityUIIgnoreClickUntil=performance.now()+400;event.preventDefault();event.stopImmediatePropagation();
},true);
document.addEventListener('contextmenu',event=>{if(!BOSS_ABILITY_UI)return;event.preventDefault();event.stopImmediatePropagation();closeBossAbilityPopover()},true);
document.addEventListener('keydown',event=>{
 if(!BOSS_ABILITY_UI)return;
 if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeBossAbilityPopover();return}
 if(event.key==='Tab'){event.preventDefault();event.stopImmediatePropagation();document.querySelector('#boss-ability-panel [data-boss-ability="close"]')?.focus({preventScroll:true})}
},true);
window.addEventListener('resize',positionBossAbilityPopover);window.visualViewport?.addEventListener('resize',positionBossAbilityPopover);window.visualViewport?.addEventListener('scroll',positionBossAbilityPopover);
document.addEventListener('visibilitychange',()=>{if(document.hidden)closeBossAbilityPopover(false)});
// A deployed Boss card lends its matching encounter power to the player.
// Equipping is limited separately from activation, including when its source leaves play.
let PLAYER_BOSS_SKILL_UI=null,playerBossSkillUITimer=0;
function playerBossSkillsInitBattle(){
 if(typeof G==='undefined'||!G)return;
 closePlayerBossSkillPopover(false);
 G.playerBossSkill={source:null,equippedBoss:null,equipTurn:-1,turnUsed:-1,usedCount:0,armed:false,armedTurn:-1,feedback:'',playerDirectDamage:0,enemyDirectDamage:0,enemyDeaths:0,fireSeed:null,heroRedirect:null,history:[]};
}
function playerBossSkillForCard(card){
 if(!card||card.token||card.identity||card.fod||card.bossWickOriginal||typeof BOSS_ABILITIES==='undefined')return null;
 const name=card.baseName||card.n,all=Array.isArray(BOSS_ABILITIES)?BOSS_ABILITIES:Object.values(BOSS_ABILITIES);
 return all.find(cfg=>cfg.boss===name&&typeof BOSS_SKILL_HANDLERS[cfg.boss]==='function')||null;
}
function playerBossSkillState(){
 if(typeof G==='undefined'||!G)return null;
 if(!G.playerBossSkill)playerBossSkillsInitBattle();
 const state=G.playerBossSkill;
 if(state.source&&(!G.p.includes(state.source)||state.source.h<=0||!playerBossSkillForCard(state.source))){state.source=null;state.equippedBoss=null;state.armed=false;state.feedback='提供技能的Boss卡已离场，装备失效。';}
 return state;
}
function playerBossSkillCanAct(){return !!G&&!G.tutorial&&(typeof OV==='undefined'||OV===null)&&!G.busy&&!G.mustDraw&&!G.freezeChoice&&!(typeof drawRunning!=='undefined'&&drawRunning)&&G.turn>=2&&G.phase==='player-deploy'}
function playerBossSkillOptions(){return !G?[]:G.p.map((card,index)=>({card,index,ability:playerBossSkillForCard(card)})).filter(x=>x.ability&&x.card.h>0)}
function equipPlayerBossSkill(index){
 const state=playerBossSkillState();if(!state||!playerBossSkillCanAct()||state.equipTurn===G.turn||!Number.isInteger(index))return false;
 const card=G.p[index],ability=playerBossSkillForCard(card);if(!ability||card.h<=0)return false;
 state.source=card;state.equippedBoss=ability.boss;state.equipTurn=G.turn;state.armed=false;state.feedback=`已装备「${ability.name}」，本回合不能改装其他技能。`;
 logBattle(`我方从第${index+1}格${card.n}装备「${ability.name}」`);return true;
}
function playerBossSkillEquippedAbility(){const state=playerBossSkillState();return state?.source?playerBossSkillForCard(state.source):null}
function playerBossSkillClearSelection(){G.sel=null;G.moveSel=null;G.sac?.clear()}
function applyPlayerBossAbility(ability,state){
 const applied=bossExecutePaidAbility('p',state,ability,state.source);
 if(applied){playerBossSkillClearSelection();state.turnUsed=G.turn;state.usedCount++;state.history.push({turn:G.turn,boss:ability.boss,name:ability.name,phase:ability.timing});state.feedback=`已发动「${ability.name}」。`;logBattle(`我方发动${ability.boss}的「${ability.name}」`)}
 else state.feedback=!bossSkillReady(state)?'技能冷却中，须休息一个完整回合。':bossSkillWickIndex('p')<0?'缺少1张可用手牌余芯；本次未发动。':'当前没有合法目标或其他代价不足；余芯已保留，本次未发动。';
 return applied;
}
function usePlayerBossSkill(){
 const state=playerBossSkillState(),ability=playerBossSkillEquippedAbility();
 if(!state||!ability||!playerBossSkillCanAct()||!bossSkillReady(state)||bossSkillWickIndex('p')<0||state.armed)return false;
 if(ability.timing==='after_attack'){
  playerBossSkillClearSelection();state.armed=true;state.armedTurn=G.turn;state.feedback=`已准备「${ability.name}」，请留1张手牌余芯；攻击结束后满足条件才支付并发动。`;
  logBattle(`我方准备「${ability.name}」，等待攻击结束`);return true;
 }
 return applyPlayerBossAbility(ability,state);
}
function runPlayerBossAbility(phase){
 const state=playerBossSkillState(),ability=playerBossSkillEquippedAbility();
 if(!G||G.tutorial||!bossSkillReady(state)||G.hp<=0||G.ehp<=0||!state||!ability||phase!=='after_attack'||ability.timing!==phase||!state.armed||state.armedTurn!==G.turn)return false;
 state.armed=false;return applyPlayerBossAbility(ability,state);
}
function playerBossSkillStatus(){
 const state=playerBossSkillState();if(!G||G.tutorial)return 'Boss卡上场后可装备';
 if(G.turn<2)return '第2回合启用';
 if(state.armed)return bossSkillWickIndex('p')<0?'已准备 · 缺少余芯':'等待攻击结束';
 if(state.turnUsed===G.turn)return '本回合已使用';
 if(!bossSkillReady(state))return '冷却中 · 本回合休息';
 if(state.source&&bossSkillWickIndex('p')<0)return '缺少手牌余芯';
 if(state.source)return '可发动';
 return playerBossSkillOptions().length?'可装备':'需Boss卡在场';
}
function playerBossSkillButtonHTML(){
 if(!G)return '';
 const ability=G.tutorial?null:playerBossSkillEquippedAbility(),label=ability?.name||'装备战技',status=playerBossSkillStatus();
 return `<button type="button" class="player-boss-skill-trigger" data-player-boss-skill="open" aria-haspopup="dialog" aria-expanded="${!!PLAYER_BOSS_SKILL_UI}" aria-controls="player-boss-skill-panel" aria-label="我方Boss技能：${esc(label)}；${esc(status)}" ${G.tutorial?'disabled':''}><span aria-hidden="true">◇</span><span class="player-boss-skill-label">${esc(label)}</span><small>${esc(status)}</small></button>`;
}
function playerBossSkillDescription(ability){
 if(!ability)return '';
 // Encounter text uses the enemy Boss's viewpoint. Make the card owner's viewpoint explicit.
 const text=ability.description.replace(/玩家/g,'对手').replace(/Boss/g,'我方').replace(/敌方/g,'对方');
 return `<p>${esc(text)}</p><dl><div><dt>时机</dt><dd>${ability.timing==='after_attack'?'点击准备后，在本回合攻击结束时判定并支付余芯。':'自己的部署阶段点击发动。'}</dd></div><div><dt>冷却</dt><dd>成功发动后休息下一完整回合，第2个回合才可再次发动；换装不重置冷却。</dd></div><div><dt>代价</dt><dd>固定消耗1张未被冻结的手牌余芯；${esc((ability.costText||'其余代价与对应Boss技能相同。').replace(/无额外代价。/g,'没有其他代价。').replace(/Boss/g,'己方').replace(/敌方/g,'对方'))}需要弃牌等代价时另行支付。</dd></div></dl>`;
}
function playerBossSkillPanelHTML(){
 const state=playerBossSkillState(),ability=playerBossSkillEquippedAbility(),canAct=playerBossSkillCanAct(),options=playerBossSkillOptions(),ready=bossSkillReady(state),hasWick=bossSkillWickIndex('p')>=0;
 return `<header><div><small>借来守关者的力量</small><h2 id="player-boss-skill-title">我方Boss技能</h2></div><button type="button" data-player-boss-skill="close" aria-label="关闭我方Boss技能">关闭 ×</button></header><div class="player-boss-skill-scroll"><p class="player-boss-skill-rule">普通或鎏金的同名Boss卡在场，就能装备对应主动技能。第2回合起，每回合最多装备一次；每次发动消耗1张手牌余芯，并休息下一完整回合。装备保留到下回合，来源离场或化灰则失效。</p><section class="player-boss-skill-equipped"><h3>${ability?esc(ability.boss)+' · '+esc(ability.name):'尚未装备'}</h3>${ability?playerBossSkillDescription(ability):'<p>先把拥有主动技能的Boss卡部署到己方战场。</p>'}${ability?`<button class="pri" type="button" data-player-boss-skill="use" ${canAct&&ready&&hasWick&&!state.armed?'':'disabled'}>${state.armed?'已准备 · 等待攻击结束':state.turnUsed===G.turn?'本回合已使用':!ready?'冷却中 · 本回合休息':!hasWick?'缺少手牌余芯':ability.timing==='after_attack'?'准备技能':'发动技能'}</button>`:''}</section><p class="player-boss-skill-feedback" role="status">${esc(state.feedback||playerBossSkillStatus())}</p><h3 class="player-boss-skill-options-title">场上可装备的Boss</h3><div class="player-boss-skill-options">${options.map(({card,index,ability:cfg})=>`<article><div><b>${esc(card.n)}</b><small>第${index+1}格 · ${esc(cfg.name)}${state.source===card?' · 当前装备':''}</small></div><button type="button" data-player-boss-skill="equip" data-player-skill-lane="${index}" ${canAct&&state.equipTurn!==G.turn?'':'disabled'}>装备</button><details><summary>技能效果与代价</summary>${playerBossSkillDescription(cfg)}</details></article>`).join('')||'<p>目前没有可提供主动技能的Boss卡。</p>'}</div><p class="player-boss-skill-note">技能中的“己方”指你，“对手”指电脑。手牌余芯固定消耗，不触发献祭或亡语；弃牌、场上献祭和生命等原技能代价另由你支付，抽牌消耗自己的有限牌库。普通卡的印刷技能照常生效。</p></div>`;
}
function positionPlayerBossSkillPopover(){
 if(!PLAYER_BOSS_SKILL_UI)return;
 const panel=document.getElementById('player-boss-skill-panel'),trigger=document.querySelector('.player-boss-skill-trigger');if(!panel||!trigger)return;
 const view=window.visualViewport,w=view?.width||innerWidth,h=view?.height||innerHeight,ox=view?.offsetLeft||0,oy=view?.offsetTop||0,r=trigger.getBoundingClientRect();
 panel.style.maxWidth=Math.max(240,w-16)+'px';panel.style.maxHeight=Math.max(140,h-16)+'px';
 const size=panel.getBoundingClientRect(),left=Math.max(ox+8,Math.min(r.left,ox+w-size.width-8)),above=r.top-size.height-6,top=above>=oy+8?above:Math.max(oy+8,Math.min(r.bottom+6,oy+h-size.height-8));panel.style.left=left+'px';panel.style.top=top+'px';
}
function refreshPlayerBossSkillPopover(){
 const ui=PLAYER_BOSS_SKILL_UI;if(!ui)return;
 if(!G||ui.game!==G||OV!==null||G.tutorial||(typeof DM!=='undefined'&&DM)||(typeof HOLD_DETAIL!=='undefined'&&HOLD_DETAIL)||(typeof infoPanel!=='undefined'&&infoPanel)){closePlayerBossSkillPopover(false);return}
 const panel=document.getElementById('player-boss-skill-panel');if(!panel)return;
 const html=playerBossSkillPanelHTML();if(panel._playerSkillMarkup!==html){const scroll=panel.querySelector('.player-boss-skill-scroll')?.scrollTop||0;panel.innerHTML=html;panel._playerSkillMarkup=html;panel.querySelector('.player-boss-skill-scroll').scrollTop=scroll}
 const trigger=document.querySelector('.player-boss-skill-trigger');trigger?.setAttribute('aria-expanded','true');positionPlayerBossSkillPopover();
}
function openPlayerBossSkillPopover(){
 if(!G||G.tutorial||OV!==null)return;
 if(PLAYER_BOSS_SKILL_UI){refreshPlayerBossSkillPopover();return}
 if(typeof closeBossAbilityPopover==='function')closeBossAbilityPopover(false);
 const panel=document.createElement('section');panel.id='player-boss-skill-panel';panel.className='player-boss-skill-popover';panel.setAttribute('role','dialog');panel.setAttribute('aria-labelledby','player-boss-skill-title');
 PLAYER_BOSS_SKILL_UI={game:G};document.body.appendChild(panel);refreshPlayerBossSkillPopover();playerBossSkillUITimer=setInterval(refreshPlayerBossSkillPopover,250);
 panel.querySelector('[data-player-boss-skill="close"]')?.focus({preventScroll:true});
}
function closePlayerBossSkillPopover(restoreFocus=true){
 const active=PLAYER_BOSS_SKILL_UI;PLAYER_BOSS_SKILL_UI=null;clearInterval(playerBossSkillUITimer);playerBossSkillUITimer=0;
 if(typeof document==='undefined')return;document.getElementById('player-boss-skill-panel')?.remove();const trigger=document.querySelector('.player-boss-skill-trigger');trigger?.setAttribute('aria-expanded','false');if(active&&restoreFocus)trigger?.focus({preventScroll:true});
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-player-boss-skill]');if(!button)return;
 event.preventDefault();event.stopImmediatePropagation();const action=button.dataset.playerBossSkill;
 if(action==='close'){closePlayerBossSkillPopover();return}if(action==='open'){openPlayerBossSkillPopover();return}
 if(action==='equip')equipPlayerBossSkill(Number(button.dataset.playerSkillLane));
 if(action==='use'){usePlayerBossSkill();if(typeof chk==='function')chk()}
 if(typeof render==='function')render();refreshPlayerBossSkillPopover();
},true);
document.addEventListener('pointerdown',event=>{if(!PLAYER_BOSS_SKILL_UI||event.button!==0||event.target.closest('.player-boss-skill-popover,.player-boss-skill-trigger'))return;closePlayerBossSkillPopover(false)},true);
document.addEventListener('contextmenu',event=>{if(!PLAYER_BOSS_SKILL_UI)return;event.preventDefault();event.stopImmediatePropagation();closePlayerBossSkillPopover()},true);
document.addEventListener('keydown',event=>{if(!PLAYER_BOSS_SKILL_UI||event.key!=='Escape')return;event.preventDefault();event.stopImmediatePropagation();closePlayerBossSkillPopover()},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)closePlayerBossSkillPopover(false)});
window.addEventListener('resize',positionPlayerBossSkillPopover);window.visualViewport?.addEventListener('resize',positionPlayerBossSkillPopover);window.visualViewport?.addEventListener('scroll',positionPlayerBossSkillPopover);
// A card becomes permanent knowledge only after it has entered the player's deck.
const COLLECTION_STORAGE='lo_collection_v1';
let collectedNames=new Set(),permanentIdentities=new Map(),collectionInitialized=false;
// Old saved card names remain aliases; player-created identity names are untouched.
function canonicalCardName(name){
 if(typeof name!=='string'||typeof CARD_NAME_ALIASES!=='object'||!CARD_NAME_ALIASES)return name;
 return Object.prototype.hasOwnProperty.call(CARD_NAME_ALIASES,name)&&typeof CARD_NAME_ALIASES[name]==='string'?CARD_NAME_ALIASES[name]:name;
}
function collectionRead(key,fallback=null){try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}}
function collectionWrite(){
 try{localStorage.setItem(COLLECTION_STORAGE,JSON.stringify({version:1,names:[...collectedNames],identities:[...permanentIdentities.values()]}))}catch{}
}
function collectionIdentityCopy(c){
 if(!c||typeof c!=='object'||!c.identity||!c.permanent||typeof c.n!=='string'||!c.n.trim()||!Number.isFinite(c.a)||!Number.isFinite(c.h)||!Number.isFinite(c.c))return null;
 if(c.a<0||c.h<1||c.c<0||c.c>3)return null;
 const keys=['id','n','a','h','c','f','at','s','x','mv','dr','dd','heal','growth','death','rarity','lore','by','baseName','alias','createdAt','created','origin','source','identityId'];
 const saved={};for(const key of keys)if(['string','number','boolean'].includes(typeof c[key]))saved[key]=c[key];
 return {...saved,identity:true,permanent:true,d:1,game:'identity',kind:'identity',a0:c.a,h0:c.h};
}
function collectionRegisterIdentity(c){
 const saved=collectionIdentityCopy(c);if(!saved)return null;
 const existing=POOL.find(x=>x.n===saved.n);
 if(existing&&!existing.identity)return null;
 if(existing)Object.assign(existing,saved);else POOL.push(saved);
 const card=existing||saved;permanentIdentities.set(card.n,{...card});return card;
}
function collectionCard(name){
 if(typeof name!=='string')return null;
 name=canonicalCardName(name);
 if(name==='余芯')return SQ;
 return POOL.find(c=>c.n===name)||null;
}
function isCollected(value){
 const name=canonicalCardName(typeof value==='string'?value:value?.n);
 if(!name||!collectedNames.has(name))return false;
 const card=collectionCard(name);return !!card&&!card.token&&(!card.identity||!!card.permanent);
}
function collectionLibraryCards(){return [...POOL.filter(c=>!c.token&&(!c.identity||c.permanent)),...(!POOL.some(c=>c.n==='余芯')?[SQ]:[])]}
function collectCard(c){
 if(typeof c==='string')c=collectionCard(c);
 if(!c||c.token||c.identity&&!c.permanent)return false;
 let card=c.identity?collectionRegisterIdentity(c):collectionCard(c.n);if(!card)return false;
 const fresh=!collectedNames.has(card.n);collectedNames.add(card.n);unlock(card.n);if(fresh||card.identity)collectionWrite();return true;
}
function collectionHasCopyRoom(value,cards){
 const name=canonicalCardName(typeof value==='string'?value:value?.n);if(!name)return false;if(name==='余芯')return true;
 return collectionCopyCount(name,cards)<collectionCopyLimit(value);
}
function collectionCopyLimit(value){const name=canonicalCardName(typeof value==='string'?value:(value?.card||value)?.n),card=typeof value==='string'?collectionCard(name):(value?.card||value);return name==='余芯'?Infinity:(card?.rarity==='rare'||collectionCard(name)?.rarity==='rare')?1:2}
function collectionCopyCount(value,cards){const name=canonicalCardName(typeof value==='string'?value:(value?.card||value)?.n);return(Array.isArray(cards)?cards:[]).filter(x=>canonicalCardName(typeof x==='string'?x:(x?.card||x)?.n)===name).length}
function collectionPortfolioHasCopyRoom(value,deck=[],reserve=[]){return collectionCopyLimit(value)!==1||collectionCopyCount(value,[...deck,...reserve])<1}
function collectionDedupeGoldPortfolio(deck=[],reserve=[]){
 const seen=new Set(),clean=list=>(Array.isArray(list)?list:[]).filter(value=>{if(collectionCopyLimit(value)!==1)return true;const name=canonicalCardName(typeof value==='string'?value:(value?.card||value)?.n);if(seen.has(name))return false;seen.add(name);return true});
 return {deck:clean(deck),reserve:clean(reserve)};
}
function goldRewardEligible(value,deck=typeof G==='undefined'?[]:G?.deck||[],reserve=typeof G==='undefined'?[]:G?.reserve||[]){return collectionCopyLimit(value)!==1||(!isCollected(value)&&collectionPortfolioHasCopyRoom(value,deck,reserve))}
function collectionCanAdd(c,cards){return !!c&&isCollected(c)&&collectionHasCopyRoom(c,cards)}
function collectionRecordIdentity(c){
 if(!c||typeof c!=='object')return null;
 Object.assign(c,{identity:true,permanent:true,d:1,game:'identity',kind:'identity'});
 const saved=collectionRegisterIdentity(c);if(!saved)return null;collectCard(saved);return saved;
}
function initializeCollection(){
 if(collectionInitialized)return;collectionInitialized=true;
 if(typeof SEEN!=='undefined'&&SEEN instanceof Set){const names=[...SEEN].map(canonicalCardName);SEEN.clear();for(const name of names)SEEN.add(name)}
 // Normalize legacy lists without granting anything beyond the normal migration rules.
 for(const key of ['lo_seen','lo_custom_deck']){
  const names=collectionRead(key);if(!Array.isArray(names))continue;
  const normalized=names.map(canonicalCardName);
  if(normalized.some((name,index)=>name!==names[index]))try{localStorage.setItem(key,JSON.stringify(normalized))}catch{}
 }
 const state=collectionRead(COLLECTION_STORAGE),valid=state&&state.version===1&&Array.isArray(state.names);
 if(valid){
  if(Array.isArray(state.identities))for(const c of state.identities)collectionRegisterIdentity(c);
  for(const name of state.names)if(typeof name==='string'&&collectionCard(name))collectedNames.add(canonicalCardName(name));
 }else{
  // Legacy lo_seen was written only when starting with, or claiming, a card.
  const seen=collectionRead('lo_seen',[]);if(Array.isArray(seen))for(const name of seen)if(typeof name==='string'&&collectionCard(name))collectedNames.add(canonicalCardName(name));
  const oldDeck=collectionRead('lo_custom_deck',[]);if(Array.isArray(oldDeck))for(const name of oldDeck)if(typeof name==='string'&&collectionCard(name))collectedNames.add(canonicalCardName(name));
 }
 for(const name of new Set([...STARTER,...RECOMMENDED_STARTER,'余芯']))if(collectionCard(name))collectedNames.add(canonicalCardName(name));
 for(const name of collectedNames)if(collectionCard(name))unlock(name);
 const oldCustom=collectionRead('lo_custom_deck',[]);
 if(Array.isArray(oldCustom)){
  const clean=collectionDedupeGoldPortfolio(oldCustom,[]).deck;
  if(clean.length<oldCustom.length){
   if(oldCustom.length>=12)for(const name of STARTER){if(clean.length>=12)break;if(collectionHasCopyRoom(name,clean))clean.push(name)}
   try{localStorage.setItem('lo_custom_deck',JSON.stringify(clean));if(typeof customDeck!=='undefined')customDeck=clean}catch{}
  }
 }
 collectionWrite();
}
function collectionLockedHTML(){return '<div class="collection-card-back" role="img" aria-label="尚未获得的卡牌"><span aria-hidden="true">?</span><small>尚未获得</small></div>'}
function collectionCatalogueHTML(){
 const cards=collectionLibraryCards(),query=catalogSearch.trim().toLocaleLowerCase();
 const filtered=cards.filter(c=>(catalogGame==='all'||c.game===catalogGame)&&(catalogKind==='all'||c.kind===catalogKind)&&(catalogRarity==='all'||(c.rarity==='rare'?'rare':'common')===catalogRarity)&&(!query||isCollected(c)&&cardSearchText(c).toLocaleLowerCase().includes(query))).sort((a,b)=>Number(isCollected(b))-Number(isCollected(a)));
 const pages=Math.max(1,Math.ceil(filtered.length/24));catalogPage=Math.min(catalogPage,pages-1);
 const games=Object.entries(GAME_META);if(cards.some(c=>c.identity)&&!GAME_META.identity)games.push(['identity',['灯契身份']]);
 const kinds=Object.entries(KIND_LABEL);if(cards.some(c=>c.identity)&&!KIND_LABEL.identity)kinds.push(['identity','灯契身份']);
 const latest=typeof getCampaignCarry==='function'?getCampaignCarry(activeDifficulty()):null,selected=latest?latest.deck.map(c=>c.n):validDeck(customDeck)?customDeck:STARTER,count=cards.filter(isCollected).length;
 return `<div class="catalog-shell"><div class="catalog-head"><div><h2>灯息万象</h2><p>永久收藏 ${count} / ${cards.length} · ${filtered.length} 项匹配</p></div><button data-a="closecat">返回</button></div><p class="collection-explanation">未获得的牌以问号封存。奖励牌编入出战后，才会永久解锁并可自由组卡；备用中的新牌须先编入并保存。</p><div class="catalog-tools"><input id="catsearch" value="${esc(catalogSearch)}" placeholder="搜索已收藏的名称或技能" aria-label="搜索已收藏卡牌"><select id="catgame" aria-label="按作品筛选"><option value="all">所有作品</option>${games.map(([k,v])=>`<option value="${k}" ${catalogGame===k?'selected':''}>${v[0]}</option>`).join('')}</select><select id="catkind" aria-label="按角色筛选"><option value="all">全部角色</option>${kinds.map(([k,v])=>`<option value="${k}" ${catalogKind===k?'selected':''}>${v}</option>`).join('')}</select><select id="catrarity" aria-label="按稀有度筛选"><option value="all">所有稀有度</option><option value="rare" ${catalogRarity==='rare'?'selected':''}>鎏金稀有</option><option value="common" ${catalogRarity==='common'?'selected':''}>普通卡牌</option></select></div><div class="deck-builder"><p>我的起始卡组 · ${selected.length}/36 张 · 推荐24张</p><button class="deck-access" data-a="deckmanager">${deckIconHTML()}管理我的卡组</button></div><div class="catalog-grid">${filtered.slice(catalogPage*24,catalogPage*24+24).map(c=>isCollected(c)?`<article class="catalog-entry">${cardHTML(c)}<p>${esc(GAME_META[c.game]?.[0]||(c.identity?'灯契身份':'灯火遗物'))} · ${esc(KIND_LABEL[c.kind]||(c.identity?'身份卡':'祭品'))}</p><p>${esc(cardNarrative(c)||'灯火未熄，继续你的旅途。')}</p></article>`:`<article class="catalog-entry collection-locked">${collectionLockedHTML()}<p>未知卡牌</p><p>获得并编入出战后解锁</p></article>`).join('')||'<p class="empty-catalog">没有匹配的已收藏卡牌</p>'}</div><div class="catalog-actions"><button data-a="prev" ${catalogPage?'':'disabled'}>上一页</button><span>${catalogPage+1} / ${pages}</span><button data-a="next" ${catalogPage+1<pages?'':'disabled'}>下一页</button></div><p class="catalog-note">普通出战同名最多2张；鎏金每种仅1张（出战与备用合计）；余芯不限。收藏保存在当前浏览器。</p></div>`;
}
// One provisional death identity per sixteen-stage campaign; only a clear archives it.
const IDENTITY_STORAGE='lo_identity_v1';
let IDENTITY={version:1,cycle:0,pending:null,deaths:0,growthRank:0,last:null},identityInitialized=false,identitySerial=0;
const IDENTITY_GROWTH_CAPS={1:{a:3,h:5},2:{a:4,h:7},3:{a:6,h:9}};
function identityRead(key){try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}}
function identitySave(){try{localStorage.setItem(IDENTITY_STORAGE,JSON.stringify(IDENTITY))}catch{}}
function identityCardCopy(c,cycle=IDENTITY.cycle){
 if(!c||typeof c!=='object'||Array.isArray(c)||typeof c.n!=='string'||!c.n.trim())return null;
 if(!Number.isInteger(c.a)||c.a<0||c.a>6||!Number.isInteger(c.h)||c.h<1||c.h>9||!Number.isInteger(c.c)||c.c<0||c.c>3)return null;
 const saved={n:c.n.slice(0,160),a:c.a,h:c.h,c:c.c,f:typeof c.f==='string'?c.f:'k',at:typeof c.at==='string'?c.at:'暗'};
 for(const key of ['s','x','by','identityId'])if(typeof c[key]==='string'&&c[key].length<=180)saved[key]=c[key];
 for(const key of ['deathCount','growthRank'])if(Number.isSafeInteger(c[key])&&c[key]>=0)saved[key]=c[key];
 return {...saved,identity:true,permanent:false,d:1,game:'identity',kind:'identity',cycle,a0:c.a,h0:c.h,lore:typeof c.lore==='string'&&c.lore.trim()?c.lore.slice(0,600):'苔庭暖灰缄骨客把这一轮旅途的败北封进遗骸。它暂伴重试的脚步，唯有走完十六道关卡，才会成为永久的身份。'};
}
// Compare attack/health after paying the additional sacrifice cost. A successful
// refinement always increases this body score, rather than merely raising cost.
function identityGrowthPower(c){return c?c.a*2+c.h-c.c*2:-Infinity}
function identityGrowthBody(candidate,previous){
 const power=identityGrowthPower(previous),options=[1,2,3].filter(cost=>identityGrowthPower({...IDENTITY_GROWTH_CAPS[cost],c:cost})>power);
 if(!options.length)return null;
 const cost=options[Math.min(options.length-1,Math.floor(Math.random()*options.length))],cap=IDENTITY_GROWTH_CAPS[cost];
 const minimum={1:{a:1,h:2},2:{a:2,h:4},3:{a:3,h:5}}[cost];
 let a=Math.min(cap.a,Math.max(candidate.a,previous.a,minimum.a)),h=Math.min(cap.h,Math.max(candidate.h,previous.h,minimum.h));
 while(identityGrowthPower({a,h,c:cost})<=power){if(h<cap.h)h++;else if(a<cap.a)a++;else return null}
 return {...candidate,a,h,c:cost};
}
function identityGrowthPrepare(c){
 const sources=[c,IDENTITY.last,IDENTITY.pending].filter(Boolean),previous=sources.reduce((best,next)=>identityGrowthPower(next)>identityGrowthPower(best)?next:best,c);
 // Once earned, the improved body remains the floor for later death cards.
 let card={...c,a:previous.a,h:previous.h,c:previous.c};
 IDENTITY.deaths++;
 const eligible=IDENTITY.deaths%3===0,atCap=identityGrowthPower(previous)>=15,rolled=eligible&&Math.random()<.33;
 let boosted=false;
 if(rolled&&!atCap){const improved=identityGrowthBody(card,previous);if(improved){card=improved;boosted=true;IDENTITY.growthRank++}}
 card.deathCount=IDENTITY.deaths;card.growthRank=IDENTITY.growthRank;
 G.identityGrowth={deathNumber:IDENTITY.deaths,eligible,boosted,atCap,rank:IDENTITY.growthRank,previous:{a:previous.a,h:previous.h,c:previous.c},body:{a:card.a,h:card.h,c:card.c}};
 return card;
}
function identityNewCard(c){
 const cycle=IDENTITY.cycle,known=typeof POOL==='undefined'?[]:POOL;
 const names=new Set([...known.map(card=>card.n),IDENTITY.pending?.n].filter(Boolean));
 const ids=new Set([...known.map(card=>card.identityId),IDENTITY.pending?.identityId].filter(Boolean));
 let id;do{id='identity-'+(cycle+1)+'-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)+'-'+(++identitySerial)}while(ids.has(id));
 const name=(typeof pname==='string'&&pname.trim()?pname.trim().slice(0,typeof i18nNameLimit==='function'?i18nNameLimit():5):'苔庭暖灰缄骨客')+'·死亡遗骸·第'+(cycle+1)+'轮';
 let unique=name,copy=1;while(names.has(unique))unique=name+'·'+(++copy);
 const echo=typeof G!=='undefined'?G?.deathEcho:null;
 const growth=c.growthRank?`遗灰淬炼${c.growthRank}次；累计第${c.deathCount||IDENTITY.deaths}次死亡留下的身份。`:'';
 const lore='苔庭暖灰缄骨客把这一轮旅途的败北封进遗骸。'+growth+(echo?.text?`${echo.boss}的死亡回响：“${echo.text}”`:'')+'它暂伴重试的脚步，唯有走完十六道关卡，才会成为永久的身份。';
 return identityCardCopy({...c,n:unique,identityId:id,lore},cycle);
}
function initializeIdentity(){
 if(identityInitialized)return;identityInitialized=true;
 const state=identityRead(IDENTITY_STORAGE);
 if(state&&state.version===1&&Number.isSafeInteger(state.cycle)&&state.cycle>=0){
  IDENTITY={version:1,cycle:state.cycle,pending:null,deaths:Number.isSafeInteger(state.deaths)&&state.deaths>=0?state.deaths:0,growthRank:Number.isSafeInteger(state.growthRank)&&state.growthRank>=0?state.growthRank:0,last:null};
  const pending=identityCardCopy(state.pending,state.cycle);
  if(pending&&state.pending.identity===true&&!state.pending.permanent&&!POOL.some(c=>c.n===pending.n&&!c.identity))IDENTITY.pending=pending;
  const last=identityCardCopy(state.last,state.last?.cycle??state.cycle);if(last&&state.last.identity===true)IDENTITY.last=last;
 }else{
  IDENTITY={version:1,cycle:0,pending:null,deaths:0,growthRank:0,last:null};
  // Older versions retained many graves. Migrate at most their final entry, provisionally.
  const legacy=identityRead('lo_grave');
  if(Array.isArray(legacy)&&legacy.length){const c=legacy[legacy.length-1];if(c&&typeof c==='object')IDENTITY.pending=identityNewCard(c)}
 }
 identitySave();
}
function identityForRun(){initializeIdentity();return IDENTITY.pending?{...IDENTITY.pending}:null}
function identityOnDeath(c){
 initializeIdentity();if(!c||typeof c!=='object'||!G||G.tutorial)return null;
 if(G.identityDeathCard&&(G.identityDeathCard===c||c.identityId&&G.identityDeathCard.identityId===c.identityId))return G.identityDeathCard;
 const valid=identityCardCopy(c);if(!valid)return null;
 const card=identityNewCard(identityGrowthPrepare(valid));if(!card)return null;Object.assign(c,card);G.identityDeathCard=c;IDENTITY.last={...card};
 G.identityArchived=null;
 if(!IDENTITY.pending){IDENTITY.pending={...card};G.identityChoice=null;G.identityNotice='首次死亡留下的身份已暂存；重试时会自动携带。通关本轮全部16关后，它才会永久解锁。'}
 else{G.identityChoice={old:{...IDENTITY.pending},new:{...card}};G.identityNotice='本轮16关仅可保留1张死亡身份，请保留旧身份或替换为新身份。'}
 identitySave();
 return card;
}
function identityGrowthHTML(){
 const info=G?.identityGrowth;if(!info)return '';
 const next=IDENTITY.deaths+(3-IDENTITY.deaths%3),result=info.atCap?'遗灰已达到成长上限。':info.boosted?`遗灰淬炼成功！本次强化为${info.body.c}费 · ${info.body.a}攻${info.body.h}血。`:info.eligible?'本次33%的淬炼判定未触发，已获得的身材成长仍会保留。':`下次淬炼判定：第${next}次死亡。`;
 return `<div class="identity-growth${info.boosted?' is-refined':''}" role="status"><strong>累计死亡 ${info.deathNumber} 次${info.rank?' · 淬炼 '+info.rank+' 次':''}</strong><p>${esc(result)}</p><small>每第3次死亡有33%概率额外强化，可能生成1、2或3费身份；攻防随费用成长，达到上限后停止强化。</small></div>`;
}
function identityChoose(action){
 if(!G||OV!=='dead'||!G.identityChoice||!['keep','replace'].includes(action))return false;
 const chosen=identityCardCopy(action==='replace'?G.identityChoice.new:G.identityChoice.old,IDENTITY.cycle);if(!chosen)return false;
 IDENTITY.pending={...chosen};identitySave();G.identityChoice=null;
 G.identityNotice=action==='replace'?'已替换为新的死亡身份，重试时自动携带。':'已保留原来的死亡身份，重试时自动携带。';render();return true;
}
function identityCompleteCampaign(){
 initializeIdentity();if(!G||G.tutorial||G.identityRecorded||G.wins<STG.length||G.lv!==STG.length)return false;
 let archived=null;
 if(IDENTITY.pending){archived=collectionRecordIdentity({...IDENTITY.pending,permanent:true});if(!archived)return false}
 G.identityArchived=archived;G.identityRecorded=true;G.identityChoice=null;
 IDENTITY.pending=null;IDENTITY.cycle++;identitySave();return true;
}
function identityDeathHTML(){
 if(!G||G.tutorial)return '';
 const choice=G.identityChoice;
 if(choice)return `<section class="identity-death identity-choice" aria-labelledby="identity-choice-title"><header><h3 id="identity-choice-title">留下哪一份遗骸？</h3><p>本轮16关仅可保留1张死亡身份。选择后重试自动携带；通关全部16关后，保留的身份才会永久解锁并可自由组卡。</p></header>${identityGrowthHTML()}<div class="identity-options">${[['old','此前暂存',choice.old,'identity-keep','保留旧身份'],['new','本次死亡',choice.new,'identity-replace','替换为新身份']].map(([key,label,c,action,button])=>`<article class="identity-option" data-identity-option="${key}"><h4>${label}</h4>${cardHTML(c)}<p class="identity-origin">死于：${esc(c.by||'灯息耗尽')}</p><button class="${key==='old'?'pri':''}" data-a="${action}">${button}</button></article>`).join('')}</div><p class="identity-rule">请选择一张后返回灯台。另一张不会加入永久收藏。</p></section>`;
 const pending=IDENTITY.pending;
 return `<section class="identity-death identity-notice" aria-label="本轮暂存身份"><h3>本轮死亡身份 · ${pending?'已暂存':'暂无暂存'}</h3><p>${esc(G.identityNotice||'本轮16关最多暂存一张死亡身份，重试时自动携带。')}</p>${identityGrowthHTML()}${pending?`<p class="identity-pending-name">${esc(pending.n)}</p>`:''}<p class="identity-rule">暂存身份不能用于自由组卡；通关本轮全部16关后永久归档。每一轮最多归档一张。</p></section>`;
}
function identityCampaignHTML(){
 if(!G||G.tutorial||G.lv!==STG.length||G.wins<STG.length)return '';
 const c=G.identityArchived;
 if(c)return `<section class="identity-campaign" aria-label="身份永久归档"><span aria-hidden="true">✦</span><div><h3>死亡身份已永久归档</h3><p>${esc(c.n)}</p><small>已加入永久收藏，可在“我的卡组”中自由编入。下一轮重新开放一个暂存位置。</small></div></section>`;
 return `<section class="identity-campaign"><div><h3>${G.identityRecorded?'本轮未获得死亡身份':'身份仍在暂存'}</h3><p>${G.identityRecorded?'本轮没有暂存身份可归档。下一轮仍可暂存并归档一张。':'完成归档后，暂存身份才会加入永久收藏。'}</p></div></section>`;
}
function identityHomepageHTML(){
 const count=typeof POOL==='undefined'?0:POOL.filter(c=>c.identity&&c.permanent).length;
 return `<p class="identity-home-status">永久身份 ${count} 张 · 本轮${IDENTITY.pending?'已暂存1张，重试自动携带':'暂存 0 / 1'}<small>通关16关归档 · 暂存身份不能自由组卡</small><small>累计死亡 ${IDENTITY.deaths} 次 · 每第3次死亡33%概率淬炼遗灰</small></p>`;
}
// A completed campaign carries its earned deck into the next difficulty.
// All persisted entries are rebuilt from collection templates, never battle stats.
const CAMPAIGN_CARRY_STORAGE='lo_campaign_deck_v1';
const PLAYER_DECK_STORAGE='lo_player_deck_v2';
const CAMPAIGN_TRANSIENT_FIELDS=new Set(['a0','h0','e','poison','moved','rk','t','frozenUntil','abyssDiscount','_holdLocation']);
function campaignCarryRead(){try{return JSON.parse(localStorage.getItem(CAMPAIGN_CARRY_STORAGE)||'null')}catch{return null}}
function campaignCarryKey(key){const oldFinalComplete=typeof journey==='object'&&Number(journey.cleared)>=3;const legacy={story:'mire',standard:'brass',challenge:oldFinalComplete?'tide':'cinder'};return DIFFICULTY_ORDER.includes(key)?key:DIFFICULTY_ORDER.includes(legacy[key])?legacy[key]:null}
function campaignCarryTarget(key=difficulty){const index=DIFFICULTY_ORDER.indexOf(key);return index<0?null:DIFFICULTY_ORDER[(index+1)%DIFFICULTY_ORDER.length]}
function campaignCarryCard(value,allowLocked=false){
 const name=typeof value==='string'?value:value?.n;if(typeof name!=='string')return null;
 const source=collectionCard(name);if(!source||source.token||source.identity&&!source.permanent||!allowLocked&&!isCollected(source))return null;
 // Templates contain only declarative values; discard any transient fields from old saves.
 const clean={};for(const [key,item] of Object.entries(source))if(!CAMPAIGN_TRANSIENT_FIELDS.has(key)&&['string','number','boolean'].includes(typeof item))clean[key]=item;
 return clean;
}
function campaignCarryBosses(values){
 const stages=typeof CAMPAIGNS==='object'?Object.values(CAMPAIGNS).flat():STG;
 const known=new Set([...stages.map(st=>st.boss),...POOL.filter(c=>c.kind==='boss'&&c.rarity!=='rare').map(c=>c.n)]),result=[];
 for(const name of Array.isArray(values)?values:values instanceof Set?[...values]:[])if(typeof name==='string'&&known.has(name)&&!result.includes(name))result.push(name);
 return result;
}
function campaignCarrySnapshot(deck,reserve,defeatedBosses=[],repairGold=false){
 if(!Array.isArray(deck)||!Array.isArray(reserve))return null;
 const active=[],extra=[],copies=Object.create(null),gold=new Set();let removedGold=0;
 for(const value of deck){const c=campaignCarryCard(value);if(!c)continue;if(c.rarity==='rare'){if(gold.has(c.n)){removedGold++;continue}gold.add(c.n)}const count=copies[c.n]||0;if(active.length>=DECK_MAX||c.n!=='余芯'&&count>=collectionCopyLimit(c))extra.push(c);else{active.push(c);copies[c.n]=count+1}}
 for(const value of reserve){const c=campaignCarryCard(value,true);if(!c)continue;if(c.rarity==='rare'){if(gold.has(c.n)){removedGold++;continue}gold.add(c.n)}extra.push(c)}
 // Older saves allowed two gold copies. Keep the active copy, and repair only
 // the minimum size made invalid by that migration instead of resetting a deck.
 if(repairGold&&removedGold&&deck.length>=DECK_MIN&&active.length<DECK_MIN){
  for(let i=0;i<extra.length&&active.length<DECK_MIN;){const c=campaignCarryCard(extra[i]);if(c&&collectionHasCopyRoom(c,active)){active.push(c);extra.splice(i,1)}else i++}
  for(const name of typeof STARTER==='undefined'?[]:STARTER){if(active.length>=DECK_MIN)break;const c=campaignCarryCard(name);if(c&&collectionHasCopyRoom(c,active))active.push(c)}
  const ash=campaignCarryCard('余芯');while(ash&&active.length<DECK_MIN)active.push({...ash});
 }
 if(active.length<DECK_MIN)return null;
 return {deck:active,reserve:extra,defeatedBosses:campaignCarryBosses(defeatedBosses)};
}
function campaignCarryWrite(key,snapshot){
 if(!DIFFICULTY_ORDER.includes(key)||!snapshot)return false;
 try{localStorage.setItem(CAMPAIGN_CARRY_STORAGE,JSON.stringify({version:1,difficulty:key,...snapshot}));return true}catch{return false}
}
function getCampaignCarry(key=activeDifficulty()){
 if(!DIFFICULTY_ORDER.includes(key))return null;
 const latest=getLatestSavedDeck();if(latest)return {...latest,difficulty:key,savedDifficulty:latest.difficulty};
 const state=campaignCarryRead();if(!state||state.version!==1||campaignCarryKey(state.difficulty)!==key)return null;
 const clean=campaignCarrySnapshot(state.deck,state.reserve,state.defeatedBosses,true);if(!clean)return null;
 // Old three-campaign saves retain their ordinal progress, deck and reserve.
 if(state.difficulty!==key||JSON.stringify(state.deck)!==JSON.stringify(clean.deck)||JSON.stringify(state.reserve)!==JSON.stringify(clean.reserve))campaignCarryWrite(key,clean);
 return {difficulty:key,...clean};
}
function getLatestSavedDeck(){
 let state;try{state=JSON.parse(localStorage.getItem(PLAYER_DECK_STORAGE)||'null')}catch{return null}
 if(!state||state.version!==2||!Number.isSafeInteger(state.revision)||state.revision<1||!DIFFICULTY_ORDER.includes(state.difficulty))return null;
 const clean=campaignCarrySnapshot(state.deck,state.reserve,state.defeatedBosses,true);if(!clean)return null;
 const result={version:2,revision:state.revision,difficulty:state.difficulty,starter:state.starter===true,...clean};
 if(JSON.stringify(state)!==JSON.stringify(result))try{localStorage.setItem(PLAYER_DECK_STORAGE,JSON.stringify(result))}catch{}
 return result;
}
function saveLatestPlayerDeck(key,snapshot,starter=false){
 if(!DIFFICULTY_ORDER.includes(key)||!snapshot)return false;
 let previous;try{previous=JSON.parse(localStorage.getItem(PLAYER_DECK_STORAGE)||'null')}catch{}
 const revision=(Number.isSafeInteger(previous?.revision)&&previous.revision>=0?previous.revision:0)+1;
 try{localStorage.setItem(PLAYER_DECK_STORAGE,JSON.stringify({version:2,revision,difficulty:key,starter:!!starter,...snapshot}))}catch{return false}
 campaignCarryWrite(key,snapshot);
 try{const names=snapshot.deck.map(c=>c.n);if(typeof customDeck!=='undefined')customDeck=names;localStorage.setItem('lo_custom_deck',JSON.stringify(names))}catch{}
 try{if(typeof checkpointUpdateSavedDeck==='function')checkpointUpdateSavedDeck(snapshot.deck,snapshot.reserve,revision)}catch{}
 return true;
}
function saveHomePlayerDeck(deck,reserve=[],key=activeDifficulty(),starter=false){
 const old=getLatestSavedDeck()||getCampaignCarry(key);
 return saveLatestPlayerDeck(key,campaignCarrySnapshot(deck,reserve,old?.defeatedBosses||[]),starter);
}
function saveCampaignCarry(){
 if(!G||G.tutorial||G.replay||G.lv!==STG.length||G.wins<STG.length)return false;
 const target=campaignCarryTarget();if(!target)return false;
 const cleared=campaignCarryBosses([...(G.defeatedBosses instanceof Set?[...G.defeatedBosses]:Array.isArray(G.defeatedBosses)?G.defeatedBosses:[]),...STG.map(st=>st.boss)]);
 return saveLatestPlayerDeck(target,campaignCarrySnapshot(G.deck,G.reserve||[],cleared));
}
// Deck edits and claimed rewards survive retries, returning home and reloads.
// Battle state and provisional identities remain outside this saved portfolio.
function savePlayerDeck(){
 if(!G||G.tutorial||G.replay)return false;
 if(G.lv===STG.length&&G.wins>=STG.length)return saveCampaignCarry();
 return saveLatestPlayerDeck(difficulty,campaignCarrySnapshot(G.deck,G.reserve||[],G.defeatedBosses||[]));
}
function updateCampaignCarryDeck(deck,reserve=null,key=activeDifficulty()){
 const existing=getCampaignCarry(key);if(!existing)return false;
 return saveLatestPlayerDeck(key,campaignCarrySnapshot(deck,reserve===null?existing.reserve:reserve,existing.defeatedBosses),existing.starter===true);
}
// A short practice uses the real draw, sacrifice and combat functions.
const TUTORIAL_STORAGE='lo_tutorial_v1';
let TUT=null;
let tutorialMainSession=null;
const INTERFACE_TOUR=[
 {target:'.table-tools',title:'控制按钮',text:'这里可以开关<strong>音效与音乐</strong>，查看自己的卡组，或打开玩法手册。'},
 {target:'#enemy-health',title:'敌人的生命值',text:'敌人共有<strong>7点生命</strong>。游辉、霜瓣、潮露或七芒星辉随关卡变化，每个亮起的图标代表1点。'},
 {target:'#deck-e',title:'敌方牌堆',text:'敌人的卡组也有限。这里显示<strong>剩余牌数</strong>，牌堆会随着抽牌逐渐变薄。'},
 {target:'.enemy-hand',title:'敌方手牌',text:'牌背是对手还没有打出的手牌。可以看见<strong>数量</strong>，但看不见牌面。'},
 {target:'.enemy-board',title:'对面的五个战斗格',text:'普通卡只攻击<strong>自己正对面的格子</strong>；对位空着时直击敌人生命。飞行可越过敌卡，守护能拦截。'},
 {target:'.player-board',title:'我方的五个战斗格',text:'选中手牌后，在这里选择落点。有费用的卡需要先选祭品；<strong>刚出场的牌要等下一回合才能献祭</strong>。'},
 {target:'#player-health',title:'你的生命：不灭灯台',text:'下方的灯台和<strong>7根蜡烛</strong>代表我方生命。受伤时火焰缩小、蜡烛熄灭；生命归零就会落败。'},
 {target:'#ash-source',title:'余芯是什么？',text:'余芯是<strong>0费、0攻、1血</strong>的祭品，来源无限。先让它上场并存活一回合，下一回合才可献祭召唤。'},
 {target:'#deck-p',title:'你的卡组',text:'自己的卡组是<strong>有限的</strong>。点击牌堆或顶部“卡组”可查看与整理；每次保存后沿用<strong>最近保存的卡组</strong>。普通同名最多2张，鎏金在<strong>出战与备用合计最多1张</strong>，余芯不受同名限制。'},
 {target:'.hand',title:'手牌与卡牌信息',text:'双方起手各<strong>5张</strong>。上方的●是献祭费用，左下为攻击、右下为生命。<strong>手机长按卡牌</strong>可阅读介绍和完整技能。'},
 {target:'.ctl',title:'抽牌按钮：每轮二选一',text:'从<strong>第2回合</strong>起，先免费获得1张余芯，再从“抽卡组”和“再取余芯”中<strong>选择一次</strong>。这里只是按钮预览，不会真的抽牌。'},
 {target:'.player-boss-skill-trigger',title:'让Boss的技能为你所用',text:'同名普通或鎏金Boss卡在我方场上时，点生命旁的技能按钮装备。每回合最多装备一次，从第2回合启用；发动须消耗<strong>手牌中的1张余芯</strong>，成功后<strong>下回合冷却，再下一回合才能重用</strong>，敌我相同。来源离场或化灰后失效。护盾被攻击一次就消失。'},
 {target:'#player-health',title:'死亡余芯也会成长',text:'正式战斗的死亡次数会累计保存。每<strong>第3次死亡</strong>有<strong>33%</strong>概率生成比上一份遗骸更强的死亡身份，也可能是2费或3费。每轮仍只能暂存1张：再次死亡可保留或替换，通关16关后才永久归档。练习死亡不计入。'},
 {target:'.table-tools',title:'重战已通关的Boss',text:'首页和正式第一关的<strong>“重战关卡”</strong>可打开Boss列表。只可选择<strong>已击败的Boss</strong>，未通关的仍锁定。重战使用最近保存卡组，不覆盖主线进度，也不发通关奖励或累计死亡成长。'},
 {target:'#deck-p',title:'进度会自动保存',text:'主线在<strong>安全的出牌节点和关卡结束后</strong>自动保存。重新载入页面会回到上次未完成的位置，未领取奖励也会保留。最新保存的卡组继续沿用；新手练习和重战不覆盖主线存档。'},
 {target:'.ctl',title:'先手、部署与取消',text:'正式战斗<strong>空牌桌开场</strong>。每轮首关选择契币正反、点击灯契币，猜中先手。金币落定化成<strong>1张额外余芯交给后手</strong>：先手5张、后手6张，仍要自行部署并存活一轮才能献祭；之后逐关交替先手。每回合双方先后部署，再按先手顺序攻击。点<strong>结束部署</strong>继续，选错可右键、Esc或“取消”。接下来用木偶练习。'}
];
function tutorialOverviewDraw(){return !!G?.tutorial&&TUT?.overviewIndex===10}
function tutorialOverviewClick(event){
 if(!G?.tutorial||TUT?.overviewIndex==null||G.busy||drawRunning||infoPanel||DM||HOLD_DETAIL||OV!==null)return false;
 if(event.target.closest('[data-a="tutorial-skip"]'))return false;
 if(!event.target.closest('.tutorial-layer,.game-shell'))return false;
 event.preventDefault();TUT.overviewIndex++;
 if(TUT.overviewIndex>=INTERFACE_TOUR.length)TUT.overviewIndex=null;
 TUT.feedback='';render();return true;
}
function tutorialNeeded(){try{return !localStorage.getItem(TUTORIAL_STORAGE)&&journey.cleared===0}catch{return journey.cleared===0}}
function rememberTutorial(value){try{if(value==='done'||localStorage.getItem(TUTORIAL_STORAGE)!=='done')localStorage.setItem(TUTORIAL_STORAGE,value)}catch{}}
async function startTutorial(){
 if(!G?.tutorial){
  if(G&&OV!=='title'){
   if(typeof checkpointSave==='function')checkpointSave();
   tutorialMainSession={game:G,overlay:OV,difficulty,stages:[...STG]};
  }else tutorialMainSession=null;
 }
 infoPanel=null;detailCardOverride=null;OV=null;TUT={step:'overview',overviewIndex:0,feedback:'',finished:false};
 const card=n=>makeCard(POOL.find(c=>c.n===n));
 const openingNames=['苔庭铜缄掠风鸟','苔庭银露缄骨客','苔庭铠卫·欧恩','炽砂修灯师·瑟罗'];
 const remaining=[...STARTER];for(const n of openingNames){const i=remaining.indexOf(n);if(i>=0)remaining.splice(i,1)}
 const targets=()=>makeCard({n:'练习灯偶',a:0,h:5,c:0,at:'物理',lore:'练习用的零攻击木偶，不会反击，也没有守护。'},true);
 G={tutorial:true,lv:1,wins:0,kills:0,deck:STARTER.map(card),p:Array(5).fill(null),e:Array(5).fill(null),hp:7,ehp:7,turn:1,passiveTurn:-1,sel:null,moveSel:null,sac:new Set(),busy:1,mustDraw:0,killer:null,lastHit:null,log:[],history:[],hand:[],eh:[],draw:[...remaining.map(card),...openingNames.slice().reverse().map(card)],ed:STARTER.map(card),st:{...STG[0],n:'灯台旁 · 新手练习',pd:'两回合练习：部署余芯 → 等待一轮 → 二选一抽牌 → 献祭召唤。练习可跳过。',dk:[...STARTER]}};
 G.p[0]=makeCard({n:'苔庭银露缄骨客',a:1,h:2,c:1,at:'物理',t:0,lore:'普通卡只攻击自己正对面的格子。'});
 G.e[0]=targets();G.e[2]=targets();render();
 takeCard('p',true);render();await drawIdle;
 for(const side of ['e','p','e','p','e','p','e','p','e']){takeCard(side);render();await drawIdle}
 G.busy=0;logBattle('新手练习：木偶不会反击。先部署一张余芯，等下一回合再献祭。');render();
}
function tutorialSync(){
 if(!G?.tutorial||!TUT)return;
 let step;
 if(TUT.overviewIndex!=null)step='overview';
 else if(TUT.finished||G.turn>=3)step='done';
 else if(G.turn===1)step=G.p[2]?'wait':G.sel!=null&&G.hand[G.sel]?.n==='余芯'?'place':'ash';
 else if(G.mustDraw)step='draw';
 else if(G.p[2]?.n==='苔庭铜缄掠风鸟')step='attack';
 else if(G.sel!=null&&G.hand[G.sel]?.n==='苔庭铜缄掠风鸟')step=G.sac.has(2)?'summon':'sac';
 else step='card';
 if(TUT.step!==step){TUT.feedback='';TUT.step=step}
 const hand=n=>`.hand [data-a="h"][data-i="${G.hand.findIndex(c=>c.n===n)}"]`;
 TUT.targetSelectors=step==='overview'?[INTERFACE_TOUR[TUT.overviewIndex].target]:{ash:[hand('余芯')],place:['#c-p-2'],wait:['[data-a="end"]','#c-p-2'],draw:['[data-a="deck"]','[data-a="sq"]'],card:[hand('苔庭铜缄掠风鸟')],sac:['#c-p-2'],summon:['#c-p-2'],attack:['[data-a="end"]'],done:['#enemy-health']}[step];
}
function tutorialContent(){
 if(TUT.step==='overview'){const item=INTERFACE_TOUR[TUT.overviewIndex];return [`界面导览 · ${TUT.overviewIndex+1} / ${INTERFACE_TOUR.length}`,item.title,item.text,'点击任意位置或“下一项”继续；长按卡牌可查看详情。']}
 const copy={
 ash:['第 1 回合 · 1 / 3','先选一张余芯','起手有 <strong>5 张牌</strong>。余芯是零费祭品，先点击箭头指向的余芯手牌。','跟随金框点击即可；选错可右键、Esc，或点“取消”。'],
 place:['第 1 回合 · 2 / 3','把余芯放到第三格','点击下方发亮的<strong>我方第三格</strong>，把选中的余芯部署上场。','普通卡只能攻击自己正对面的卡；对面空着时，才直击敌方生命。'],
 wait:['第 1 回合 · 3 / 3','祭品要在场存活一回合','这张余芯<strong>本回合不能献祭</strong>，须存活到下一回合。点击“结束部署”，观察左侧苔庭银露缄骨客只攻击正对面的木偶。','新出场卡可在本回合攻击，但要到下一回合才可作祭品。'],
 draw:['第 2 回合 · 1 / 5','卡组与余芯，二选一','本轮已<strong>免费获得 1 张余芯</strong>。现在任选一次：抽卡组牌，或再取余芯。<strong>自己的卡组有限，余芯无限</strong>。','卡组抽牌会让牌堆变薄；取余芯不消耗卡组。'],
 card:['第 2 回合 · 2 / 5','选择飞行卡「苔庭铜缄掠风鸟」','余芯已存活一回合，现在能献祭。先点击手牌<strong>苔庭铜缄掠风鸟</strong>；卡名旁的 <strong>1 个 ●</strong> 表示需要 1 张祭品。','抽牌选择已完成，本轮不能再抽第二次。'],
 sac:['第 2 回合 · 3 / 5','点选已经成熟的祭品','点击箭头指向的<strong>第三格余芯</strong>，将它标记为祭品。它会亮起红色献祭框。','手里的余芯需要先上场，并存活到下一回合，才能献祭。'],
 summon:['第 2 回合 · 4 / 5','再点一次，献祭召唤','再点一次<strong>已标记的第三格</strong>，确认消耗余芯，把苔庭铜缄掠风鸟召唤到原位。','这里只是确认位置；确认前可用右键、Esc 或“取消”重新选择。'],
 attack:['第 2 回合 · 5 / 5','飞行可以越过对面的卡','苔庭铜缄掠风鸟正对面仍有木偶。点击<strong>结束部署</strong>，观察苔庭铜缄掠风鸟飞越它，直接扣除敌方生命。','守护是例外：有“守护”的对位卡能够拦截飞行。'],
 done:['指引完成 · 灯火初燃','你已经学会了','左侧苔庭银露缄骨客只伤到正对面的木偶；苔庭铜缄掠风鸟越过木偶，敌方生命 <strong>7 → 6</strong>。记住：<strong>祭品等一轮，抽牌二选一</strong>。','现在用你自己的卡组进入正式第一关。练习不计入通关与遗骸记录。']
 };
 return copy[TUT.step];
}
function tutorialHandle(action,i){
 if(action==='tutorial'){startTutorial();return true}
 if(!G?.tutorial||!TUT)return false;
 if(action==='tutorial-skip'||action==='tutorial-finish'){
  if(action==='tutorial-finish'&&TUT.step!=='done')return true;
  rememberTutorial(action==='tutorial-finish'?'done':'seen');
  const main=tutorialMainSession;tutorialMainSession=null;
  if(main){G=main.game;OV=main.overlay;difficulty=main.difficulty;STG.splice(0,STG.length,...main.stages);TUT=null;infoPanel=null;detailCardOverride=null;render()}
  else if(typeof checkpointCanContinue==='function'&&checkpointCanContinue()&&checkpointRestore()){TUT=null;render()}
  else newRun();
  return true;
 }
 if(['rules','logs','details','enemyinfo','closepanel','mute','mus','cancel'].includes(action))return false;
 tutorialSync();
 const step=TUT.step;
 const allowed=(action==='h'&&((['ash','place'].includes(step)&&G.hand[i]?.n==='余芯')||(['card','sac','summon'].includes(step)&&G.hand[i]?.n==='苔庭铜缄掠风鸟')))
  ||(action==='s'&&i===2&&['place','sac','summon'].includes(step))
  ||(action==='end'&&['wait','attack'].includes(step))
  ||(['deck','sq'].includes(action)&&step==='draw');
 if(allowed){TUT.feedback='';return false}
 TUT.feedback=step==='wait'?'这张余芯刚上场，还不能献祭。先结束本回合，让它存活一轮。':'先跟随金色箭头完成这一步；也可以点“跳过”进入正式游戏。';
 render();return true;
}
function renderTutorial(){
 if(!G?.tutorial||!TUT||OV!==null||infoPanel||HOLD_DETAIL)return;
 tutorialSync();const [label,title,text,tip]=tutorialContent(),busy=!!G.busy||drawRunning;
 const layer=document.createElement('div');layer.className='tutorial-layer'+(busy?' tutorial-busy':'')+(TUT.step==='overview'?' tutorial-overview':'');
 layer.innerHTML=`<svg class="tutorial-arrows" aria-hidden="true"><defs><marker id="tutorial-arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z"/></marker></defs><g class="tutorial-lines"></g></svg><section class="tutorial-coach" role="region" aria-label="新手指引" aria-live="polite"><div class="tutorial-heading"><span class="tutorial-step-label">${label}</span>${TUT.step==='overview'&&!busy?'<button class="overview-next" data-a="tutorial-next">'+(TUT.overviewIndex===INTERFACE_TOUR.length-1?'开始练习':'下一项 →')+'</button>':''}<button data-a="tutorial-skip" ${busy?'disabled':''}>跳过</button></div><h2>${busy?'烛火摇曳，稍候…':title}</h2><p>${busy?'正在发牌或结算，完成后箭头会带你继续。':text}</p>${!busy?`<p class="tutorial-tip">${tip}</p>`:''}${TUT.feedback&&!busy?`<p class="tutorial-feedback">${esc(TUT.feedback)}</p>`:''}${TUT.step==='done'&&!busy?'<div class="tutorial-footer"><button class="pri" data-a="tutorial-finish">点燃灯息 · 正式启程</button></div>':''}</section>`;
 document.getElementById('app').appendChild(layer);positionTutorial();
}
function positionTutorial(){
 const layer=document.querySelector('.tutorial-layer'),coach=layer?.querySelector('.tutorial-coach');if(!coach||!TUT||!G?.tutorial)return;
 layer.querySelectorAll('.tutorial-focus').forEach(n=>n.remove());
 const view=window.visualViewport,vw=view?.width||innerWidth,vh=view?.height||innerHeight,pad=12;
 const targets=(G.busy||drawRunning?[]:TUT.targetSelectors||[]).map(s=>document.querySelector(s)).filter(Boolean).map(n=>n.getBoundingClientRect()).filter(r=>r.width&&r.height);
 for(const r of targets){const f=document.createElement('div');f.className='tutorial-focus';f.style.cssText=`left:${r.left-3}px;top:${r.top-3}px;width:${r.width+6}px;height:${r.height+6}px`;layer.appendChild(f)}
 coach.style.width=Math.min(vw-24,vh<520&&vw>vh?290:310)+'px';coach.style.maxHeight=(vh-24)+'px';
 const box=coach.getBoundingClientRect(),w=box.width,h=box.height;
 const anchor=targets[0]||{left:vw/2,right:vw/2,top:vh,bottom:vh,width:0,height:0};
 const xs=[(vw-w)/2,pad,vw-w-pad,anchor.right+20,anchor.left-w-20];
 const ys=[anchor.top-h-22,anchor.bottom+22,pad,vh-h-pad];
 const overlap=(x,y,r)=>Math.max(0,Math.min(x+w+8,r.right+8)-Math.max(x-8,r.left-8))*Math.max(0,Math.min(y+h+8,r.bottom+8)-Math.max(y-8,r.top-8));
 let best=null;
 for(let x of xs)for(let y of ys){x=Math.max(pad,Math.min(vw-w-pad,x));y=Math.max(pad,Math.min(vh-h-pad,y));const score=targets.reduce((n,r)=>n+overlap(x,y,r)*10000,0)+Math.hypot(x+w/2-(anchor.left+anchor.width/2),y+h/2-(anchor.top+anchor.height/2));if(!best||score<best.score)best={x,y,score}}
 coach.style.left=best.x+'px';coach.style.top=best.y+'px';
 const lines=layer.querySelector('.tutorial-lines');lines.innerHTML='';
 if(!targets.length)return;
 const r=coach.getBoundingClientRect();
 for(const target of targets){const tx=target.left+target.width/2,ty=target.top+target.height/2;
  let sx=Math.max(r.left+16,Math.min(r.right-16,tx)),sy=ty>r.bottom?r.bottom:ty<r.top?r.top:Math.max(r.top+16,Math.min(r.bottom-16,ty));
  if(ty>=r.top&&ty<=r.bottom)sx=tx<r.left?r.left:r.right;
  const dx=tx-sx,dy=ty-sy,len=Math.hypot(dx,dy)||1,ex=tx-dx/len*(Math.min(target.width,target.height)/2+8),ey=ty-dy/len*(Math.min(target.width,target.height)/2+8);
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',`M ${sx} ${sy} Q ${sx+dx*.25} ${sy+dy*.7} ${ex} ${ey}`);path.setAttribute('marker-end','url(#tutorial-arrowhead)');lines.appendChild(path);
 }
}
// Display order is separate from deck and draw order. Edits stay in a draft.
const DECK_MIN=12,DECK_RECOMMENDED=24,DECK_MAX=36;
let DM=null,deckEntrySerial=0;
const DECK_SORTS={cost:'按费用',function:'按功能',attribute:'按属性',name:'按名称'};
const DECK_FUNCTIONS=['位移','飞行','防御','抽牌','治疗','控制与减费','亡语','持续伤害','成长与复生','普通攻击'];
const DECK_ATTRIBUTES=['物理','火','血','光','暗','雷','魔','冰','毒'];
function deckIconHTML(cls='deck-access-icon'){
 return `<svg class="${cls}" viewBox="0 0 40 44" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M9 5 30 2l5 31-21 4Z" fill="#53452b"/><path d="m6 9 22-2 4 31-22 3Z" fill="#342e21"/><rect x="3" y="12" width="23" height="30" rx="2" fill="#211f16"/><rect x="6" y="15" width="17" height="24" rx="1"/><path d="m14.5 19 2.7 6 5.3 2-5.3 2-2.7 6-2.7-6-5.3-2 5.3-2Z" fill="#bc9855"/></g></svg>`;
}
function deckEntry(card){return {id:'deck-card-'+(++deckEntrySerial),card}}
function deckFunctions(c){
 const tags=[];
 if(c.mv)tags.push('位移');if(c.s==='fly')tags.push('飞行');
 if(['guard','parry','thorn'].includes(c.s))tags.push('防御');
 if(c.dr||c.dd)tags.push('抽牌');
 if(c.s==='abyss')tags.push('控制与减费');
 if(c.heal||['regen','vamp'].includes(c.s)||c.x==='ember')tags.push('治疗');
 if(c.death)tags.push('亡语');
 if(c.s==='poison')tags.push('持续伤害');
 if(c.growth||c.s==='bones'||['rekindle','soul'].includes(c.x))tags.push('成长与复生');
 if(!tags.length)tags.push('普通攻击');return tags;
}
function deckSkills(c){return [c.growth&&'击杀成长',c.death&&'亡语',c.s&&SG[c.s],c.mv&&MOVE_LABEL[c.mv],c.x&&SX[c.x],c.dr&&'出场抽'+c.dr,c.dd&&'死亡抽'+c.dd,c.heal&&'引火回血'].filter(Boolean).join(' · ')||'对位攻击'}
function starterBudget(n){return Math.ceil(n*22/12)}
function starterIssue(names){
 if(!Array.isArray(names)||names.some(n=>!collectionCard(n)))return '卡组含有无法识别的卡牌。';
 names=names.map(canonicalCardName);
 if(names.length<DECK_MIN||names.length>DECK_MAX)return `起始卡组需 ${DECK_MIN}–${DECK_MAX} 张，推荐 ${DECK_RECOMMENDED} 张。`;
 if(names.some(n=>!isCollected(n)))return '卡组包含尚未获得的卡牌，请先通过冒险获得并解锁。';
 const count=Object.create(null);for(const n of names)if(n!=='余芯'&&(count[n]=(count[n]||0)+1)>collectionCopyLimit(n))return collectionCopyLimit(n)===1?'鎏金卡每种只能保留1张。':'普通出战同名卡最多2张，余芯除外。';
 const cards=names.map(collectionCard),cost=cards.reduce((v,c)=>v+(c.c||0),0);
 if(cost>starterBudget(names.length))return `当前总费用超过 ${starterBudget(names.length)}，请加入低费牌或替换高费牌。`;
 if(cards.filter(c=>c.c===0&&c.n!=='余芯').length>Math.ceil(names.length/6))return '零费卡过多，请增加其他费用的卡牌。';
 if(cards.filter(c=>c.kind==='boss').length>Math.ceil(names.length/4))return 'Boss卡过多，请增加小怪、精英或NPC。';
 return '';
}
function deckRunIssue(cards,reserve=[]){
 if(!Array.isArray(cards)||cards.length<DECK_MIN||cards.length>DECK_MAX)return `出战卡组需保留 ${DECK_MIN}–${DECK_MAX} 张。`;
 const count=Object.create(null);for(const c of cards)if(c.n!=='余芯'&&(count[c.n]=(count[c.n]||0)+1)>collectionCopyLimit(c))return collectionCopyLimit(c)===1?'鎏金卡每种只能保留1张（出战与备用合计）。':'普通出战同名卡最多2张；请将多余卡牌移入备用。';
 const gold=new Set(cards.filter(c=>c.rarity==='rare').map(c=>c.n));for(const c of reserve)if(c.rarity==='rare'){if(gold.has(c.n))return '鎏金卡每种只能保留1张（出战与备用合计）。';gold.add(c.n)}return '';
}
function openDeckManager(mode){
 if(G?.busy||drawRunning||G?.tutorial)return;
 infoPanel=null;detailCardOverride=null;
 const run=mode==='run'||(mode!=='home'&&G&&OV!=='title');
 const carry=!run?getCampaignCarry(activeDifficulty()):null,cards=run?G.deck:carry?carry.deck:(validDeck(customDeck)?customDeck:STARTER).map(n=>makeCard(collectionCard(n)));
 const portfolio=collectionDedupeGoldPortfolio(cards,run?G.reserve||[]:carry?carry.reserve:[]);
 DM={mode:run?'run':'home',carry:!!carry&&!carry.starter,carryDifficulty:carry?.difficulty,editable:(!run||OV==='camp')&&!G?.replay,origin:OV,tab:'active',rarity:'all',sort:'cost',direction:1,search:'',page:0,draft:portfolio.deck.map(deckEntry),reserve:portfolio.reserve.map(deckEntry),detail:null,feedback:''};
 render();requestAnimationFrame(()=>document.querySelector('.deck-manager-head [data-a="dm-close"]')?.focus());
}
function closeDeckManager(){
 DM=null;render();requestAnimationFrame(()=>document.querySelector('[data-a="deckmanager"]')?.focus());
}
function deckDraftIssue(){
 if(!DM)return '';
 return DM.mode==='home'&&!DM.carry?starterIssue(DM.draft.map(x=>x.card.n)):deckRunIssue(DM.draft.map(x=>x.card),DM.reserve.map(x=>x.card));
}
function saveDeckManager(){
 if(!DM?.editable)return;
 const issue=deckDraftIssue();if(issue){DM.feedback=issue;render();return}
 if(DM.mode==='home'){
  if(DM.carry){const cards=DM.draft.map(x=>x.card);cards.forEach(collectCard);if(!updateCampaignCarryDeck(cards,DM.reserve.map(x=>x.card),DM.carryDifficulty)){DM.feedback='无法保存沿用卡组，请重试。';render();return}}
  else{const cards=DM.draft.map(x=>x.card);if(!saveHomePlayerDeck(cards,[],DM.carryDifficulty||activeDifficulty(),true)){DM.feedback='无法保存卡组，请重试。';render();return}}
 }else if(OV==='camp'){
  G.deck=DM.draft.map(x=>x.card);G.reserve=DM.reserve.map(x=>x.card);G.deck.forEach(collectCard);
  if(!savePlayerDeck()){DM.feedback='无法保存卡组，请重试。';render();return}
 }else return;
 closeDeckManager();
}
function managerEntries(){
 let entries=DM.tab==='active'?DM.draft:DM.tab==='reserve'?DM.reserve:collectionLibraryCards().map((c,index)=>({id:isCollected(c)?'library-'+c.n:'sealed-'+index,card:c,locked:!isCollected(c),order:index}));
 if(DM.rarity&&DM.rarity!=='all')entries=entries.filter(({card:c})=>(c.rarity==='rare'?'rare':'common')===DM.rarity);
 const query=DM.search.trim().toLocaleLowerCase();
 if(query)entries=entries.filter(({card:c,locked})=>!locked&&[cardSearchText(c),...deckFunctions(c),deckSkills(c)].join(' ').toLocaleLowerCase().includes(query));
 const cmp=(a,b)=>{
  if(a.locked!==b.locked)return a.locked?1:-1;if(a.locked)return a.order-b.order;
  const ca=a.card,cb=b.card;let v=0;
  if(DM.sort==='cost')v=ca.c-cb.c;
  if(DM.sort==='function')v=DECK_FUNCTIONS.indexOf(deckFunctions(ca)[0])-DECK_FUNCTIONS.indexOf(deckFunctions(cb)[0]);
  if(DM.sort==='attribute')v=DECK_ATTRIBUTES.indexOf(ca.at||'物理')-DECK_ATTRIBUTES.indexOf(cb.at||'物理');
  if(DM.sort==='name'||v===0)v=typeof displayedCardName==='function'?displayedCardName(ca).localeCompare(displayedCardName(cb),gameLanguage==='en'?'en':'zh-Hans-CN'):ca.n.localeCompare(cb.n,'zh-Hans-CN');
  return v*DM.direction;
 };
 return entries.slice().sort(cmp);
}
function managerGroup(c){if(DM.tab==='library'&&!isCollected(c))return '未获得 · 问号牌';return DM.sort==='cost'?`${c.c} 费 · ${c.c?'献祭 '+c.c+' 张':'零费部署'}`:DM.sort==='function'?deckFunctions(c)[0]:DM.sort==='attribute'?(c.at||'物理')+'属性':'卡牌名称'}
function managerCardHTML(entry){
 const c=entry.card,active=DM.tab==='active',library=DM.tab==='library',isNew=c===G?.newReward||G?.newRewards?.includes(c);
 if(library&&!isCollected(c))return `<article class="managed-card collection-locked"><div class="managed-card-preview">${collectionLockedHTML()}</div><div class="managed-card-copy"><h4>未知卡牌</h4><p class="managed-card-skills">获得并编入出战后，永久解锁名称与能力。</p><button disabled>尚未获得</button></div></article>`;
 let edit='';
 if(DM.editable){
  if(active)edit=`<button data-a="dm-remove" data-id="${esc(entry.id)}">${DM.mode==='home'&&!DM.carry?'移出卡组':'移入备用'}</button>`;
  else{const capped=!collectionHasCopyRoom(c,DM.draft),reserved=library&&c.rarity==='rare'&&collectionCopyCount(c,DM.reserve)>0,blocked=DM.draft.length>=DECK_MAX||capped||(library&&!isCollected(c));edit=`<button data-a="dm-add" ${library?`data-n="${esc(c.n)}"`:`data-id="${esc(entry.id)}"`} ${blocked?'disabled':''}>${DM.draft.length>=DECK_MAX?'出战已满':capped?(c.rarity==='rare'?'鎏金仅1张':'已达2张'):reserved?'从备用编入':'加入出战'}</button>`}
 }
 const status=c.identity&&!c.permanent?'<span class="collection-pending">暂存身份 · 尚未永久</span>':!isCollected(c)?'<span class="collection-pending">编入出战并保存后解锁收藏</span>':'';
 return `<article class="managed-card ${isNew?'is-new':''}" data-card-id="${esc(entry.id)}" data-rarity="${c.rarity==='rare'?'rare':'common'}" data-cost="${c.c}" data-function="${deckFunctions(c)[0]}" data-attribute="${esc(c.at||'物理')}">${isNew?'<span class="is-new">新奖励</span>':''}<div class="managed-card-preview">${cardHTML(c)}</div><div class="managed-card-copy"><h4>${esc(c.n)} ${c.rarity==='rare'?'<span class="rarity-tag">✦ 鎏金稀有</span>':''}</h4>${status}<p class="managed-card-meta">${c.c}费 · ${esc(c.at||'物理')} · ${c.a}攻 / ${c.h0??c.h}血</p><p class="managed-card-skills">${esc(deckFunctions(c).join(' / '))} · ${esc(deckSkills(c))}</p><button data-a="dm-inspect" data-id="${esc(entry.id)}" ${library?`data-n="${esc(c.n)}"`:''}>详情</button>${edit}</div></article>`;
}
function deckManagerHTML(){
 const run=DM.mode==='run',portfolio=run||DM.carry,n=DM.draft.length,issue=deckDraftIssue(),entries=managerEntries(),pages=Math.max(1,Math.ceil(entries.length/24));DM.page=Math.min(DM.page,pages-1);
 const shown=DM.tab==='library'?entries.slice(DM.page*24,(DM.page+1)*24):entries;
 const groups=[];for(const entry of shown){const label=managerGroup(entry.card);let g=groups[groups.length-1];if(!g||g.label!==label)groups.push(g={label,entries:[]});g.entries.push(entry)}
 const note=DM.carry?'已保存的卡组与备用牌：用于本轮回的开局与重试，通关后继续沿用。普通同名最多2张，鎏金每种仅1张（含备用），余芯不限。':run?(DM.editable?'关间整理：可在出战、备用与永久卡库间调换；普通同名最多2张，鎏金每种仅1张（含备用），余芯不限。保存后过关、重试和下一轮回都会沿用。':'战斗中只读查看出战、备用与永久卡库；过关后可调整。'):'默认起始16张，推荐24张、上限36张。只可编入已收藏卡；普通同名最多2张，鎏金每种仅1张（含备用），余芯不限。保存后持续沿用，不会因过关重置。';
 const detail=DM.detail?`<section class="deck-manager-detail"><button data-a="dm-detail-close" aria-label="关闭卡牌详情">×</button><h3>${esc(displayedCardName(DM.detail))}</h3><p>${esc(cardNarrative(DM.detail)||'灯火未熄，继续你的旅途。')}</p><dl>${cardTip(DM.detail).split('¦').map(t=>`<div>${esc(t)}</div>`).join('')}</dl></section>`:'';
 const status=DM.feedback||(DM.editable?issue||`${n===DECK_RECOMMENDED?'已达到推荐24张。':n>DECK_RECOMMENDED?'超过推荐数量，25–36张也可以保留。':'低于24张仍可使用。'}${portfolio?'备用牌不参与本关抽牌。':`费用 ${deckCost(DM.draft.map(x=>x.card.n))}/${starterBudget(n)} · 普通同名最多2张，鎏金每种仅1张（含备用），余芯不限。`}`:'排序仅改变显示，不改变手牌、战场或抽牌顺序。');
 return `<div class="deck-manager-backdrop"><button class="deck-manager-scrim" data-a="dm-close" aria-label="取消并关闭卡组管理"></button><section class="deck-manager ${DM.editable?'editable':'read-only'}" role="dialog" aria-modal="true" aria-labelledby="deck-manager-title"><header class="deck-manager-head"><div class="deck-manager-title">${deckIconHTML('deck-emblem')}<div><small>THE KEEPER’S CARD FOLIO</small><h2 id="deck-manager-title">${DM.carry?'沿用卡组':run?'本轮卡组':'我的卡组'}</h2></div></div><button data-a="dm-close">${DM.editable?'取消':'关闭'} ×</button></header><div class="deck-manager-summary"><div class="deck-size">出战 <b>${n}</b><small> / 36 张</small></div><span>推荐 <strong>24 张</strong> · ${portfolio?'备用 '+DM.reserve.length+' 张':'下次开局使用'}</span><div class="deck-meter" aria-hidden="true"><i style="width:${n/DECK_MAX*100}%"></i></div></div><p class="deck-manager-note">${note}</p><div class="deck-manager-toolbar"><input id="dm-search" value="${esc(DM.search)}" placeholder="搜索卡牌或功能" aria-label="搜索卡组卡牌"><select id="dm-sort" aria-label="卡组排列方式">${Object.entries(DECK_SORTS).map(([key,label])=>`<option value="${key}" ${DM.sort===key?'selected':''}>${label}</option>`).join('')}</select><select id="dm-rarity" aria-label="卡组稀有度筛选">${[['all','所有稀有度'],['rare','鎏金稀有'],['common','普通卡牌']].map(([key,label])=>`<option value="${key}" ${DM.rarity===key?'selected':''}>${label}</option>`).join('')}</select><button data-a="dm-direction" aria-label="${DM.direction===1?'当前升序，改为降序':'当前降序，改为升序'}排列" title="${DM.direction===1?'升序':'降序'}">${DM.direction===1?'↑':'↓'}</button></div><nav class="deck-manager-tabs" aria-label="卡组分区"><button data-a="dm-tab" data-tab="active" class="${DM.tab==='active'?'active':''}">出战卡组 <span>${n}</span></button>${portfolio?`<button data-a="dm-tab" data-tab="reserve" class="${DM.tab==='reserve'?'active':''}">备用牌 <span>${DM.reserve.length}</span></button>`:''}<button data-a="dm-tab" data-tab="library" class="${DM.tab==='library'?'active':''}">永久卡库 <span>${collectionLibraryCards().filter(isCollected).length}/${collectionLibraryCards().length}</span></button></nav><div class="deck-manager-scroll">${detail}${groups.map(g=>`<section class="deck-group"><h3>${esc(g.label)}<small>${g.entries.length} 张</small></h3><div class="managed-grid">${g.entries.map(managerCardHTML).join('')}</div></section>`).join('')||'<p class="deck-empty-note">'+(DM.search||DM.rarity!=='all'?'没有匹配的卡牌。':DM.tab==='reserve'?'备用牌为空。关间可把出战卡移到这里，稍后重新编入。':'卡组为空，前往“全部卡牌”编入卡牌。')+'</p>'}${DM.tab==='library'?`<div class="deck-library-pages"><button data-a="dm-page" data-d="-1" ${DM.page?'':'disabled'}>上一页</button><span>${DM.page+1} / ${pages}</span><button data-a="dm-page" data-d="1" ${DM.page+1<pages?'':'disabled'}>下一页</button></div>`:''}</div><footer class="deck-manager-footer"><p class="deck-manager-feedback" aria-live="polite">${esc(status)}</p><div class="deck-manager-footer-actions">${!run?'<button data-a="dm-reset">推荐24张</button>':''}<button data-a="dm-close">${DM.editable?'取消修改':'返回战斗'}</button>${DM.editable?`<button class="pri" data-a="dm-save" ${issue?'disabled':''}>${run?'保存卡组':'保存起始卡组'}</button>`:''}</div></footer></section></div>`;
}
function deckManagerClick(action,target){
 if(action==='deckmanager'){
  if(G?.tutorial)return false;
  openDeckManager();return true;
 }
 if(action==='camp-continue'){
  if(OV==='camp'&&!DM){if(deckRunIssue(G.deck,G.reserve||[]))openDeckManager('run');else nextStage();}return true;
 }
 if(!action.startsWith('dm-'))return !!DM;
 if(!DM)return true;
 const scrollTop=document.querySelector('.deck-manager-scroll')?.scrollTop||0,tab=DM.tab;
 if(action==='dm-close'){closeDeckManager();return true}
 if(action==='dm-save'){saveDeckManager();return true}
 if(action==='dm-tab'){
  const tabs=DM.mode==='home'&&!DM.carry?['active','library']:['active','reserve','library'];
  if(tabs.includes(target.dataset.tab)){DM.tab=target.dataset.tab;DM.page=0;DM.detail=null;DM.feedback=''}
 }else if(action==='dm-direction'){DM.direction*=-1;DM.page=0}
 else if(action==='dm-page')DM.page=Math.max(0,DM.page+Number(target.dataset.d));
 else if(action==='dm-detail-close')DM.detail=null;
 else if(action==='dm-inspect'){
  const c=target.dataset.n?collectionCard(target.dataset.n):[...DM.draft,...DM.reserve].find(x=>x.id===target.dataset.id)?.card;DM.detail=DM.tab==='library'&&!isCollected(c)?null:c;
 }else if(action==='dm-reset'&&DM.mode==='home'&&DM.editable){DM.draft=RECOMMENDED_STARTER.map(n=>deckEntry(makeCard(collectionCard(n))));DM.feedback='已放入推荐24张，保存后生效。';DM.tab='active'}
 else if(action==='dm-remove'&&DM.editable){
  const i=DM.draft.findIndex(x=>x.id===target.dataset.id);if(i>=0){const [entry]=DM.draft.splice(i,1);if(DM.mode==='run'||DM.carry)DM.reserve.push(entry);DM.feedback='修改尚未保存。'}
 }else if(action==='dm-add'&&DM.editable){
  const library=DM.tab==='library',entry=!library?DM.reserve.find(x=>x.id===target.dataset.id):null,c=library?collectionCard(target.dataset.n):entry?.card;
  if(DM.draft.length>=DECK_MAX)DM.feedback='出战卡组已达36张，请先移出一张再加入新卡。';
  else if(!c||library&&!collectionCanAdd(c,DM.draft))DM.feedback=c&&!collectionHasCopyRoom(c,DM.draft)?c.rarity==='rare'?'鎏金卡出战与备用合计每种只能1张。':'普通同名卡已达2张，不能再编入出战。':'尚未获得这张卡，不能自由编入。';
  else if(!collectionHasCopyRoom(c,DM.draft))DM.feedback=c.rarity==='rare'?'鎏金卡每种只能1张，请先移出当前卡。':'普通同名卡已达2张，请先移出一张。';
  else if(library){const index=c.rarity==='rare'?DM.reserve.findIndex(x=>x.card.n===c.n):-1;DM.draft.push(index>=0?DM.reserve.splice(index,1)[0]:deckEntry(makeCard(c)));DM.feedback='修改尚未保存。'}
  else{const i=DM.reserve.indexOf(entry);if(i>=0){DM.draft.push(DM.reserve.splice(i,1)[0]);DM.feedback='修改尚未保存；新卡编入出战并保存后解锁收藏。'}}
 }

 render();const area=document.querySelector('.deck-manager-scroll');if(area)area.scrollTop=action==='dm-inspect'||DM.tab!==tab?0:scrollTop;return true;
}
function isCampaignFinalReward(){return !!G&&!G.tutorial&&G.lv===STG.length&&G.wins>=STG.length}
// Compatibility for callers from earlier releases; every campaign now grants one gold.
function isFinalAbyssReward(){return isCampaignFinalReward()}
function campaignRewardSelection(){
 if(!(G.rewardSelection instanceof Set))G.rewardSelection=new Set();
 const names=new Set(G.rw.map(c=>c.n));for(const name of G.rewardSelection)if(!names.has(name))G.rewardSelection.delete(name);return G.rewardSelection;
}
function addCampaignReward(reward){
 if(!goldRewardEligible(reward,G.deck,G.reserve||[])){logBattle(`${reward.n}已获得，不能再领取重复鎏金。`);return null}
 const c=makeCard(reward);G.reserve=G.reserve||[];
 const full=G.deck.length>=DECK_MAX,capped=!collectionHasCopyRoom(c,G.deck);
 if(!full&&!capped){G.deck.push(c);collectCard(c)}else{G.reserve.push(c);logBattle(capped?`${c.n}同名出战已达2张，本次奖励先放入备用。`:'出战已满36张，本次奖励先放入备用。')}
 if(typeof recordStoryCompanion==='function')recordStoryCompanion(c);
 return c;
}
function finishCampaignRewards(cards){
 G.rewardClaimed=true;G.rw=[];G.rewardSelection=new Set();G.rewardFeedback='';G.newRewards=cards;G.newReward=cards[cards.length-1]||null;
 savePlayerDeck();
 if(G.deck.length<DECK_MAX&&typeof checkpointSave==='function')checkpointSave({transition:true});
 if(G.deck.length>=DECK_MAX){OV='camp';render();openDeckManager('run')}else nextStage();
}
function claimReward(i){
 if(!G||OV!=='win'||G.rewardClaimed||!Number.isInteger(i))return;
 const reward=G.rw[i];if(!reward)return;
 const added=addCampaignReward(reward);if(!added){G.rewardFeedback='这张鎏金已获得，已更新为可领取的奖励。';if(typeof rewardCards==='function')G.rw=rewardCards();render();return}finishCampaignRewards([added]);
}
function confirmCampaignReward(){return false}
function campaignRewardHTML(){
 if(!G)return '';const final=isCampaignFinalReward(),rare=G.rw.some(c=>c.rarity==='rare');
 return `<div class="ov modal-screen reward-screen ${final?'final-abyss-reward':''}"><span class="modal-kicker">${final?'SEALED EVIDENCE':'INTERVIEW CLOSED'}</span><h2 class="${rare?'rare-reward-title':''}">${final?(G.rewardGoldExhausted?'轮回礼赞 · 鎏金已集齐':'轮回礼赞 · 鎏金'+G.rw.length+'选一'):rare?'鎏金降临 · 稀有奖励':'灯火仍在燃烧'}</h2>${bossFarewellHTML()}<section class="story-reward-note"><strong>${esc(storyCopy('companions','rewardTitle'))}</strong><p>${esc(storyCopy('companions','rewardText'))}</p></section>${identityCampaignHTML()}<p>${esc(G.st.n)} · 第${G.turn}回合获胜<br>生命 ${G.hp}/7 · 关间回复 ${RULES[difficulty].heal} 点</p><p class="rare-reward-note">${final?(G.rewardGoldExhausted?'本作鎏金已全部获得，本次可选择普通卡补充卡组。':'本轮回已完成！从本作Boss剩余'+G.rw.length+'张未拥有鎏金中，选择一张加入卡组。'):rare?'<strong>当前Boss的鎏金奖励已出现</strong> · 三张中任选一张':'本次通关有5%概率出现当前Boss鎏金 · 任选一张'}</p>${G.rewardFeedback?`<p class="deck-manager-feedback" role="status">${esc(G.rewardFeedback)}</p>`:''}<div class="row reward-row">${G.rw.map((c,i)=>cardHTML(c,'',`data-a="rw" data-i="${i}" tabindex="0" role="button" aria-label="${esc(c.n)}，选择这张奖励"`)).join('')}</div><p>点击一张卡牌领取。奖励加入出战；普通同名已达2张或出战满36张时进入备用。鎏金每种仅1张，已拥有的不会重复抽到。卡组与备用会沿用至下一轮回。</p></div>`;
}

document.addEventListener('change',event=>{if(!DM)return;if(event.target.id==='dm-rarity'&&['all','rare','common'].includes(event.target.value)){DM.rarity=event.target.value;DM.page=0;DM.detail=null;render();return}if(event.target.id!=='dm-sort')return;if(!Object.hasOwn(DECK_SORTS,event.target.value))return;DM.sort=event.target.value;DM.page=0;DM.detail=null;render()});
document.addEventListener('input',event=>{if(!DM||event.target.id!=='dm-search')return;const pos=event.target.selectionStart;DM.search=event.target.value;DM.page=0;render();const input=document.getElementById('dm-search');input?.focus();input?.setSelectionRange(pos,pos)});
document.addEventListener('keydown',event=>{
 if(!DM||event.key!=='Tab')return;
 const focusable=[...document.querySelectorAll('.deck-manager button:not(:disabled),.deck-manager input,.deck-manager select')].filter(n=>n.getClientRects().length),first=focusable[0],last=focusable[focusable.length-1];
 if(event.shiftKey&&(document.activeElement===first||!document.querySelector('.deck-manager').contains(document.activeElement))){event.preventDefault();last?.focus()}
 else if(!event.shiftKey&&(document.activeElement===last||!document.querySelector('.deck-manager').contains(document.activeElement))){event.preventDefault();first?.focus()}
});
const CARD_AUDIO_SAMPLES={};
const recordedCardContexts=new WeakMap(),activeRecordedCardSources=new Set();
function recordedCardState(context){
 let state=recordedCardContexts.get(context);
 if(!state){state={buffers:new Map(),voices:new Set(),draw:0,place:0,shuffle:0,lastDraw:-1,lastShuffle:-1};recordedCardContexts.set(context,state)}return state;
}
function recordedCardBuffer(context,name){
 const state=recordedCardState(context);if(state.buffers.has(name))return state.buffers.get(name);
 const sample=CARD_AUDIO_SAMPLES[name],binary=atob(sample.pcm),buffer=context.createBuffer(1,binary.length/2,sample.rate),channel=buffer.getChannelData(0);
 for(let i=0;i<channel.length;i++){const value=binary.charCodeAt(i*2)|(binary.charCodeAt(i*2+1)<<8);channel[i]=(value>=32768?value-65536:value)/32768}
 state.buffers.set(name,buffer);return buffer;
}
function stopRecordedCardSounds(){for(const source of [...activeRecordedCardSources]){try{source.stop()}catch{}source._cardCleanup?.()}}
function playRecordedCardSound(type,context){
 if(!['draw','shuffle','place'].includes(type))return false;if(mute)return true;
 const c=context||au();if(!c||c.state==='closed')return true;
 try{
  const state=recordedCardState(c),now=c.currentTime;
  if(type==='draw'&&now-state.lastDraw<.026||type==='shuffle'&&now-state.lastShuffle<.25)return true;
  let name;if(type==='draw'){state.lastDraw=now;name=['cardSlide1','cardSlide4','cardSlide7'][state.draw++%3]}
  else if(type==='shuffle'){state.lastShuffle=now;name=['cardShuffle','cardFan1'][state.shuffle++%2]}
  else name=['cardPlace1','cardPlace3'][state.place++%2];
  // Keep a shuffle under the hand animation without allowing repeated deals to pile up.
  if(state.voices.size>=5){const oldest=[...state.voices].find(v=>v._cardSoundType!=='shuffle')||state.voices.values().next().value;try{oldest.stop()}catch{}oldest._cardCleanup?.()}
  const source=c.createBufferSource(),gain=c.createGain(),filter=c.createBiquadFilter();source.buffer=recordedCardBuffer(c,name);
  source.playbackRate.value=type==='shuffle'?1:type==='place'?(state.place%2?.98:1.02):(state.draw%2?.99:1.01);
  filter.type='lowpass';filter.frequency.value=6500;filter.Q.value=.5;
  const level=type==='shuffle'?.15:type==='draw'?.21:.23,t=now+.003,duration=source.buffer.duration/source.playbackRate.value;
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(level,t+.004);gain.gain.setValueAtTime(level,t+Math.max(.005,duration-.012));gain.gain.linearRampToValueAtTime(0,t+duration);
  source.connect(filter);filter.connect(gain);gain.connect(c.mg||c.destination);source._cardSoundType=type;
  let cleaned=false;source._cardCleanup=()=>{if(cleaned)return;cleaned=true;state.voices.delete(source);activeRecordedCardSources.delete(source);source.disconnect();filter.disconnect();gain.disconnect()};
  source.onended=source._cardCleanup;state.voices.add(source);activeRecordedCardSources.add(source);source.start(t);
 }catch{}
 return true;
}
Object.assign(SND,{draw:()=>playRecordedCardSound('draw'),shuffle:()=>playRecordedCardSound('shuffle'),place:()=>playRecordedCardSound('place'),eplace:()=>playRecordedCardSound('place')});
// Engine toggles mute first; stop any longer shuffle as soon as the user turns sound off.
document.addEventListener('click',event=>{if(event.target.closest('[data-a]')?.dataset.a==='mute'&&mute)stopRecordedCardSounds()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopRecordedCardSounds()});
// Attack timbres follow the actor and its weapon, rather than elemental damage.
// Gold variants use baseName so their altered flavour text cannot change the sound.
// Priority: identity/token -> named actor override -> ranged/caster/armed names ->
// spirit/creature/heavy-body names -> explicit weapon/creature/spell descriptions.
// An otherwise unknown actor uses a blade; malformed/missing actors use impact.
// Elements never select a timbre on their own (a fire knight is still a swordsman).
const CARD_ATTACK_SOUND_LABELS={blade:'刀剑斩击',beast:'野兽咆哮',magic:'法术迸发',bow:'弓弩射击',spirit:'灵魂回响',impact:'重击震响'};
const CARD_ATTACK_SOUND_OVERRIDES=Object.create(null);
for(const [type,names] of Object.entries({
 blade:[
  '苔庭铠卫·欧恩','苔庭铠卫·乌恩','苔庭铠卫·依恩','苔庭铠卫·雅恩','苔庭潜印客·莫恩','炽砂潜印客·莫罗','苔庭银露缄骨客','苔庭暖灰缄骨客','苔庭石封铠卫','苔庭鸣枝铠卫','铜钟铠卫领誓·希拉','铜钟铠卫领誓·瑟翎',
  '苔庭铠卫领誓·维珀','苔庭攀崖羊灵领誓·伊珀','苔庭浮辉使领誓·索珀','苔庭灯议长·佩珀','苔庭灯议长·图珀','苔庭铠卫领誓·阿恩','铜钟铠卫领誓·米拉','铜钟铠卫领誓·洛拉','铜钟环藤蛇领誓·伦拉','铜钟裂角客领誓·佩拉','铜钟裂角客领誓·图温',
  '铜钟峰脊巨灵领誓·瑟温','铜钟铠卫领誓·维温','铜钟铠卫领誓·希温','铜钟缄骨客领誓·莱温','铜钟灯议长·莱拉','铜钟灯议长·伦温','铜钟铠卫领誓·佩温','铜钟铠卫领誓·泽温','铜钟铠卫领誓·阿雅',
  '炽砂铠卫领誓·乌弥','炽砂铠卫领誓·塔弥','炽砂铠卫领誓·维弥','炽砂灯议长·米弥','炽砂峰脊巨灵领誓·索弥','炽砂铠卫领誓·莱弥','炽砂铠卫领誓·莫弥','炽砂铠卫领誓·佩弥','炽砂灯议长·图弥','炽砂铠卫领誓·芮弥',
  '炽砂铠卫领誓·阿罗','炽砂灯议长·伊罗','炽砂铠卫领誓·依罗','炽砂灯议长·诺罗','砂镜铠卫领誓·塔安','砂镜铠卫领誓·莫安','砂镜峰脊巨灵领誓·佩安','砂镜铠卫领誓·图安','砂镜凝光泥团领誓·芮安','砂镜铠卫领誓·诺翎',
  '暮潮灯议长·岑尘','暮潮灯议长·乌汀','暮潮灯议长·维汀','暮潮灯议长·米汀','暮潮浮辉使领誓·塔尘','暮潮潜印客领誓·泽尘','暮潮流砂潜印客','暮潮潜印客·诺芙','暮潮潜印客·瑟芙','暮潮铠卫·维芙','暮潮潜印客·希芙','暮潮巡灯使·洛芙',
  '狼','霜枝铠卫领誓·泽芙','霜枝潜印客领誓·图芙','霜枝铠卫领誓·芮芙','霜枝潜印客领誓·依诺','霜枝潜印客领誓·雅诺','霜枝灯议长·诺诺','霜枝灯议长·希诺','霜枝灯议长·欧诺','霜枝灯议长·乌诺','霜枝琉纹攀钟猿',
  '星铸灯议长·泽烙','星铸裂角客领誓·佩烙','星铸裂角客领誓·伊玟','星铸铠卫领誓·芮烙','星铸裂角客领誓·艾玟','星铸裂角客领誓·岚玟','星铸灯议长·雅玟','星铸铠卫领誓·洛玟','大树守卫','星铸铠卫领誓·米玟','星铸灯议长·索玟',
  '星铸镜瞳山猫领誓·莱玟','星铸铠卫领誓·岑玟','星铸铠卫领誓·塔玟','星铸铠卫领誓·莫玟','星铸铠卫领誓·伦玟','星铸铠卫领誓·佩玟','星铸潜印客领誓·泽玟','星铸潜印客领誓·图玟',
  '星铸铠卫领誓·芮玟','星铸铠卫领誓·阿斐','星铸铠卫领誓·艾斐','星铸灯议长·米斐','星铸灯议长·泽斐','星铸灯议长·乌霖','星铸灯议长·依霖','星铸灯议长·雅霖','星铸灯议长·诺霖','星铸灯议长·瑟霖',
  '星铸灯议长·洛霖','星铸灯议长·米霖','星铸裂角客领誓·莱霖','星铸铠卫领誓·维玟','星铸晶棘蜥龙领誓·伦斐','星铸晶棘蜥龙领誓·佩斐',
  '折光灯议长·索岚','折光铠卫领誓·岑岚','折光锈鬃豕领誓·莫岚','折光铠卫领誓·泽岚','折光灯议长·图岚','折光铠卫领誓·芮岚','折光铠卫领誓·阿泽','折光铠卫领誓·艾泽',
  '折光铠卫领誓·依泽','折光晶棘蜥龙领誓·诺泽','折光攀钟猿领誓·瑟泽','炽砂铠卫·维安','炽砂铜缄悬灯铠卫','炽砂铜缄银露铠卫','折光远路铠卫','折光石封铠卫','星铸巡影狼·岚沐'
 ],
 beast:[
  '苔庭巡影狼领誓·伦珀','苔庭镜瞳山猫领誓·芮珀','苔庭晶棘蜥龙领誓·艾恩','苔庭晶棘蜥龙领誓·依珀','苔庭地缝蠕虫领誓·塔珀','苔庭晶棘蜥龙领誓·岚珀','苔庭裂角客领誓·伊恩','铜钟踏铃驹领誓·塔拉','铜钟苔脊软虫领誓·莫拉','铜钟钩针蝎领誓·图拉',
  '铜钟织光蛛领誓·阿温','织光领誓','铜钟线尾鼠领誓·艾温','铜钟线尾鼠领誓·伊温','铜钟露囊蛙领誓·依温','铜钟晶棘蜥龙领誓·岚温','铜钟晶棘蜥龙领誓·索温','铜钟晶棘蜥龙领誓·塔温','铜钟镜瞳山猫领誓·芮温','铜钟镜瞳山猫领誓·艾雅',
  '炽砂铠卫领誓·依弥','炽砂晶棘蜥龙领誓·岑弥','炽砂晶棘蜥龙领誓·泽弥','炽砂巡影狼领誓·艾罗','炽砂裂角客领誓·乌罗','炽砂晶棘蜥龙领誓·雅罗','砂镜裂角客领誓·泽安','砂镜织光蛛领誓·阿瑟','砂镜晶棘蜥龙领誓·伊瑟','砂镜潮纹游鱼领誓·依瑟',
  '砂镜地缝蠕虫领誓·诺瑟','暮潮星枝鹿领誓·莱尘','圣职者野兽','暮潮裂角客领誓·莫尘','暮潮星枝鹿领誓·伦尘','暮潮织光蛛领誓·图尘','暮潮缄骨客领誓·芮尘','暮潮折面星客领誓·依汀','暮潮踏铃驹领誓·雅汀','暮潮星枝鹿领誓·诺汀','暮潮灯议长·希汀',
  '暮潮裂角客领誓·莱汀','暮潮地缝蠕虫领誓·岑汀','暮潮棱耳猎犬领誓·塔汀','暮潮缄骨客领誓·莫汀','暮潮裂角客领誓·佩汀','霜枝攀钟猿领誓·艾诺','霜枝攀钟猿领誓·伊诺','霜枝攀钟猿领誓·阿诺','霜枝晶棘蜥龙领誓·维诺','霜枝苔痕环藤蛇','霜枝苔痕潮纹游鱼',
  '星铸巡影狼领誓·阿霖','星铸巡影狼领誓·艾霖','星铸环藤蛇领誓·阿玟','星铸巡影狼领誓·乌玟','星铸枝灯树灵领誓·乌斐','星铸枝灯树灵领誓·依斐','星铸赤角兽领誓·维霖','星铸赤角兽领誓·希霖','星铸甲灯虫领誓·岑霖',
  '星铸晶棘蜥龙领誓·塔霖','星铸晶棘蜥龙领誓·莫霖','星铸晶棘蜥龙领誓·伦霖','星铸晶棘蜥龙领誓·佩霖','星铸晶棘蜥龙领誓·泽霖','星铸晶棘蜥龙领誓·图霖','星铸晶棘蜥龙领誓·芮霖',
  '星铸晶棘蜥龙领誓·阿沐','星铸晶棘蜥龙领誓·艾沐','星铸晶棘蜥龙领誓·伊沐','星铸晶棘蜥龙领誓·欧沐','星铸晶棘蜥龙领誓·乌沐','折光晶棘蜥龙领誓·莱岚','折光镜瞳山猫领誓·塔岚','折光钩针蝎领誓·伦岚','折光石指傀儡领誓·佩岚',
  '折光晶棘蜥龙领誓·伊泽','折光晶棘蜥龙领誓·欧泽','折光磐颚河兽领誓·乌泽','折光晶棘蜥龙领誓·维泽','苔庭环藤蛇·阿拉','苔庭环藤蛇·艾拉','暮潮织光蛛·塔芙','暮潮巡灯使·岑芙',
  '暮潮琉纹折面星客','暮潮苔痕甲灯虫','苔庭回声地缝蠕虫','暮潮苔痕潮纹游鱼','暮潮铜缄潮纹游鱼','星铸绒雾裂角客','星铸夜航裂角客','星铸流砂裂角客','折光苔痕裂角客','苔庭铜缄掠风鸟','暮潮苔痕掠风鸟','炽砂铜缄巡影狼','炽砂回声巡影狼','霜枝苔痕棱耳猎犬','星铸微烛巡影狼','暮潮铜缄棱耳猎犬','暮潮铜缄巡影狼','暮潮织光蛛领誓·图尘','折光铜缄钩针蝎'
 ],
 magic:[
  '苔庭绛纹蝶领誓·乌珀','苔庭织光蛛领誓·雅珀','苔庭灯议长·洛珀','苔庭灯议长·泽珀','苔庭裂角客领誓·岑珀','铜钟灯议长·芮拉','铜钟枝灯树灵领誓·诺温','铜钟缄骨客领誓·洛温','铜钟灯议长·莫温',
  '炽砂灯议长·诺弥','炽砂灯议长·瑟弥','炽砂凝光泥团领誓·岚弥','炽砂灯议长·伦弥','砂镜灯议长·欧瑟','砂镜灯议长·乌瑟','砂镜灯议长·维瑟',
  '暮潮灯议长·佩尘','暮潮灯议长·艾汀','暮潮折面星客领誓·伊汀','暮潮折面星客领誓·欧汀','暮潮折面星客领誓·瑟汀','暮潮灯议长·洛汀','暮潮灯议长·岚汀','暮潮灯议长·伦汀',
  '星铸灯议长·图烙','星铸灯议长·图斐','星铸灯议长·芮斐','星铸甲灯虫领誓·岚霖','星铸甲灯虫领誓·索霖','折光灯议长·雅泽',
  '炽砂修灯师·瑟罗','砂镜修灯师·希瑟','铜钟修灯师·伊雅','暮潮修灯师·泽汀','苔庭修灯师·岑恩','苔庭修灯师·塔恩','苔庭观灯师·希恩','苔庭观灯师·洛恩','苔庭观灯师·米恩','苔庭观灯师·岚恩','苔庭巡灯使·索恩','苔庭织光蛛·莱恩',
  '苔庭修灯师·伦恩','苔庭潜印客·芮恩','苔庭绒伞菌灵·依拉','苔庭观灯师·雅拉','苔庭观灯师·瑟拉',
  '铜钟修灯师·岑雅','铜钟观灯师·塔雅','铜钟观灯师·莫雅','铜钟观灯师·伦雅','铜钟观灯师·泽雅','铜钟观灯师·图雅','铜钟观灯师·艾弥','铜钟修灯师·伊弥',
  '炽砂缄骨客·岚罗','炽砂修灯师·图罗','炽砂观灯师·阿安','炽砂观灯师·艾安','炽砂观灯师·伊安','炽砂观灯师·乌安','炽砂巡灯使·希安','砂镜修灯师·米瑟','砂镜修灯师·岚瑟',
  '砂镜观灯师·希尘','砂镜观灯师·洛尘','砂镜观灯师·米尘','砂镜观灯师·依翎','砂镜修灯师·雅翎','砂镜巡灯使·索尘',
  '暮潮铜缄观灯师','暮潮夜航折面星客','暮潮流砂折面星客','暮潮回声潮纹游鱼','暮潮折面星客·莱芙','暮潮修灯师·依芙','暮潮修灯师·雅芙','霜枝苔痕折面星客','霜枝铜缄折面星客','霜枝巡灯使·欧烙','霜枝修灯师·乌烙',
  '霜枝修灯师·索烙','霜枝修灯师·岚烙','星铸修灯师·希玟','星铸修灯师·洛沐','星铸观灯师·米沐','星铸观灯师·索沐','星铸巡灯使·岑沐','星铸巡灯使·泽沐','星铸巡灯使·图沐','星铸观灯师·希洛','星铸观灯师·洛洛','星铸观灯师·米洛',
  '星铸观灯师·岚洛','星铸观灯师·索洛','星铸巡灯使·岑洛','星铸修灯师·莫洛','星铸修灯师·佩洛','星铸观灯师·芮洛','星铸巡灯使·艾岚','星铸修灯师·伊岚','星铸浮岛龟·欧岚',
  '星铸琉纹枝灯树灵','暮潮绒雾折面星客','折光回声巡灯使','星铸风蚀观灯师','折光铜缄观灯师','折光巡灯使·莱泽','折光枝灯树灵·伦泽','折光巡灯使·泽泽','折光巡灯使·欧翎'
 ],
 bow:[
  '苔庭峰脊巨灵·泽恩','苔庭暖灰铠卫','炽砂铜缄石封铠卫','炽砂铜缄暖灰铠卫','苔庭静棱缄骨客','砂镜远路铠卫','砂镜回声缄骨客','暮潮铜缄铠卫','暮潮潜印客·岚芙','霜枝铜缄苔痕铠卫',
  '霜枝潜印客·芮诺','霜枝潜印客·阿烙','霜枝藤印铠卫','霜枝雾羽铠卫','霜枝悬灯潜印客','霜枝铜缄微烛铠卫','星铸铜缄铜缄巡灯使','星铸铠卫·瑟沐','星铸巡灯使·乌岚'
 ],
 spirit:[
  '星铸折面星客领誓·瑟玟','艾兽','苔庭缄骨客领誓·米珀','炽砂缄骨客领誓·希弥','铜钟浮辉使领誓·岑温','苔庭铜缄浮辉使','苔庭回声浮辉使','暮潮铜缄浮辉使','砂镜回声浮辉使','星铸铜缄浮辉使',
  '折光苔痕浮辉使','霜枝苔痕浮辉使','霜枝铜缄浮辉使','霜枝浮辉使·伦烙','星铸星枝鹿领誓·塔斐','星铸星枝鹿领誓·莫斐','炽砂绒雾修灯师','炽砂苔痕绛纹蝶','暮潮缄骨客领誓·阿汀'
 ],
 impact:[
  '苔庭裂角客领誓·阿珀','苔庭赤角兽领誓·艾珀','苔庭裂角客领誓·欧珀','苔庭裂角客领誓·诺珀','苔庭峰脊巨灵领誓·瑟珀','苔庭铠卫领誓·希珀','苔庭峰脊巨灵领誓·莱珀','苔庭枝灯树灵领誓·莫珀','铜钟峰脊巨灵领誓·维拉',
  '铜钟峰脊巨灵领誓·岚拉','铜钟缄骨客领誓·欧温','铜钟裂角客领誓·泽拉','铜钟铠卫领誓·雅温','炽砂枝灯树灵领誓·雅弥','炽砂裂角客领誓·洛弥','炽砂峰脊巨灵领誓·欧罗','砂镜裂角客领誓·伦安','砂镜峰脊巨灵领誓·雅瑟','砂镜峰脊巨灵领誓·瑟瑟',
  '暮潮峰脊巨灵领誓·索汀','霜枝裂角客领誓·瑟诺','霜枝铜缄裂角客','霜枝峰脊巨灵·瑟烙','霜枝铜缄峰脊巨灵','星铸灯议长·依玟','星铸峰脊巨灵领誓·欧玟','星铸灯议长·诺玟','星铸枝灯树灵领誓·雅斐','星铸枝灯树灵领誓·诺斐','星铸镜瞳山猫领誓·瑟斐',
  '星铸灯议长·维斐','星铸灯议长·希斐','星铸峰脊巨灵领誓·洛斐','星铸灯议长·岚斐','星铸裂角客领誓·莱斐','星铸裂角客领誓·岑斐','星铸灯议长·伊霖','星铸灯议长·欧霖','折光枝灯树灵领誓·希泽',
  '苔庭峰脊巨灵·瑟恩','苔庭巡灯使·诺恩','炽砂巡灯使·希罗','苔庭缄骨客·维恩','苔庭铜缄绒伞菌灵','苔庭回声绒伞菌灵','苔庭镜纹缄骨客','苔庭琉纹峰脊巨灵','苔庭风蚀峰脊巨灵','苔庭藤印铠卫','苔庭风蚀裂角客',
  '星铸微烛凝光泥团','折光苔痕窑心偶','星铸窑心偶·塔沐','星铸窑心偶·莫沐','星铸窑心偶·岚岚','折光铜缄枝灯树灵','铜钟铜缄流砂铠卫','铜钟铜缄铜缄铠卫','砂镜微烛峰脊巨灵','暮潮铜缄峰脊巨灵','暮潮回声峰脊巨灵','暮潮微烛峰脊巨灵'
 ]
}))for(const name of names)CARD_ATTACK_SOUND_OVERRIDES[name]=type;
function cardAttackSoundType(c){
 if(!c||typeof c!=='object')return 'impact';
 if(c.identity||c.d)return 'spirit';
 if(c.tokenKind==='spider'||c.n==='鎏金灯蛛')return 'beast';
 if(c.tokenKind==='flame'||c.n==='鎏金余芯')return 'magic';
 if(c.n==='余芯'||c.n==='碎灯偶')return 'impact';
 const name=String(c.baseName||c.n||'').replace(/^(?:砂镜地窟|黑魂[ⅠⅡⅢ]|暮潮港湾|霜枝高地|星铸天穹|折光边境)·/,'').replace(/·鎏金$/,'');
 if(CARD_ATTACK_SOUND_OVERRIDES[name])return CARD_ATTACK_SOUND_OVERRIDES[name];
 const family=CARD_ART_PROFILES[c.baseName||c.n]?.family;
 if(['mage','healer','alien','butterfly'].includes(family))return 'magic';
 if(family==='spirit')return 'spirit';
 if(['knight','human','rogue','undead'].includes(family))return 'blade';
 if(['giant','plant','mushroom','jar','blob','hand','mimic'].includes(family))return 'impact';
 if(family)return 'beast';
 const lore=String(c.lore||'');
 // Ranged weapons precede knights: an armored archer still releases a projectile.
 if(/大弓|弓兵|弓手|弩兵|弩手|火枪|持枪|持炮|枪手|射手|投斧/.test(name))return 'bow';
 // Occupations identify casters more reliably than fire/ice/lightning attributes.
 if(/法师|术士|术师|魔女|女巫|祭司|祭祀|施术者|传道者|祈祷|巫师|咒术师|召唤师|执事|主教|贵人|修女|女祭/.test(name))return 'magic';
 // Weapon-bearing names override misleading dragon, hound, lion or bird epithets.
 if(/骑士|骑兵|剑士|刀手|持剑|大剑|双刀|曲刀|长枪|持戟|卫兵|士兵|步兵|足轻|武士|侍大将|霜枝铜缄风蚀铠卫|霜枝藤印潜印客|霜枝银露潜印客|刺客|猎人|习武修士|战鬼|剑客/.test(name))return 'blade';
 if(/幽灵|亡魂|灵魂|游辉|星铸星枝鹿领誓·塔斐|砂镜铜缄浮辉使|砂镜回声浮辉使|苔庭回声浮辉使/.test(name))return 'spirit';
 if(/野兽|巨兽|怪兽|星铸石封裂角客|暮潮铜缄巡影狼|兽化|暮潮铜缄棱耳猎犬|暮潮回声棱耳猎犬|霜枝苔痕棱耳猎犬|野狗|星铸苔痕棱耳猎犬|炽砂微烛巡影狼|星铸微烛巡影狼|老鼠|鼠群|星铸回声线尾鼠|砂镜苔痕线尾鼠|铜钟回声线尾鼠|炽砂苔痕露囊蛙|蛙眼|蜘蛛|蛛形|蠕虫|蜈蚣|岩虫|蛆|吸血虫|甲虫|蜥蜴|乌鸦|苔庭铜缄掠风鸟|鹰|砂镜铜缄潮纹游鱼|星铸苔痕铜壳蟹|螃蟹|龙虾|章鱼|海鞘|蛞蝓|砂镜铜缄甲灯虫|巨蛇|小蛇|霜枝苔痕环藤蛇|飞龙|铜钟晶棘蜥龙领誓·索温|砂镜铜缄晶棘蜥龙|砂镜回声晶棘蜥龙|星铸暖灰晶棘蜥龙|无头龙|霜枝晶棘蜥龙领誓·维诺|大龙|红狼|战马|冰虎|刺猬|巨猿|霜枝微烛攀钟猿|猿猴|霜枝苔痕赤角兽|樱牛|公鸡|暮潮苔痕锈鬃豕|霜枝苔痕潮纹游鱼|河马|星铸苔痕石背熊|折光铜缄钩针蝎|折光苔痕甲灯虫|霜枝苔痕砂脊蜥|黑兽|暮潮镜纹折面星客|吞噬者|苔庭苔痕潮纹游鱼|寄生人|铜钟微烛镜瞳山猫|星铸镜纹裂角客/.test(name))return 'beast';
 if(/巨人|星铸回声峰脊巨灵|傀儡|巨偶|石像|石制|树人|树灵|树女|树影|蘑菇|巨锤|链锤|大锤|锯手|肉团|软泥|星铸回声凝光泥团|铁处女|炽砂苔痕匣中客|大壶|铁匠|星铸暖灰裂角客|恶魔|大嘴|手掌怪|手指怪/.test(name))return 'impact';
 // Remaining descriptions can settle an unknown actor, without relying on its element.
 if(/兽形|兽化躯体|巨大蜘蛛|蛙形|野兽|巨犬|扑咬|獠牙|以吼叫|以咆哮/.test(lore))return 'beast';
 if(/弓箭|弓弩|大弓|持枪射击|发射箭|射出箭|投掷/.test(lore))return 'bow';
 if(/巨锤|巨棒|重锤|挥棒|踏地|擒抱|挥拳|拳击|石像/.test(lore))return 'impact';
 if(/剑术|刀剑|剑刃|刀刃|长剑|双剑|大剑|双刀|曲剑|镰刀|巨斧|长枪|长戟|刺剑|斩击|剑锋/.test(lore))return 'blade';
 if(/施法|法术|魔法|秘法|祈祷|治愈|治疗|奇迹|咒术|召唤|幻术|灵火|星光/.test(lore))return 'magic';
 return 'blade';
}
const COMBAT_AUDIO_SAMPLES={};
// Role-based combat sounds share the existing effects toggle, never the music bus.
const combatAudioContexts=new WeakMap(),activeCombatSources=new Set();
const COMBAT_SOUND_LEVELS={burn:.23,blade:.24,beast:.21,magic:.20,bow:.24,spirit:.20,impact:.29,heal:.21,rare:.31};
function combatAudioState(context){let state=combatAudioContexts.get(context);if(!state){state={buffers:new Map(),voices:new Set(),last:{},beast:0};combatAudioContexts.set(context,state)}return state}
function combatAudioBuffer(context,name){
 const state=combatAudioState(context);if(state.buffers.has(name))return state.buffers.get(name);
 const sample=COMBAT_AUDIO_SAMPLES[name],binary=atob(sample.pcm),buffer=context.createBuffer(1,binary.length/2,sample.rate),channel=buffer.getChannelData(0);
 for(let i=0;i<channel.length;i++){const n=binary.charCodeAt(i*2)|(binary.charCodeAt(i*2+1)<<8);channel[i]=(n>=32768?n-65536:n)/32768}
 state.buffers.set(name,buffer);return buffer;
}
function stopCombatSounds(){for(const source of [...activeCombatSources]){try{source.stop()}catch{}source._combatCleanup?.()}}
function playCombatSound(kind,context,variant=null){
 if(!Object.prototype.hasOwnProperty.call(COMBAT_SOUND_LEVELS,kind))return false;if(mute)return true;const c=context||au();if(!c||c.state==='closed')return true;
 try{
  const state=combatAudioState(c),now=c.currentTime;
  if(['burn','heal','rare'].includes(kind)&&state.last[kind]!=null&&now-state.last[kind]<.07)return true;
  state.last[kind]=now;
  let name=variant&&COMBAT_AUDIO_SAMPLES[variant]?variant:kind;
  if(kind==='beast'&&!variant)name=state.beast++%2?'beastAlt':'beast';
  if(state.voices.size>=4){const oldest=[...state.voices].find(v=>v._combatKind!=='rare')||state.voices.values().next().value;try{oldest.stop()}catch{}oldest._combatCleanup?.()}
  const source=c.createBufferSource(),gain=c.createGain(),filter=c.createBiquadFilter();source.buffer=combatAudioBuffer(c,name);source.playbackRate.value=1;
  filter.type='lowpass';filter.frequency.value=kind==='rare'?9000:kind==='burn'?6500:7500;filter.Q.value=.5;
  const t=now+.003,duration=source.buffer.duration,level=COMBAT_SOUND_LEVELS[kind];
  gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(level,t+.003);gain.gain.setValueAtTime(level,t+Math.max(.004,duration-.018));gain.gain.linearRampToValueAtTime(0,t+duration);
  source.connect(filter);filter.connect(gain);gain.connect(c.mg||c.destination);source._combatKind=kind;
  let cleaned=false;source._combatCleanup=()=>{if(cleaned)return;cleaned=true;state.voices.delete(source);activeCombatSources.delete(source);source.disconnect();filter.disconnect();gain.disconnect()};
  source.onended=source._combatCleanup;state.voices.add(source);activeCombatSources.add(source);source.start(t);
 }catch{}
 return true;
}
function playCardAttackSound(card){
 const type=cardAttackSoundType(card),name=String(card?.baseName||card?.n||'');
 const family=CARD_ART_PROFILES[name]?.family,variant=type==='beast'&&(family==='bird'||/鸦|乌鸦|鹰|飞鸟|掠风鸟/.test(name))?'beastBird':type==='beast'&&(family==='bull'||/赤角兽|樱牛|野牛/.test(name))?'beastBull':null;
 return playCombatSound(type,undefined,variant);
}
Object.assign(SND,{burn:()=>playCombatSound('burn'),heal:()=>playCombatSound('heal'),rare:()=>playCombatSound('rare')});
document.addEventListener('click',event=>{if(event.target.closest('[data-a]')?.dataset.a==='mute'&&mute)stopCombatSounds()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCombatSounds()});

__STORY_SOURCE__
// Touch inspection never selects, deploys, sacrifices or rearranges a card.
let HOLD_DETAIL=null;
let pendingCardHold=null,heldCardGesture=null,holdRestoreSelector=null,holdRestoreScroll=[];
const activeCardPointers=new Set();
function cardHoldSource(node){
 if(!node||node.closest('.card-hold-backdrop'))return null;
 const i=Number(node.dataset.i);
 const option=node.closest('[data-identity-option]');if(option&&G?.identityChoice){const key=option.dataset.identityOption;return G.identityChoice[key]?{card:G.identityChoice[key],location:'identity',selector:`[data-identity-option="${key}"] .card`}:null}
 if(node.id==='death-identity-card'&&G?.dc)return {card:G.dc,location:'identity',selector:'#death-identity-card'};
 if(node.matches('.hand [data-a="h"]'))return G?.hand[i]?{card:G.hand[i],location:'hand',selector:`.hand [data-a="h"][data-i="${i}"]`}:null;
 const board=node.id.match(/^c-([pe])-(\d+)$/);
 if(board){const card=G?.[board[1]]?.[Number(board[2])];return card?{card,location:'board',selector:'#'+node.id}:null}
 if(node.matches('[data-a="rw"]'))return G?.rw?.[i]?{card:G.rw[i],location:'reward',selector:`[data-a="rw"][data-i="${i}"]`}:null;
 const entry=node.closest('.managed-card[data-card-id]');
 if(entry&&typeof DM!=='undefined'&&DM){
  const id=entry.dataset.cardId;
  const card=id.startsWith('library-')?(isCollected(id.slice(8))?collectionCard(id.slice(8)):null):[...DM.draft,...DM.reserve].find(x=>x.id===id)?.card;
  return card?{card,location:'deck',selector:`.managed-card[data-card-id="${CSS.escape(id)}"] [data-a="dm-inspect"]`}:null;
 }
 if(node.closest('.catalog-entry')){const name=node.dataset.cardName||node.querySelector('.top b')?.textContent;const card=collectionCard(name);return card&&isCollected(card)?{card,location:'catalog',selector:'.catalog-head button'}:null}
 return null;
}
function rememberCardHoldScroll(){
 return ['#app','.hand','.deck-manager-scroll','.drawer-scroll'].map(selector=>{const node=document.querySelector(selector);return node?{selector,left:node.scrollLeft,top:node.scrollTop}:null}).filter(Boolean);
}
function restoreCardHoldScroll(){for(const item of holdRestoreScroll){const node=document.querySelector(item.selector);if(node){node.scrollLeft=item.left;node.scrollTop=item.top}}}
function cancelPendingCardHold(){
 if(!pendingCardHold)return;
 clearTimeout(pendingCardHold.timer);pendingCardHold.node.classList.remove('card-being-held');pendingCardHold=null;
}
function cardHoldBusy(){return (typeof G!=='undefined'&&G?.busy)||(typeof drawRunning!=='undefined'&&drawRunning)}
function showCardHold(source){
 if(!source?.card||HOLD_DETAIL||cardHoldBusy())return;
 holdRestoreSelector=source.selector;holdRestoreScroll=rememberCardHoldScroll();
 HOLD_DETAIL={...source.card,_holdLocation:source.location};
 render();restoreCardHoldScroll();
 requestAnimationFrame(()=>document.querySelector('.card-hold-head [data-a="hold-close"]')?.focus({preventScroll:true}));
}
function closeCardHold(){
 if(!HOLD_DETAIL)return;
 HOLD_DETAIL=null;render();restoreCardHoldScroll();
 const selector=holdRestoreSelector;
 requestAnimationFrame(()=>{const node=(selector&&document.querySelector(selector))||document.querySelector('.deck-manager-head button,.table-tools button,.home-start');node?.focus({preventScroll:true})});
}
function cardHoldClick(action){
 if(action==='hold-close'){closeCardHold();return true}
 return !!HOLD_DETAIL;
}
function cardHoldAbilities(c){
 const rows=[];
 const label=(name,text)=>{if(text)rows.push([name,text.startsWith(name+'：')?text.slice(name.length+1):text])};
 if(c.s)label(SG[c.s]||'卡牌技能',SGD[c.s]||SGS[c.s]||'详见卡牌完整说明。');
 if(c.growth)label('击杀成长',GROWTH_HELP);
 if(c.death)label('亡语',DEATH_HELP[c.death]);
 if(c.mv)label(MOVE_LABEL[c.mv]||'位移',MOVE_HELP[c.mv]);
 if(c.x)label(SX[c.x]||'遗物能力',SXS[c.x]);
 if(c.dr)label('出场抽牌',`部署上场后抽取 ${c.dr} 张自己的卡组牌；卡组为空时不再抽取。`);
 if(c.dd)label('死亡抽牌',`退场或被献祭时抽取 ${c.dd} 张自己的卡组牌；卡组为空时不再抽取。`);
 if(c.heal)label('引火',`出场时回复己方 ${c.heal} 点生命，最多回复到 7 点。`);
 if(c.poison)label('当前中毒',`剩余 ${c.poison} 回合，每回合结束失去 1 点生命。`);
 if(frozenTurns(c))label('当前冻结',c.bossFrozenUntil>G.turn&&!(c.frozenUntil>G.turn)?'契环冰封：本回合不能打出，下一回合解除，费用不变。':`还需 ${frozenTurns(c)} 回合，期间不能打出。第 ${c.frozenUntil} 回合开始解冻，献祭费用减少 1，最低为 0。`);
 if(c.abyssDiscount)label('裂辉减费',`本次对战中已减少 ${c.abyssDiscount} 点献祭费用，当前费用为 ${c.c}。`);
 for(const row of bossCardStatusRows(c))label(row[0],row[1]);
 if(!rows.length)label('普通攻击','没有额外技能。结算时攻击自己正对面的卡牌；对面没有卡牌时直接攻击敌方生命。');
 if(c.at)label('属性关系',atTip(c.at));
 if(c._holdLocation==='board'&&typeof G!=='undefined'&&G&&(c.t||0)>=G.turn)label('献祭状态','本回合刚上场，还不能作为祭品；存活到下一回合后才可献祭。');
 return rows;
}
function cardHoldHTML(){
 if(!HOLD_DETAIL)return '';
 const c=HOLD_DETAIL,tips=cardTip(c).split('¦');
 const lore=cardNarrative(c)||(c.n==='余芯'?'燃尽之后留下的余温。余芯可以免费部署，是献祭召唤的基础。':'灯火未熄，继续你的旅途。');
 const cost=c.c?`召唤需要献祭 ${c.c} 张友军。新上场的友军须在场存活到下一回合后，才能作为祭品。`:'零费卡，无需献祭即可部署到空格。';
 return `<div class="card-hold-backdrop"><button class="card-hold-scrim" data-a="hold-close" aria-label="关闭卡牌说明"></button><section class="card-hold-dialog" role="dialog" aria-modal="true" aria-labelledby="card-hold-title"><header class="card-hold-head"><div><small>EXAMINE THE RECORD</small><h2 id="card-hold-title">${esc(c.n)}</h2></div><button data-a="hold-close">关闭 ×</button></header><div class="card-hold-scroll"><div class="card-hold-intro"><div class="card-hold-preview">${cardHTML(c)}</div><div class="card-hold-copy"><p class="card-hold-origin">${esc(tips[0])}</p><h3>卡牌介绍</h3><p>${esc(lore)}</p></div></div><dl class="card-hold-stats"><div><dt>攻击</dt><dd>${c.a}</dd></div><div><dt>生命</dt><dd>${c.h}<small> / ${c.h0??c.h}</small></dd></div><div><dt>献祭费用</dt><dd>${c.c||0}</dd></div></dl><section class="card-hold-section"><h3>部署与献祭</h3><p>${esc(cost)}</p></section><section class="card-hold-section"><h3>技能作用</h3><dl class="card-hold-abilities">${cardHoldAbilities(c).map(([name,text])=>`<div><dt>${esc(name)}</dt><dd>${esc(text)}</dd></div>`).join('')}</dl></section><p class="card-hold-note">长按只查看说明，不会出牌、献祭或改变当前选择。</p></div><footer class="card-hold-footer"><button class="pri" data-a="hold-close">返回牌桌</button></footer></section></div>`;
}
function firePendingCardHold(){
 const press=pendingCardHold;
 if(!press||!press.node.isConnected||activeCardPointers.size!==1||cardHoldBusy()||press.game!==G||press.manager!==(typeof DM==='undefined'?null:DM)||press.overlay!==OV){cancelPendingCardHold();return}
 const source=cardHoldSource(press.node);if(!source){cancelPendingCardHold();return}
 heldCardGesture={pointerId:press.pointerId,x:press.x,y:press.y,released:false,until:Infinity};
 cancelPendingCardHold();showCardHold(source);
}
document.addEventListener('pointerdown',event=>{
 if(!['touch','pen'].includes(event.pointerType))return;
 if(heldCardGesture?.released)heldCardGesture=null;
 activeCardPointers.add(event.pointerId);
 if(activeCardPointers.size!==1){cancelPendingCardHold();return}
 if(HOLD_DETAIL||cardHoldBusy())return;
 const node=event.target.closest('.card');if(!node||!document.getElementById('app')?.contains(node)||!cardHoldSource(node))return;
 cancelPendingCardHold();node.classList.add('card-being-held');
 pendingCardHold={node,pointerId:event.pointerId,x:event.clientX,y:event.clientY,started:performance.now(),game:G,manager:typeof DM==='undefined'?null:DM,overlay:OV,timer:setTimeout(firePendingCardHold,500)};
},{capture:true,passive:true});
document.addEventListener('pointermove',event=>{
 if(pendingCardHold?.pointerId===event.pointerId&&Math.hypot(event.clientX-pendingCardHold.x,event.clientY-pendingCardHold.y)>10)cancelPendingCardHold();
},{capture:true,passive:true});
function finishCardPointer(event){
 activeCardPointers.delete(event.pointerId);
 if(pendingCardHold?.pointerId===event.pointerId)cancelPendingCardHold();
 if(heldCardGesture?.pointerId===event.pointerId){heldCardGesture.released=true;heldCardGesture.until=performance.now()+850;requestAnimationFrame(()=>{if(HOLD_DETAIL)document.querySelector('.card-hold-head [data-a="hold-close"]')?.focus({preventScroll:true})})}
}
document.addEventListener('pointerup',finishCardPointer,{capture:true,passive:true});
document.addEventListener('pointercancel',finishCardPointer,{capture:true,passive:true});
document.addEventListener('scroll',cancelPendingCardHold,{capture:true,passive:true});
window.addEventListener('blur',()=>{cancelPendingCardHold();activeCardPointers.clear();heldCardGesture=null});
document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelPendingCardHold();activeCardPointers.clear();heldCardGesture=null}});
document.addEventListener('click',event=>{
 const held=heldCardGesture;if(!held)return;
 if(held.released&&performance.now()>held.until){heldCardGesture=null;return}
 const samePointer=event.pointerId!=null&&event.pointerId===held.pointerId;
 const samePoint=event.detail>0&&Math.hypot(event.clientX-held.x,event.clientY-held.y)<35;
 if(samePointer||samePoint){event.preventDefault();event.stopImmediatePropagation();heldCardGesture=null}
},{capture:true});
document.addEventListener('contextmenu',event=>{
 if(pendingCardHold&&event.target.closest('.card')===pendingCardHold.node){event.preventDefault();event.stopImmediatePropagation();if(performance.now()-pendingCardHold.started>=420)firePendingCardHold();return}
 const held=heldCardGesture;
 if(held&&(!held.released||performance.now()<=held.until)&&(event.pointerId===held.pointerId||Math.hypot(event.clientX-held.x,event.clientY-held.y)<35)){event.preventDefault();event.stopImmediatePropagation()}
},{capture:true});
document.addEventListener('keydown',event=>{
 if(!HOLD_DETAIL)return;
 if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeCardHold();return}
 if(event.key!=='Tab')return;
 event.preventDefault();event.stopImmediatePropagation();
 const controls=[...document.querySelectorAll('.card-hold-dialog button:not(:disabled),.card-hold-dialog [tabindex="0"]')].filter(n=>n.getClientRects().length);
 if(!controls.length)return;
 const current=controls.indexOf(document.activeElement),next=event.shiftKey?(current<=0?controls.length-1:current-1):(current+1)%controls.length;
 controls[next]?.focus();
},{capture:true});
// Revisit a cleared guardian without changing the live campaign or its save.
const REPLAY_CLEAR_STORAGE='lo_boss_clears_v1';
let REPLAY_MENU=null,REPLAY_SESSION=null;
function isBossReplay(){return !!G?.replay}
function replayStage(game,level){return DIFFICULTY_ORDER.includes(game)&&Number.isInteger(level)&&level>=1?CAMPAIGNS[game]?.[level-1]||null:null}
function replayKey(game,level){return `${game}:${level}`}
function replayStoredKeys(){
 try{const state=JSON.parse(localStorage.getItem(REPLAY_CLEAR_STORAGE)||'null');if(state?.version!==1||!Array.isArray(state.cleared))return new Set();return new Set(state.cleared.filter(key=>{if(typeof key!=='string')return false;const [game,number,...rest]=key.split(':');return !rest.length&&replayStage(game,Number(number))&&key===replayKey(game,Number(number))}))}catch{return new Set()}
}
function replayClearedKeys(){
 const keys=replayStoredKeys(),names=new Set();
 const readNames=state=>{for(const n of state?.defeatedBosses instanceof Set?[...state.defeatedBosses]:Array.isArray(state?.defeatedBosses)?state.defeatedBosses:[])if(typeof n==='string')names.add(n);for(const row of Array.isArray(state?.history)?state.history:[])if(typeof row?.boss==='string')names.add(row.boss)};
 readNames(isBossReplay()?REPLAY_SESSION?.main.G:G);
 if(typeof campaignCarryRead==='function')readNames(campaignCarryRead());
 if(typeof getLatestSavedDeck==='function')readNames(getLatestSavedDeck());
 for(const [world,game]of DIFFICULTY_ORDER.entries())for(const [index,stage]of CAMPAIGNS[game].entries())if(world<Math.max(journey?.unlocked||0,journey?.cleared||0)||names.has(stage.boss))keys.add(replayKey(game,index+1));
 return keys;
}
function replaySaveClears(keys){try{localStorage.setItem(REPLAY_CLEAR_STORAGE,JSON.stringify({version:1,cleared:[...keys]}));return true}catch{return false}}
function recordReplayClear(game=difficulty,level=G?.lv){
 if(!G||G.tutorial||G.replay)return false;
 const stage=replayStage(game,level);if(!stage||G.st?.boss!==stage.boss)return false;
 const keys=replayClearedKeys();keys.add(replayKey(game,level));return replaySaveClears(keys);
}
function replayEntryAllowed(){return !isBossReplay()&&(OV==='title'||OV===null&&G?.lv===1&&!G.tutorial)&&!G?.busy&&!(typeof drawRunning!=='undefined'&&drawRunning)&&!(typeof DM!=='undefined'&&DM)&&!(typeof HOLD_DETAIL!=='undefined'&&HOLD_DETAIL)&&!(typeof infoPanel!=='undefined'&&infoPanel)}
function replayButtonHTML(){
 if(isBossReplay())return `<button type="button" class="replay-entry replay-return" data-replay="return" ${G.busy||drawRunning?'disabled':''} aria-label="退出重战，返回之前的主线"><span class="replay-entry-label">退出重战</span></button>`;
 if(!(OV==='title'||OV===null&&G?.lv===1&&!G.tutorial))return '';
 return `<button type="button" class="replay-entry" data-replay="open" ${G?.busy||drawRunning?'disabled':''} aria-haspopup="dialog" aria-label="重战已通关的Boss，未通关关卡锁定"><span class="replay-entry-label">重战关卡</span></button>`;
}
function replayWorldLabel(game){return GAME_META[game]?.[0]||game}
function replayMenuHTML(){
 const keys=replayClearedKeys(),game=REPLAY_MENU.game;
 return `<section class="replay-panel" role="dialog" aria-modal="true" aria-labelledby="replay-title"><header><div><small>REMEMBER THE GUARDIANS</small><h2 id="replay-title">重战已通关Boss</h2></div><button type="button" data-replay="close" aria-label="关闭重战列表">关闭 ×</button></header><p class="replay-rules">使用最近保存的卡组。重战不覆盖主线进度，不发通关奖励，不记录死亡成长。未击败的守关者暂不能选择。</p><nav class="replay-worlds" aria-label="选择轮回">${DIFFICULTY_ORDER.map(key=>`<button type="button" data-replay="world" data-replay-world="${key}" aria-pressed="${key===game}"><b>${({mire:'苔庭',brass:'铜钟',cinder:'炽砂',tide:'暮潮港湾',frost:'霜枝高地',astral:'星铸天穹'})[key]}</b><small>${CAMPAIGNS[key].filter((_,i)=>keys.has(replayKey(key,i+1))).length}/16</small></button>`).join('')}</nav><div class="replay-stage-list" aria-label="${esc(replayWorldLabel(game))}关卡">${CAMPAIGNS[game].map((stage,index)=>{const level=index+1,cleared=keys.has(replayKey(game,level));return `<article class="replay-stage ${cleared?'cleared':'locked'}"><span class="replay-stage-number">${level}</span><div><b>${cleared?esc(stage.boss):'尚未通关'}</b><small>${cleared?esc(stage.n):'击败此关Boss后可重战'}</small></div><button type="button" data-replay="start" data-replay-world="${game}" data-replay-level="${level}" ${cleared?'':'disabled'} aria-label="${cleared?'重战第'+level+'关'+esc(stage.boss):'第'+level+'关未通关，无法选择'}">${cleared?'重战':'锁定'}</button></article>`}).join('')}</div><footer>已解锁 ${keys.size} / 96 关 · 右键或Esc关闭</footer></section>`;
}
function openReplayMenu(){
 if(!replayEntryAllowed())return false;
 const keys=replayClearedKeys();replaySaveClears(keys);
 if(typeof closeBossAbilityPopover==='function')closeBossAbilityPopover(false);
 if(typeof closePlayerBossSkillPopover==='function')closePlayerBossSkillPopover(false);
 closeReplayMenu(false);
 const previousFocus=document.activeElement,wrapper=document.createElement('div');wrapper.className='replay-backdrop';
 REPLAY_MENU={game:DIFFICULTY_ORDER.includes(difficulty)?difficulty:activeDifficulty(),wrapper,previousFocus};wrapper.innerHTML=replayMenuHTML();document.body.appendChild(wrapper);wrapper.querySelector('[data-replay="close"]').focus({preventScroll:true});return true;
}
function closeReplayMenu(restoreFocus=true){
 const menu=REPLAY_MENU;if(!menu)return;REPLAY_MENU=null;menu.wrapper.remove();if(restoreFocus&&menu.previousFocus?.isConnected)menu.previousFocus.focus({preventScroll:true});
}
function replayPortfolio(){
 const latest=typeof getLatestSavedDeck==='function'?getLatestSavedDeck():null;
 const carry=latest||(typeof getCampaignCarry==='function'?getCampaignCarry(activeDifficulty()):null);
 const names=typeof validDeck==='function'&&validDeck(customDeck)?customDeck:STARTER;
 const result={deck:(carry?.deck||names).map(c=>typeof c==='string'?collectionCard(c):c).filter(Boolean).map(c=>makeCard(c)),reserve:(carry?.reserve||[]).map(c=>makeCard(c)),defeatedBosses:[...(carry?.defeatedBosses||[])]};
 const pending=typeof identityForRun==='function'?identityForRun():null;
 if(pending&&!result.deck.some(c=>c.n===pending.n)&&!result.reserve.some(c=>c.n===pending.n)){
  if(result.deck.length<DECK_MAX&&collectionHasCopyRoom(pending,result.deck,result.reserve))result.deck.push(makeCard(pending));else result.reserve.push(makeCard(pending));
 }
 return result;
}
async function startBossReplay(game,level){
 const stage=replayStage(game,level);if(!stage||!replayEntryAllowed()||!replayClearedKeys().has(replayKey(game,level)))return false;
 const portfolio=replayPortfolio();if(!portfolio.deck.length)return false;
 closeReplayMenu(false);
 const main={G,OV,difficulty,stages:STG.slice(),TUT,DM,HOLD_DETAIL,infoPanel,detailCardOverride};
 REPLAY_SESSION={main,game,level,boss:stage.boss,result:null};
 if(typeof closeBossAbilityPopover==='function')closeBossAbilityPopover(false);
 if(typeof closePlayerBossSkillPopover==='function')closePlayerBossSkillPopover(false);
 TUT=null;DM=null;HOLD_DETAIL=null;infoPanel=null;detailCardOverride=null;difficulty=game;STG.splice(0,STG.length,...CAMPAIGNS[game].map(st=>({...st,dk:[]})));
 G={replay:true,lv:level,hp:7,wins:0,kills:0,...portfolio,sel:null,sac:new Set(),busy:1,log:[],history:[],identityRecorded:true};
 await battle();return true;
}
function finishBossReplay(won){
 if(!isBossReplay()||!REPLAY_SESSION||REPLAY_SESSION.result)return false;
 REPLAY_SESSION.result={won:!!won,turns:G.turn,hp:G.hp,kills:G.kills};
 if(won&&typeof recordBossFarewell==='function')recordBossFarewell();
 else if(!won&&typeof recordPlayerDeathEcho==='function')recordPlayerDeathEcho();
 G.busy=0;G.sel=null;G.moveSel=null;G.sac.clear();G.freezeChoice=false;OV='replay-result';
 if(typeof closePlayerBossSkillPopover==='function')closePlayerBossSkillPopover(false);
 if(typeof closeBossAbilityPopover==='function')closeBossAbilityPopover(false);
 snd(won?'win':'die');render();return true;
}
function replayResultHTML(){
 if(!isBossReplay()||!REPLAY_SESSION?.result)return '';
 const result=REPLAY_SESSION.result,echo=result.won&&typeof bossFarewellHTML==='function'?bossFarewellHTML():!result.won&&typeof playerDeathEchoHTML==='function'?playerDeathEchoHTML():'';
 return `<div class="ov modal-screen replay-result"><span class="modal-kicker">A GUARDIAN REMEMBERED</span><h2>${result.won?'重战胜利':'重战结束'}</h2><p>${esc(replayWorldLabel(REPLAY_SESSION.game))} · 第${REPLAY_SESSION.level}关<br>${esc(REPLAY_SESSION.boss)} · ${result.turns}回合</p>${echo}<p>这是一次重战，不发奖励、不改变主线进度，也不新增死亡身份。</p><button type="button" class="pri" data-replay="return">返回之前的主线</button></div>`;
}
function returnBossReplay(){
 const session=REPLAY_SESSION;if(!session||!isBossReplay()||G.busy||drawRunning)return false;
 if(typeof cancelInitiativeCoin==='function')cancelInitiativeCoin();
 if(typeof closePlayerBossSkillPopover==='function')closePlayerBossSkillPopover(false);
 if(typeof closeBossAbilityPopover==='function')closeBossAbilityPopover(false);
 closeReplayMenu(false);REPLAY_SESSION=null;
 ({G,OV,difficulty,TUT,DM,HOLD_DETAIL,infoPanel,detailCardOverride}=session.main);STG.splice(0,STG.length,...session.main.stages);render();return true;
}
document.addEventListener('click',async event=>{
 const button=event.target.closest('[data-replay]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();if(button.disabled)return;
 const action=button.dataset.replay;
 if(action==='open'){openReplayMenu();return}if(action==='close'){closeReplayMenu();return}if(action==='return'){returnBossReplay();return}
 if(!REPLAY_MENU)return;
 if(action==='world'&&DIFFICULTY_ORDER.includes(button.dataset.replayWorld)){REPLAY_MENU.game=button.dataset.replayWorld;REPLAY_MENU.wrapper.innerHTML=replayMenuHTML();REPLAY_MENU.wrapper.querySelector(`[data-replay-world="${REPLAY_MENU.game}"]`)?.focus({preventScroll:true});return}
 if(action==='start')await startBossReplay(button.dataset.replayWorld,Number(button.dataset.replayLevel));
},true);
document.addEventListener('contextmenu',event=>{if(!REPLAY_MENU)return;event.preventDefault();event.stopImmediatePropagation();closeReplayMenu()},true);
document.addEventListener('keydown',event=>{
 if(!REPLAY_MENU)return;
 if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();closeReplayMenu();return}
 if(event.key!=='Tab')return;
 const nodes=[...REPLAY_MENU.wrapper.querySelectorAll('button:not(:disabled)')],first=nodes[0],last=nodes[nodes.length-1];
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}
},true);
// Save only completed player decisions, never an animation or a half-resolved combat.
// A small graph codec preserves cards shared by equipment, temporary effects and zones.
const CHECKPOINT_STORAGE='lo_run_checkpoint_v1',CHECKPOINT_VERSION=1,CHECKPOINT_MAX_BYTES=2500000;
const CHECKPOINT_IGNORED_FIELDS=new Set(['sel','moveSel','sac']);
let checkpointLastBody='',checkpointLastError='',checkpointEntry=null,checkpointRestoring=false,checkpointDrawWait=null;
function checkpointGraphEncode(root){
 const nodes=[],seen=new Map();let links=0;
 function encode(value){
  if(value===null||['string','boolean'].includes(typeof value))return value;
  if(typeof value==='number'){if(!Number.isFinite(value))throw Error('nonfinite');return value}
  if(typeof value==='undefined')return null;
  if(typeof value!=='object')throw Error('unsupported');
  if(seen.has(value))return {$:seen.get(value)};
  if(nodes.length>=12000||++links>300000)throw Error('too large');
  const index=nodes.length;seen.set(value,index);nodes.push(null);
  if(Array.isArray(value))nodes[index]={t:'a',v:value.map(encode)};
  else if(value instanceof Set)nodes[index]={t:'s',v:[...value].map(encode)};
  else{
   const proto=Object.getPrototypeOf(value);if(proto!==Object.prototype&&proto!==null)throw Error('not plain');
   const entries=[];for(const [key,item]of Object.entries(value)){
    if(value===root&&CHECKPOINT_IGNORED_FIELDS.has(key)||item===undefined)continue;
    if(['__proto__','prototype','constructor'].includes(key))throw Error('unsafe key');
    entries.push([key,encode(item)]);if(++links>300000)throw Error('too large');
   }
   nodes[index]={t:'o',v:entries};
  }
  return {$:index};
 }
 return {root:encode(root),nodes};
}
function checkpointGraphDecode(graph){
 if(!graph||!Array.isArray(graph.nodes)||!graph.nodes.length||graph.nodes.length>12000)throw Error('invalid graph');
 const values=graph.nodes.map(node=>{if(!node||!Array.isArray(node.v)||node.v.length>16000)throw Error('invalid node');if(node.t==='a')return [];if(node.t==='s')return new Set();if(node.t==='o')return {};throw Error('invalid type')});let links=0;
 function decode(value){
  if(value===null||['string','boolean'].includes(typeof value))return value;
  if(typeof value==='number'&&Number.isFinite(value))return value;
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).length!==1||!Number.isInteger(value.$)||value.$<0||value.$>=values.length)throw Error('invalid reference');
  return values[value.$];
 }
 graph.nodes.forEach((node,index)=>{const target=values[index];for(const item of node.v){if(++links>300000)throw Error('too large');if(node.t==='o'){
   if(!Array.isArray(item)||item.length!==2||typeof item[0]!=='string'||['__proto__','prototype','constructor'].includes(item[0]))throw Error('unsafe property');target[item[0]]=decode(item[1]);
  }else if(node.t==='s')target.add(decode(item));else target.push(decode(item));}});
 return decode(graph.root);
}
function checkpointRead(){try{const raw=localStorage.getItem(CHECKPOINT_STORAGE);return raw&&raw.length<=CHECKPOINT_MAX_BYTES?JSON.parse(raw):null}catch{return null}}
function checkpointHeaderValid(saved){return !!saved&&saved.version===CHECKPOINT_VERSION&&DIFFICULTY_ORDER.includes(saved.difficulty)&&Number.isInteger(saved.lv)&&saved.lv>=1&&saved.lv<=CAMPAIGNS[saved.difficulty].length&&Number.isSafeInteger(saved.deckRevision)&&saved.deckRevision>=0&&['state','next','restart'].includes(saved.mode)&&[null,'win','camp','clear','dead'].includes(saved.overlay)}
function checkpointHasSaved(){return checkpointHeaderValid(checkpointRead())}
function checkpointCanContinue(){const saved=checkpointRead();return checkpointHeaderValid(saved)&&!['dead','clear'].includes(saved.overlay)}
function checkpointIdentityMark(){return typeof IDENTITY==='object'?{cycle:IDENTITY.cycle,deaths:IDENTITY.deaths||0}:{cycle:0,deaths:0}}
function checkpointLatestRevision(){try{return typeof getLatestSavedDeck==='function'?getLatestSavedDeck()?.revision||0:0}catch{return 0}}
function checkpointBaseEntry(game=G,key=difficulty){
 if(checkpointEntry?.game===game&&checkpointEntry.lv===game.lv&&checkpointEntry.difficulty===key)return checkpointEntry;
 checkpointEntry={game,lv:game.lv,difficulty:key,hp:Math.max(1,Math.min(7,game.hp||7)),kills:Math.max(0,game.kills||0)};
 return checkpointEntry;
}
function checkpointSave(options={}){
 if(checkpointRestoring||!G||G.tutorial||G.replay||(typeof isBossReplay==='function'&&isBossReplay()))return false;
 // A pagehide between claiming a reward and entering the next battle must
 // retain the transition marker, rather than turn it into an empty reward page.
 const transition=!!G.rewardClaimed&&(!!options.transition||OV==='win'),terminal=['win','camp','clear','dead'].includes(OV);
 if(!G.busy&&typeof drawRunning!=='undefined'&&drawRunning&&typeof drawIdle!=='undefined'&&drawIdle?.then&&checkpointDrawWait!==drawIdle){const pending=drawIdle;checkpointDrawWait=pending;pending.then(()=>{if(checkpointDrawWait===pending)checkpointDrawWait=null;checkpointSave()}).catch(()=>{if(checkpointDrawWait===pending)checkpointDrawWait=null})}
 const portfolio=!!options.portfolio&&['camp','clear'].includes(OV);
 if(!transition&&(G.busy||typeof drawRunning!=='undefined'&&drawRunning||!portfolio&&(typeof DM!=='undefined'&&DM||typeof HOLD_DETAIL!=='undefined'&&HOLD_DETAIL||typeof infoPanel!=='undefined'&&infoPanel)))return false;
 if(!transition&&!terminal&&(OV!==null||G.phase!=='player-deploy'))return false;
 try{
  const entry=checkpointBaseEntry(),mode=transition&&G.deck.length<DECK_MAX&&G.lv<CAMPAIGNS[difficulty].length?'next':'state';
  const overlay=transition?(G.deck.length>=DECK_MAX?'camp':G.lv>=CAMPAIGNS[difficulty].length?'clear':null):OV;
  const body={version:CHECKPOINT_VERSION,difficulty,lv:G.lv,overlay,mode,name:typeof pname==='string'?pname:'',identity:checkpointIdentityMark(),journeyCleared:journey.cleared,deckRevision:options.revision??checkpointLatestRevision(),entry:{hp:entry.hp,kills:entry.kills},graph:checkpointGraphEncode(G)};
  const signature=JSON.stringify(body);if(signature===checkpointLastBody)return true;
  const raw=JSON.stringify({...body,savedAt:Date.now()});if(raw.length>CHECKPOINT_MAX_BYTES)throw Error('quota');
  localStorage.setItem(CHECKPOINT_STORAGE,raw);checkpointLastBody=signature;checkpointLastError='';return true;
 }catch{checkpointLastError='浏览器未能保存当前进度。';return false}
}
function checkpointKnownIdentity(card){
 if(!card?.identity)return false;
 const known=[typeof IDENTITY==='object'?IDENTITY.pending:null,typeof IDENTITY==='object'?IDENTITY.last:null].filter(Boolean);
 const archived=typeof collectionCard==='function'?collectionCard(card.n):null;if(archived?.identity&&archived.permanent)known.push(archived);
 return known.some(value=>value.identityId&&value.identityId===card.identityId&&value.n===card.n);
}
function checkpointCardValid(card,owned=false,historical=false){
 if(!card||typeof card!=='object'||typeof card.n!=='string'||card.n.length>180)return false;
 for(const field of ['a','h','c'])if(!Number.isFinite(card[field])||!Number.isInteger(card[field]))return false;
 if(card.a<0||card.a>999||card.h< -999||card.h>999||card.c<0||card.c>3)return false;
 if(card.bossWickOriginal&&!checkpointCardValid(card.bossWickOriginal,owned,historical))return false;
 if(card.identity&&!card.permanent)return checkpointKnownIdentity(card)||historical&&typeof card.identityId==='string'&&card.identityId.startsWith('identity-')&&card.a<=6&&card.h<=9;
 if(card.token||card.fod||['余芯','碎灯偶'].includes(card.n))return true;
 const source=typeof collectionCard==='function'?collectionCard(card.n):POOL.find(value=>value.n===card.n);
 return !!source&&(!owned||typeof isCollected==='function'&&isCollected(source));
}
function checkpointGameValid(game,saved){
 if(!game||game.tutorial||game.replay||game.lv!==saved.lv||!Number.isInteger(game.wins)||game.wins<0||game.wins>16||!Number.isInteger(game.turn)||game.turn<1||game.turn>36)return false;
 if(![game.hp,game.ehp].every(hp=>Number.isInteger(hp)&&hp>=0&&hp<=7))return false;
 if(!Array.isArray(game.deck)||game.deck.length<DECK_MIN||game.deck.length>DECK_MAX||!Array.isArray(game.reserve)||game.reserve.length>4096)return false;
 const historical=saved.overlay==='dead';
 if(![game.deck,game.reserve].every(cards=>cards.every(card=>checkpointCardValid(card,cards===game.deck,historical))))return false;
 for(const [key,owned]of [['p',true],['e',false],['hand',true],['eh',false],['draw',true],['ed',false]]){
  const cards=game[key];if(!Array.isArray(cards)||cards.length>4096||['p','e'].includes(key)&&cards.length!==5||!cards.every(card=>card===null&&['p','e'].includes(key)||checkpointCardValid(card,owned,historical)))return false;
 }
 if(!game.st||game.st.boss!==CAMPAIGNS[saved.difficulty][saved.lv-1].boss||!Array.isArray(game.st.dk)||!game.st.dk.every(name=>typeof name==='string'&&!!collectionCard(name)))return false;
 if(!['p','e'].includes(game.campaignFirst)||!['p','e'].includes(game.encounterFirst))return false;
 if(!game.discard||!['p','e'].every(side=>Array.isArray(game.discard[side])&&game.discard[side].length<=4096&&game.discard[side].every(card=>checkpointCardValid(card,side==='p',historical))))return false;
 if(!game.bossSkill||!Array.isArray(game.bossSkill.temp)||!Array.isArray(game.bossSkill.deferred))return false;
 if(saved.overlay==='win'&&(!Array.isArray(game.rw)||game.rw.length>3||game.rw.some(card=>!checkpointCardValid(card))))return false;
 if(saved.overlay==='dead'&&(!checkpointCardValid(game.dc)||game.identityChoice&&(!checkpointKnownIdentity(game.identityChoice.old)||!checkpointKnownIdentity(game.identityChoice.new))))return false;
 return true;
}
function checkpointLatestPortfolio(game,deck,reserve){
 const pending=typeof identityForRun==='function'?identityForRun():null,oldReserve=(game.reserve||[]).some(card=>pending&&card.identityId===pending.identityId);
 let active=deck.map(card=>makeCard(card)),extra=reserve.map(card=>makeCard(card));
 if(typeof collectionDedupeGoldPortfolio==='function'){const clean=collectionDedupeGoldPortfolio(active,extra);active=clean.deck;extra=clean.reserve}
 if(pending&&![...active,...extra].some(card=>card.identityId===pending.identityId)){
  const card=makeCard(pending);if(!oldReserve&&active.length<DECK_MAX)active.push(card);else extra.push(card);
 }
 game.deck=active;game.reserve=extra;
}
function checkpointUpdateSavedDeck(deck,reserve,revision){
 // An already claimed reward is persisted atomically with its portfolio.
 if(G&&!G.tutorial&&!G.replay&&OV==='win'&&G.rewardClaimed)return checkpointSave({transition:true,revision});
 if(G&&!G.tutorial&&!G.replay&&['camp','clear'].includes(OV))return checkpointSave({portfolio:true,revision});
 const saved=checkpointRead();if(!checkpointHeaderValid(saved))return false;
 try{
  const game=checkpointGraphDecode(saved.graph);checkpointLatestPortfolio(game,deck,reserve);saved.graph=checkpointGraphEncode(game);saved.deckRevision=revision;saved.savedAt=Date.now();
  if(saved.overlay===null&&saved.mode==='state')saved.mode='restart';
  const raw=JSON.stringify(saved);if(raw.length>CHECKPOINT_MAX_BYTES)return false;localStorage.setItem(CHECKPOINT_STORAGE,raw);checkpointLastBody='';return true;
 }catch{return false}
}
function checkpointRestore(){
 const saved=checkpointRead();if(!checkpointHeaderValid(saved))return false;
 try{
  if(saved.journeyCleared!==journey.cleared||JSON.stringify(saved.identity)!==JSON.stringify(checkpointIdentityMark()))throw Error('newer progress exists');
  const game=checkpointGraphDecode(saved.graph);if(!checkpointGameValid(game,saved))throw Error('invalid battle');
  const latest=typeof getLatestSavedDeck==='function'?getLatestSavedDeck():null;
  if(latest?.revision>saved.deckRevision){checkpointLatestPortfolio(game,latest.deck,latest.reserve);if(saved.overlay===null&&saved.mode==='state')saved.mode='restart'}
  checkpointRestoring=true;
  if(typeof cancelInitiativeCoin==='function')cancelInitiativeCoin();if(typeof closeBossAbilityPopover==='function')closeBossAbilityPopover(false);if(typeof closePlayerBossSkillPopover==='function')closePlayerBossSkillPopover(false);
  difficulty=saved.difficulty;STG.splice(0,STG.length,...CAMPAIGNS[difficulty].map(stage=>({...stage,dk:[]})));
  const deck=game.st.dk;game.st=STG[game.lv-1];game.st.dk=deck;game.busy=0;game.sel=null;game.moveSel=null;game.sac=new Set();G=game;OV=saved.overlay;
  if(typeof TUT!=='undefined')TUT=null;if(typeof DM!=='undefined')DM=null;if(typeof HOLD_DETAIL!=='undefined')HOLD_DETAIL=null;if(typeof infoPanel!=='undefined')infoPanel=null;if(typeof detailCardOverride!=='undefined')detailCardOverride=null;
  if(typeof pname!=='undefined'&&typeof saved.name==='string')pname=saved.name.slice(0,5);
  checkpointEntry={game:G,lv:G.lv,difficulty,hp:saved.entry?.hp||7,kills:saved.entry?.kills||0};checkpointLastBody='';checkpointLastError='';checkpointRestoring=false;
  if(saved.mode==='next'){G.busy=1;OV=null;nextStage()}
  else if(saved.mode==='restart'){G.hp=G.lv===1?7:Math.max(1,Math.min(7,saved.entry?.hp||7))-(RULES[difficulty]?.heal||0);G.kills=Math.max(0,saved.entry?.kills||0);G.busy=1;OV=null;battle()}
  else if(typeof playerBossSkillState==='function')playerBossSkillState();
  return true;
 }catch{checkpointRestoring=false;checkpointClear();return false}
}
function checkpointClear(){try{localStorage.removeItem(CHECKPOINT_STORAGE)}catch{}checkpointLastBody='';checkpointEntry=null;return true}
function checkpointHomepageHTML(){
 const saved=checkpointRead();if(!checkpointHeaderValid(saved)||!checkpointCanContinue())return '';
 const stage=CAMPAIGNS[saved.difficulty][saved.lv-1],label=saved.mode==='next'?'已保存通关奖励，继续下一关':saved.mode==='restart'?'已更新卡组，重新挑战未完成的Boss':saved.overlay==='win'?'继续领取已保存的奖励':`继续第${saved.lv}关 · ${stage.boss}`;
 return `<p class="home-save-note">上次进度已保存</p><button data-checkpoint="continue">${esc(label)}</button>`;
}
if(typeof document!=='undefined'){
 document.addEventListener('click',event=>{if(!event.target.closest('[data-checkpoint="continue"]'))return;event.preventDefault();if(checkpointRestore()&&typeof render==='function')render()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)checkpointSave()});
}
if(typeof window!=='undefined')window.addEventListener('pagehide',()=>checkpointSave());
const I18N_CARDS=__DATA_CARDS_EN__;
const I18N_STRINGS=__DATA_UI_EN__;
__NARRATIVE_SOURCE__
// Translation is a presentation layer: saved names, card instances and actions
// retain their original identifiers in both languages.
const LANGUAGE_STORAGE='lo_language_v1';
let gameLanguage='zh-CN';
try{const requested=new URLSearchParams(location.search).get('lang'),saved=localStorage.getItem(LANGUAGE_STORAGE);gameLanguage=requested==='en'||(!requested&&saved==='en')?'en':'zh-CN'}catch{}
const localeTextCache=new Map(),localeNodeSource=new WeakMap(),localeAttributeSource=new WeakMap();
const localeHan=/[\u3400-\u9fff]/;
const localeDictionary=Object.assign({},I18N_STRINGS);
for(const [name,entry]of Object.entries(I18N_CARDS)){
 localeDictionary[name]=entry.name;
 const original=POOL.find(c=>c.n===name)?.lore;if(original&&entry.lore)localeDictionary[original]=entry.lore;
}
Object.assign(localeDictionary,{
 '灯誓牌':'Lantern Oath','余芯':'Wick','鎏金':'Gilded','稀':'R','灯息万象':'Lamp Archive',
 '苔庭':'Mireglass','铜钟':'Brassbell','炽砂':'Cinderglass','暮潮港湾':'Dusk-Tide Harbor','霜枝高地':'Frostbough March','星铸天穹':'Starforged Expanse',
 '苔雾荒庭':'Mireglass Reach','铜钟堡垒':'Brassbell Citadel','炽砂熔城':'Cinderglass Foundry','砂镜地窟':"Sandmirror Vault",'暮潮港湾':'Dusk-Tide Harbor','星铸天穹':'Starforged Expanse','折光边境':'Prism-Rift Frontier',
 '物理':'Physical','火':'Fire','雷':'Lightning','光':'Light','暗':'Dark','血':'Blood','魔':'Magic','冰':'Ice','毒':'Poison',
 '练习灯偶':'Training Dummy','练习巡灯者':'Practice Mireglass Silverdew Bonebound','鎏金灯蛛':'Gilded Wick Spider','鎏金余芯':'Gilded Wick','碎灯偶':'Bones',
 '新入场':'Newly played','可献祭':'Ready to sacrifice','中文':'中文'
});
for(const world of Object.keys(LOOP_STORY.chapters)){localeDictionary[GAME_META[world][0]]=LOOP_STORY.chapters[world].name.en;localeDictionary[LOOP_STORY.chapters[world].name.zh]=LOOP_STORY.chapters[world].name.en}
for(const [source,label]of Object.entries(HORROR_UI_ALIASES)){localeDictionary[source]=label.en;localeDictionary[label.zh]=label.en}
const localeEscape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
// Full sentences use O(1) lookup. Only short fragments take part in matching.
const localeFragments=Object.keys(localeDictionary).filter(k=>k.length>1&&k.length<=110&&localeHan.test(k)&&!/[<>]|\$\{/.test(k)).sort((a,b)=>b.length-a.length);
const localeMatcher=new RegExp(localeFragments.map(localeEscape).join('|'),'g');
const localeTemplates=Object.entries(localeDictionary).filter(([key])=>key.includes('${')).map(([source,target])=>{
 const parameters=[],pieces=source.split(/(\$\{[^}]+\})/g);
 const pattern=pieces.map(piece=>{if(piece.startsWith('${')){parameters.push(piece);return '(.+?)'}return localeEscape(piece)}).join('');
 return {match:new RegExp('^'+pattern+'$'),parameters,target};
});
function englishCardName(card){return I18N_CARDS[typeof card==='string'?card:card?.n]?.name||shortCardName(card,'en')}
function displayedCardName(card){return gameLanguage==='en'?englishCardName(card):shortCardName(card)}
function i18nNameLimit(){return gameLanguage==='en'?20:5}
function i18nText(source){
 if(gameLanguage!=='en')return storyChineseText(source);if(!source||!localeHan.test(source))return source;
 if(localeTextCache.has(source))return localeTextCache.get(source);
 const leading=source.match(/^\s*/)[0],trailing=source.match(/\s*$/)[0],text=source.trim();
 let result=localeDictionary[text];
 if(result==null){
  for(const template of localeTemplates){const match=template.match.exec(text);if(match){result=template.target.replace(/\$\{[^}]+\}/g,key=>{const index=template.parameters.indexOf(key);return index<0?key:i18nText(match[index+1])});break}}
 }
 if(result==null&&text.includes('¦'))result=text.split('¦').map(i18nText).join('¦');
 if(result==null){
  const T=x=>i18nText(x),side=x=>x==='我方'?'You':'Enemy';
  const patterns=[
   [/^“([\s\S]+)”$/,(_,q)=>`“${T(q)}”`],
   [/^(.+)：“([\s\S]+)”$/,(_,n,q)=>`${T(n)}: “${T(q)}”`],
   [/^(.+)的死亡回响：“([\s\S]+)”$/,(_,n,q)=>`${T(n)}’s echo: “${T(q)}”`],
   [/^(\d+)费 · (.+) · (\d+)攻 \/ (\d+)血$/,(_,c,a,p,h)=>`${c} cost · ${T(a)} · ${p} ATK / ${h} HP`],
   [/^(.+)：克(.+)；被(.+)克制$/,(_,a,b,c)=>`${T(a)}: strong against ${T(b)}; weak against ${T(c)}`],
   [/^第(\d+)回合：(我方|敌方)第(\d+)格的(.+)被献祭（第(\d+)回合入场）$/,(_,r,s,l,n,b)=>`Round ${r}: ${side(s)} sacrificed ${T(n)} in lane ${l} (played in round ${b}).`],
   [/^—— 第(\d+)回合开始 · (我方|Boss)先部署、先攻 ——$/,(_,r,s)=>`— Round ${r} begins · ${s==='我方'?'You':'Boss'} deploy and attack first —`],
   [/^(你|敌方)在第(\d+)格召唤(.+)$/,(_,s,l,n)=>`${s==='你'?'You':'Enemy'} played ${T(n)} in lane ${l}.`],
   [/^(.+)攻击(.+)：(\d+)伤害$/,(_,a,b,n)=>`${T(a)} attacks ${T(b)} for ${n} damage.`],
   [/^(.+)攻击(.+)：被弹反$/,(_,a,b)=>`${T(a)} attacks ${T(b)}: parried.`],
   [/^(.+)直击(\d+)点生命$/,(_,n,d)=>`${T(n)} deals ${d} direct damage.`],
   [/^(.+)回复(\d+)点生命$/,(_,n,h)=>`${T(n)} restores ${h} life.`],
   [/^(.+)被献祭$/,(_,n)=>`${T(n)} was sacrificed.`],
   [/^(.+)退场$/,(_,n)=>`${T(n)} leaves play.`],
   [/^(.+)余芯$/,(_,n)=>`${T(n)}’s Wick`],
   [/^第\s*(\d+)\s*\/\s*(\d+)\s*回合$/,(_,n,max)=>`Round ${n} / ${max}`],
   [/^第\s*(\d+)\s*回合(.*)$/,(_,n,rest)=>`Round ${n}${T(rest)}`],
   [/^第(\d+)轮 · (.+) · 关间回复(\d+)点灯火$/,(_,r,g,h)=>`Cycle ${r} · ${T(g)} · Restore ${h} life between battles`],
   [/^继续第(\d+)关 · (.+)$/,(_,n,b)=>`Continue stage ${n} · ${T(b)}`],
   [/^冻结剩余\s*(\d+)\s*回合.*$/,(_,n)=>`Frozen for ${n} more rounds; cost drops by 1 on thawing (minimum 0).`],
   [/^永久收藏 (\d+) \/ (\d+) · (\d+) 项匹配$/,(_,n,total,m)=>`Collected ${n} / ${total} · ${m} matches`],
   [/^我的卡组 · (\d+)$/,(_,n)=>`My Deck · ${n}`],
   [/^我的起始卡组 · (\d+)\/36 张 · 推荐24张$/,(_,n)=>`Starting Deck · ${n}/36 cards · 24 recommended`],
   [/^(\d+)费$/,(_,n)=>`${n} cost`],
   [/^(\d+)攻\s*[／/]\s*(\d+)血$/,(_,a,h)=>`${a} Attack / ${h} Health`],
   [/^抽(\d+)$/,(_,n)=>`Draw ${n}`],[/^亡抽(\d+)$/,(_,n)=>`Death: draw ${n}`],
   [/^克(.+)；被(.+)克制$/,(_,a,b)=>`Strong against ${T(a)}; weak against ${T(b)}`],
  ];
  for(const [pattern,replace]of patterns)if(pattern.test(text)){result=text.replace(pattern,replace);break}
  if(result==null){
   result=text.replace(localeMatcher,key=>localeDictionary[key]);
   // Numbered labels and remaining single element names need boundaries.
   result=result.replace(/第\s*(\d+)\s*格/g,'lane $1').replace(/第\s*(\d+)\s*关/g,'stage $1').replace(/第\s*(\d+)\s*回合/g,'round $1')
    .replace(/(\d+)\s*张/g,'$1 cards').replace(/(\d+)\s*回合/g,'$1 rounds').replace(/(\d+)\s*费/g,'$1 cost').replace(/(\d+)\s*攻/g,'$1 ATK').replace(/(\d+)\s*血/g,'$1 HP')
    .replace(/[，。；：]/g,c=>({'，':', ','。':'. ','；':'; ','：':': '})[c]);
   if(localeDictionary[result])result=localeDictionary[result];
  }
 }
 result=leading+result+trailing;
 if(localeTextCache.size>8192)localeTextCache.clear();localeTextCache.set(source,result);return result;
}
function languageToggleHTML(){
 const english=gameLanguage!=='en',target=english?'en':'zh-CN',title=english?'Switch to English':'切换为中文';
 return `<button type="button" class="icon-toggle language-toggle" data-language="${target}" data-i18n-control lang="${english?'en':'zh-CN'}" title="${title}" aria-label="${title}"><span class="language-full">${english?'English':'中文'}</span><span class="language-compact" aria-hidden="true">${english?'EN':'中'}</span></button>`;
}
function englishCardSearchTerms(card){
 const sigils={fly:'fly flying flight airborne',guard:'guard guardian block flying',thorn:'thorn thorns reflect',bones:'bones bone skeleton',parry:'parry deflect',vamp:'vampire vamp lifesteal blood',regen:'regen regenerate regeneration',poison:'poison toxic',abyss:'freeze frozen cost discount'};
 const elements={'物理':'physical','火':'fire flame','雷':'lightning thunder','光':'light holy','暗':'dark shadow','血':'blood','魔':'magic arcane','冰':'ice frost','毒':'poison toxic'};
 const moves={shift:'shift move left right',swap:'swap move exchange left right',push:'push knockback move'};
 const extras={soul:'soul kill growth',ember:'ember kindle heal healing',rekindle:'rekindle rebirth return hand'};
 return [englishCardName(card),card.kind,sigils[card.s],elements[card.at],moves[card.mv],extras[card.x],card.heal&&'heal healing restore',card.dr&&'draw cards',card.dd&&'death draw',card.death&&'deathrattle death '+card.death,card.growth&&'growth kill',card.zeroAttackPunish&&'ambush conditional attack',card.rarity==='rare'?'rare gilded gold golden':'common',LOOP_STORY.chapters[card.game]?.name.en,`${card.c||0} cost ${card.c||0}费`].filter(Boolean).join(' ');
}
function languageSwitchHTML(){return `<nav class="language-switch" aria-label="Language" data-i18n-control><button type="button" data-language="zh-CN" lang="zh-CN" aria-pressed="${gameLanguage==='zh-CN'}">中文</button><button type="button" data-language="en" lang="en" aria-pressed="${gameLanguage==='en'}">English</button></nav>`}
function localizeTextNode(node){
 if(gameLanguage==='en'&&node.parentElement?.matches('.card .at')){const mark={物:'P',火:'F',雷:'L',光:'H',暗:'D',血:'B',魔:'M',冰:'I',毒:'T'}[node.nodeValue];if(mark)node.nodeValue=mark;return;}
 if(!node.parentElement||node.parentElement.closest('[data-i18n-control],script,style,textarea,.player-name'))return;
 if(gameLanguage==='en'&&node.parentElement.hasAttribute('data-realm-short')){const short={mire:'Fog',brass:'Bell',cinder:'Ash',tide:'Harbor',frost:'Snow',astral:'White'}[node.parentElement.dataset.realmShort];if(short&&node.nodeValue!==short)node.nodeValue=short;return;}
 const previous=localeNodeSource.get(node),current=node.nodeValue;
 const source=previous&&current===previous.translated?previous.source:current;
 const translated=i18nText(source);
 localeNodeSource.set(node,{source,translated});if(current!==translated)node.nodeValue=translated;
}
function localizeElement(node){
 if(node.closest('[data-i18n-control],script,style,textarea'))return;
 if(gameLanguage==='en'&&['P','DD'].includes(node.tagName)&&node.children.length){
  const exact=localeDictionary[node.innerHTML];
  if(exact&&/<[a-z]/i.test(exact))node.innerHTML=exact;
 }
 let attributes=localeAttributeSource.get(node);if(!attributes){attributes={};localeAttributeSource.set(node,attributes)}
 for(const key of ['title','aria-label','placeholder','alt','data-tip']){
  if(!node.hasAttribute(key))continue;
  const current=node.getAttribute(key),previous=attributes[key],source=previous&&previous.translated===current?previous.source:current;
  const translated=i18nText(source);attributes[key]={source,translated};if(current!==translated)node.setAttribute(key,translated);
 }
}
function localizeRoot(root){
 if(!root||!root.isConnected)return;
 if(root.nodeType===3){localizeTextNode(root);return}
 if(root.nodeType!==1)return;localizeElement(root);
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode())){if(node.nodeType===3)localizeTextNode(node);else localizeElement(node)}
}
let localeLayoutFrame=0;
function scheduleLocaleLayout(){
 if(localeLayoutFrame)return;localeLayoutFrame=requestAnimationFrame(()=>{localeLayoutFrame=0;if(G?.tutorial&&TUT)positionTutorial();if(typeof positionBossAbilityPopover==='function')positionBossAbilityPopover();if(typeof positionPlayerBossSkillPopover==='function')positionPlayerBossSkillPopover()});
}
function setGameLanguage(language){
 if(!['en','zh-CN'].includes(language)||language===gameLanguage)return;
 const input=document.getElementById('nm'),draft=input?.value;gameLanguage=language;
 try{localStorage.setItem(LANGUAGE_STORAGE,language)}catch{}
 try{const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url)}catch{}
 localeTextCache.clear();document.documentElement.lang=language;document.title=language==='en'?'Lantern Oath · Will Wang':'灯誓牌';
 render();if(draft!=null&&document.getElementById('nm'))document.getElementById('nm').value=draft;
 localizeRoot(document.body);scheduleLocaleLayout();
}
const renderBeforeLocalization=render;
render=function(){renderBeforeLocalization();localizeRoot(document.getElementById('app'));scheduleLocaleLayout()};
const selectionBeforeLocalization=renderSelection;
renderSelection=function(){selectionBeforeLocalization();for(const selector of ['.interaction-bar','.sidebar-inspection','.tutorial-layer'])localizeRoot(document.querySelector(selector));scheduleLocaleLayout()};
const searchBeforeLocalization=cardSearchText;
cardSearchText=function(card){const english=I18N_CARDS[card.n];return searchBeforeLocalization(card)+' '+englishCardSearchTerms(card)+(english?' '+english.name+' '+english.lore:'')};
document.addEventListener('click',event=>{const button=event.target.closest('[data-language]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();setGameLanguage(button.dataset.language)},true);
const localeObserver=new MutationObserver(records=>{
 const roots=new Set();for(const record of records){if(record.type==='childList')for(const node of record.addedNodes)roots.add(node);else roots.add(record.target)}
 for(const root of roots)localizeRoot(root);
});
localeObserver.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder','alt','data-tip']});
document.documentElement.lang=gameLanguage;document.title=gameLanguage==='en'?'Lantern Oath · Will Wang':'灯誓牌';

__SOUND_SOURCE__
initializeCollection();initializeIdentity();
checkpointRestore();
render();
window.BOOT={ready:true,progress:100,disabled:true};
