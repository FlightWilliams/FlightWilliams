// Testimony and echoes belong to this original case-file setting.
const BOSS_DIALOGUE=__DATA_BOSS_DIALOGUE__;
function bossFarewellText(st){const row=BOSS_DIALOGUE[st?.boss];return (gameLanguage==='en'?row?.farewellEn:row?.farewell)||(gameLanguage==='en'?'The recording ends before the witness finishes.':'证人还没有说完，录音已经结束。')}
function recordBossFarewell(card=null,reason='victory'){
 if(!G||G.tutorial||!G.st||G.bossFarewell)return false;
 if(reason!=='victory'&&(reason!=='combat'||card?.n!==G.st.boss))return false;
 G.bossFarewell=bossFarewellText(G.st);logBattle(`${G.st.boss}：“${G.bossFarewell}”`);return true;
}
function bossFarewellHTML(){
 if(!G||G.tutorial||!G.st)return '';const text=bossFarewellText(G.st);
 return `<blockquote class="boss-farewell" aria-label="Boss战败台词"><p>“${esc(text)}”</p><footer>${esc(G.st.boss)}<span> · 问询记录</span></footer></blockquote>`;
}
function bossDeathEchoText(st){const row=BOSS_DIALOGUE[st?.boss];return (gameLanguage==='en'?row?.echoEn:row?.echo)||(gameLanguage==='en'?'Your statement is already signed. The date is tomorrow.':'你的证词已经签好了。日期是明天。')}
function recordPlayerDeathEcho(){
 if(!G||G.tutorial||!G.st||G.deathEcho)return false;
 const text=bossDeathEchoText(G.st);G.deathEcho={boss:G.st.boss,text};
 logBattle(`${G.st.boss}的死亡回响：“${text}”`);if(G.dc)G.dc.lore=`${pname}在${G.st.n}留下的案卷记录。${text}`;return true;
}
function playerDeathEchoHTML(){
 if(!G||G.tutorial)return '';const echo=G.deathEcho||{boss:G.st?.boss};const testimony=bossDeathEchoText({boss:echo.boss});
 return `<blockquote class="player-death-echo" aria-label="败北回响"><p>“${esc(testimony)}”</p><footer>${esc(echo.boss)}<span> · 档案附注</span></footer></blockquote>`;
}
