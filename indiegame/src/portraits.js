// Static archival portraits: original silhouettes, ink marks and photographic faults.
// No SVG filters or per-card animation: the table keeps the same light render path.
const CARD_PORTRAIT_CACHE=new Map();
const portraitEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cardPortraitHTML(c){
 const id=c.baseName||c.n,profile=CARD_ART_PROFILES[id]||{family:c.tokenKind==='spider'?'spider':c.tokenKind==='flame'||c.fod||c.n==='余芯'?'flame':['碎灯偶','碎灯仆'].includes(c.n)?'undead':c.n==='练习灯偶'?'jar':'human',features:[],seed:7};
 const label=typeof shortCardName==='function'?shortCardName(c):c.n;
 const cacheKey=[id,c.rarity||'',c.tokenKind||'',profile.role||'',label].join('|');if(CARD_PORTRAIT_CACHE.has(cacheKey))return CARD_PORTRAIT_CACHE.get(cacheKey);
 const f=profile.family,role=profile.role||'',seed=(profile.seed||7)>>>0,features=new Set(profile.features||[]),ink='#172522',shade='#46564c',mid='#7c887b',paper='#b6b9a2',light='#d9d8bd',red='#9d6255';
 const line=(d,color=ink,width=1.4)=>`<path d="${d}" stroke="${color}" stroke-width="${width}" fill="none"/>`;
 const ellipse=(x,y,rx,ry,fill=mid)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
 const eye=(x,y,r=1.5)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${light}"/>`;
 const human=['human','knight','mage','rogue','healer','undead','giant','demon'].includes(f)||!!role;
 let scene='',subject='';
 // The same window occurs in many unrelated photographs, always one pane short.
 scene=`<rect x="6" y="4" width="68" height="72" fill="${ink}"/><path d="M9 58V13h60v45M29 13v45M51 13v45M9 33h60" stroke="${mid}" stroke-opacity=".18" fill="none"/>`;
 if(human){
  const broad=f==='giant'?4:0,tilt=seed%3-1,hair=seed%4;
  subject=`<path d="M${16-broad} 75 22 57l12-6h12l12 6 ${6+broad} 18Z" fill="${shade}"/><path d="m32 53 8 8 8-8-3-7H35Z" fill="${mid}"/><path d="m27 ${22+tilt} 5-9 16-1 8 11-2 22-9 10-12-6-7-14Z" fill="${paper}"/>`;
  subject+=hair===0?`<path d="m25 29 2-12 12-8 16 9 3 16-11-12-13 2Z" fill="${ink}"/>`:hair===1?`<path d="m26 28 3-13 22 1 5 13-13-8-12 6Z" fill="${shade}"/>`:hair===2?`<path d="m26 34 1-17 9-7 16 7 5 18-7-13-11-3-9 10Z" fill="${ink}"/>`:`<path d="m27 26 8-14 16 5 5 10-17-6Z" fill="${shade}"/>`;
  subject+=line('m31 33 5-1m10 0 5 1m-12 3-2 8 5 1m-7 4 11 1',shade,1.2);
  subject+=line('m27 59 10 14m16-14L43 73',ink,2);
  if(f==='knight'||f==='giant'||role==='nightwatch'){
   subject+=`<path d="M24 23 28 12h24l5 11-16-4Z" fill="${shade}"/>${line('M24 23h34',ink,3)}<path d="m29 59 6 1-1 6-4 2-3-4Z" fill="${paper}"/>${line('m49 56 2 17m-28-7h10m18 0h9',mid,1)}`;
  }
  if(f==='mage'||f==='alien')subject+=`<circle cx="32" cy="34" r="5" stroke="${ink}" fill="none"/><circle cx="49" cy="34" r="5" stroke="${ink}" fill="none"/>${line('m37 34 7 0m-20 0 3 0m27 0 4 0M23 34v10m35-10v10',ink,1.3)}<rect x="54" y="43" width="5" height="10" fill="${shade}"/>`;
  if(f==='healer'||role==='firewarden'){
   subject+=`<path d="m22 58 10-6 8 10 8-10 10 6 6 17H16Z" fill="${mid}"/>${line('m31 55 7 11-8 4m19-15-7 11 8 4m-10-4v9',shade,1.3)}`;
   if(role!=='firewarden')subject+=`<rect x="49" y="61" width="8" height="10" rx="1" fill="${paper}"/>${line('m52 62 2 6m-4-3h6',shade,1)}`;
  }
  if(f==='rogue')subject+=`<path d="m23 47 16 7 18-10-4 14-13 7-13-9Z" fill="${shade}"/>${line('m27 59 7 14m19-14-7 14',ink,2)}`;
  if(f==='undead')subject+=`<path d="m27 27 8-7 18 10-3 19-12 7-12-12Z" fill="${mid}"/>${ellipse(32,34,4,3,ink)}${ellipse(48,34,4,3,ink)}${line('m34 48 12-1m-9-3v7m6-7v7',ink,1)}`;
  if(f==='demon')scene+=line('M24 25Q10 11 17 7M56 25Q70 11 63 7',shade,2);
  if(role==='lighthouse'){
   scene+=`<path d="M64 47 10 12v59Z" fill="${paper}" opacity=".07"/>`;
   subject+=`<path d="m48 52 17-2 5 16-17 5Z" fill="${shade}" stroke="${paper}" stroke-width="1"/><circle cx="59" cy="59" r="8" fill="${ink}" stroke="${paper}"/><circle cx="59" cy="59" r="5" fill="none" stroke="${mid}"/><circle cx="59" cy="59" r="2" fill="${light}"/>${line('m58 45 6 5m-8 2 3-4',ink,1.5)}`;
  }else if(role==='firewarden'){
   subject+=`<path d="M25 16q12-12 27 3l3 17-7-11-14-7-6 18Z" fill="${ink}"/><rect x="43" y="55" width="24" height="18" rx="2" fill="${ink}" stroke="${paper}"/><path d="M49 55v-5h12v5" fill="none" stroke="${mid}"/><path d="M48 62h14m-14 5h14" stroke="${shade}"/><path d="m54 66 3-7 3 7-3 4Z" fill="#c7a16b"/><path d="m23 62 13 4 6 4-2 5-8-5-11-3" fill="${paper}"/>`;
  }else if(role==='nightwatch'){
   scene+=`<circle cx="65" cy="19" r="10" fill="none" stroke="${mid}" opacity=".4"/>${line('M65 12v8l-4 4',mid,1)}`;
   subject+=`<circle cx="24" cy="61" r="4" fill="none" stroke="${paper}"/>${line('m24 65 1 9m-3-3h6m-1-5 4 7',paper,1.2)}`;
  }
  // Not every face is concealed. The anomaly is small enough to doubt.
  if(!role&&f!=='undead'&&seed%7===0)subject+=`<rect x="25" y="29" width="32" height="8" fill="${ink}" opacity=".92"/>`;
  else if(!role&&seed%7===1)subject+=eye(46,36,.8)+line('m26 39 4 1',ink,.8);
 }else if(['bull','goat','wolf','dog','cat','bear','boar','rat','monkey','horse','deer','hippo','elephant','hedgehog','lizard','dragon'].includes(f)){
  const long=['wolf','dog','horse','lizard','dragon'].includes(f),small=f==='rat';
  subject=`<path d="m${small?24:19} 75 6-21 8-7h15l8 7 7 21Z" fill="${shade}"/><path d="m23 28 7-13 19-1 10 14-2 21-10 13H33L21 47Z" fill="${mid}"/>`;
  if(['bull','goat','deer','dragon'].includes(f))subject+=`<path d="M29 26Q12 26 13 10l9 12 7-1m22 5Q68 26 67 10L58 22l-7-1" stroke="${paper}" stroke-width="2.5" fill="none"/>`;
  else if(['cat','wolf','dog','horse'].includes(f))subject+=`<path d="m24 29-4-20 15 13m20 7 5-20-15 13" fill="${mid}" stroke="${shade}"/>`;
  else if(['rat','bear','monkey'].includes(f))subject+=ellipse(24,26,7,8,mid)+ellipse(56,26,7,8,mid);
  subject+=ellipse(40,long?48:47,long?10:14,long?15:10,paper)+ellipse(40,46,4,2,ink)+line('M40 49v9m-6-1 6 2 6-2',shade,1.2)+eye(29,35)+eye(51,35);
  if(f==='elephant')subject+=`<path d="m34 43 4 23 9 5 4-5" fill="none" stroke="${paper}" stroke-width="8"/>`;
  if(f==='boar'||f==='hippo')subject+=line('m29 51-7-6 2 12m27-6 7-6-2 12',paper,3);
  if(f==='deer')subject+=line('m24 22-3-14m0 8-7-4m42 10 3-14m0 8 7-4',paper,1.5);
  if(f==='hedgehog')subject+=line('m22 30-9-5m10 12-12-2m11 11-11 3m46-19 9-5m-10 12 12-2m-11 11 11 3',mid,3);
  if(f==='dragon'||f==='lizard')subject+=line('m40 17 3 6-6 4 6 4-6 4',ink,1.5);
  if(f==='rat')subject=`<path d="M22 75 26 58l14-7 13 8 7 16Z" fill="${shade}"/>${ellipse(25,22,8,9,mid)}${ellipse(55,22,8,9,mid)}${ellipse(25,22,4,5,paper)}${ellipse(55,22,4,5,paper)}<path d="m26 28 6-9h16l6 9-6 18-8 12-8-12Z" fill="${mid}"/><path d="m33 41 7-4 7 4-5 13-2 4-3-6Z" fill="${paper}"/>${eye(31,33,1.2)}${eye(49,33,1.2)}${ellipse(40,51,2.5,1.7,ink)}${line('m29 44-16-4m15 7-17 2m40-5 16-4m-15 7 17 2m-28 5v5',paper,1)}${line('M55 70q16-2 13-14',mid,2)}`;
  if(f==='dragon')subject=`<path d="M18 75 25 58l-7-14 7-18 16-8 15 7 4 11 12 7-10 6-12-1-10 11-4 16Z" fill="${mid}"/><path d="m26 26-9-17 3 23m17-11L35 6l9 17" fill="${paper}"/>${eye(47,31,1.8)}${line('m44 48 20-1m-13 1 2 6 3-6m5 0 1 5m-34-3 6 5-6 5 5 6-7 6',ink,1.3)}<path d="m21 57-11-4 9 10-10 2 13 6" fill="${shade}"/>`;
  if(seed%4===0)scene+=line('M15 66q25-30 53-32',paper,.5);
 }else if(f==='bird'||f==='bat'||f==='butterfly'||f==='insect'){
  if(f==='bird')subject=`<path d="M16 68 28 55l-5-17 9-16 18 2 8 16-7 17 11 11Z" fill="${shade}"/><path d="m38 24 22 13-22 4Z" fill="${paper}"/>${eye(39,31,2)}${line('m29 44 9 15-8 10m15-20 6 13',mid,1.5)}${line('m32 66-7 7m17-7 7 7',paper,1)}`;
  else subject=`<path d="M36 27Q12 8 9 26l7 24 17-5M44 27Q68 8 71 26l-7 24-17-5M35 44Q14 40 18 66l19-9m8-13q21-4 17 22l-19-9" fill="${mid}" stroke="${ink}" stroke-width="1.3"/><ellipse cx="40" cy="41" rx="5" ry="25" fill="${ink}"/>${line('m38 19-5-9m9 9 5-9',paper,1)}`;
  if(f==='insect')subject+=line('m34 32-17-8m16 17-19 2m18 7-17 12m31-28 17-8m-16 17 19 2m-18 5 17 12',paper,1.2);
  if(f==='butterfly')subject+=ellipse(23,29,4,5,ink)+ellipse(57,29,4,5,ink);
 }else if(['spider','scorpion','octopus','crab','hand'].includes(f)){
  if(f==='hand')subject=`<path d="M26 70 21 43l-3-14 4-2 9 17-4-29 5-1 8 29 1-33 5 1 2 32 8-28 5 2-5 33 8-15 5 2-9 28-13 9Z" fill="${mid}"/>${line('m29 56 20 3m-14-9 11-2',ink,1.4)}`;
  else{
   subject=ellipse(40,42,f==='crab'?20:12,f==='octopus'?22:17,mid)+line('m29 31-14-15-7 7m21 15L9 32l-3 9m23 3L9 50l-1 12m23-12L17 64l4 8m30-41 14-15 7 7M51 38l20-6 3 9m-23 3 20 6 1 12m-23-12 14 14-4 8',paper,1.6)+eye(35,34)+eye(45,34);
   if(f==='scorpion')subject+=line('M45 58q24 15 21-20-1-8-9-7l4 6',mid,4);
   if(f==='crab')subject+=line('m24 35-12-7-5-10m5 10 7-8m37 15 12-7 5-10m-5 10-7-8',mid,4);
   if(f==='octopus')subject+=line('M34 53q-13 4-10 20m15-18q-3 11-1 19m7-19q17 2 17 15',mid,4);
   if(f==='octopus')subject=ellipse(40,30,16,19,mid)+eye(34,29,1.8)+eye(46,29,1.8)+line('M27 40Q11 43 17 59t-9 13m24-28q-9 10-6 20t-8 9m20-27q-6 16-2 28m7-28q6 17 2 28m5-30q12 8 10 19t8 9m-11-32q16 0 13 16t4 14',mid,4)+line('m31 39 8 3 10-4',shade,1);
  }
 }else if(f==='snake'||f==='worm'||f==='slug'){
  subject=`<path d="M19 67q-2-16 18-18 23-2 17-18-3-8-12-8-8 0-9 8" fill="none" stroke="${mid}" stroke-width="12"/>${ellipse(39,24,11,7,paper)}${eye(35,22,1.2)}${line('m32 27-8 3m13 24-4 9m10-10-3 10',ink,1)}`;
  if(f==='worm')subject+=line('m30 50 5 11m4-12 5 10m-1-17 10 6',ink,2);
  if(f==='slug')subject+=line('m34 20-7-13m17 13 5-13',mid,2);
 }else if(f==='fish'||f==='turtle'){
  subject=ellipse(38,41,22,15,mid)+`<path d="m58 39 15-13v29l-15-12m-25-18 6-13 12 18" fill="${shade}"/>`+eye(24,37,2)+line('m25 48 8-2m2-14 5 17m3-16 5 15',ink,1.4);
  if(f==='turtle')subject=`<path d="M15 56q-6-38 25-38t25 38Z" fill="${mid}"/>${ellipse(41,58,7,11,paper)}${line('m40 20-9 16 9 14 10-14Zm-9 16-13 4m32-4 13 4m-23 10v14',ink,2)}`;
 }else if(f==='plant'||f==='mushroom'){
  subject=line('M38 72 41 21m-2 27L22 34m18 6 19-16m-19 33 21-7',mid,5);
  if(f==='mushroom')subject+=`<path d="M12 35Q15 6 40 11q23-1 29 24Z" fill="${paper}"/>${line('m18 31 44 0M30 22l3 7m13-9-1 9',shade,1)}`;
  else subject+=`<path d="M38 42Q12 39 18 20q21-4 24 20m1 9q28-4 22-24-22 0-22 24M37 61Q13 58 21 42q16 0 16 19" fill="${mid}"/>`;
 }else if(f==='flame'||f==='spirit'){
  subject=`<path d="M25 70q-13-17 2-31 13-12 7-28 23 16 19 33 18 12 4 26Z" fill="${mid}" opacity=".7"/><path d="M33 69q-6-12 6-20 10-8 4-19 17 19 4 39" fill="${paper}" opacity=".55"/>`;
  if(f==='spirit')subject+=ellipse(36,37,2,3,ink)+ellipse(47,37,2,3,ink)+line('M21 62q18-10 40 0',shade,1);
 }else if(f==='jar'||f==='mimic'){
  subject=`<path d="M20 23h40l-4 40-17 7-15-7Z" fill="${mid}"/><rect x="17" y="18" width="46" height="9" rx="1" fill="${shade}"/><path d="m28 39 23 3-1 16-23-3Z" fill="${paper}"/>${line('m30 44 17 2m-17 5 9 1m13-24-2 11',shade,1)}`;
  if(f==='mimic')subject+=line('M23 32q17 12 35 0m-29 5 2 8m10-5 1 8m10-12-1 8',ink,2);
 }else{
  subject=`<path d="M20 71 15 47l10-24 15-10 20 10 8 24-10 24Z" fill="${mid}"/><path d="M26 39q14-23 29 0-14 20-29 0Z" fill="${paper}"/><ellipse cx="41" cy="39" rx="4" ry="12" fill="${ink}"/>${line('m25 56 7 8 9-7 10 9 8-12',ink,1.2)}`;
 }
 let fault='';
 if(features.has('orbit'))fault+=line('M8 52q25-32 63-18M8 54q25-32 63-18',paper,.4);
 if(features.has('shield')&&!role)fault+=`<path d="m58 59 11-3-1 13-7 4-6-6Z" fill="${shade}" stroke="${paper}" stroke-width=".6"/>`;
 if(features.has('spikes'))fault+=line('M8 22 12 26 8 31M72 45 68 49 72 55',paper,.6);
 // Grain is fixed from the card seed. It does not blink or consume a random roll.
 let grain='';for(let n=0;n<13;n++){const x=8+(seed+n*23)%64,y=8+((seed>>>5)+n*19)%64;grain+=`<circle cx="${x}" cy="${y}" r="${n%3===0?.7:.35}" fill="${n%2?paper:ink}" opacity=".25"/>`}
 const scratchX=13+seed%47;
 const frame=`<path d="M6 6h68v68H6ZM9 9h62v62H9Z" fill="none" stroke="${paper}" stroke-width=".5" opacity=".5"/>${line(`M${scratchX} 8l-1 59M10 ${20+seed%35}h57`,paper,.35)}<path d="M7 13V7h7m52 0h7v7M7 66v7h7m52 0h7v-7" stroke="${light}" stroke-width="1" fill="none"/><path d="m59 10 10 2m-9 1 8-3" stroke="${red}" stroke-width=".8"/><rect x="8" y="64" width="29" height="8" fill="${ink}" opacity=".75"/><text x="10" y="70" font-family="monospace" font-size="5.8" letter-spacing=".5" fill="${paper}">03:17</text>`;
 const result=`<svg class="card-portrait dossier-portrait" viewBox="0 0 80 80" role="img" aria-label="${portraitEscape(label)}" style="color:${ink}">${scene}<g stroke-linecap="round" stroke-linejoin="round" transform="rotate(${seed%3-1} 40 40)">${subject}${fault}</g>${grain}${frame}</svg>`;
 CARD_PORTRAIT_CACHE.set(cacheKey,result);return result;
}
