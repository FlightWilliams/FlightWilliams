// Public names are independent of the stable card identifiers used by saves.
const CARD_DISPLAY_NAMES=__DATA_CARD_NAMES__;
const TOKEN_DISPLAY_NAMES={
 '鎏金灯蛛':{zh:'灯蛛',en:'Wick Spider'},
 '鎏金余芯':{zh:'余芯',en:'Wick'}
};
const CARD_STORIES=__DATA_CARD_STORIES__;
const LOOP_STORY=__DATA_LOOP_STORY__;
const STORY_CAST=__DATA_STORY_CAST__;
const STORY_CORE_IDS=new Set(STORY_CAST.core);
function storyChapterLeads(world=difficulty){return STORY_CAST.chapters[world]||[]}
const COMPANION_DIALOGUE=__DATA_COMPANION_DIALOGUE__;
const BOSS_ENTRANCES=__DATA_BOSS_ENTRANCES__;
const BOSS_IDENTITIES=__DATA_BOSS_IDENTITIES__;
const BOSS_ABILITY_LEGACY=__DATA_BOSS_ABILITY_LEGACY__;
const STORY_BOSS_ABILITIES=new Map(BOSS_ABILITIES.map(ability=>[ability.boss,ability]));
const STORY_BOSSES=new Set(Object.values(CAMPAIGNS).flat().map(st=>st.boss));
const STORY_STORAGE='lo_story_v1';
const STORY={version:1,friends:{},seen:{},pendingFriend:null};
const storyIdentityLabels=new Map();
try{const saved=JSON.parse(localStorage.getItem(STORY_STORAGE)||'null');if(saved?.version===1){if(saved.friends&&typeof saved.friends==='object'&&!Array.isArray(saved.friends))STORY.friends=saved.friends;if(saved.seen&&typeof saved.seen==='object'&&!Array.isArray(saved.seen))STORY.seen=saved.seen;if(saved.pendingFriend?.boss)STORY.pendingFriend=saved.pendingFriend}}catch{}
if(STORY.pendingFriend&&!STORY_CORE_IDS.has(STORY.pendingFriend.boss))STORY.pendingFriend=null;
function saveStory(){try{localStorage.setItem(STORY_STORAGE,JSON.stringify(STORY));return true}catch{return false}}
function shortCardName(card,language=gameLanguage){
 const id=typeof card==='string'?card:card?.n,entry=CARD_DISPLAY_NAMES[id]||TOKEN_DISPLAY_NAMES[id];if(entry)return entry[language==='en'?'en':'zh'];
 const identity=typeof id==='string'?id.match(/^(.+)·死亡遗骸·第(\d+)轮$/):null;
 if(identity){const labels={zh:`${identity[1].slice(0,2)}·遗影${identity[2]}`,en:`${identity[1].slice(0,10)}'s Echo ${identity[2]}`};storyIdentityLabels.set(id,labels);return labels[language==='en'?'en':'zh']}
 return id||'';
}
function cardNarrative(card){return CARD_STORIES[card?.n]?.zh||card?.lore||''}
function bossIdentityForCard(card){return BOSS_IDENTITIES[typeof card==='string'?card:card?.baseName||card?.n]||null}
function bossRoleText(card,language=gameLanguage){const identity=bossIdentityForCard(card);return identity?.[language==='en'?'roleEn':'roleZh']||''}
function bossFlavorText(ability,language=gameLanguage){return ability?.[language==='en'?'flavorEn':'flavor']||''}
function bossOwnedRuleText(ability){return gameLanguage==='en'?i18nText(ability.description).replace(/\bthe player's\b/gi,"the opponent's").replace(/\bthe player\b/gi,'the opponent').replace(/\bthe Boss\b/gi,'you'):ability.description.replace(/玩家/g,'对手').replace(/Boss/g,'我方').replace(/敌方/g,'对方')}
function storyText(path,params={},language=gameLanguage){
 let value=LOOP_STORY;for(const part of path.split('.'))value=value?.[part];
 if(value&&typeof value==='object')value=value[language==='en'?'en':'zh'];
 return typeof value==='string'?value.replace(/\{(\w+)\}/g,(all,key)=>params[key]??all):'';
}
function storyCopy(group,key,params={}){const data=LOOP_STORY[group]?.[gameLanguage==='en'?'en':'zh'];return (data?.[key]||'').replace(/\{(\w+)\}/g,(all,name)=>params[name]??all)}
function storyChapter(world=difficulty,part='intro'){
 const chapter=LOOP_STORY.chapters[world];return chapter?.[part]?.[gameLanguage==='en'?'en':'zh']||{title:'',text:''};
}
function storyWorldName(world=difficulty){return storyText(`chapters.${world}.name`)}
function storyParagraphs(text){return text.split('\n').map(p=>`<p>${esc(p)}</p>`).join('')}
function storeJourney(){try{localStorage.setItem(JOURNEY_STORAGE,JSON.stringify({version:3,cleared:journey.cleared,unlocked:journey.unlocked,loops:journey.loops}));return true}catch{return false}}
function beginNextStoryLoop(){
 if(journey.cleared!==DIFFICULTY_ORDER.length||G?.replay||G?.tutorial||OV==='win'&&!G?.rewardClaimed)return false;
 // The protagonist loses their recollection, not the player's earned progress.
 // Claim the final choice before carrying the same lantern into another night.
 if(G&&OV==='clear'&&typeof savePlayerDeck==='function')savePlayerDeck();
 const completed=Number.isSafeInteger(journey.loops)&&journey.loops>=0?journey.loops:0;
 if(completed>=Number.MAX_SAFE_INTEGER)return false;
 const next={cleared:0,unlocked:DIFFICULTY_ORDER.length,loops:completed+1};
 try{localStorage.setItem(JOURNEY_STORAGE,JSON.stringify({version:3,...next}))}catch{return false}
 Object.assign(journey,next);STORY.pendingFriend=null;saveStory();return true;
}
function storyBossIdentity(card){
 const id=typeof card==='string'?card:card?.baseName||card?.n;
 return STORY_CORE_IDS.has(id)?id:null;
}
function recordStoryCompanion(card){
 if(!card||G?.tutorial||G?.replay)return false;const boss=storyBossIdentity(card);if(!boss)return false;
 const repeat=!!STORY.friends[boss];if(!repeat)STORY.friends[boss]={firstLoop:journey.loops||0};
 STORY.pendingFriend={boss,repeat,gold:card.rarity==='rare'};saveStory();return true;
}
function storyCompanionText(){
 const pending=STORY.pendingFriend;if(!pending||!STORY_CORE_IDS.has(pending.boss))return '';
 const own=COMPANION_DIALOGUE[pending.boss],line=own?.[gameLanguage==='en'?'joinEn':'join'];
 if(line&&!pending.repeat)return `${shortCardName(pending.boss)}${gameLanguage==='en'?': ':'：'}${line}`;
 return storyCopy('companions',pending.repeat?'recruitAgain':pending.gold?'recruitGold':'recruit',{boss:shortCardName(pending.boss)});
}
let storyToastKey=null,storyToastTimer=null;
function renderStoryToast(){
 const pending=STORY.pendingFriend,node=document.getElementById('story-companion-toast');
 if(!pending||!STORY_CORE_IDS.has(pending.boss)){node?.remove();storyToastKey=null;clearTimeout(storyToastTimer);return}
 if(OV!==null||infoPanel||DM||HOLD_DETAIL||G?.busy){node?.remove();storyToastKey=null;clearTimeout(storyToastTimer);return}
 const key=JSON.stringify(pending);let toast=node;
 if(!toast){toast=document.createElement('aside');toast.id='story-companion-toast';toast.className='story-companion-toast';toast.setAttribute('role','status');document.body.appendChild(toast)}
 toast.innerHTML=`<button data-story-dismiss aria-label="${gameLanguage==='en'?'Close':'关闭'}">×</button><small>${esc(storyCopy('companions','rewardTitle'))}</small><p>${esc(storyCompanionText())}</p>`;
 if(key===storyToastKey)return;storyToastKey=key;clearTimeout(storyToastTimer);
 storyToastTimer=setTimeout(()=>{if(STORY.pendingFriend&&JSON.stringify(STORY.pendingFriend)===key){STORY.pendingFriend=null;saveStory();renderStoryToast()}},9000);
}
function storyJournalButton(){return `<button type="button" data-story-journal>${gameLanguage==='en'?'Case Notes':'调查手记'}</button>`}
function bossEntranceCopy(boss=G?.st?.boss){return BOSS_ENTRANCES[boss]?.[gameLanguage==='en'?'en':'zh']||null}
function bossEntranceHTML(){
 const copy=bossEntranceCopy(),pending=!!G?.entrancePending,boss=G?.st?.boss;
 if(!copy)return '';
 const en=gameLanguage==='en',speaker=storyBossIdentity(BOSS_ENTRANCES[boss]?.speaker)||boss;
 return `<div class="drawer-backdrop"><div class="drawer-scrim" aria-hidden="true"></div><section class="info-drawer story-drawer boss-entrance" role="dialog" aria-modal="true" aria-labelledby="entrance-title"><header class="drawer-head"><div><small>${esc(storyWorldName())} · ${en?'Encounter':'第'} ${G.lv}${en?'':'关'}</small><h2 id="entrance-title">${esc(shortCardName(speaker))} · ${esc(copy.title)}</h2></div><button class="pri" data-boss-entrance="${pending?'begin':'close'}">${en?(pending?'Play':'Close'):(pending?'开始对局':'返回牌桌')}</button></header><div class="drawer-scroll"><p class="entrance-role">${en?'Case progress':'调查进展'}</p>${storyParagraphs(copy.text)}<p class="story-note">${en?(pending?'The cards are still untouched. Start when you are ready.':'Reading this scene does not change the match.'):(pending?'牌还没有发下。准备好后，开始对局。':'重读出场不会改变当前对局。')}</p></div><footer class="entrance-actions">${languageToggleHTML()}${pending?`<button data-boss-entrance="skip">${en?'Skip scene':'跳过出场'}</button><button data-boss-entrance="home">${en?'Home':'返回主页'}</button>`:`<button data-boss-entrance="close">${en?'Return to the table':'返回牌桌'}</button>`}</footer></section></div>`;
}
async function beginBossEncounter(){
 const game=G;if(!game?.entrancePending||game.busy||drawRunning)return false;
 game.entrancePending=false;game.busy=1;game.phase='opening';infoPanel=null;render();
 await dealBattleOpening(game);showCampaignChapter(game);return G===game;
}
function showCampaignChapter(game){
 if(G!==game||!G||G.tutorial||G.replay||OV||G.lv!==1||G.busy||G.phase!=='player-deploy')return;
 const key=`case-0317:${journey.loops||0}:${difficulty}`;if(STORY.seen[key])return;STORY.seen[key]=true;saveStory();infoPanel='story';render();
}
function storyJournalHTML(){
 const world=G?.st?.games?.[0]||difficulty||activeDifficulty(),chapter=storyChapter(world),opening=LOOP_STORY.opening[gameLanguage==='en'?'en':'zh'];
 const returned=world==='mire'&&(journey.loops||0)>0,title=returned?storyCopy('loop','returnTitle'):chapter.title;
 const text=returned?storyCopy('loop','returnText'):chapter.text;
 const friends=Object.keys(STORY.friends).filter(id=>STORY_CORE_IDS.has(id)&&CARD_DISPLAY_NAMES[id]),heading=gameLanguage==='en'?'Witnesses Travelling With You':'同行证人';
 return `<div class="drawer-backdrop"><button class="drawer-scrim" data-a="closepanel" aria-label="${gameLanguage==='en'?'Close story':'关闭手记'}"></button><section class="info-drawer story-drawer" role="dialog" aria-modal="true" aria-labelledby="story-title"><div class="drawer-head"><div><small>${esc(storyCopy('loop','countLabel',{loop:(journey.loops||0)+1}))} · ${esc(storyWorldName(world))}</small><h2 id="story-title">${esc(title)}</h2></div><button data-a="closepanel">${gameLanguage==='en'?'Continue':'继续前行'}</button></div><div class="drawer-scroll">${world==='mire'&&!(journey.loops||0)?`<h3>${esc(opening.title)}</h3>${storyParagraphs(opening.text)}`:''}${storyParagraphs(text)}${G&&bossEntranceCopy()?`<button data-boss-entrance="read">${gameLanguage==='en'?'Read Boss entrance':'重看Boss出场'}</button>`:''}<h3>${heading}</h3><p>${esc(friends.length?friends.map(id=>shortCardName(id)).join(' · '):storyCopy('companions','rewardText'))}</p><p class="story-note">${esc(storyCopy('companions','selectionHint'))}</p></div></section></div>`;
}
function storyClearHTML(){
 const last=difficulty===DIFFICULTY_ORDER[DIFFICULTY_ORDER.length-1],chapter=storyChapter(difficulty,'clear'),next=DIFFICULTY_ORDER[DIFFICULTY_ORDER.indexOf(difficulty)+1];
 return `<div class="ov modal-screen journey-clear story-clear"><div class="title-mark">✦</div><span class="modal-kicker">${esc(storyCopy('loop','countLabel',{loop:(journey.loops||0)+1}))}</span><h1>${esc(chapter.title)}</h1><div class="story-prose">${storyParagraphs(chapter.text)}</div>${STORY.pendingFriend?`<blockquote class="story-clear-companion">${esc(storyCompanionText())}</blockquote>`:''}${identityCampaignHTML()}<p class="story-note">${esc(last?storyCopy('loop','notice'):(gameLanguage==='en'?`Next site: ${storyWorldName(next)}. Your deck and witnesses stay with you.`:`下一处：${storyWorldName(next)}。带上当前牌组与同行证人继续调查。`))}</p><button class="pri" data-a="nextdifficulty">${esc(last?storyCopy('loop','button'):(gameLanguage==='en'?`Travel to ${storyWorldName(next)}`:`前往${storyWorldName(next)}`))}</button><button data-a="title">${gameLanguage==='en'?'Return to the Duty Room':'返回值班室'}</button></div>`;
}
// The text layer covers cards, HUD names, tooltips, logs and old saved flavour.
const storyNameDictionary={};
for(const [id,label]of Object.entries(CARD_DISPLAY_NAMES)){
 storyNameDictionary[id]=label.zh;I18N_CARDS[id]={...(I18N_CARDS[id]||{}),name:label.en,lore:CARD_STORIES[id]?.en||I18N_CARDS[id]?.lore||''};
 I18N_STRINGS[label.zh]=label.en;
 const oldLore=POOL.find(c=>c.n===id)?.lore,story=CARD_STORIES[id];
 if(story){if(oldLore)I18N_STRINGS[oldLore]=story.en;I18N_STRINGS[story.zh]=story.en}
}
for(const [id,label]of Object.entries(TOKEN_DISPLAY_NAMES)){storyNameDictionary[id]=label.zh;I18N_STRINGS[id]=label.en;I18N_STRINGS[label.zh]=label.en}
for(const world of Object.keys(LOOP_STORY.chapters)){
 const label=LOOP_STORY.chapters[world].name;I18N_STRINGS[GAME_META[world][0]]=label.en;I18N_STRINGS[label.zh]=label.en;storyNameDictionary[GAME_META[world][0]]=label.zh;
}
const HORROR_UI_ALIASES={
 '继续调查':{zh:'继续调查',en:'Continue the Investigation'},'问询记录':{zh:'问询记录',en:'Interview Record'},'档案附注':{zh:'档案附注',en:'File Note'},'案卷记录':{zh:'案卷记录',en:'Case Record'},
 '行灯者姓名':{zh:'调查者姓名',en:'Investigator’s Name'},'燃烧的剑与灯台':{zh:'值班室的守夜灯',en:'The duty room night lamp'},
 '旅途手记':{zh:'调查手记',en:'Case Notes'},'灯台手册':{zh:'调查手册',en:'Field Manual'},'回到灯台':{zh:'返回值班室',en:'Return to the Duty Room'},'灯台':{zh:'值班室',en:'Duty Room'},'不灭灯台':{zh:'守夜灯',en:'Night Lamp'},
 '轮回礼赞':{zh:'封存记录',en:'Sealed Record'},'灯火仍在燃烧':{zh:'问询结束',en:'Interview Closed'},'鎏金降临 · 稀有奖励':{zh:'鎏金档案 · 稀有发现',en:'Gilded File · Rare Discovery'},
 '游辉':{zh:'余光',en:'Afterlight'},'霜瓣':{zh:'白痕',en:'Pale Marks'},'潮露':{zh:'潮印',en:'Tide Marks'},'七芒星辉':{zh:'星痕',en:'Star Marks'},
 '砂镜地窟':{zh:'档案室',en:'Archive Room'},'折光边境':{zh:'负片室',en:'Negative Room'}
};
for(const [source,label]of Object.entries(HORROR_UI_ALIASES)){storyNameDictionary[source]=label.zh;I18N_STRINGS[source]=label.en;I18N_STRINGS[label.zh]=label.en}
for(const row of Object.values(BOSS_DIALOGUE)){I18N_STRINGS[row.farewell]=row.farewellEn;I18N_STRINGS[row.echo]=row.echoEn}
for(const identity of Object.values(BOSS_IDENTITIES))I18N_STRINGS[identity.roleZh]=identity.roleEn;
for(const ability of BOSS_ABILITIES){I18N_STRINGS[ability.name]=ability.nameEn;if(ability.flavor)I18N_STRINGS[ability.flavor]=ability.flavorEn}
for(const deck of Object.values(BOSS_DECKS)){if(deck.themeEn)I18N_STRINGS[deck.theme]=deck.themeEn;if(deck.planEn)I18N_STRINGS[deck.plan]=deck.planEn}
for(const [oldName,boss]of Object.entries(BOSS_ABILITY_LEGACY)){const ability=STORY_BOSS_ABILITIES.get(boss);if(ability){storyNameDictionary[oldName]=ability.name;I18N_STRINGS[oldName]=ability.nameEn}}
const storyNameKeys=Object.keys(storyNameDictionary).filter(id=>id!==storyNameDictionary[id]).sort((a,b)=>b.length-a.length);
const storyNameMatcher=new RegExp(storyNameKeys.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),'g');
function storyChineseText(text){if(typeof text!=='string')return text;let output=text.replace(storyNameMatcher,id=>storyNameDictionary[id]);for(const [id,labels]of storyIdentityLabels)output=output.split(id).join(labels.zh);return output}
const drawerBeforeStory=drawerHTML;drawerHTML=function(){return infoPanel==='entrance'||infoPanel==='entrance-read'?bossEntranceHTML():infoPanel==='story'?storyJournalHTML():drawerBeforeStory()};
const renderBeforeStory=render;render=function(){renderBeforeStory();renderStoryToast()};
const battleBeforeStory=battle;
battle=async function(){
 const game=G;await battleBeforeStory();showCampaignChapter(game);
};
document.addEventListener('click',event=>{
 const entrance=event.target.closest('[data-boss-entrance]')?.dataset.bossEntrance;
 if(entrance){event.preventDefault();if(entrance==='begin'||entrance==='skip')beginBossEncounter();else if(entrance==='home')returnToHomepage();else if(entrance==='read'&&bossEntranceCopy()&&!G?.busy&&!drawRunning){infoPanel='entrance-read';render()}else if(entrance==='close'&&!G?.entrancePending){infoPanel=null;render()}return}
 if(event.target.closest('[data-story-dismiss]')){event.preventDefault();STORY.pendingFriend=null;saveStory();renderStoryToast();return}
 if(!event.target.closest('[data-story-journal]'))return;event.preventDefault();if(G?.busy||drawRunning)return;infoPanel='story';render();
});
