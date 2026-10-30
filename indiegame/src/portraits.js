// Warm, static storybook illustrations: ordinary people, wildlife and useful objects.
// The art is deterministic and has no filters, animation or gameplay random calls.
const CARD_PORTRAIT_CACHE=new Map();
const portraitEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cardPortraitHTML(c){
 const id=c.baseName||c.n,profile=CARD_ART_PROFILES[id]||{family:c.tokenKind==='spider'?'spider':c.tokenKind==='flame'||c.fod||c.n==='余芯'?'flame':'human',seed:7};
 const label=typeof shortCardName==='function'?shortCardName(c):c.n,seed=(profile.seed||7)>>>0,f=profile.family||'human',role=profile.role||'';
 const animalFamilies=['bull','goat','wolf','dog','cat','bear','boar','rat','monkey','horse','deer','hippo','elephant','hedgehog','lizard','dragon','bird','bat','butterfly','insect','spider','scorpion','octopus','crab','snake','worm','slug','fish','turtle','frog'];
 const humanFamilies=['human','knight','mage','rogue','healer','giant'];
 const kind=profile.portraitKind||profile.subject||(role?'person':animalFamilies.includes(f)?'animal':humanFamilies.includes(f)?'person':'object');
 const occupation=profile.occupation||({nightwatch:'watch',firewarden:'worker',lighthouse:'sailor',courier:'courier',roadworker:'worker',stationkeeper:'clerk'}[role])||({knight:'watch',giant:'worker',mage:'teacher',rogue:'courier',healer:'medic'}[f])||'clerk';
 const objectType=profile.objectType||({undead:'book',demon:'toolbox',alien:'radio',spirit:'lantern',flame:'lantern',hand:'gloves',mimic:'satchel',jar:'jar',blob:'medicine'}[f])||'book';
 const key=[id,kind,role,occupation,objectType,label].join('|');if(CARD_PORTRAIT_CACHE.has(key))return CARD_PORTRAIT_CACHE.get(key);
 const ink='#4c5045',outline='#6e705b',paper='#f5ebd3',light='#fff8e7',gold='#d5aa62',green='#789a78',blue='#7897a4';
 const palette=['#617f88','#9a7156','#75835d','#9d6e64','#9c8b65','#6e7d99'],coat=palette[seed%palette.length],skin=['#e3b68e','#edc4a0','#d6a179','#c48f6a'][seed%4],hair=['#594938','#77513a','#ad8256','#786d5c'][seed%4];
 const path=(d,fill=ink,stroke='',width=1.4)=>`<path d="${d}" fill="${fill}"${stroke?` stroke="${stroke}" stroke-width="${width}"`:''}/>`;
 const line=(d,color=outline,width=1.4)=>path(d,'none',color,width);
 const ellipse=(x,y,rx,ry,fill=coat)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}"/>`;
 const circle=(x,y,r,fill=ink)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
 const rect=(x,y,w,h,fill,r=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
 const lamp=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${line('M-6-10v-4a6 6 0 0 1 12 0v4',ink,2)}${rect(-10,-10,20,26,'#8a7654',3)}${rect(-6,-6,12,17,'#efd895',1)}${path('M-3 8Q-6 2 0-3 6 3 3 8Z','#d29345')}${line('M-10-10h20M-11 16h22',ink,2)}</g>`;
 const envelope=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${rect(-14,-9,28,19,light,1)}${line('M-14-9 0 2 14-9m-28 19 9-8m19 8-9-8','#ac9672',1.2)}</g>`;
 const book=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})">${path('M-20-12Q-9-16 0-11 9-16 20-12v29Q9 13 0 18-9 13-20 17Z',light,outline)}${line('M0-11v29m-16-23h10m-10 5h10m-10 5h10m12-10h10m-10 5h10m-10 5h10','#b5a382',1)}</g>`;
 let backdrop=rect(4,4,72,72,paper,6),subject='';
 if(kind==='person'){
  backdrop+=rect(9,9,62,43,'#dfebde',3)+rect(13,13,24,30,'#f4f6e8',1)+line('M25 13v30M13 28h24','#ccd8c5',1)+circle(59,20,8,'#f2d7a1')+path('M9 49Q31 38 71 49v22H9Z','#d3ddc5');
  const broad=role==='roadworker'||f==='giant'?4:0,female=profile.gender==='female'||['firewarden','stationkeeper'].includes(role),older=['nightwatch','lighthouse'].includes(role);
  const coatColor=role==='nightwatch'?'#526e7b':role==='firewarden'?'#ae8057':role==='lighthouse'?'#617c70':role==='courier'?'#6b8a91':role==='roadworker'?'#9a7955':role==='stationkeeper'?'#9a6d68':profile.color||coat;
  subject+=path(`M${14-broad} 76q2-18 15-22l11-3 11 3q13 4 ${15+broad} 22Z`,coatColor);
  // Shoulders, a shirt collar and a naturally proportioned head remain separate shapes.
  subject+=rect(35,45,10,13,skin,2)+path('m29 54 11 9 11-9-5-3H34Z',light)+line('M40 63v13',outline,1);
  if(female)subject+=path('M24 39V25q0-16 16-16 17 0 17 17v30l-11-7H30l-8 9Z',hair);
  else subject+=path('M25 31V24q0-14 15-14 15 0 15 14v10Z',older?'#6f6b5d':hair);
  subject+=ellipse(25,35,2.2,4,skin)+ellipse(55,35,2.2,4,skin)+ellipse(40,32,14,18,skin);
  subject+=path('M26 28q0-16 14-16 14 0 15 15-9-1-14-8-4 8-15 9Z',older?'#6f6b5d':hair);
  if(female)subject+=path('M25 28q-2 15 3 24l4-2q-4-9-3-24Zm29-2q2 12-2 25l4 3q5-16 0-27Z',hair);
  // Small dark pupils, balanced brows, nose and a relaxed mouth; no glowing eyes or masks.
  subject+=ellipse(34,33,2.5,1.7,light)+ellipse(46,33,2.5,1.7,light)+circle(34.5,33,1.25,'#554331')+circle(45.5,33,1.25,'#554331');
  subject+=line('M31 29q3-1 6 0m6 0q3-1 6 0','#775a44',1)+line('m40 34-1 6 3 1','#af7e5e',.85)+line('M35 45q5 3 10 0','#9d6b54',1.1);
  if(older)subject+=line('M29 37h2m18 0h2M35 48q5 2 10 0','#c08f6e',.7);
  if(role==='lighthouse')subject+=path('M29 41q3 13 11 13 8 0 11-13-4 8-11 7-6 1-11-7Z','#b5b0a0');
  if(occupation==='teacher'||occupation==='clerk'||role==='stationkeeper')subject+=`<g fill="none" stroke="#78674f" stroke-width=".8"><ellipse cx="34" cy="33" rx="4.3" ry="3.2"/><ellipse cx="46" cy="33" rx="4.3" ry="3.2"/><path d="M38 33h4m-12 0h-4m24 0h4"/></g>`;
  if(occupation==='watch'||role==='nightwatch')subject+=path('M23 25v-5q3-9 17-9 14 0 17 9v5Z','#516a75')+path('M22 23q18-5 36 0l-2 4q-17-3-33 0Z','#334d58')+circle(40,18,2.3,gold)+path('m27 59 4-1 4 1-1 6-3 2-3-2Z',gold);
  if(role==='roadworker'||occupation==='worker'&&role!=='firewarden')subject+=path('M24 24q1-14 16-14 15 0 16 14Z','#c7a15b')+line('M23 25h34','#997842',3)+line('M27 57v18m26-18v18','#dfc49b',3)+rect(31,65,18,11,'#b29470',2);
  if(occupation==='medic')subject+=path('M25 23v-9h30v9Z',light)+rect(39,14,2,6,'#b46f61')+rect(37,16,6,2,'#b46f61')+rect(20,61,13,12,light,2)+line('M26.5 63v8m-4-4h8','#b46f61',1.4);
  if(role==='courier'||occupation==='courier')subject+=line('M23 55 56 76','#b7986c',5)+rect(45,62,23,14,'#a68353',3)+envelope(56,64,.58);
  if(role==='firewarden')subject+=path('M31 55v20h20V55l-11 7Z','#d4b78d')+lamp(60,62,.47)+line('m17 62 10 5m-1-6-7 10','#be9371',4);
  else if(role==='lighthouse')subject+=path('M27 54 40 65 53 54l-6 1-7 5-7-5Z','#d6d9c4')+lamp(60,62,.5);
  else if(role==='nightwatch')subject+=circle(22,64,4,'#d7b567')+line('M22 68v7m0-4h4','#b28c4c',1.8);
  else if(role==='stationkeeper')subject+=rect(45,60,21,16,'#d5bd8d',1)+rect(47,62,17,11,light)+line('M50 65h11m-11 3h8','#9a927e',.8);
  else if(role==='roadworker')subject+=path('M13 67q8-3 17 0v9q-8-3-17 0Z',light,outline,1)+line('M21 67v8','#c3b590',1);
  else if(occupation==='sailor')subject+=line('M26 56 40 66 54 56','#d5d9c8',3)+circle(59,67,7,'#d4b580')+circle(59,67,4,coatColor);
  else if(occupation==='teacher')subject+=book(57,67,.5);
 }else if(kind==='animal'){
  backdrop+=rect(9,9,62,50,'#e3efdf',4)+circle(60,20,9,'#f1d797')+path('M7 59Q24 47 43 56t30 1v18H7Z','#b5c89d')+path('M7 67q31-8 66 0v8H7Z','#a3ba87');
  const brown=['#a17a57','#ba946d','#8e8a71','#b49476'][seed%4];
  const animalEye=(x,y)=>circle(x,y,1.5,'#493e2d');
  if(['bird','bat','butterfly','insect','spider','scorpion'].includes(f)){
   if(f==='bird')subject=ellipse(37,48,18,12,brown)+circle(53,34,10,brown)+path('m61 33 9 4-10 3Z',gold)+path('m24 45-14-6 8 15Z','#7a6955')+path('M26 43q15-9 22 10-17 5-22-10Z','#cfb690')+animalEye(56,32)+line('m34 59-2 10m13-10 1 10m-17 0h7m6 0h7','#6b604a',1.8)+line('M12 71h56','#9b8055',3);
   else if(f==='butterfly'||f==='bat')subject=path('M38 32Q16 13 12 29q-1 16 21 21-20-2-13 15 10 10 19-11m3-22q22-19 26-3 1 16-21 21 20-2 13 15-10 10-19-11Z',f==='bat'?'#8f8d79':['#d7a164','#b4aa71','#9bb9b2'][seed%3],outline,1)+ellipse(40,44,3,18,'#726a52')+line('m38 28-5-7m9 7 5-7',outline,1.2)+(f==='butterfly'?circle(23,35,4,'#ead6a2')+circle(57,35,4,'#ead6a2'):'');
   else subject=ellipse(40,44,9,13,f==='spider'?'#8b775a':'#a7966a')+circle(40,29,7,'#9e8b64')+line('M32 36 20 30l-8 8m20 7-17-1-5 8m23 2-14 9 1 8m28-35 12-6 8 8m-20 7 17-1 5 8m-23 2 14 9-1 8','#7e7157',1.5)+animalEye(37,28)+animalEye(43,28)+(f==='scorpion'?line('M43 55q20 14 18-4-1-8-7-8','#a7966a',4):'');
  }else if(['fish','octopus','crab','turtle','frog'].includes(f)){
   backdrop=rect(4,4,72,72,'#e3efea',6)+path('M6 48q17-7 34 0t34 0v27H6Z','#b4ced1')+line('M10 57h17m25 9h17m-33-7h10','#d7e7df',1.1);
   if(f==='fish')subject=ellipse(38,41,22,13,'#81a8ad')+path('m57 40 13-11v24l-13-9m-25-14 10-8 7 10Z','#a3bca6')+animalEye(24,38)+line('m26 45 4-1m6-13q7 10 0 20','#60848a',1.3);
   else if(f==='octopus')subject=ellipse(40,31,15,17,'#b4a28c')+line('M27 42Q13 46 17 61t-7 8m22-25q-10 8-6 21m12-19q-5 10-3 24m8-24q5 12 3 24m5-25q11 8 9 20m-4-23q16 4 13 17','#b4a28c',4)+animalEye(34,31)+animalEye(46,31);
   else if(f==='crab')subject=ellipse(40,44,18,11,'#c49370')+line('M25 44 15 39l-5-10m5 10 6-8m34 13 10-5 5-10m-5 10-6-8M26 51l-9 9m18-6-3 10m16-10 3 10m7-13 9 9','#af805b',3)+animalEye(34,39)+animalEye(46,39);
   else if(f==='frog')subject=ellipse(40,48,20,13,'#85a373')+ellipse(31,33,7,8,'#96b581')+ellipse(49,33,7,8,'#96b581')+ellipse(40,42,16,11,'#96b581')+animalEye(31,32)+animalEye(49,32)+line('M30 47q10 5 20 0','#617e53',1)+line('m23 52-10 9h12m32-9 10 9H55','#85a373',5);
   else subject=ellipse(37,45,22,17,'#889e70')+path('M18 47q19-31 39 0Z','#a4b884')+ellipse(62,46,8,6,'#a8ba87')+animalEye(65,44)+line('M26 39 37 31l12 9-12 12Zm11 13v10M19 56l-5 7m39-7 5 7','#6b815b',1.5);
  }else if(['snake','worm','slug','lizard','dragon'].includes(f)){
   subject=line('M16 62q-6-17 16-14 25 4 20-15-2-9-12-9','#91a578',9)+ellipse(37,24,11,7,'#a2b28b')+animalEye(32,22)+line('m28 27-4 1','#6e815a',1);
   if(f==='lizard'||f==='dragon')subject+=line('m35 49-8 9m18-11 9 9m-25-17-10-8m25-3 10-8','#81976a',3);
   if(f==='slug')subject+=line('M32 19 27 12m17 7 5-7','#91a578',2);
  }else{
   // Full-bodied animals, standing on a path rather than humanoid animal masks.
   subject+=ellipse(35,51,21,12,brown)+line('M21 55v14m12-13v13m13-13v13m10-15v15',brown,5)+path('M17 47Q7 35 12 27q-1 13 9 13Z',brown)+ellipse(54,35,12,13,brown)+ellipse(60,43,10,6,'#d6b892');
   if(['cat','dog','wolf','horse'].includes(f))subject+=path('m44 29-2-13 11 10m3-2 9-11-2 17Z',brown,outline,1);
   else subject+=ellipse(45,25,5,5,brown)+ellipse(62,25,5,5,brown);
   if(['bull','goat','deer'].includes(f))subject+=line('M46 26q-8-7-4-14m18 14q8-7 4-14','#b89f77',2.3);
   if(f==='elephant')subject+=ellipse(46,34,8,12,'#b6b3a0')+line('M63 39q12 16 3 23','#9d9f8d',7);
   if(f==='rat'||f==='monkey')subject+=ellipse(46,24,5,6,'#d5b297')+ellipse(62,24,5,6,'#d5b297');
   if(f==='hedgehog')subject+=path('m13 49 3-13 6 5 5-11 6 8 8-9 3 11 8-3 2 11Z','#8a795a');
   subject+=animalEye(57,32)+circle(66,42,2,'#63543f')+line('M59 47h6','#8b6d4f',.9);
  }
 }else{
  backdrop+=rect(9,9,62,48,'#e7ecdb',4)+circle(60,20,9,'#f1d69b')+rect(9,58,62,14,'#d1b996',2)+line('M10 61h60','#b9a783',1);
  if(f==='plant'||f==='mushroom'){
   if(f==='plant')subject=path('M27 53h27l-4 20H31Z','#bf9674')+line('M40 55V18','#819564',3)+path('M39 32Q18 34 22 18q18-1 17 14m2 9q22 0 19-17-19 0-19 17m-2 9Q17 51 23 37q15 0 16 13Z','#8eaa77');
   else subject=rect(24,38,7,31,'#dcc7a1',3)+rect(48,44,6,25,'#dcc7a1',3)+path('M12 39Q13 13 30 15q17 1 19 24Zm29 7q1-18 14-18 11 1 14 18Z','#ba8e6b')+circle(25,27,3,'#ead8b7')+circle(36,32,2,'#ead8b7');
  }else if(objectType==='lantern')subject=lamp(40,43,1.25);
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
 const frame=`<rect x="4.5" y="4.5" width="71" height="71" rx="5.5" fill="none" stroke="#b9ab88" stroke-width="1"/><path d="M12 72h56" fill="none" stroke="#d3c4a3" stroke-width=".8"/>`;
 const result=`<svg class="card-portrait dossier-portrait" data-portrait-kind="${portraitEscape(kind)}" data-portrait-role="${portraitEscape(role)}" viewBox="0 0 80 80" role="img" aria-label="${portraitEscape(label)}" style="color:${ink}">${backdrop}<g stroke-linecap="round" stroke-linejoin="round">${subject}</g>${frame}</svg>`;
 CARD_PORTRAIT_CACHE.set(key,result);return result;
}
