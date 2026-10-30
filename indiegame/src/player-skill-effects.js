// Skill feedback is transient presentation state. Card instances and saves stay untouched.
const PLAYER_SKILL_VISUALS={game:null,items:[],timer:0,frame:0,deferred:new Map()};
const PLAYER_SKILL_VISUAL_DURATION=1000;
function playerSkillVisualGame(){return typeof G==='undefined'?null:G}
function playerSkillVisualNumber(value){return typeof value==='number'&&Number.isFinite(value)?value:null}
function playerSkillVisualLocations(game){
 const rows=[];if(!game)return rows;
 for(const side of ['p','e'])if(Array.isArray(game[side]))game[side].forEach((card,index)=>{if(card)rows.push({card,zone:'board',side,index})});
 if(Array.isArray(game.hand))game.hand.forEach((card,index)=>{if(card&&!rows.some(row=>row.card===card))rows.push({card,zone:'hand',side:'p',index})});
 return rows;
}
function playerSkillVisualLocation(card,game=playerSkillVisualGame()){return playerSkillVisualLocations(game).find(row=>row.card===card)||null}
function playerSkillVisualCardNode(location){
 if(!location||typeof document==='undefined')return null;
 return location.zone==='board'?document.getElementById('c-'+location.side+'-'+location.index):document.querySelector('.game-shell .hand [data-a="h"][data-i="'+location.index+'"]');
}
function playerSkillVisualRect(node){
 if(!node?.getBoundingClientRect)return null;
 const box=node.getBoundingClientRect();return box.width>0&&box.height>0?{left:box.left,top:box.top,width:box.width,height:box.height}:null;
}
function playerSkillVisualStatNode(node,stat){
 if(!node)return null;
 if(stat==='attack')return node.querySelector('.st > span:first-child');
 if(stat==='health')return node.querySelector('.st > span:last-child');
 if(stat==='cost')return node.querySelector('.top > i');
 if(stat==='shield')return node.querySelector('.sg .boss-effect-sigil')||node.querySelector('.sg');
 return node;
}
function playerSkillVisualCardState(row){
 const card=row.card,node=playerSkillVisualCardNode(row),rects={};
 for(const stat of ['attack','health','cost','shield','status'])rects[stat]=playerSkillVisualRect(playerSkillVisualStatNode(node,stat));
 let attack=card.a,status='';try{if(typeof displayedCardAttack==='function')attack=displayedCardAttack(card)}catch{}
 try{status=JSON.stringify([card.bossEffects||{},card.at,card.s,card.mv,card.poison,card.frozenUntil,card.bossFrozenUntil])}catch{}
 return {...row,attack:playerSkillVisualNumber(attack),health:playerSkillVisualNumber(card.h),cost:playerSkillVisualNumber(card.c),shield:Math.max(0,Number(card.bossEffects?.shield)||0),status,rects};
}
function capturePlayerSkillVisualState(){
 const game=playerSkillVisualGame();if(!game)return null;
 const heroes={};for(const side of ['p','e']){const node=typeof document==='undefined'?null:document.querySelector('#'+(side==='p'?'player':'enemy')+'-health .life-title > b');heroes[side]={value:playerSkillVisualNumber(game[side==='p'?'hp':'ehp']),rect:playerSkillVisualRect(node)}}
 return {game,turn:game.turn,cards:playerSkillVisualLocations(game).map(playerSkillVisualCardState),heroes,deferred:new Set(game.bossSkill?.deferred||[]),source:game.playerBossSkill?.source||null};
}
function playerSkillVisualSceneOpen(){
 const game=playerSkillVisualGame();
 return !!game&&!game.tutorial&&!(typeof OV!=='undefined'&&OV!==null)&&!(typeof DM!=='undefined'&&DM)&&!(typeof HOLD_DETAIL!=='undefined'&&HOLD_DETAIL)&&!(typeof infoPanel!=='undefined'&&infoPanel)&&!document.hidden;
}
function clearPlayerSkillVisualEffects(forgetDeferred=false){
 const ui=PLAYER_SKILL_VISUALS;clearTimeout(ui.timer);ui.timer=0;
 if(ui.frame&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(ui.frame);ui.frame=0;
 for(const item of ui.items){item.floating?.remove();item.target?.classList.remove('player-skill-number-pulse','player-skill-number-gain','player-skill-number-loss','player-skill-effect-pulse')}
 ui.items=[];ui.game=null;document.getElementById('player-skill-effects-layer')?.remove();
 if(forgetDeferred)ui.deferred.clear();
}
function playerSkillVisualLabel(item){
 const english=typeof gameLanguage!=='undefined'&&gameLanguage==='en',names=english?{attack:'ATK',health:'HP',cost:'Cost',shield:'Shield',hero:'Life'}:{attack:'攻击',health:'生命',cost:'费用',shield:'护盾',hero:'生命'};
 if(item.stat==='status')return english?(item.message==='enter'?'Summoned':item.message==='leave'?'Left play':'Skill applied'):(item.message==='enter'?'登场':item.message==='leave'?'离场':'战技生效');
 return (item.delta>0?'+':'')+item.delta+' '+(names[item.stat]||'');
}
function queuePlayerSkillVisualChanges(before,ability,options={}){
 const game=playerSkillVisualGame();if(!before||before.game!==game||!game||typeof document==='undefined')return;
 const ui=PLAYER_SKILL_VISUALS;if(ui.game&&ui.game!==game)clearPlayerSkillVisualEffects(true);
 for(const [entry,owner]of ui.deferred)if(owner.game!==game)ui.deferred.delete(entry);
 if(options.trackDeferred!==false)for(const entry of game.bossSkill?.deferred||[])if(!before.deferred.has(entry))ui.deferred.set(entry,{game,ability});
 const after=playerSkillVisualLocations(game).map(playerSkillVisualCardState),old=new Map(before.cards.map(row=>[row.card,row])),now=new Map(after.map(row=>[row.card,row])),added=[];
 const add=(row,stat,delta,message='')=>{
  const expires=performance.now()+PLAYER_SKILL_VISUAL_DURATION,rect=row.rects?.[stat]||row.rects?.status||null;
  added.push({card:row.card,zone:row.zone,side:row.side,stat,delta,message,rect,expires,floating:null,target:null});
 };
 for(const previous of before.cards){
  if(options.onlyCards&&!options.onlyCards.has(previous.card))continue;
  const current=now.get(previous.card);
  if(!current){
   if(previous.zone==='board'){
    const health=playerSkillVisualNumber(previous.card.h);
    if(health!==null&&previous.health!==null&&health!==previous.health)add(previous,'health',health-previous.health);
    else add(previous,'status',0,'leave');
   }
   continue;
  }
  let numeric=false;
  for(const stat of ['attack','health','cost','shield'])if(previous[stat]!==null&&current[stat]!==null&&previous[stat]!==current[stat]){add({...current,rects:previous.rects},stat,current[stat]-previous[stat]);numeric=true}
  if(!numeric&&previous.status!==current.status)add({...current,rects:previous.rects},'status',0);
 }
 for(const current of after)if(current.zone==='board'&&!old.has(current.card)&&(!options.onlyCards||options.onlyCards.has(current.card)))add(current,'status',0,'enter');
 if(options.heroes!==false)for(const side of ['p','e']){
  const previous=before.heroes[side],value=playerSkillVisualNumber(game[side==='p'?'hp':'ehp']);
  if(previous.value!==null&&value!==null&&previous.value!==value)added.push({card:null,side,stat:'hero',delta:value-previous.value,rect:previous.rect,expires:performance.now()+PLAYER_SKILL_VISUAL_DURATION,floating:null,target:null});
 }
 if(!added.length&&options.fallback!==false&&before.source){const row=now.get(before.source);if(row)add(row,'status',0)}
 if(!added.length)return;
 ui.game=game;ui.items.push(...added);
 if(!ui.frame&&typeof requestAnimationFrame==='function')ui.frame=requestAnimationFrame(()=>{ui.frame=0;flushPlayerSkillVisualChanges()});
}
function playerSkillVisualTarget(item){
 if(item.stat==='hero')return document.querySelector('#'+(item.side==='p'?'player':'enemy')+'-health .life-title > b');
 return playerSkillVisualStatNode(playerSkillVisualCardNode(playerSkillVisualLocation(item.card)),item.stat);
}
function flushPlayerSkillVisualChanges(){
 const ui=PLAYER_SKILL_VISUALS,game=playerSkillVisualGame();
 for(const [entry,owner]of ui.deferred)if(owner.game!==game)ui.deferred.delete(entry);
 if(!ui.items.length)return;
 if(ui.game!==game||!playerSkillVisualSceneOpen()){clearPlayerSkillVisualEffects(ui.game!==game);return}
 const time=performance.now(),active=[];
 for(const item of ui.items){
  if(item.expires<=time){item.floating?.remove();item.target?.classList.remove('player-skill-number-pulse','player-skill-number-gain','player-skill-number-loss','player-skill-effect-pulse');continue}
  const target=playerSkillVisualTarget(item),rect=playerSkillVisualRect(target)||item.rect;if(!rect){active.push(item);continue}
  const gain=item.stat==='cost'?item.delta<0:item.delta>0,tone=item.stat==='status'?'neutral':gain?'gain':'loss';
  if(target&&target!==item.target){
   item.target?.classList.remove('player-skill-number-pulse','player-skill-number-gain','player-skill-number-loss','player-skill-effect-pulse');
   item.target=target;target.classList.add(item.stat==='status'||item.stat==='shield'?'player-skill-effect-pulse':'player-skill-number-pulse');
   if(item.stat!=='status')target.classList.add(gain?'player-skill-number-gain':'player-skill-number-loss');
  }
  if(!item.floating?.isConnected){
   let layer=document.getElementById('player-skill-effects-layer');if(!layer){layer=document.createElement('div');layer.id='player-skill-effects-layer';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer)}
   const badge=document.createElement('span');badge.className='player-skill-delta is-'+tone;badge.dataset.stat=item.stat;badge.dataset.delta=String(item.delta);badge.dataset.side=item.side;layer.appendChild(badge);item.floating=badge;
   badge.style.animationDuration=Math.max(1,item.expires-time)+'ms';
  }
  const badge=item.floating;badge.textContent=playerSkillVisualLabel(item);
  const view=window.visualViewport,w=view?.width||innerWidth,h=view?.height||innerHeight,ox=view?.offsetLeft||0,oy=view?.offsetTop||0;
  const center=rect.left+rect.width/2,top=rect.top+(item.stat==='status'?Math.min(24,rect.height*.4):0),width=badge.getBoundingClientRect().width;
  badge.style.left=Math.max(ox+width/2+4,Math.min(center,ox+w-width/2-4))+'px';badge.style.top=Math.max(oy+24,Math.min(top,oy+h-8))+'px';
  active.push(item);
 }
 ui.items=active;clearTimeout(ui.timer);
 if(active.length)ui.timer=setTimeout(flushPlayerSkillVisualChanges,Math.max(1,Math.min(...active.map(item=>item.expires-performance.now()))+8));
 else{ui.timer=0;ui.game=null;document.getElementById('player-skill-effects-layer')?.remove()}
}
const renderBeforePlayerSkillVisuals=render;
render=function(){renderBeforePlayerSkillVisuals();flushPlayerSkillVisualChanges()};
// Delayed charge/growth belongs to the original successful player cast, not its preview.
if(typeof bossAbilitiesRoundStart==='function'){
 const roundStartBeforePlayerSkillVisuals=bossAbilitiesRoundStart;
 bossAbilitiesRoundStart=function(){
  const game=playerSkillVisualGame(),due=[...PLAYER_SKILL_VISUALS.deferred].filter(([entry,owner])=>owner.game===game&&entry.turn<=game?.turn&&(game.bossSkill?.deferred||[]).includes(entry));
  const before=due.length?capturePlayerSkillVisualState():null,result=roundStartBeforePlayerSkillVisuals.apply(this,arguments);
  if(before){for(const [entry]of due)PLAYER_SKILL_VISUALS.deferred.delete(entry);queuePlayerSkillVisualChanges(before,due[0][1].ability,{onlyCards:new Set(due.map(([entry])=>entry.card)),heroes:false,fallback:false,trackDeferred:false})}
  return result;
 };
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearPlayerSkillVisualEffects()});
window.addEventListener('blur',()=>clearPlayerSkillVisualEffects());
window.addEventListener('pagehide',()=>clearPlayerSkillVisualEffects(true));
window.addEventListener('resize',()=>{if(PLAYER_SKILL_VISUALS.items.length)flushPlayerSkillVisualChanges()});
window.visualViewport?.addEventListener('resize',()=>{if(PLAYER_SKILL_VISUALS.items.length)flushPlayerSkillVisualChanges()});
window.visualViewport?.addEventListener('scroll',()=>{if(PLAYER_SKILL_VISUALS.items.length)flushPlayerSkillVisualChanges()});
