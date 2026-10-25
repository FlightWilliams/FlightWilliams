// Translation is a presentation layer: saved names, card instances and actions
// retain their original identifiers in both languages.
const LANGUAGE_STORAGE='mz_language_v1';
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
 'Boss先手':'Boss first','我方先手':'You first','魂魄':'Souls','樱花':'Sakura','鲜血':'Blood','黄金卢恩':'Golden Runes','灰':'Ash','投':'Equip','技':'Skill','输入姓名，或留空随机':'Name (optional)',
 '薪火牌':'Ember Cards','余灰':'Ash','金辉':'Gilded','稀':'R','余火万象':'Ember Archive',
 '魂Ⅰ':'DS I','魂Ⅱ':'DS II','魂Ⅲ':'DS III','血源':'Bloodborne','只狼':'Sekiro','法环':'Elden Ring',
 '黑暗之魂Ⅰ':'Dark Souls I','黑暗之魂Ⅱ':'Dark Souls II','黑暗之魂Ⅲ':'Dark Souls III','恶魔之魂':"Demon’s Souls",'血源诅咒':'Bloodborne','艾尔登法环':'Elden Ring','黄金树幽影':'Shadow of the Erdtree',
 '物理':'Physical','火':'Fire','雷':'Lightning','光':'Light','暗':'Dark','血':'Blood','魔':'Magic','冰':'Ice','毒':'Poison',
 '练习木偶':'Training Dummy','练习·亡者':'Practice Hollow','金色小蜘蛛':'Gilded Spiderling','金色余灰':'Gilded Ash','骨':'Bones',
 '新入场':'Newly played','可献祭':'Ready to sacrifice','中文':'中文'
});
const localeEscape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
// Full sentences use O(1) lookup. Only short fragments take part in matching.
const localeFragments=Object.keys(localeDictionary).filter(k=>k.length>1&&k.length<=110&&localeHan.test(k)&&!/[<>]|\$\{/.test(k)).sort((a,b)=>b.length-a.length);
const localeMatcher=new RegExp(localeFragments.map(localeEscape).join('|'),'g');
const localeTemplates=Object.entries(localeDictionary).filter(([key])=>key.includes('${')).map(([source,target])=>{
 const parameters=[],pieces=source.split(/(\$\{[^}]+\})/g);
 const pattern=pieces.map(piece=>{if(piece.startsWith('${')){parameters.push(piece);return '(.+?)'}return localeEscape(piece)}).join('');
 return {match:new RegExp('^'+pattern+'$'),parameters,target};
});
function englishCardName(card){return I18N_CARDS[typeof card==='string'?card:card?.n]?.name||(typeof card==='string'?card:card?.n)||''}
function displayedCardName(card){return gameLanguage==='en'?englishCardName(card):card?.n||card||''}
function i18nNameLimit(){return gameLanguage==='en'?20:5}
function i18nText(source){
 if(gameLanguage!=='en'||!source||!localeHan.test(source))return source;
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
   [/^(.+)余灰$/,(_,n)=>`${T(n)}’s Ash`],
   [/^第\s*(\d+)\s*\/\s*(\d+)\s*回合$/,(_,n,max)=>`Round ${n} / ${max}`],
   [/^第\s*(\d+)\s*回合(.*)$/,(_,n,rest)=>`Round ${n}${T(rest)}`],
   [/^第(\d+)轮 · (.+) · 关间回复(\d+)点薪火$/,(_,r,g,h)=>`Cycle ${r} · ${T(g)} · Restore ${h} life between battles`],
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
function languageToggleHTML(){const next=gameLanguage==='en'?'zh-CN':'en';return `<button type="button" class="language-toggle" data-language="${next}" data-i18n-control aria-label="${next==='en'?'Switch to English':'切换中文'}"><span class="language-label-full">${next==='en'?'English':'中文'}</span><span class="language-label-short" aria-hidden="true">${next==='en'?'EN':'中'}</span></button>`}
function languageSwitchHTML(){return `<nav class="language-switch" aria-label="Language" data-i18n-control><button type="button" data-language="zh-CN" lang="zh-CN" aria-pressed="${gameLanguage==='zh-CN'}">中文</button><button type="button" data-language="en" lang="en" aria-pressed="${gameLanguage==='en'}">English</button></nav>`}
function localizeTextNode(node){
 if(gameLanguage==='en'&&node.parentElement?.hasAttribute('data-game-short')){const short={ds1:'DS I',ds2:'DS II',ds3:'DS III',bb:'BB',sekiro:'Sekiro',er:'ER'}[node.parentElement.dataset.gameShort];if(short&&node.nodeValue!==short)node.nodeValue=short;return}
 if(!node.parentElement||node.parentElement.closest('[data-i18n-control],script,style,textarea,.player-name'))return;
 if(gameLanguage==='en'&&node.parentElement.matches('.card .at')){const mark={物:'P',火:'F',雷:'L',光:'H',暗:'D',血:'B',魔:'M',冰:'I',毒:'T'}[node.nodeValue];if(mark)node.nodeValue=mark;return}
 const previous=localeNodeSource.get(node),current=node.nodeValue;
 const source=previous&&current===previous.translated?previous.source:current;
 const translated=gameLanguage==='en'?i18nText(source):source;
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
  const translated=gameLanguage==='en'?i18nText(source):source;attributes[key]={source,translated};if(current!==translated)node.setAttribute(key,translated);
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
 localeTextCache.clear();document.documentElement.lang=language;document.title=language==='en'?'Ember Cards · Will Wang':'薪火牌';
 render();if(draft!=null&&document.getElementById('nm'))document.getElementById('nm').value=draft;
 localizeRoot(document.body);scheduleLocaleLayout();
}
const renderBeforeLocalization=render;
render=function(){renderBeforeLocalization();localizeRoot(document.getElementById('app'));scheduleLocaleLayout()};
const selectionBeforeLocalization=renderSelection;
renderSelection=function(){selectionBeforeLocalization();for(const selector of ['.interaction-bar','.sidebar-inspection','.tutorial-layer'])localizeRoot(document.querySelector(selector));scheduleLocaleLayout()};
const searchBeforeLocalization=cardSearchText;
const SEARCH_SKILLS_EN={fly:'flying flight airborne',guard:'guard shield defender',thorn:'thorn thorns reflect',poison:'poison venom',parry:'parry counter',regen:'regeneration regen',vamp:'vampire lifesteal drain',bones:'bones skeleton bone',abyss:'freeze freezing discount'};
const SEARCH_ATTRIBUTES_EN={物理:'physical',火:'fire flame',雷:'lightning thunder',光:'light holy',暗:'dark shadow',血:'blood',魔:'magic arcane',冰:'ice frost',毒:'poison venom'};
function englishSearchTerms(card){return [card.n==='余灰'&&'ash resource fodder sacrifice',card.n==='骨'&&'bones skeleton',SEARCH_SKILLS_EN[card.s],SEARCH_ATTRIBUTES_EN[card.at],card.growth&&'growth kill',card.death&&'deathrattle death summon',card.dr&&'draw entry draw cards',card.dd&&'draw death draw cards',card.heal&&'heal healing restore',card.mv==='shift'&&'move movement shift',card.mv==='swap'&&'move movement swap switch',card.mv==='push'&&'move movement push knockback',card.x==='soul'&&'soul growth kill',card.x==='ember'&&'heal healing kindle',card.x==='rekindle'&&'revive rebirth return resurrection',card.rarity==='rare'&&'rare gilded golden',card.kind].filter(Boolean).join(' ')}
cardSearchText=function(card){const english=I18N_CARDS[card.n],base=I18N_CARDS[card.baseName];return [searchBeforeLocalization(card),english?.name,english?.lore,base?.name,englishSearchTerms(card)].filter(Boolean).join(' ')};
document.addEventListener('click',event=>{const button=event.target.closest('[data-language]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();setGameLanguage(button.dataset.language)},true);
const localeObserver=new MutationObserver(records=>{
 if(gameLanguage!=='en')return;
 const roots=new Set();for(const record of records){if(record.type==='childList')for(const node of record.addedNodes)roots.add(node);else roots.add(record.target)}
 for(const root of roots)localizeRoot(root);
});
localeObserver.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['title','aria-label','placeholder','alt','data-tip']});
document.documentElement.lang=gameLanguage;document.title=gameLanguage==='en'?'Ember Cards · Will Wang':'薪火牌';
