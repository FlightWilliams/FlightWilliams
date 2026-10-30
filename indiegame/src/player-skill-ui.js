// The equipment chooser closes after selection; an equipped skill has a compact effect hint.
let playerSkillUICloseTimer=0,playerSkillUISuppressHoverUntil=0;
function playerSkillUIText(zh,en){return typeof gameLanguage!=='undefined'&&gameLanguage==='en'?en:zh}
function playerSkillUITranslate(text){return typeof i18nText==='function'?i18nText(text):text}
function playerSkillUIWickName(){return typeof bossSkillWickIndex==='function'?playerSkillUIText('余芯','Wick'):playerSkillUIText('余灰','Ash')}
function playerSkillUIHasWick(){return (typeof bossSkillWickIndex==='function'?bossSkillWickIndex('p'):bossSkillAshIndex('p'))>=0}
function playerSkillUIAbilityName(ability){return ability?(typeof gameLanguage!=='undefined'&&gameLanguage==='en'&&ability.nameEn?ability.nameEn:playerSkillUITranslate(ability.name)):''}
function playerSkillUICardName(card){return typeof displayedCardName==='function'?displayedCardName(card):card?.n||''}
function playerSkillUIOwnedCopy(text){
 const translated=playerSkillUITranslate(text||'');
 if(typeof gameLanguage!=='undefined'&&gameLanguage==='en')return translated.replace(/\bthe player's\b/gi,"the opponent's").replace(/\bthe player\b/gi,'the opponent').replace(/\bthe Boss's\b/gi,'your').replace(/\bBoss's\b/gi,'your').replace(/\bthe Boss\b/gi,'you').replace(/\bBoss\b/g,'you');
 return translated.replace(/玩家/g,'对手').replace(/Boss/g,'我方').replace(/敌方/g,'对方');
}
function playerSkillUIEffect(ability){return typeof bossOwnedRuleText==='function'?bossOwnedRuleText(ability):playerSkillUIOwnedCopy(ability.description)}
function playerSkillUIStatus(){
 const state=playerBossSkillState();
 if(!G||G.tutorial)return playerSkillUIText('Boss卡上场后可装备','Deploy a Boss card to equip its skill');
 if(G.turn<2)return playerSkillUIText('第2回合启用','Available from round 2');
 if(state?.armed)return playerSkillUIText('已准备，等待攻击结束','Prepared; waiting for attacks to finish');
 if(state?.turnUsed===G.turn)return playerSkillUIText('本回合已发动','Already activated this round');
 if(!bossSkillReady(state))return playerSkillUIText('冷却中，本回合休息','Cooling down; rest this round');
 if(state?.source&&!playerSkillUIHasWick())return playerSkillUIText('缺少1张未冻结的手牌','Need 1 unfrozen hand card: ')+playerSkillUIWickName();
 if(G.mustDraw)return playerSkillUIText('请先完成本回合抽牌','Finish drawing for this round first');
 if(G.freezeChoice)return playerSkillUIText('请先完成冻结选择','Finish choosing the frozen card first');
 if(G.busy||G.phase!=='player-deploy')return playerSkillUIText('请等到自己的部署阶段','Wait for your deployment phase');
 if(state?.source)return playerSkillUIText('可以发动','Ready to activate');
 return playerBossSkillOptions().length?playerSkillUIText('选择一张场上的Boss卡','Choose a deployed Boss card'):playerSkillUIText('需要Boss卡在场','A Boss card must be on your board');
}
function playerBossSkillButtonHTML(){
 if(!G)return '';
 const ability=G.tutorial?null:playerBossSkillEquippedAbility(),label=ability?playerSkillUIText('发动战技','Activate Skill'):playerSkillUIText('装备战技','Equip Skill'),status=playerSkillUIStatus();
 const accessible=label+(ability?' · '+playerSkillUIAbilityName(ability):'')+' · '+status;
 return `<button type="button" class="player-boss-skill-trigger" data-player-boss-skill="open" data-skill-equipped="${!!ability}" aria-haspopup="dialog" aria-expanded="${!!PLAYER_BOSS_SKILL_UI}" aria-controls="player-boss-skill-panel" aria-label="${esc(accessible)}" ${G.tutorial?'disabled':''}><span class="player-skill-icon" aria-hidden="true">◇</span><span class="player-boss-skill-label">${esc(label)}</span><small>${esc(status)}</small></button>`;
}
function playerBossSkillDescription(ability){
 if(!ability)return '';
 const wick=playerSkillUIWickName(),extra=playerSkillUIOwnedCopy(ability.costText||playerSkillUIText('其余代价与对应Boss技能相同。','Other costs match this Boss skill.'));
 const timing=ability.timing==='after_attack'?playerSkillUIText('先准备；本回合攻击结束时，满足条件才支付并发动。','Prepare now; after this round’s attacks, pay and activate if conditions are met.'):playerSkillUIText('在自己的部署阶段发动。','Activate during your deployment phase.');
 const cost=playerSkillUIText(`1张未冻结的手牌${wick}；${extra}`,`1 unfrozen ${wick} from your hand. ${extra}`);
 return `<div class="player-skill-effect-copy"><p class="player-skill-effect-text">${esc(playerSkillUIEffect(ability))}</p><dl><div><dt>${playerSkillUIText('时机','Timing')}</dt><dd>${esc(timing)}</dd></div><div><dt>${playerSkillUIText('代价','Cost')}</dt><dd>${esc(cost)}</dd></div><div><dt>${playerSkillUIText('冷却','Cooldown')}</dt><dd>${playerSkillUIText('成功后下回合冷却，再下一回合可用；换装不重置。','Rest the next round after activation; ready the round after. Changing skills does not reset cooldown.')}</dd></div></dl></div>`;
}
function playerBossSkillPanelHTML(){
 const state=playerBossSkillState(),ability=playerBossSkillEquippedAbility(),options=playerBossSkillOptions(),mode=PLAYER_BOSS_SKILL_UI?.mode||(!ability?'equip':'effect'),canAct=playerBossSkillCanAct();
 const head=title=>`<header><div><small>${playerSkillUIText('我方战技','Your combat skill')}</small><h2 id="player-boss-skill-title">${esc(title)}</h2></div><button type="button" data-player-boss-skill="close" aria-label="${playerSkillUIText('关闭战技说明','Close skill details')}">${playerSkillUIText('关闭','Close')} ×</button></header>`;
 if(mode==='effect'&&ability){
  const usable=canAct&&bossSkillReady(state)&&playerSkillUIHasWick()&&!state.armed,changeable=canAct&&state.equipTurn!==G.turn&&options.some(x=>x.card!==state.source);
  return head(playerSkillUIAbilityName(ability))+`<div class="player-boss-skill-scroll"><p class="player-skill-source">${esc(playerSkillUICardName(state.source))}</p>${playerBossSkillDescription(ability)}<p class="player-skill-status" role="status">${esc(PLAYER_BOSS_SKILL_UI?.failure?playerSkillUIText('没有合法目标，或其他代价不足；本次未发动。','No legal target or another cost cannot be paid. The skill was not activated.'):playerSkillUIStatus())}</p><div class="player-skill-action-row"><button class="pri" type="button" data-player-boss-skill="use" ${usable?'':'disabled'}>${state.armed?playerSkillUIText('已准备','Prepared'):playerSkillUIText('发动战技','Activate Skill')}</button>${options.some(x=>x.card!==state.source)?`<button type="button" data-player-boss-skill="change" ${changeable?'':'disabled'}>${playerSkillUIText('更换战技','Change Skill')}</button>`:''}</div></div>`;
 }
 return head(playerSkillUIText('装备战技','Equip Skill'))+`<div class="player-boss-skill-scroll"><p class="player-boss-skill-rule">${playerSkillUIText('选择场上一张Boss卡提供战技。每回合最多装备一次；装备后收起此界面。','Choose a deployed Boss card to provide its skill. Equip at most once per round; choosing a skill closes this panel.')}</p><p class="player-skill-status" role="status">${esc(playerSkillUIStatus())}</p><div class="player-boss-skill-options">${options.map(({card,index,ability:cfg})=>`<article><div><b>${esc(playerSkillUICardName(card))}</b><small>${playerSkillUIText(`第${index+1}格`,`Lane ${index+1}`)} · ${esc(playerSkillUIAbilityName(cfg))}${state?.source===card?playerSkillUIText(' · 当前装备',' · Equipped'):''}</small></div><button type="button" data-player-boss-skill="equip" data-player-skill-lane="${index}" ${canAct&&state?.equipTurn!==G.turn?'':'disabled'}>${playerSkillUIText('装备','Equip')}</button><details><summary>${playerSkillUIText('效果与代价','Effect and cost')}</summary>${playerBossSkillDescription(cfg)}</details></article>`).join('')||`<p>${playerSkillUIText('先把拥有主动技能的Boss卡部署到己方战场。','Deploy a Boss card with an active skill to your board first.')}</p>`}</div></div>`;
}
function positionPlayerBossSkillPopover(){
 if(!PLAYER_BOSS_SKILL_UI)return;
 const panel=document.getElementById('player-boss-skill-panel'),trigger=document.querySelector('.player-boss-skill-trigger');if(!panel||!trigger)return;
 const view=window.visualViewport,w=view?.width||innerWidth,h=view?.height||innerHeight,ox=view?.offsetLeft||0,oy=view?.offsetTop||0,r=trigger.getBoundingClientRect();
 panel.style.maxWidth=Math.max(0,w-16)+'px';panel.style.maxHeight=Math.max(0,h-16)+'px';
 const size=panel.getBoundingClientRect(),left=Math.max(ox+8,Math.min(r.left,ox+w-size.width-8)),above=r.top-size.height-6,top=above>=oy+8?above:Math.max(oy+8,Math.min(r.bottom+6,oy+h-size.height-8));panel.style.left=left+'px';panel.style.top=top+'px';
}
function refreshPlayerBossSkillPopover(){
 const ui=PLAYER_BOSS_SKILL_UI;if(!ui)return;
 const state=playerBossSkillState();
 if(!G||ui.game!==G||OV!==null||G.tutorial||ui.turn!==G.turn||ui.phase!==G.phase||ui.source&&state?.source!==ui.source||G.busy||(typeof DM!=='undefined'&&DM)||(typeof HOLD_DETAIL!=='undefined'&&HOLD_DETAIL)||(typeof infoPanel!=='undefined'&&infoPanel)){closePlayerBossSkillPopover(false);return}
 if(ui.mode==='effect'&&!playerBossSkillEquippedAbility()){closePlayerBossSkillPopover(false);return}
 const panel=document.getElementById('player-boss-skill-panel');if(!panel)return;
 panel.dataset.mode=ui.mode;panel.dataset.playerSkillMode=ui.mode;panel.classList.toggle('is-effect-hint',ui.mode==='effect');
 const html=playerBossSkillPanelHTML();if(panel._playerSkillMarkup!==html){const scroll=panel.querySelector('.player-boss-skill-scroll')?.scrollTop||0;panel.innerHTML=html;panel._playerSkillMarkup=html;panel.querySelector('.player-boss-skill-scroll').scrollTop=scroll}
 if(typeof localizeRoot==='function')localizeRoot(panel);
 document.querySelector('.player-boss-skill-trigger')?.setAttribute('aria-expanded','true');positionPlayerBossSkillPopover();
}
function openPlayerBossSkillPopover(pinned=true,requestedMode=null,moveFocus=false){
 if(!G||G.tutorial||OV!==null||G.busy||(typeof DM!=='undefined'&&DM)||(typeof HOLD_DETAIL!=='undefined'&&HOLD_DETAIL)||(typeof infoPanel!=='undefined'&&infoPanel))return;
 if(!pinned&&performance.now()<playerSkillUISuppressHoverUntil)return;
 const ability=playerBossSkillEquippedAbility(),mode=requestedMode||(!ability?'equip':'effect');
 clearTimeout(playerSkillUICloseTimer);
 if(PLAYER_BOSS_SKILL_UI){PLAYER_BOSS_SKILL_UI.pinned=PLAYER_BOSS_SKILL_UI.pinned||pinned;PLAYER_BOSS_SKILL_UI.mode=mode;refreshPlayerBossSkillPopover();if(moveFocus)document.querySelector('#player-boss-skill-panel [data-player-boss-skill="use"]:not(:disabled),#player-boss-skill-panel [data-player-boss-skill="close"]')?.focus({preventScroll:true});return}
 if(typeof closeBossAbilityPopover==='function')closeBossAbilityPopover(false);
 const panel=document.createElement('section');panel.id='player-boss-skill-panel';panel.className='player-boss-skill-popover';panel.setAttribute('role','dialog');panel.setAttribute('aria-labelledby','player-boss-skill-title');
 PLAYER_BOSS_SKILL_UI={game:G,turn:G.turn,phase:G.phase,source:playerBossSkillState()?.source,mode,pinned};document.body.appendChild(panel);refreshPlayerBossSkillPopover();playerBossSkillUITimer=setInterval(refreshPlayerBossSkillPopover,250);
 if(moveFocus)panel.querySelector('[data-player-boss-skill="use"]:not(:disabled),[data-player-boss-skill="close"]')?.focus({preventScroll:true});
}
function closePlayerBossSkillPopover(restoreFocus=true){
 const active=PLAYER_BOSS_SKILL_UI;PLAYER_BOSS_SKILL_UI=null;clearInterval(playerBossSkillUITimer);clearTimeout(playerSkillUICloseTimer);playerBossSkillUITimer=0;playerSkillUICloseTimer=0;
 if(typeof document==='undefined')return;document.getElementById('player-boss-skill-panel')?.remove();const trigger=document.querySelector('.player-boss-skill-trigger');trigger?.setAttribute('aria-expanded','false');
 if(active&&(active.source!==G?.playerBossSkill?.source||G?.playerBossSkill?.turnUsed===G?.turn||G?.playerBossSkill?.armed))playerSkillUISuppressHoverUntil=performance.now()+600;
 if(active&&restoreFocus){playerSkillUISuppressHoverUntil=performance.now()+500;trigger?.focus({preventScroll:true})}
}
function deferClosePlayerBossSkillPopover(){clearTimeout(playerSkillUICloseTimer);if(PLAYER_BOSS_SKILL_UI&&!PLAYER_BOSS_SKILL_UI.pinned)playerSkillUICloseTimer=setTimeout(()=>closePlayerBossSkillPopover(false),180)}
function finishPlayerSkillUIAction(event){
 playerSkillUISuppressHoverUntil=performance.now()+600;closePlayerBossSkillPopover(false);if(typeof render==='function')render();
 if(event.detail===0)document.querySelector('.player-boss-skill-trigger')?.focus({preventScroll:true});
}
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-player-boss-skill]');if(!button)return;
 event.preventDefault();event.stopImmediatePropagation();if(button.disabled)return;const action=button.dataset.playerBossSkill;
 if(action==='close'){closePlayerBossSkillPopover();return}
 if(action==='open'){openPlayerBossSkillPopover(true,null,event.detail===0);return}
 if(action==='change'){openPlayerBossSkillPopover(true,'equip',true);return}
 if(action==='equip'){if(equipPlayerBossSkill(Number(button.dataset.playerSkillLane)))finishPlayerSkillUIAction(event);else{if(typeof render==='function')render();refreshPlayerBossSkillPopover()}return}
 if(action==='use'){const used=usePlayerBossSkill();if(used){if(typeof chk==='function')chk();finishPlayerSkillUIAction(event)}else{if(PLAYER_BOSS_SKILL_UI)PLAYER_BOSS_SKILL_UI.failure=true;if(typeof render==='function')render();refreshPlayerBossSkillPopover()}}
},true);
document.addEventListener('pointerover',event=>{
 if(event.pointerType==='touch'||!matchMedia('(hover:hover)').matches)return;
 const target=event.target.closest('.player-boss-skill-trigger,#player-boss-skill-panel');if(!target)return;clearTimeout(playerSkillUICloseTimer);
 if(target.classList.contains('player-boss-skill-trigger')&&playerBossSkillEquippedAbility())openPlayerBossSkillPopover(false);
});
document.addEventListener('pointerout',event=>{if(event.pointerType==='touch'||!event.target.closest('.player-boss-skill-trigger,#player-boss-skill-panel')||event.relatedTarget?.closest?.('.player-boss-skill-trigger,#player-boss-skill-panel'))return;deferClosePlayerBossSkillPopover()});
document.addEventListener('focusin',event=>{if(event.target.closest('.player-boss-skill-trigger')&&performance.now()>=playerSkillUISuppressHoverUntil&&playerBossSkillEquippedAbility())openPlayerBossSkillPopover(true)});
document.addEventListener('focusout',event=>{if(!event.target.closest('.player-boss-skill-trigger,#player-boss-skill-panel'))return;setTimeout(()=>{if(PLAYER_BOSS_SKILL_UI&&!document.activeElement?.closest?.('.player-boss-skill-trigger,#player-boss-skill-panel'))closePlayerBossSkillPopover(false)},0)});
document.addEventListener('pointerdown',event=>{if(!PLAYER_BOSS_SKILL_UI||event.button!==0||event.target.closest('.player-boss-skill-popover,.player-boss-skill-trigger'))return;closePlayerBossSkillPopover(false)},true);
document.addEventListener('contextmenu',event=>{if(!PLAYER_BOSS_SKILL_UI)return;event.preventDefault();event.stopImmediatePropagation();closePlayerBossSkillPopover()},true);
document.addEventListener('keydown',event=>{if(!PLAYER_BOSS_SKILL_UI||event.key!=='Escape')return;event.preventDefault();event.stopImmediatePropagation();closePlayerBossSkillPopover()},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)closePlayerBossSkillPopover(false)});
window.addEventListener('blur',()=>closePlayerBossSkillPopover(false));
window.addEventListener('resize',positionPlayerBossSkillPopover);window.visualViewport?.addEventListener('resize',positionPlayerBossSkillPopover);window.visualViewport?.addEventListener('scroll',positionPlayerBossSkillPopover);
