// Geometric pact emblems, authored for Lantern Oath. No character illustrations.
const CARD_PORTRAIT_CACHE=new Map();
const portraitEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cardPortraitHTML(c){
 const profile=CARD_ART_PROFILES[c.baseName||c.n]||{family:c.tokenKind==='spider'?'spider':c.tokenKind==='flame'||c.fod||c.n==='余芯'?'flame':['碎灯偶','碎灯仆'].includes(c.n)?'undead':c.n==='练习灯偶'?'jar':'human',features:[],color:'#cab37a',seed:7};
 const cacheKey=[c.baseName||c.n,c.rarity||'',c.tokenKind||''].join('|');if(CARD_PORTRAIT_CACHE.has(cacheKey))return CARD_PORTRAIT_CACHE.get(cacheKey);
 const f=profile.family,features=new Set(profile.features),seed=profile.seed||0,color=profile.color||'#bfac77';let face='';
 const eyes='<path d="m27 34 8 1m10 0 8-1" stroke="currentColor" stroke-width="2.5" fill="none"/>';
 const muzzle='<ellipse cx="40" cy="48" rx="13" ry="9" fill="#c6b88d"/><path d="m36 47 4 3 4-3m-4 3v5" stroke="currentColor" fill="none"/>';
 const humans=['human','knight','mage','rogue','healer','undead','giant','demon'];
 const mammals=['bull','goat','wolf','dog','cat','bear','boar','rat','monkey','horse','deer','hippo','elephant','hedgehog','lizard','dragon'];
 if(humans.includes(f)){
  face='<path d="M17 73 24 53h32l7 20Z" fill="#615d45"/><path d="M27 19q13-10 26 0l3 19-6 16-10 6-10-6-6-16Z" fill="#c2b48a"/>'+eyes+'<path d="M34 47h12" stroke="currentColor"/>';
  if(f==='knight'||f==='giant')face+='<path d="M22 30 27 12h26l6 18-7 8H28Z" fill="#77765a"/><path d="M29 29h22m-11-13v39" stroke="#d5c891" stroke-width="2"/>';
  if(f==='mage'||f==='healer')face+='<path d="m20 31 20-23 20 23-9-4-11-9-11 9Z" fill="#525f53"/><circle cx="40" cy="14" r="4" fill="'+color+'"/>';
  if(f==='rogue')face+='<path d="m25 40 15 6 15-6-4 15-11 5-11-5Z" fill="#566154"/>';
  if(f==='undead')face+='<circle cx="31" cy="34" r="4" fill="#393c31"/><circle cx="49" cy="34" r="4" fill="#393c31"/><path d="m35 51 1-7m8 7-1-7" stroke="#393c31"/>';
  if(f==='demon')face+='<path d="m28 20-10-13 4 22m30-9L62 7l-4 22" fill="'+color+'"/>';
 }else if(mammals.includes(f)){
  face='<path d="m23 25 5-16 12 12L52 9l5 16 4 18-9 17H28L19 43Z" fill="#9c9874"/>'+eyes+muzzle;
  if(['bull','goat','deer','dragon'].includes(f))face+='<path d="M25 23Q9 13 16 5M55 23Q71 13 64 5" fill="none" stroke="'+color+'" stroke-width="5"/>';
  if(['horse','wolf','dog','lizard','dragon'].includes(f))face+='<path d="m29 44 11-5 11 5-4 18H33Z" fill="#a5a17d"/>'+eyes;
  if(f==='elephant')face+='<path d="m34 42 4 23 8 3 4-6" fill="none" stroke="#c6b88d" stroke-width="8"/>';
  if(f==='boar'||f==='hippo')face+='<path d="m28 52-8-8 3 14m29-6 8-8-3 14" fill="'+color+'"/>';
 }else if(['bird','bat','butterfly','insect'].includes(f)){
  face='<path d="M35 20Q9 8 10 36l22 13M45 20Q71 8 70 36L48 49M34 43Q13 40 18 64l19-9m9-12q21-3 16 21L43 55" fill="#778b73" stroke="currentColor"/><ellipse cx="40" cy="38" rx="8" ry="23" fill="#bcb18a"/>';
  if(f==='bird')face+='<path d="m39 26 14 7-14 5Z" fill="'+color+'"/>';
  if(f==='insect')face+='<path d="m31 33-12-8m12 20-13 4m31-16 12-8M49 45l13 4" stroke="currentColor" stroke-width="3"/>';
 }else if(['spider','scorpion','octopus','crab','hand'].includes(f)){
  face='<ellipse cx="40" cy="39" rx="14" ry="20" fill="#9a9b75"/>'+eyes+'<path d="m28 29-16-9m15 17-18 1m18 8-17 13m19-7-8 18m31-41 16-9M53 37l18 1M53 46l17 13M51 52l8 18" stroke="currentColor" stroke-width="3" fill="none"/>';
 }else if(['plant','mushroom'].includes(f)){
  face='<path d="m36 67 2-46 4-1 2 47Z" fill="#7d8964"/><path d="M38 35Q8 30 18 12q22 0 23 20M43 46q31-7 22-26-22 3-23 23M37 53Q12 49 17 35q19 0 23 17" fill="#8ca478"/>';
  if(f==='mushroom')face+='<path d="M12 32Q14 5 40 8q27 0 29 24Z" fill="'+color+'"/>';
 }else if(f==='flame'||f==='spirit'){
  face='<path d="M39 9c8 16 23 27 16 43-7 16-28 14-33 0-6-16 13-21 12-33l6 12q6-10-1-22Z" fill="'+color+'"/><path d="M39 39q17 18 0 24-13-5 0-24Z" fill="#f3df99"/>';
 }else if(f==='jar'||f==='mimic'){
  face='<path d="M20 24h40l-4 37-16 8-16-8Z" fill="#9e9772"/><path d="M18 17h44v10H18Z" fill="'+color+'"/>'+eyes+'<path d="M31 47h18m-9-7v15" stroke="currentColor"/>';
 }else{
  face='<path d="M17 43Q15 13 40 15q28-2 25 29l-9 20H25Z" fill="#98a07b"/>'+eyes+'<circle cx="40" cy="24" r="4" fill="'+color+'"/><path d="m30 51 10 6 10-6" fill="none" stroke="currentColor"/>';
 }
 let marks='<path d="m8 11 6-4m52 0 6 4M7 66l7 6m52 0 7-6" stroke="'+color+'" fill="none"/>';
 if(features.has('shield'))marks+='<path d="m60 47 13 4-2 16-11 7-10-7-2-16Z" fill="#788b79" stroke="currentColor"/>';
 if(features.has('orbit'))marks+='<ellipse cx="40" cy="38" rx="34" ry="31" fill="none" stroke="'+color+'" stroke-width="1.2" stroke-dasharray="3 4"/>';
 if(features.has('spikes'))marks+='<path d="m17 33-11-7 4 15m53-8 11-7-4 15" fill="'+color+'"/>';
 if(features.has('spark'))marks+='<path d="m64 12 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#e6d9a1"/>';
 if(features.has('spots'))marks+='<g fill="#c0c77d"><circle cx="23" cy="24" r="2"/><circle cx="56" cy="41" r="2"/><circle cx="29" cy="57" r="2"/></g>';
 const result=`<svg class="card-portrait" viewBox="0 0 80 80" role="img" aria-label="${portraitEscape(c.n)}的契印头像" style="color:#3c4435"><circle cx="40" cy="40" r="35" fill="#c7bc9633"/><g stroke-linecap="round" stroke-linejoin="round" transform="rotate(${(seed%5)-2} 40 40)">${face}${marks}</g></svg>`;
 CARD_PORTRAIT_CACHE.set(cacheKey,result);return result;
}
