// Character dialogue belongs to the lamp-pact setting.
const BOSS_DIALOGUE=__DATA_BOSS_DIALOGUE__;
function bossFarewellText(st){return BOSS_DIALOGUE[st?.boss]?.farewell||'这一轮灯局归你，长夜却还没有签字。'}
function recordBossFarewell(card=null,reason='victory'){
 if(!G||G.tutorial||!G.st||G.bossFarewell)return false;
 if(reason!=='victory'&&(reason!=='combat'||card?.n!==G.st.boss))return false;
 G.bossFarewell=bossFarewellText(G.st);logBattle(`${G.st.boss}：“${G.bossFarewell}”`);return true;
}
function bossFarewellHTML(){
 if(!G||G.tutorial||!G.st)return '';const text=G.bossFarewell||bossFarewellText(G.st);
 return `<blockquote class="boss-farewell" aria-label="Boss战败台词"><p>“${esc(text)}”</p><footer>${esc(G.st.boss)}<span> · 败者的余音</span></footer></blockquote>`;
}
function bossDeathEchoText(st){return BOSS_DIALOGUE[st?.boss]?.echo||'把这次失手记在灯契背面，下次别再把退路一起献掉。'}
function recordPlayerDeathEcho(){
 if(!G||G.tutorial||!G.st||G.deathEcho)return false;
 const text=bossDeathEchoText(G.st);G.deathEcho={boss:G.st.boss,text};
 logBattle(`${G.st.boss}的死亡回响：“${text}”`);if(G.dc)G.dc.lore=`${pname}在${G.st.n}留下的灯契。${text}`;return true;
}
function playerDeathEchoHTML(){
 if(!G||G.tutorial)return '';const echo=G.deathEcho||{boss:G.st?.boss,text:bossDeathEchoText(G.st)};
 return `<blockquote class="player-death-echo" aria-label="败北回响"><p>“${esc(echo.text)}”</p><footer>${esc(echo.boss)}<span> · 留给行灯者的话</span></footer></blockquote>`;
}
