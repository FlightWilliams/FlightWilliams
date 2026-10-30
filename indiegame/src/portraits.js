// Faces use authored traits; fallback traits are deterministic and never use battle randomness.
function portraitFaceTraits(profile,id){
 let hash=(profile.seed||7)>>>0;for(const ch of String(id))hash=Math.imul(hash^ch.charCodeAt(0),16777619)>>>0;
 const pick=(values,shift)=>values[(hash>>>shift)%values.length];
 return {shape:pick(['oval','square','round','long','heart','broad'],0),age:pick(['young','adult','mature','elder'],4),expression:pick(['calm','smile','stern','worried','weary','confident','surprised','skeptical'],8),hair:pick(['cropped','swept','curly','wavy','bob','braided','receding','bald','long','tied','sidepart'],11),brows:pick(['straight','arched','heavy','asymmetric'],15),eyes:pick(['almond','narrow','round','downturned'],17),nose:pick(['straight','broad','button','hooked'],19),facialHair:profile.gender==='female'?'none':pick(['none','stubble','moustache','short-beard','full-beard'],21),mark:pick(['none','freckles','dimple','cheek-line','beauty-mark'],24),glasses:'none',...(profile.face||{})};
}
function portraitFaceFeatures(t,p){
 const {path,line,circle,ink,paper,light,shade,mid}=p;
 const wide=t.shape==='broad'||t.shape==='round',left=wide?32:34,right=wide?48:47;
 let out='',browY=t.expression==='surprised'?23:25;
 const eye=(x,side)=>{
  if(t.eyes==='narrow'||t.expression==='weary')return line(`M${x-2.5} 29l2.5-1 2.5 1m-4 1.2h3`,ink,.9)+circle(x+.2,29,.65,ink);
  if(t.eyes==='round')return `<ellipse cx="${x}" cy="29" rx="2.15" ry="1.8" fill="${light}" stroke="${ink}" stroke-width=".8"/>`+circle(x+.2,29,.85,ink);
  if(t.eyes==='downturned')return path(`m${x-2.5} 29 2.5-1 2.7 2-2.7 .4Z`,light,ink,.75)+circle(x+.1,29.4,.7,ink);
  return path(`m${x-2.4} 29 2.4-1.3 2.5 1.3-2.5 1.2Z`,light,ink,.75)+circle(x+(side?-.2:.2),29,.8,ink);
 };
 out+=eye(left,0)+eye(right,1);
 let brows;const a=left-3,b=right-3;
 if(t.expression==='worried')brows=`M${a} 26l5-3M${b} 23l5 3`;
 else if(t.expression==='stern')brows=`M${a} 24l6 2M${b} 26l6-2`;
 else if(t.expression==='skeptical')brows=`M${a} 26l6-1M${b} 22l6 1`;
 else if(t.brows==='arched')brows=`M${a} ${browY+1}q3-3 6 0M${b} ${browY+1}q3-3 6 0`;
 else if(t.brows==='asymmetric')brows=`M${a} ${browY}l6-1M${b} ${browY-1}l6 2`;
 else brows=`M${a} ${browY}h6M${b} ${browY}h6`;
 out+=line(brows,ink,t.brows==='heavy'?1.7:1.05);
 const noses={straight:'M40 30 38 38l4 2',broad:'M39 30 36 38l3 2 6-1m-8-1h2m3 0h2',button:'M40 34l-2 4q3 3 6-1',hooked:'M41 29l-1 6 3 3-3 3-3-1'};
 out+=line(noses[t.nose]||noses.straight,ink,.9);
 const mouths={calm:'M35 44h10',smile:'M34 42q6 7 13 0m-10 6h6',stern:'M34 45l5-2 7 2m-10 3h8',worried:'M34 46q6-7 13 0',weary:'M34 45h11m-12-1-1 2m14-2 1 2',confident:'M34 44q7 5 14-3',skeptical:'M35 45l5-2 6 1'};
 out+=t.expression==='surprised'?`<ellipse cx="41" cy="44" rx="2" ry="2.3" fill="${mid}" stroke="${ink}" stroke-width=".8"/>`:line(mouths[t.expression]||mouths.calm,ink,1);
 if(t.age==='mature'||t.age==='elder')out+=line(`M${left-4} 32l-2 2M${right+4} 32l2 2M34 21h9`,ink,.6);
 if(t.age==='elder')out+=line(`M33 18l11-1m-14 19 2 6m17-6-2 7m-15-8 4 1m10-1 4-1m-15 15h8`,ink,.65);
 if(t.mark==='freckles')for(const [x,y]of [[30,35],[33,36],[29,37],[49,35],[52,36],[50,38]])out+=circle(x,y,.55,ink);
 if(t.mark==='dimple')out+=line('M31 42l1 3m17-4-1 3',ink,.7);
 if(t.mark==='cheek-line')out+=line('M29 36l4 3m18-3-3 3',ink,.7);
 if(t.mark==='beauty-mark')out+=circle(48,40,.85,ink);
 return out;
}
function portraitPersonFace(t,p){
 const {path,line,circle,ink,paper,light,shade,mid}=p,gray=t.age==='elder'?paper:shade;
 const heads={oval:'M27 25 29 17 39 12 50 16 54 26 52 39 46 48 39 50 31 44 27 35Z',square:'M25 25 28 16 40 12 52 17 55 28 53 43 47 49 33 49 26 41Z',round:'M25 25Q25 13 39 12 55 13 56 27 56 43 42 49 26 47 25 25Z',long:'M30 24 32 14 42 11 51 18 53 29 49 44 43 53 34 48 29 36Z',heart:'M26 25 29 16 39 12 51 15 55 26 51 39 41 51 30 40Z',broad:'M23 26 27 17 39 13 53 17 57 29 54 43 47 49 32 48 25 39Z'};
 let back='',front='',detail='';
 if(['long','braided','bob','wavy'].includes(t.hair))back=path(t.hair==='bob'?'M24 24l5-13 14-5 12 10 3 34-11 3H25Z':'M23 24 28 12 40 5 54 13 58 31l-2 27-9-5-8-17-9 20-9 4Z',gray);
 if(t.hair==='tied')back=circle(56,19,6,gray)+path('m54 24 9 12-6 19-3-20Z',gray);
 const hair={cropped:'M26 25 27 17 35 10 46 11 54 18 54 24l-8-4-7 1-7-2Z',swept:'M25 27 26 16 35 8 48 10 56 18l-2 10-5-10-13 11 3-10-8 5Z',curly:'M25 27q-6-6 0-11-1-8 8-7 4-7 11-2 9-3 10 6 7 3 2 13l-6-4-5-6-5 5-6-3-5 8Z',wavy:'M24 27q-4-9 5-15 8-10 19-4 13 5 9 20l-6-6-3-7-9 6-6-2-6 10Z',bob:'M25 25 27 15 34 8 48 9 54 17 55 25l-9-3-18 3Z',braided:'M25 26 27 16 36 8 47 10 55 19l-2 8-7-9-8-3-8 10Z',long:'M25 28 26 17 35 8 47 9 55 20v10l-6-11-9-4-9 11Z',tied:'M26 26 27 17 35 9 47 10 54 19 54 25l-8-7-8-3-7 9Z',sidepart:'M26 26 27 17 35 10 47 11 54 18 55 26l-8-8-10 3-5-2Z'};
 if(t.hair==='bald')front=line('M32 18q8-5 15 0',shade,.7)+path('m26 25 2-8 2 12m23-4-3-7 2 12',gray);
 else if(t.hair==='receding')front=path('M27 29 26 22l4-7 3 1-2 14Zm24 0-3-13 3-1 4 8v7Z',gray)+line('M35 16l8-1',shade,.7);
 else front=path(hair[t.hair]||hair.cropped,gray);
 if(t.hair==='cropped')detail+=line('m30 17 3-3m2 2 3-3m5 2 3-1m3 4 2 2',ink,.65);
 if(['swept','sidepart','tied'].includes(t.hair))detail+=line('m34 16 7-5m-4 8 10-5m2 2 3 4',ink,.65);
 if(t.hair==='curly')detail+=line('M28 18q-1-4 3-4m4-1q2-4 5 0m4-1q4-1 5 3m1 3 2 3',ink,.7);
 if(t.hair==='wavy')detail+=line('M27 21q2-6 6-6m6-3q5-2 8 3m3 1 3 7',ink,.7);
 if(['long','bob','braided'].includes(t.hair))detail+=line('M26 29l1 15m27-15-1 16',ink,.75);
 if(t.hair==='braided')detail+=path('m25 37 5 1 1 20-3 5-4-7Zm29 0-5 1-1 20 3 5 4-7Z',gray)+line('m25 41 5 3m-5 3 5 3m-5 3 5 3m24-14-5 3m5 3-5 3m5 3-5 3',ink,.7);
 let out=back+path(heads[t.shape]||heads.oval,paper)+path('m46 17 7 9-2 14-8 9-1-5 6-9Z',mid,'',0)+path('m27 27-3-2v6l4 5m26-9 3-2v6l-4 5',paper,ink,.8)+front+detail+portraitFaceFeatures(t,p);
 const beard=t.age==='elder'?paper:shade;
 if(t.facialHair==='stubble')out+=line('m31 43 1 2m2 2 1 2m3 0 1 2m4-1 1 2m4-4 1 2m2-5 1 2',ink,.7);
 if(t.facialHair==='moustache')out+=path('M33 40q4-4 8 0 4-4 8 0l-4 3-4-2-4 2Z',beard);
 if(t.facialHair==='short-beard'||t.facialHair==='full-beard')out+=path(t.facialHair==='full-beard'?'m29 38 5 4 7 2 7-3 5-5-1 12-6 9-6 3-8-7Z':'m29 39 6 5 6 1 9-5 2-4-1 10-8 8-9-4Z',beard)+line(t.facialHair==='full-beard'?'m33 45 4 7m4-5v9m6-11-3 8':'m34 46 3 3m6-2-1 4m6-7-2 4',ink,.7);
 if(t.glasses==='round')out+=`<g fill="none" stroke="${ink}" stroke-width=".9"><ellipse cx="34" cy="29" rx="4.5" ry="3.5"/><ellipse cx="47" cy="29" rx="4.5" ry="3.5"/><path d="M38.5 29h4m-13 0-4-1m26 1 3-1"/></g>`;
 if(t.glasses==='square')out+=`<g fill="none" stroke="${ink}" stroke-width=".9"><path d="m29 26 9-1 1 7-9 1Zm14-1 10 1-1 7-9-1Zm-4 3h4m-14 1-3-1m27 1 2-1"/></g>`;
 return `<g data-portrait-feature="face" data-face-shape="${t.shape}" data-face-expression="${t.expression}" data-face-age="${t.age}" data-face-hair="${t.hair}">${out}</g>`;
}
// Original parchment-and-ink illustrations with the angular linework of game cards.
// The art is deterministic and has no filters, animation or gameplay random calls.
const CARD_PORTRAIT_CACHE=new Map();
const portraitEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cardPortraitHTML(c){
 const id=c.baseName||c.n,profile=CARD_ART_PROFILES[id]||{family:c.tokenKind==='spider'?'spider':c.tokenKind==='flame'||c.fod||c.n==='余芯'?'flame':'human',seed:7,...(/^(骸骨车轮|旧木车轮)$/.test(id)?{portraitKind:'object',objectType:'wheel'}:/^(碎灯偶|骸骨仆从|提灯助手|墓地伏影|港口伏影)$/.test(id)?{portraitKind:'person',occupation:'watch'}:{})};
 const label=typeof shortCardName==='function'?shortCardName(c):c.n,seed=(profile.seed||7)>>>0,f=profile.family||'human',role=profile.role||'',variant=profile.portraitVariant||'';
 const animalFamilies=['bull','goat','wolf','dog','cat','bear','boar','rat','monkey','horse','deer','hippo','elephant','hedgehog','lion','lizard','dragon','bird','bat','butterfly','insect','spider','scorpion','octopus','crab','snake','worm','slug','fish','turtle','frog'];
 const humanFamilies=['human','knight','mage','rogue','healer','giant'];
 const kind=profile.portraitKind||profile.subject||(role?'person':animalFamilies.includes(f)?'animal':humanFamilies.includes(f)?'person':'object');
 const occupation=profile.occupation||({nightwatch:'watch',firewarden:'worker',lighthouse:'sailor',courier:'courier',roadworker:'worker',stationkeeper:'clerk'}[role])||({knight:'watch',giant:'worker',mage:'teacher',rogue:'courier',healer:'medic'}[f])||'clerk';
 const objectType=profile.objectType||({undead:'book',demon:'toolbox',alien:'radio',spirit:'lantern',flame:'lantern',hand:'gloves',mimic:'satchel',jar:'jar',blob:'medicine'}[f])||'book';
 const face=portraitFaceTraits(profile,id),faceKey=kind==='person'?JSON.stringify(face):'';
 const key=[id,kind,role,occupation,objectType,variant,faceKey,label].join('|');if(CARD_PORTRAIT_CACHE.has(key))return CARD_PORTRAIT_CACHE.get(key);
 const ink='var(--portrait-ink,#493a25)',outline=ink,paper='var(--portrait-paper,#dbcaa1)',light='var(--portrait-light,#f4e0aa)',gold=light,mid='var(--portrait-mid,#b9a478)',shade='var(--portrait-shade,#9b865c)',accent='var(--portrait-accent,#9b603a)';
 const coat=seed%2?shade:mid,skin=paper,hair=seed%3?shade:mid;
 const path=(d,fill=paper,stroke=ink,width=1.1)=>`<path d="${d}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${width}"`:''}/>`;
 const line=(d,color=ink,width=1.05)=>path(d,'none',color,width);
 const ellipse=(x,y,rx,ry,fill=coat)=>path(`M${x-rx} ${y} ${x-rx*.7} ${y-ry*.7} ${x} ${y-ry} ${x+rx*.7} ${y-ry*.7} ${x+rx} ${y} ${x+rx*.7} ${y+ry*.7} ${x} ${y+ry} ${x-rx*.7} ${y+ry*.7}Z`,fill);
 const circle=(x,y,r,fill=ink)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
 const rect=(x,y,w,h,fill,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(r,1)}" fill="${fill}" stroke="${ink}" stroke-width="1.05"/>`;
 const hatch=(d,opacity=.55)=>`<g opacity="${opacity}">${line(d,ink,.65)}</g>`;
 const eye=(x,y)=>path(`m${x-2.1} ${y} 2.1-1.1 2.2 1.1-2.2 1Z`,light,ink,.7)+circle(x+.3,y,.8,ink);
 const lamp=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${line('M-6-10v-4a6 6 0 0 1 12 0v4',ink,2)}${rect(-10,-10,20,26,'#8a7654',3)}${rect(-6,-6,12,17,'#efd895',1)}${path('M-3 8Q-6 2 0-3 6 3 3 8Z','#d29345')}${line('M-10-10h20M-11 16h22',ink,2)}</g>`;
 const envelope=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${rect(-14,-9,28,19,light,1)}${line('M-14-9 0 2 14-9m-28 19 9-8m19 8-9-8','#ac9672',1.2)}</g>`;
 const book=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${path('M-20-12Q-9-16 0-11 9-16 20-12v29Q9 13 0 18-9 13-20 17Z',light,outline)}${line('M0-11v29m-16-23h10m-10 5h10m-10 5h10m12-10h10m-10 5h10m-10 5h10','#b5a382',1)}</g>`;
 let backdrop=path('M5 74V15L16 5h49l10 11v58Z',paper,'',0),subject='';
 // Named subjects have explicit silhouettes instead of reusing a nearby object.
 if(variant==='treefolk'){
  backdrop+=path('M8 59 19 51l16 5 19-7 18 10v15H8Z',mid,'',0)+line('M9 68h14m5 4h17m8-4h17',shade,.8);
  // Branch shoulders, a bark face and root feet make the standing tree person legible.
  subject=path('M27 40 21 39 17 29l-8-5 1-5 10 4 6 10 6 2m21 5 7-4 1-15 8-7 3 3-5 8 1 16-11 8',shade)+path('M31 35 28 47l3 13-6 9-10 4 12 1 10-7 6 7 15-1-10-6-1-10 6-13-5-10Z',mid)+path('M29 34 27 22l5-12 7 6 8-5 7 14-3 15-12 7Z',paper);
  subject+=path('m30 22 4-10 4 5 7-4 7 12-3 12-7 7-1-9 4-8Z',mid,'',0)+line('M34 45l3 9-3 8m10-15-3 10 3 8',ink,.9)+`<g data-portrait-feature="face" data-face-expression="${face.expression}" transform="translate(6 3) scale(.85)">${portraitFaceFeatures(face,{path,line,circle,ink,paper,light,shade,mid})}</g>`;
  subject+=line('M30 17 20 12l-4-7m5 8-10-2m42 11 7-12 8-3m-9 5 5 2m-42 24-9 4m48-4 8 6',ink,1.7)+path('m17 18-7-3 3-7 7 4Zm45-2 4-9 7 4-4 8Z',shade)+hatch('m31 48 4 2m-4 4 3 2m12-14 3 3m-17-25 2 3m-2 12 3 2m10 20 3 2m-19 13 5-3m13 2 5 2');
 }else if(variant==='mushroomfolk'){
  backdrop+=path('m8 67 18-5 24 2 23-5v15H8Z',mid,'',0)+line('M12 71h14m29-3h12',shade,.8);
  // One broad cap over a face, plus two arms and legs: this is a mushroom person.
  subject=path('m29 42-7 2-8 12 4 6 5-4 6-9m22-7 8 4 9 11-4 5-7-5-5-8',mid)+path('M29 35h22l3 23-7 8 2 8H39l-2-12-4 12H23l5-13-2-12Z',paper)+path('m42 37 9-1 3 21-7 9 2 8h-8l-3-12 7-8Z',mid,'',0);
  subject+=path('M11 32 15 21l11-10 14-5 15 5 11 11 5 12-17 6H26Z',shade)+path('m15 28 12-14 13-4 14 5 12 13-15 5H28Z',mid)+path('M12 32h58l-16 9H27Z',paper)+line('m19 34 10 4m-3-4 9 5m0-5 4 5m7-5-3 5m13-5-7 5m15-5-10 4',ink,.65);
  subject+=path('m26 18 6-2 3 4-5 3-5-1Zm19-4 5 1 2 4-6 2-3-3Zm12 9 4 2-2 4-5-1Z',paper)+`<g data-portrait-feature="face" data-face-expression="${face.expression}" transform="translate(4 20) scale(.9)">${portraitFaceFeatures(face,{path,line,circle,ink,paper,light,shade,mid})}</g>`+hatch('m28 44 2 5m-1 5 2 3m17-12 2 6m-21 11 3-3m11 7 3 2m-29-13 3 2m39-3 3 2');
 }else if(variant==='door'){
  backdrop+=path('M9 69V17l10-8h42l10 8v52Z',mid,'',0)+line('M11 25h7m-7 11h7m-7 12h7m46-23h6m-6 11h6m-6 12h6',shade,.8);
  // Door jamb, a partly open solid panel and a narrow dark gap, with an ordinary knob.
  subject=path('M19 12h44v59H19Z',shade)+path('M24 17h34v49H24Z',ink)+path('m24 17 29 3v48l-29-2Z',mid)+path('m29 23 18 2v15H29Zm0 23h18v16l-18-1Z',paper)+line('M28 21v41m22-39v41M22 14h37m-37 55h38',ink,.8)+circle(47,44,2.2,light)+path('M14 69h53l4 5H10Z',shade)+hatch('m32 27 11 1m-11 4 11 1m-11 4h11m-11 13h11m-11 4h11m-11 4 11 1m-25-38 3 3m-3 13 3 3m-3 13 3 3');
 }else if(variant==='sheep'){
  backdrop+=path('M8 62 26 52l19 5 18-9 10 12v14H8Z',mid,'',0)+line('M11 71h14m26 0h17',shade,.8);
  subject=path('m22 51-2 20h7l4-17m12-1 1 18h7l1-21m-18 2 2 18h6l-1-18m13-3 5 21h6l-5-23',shade)+path('M10 44 13 35l6-2 3-7 8 1 6-4 8 4 7-1 8 7 2 11-5 10-7 3-8-1-7 3-8-3-9 1-7-6Z',paper);
  // Angular fleece tufts and long hanging ears distinguish this sheep from cattle.
  subject+=path('m51 29 5-10 8-1 7 9-1 15-6 12-9-3-5-10Z',mid)+path('m51 28-9 1 2 11 6 3 5-7m11-8 8 1-1 10-5 3-4-6',shade)+path('m54 22 4-6 7 1 5 6-4 5-8-1Z',paper)+path('m57 40 9 1 1 10-5 5-7-6Z',shade)+eye(59,34)+line('m58 48 6 1m-2 2-1 3M20 65h6m19 0h6m8 1h6',ink,.9)+hatch('m18 36 5-4 5 3m0 5 6-5 6 4m-22 5 5-3 4 3m8 3 5-5 7 3m-18 7 5-4 5 2m-8-23 5 3m9-2 5 4m-23 35h6m10 0h6');
 }else if(kind==='person'){
  backdrop+=path('M8 66V20l15-9h39l10 9v46Z',mid,'',0)+path('M10 64V21l18-8h15L22 35v29Z',paper,'',0)+line('M14 56V25l12-7m37 39V21l-9-5',shade,.8)+hatch('M12 39l7-3m-7 8 7-3m-7 8 7-3m45-16 5 4m-5 1 5 4m-5 1 5 4');
  const broad=role==='roadworker'||f==='giant'?4:0;
  const coatColor=role==='courier'?mid:role==='firewarden'||role==='roadworker'?accent:shade;
  // Adult proportions: smaller eyes, a defined jaw, longer neck and broad shoulders.
  subject+=path(`M${9-broad} 78 14 62 28 54 35 51h10l10 4 12 8 ${4+broad} 15Z`,coatColor)+path('m28 55 8-4h8l10 5-4 22H30Z',mid);
  subject+=path('m35 40-1 13 6 8 7-8-2-15Z',paper)+path('m40 45 5-5 2 13-6 6Z',mid,'',0);
  subject+=portraitPersonFace(variant==='blindfolded'?{...face,glasses:'none'}:face,{path,line,circle,ink,paper,light,shade,mid});
  // Lapels and pen hatching replace the former soft, smiling storybook silhouettes.
  subject+=path('m33 52 7 9-9 7-7-12Zm14 0-7 9 9 7 7-12Z',paper)+line('M40 61v17m-20-12-5 12m45-12 5 12',ink,1.15)+hatch('m14 67 8-6m-9 10 8-6m-9 10 8-6m36-6 8 7m-8-3 8 7m-34-1 6 3m17-3 6-3');
  if(occupation==='watch'||role==='nightwatch')subject+=path('M24 23v-5l9-8 15 1 9 9v3Z',shade)+path('m23 23 17-3 18 4-3 4-15-2-15 1Z',mid)+path('m38 13 5 1-1 5h-4Z',light)+path('m24 58 7-1-1 8-4 2-4-4Z',light);
  if(role==='roadworker'||occupation==='worker'&&role!=='firewarden'){
   if(variant!=='single-horn')subject+=path('M24 23 28 14l11-5 12 6 6 9Z',mid)+line('M23 25h35m-18-15v12',ink,1.6);
   subject+=path('m23 58 3-1 5 21h-5Zm31 0 3 2-5 18h-5Z',paper)+rect(31,69,16,9,shade);
  }
  if(occupation==='medic')subject+=path('m27 21 1-10 24 1 3 10Z',paper)+rect(39,13,2,6,accent)+rect(37,15,6,2,accent)+path('m16 67 12-2 2 12H16Z',paper)+line('M23 68v7m-3-3h6',accent,1.4);
  if(role==='courier'||occupation==='courier')subject+=path('m19 54 4-2 34 26h-7Z',shade)+path('m47 62 20-2 3 17H47Z',shade)+envelope(57,68,.48)+line('m51 74h12',ink,.8);
  if(role==='firewarden')subject+=path('m17 59 9-3 5 22H20Zm37-3 9 5-3 17H49Z',accent)+line('m21 67 8-2m23 0 8 3',light,2.2)+lamp(61,63,.47);
  else if(role==='lighthouse')subject+=path('m24 55 16 12 16-12-7-1-9 7-9-7Z',paper)+lamp(61,62,.51);
  else if(role==='nightwatch')subject+=circle(21,66,3.7,light)+line('M21 70v8m0-4h4',ink,1.7);
  else if(role==='stationkeeper')subject+=path('m48 59 19 1-1 18H46Z',shade)+path('m50 61 14 1-1 13H49Z',paper)+line('M52 65h9m-9 3h7m-7 3h9',ink,.7);
  else if(role==='roadworker')subject+=book(19,71,.49);
  else if(occupation==='sailor')subject+=path('m24 55 16 12 16-12-7 1-9 7-9-7Z',paper)+circle(59,68,6,paper)+circle(59,68,3,shade);
  else if(occupation==='teacher')subject+=book(58,69,.53);
  if(variant==='single-horn')subject+=`<g data-portrait-feature="single-horn">${path('M38 19q-4-8 6-14l-1 8 4 6-5 3Z',light)}${line('m40 16 3-7m-2 10 3-2',ink,.7)}</g>`;
  if(variant==='blindfolded')subject+=`<g data-portrait-feature="cloth-blindfold">${path('m27 26 12 1 15-2 1 9-13 2-15-2Z',light)}${line('m29 29 11 1 12-2m-22 4 10 1 11-2',shade,.75)}${path('m26 28-5-1-3 5 6 3 3-3m-5 2-4 12 6-3 3-9Z',paper)}${line('m23 29 1 3m-2 4-1 6',ink,.75)}</g>`;
 }else if(kind==='animal'){
  backdrop+=path('M8 60 23 45l11 6 17-13 22 22v14H8Z',mid,'',0)+line('M9 66h62M13 22l10-8m36 5 8 8',shade,.75)+hatch('M10 70h14m8 0h17m7 0h14m-56-17 6-5m38 5 5 3');
  const animalEye=(x,y)=>path(`m${x-1.7} ${y} 1.7-1 2 1-2 .8Z`,light,ink,.7)+circle(x+.25,y,.75,ink);
  if(['bird','bat','butterfly','insect','spider','scorpion'].includes(f)){
   if(f==='bird')subject=path('M15 59 23 43l20-6 7-14 12-3 7 8-6 14-13 13-19 6Z',mid)+path('m50 26 10-2 4 5-5 10-11 4Z',paper)+path('m64 28 11 4-12 4Z',shade)+path('m21 45-13 5 5 15 20-9m-5-11 15-2 8 7-17 8Z',shade)+animalEye(60,28)+line('m32 59-3 11m17-15-1 14m-19 1h8m7-1h9M10 72h58',ink,1.3)+hatch('m30 47 9 5m-12-1 9 4m18-17 5-2');
   else if(f==='bat')subject=path('m32 36-17-15-12-3 6 20-5 17 16-4 15 11h10l15-11 16 4-5-17 6-20-12 3-17 15Z',shade)+path('m34 30 1-11 6 8 6-8 1 12 3 17-11 13-10-14Z',mid)+line('m11 24 20 21-17-7m55-14L49 45l17-7m-46 13 11-6m29 6-11-6',paper,1)+animalEye(37,35)+animalEye(45,35)+line('m38 43 4 2 3-2',ink,.8);
   else if(f==='butterfly')subject=path('M37 32 19 11 8 14l-1 15 22 17-16 3-2 15 10 8 17-21m5-19 18-21 11 3 1 15-22 17 16 3 2 15-10 8-17-21Z',mid)+path('m40 22 3 8-1 30h-4l-1-30Z',shade)+line('m38 26-7-12m11 12 7-12M11 20l19 17-12-2m51-15L50 37l12-2m-45 21 12-4m34 4-12-4',ink,1)+path('m18 19 8 10-10-3Zm44 0-8 10 10-3Z',paper)+hatch('m17 60 9-4m-7 8 9-5m35 1-9-4m7 8-9-5');
   else{
    const spider=f==='spider';
    subject=line(spider?'M32 31 20 18l-12 6m23 14L15 31 7 45m23 0L14 48 8 61m24-10L21 64l-9 6m36-39 12-13 12 6m-23 14 16-7 8 14m-23 0 16 3 6 13m-24-10 11 13 9 6':'M32 36 20 27l-10 6m20 12L15 43 8 54m24-1L20 62l-4 9m32-35 12-9 10 6m-20 12 15-2 7 11m-24-1 12 9 4 9',ink,1.5)+ellipse(40,spider?46:48,spider?13:11,spider?18:21,mid)+ellipse(40,28,8,9,paper)+line('M40 34v29m-7-19 7 3 7-3m-14 8 7 3 7-3',ink,.8)+animalEye(37,27)+animalEye(43,27)+hatch('m32 38 3 5m-4 1 4 4m11 9 3-4');
    if(f==='scorpion')subject+=path('M47 65q21-4 17-24l-6-5 3-7 9 10q8 26-17 34Z',shade)+path('m28 35-10-13-10 3 2 11 12 6m30-7 10-13 10 3-2 11-12 6',mid)+line('m10 26 7 6-6 3m59-9-7 6 6 3',ink,.8);
   }
  }else if(['fish','octopus','crab','turtle','frog'].includes(f)){
   backdrop=path('M5 74V15L16 5h49l10 11v58Z',paper,'',0)+path('M7 49 21 45l17 5 17-5 18 5v24H7Z',mid,'',0)+line('M11 58h13m29 4h15m-38 5h14m-31-31 3-7m46 10 3-8',shade,.8);
   if(f==='fish')subject=path('M14 42 5 30l1 26 12-9 12 12 24-3 16-15-14-15-22-1-15 13Z',mid)+path('m29 26 10-13 14 14m-18 31 10 11 8-13',shade)+path('M49 28 58 31l10 10-11 11-9 1 6-12Z',paper)+animalEye(59,37)+line('m65 45-7 1m-13-16-6 10 5 13m-15-20-5 8 4 9m9-20-5 10 4 13',ink,1)+hatch('m18 39 6 4m-4 4 7 3m20-20-4 5');
   else if(f==='octopus')subject=line('M29 42Q14 48 17 62l-8 7m24-26q-13 10-7 23l-8 6m20-26-2 25m8-25q8 14 2 25m5-27q16 7 9 21l8 5m-12-29q17 1 16 18',ink,4)+path('M27 41 25 26l6-14 13-4 12 11 1 18-9 12H34Z',mid)+path('m29 24 8-10 8-1-6 19-4 12-7-6Z',paper)+animalEye(35,33)+animalEye(48,33)+line('m31 22 5-4m14 1 3 6m-18 13 3 2m10-2-3 2',ink,.75);
   else if(f==='crab')subject=line('M24 45 15 34 11 22m4 12 8-7m33 18 9-11 4-12m-4 12-8-7M24 54 10 61m18 0-12 10m40-17 14 7M52 61l12 10',ink,2.1)+path('m20 44 11-10h20l11 11-5 16-17 6-17-8Z',mid)+path('m12 17-8 6 5 12 8-7Zm56 0 8 6-5 12-8-7Z',paper)+line('m31 35-2-9m20 9 2-9m-24 21 13 6 15-7m-15 7v9',ink,1.2)+circle(29,25,1.6,ink)+circle(51,25,1.6,ink)+hatch('m25 49 5 5m-4 0 4 4m21-13 5 4');
   else if(f==='frog')subject=path('M17 58 10 67l15 2 8-8h13l12 9 13-3-9-12-8-15-11-8-17 6Z',shade)+path('m26 38 3-10 9-3 8 4 8-1 7 8-4 17-10 10-18-3-9-12Z',mid)+path('m28 47 14 5 15-9-7 12-13 3-13-5Z',paper)+animalEye(34,32)+animalEye(52,33)+line('m29 44 23 1m-23 12-8 4m34-7 7 7',ink,.85)+hatch('m24 47 4-2m22-8 4 1m-23 11 4 1');
   else subject=path('M13 52 18 34l16-11 18 4 10 18-2 15H23Z',shade)+path('m19 45 9-14 16-3 12 10 4 12-14 7-21-2Z',mid)+path('m30 33 10-3 10 8-4 14-13 1-7-9Z',paper)+path('m57 44 11-3 7 6-3 8-14-1m-33 5-10 9 12-1 8-8m15 0 9 8 8-1-7-9Z',mid)+animalEye(69,46)+line('m30 33-6-3m26 8 8-3m-12 17 7 7m-20-6-4 7m11-30 1-6',ink,.95);
  }else if(['snake','worm','slug','lizard','dragon'].includes(f)){
   if(f==='snake'||f==='worm'||f==='slug'){
    subject=path('M13 66q-9-16 13-20l21-1q13-2 9-11l-8-8-10 3-11-7 6-11 18-3 15 10 4 18q5 18-17 23l-24 2q-7 1-3 7Z',mid)+path('m31 20 10-8 12 1 10 9-15 4-10-1Z',paper)+animalEye(50,17)+line('m31 24 10 1m-18 24 3 8m5-10 3 10m5-11 3 10m5-12 4 9m4-12 6 7m-2-17 7 3',ink,.85);
    if(f==='worm')subject+=line('m36 12 3 12m5-15 3 15m4-14 4 13m2-12 4 11',ink,.8);
    if(f==='slug')subject=path('M9 65 16 58l3-24 12-12 15 2 11 18 4 16 13 6-7 7H25Z',mid)+line('m28 25-6-14m18 12 4-14',ink,1.5)+circle(22,10,1.4,ink)+circle(44,8,1.4,ink)+path('m25 40 12-9 10 5 5 21-13 5-17-2Z',paper)+hatch('m22 45 8 2m-9 3 9 2m-8 3 8 2m20-12 3 8m-34 9h44');
   }else{
    subject=path('M8 69 20 56l17-8-5-14 5-18 17-6 15 10 3 11-15 10-14-2 5 13 17 11-3 8H38l-12-8-11 10Z',mid)+path('m39 21 14-7 13 8-11 10-16-2Z',paper)+animalEye(56,20)+line('m53 36 13-6m-31 8 8 2m-5 5 8 1m-25 13 8 3-4 7m23-14 8 7-3 8m-25-12-6-7m31 2 5-6',ink,1.1)+hatch('m34 24 4 2m-4 3 4 2m2 23 5 3m-5 2 5 3m-15 2 7 2');
    if(f==='dragon')subject=path('m35 43-14-29-16 3 8 20-8 14 21-4 13 9m8-18 17-25 12 7-7 18 8 14-23-7Z',shade)+line('m10 22 21 21-15-9m52-14L51 41l16-9',paper,.9)+subject;
   }
  }else{
   const slim=['horse','deer','goat'].includes(f),heavy=['bear','boar','bull','hippo','elephant'].includes(f);
   // A horizontal back and separate legs keep beasts animal-shaped, never masked people.
   subject=path(heavy?'M13 51 16 38l12-6 23 2 10 12-4 17H23Z':slim?'M16 48 20 36l25-2 13 12-5 13-24 1Z':'M13 51 21 38l23-4 15 11-4 15-28 2Z',mid)+path(heavy?'m19 53-1 18h8l3-15m16-1 3 16h8l-1-20':'m22 53-2 18h5l6-15m14-2 2 17h5l-1-20',mid)+line('m30 58-1 11h5m22-16 5 17h5',ink,heavy?2:1.6);
   if(f==='cat')subject+=path('M17 48Q3 36 10 23l4 2q-5 13 7 15m24 0 3-18 10 5 8-7 2 22-9 9-11-6Z',mid)+path('m50 36 10 3 6-4-4 10-9 1Z',paper)+animalEye(53,32)+animalEye(63,31)+path('m57 39 5-1-2 4Z',ink)+line('m50 40-8-1m8 4-8 2m20-5 9-3m-9 6 9 1',ink,.65);
   else if(f==='elephant')subject+=path('M46 26 56 20l11 9 1 17-6 1-1-12-2 24 6 3 6-5-2 12-10 1-6-11-1-15Z',mid)+path('m48 26-12 1-5 12 10 14 12-5 5-14Z',paper)+animalEye(62,31)+line('M57 43h7m-8 6h7m-8 6h7m-20-23 4 8',ink,.8);
   else if(f==='horse'||f==='deer')subject+=path('m43 40 6-18 1-12 6 7 8-5-1 13 8 11-4 11-10-2-7-10-1 15Z',mid)+path('m56 23 5 2 8 12-5 5-8-5Z',paper)+animalEye(60,27)+line('m63 39 3 1m-17-16-5 13',ink,.9)+(f==='deer'?line('M53 17 45 8V3m0 6-6-3m22 9 5-9V2m0 6 6-3',ink,1.5):path('m50 14 4 4-8 24-5 1Z',shade));
   else if(f==='rat'||f==='monkey')subject+=path('M17 48Q5 40 7 29l3-1q-1 12 13 13',mid)+path('m46 34 7-9 12 1 7 13-6 10-12 1-7-7Z',mid)+ellipse(49,27,5,6,paper)+path('m57 32 6-3 7 9-6 8-8-3Z',paper)+animalEye(63,33)+circle(70,39,1.3,ink)+line('m61 41-8-2m8 5-8 1m14-2 6 2',ink,.6);
   else if(f==='hedgehog')subject+=path('m11 48 3-12 6 2 3-10 7 5 6-10 6 8 9-5 1 12 8 2-3 10-13 8-24-2Z',shade)+path('m46 43 8-5 17 14-4 6-20-3-6-5Z',paper)+animalEye(57,47)+circle(69,53,1.5,ink)+hatch('m18 43 5 5m0-13 6 8m3-11 6 10m4-8 2 10m-29 5 5 3');
   else if(f==='bear'||f==='hippo')subject+=path('M44 31 49 24l12 1 8 12-1 13-13 5-13-9Z',mid)+ellipse(49,26,3.5,3.5,mid)+ellipse(62,27,3.5,3.5,mid)+path(f==='hippo'?'m51 38 17-2 5 9-5 10-18-2-5-8Z':'m53 39 11 1 5 8-8 6-12-6Z',paper)+animalEye(60,33)+circle(65,44,1.6,ink)+line('m57 48 9 2',ink,.8);
   else{
    subject+=path('m45 38 2-17 9 7 9-11 2 21-6 14-14-4Z',mid)+path(f==='boar'?'m50 35 8 3 11 4-2 10-16-1-7-7Z':'m49 35 7 4 14 1-3 9-14 3-8-8Z',paper)+animalEye(59,32)+circle(68,42,1.5,ink)+line('m57 47 9-1',ink,.85);
    if(f==='bull'||f==='goat')subject+=path('m48 27-9-7 1-10 4 10 8 1m10 1 8-3 3-10 1 12-8 8',paper)+line('m48 29 5 4',ink,.8);
    if(f==='wolf'||f==='dog')subject+=path(f==='wolf'?'m18 46-11-7 1-12 6 9 7 2Z':'M17 45Q5 42 9 31l4 1q-1 7 9 5Z',shade);
    if(f==='boar')subject+=path('m53 48-3-9-2 9 5 5m11-4 6-8-1 11-4 3',paper);
    if(f==='goat')subject+=path('m54 48 4 13 6-12-6 3Z',shade);
    if(f==='lion')subject=path('m42 30-5-8 11-5 11-1 13 12-3 22-12 12-16-11Z',shade)+subject;
   }
   subject+=hatch(slim?'m21 42 4 5m0-8 4 5m4-5 4 5m-2 9 7 1':'m19 44 5 5m-5 0 5 5m2-15 5 6m-3-8 6 7m2 4 7 3m-1-9 4 4',.65);
  }
 }else{
  backdrop+=path('m9 60 17-8 40 2 7 8v12H9Z',mid,'',0)+line('M10 65h60m-53 5h15m10 0h22',shade,.8)+hatch('m12 24 8-8m-8 14 8-8m42-5 7 7m-7-1 7 7',.45);
  if(f==='plant'||f==='mushroom'){
   if(f==='plant')subject=path('M27 53h27l-4 20H31Z','#bf9674')+line('M40 55V18','#819564',3)+path('M39 32Q18 34 22 18q18-1 17 14m2 9q22 0 19-17-19 0-19 17m-2 9Q17 51 23 37q15 0 16 13Z','#8eaa77');
   else subject=rect(24,38,7,31,'#dcc7a1',3)+rect(48,44,6,25,'#dcc7a1',3)+path('M12 39Q13 13 30 15q17 1 19 24Zm29 7q1-18 14-18 11 1 14 18Z','#ba8e6b')+circle(25,27,3,'#ead8b7')+circle(36,32,2,'#ead8b7');
  }else if(objectType==='wheel')subject=ellipse(40,42,25,26,shade)+ellipse(40,42,20,21,paper)+line('M40 21v42M20 42h40M26 27l28 30M26 57l28-30',ink,3)+ellipse(40,42,5,5,mid)+hatch('m22 30-2 6m2 13 4 6m31-22 3 7');
  else if(objectType==='lantern')subject=lamp(40,43,1.25);
  else if(objectType==='book')subject=book(40,41,1.2);
  else if(objectType==='letter')subject=envelope(40,42,1.65)+rect(48,27,10,10,'#bd8e75',1);
  else if(objectType==='keys')subject=circle(36,29,12,'#c3a563')+circle(36,29,7,paper)+line('M39 39v29m0-7h10m-10-7h7m-4-17 12 26m-3-7 7-3','#bb9654',5);
  else if(objectType==='toolbox')subject=rect(15,34,50,31,'#a7805c',4)+line('M30 34v-9h20v9',outline,3)+rect(15,44,50,5,'#8b6c4d')+rect(36,42,8,10,'#d1b677',1)+line('M22 53h9m18 0h9','#c7aa83',1);
  else if(objectType==='radio')subject=rect(15,29,50,37,'#8d9b87',4)+line('M23 29V15m0 4 24-8',outline,1.7)+rect(21,36,27,12,'#d8d4b4',2)+line('M25 40h18m-18 4h18',outline,.8)+circle(56,41,4,'#d4be91')+rect(22,53,24,7,'#6c7e6e',1)+circle(56,57,3,'#d4be91');
  else if(objectType==='clock')subject=circle(40,40,25,'#b69c72')+circle(40,40,21,light)+line('M40 24v16l-11 9',outline,2)+line('M40 21v3m19 16h-3M40 59v-3m-19-16h3',outline,1.3)+path('m25 62-4 8h9m25-8 4 8h-9Z','#b69c72');
  else if(objectType==='medicine')subject=rect(17,32,46,32,'#e8dfc7',4)+line('M31 32v-8h18v8',outline,2)+rect(37,39,6,18,'#b57f6c')+rect(31,45,18,6,'#b57f6c');
  else if(objectType==='rope')subject=`<g fill="none" stroke="#b59663" stroke-width="4">${[0,1,2,3].map(n=>`<ellipse cx="40" cy="${36+n*5}" rx="${21-n}" ry="${15-n}"/>`).join('')}</g>`+line('M53 59q10 7 14 0','#a98a59',4);
  else if(objectType==='jar')subject=path('M24 25h32v13q9 7 5 28H19q-4-21 5-28Z','#a7b3a0',outline)+rect(23,21,34,7,'#a18c68',2)+rect(25,43,30,15,light,2)+line('M31 48h18m-18 5h12','#a6a58b',1);
  else if(objectType==='compass')subject=circle(40,43,24,'#c0a471')+circle(40,43,19,light)+path('m40 27 7 19-7-4-7 4Z','#ae7a63')+path('m40 59-7-19 7 4 7-4Z','#879b8d')+line('M34 18v-6h12v6',outline,2);
  else if(objectType==='bell')subject=path('M20 58q8-7 8-23 0-14 12-14 12 0 12 14 0 16 8 23Z','#cfab65',outline)+circle(40,63,5,'#a48a51')+line('M40 20v-7M19 59h42',outline,2);
  else if(objectType==='boat')subject=path('M10 48h60L57 65H24Z','#b28b62',outline)+line('M40 17v31',outline,2)+path('m37 19-21 24h21Z',light,outline,1)+path('m43 22 16 21H43Z','#d9c79f',outline,1)+line('M12 71q10-5 19 0t19 0 18 0','#87aaa7',2);
  else if(objectType==='gloves')subject=path('m21 64-5-25 4-2 5 10-2-24 5-1 4 23 1-25h5l2 26 6-21 5 2-4 31-9 10Z','#c3a47b',outline)+path('m47 64 4-23 4 1v13l7-14 4 2-7 24Z','#d0b38d',outline);
  else subject=rect(15,29,50,37,'#a88962',5)+path('M26 29v-9q14-10 28 0v9', 'none',outline,3)+rect(15,35,50,9,'#b79b74',2)+rect(36,41,8,9,'#d9bd7b',1);
 }
 const edgeHatch=Array.from({length:10},(_,i)=>`M7 ${20+i*5}l${2+(seed>>>i&1)}-1M73 ${20+i*5}l-${2+(seed>>>(i+10)&1)} 1`).join('');
 const frame=path('M5 74V15L16 5h49l10 11v58Z','none',ink,1.1)+line('M10 70h8m44 0h8',shade,.8)+hatch(edgeHatch,.38);
 // Legacy object material swatches are translated to the same limited print palette.
 const materialInk=hex=>{const n=parseInt(hex.slice(1),16),l=(n>>16)*.299+(n>>8&255)*.587+(n&255)*.114;return l<115?ink:l<160?shade:l<195?mid:l<230?paper:light};
 const result=`<svg class="card-portrait dossier-portrait ink-card-portrait" data-portrait-kind="${portraitEscape(kind)}" data-portrait-role="${portraitEscape(role)}" data-portrait-variant="${portraitEscape(variant)}" data-art-family="${portraitEscape(f)}" viewBox="0 0 80 80" role="img" aria-label="${portraitEscape(label)}" focusable="false" style="color:${ink}"><title>${portraitEscape(label)}</title>${backdrop}<g stroke-linecap="round" stroke-linejoin="round">${subject}</g>${frame}</svg>`.replace(/#[0-9a-f]{6}(?=[";])/gi,materialInk);
 CARD_PORTRAIT_CACHE.set(key,result);return result;
}
