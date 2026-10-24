// Skill planning uses an isolated copy of public lanes and the Boss's own resources.
// It neither reads the opponent's card faces/deck order nor advances the live RNG.
const AI_SKILL_PREVIEW_LOCATIONS=new WeakMap();
function aiBossPreviewAttack(card){
 const location=card&&AI_SKILL_PREVIEW_LOCATIONS.get(card);if(!location)return null;
 const {view,side}=location,index=(side==='e'?view.e:view.p).indexOf(card),opponent=index>=0?(side==='e'?view.p:view.e)[index]:null;
 return effectiveCardAttack(card,opponent);
}
function aiSkillRegisterLanes(view){
 for(const side of ['e','p'])for(const card of [...(side==='e'?view.e:view.p),...(side==='e'?view.eh:view.hand),...(view.discard[side]||[])])if(card)AI_SKILL_PREVIEW_LOCATIONS.set(card,{view,side});
}
function aiSkillClone(value,memo=new Map()){
 if(value===null||typeof value!=='object')return value;
 if(memo.has(value))return memo.get(value);
 const copy=Array.isArray(value)?[]:{};memo.set(value,copy);
 for(const key of Object.keys(value))if(key!=='origin')copy[key]=aiSkillClone(value[key],memo);
 return copy;
}
function aiSkillHandValue(card,board){
 if(!card)return 0;
 if(card.n==='余芯'&&card.c===0&&card.a===0)return .42;
 const bodyCount=board.filter(Boolean).length,cost=card.c||0;
 const quality=(card.a||0)*1.8+(card.h||0)*.55+(card.s? .65:0)+(card.x? .45:0)+(card.dr||0)*.5+(card.heal||0)*.4+(card.growth?.7:0)+(card.death?.6:0);
 return (.42+Math.min(10,quality)*.16)*(cost>bodyCount+1?.7:1)*(Math.max(card.frozenUntil||0,card.bossFrozenUntil||0)>G.turn?.6:1);
}
function aiSkillSnapshot(){
 const memo=new Map(),copy=x=>aiSkillClone(x,memo);
 const state=copy(G.bossSkill||{temp:[],deferred:[]});
 const view={p:copy(G.p),e:copy(G.e),eh:copy(G.eh),hp:G.hp,ehp:G.ehp,turn:G.turn,phase:G.phase,enemyDeployedTurn:G.enemyDeployedTurn,st:copy(G.st),discard:copy(G.discard||{p:[],e:[]}),bossSkill:state,playerBossSkill:copy(G.playerBossSkill),ed:Array(G.ed?.length||0).fill(null),draw:Array(G.draw?.length||0).fill(null)};
 // Hand faces are hidden information. A freeze is valued from its visible size
 // and available sacrifices; the real handler still selects its legal random card.
 view.hand=Array.from({length:G.hand?.length||0},()=>({n:'unknown',c:1,a:1,h:1,h0:1}));
 state.temp=state.temp||[];state.deferred=state.deferred||[];aiSkillRegisterLanes(view);
 return view;
}
function aiSkillForecast(view,phase,rounds=1){
 return aiEvaluatePosition(view.e,view.p,{hp:view.hp,ehp:view.ehp,turn:view.turn,phase,rounds,bossSkill:view.bossSkill,playerBossSkill:view.playerBossSkill});
}
function aiSkillPreviewContext(view,seed){
 const state=view.bossSkill;let choices=0,draws=0,freezes=0;
 const board=side=>side==='p'?view.p:view.e;
 const hand=side=>side==='p'?view.hand:view.eh;
 const unitValue=c=>c?c.a*1.8+c.h*.55+(c.s? .65:0):0;
 // Card identities/order in a finite draw pile do not enter planning. Drawn
 // cards are average resources, estimated from this Boss's known hand/retinue.
 const ownCards=view.eh.filter(c=>c.n!=='余芯'),average=ownCards.length?ownCards.reduce((n,c)=>n+aiSkillHandValue(c,view.e),0)/ownCards.length:1.1;
 const ctx={G:view,state,owner:'e',units:side=>{aiSkillRegisterLanes(view);return board(side).map((card,index)=>({card,index})).filter(x=>x.card)},choose:list=>{if(!list?.length)return null;return list[Math.floor(seed/Math.pow(5,choices++))%list.length]},hasSkill:(card,key)=>!!card&&(card.s===key||(card.bossEffects?.skills||[]).includes(key)||(key==='push'&&card.mv==='push'))};
 ctx.effect=(card,patch)=>{if(card)card.bossEffects={...(card.bossEffects||{}),...patch};return card};
 ctx.buff=(card,delta,permanent=false)=>{if(!card)return card;const amount=Math.max(0,card.a+delta)-card.a;card.a+=amount;if(permanent&&Number.isFinite(card.a0))card.a0=Math.max(0,card.a0+amount);if(!permanent){let e=state.temp.find(e=>e.card===card&&e.key==='a');if(!e){e={card,key:'a',delta:0};state.temp.push(e)}e.delta+=amount}return card};
 ctx.temp=(card,patch)=>{if(!card)return card;for(const [key,value]of Object.entries(patch)){if(key==='a'){ctx.buff(card,value-card.a);continue}if(!state.temp.some(e=>e.card===card&&e.key===key))state.temp.push({card,key,had:Object.prototype.hasOwnProperty.call(card,key),value:card[key]});card[key]=value}return card};
 ctx.shield=(card,n=1)=>ctx.effect(card,{shield:Math.max(card?.bossEffects?.shield||0,n)});
 ctx.healCard=(card,n)=>{if(!card||n<=0)return 0;const before=card.h;card.h=Math.min(card.h0??card.h,card.h+n);return card.h-before};
 ctx.healHero=(side,n)=>{const key=side==='p'?'hp':'ehp',before=view[key];view[key]=Math.min(7,view[key]+n);return view[key]-before};
 ctx.draw=(side,n)=>{const deck=side==='p'?view.draw:view.ed;let count=0;for(let i=0;i<n&&deck.length;i++){deck.pop();hand(side).push({n:'forecast-draw',c:1,a:1,h:2,h0:2,aiDrawValue:average});count++;if(side==='e')draws++}return count};
 ctx.consumeDiscard=(side,predicate=()=>true)=>{const pile=view.discard[side]||[],index=pile.findIndex(predicate);return index<0?null:pile.splice(index,1)[0]};
 ctx.discardOne=(side='e')=>{const pile=hand(side);if(!pile.length)return null;const i=pile.map((card,index)=>({card,index,value:card.a*1.8+card.h*.7+(card.dr||0)+(card.heal||0)-card.c*.3})).sort((a,b)=>a.value-b.value)[0].index,card=pile.splice(i,1)[0];if(!bossIsToken(card))view.discard[side].push(card);return card};
 ctx.summon=(side,template,opts={})=>{const b=board(side),index=Number.isInteger(opts.lane)?opts.lane:b.findIndex(c=>!c);if(index<0||index>=b.length||b[index])return null;const c={...template,c:template.c??0,a0:template.a,h0:template.h,poison:0,token:true,t:view.turn,e:side==='e'?1:undefined,at:template.at||'物理',kind:template.kind||'mob'};if(opts.cannotSacrifice)c.bossNoSacrifice=true;if(opts.expiresTurn!=null)c.bossExpiresTurn=opts.expiresTurn;b[index]=c;return c};
 ctx.kill=(side,index,by=null,reason='combat')=>{const b=board(side),c=b[index];if(!c)return false;b[index]=null;if(c.bossWickOriginal)return true;if(c.s==='bones')b[index]={n:'碎灯偶',a:1,h:1,a0:1,h0:1,c:0,at:'暗',token:true,t:view.turn};if(c.x==='rekindle'&&!c.rk)hand(side).push({...c,rk:1,h:c.h0??c.h});ctx.draw(side,c.dd||0);if(c.death==='draw')ctx.draw(side,2);if(c.death==='heal')ctx.healHero(side,2);if(c.death==='spiders'||c.death==='emberling'){const count=c.death==='spiders'?2:1;for(let k=0;k<count;k++){const lanes=b.map((x,i)=>x?-1:i).filter(i=>i>=0).sort((i,j)=>Math.abs(i-index)-Math.abs(j-index)||i-j);const t={n:'forecast-token',a:c.death==='spiders'?0:1,h:1,c:0,token:true};if(lanes.length)ctx.summon(side,t,{lane:lanes[0]});else hand(side).push({...t,a0:t.a,h0:1})}}if(!bossIsToken(c))view.discard[side].push(c);return true};
 ctx.hurt=(side,card,n,by=null,meta={})=>{const b=board(side),index=b.indexOf(card);if(index<0||n<=0)return 0;let amount=n;const effects=card.bossEffects||{};if(effects.shield>0){amount=Math.max(0,amount-effects.shield);delete effects.shield}if(amount<=0)return 0;card.h-=amount;if(card.h<=0&&!meta.deferDeath)ctx.kill(side,index,by,meta.kind==='sacrifice'?'sacrifice':'combat');return amount};
 ctx.move=(side,card,delta,swap=false)=>{const b=board(side),index=b.indexOf(card),target=index+delta;if(index<0||target<0||target>=b.length||Math.abs(delta)!==1||card.moved===view.turn||card.bossEffects?.lockMove)return false;const other=b[target];if(other&&(!swap||other.moved===view.turn||other.bossEffects?.lockMove))return false;b[target]=card;b[index]=other||null;card.moved=view.turn;if(other)other.moved=view.turn;return true};
 ctx.returnToHand=(side,card)=>{const b=board(side),index=b.indexOf(card);if(index<0)return false;b[index]=null;for(const e of state.temp.filter(e=>e.card===card)){if(e.key==='a')card.a=Math.max(0,card.a-e.delta);else if(e.had)card[e.key]=e.value;else delete card[e.key]}state.temp=state.temp.filter(e=>e.card!==card);state.deferred=state.deferred.filter(e=>e.card!==card);delete card.bossEffects;delete card.bossFrozenUntil;delete card.t;delete card.moved;card.h=card.h0??card.h;card.poison=0;hand(side).push(card);return true};
 ctx.lockUntil=()=>view.turn+(view.phase==='enemy-deploy'&&roundFirstSide()==='p'?2:1);
 ctx.ash=card=>{const i=view.p.indexOf(card);if(i<0||bossIsToken(card)||card.bossWickImmuneUntil>view.turn||view.p.some(c=>c?.bossWickOriginal))return false;const beforeTarget=view.phase==='enemy-deploy'&&roundFirstSide()==='e';view.p[i]={n:'余芯',a:0,h:1,a0:0,h0:1,c:0,at:'物理',fod:true,t:card.t||0,bossWickOriginal:card,bossWickRestoreTurn:view.turn+(beforeTarget?1:2)};return true};
 ctx.redirect=(card,n=1)=>{if(card)state.heroRedirect={card,amount:n,untilTurn:view.turn}};
 ctx.cleanse=card=>{if(!card)return false;card.poison=0;delete card.bossFrozenUntil;for(const e of state.temp.filter(e=>e.card===card&&e.key==='a'&&e.delta<0)){card.a-=e.delta;state.temp.splice(state.temp.indexOf(e),1)}return true};
 ctx.deferred=(card,kind,data={})=>{if(card)state.deferred.push({card,kind,turn:view.turn+1,...data})};
 ctx.forecast=()=>aiSkillForecast(view,'deploy',1);
 ctx.metrics=()=>({draws,freezes,average,unitValue});
 ctx.freeze=()=>{const target=ctx.choose(view.hand);if(!target)return false;target.bossFrozenUntil=ctx.lockUntil();freezes++;return true};
 return ctx;
}
function aiSkillPreviewApply(cfg,ctx){
 // These three real handlers emit a battle log directly. Their preview mirrors
 // only the printed changes, preventing phantom messages during consideration.
 if(cfg.id==='boss-06'||cfg.id==='boss-91')return ctx.freeze();
 if(cfg.id==='boss-42'){const card=bossChallengeFighter(ctx);if(!card||ctx.G.ehp<=1)return false;ctx.G.ehp--;ctx.buff(card,1);ctx.effect(card,{extraDamage:1,extraElement:'火'});return true}
 if(cfg.id==='boss-43'){const eligible=c=>!c.token&&!c.fod&&c.c<=2&&!c.bossApeRevived,card=ctx.consumeDiscard('e',eligible);if(!card)return false;card.h=card.h0=1;card.poison=0;card.bossApeRevived=true;delete card.t;delete card.moved;ctx.G.eh.push(card);return true}
 return BOSS_SKILL_HANDLERS[cfg.boss](ctx)===true;
}
function aiBossSkillValue(cfg,phase=cfg?.timing){
 if(!G||!cfg||typeof aiEvaluatePosition!=='function'||typeof BOSS_SKILL_HANDLERS[cfg.boss]!=='function')return {use:false,gain:0,safe:false,applied:false};
 const initial=aiSkillSnapshot(),ashIndex=initial.eh.findIndex(c=>c.n==='余芯'&&c.c===0&&c.a===0&&c.h===1&&!c.bossWickOriginal&&!(c.frozenUntil>G.turn)&&!(c.bossFrozenUntil>G.turn));
 if(ashIndex<0)return {use:false,gain:0,safe:true,applied:false};
 const profile=typeof aiProfile==='function'?aiProfile():{},rounds=Math.max(1,Math.min(2,profile.depth||profile.rounds||1));
 const before=aiSkillForecast(initial,phase,rounds),handBefore=initial.eh.reduce((n,c)=>n+aiSkillHandValue(c,initial.e),0);
 const rank=profile.rank||0,samples=rank>=48?15:5;let gain=0,applied=0,safe=true,lowest=Infinity;
 for(let seed=0;seed<samples;seed++){
  const view=aiSkillSnapshot();view.eh.splice(ashIndex,1);const deferredBefore=view.bossSkill.deferred.length,seedBefore=view.bossSkill.fireSeed;
  const ctx=aiSkillPreviewContext(view,seed);let ok=false;
  try{ok=aiSkillPreviewApply(cfg,ctx)}catch(error){return {use:false,gain:0,safe:false,applied:false,error:true}}
  if(!ok)continue;applied++;
  const after=aiSkillForecast(view,phase,rounds);
  if(before.ehp>0&&after.ehp<=0||before.hp<=0&&before.ehp>0&&after.hp>0)safe=false;
  let resources=view.eh.reduce((n,c)=>n+(c.aiDrawValue??aiSkillHandValue(c,view.e)),0)-handBefore;
  // A queued growth or charge matters only if its bearer remains alive.
  if(rounds===1)for(const d of view.bossSkill.deferred.slice(deferredBefore)){if(after.e.some(c=>c&&(c.origin===d.card||c===d.card)))resources+=d.kind==='grow'?.8:d.kind==='charge'?.5:0}
  if(view.bossSkill.fireSeed&&view.bossSkill.fireSeed!==seedBefore&&view.hand.length){const i=view.bossSkill.fireSeed.lane;resources+=.7+(view.e[i]?.a>0?.5:0)}
  const frozen=ctx.metrics().freezes+(cfg.id==='boss-91'&&view.hand.some(c=>c.bossFrozenUntil>view.turn)?1:0);
  if(frozen)resources+=.25+Math.min(3,view.p.filter(c=>c&&(c.t||0)<view.turn).length)*.3;
  const value=after.score-before.score+resources;gain+=value;lowest=Math.min(lowest,value);
 }
 if(!applied)return {use:false,gain:0,safe:true,applied:false};
 gain/=samples;const threshold=.08-Math.min(95,rank)/95*.045;
 return {use:safe&&gain>threshold,gain,safe,applied:true,samples,lowest};
}
function aiShouldUseBossAbility(cfg,phase){return aiBossSkillValue(cfg,phase).use}
