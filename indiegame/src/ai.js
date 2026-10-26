// Tactical planning reads the public table and the Boss's own hand only.
// Forecasts use private card copies; they never resolve real draws or roll RNG.
function aiCampaignLevel(){return Math.max(0,DIFFICULTY_ORDER.indexOf(difficulty))}
function aiProfile(){
 const rank=Math.min(95,Math.max(0,aiCampaignLevel()*16+Math.max(0,(G?.lv||1)-1)));
 return {rank,cycle:aiCampaignLevel(),level:G?.lv||1,depth:rank<8?1:rank<64?2:3,rounds:rank<8?1:2,beam:4+Math.floor(rank/4),future:.12+rank/95*.55,risk:.2+rank/95*.6};
}
function aiWick(c){return !!c&&c.c===0&&c.a===0&&(c.fod||c.n==='余芯')}
function aiNormaliseWick(c){if(aiWick(c)){c.fod=true;c.e=1;c.a0=0;c.h0=c.h0??1}return c}
function aiPaidPlayBudget(){
 const level=aiCampaignLevel();if(G.turn===1||level<2)return 1;
 if(level===2)return G.lv>=9&&G.turn%3===0?2:1;
 if(level===3)return G.turn%2===0?2:1;return 2;
}
function openingUnitValue(c){
 if(!c)return 0;
 const fx=c.bossEffects||{};
 return Math.max(0,c.a)*1.8+Math.max(0,c.h)*.6+(bossHasSkill(c,'guard')?1:0)+(bossHasSkill(c,'fly')?.85:0)+(bossHasSkill(c,'parry')?.7:0)+(bossHasSkill(c,'thorn')?.5:0)+(bossHasSkill(c,'poison')?.6:0)+(bossHasSkill(c,'vamp')?.55:0)+(bossHasSkill(c,'regen')?.45:0)+(c.zeroAttackPunish?.9:0)+(c.growth?.9:0)+(c.mv?.25:0)+(c.x==='rekindle'&&!c.rk?.7:0)+(c.dd||0)*.4+(c.death==='spiders'?1.1:c.death==='draw'?1:c.death==='heal'?.6:c.death==='emberling'?.9:0)+(fx.shield||0)*.25-(c.poison||0)*.3;
}
function aiFutureValue(c){return openingUnitValue(c)}
function aiCloneCard(c){
 if(!c)return null;
 return {...c,origin:c.origin||c,bossEffects:c.bossEffects?{...c.bossEffects,skills:c.bossEffects.skills?.slice()}:undefined,bossWickOriginal:c.bossWickOriginal?aiCloneCard(c.bossWickOriginal):undefined};
}
function aiEvaluatePosition(enemy,player,options={}){
 const b={e:enemy.map(aiCloneCard),p:player.map(aiCloneCard)},hp={e:options.ehp??G.ehp,p:options.hp??G.hp};
 let turn=options.turn??G.turn,first=options.first||roundFirstSide(),hand=options.handValue||0,tempsRestored=false,passiveUsed=options.passiveUsed??(G.passiveTurn===turn),fireSeedSpent=!!options.fireSeedSpent;const charged=[];
 const states={e:options.bossSkill??G.bossSkill,p:options.playerBossSkill??G.playerBossSkill};
 const redirects={};for(const side of ['e','p']){const r=states[side]?.heroRedirect;redirects[side]=r?{...r,card:b[side].find(c=>c&&(c.origin===(r.card?.origin||r.card)))}:null}
 const remaining={e:options.remaining?.e??G.ed?.length??0,p:options.remaining?.p??G.draw?.length??0},sign=side=>side==='e'?1:-1,other=side=>side==='e'?'p':'e';
 const draw=(side,n)=>{const count=Math.min(n,remaining[side]);remaining[side]-=count;hand+=sign(side)*count*.65};
 function death(side,i,c){
  if(c.death==='spiders'||c.death==='emberling')for(let k=0;k<(c.death==='spiders'?2:1);k++){
   const token={n:c.death==='spiders'?'鎏金灯蛛':'鎏金余芯',a:c.death==='spiders'?0:1,h:1,h0:1,c:0,at:'物理',token:true,t:turn};
   const lane=LANE_LIST.filter(j=>!b[side][j]).sort((a,z)=>Math.abs(a-i)-Math.abs(z-i)||a-z)[0];
   if(lane==null)hand+=sign(side)*.3;else b[side][lane]=token;
  }else if(c.death==='draw')draw(side,2);else if(c.death==='heal')hp[side]=Math.min(7,hp[side]+2);
 }
 function remove(side,i,deferred=null){
  const c=b[side][i];if(!c)return;b[side][i]=null;
  if(c.s==='bones')b[side][i]={...BONE,h0:1,t:turn};
  if(c.x==='rekindle'&&!c.rk)hand+=sign(side)*.8;draw(side,c.dd||0);
  if(c.death){if(deferred)deferred.push({side,i,c});else death(side,i,c)}
 }
 function hurt(side,c,n,shieldOverride=null,defer=false){
  if(!c||!b[side].includes(c)||n<=0)return 0;
  const fx=c.bossEffects||{},shield=shieldOverride??fx.shield??0;let damage=n;
  if(shield>0){damage=0;delete fx.shield}
  if(damage<=0)return 0;c.h-=damage;if(c.h<=0&&!defer)remove(side,b[side].indexOf(c));return damage;
 }
 function heroDamage(side,n){
  const r=redirects[side];if(r&&r.untilTurn===turn&&b[side].includes(r.card)&&n>0){const d=Math.min(n,r.amount);n-=d;redirects[side]=null;hurt(side,r.card,d)}
  hp[side]=Math.max(0,hp[side]-Math.max(0,n));
 }
 function push(side,c){if(c.bossEffects?.lockMove)return;const i=b[side].indexOf(c);for(const d of i<2?[1,-1]:[-1,1]){const j=i+d;if(j>=0&&j<5&&!b[side][j]){b[side][j]=c;b[side][i]=null;return}}}
 function strike(side,a){
  const i=b[side].indexOf(a);if(i<0||a.bossEffects?.skipAttack)return;
  const them=other(side),t=b[them][i],base=effectiveCardAttack(a,t);if(base<=0)return;
  const fx=a.bossEffects||{},reduce=fx.attackReduction||0;delete fx.attackReduction;
  if(!t||(bossHasSkill(a,'fly')&&!bossHasSkill(t,'guard'))){heroDamage(them,Math.max(0,base-reduce));if(fx.selfDamage)hurt(side,a,fx.selfDamage);return}
  const tf=t.bossEffects||{},shield=tf.shield||0;
  let damage=Math.max(0,bossAttackDamage(a,t,!!fx.pierce)-reduce);delete fx.pierce;
  if(a.at==='火'&&tf.fireWeakness){damage+=tf.fireWeakness;delete tf.fireWeakness}
  const parried=bossHasSkill(t,'parry')&&damage<=1;let reflect=0,actual=0;
  if(tf.parryOnce){damage=Math.max(0,damage-1);reflect++;delete tf.parryOnce}
  if(parried)reflect++;else{actual+=hurt(them,t,damage,shield,true);if(bossHasSkill(t,'thorn'))reflect++}
  if(reflect)hurt(side,a,reflect,null,true);
  if(fx.extraDamage){const extra=fx.extraDamage;delete fx.extraDamage;if(fx.extraElement==='雷'&&fx.reflectParry&&bossHasSkill(t,'parry'))hurt(side,a,extra,null,true);else if(t.h>0){let n=extra;if(fx.extraElement==='火'&&tf.fireWeakness){n+=tf.fireWeakness;delete tf.fireWeakness}actual+=hurt(them,t,n,null,true)}}
  if(actual>0){
   if(bossHasSkill(a,'vamp'))a.h=Math.min(a.h0??a.h,a.h+1);
   if(bossHasSkill(a,'poison')&&t.h>0)t.poison=Math.max(t.poison||0,2);
   if(fx.healOnHit){a.h=Math.min(a.h0??a.h,a.h+fx.healOnHit);delete fx.healOnHit}
   if(fx.heroHealOnHit){hp[side]=Math.min(7,hp[side]+fx.heroHealOnHit);delete fx.heroHealOnHit}
  }
  if(t.h<=0&&b[them].includes(t)){remove(them,b[them].indexOf(t));if(a.h>0){if(a.growth)a.a++;else if(a.x==='soul')a.a=Math.max(a.a,Math.min(3,a.a+1));if(a.bossEffects?.healOnKill){a.h=Math.min(a.h0??a.h,a.h+a.bossEffects.healOnKill);delete a.bossEffects.healOnKill}}}
  if(a.h<=0&&b[side].includes(a))remove(side,b[side].indexOf(a));
  if(b[side].includes(a)&&b[them].includes(t)&&actual>0&&!parried&&(bossHasSkill(a,'push')||a.mv==='push'))push(them,t);
  if(fx.selfDamage)hurt(side,a,fx.selfDamage);
 }
 function cleanup(){
  for(const side of ['p','e'])for(const c of [...b[side]]){if(!c)continue;if(c.bossEffects?.roundEndDamage)hurt(side,c,c.bossEffects.roundEndDamage);const i=b[side].indexOf(c);if(i>=0&&c.bossExpiresTurn!=null&&c.bossExpiresTurn<=turn)b[side][i]=null}
  const entries=tempsRestored?[]:[...(states.e?.temp||[]),...(states.p?.temp||[]),...(options.temp||[])];tempsRestored=true;
  for(const entry of entries){const c=[...b.e,...b.p].find(x=>x&&(x.origin===(entry.card?.origin||entry.card)));if(!c)continue;if(entry.key==='a')c.a=Math.max(0,c.a-(entry.delta||0));else if(entry.had)c[entry.key]=entry.value;else delete c[entry.key]}
  for(const entry of charged.splice(0))entry.card.a=Math.max(0,entry.card.a-entry.delta);
  for(const c of [...b.e,...b.p])if(c)delete c.bossEffects;redirects.e=null;redirects.p=null;
 }
 function advance(){
  turn++;first=other(first);
  for(const side of ['p','e'])for(let i=0;i<5;i++){const c=b[side][i];if(c?.bossWickOriginal&&c.bossWickRestoreTurn<=turn)b[side][i]=aiCloneCard(c.bossWickOriginal)}
  for(const state of Object.values(states))for(const entry of state?.deferred||[]){if(entry.turn!==turn)continue;const c=[...b.e,...b.p].find(x=>x&&x.origin===(entry.card?.origin||entry.card));if(!c)continue;if(entry.kind==='charge'){const delta=entry.delta||1;c.a+=delta;charged.push({card:c,delta})}else if(entry.kind==='grow'){c.a=entry.a??1;c.h=entry.h??2;c.a0=c.a;c.h0=c.h}}
 }
 if(options.plan){
  const plan=options.plan,deferred=[];
  for(const i of plan.sacs){const old=b.e[i];remove('e',i,deferred);
   if(old?.fod&&!passiveUsed&&!(aiCampaignLevel()===0&&turn%2===1)){
    const allies=b.e.filter(c=>c&&!c.fod);if(G.st?.pas==='血'){const c=allies.find(x=>x.a<3);if(c){c.a++;passiveUsed=true}}
    else if(G.st?.pas==='环'&&turn%2===0){const c=allies.find(x=>x.h0<6);if(c){c.h++;c.h0++;passiveUsed=true}}
    else if(G.st?.pas==='狼'){const c=b.p.filter(x=>x&&x.h>1).sort((a,z)=>z.h-a.h)[0];if(c){c.h--;passiveUsed=true}}
   }
  }
  b.e[plan.lane]=aiCloneCard(plan.c);b.e[plan.lane].t=turn;
  for(const d of deferred)death(d.side,d.i,d.c);
  draw('e',plan.c.dr||0);hp.e=Math.min(7,hp.e+(plan.c.heal||0)+(plan.c.x==='ember'?1:0));
  const seed=states.p?.fireSeed;if(!fireSeedSpent&&seed&&seed.lane===plan.lane&&seed.expiresTurn>=turn){hurt('e',b.e[plan.lane],1);fireSeedSpent=true}
 }
 if(options.phase==='after_attack'){cleanup();advance()}
 const rounds=options.combat===false?0:Math.max(1,Math.min(3,options.rounds||1));
 for(let round=0;round<rounds&&hp.e>0&&hp.p>0;round++){
  const actors={p:b.p.filter(Boolean),e:b.e.filter(Boolean)},delayed=[];
  for(const side of [first,other(first)]){for(const c of actors[side]){if(!b[side].includes(c))continue;if(c.bossEffects?.lateAttack)delayed.push({side,c});else strike(side,c);if(hp.e<=0||hp.p<=0)break}if(hp.e<=0||hp.p<=0)break}
  if(hp.e<=0||hp.p<=0)break;
  for(const {side,c}of delayed){strike(side,c);if(hp.e<=0||hp.p<=0)break}if(hp.e<=0||hp.p<=0)break;
  for(const side of ['p','e'])for(const c of [...b[side]]){if(!c||!b[side].includes(c))continue;if(c.poison){c.poison--;hurt(side,c,1)}if(b[side].includes(c)&&bossHasSkill(c,'regen')&&c.h<(c.h0??c.h))c.h++}
  cleanup();if(round<rounds-1)advance();
 }
 const material=side=>b[side].reduce((n,c)=>n+openingUnitValue(c),0);
 const safety=h=>h<=0?-100000:h*3.5-(h<3?(3-h)*2.5:0);
 const score=(hp.p<=0?100000:0)-(hp.e<=0?100000:0)+safety(hp.e)-safety(hp.p)+material('e')-material('p')+hand;
 return {e:b.e,p:b.p,hp:hp.p,ehp:hp.e,score,material:material('e')-material('p'),handValue:hand,passiveUsed,fireSeedSpent,remaining};
}
function openingSacrificeSets(c,board=G.e,turn=G.turn){
 const mature=LANE_LIST.filter(i=>board[i]&&!board[i].bossNoSacrifice&&Number.isInteger(board[i].t)&&board[i].t>=0&&board[i].t<turn),sets=[];
 function take(at,chosen){if(chosen.length===(c.c||0)){sets.push(chosen);return}for(let k=at;k<mature.length;k++)take(k+1,[...chosen,mature[k]])}take(0,[]);return sets;
}
function openingForecast(plan=null,options={}){return aiEvaluatePosition(options.e||G.e,options.p||G.p,{...options,plan})}
function openingChoiceAllowed(plan,before,after){
 if(after.ehp<=0&&before.ehp>0)return false;
 if(after.hp<=0&&after.ehp>0||before.ehp<=0&&after.ehp>0)return true;
 // Saving the hero outranks keeping a profitable lane. Otherwise, spending a
 // winning fighter must buy a meaningful improvement, not a nominal stat swap.
 const emergency=after.ehp>=before.ehp+2;
 for(const i of plan.sacs){
  const old=G.e[i];if(!old||aiWick(old))continue;
  const survivor=before.e.find(c=>c?.origin===old),target=G.p[i];
  const winning=survivor&&(!target||!before.p.some(c=>c?.origin===target)||old.s==='guard'&&target.s==='fly'||effectiveCardAttack(old,target)>0&&dealt(old,target)>=dealt(target,old));
  if(winning&&!emergency&&after.score-before.score<Math.max(1,openingUnitValue(survivor)*.3))return false;
 }
 return true;
}
function aiDeploymentPosition(plan,after){
 const survivor=after.e.find(c=>c?.origin===plan.c),target=G.p[plan.lane];let score=0;
 if(aiWick(plan.c))score+=survivor?.5:-.3;
 if(survivor&&plan.c.growth&&target&&!after.p.some(c=>c?.origin===target))score+=.25;
 // Keep central spaces available to mobile fighters; edge resources are less
 // likely to obstruct a useful future swap or a new defensive deployment.
 if(aiWick(plan.c)&&survivor)score+=Math.abs(plan.lane-2)*.02;
 return score;
}
function aiSkillWickReserve(options){
 if(options.ignoreSkillReserve||!bossAbilityCanReserveWick())return null;
 const cfg=bossAbilityForStage(),wick=bossSkillWickCard('e');
 if(typeof aiBossSkillValue==='function'){
  const preview=aiBossSkillValue(cfg,cfg.timing);
  if(!preview.use)return null;
  // A skill is an option, not a reason to withhold the only legal blocker.
  // Compare its value with putting the reserved resource on the public table.
  if(!options.noWick&&wick){
   const before=openingForecast();
   for(const lane of LANE_LIST.filter(i=>!G.e[i])){
    const after=openingForecast({c:wick,sacs:[],lane});
    if(after.ehp>0&&before.ehp<=0&&(cfg.timing==='after_attack'||preview.gain<50000)||after.score-before.score>Math.max(.5,preview.gain)+.35)return null;
   }
  }
 }
 return wick;
}
function aiFollowupValue(plan,options,reserved){
 const position=openingForecast(plan,{combat:false}),paidLeft=(options.paidRemaining??aiPaidPlayBudget())-(plan.c.c>0?1:0);
 const hand=G.eh.filter((c,i)=>i!==plan.i&&c!==reserved&&!frozenTurns(c)&&!(c.c>0&&(paidLeft<=0||options.noPaid))&&!(aiWick(c)&&(options.noWick||aiWick(plan.c)))&&!(c.c===0&&!aiWick(c)&&(options.noZero||plan.c.c===0&&!aiWick(plan.c))));
 let gain=0;
 // A bounded second deployment is drawn only from the current known hand.
 // New bodies keep this round's timestamp and remain illegal sacrifices.
 for(const c of hand)for(const sacs of openingSacrificeSets(c,position.e))for(const lane of LANE_LIST.filter(j=>!position.e[j]||sacs.includes(j))){
  const after=aiEvaluatePosition(position.e,position.p,{hp:position.hp,ehp:position.ehp,handValue:position.handValue,passiveUsed:position.passiveUsed,fireSeedSpent:position.fireSeedSpent,remaining:position.remaining,plan:{c,sacs,lane}});
  if(after.ehp<=0&&plan.after.ehp>0)continue;
  gain=Math.max(gain,after.score-plan.after.score-openingUnitValue(c)*.06);
 }
 return Math.min(100000,gain);
}
function aiChooseDeployment(options={}){
 const profile=aiProfile(),before=openingForecast(),longBefore=profile.depth>1?openingForecast(null,{rounds:2}):before,reserved=aiSkillWickReserve(options),candidates=[];
 G.eh.forEach((c,i)=>{
  if(c===reserved||frozenTurns(c)||options.ashOnly&&!aiWick(c)||options.noWick&&aiWick(c)||options.noPaid&&c.c>0||options.noZero&&c.c===0&&!aiWick(c))return;
  for(const sacs of openingSacrificeSets(c))for(const lane of LANE_LIST.filter(j=>!G.e[j]||sacs.includes(j))){
   const plan={c,i,sacs,lane},after=openingForecast(plan);if(!openingChoiceAllowed(plan,before,after))continue;
   const gain=after.score-before.score;
   let score=gain+aiDeploymentPosition(plan,after)-(!aiWick(c)?openingUnitValue(c)*.035:0);
   if(gain<=.1&&profile.depth===1)continue;
   candidates.push({...plan,score,immediate:gain,after});
  }
 });
 candidates.sort((a,b)=>b.score-a.score||a.sacs.length-b.sacs.length||a.i-b.i||a.lane-b.lane);
 // Search all legal sacrifice/lane combinations for safety at every level.
 // Later guardians also compare future visible exchanges and retained bodies.
 let choice=null;
 const finalists=candidates.slice(0,profile.depth>1?profile.beam:1);
 for(const [index,plan]of finalists.entries()){
  let score=plan.score;
  if(profile.depth>1){
   const future=openingForecast(plan,{rounds:2}),delta=future.score-longBefore.score;
   if(future.ehp<=0&&longBefore.ehp>0&&plan.after.hp>0)continue;
   score+=Math.max(-80,Math.min(80,delta))*profile.future;
   const bodies=plan.after.e.filter(Boolean),food=bodies.filter(c=>aiWick(c)||c.a===0).length;
   const next=G.eh.filter((c,i)=>i!==plan.i&&!frozenTurns(c)&&c.c>0&&c.c<=food);
   score+=Math.min(2,food)*(.08+profile.rank*.003)+(next.length?Math.max(...next.map(openingUnitValue))*.04:0);
  }
  if(profile.depth>=3&&index<4)score+=aiFollowupValue(plan,options,reserved)*.7;
  if(plan.immediate<=.1&&score<=.15)continue;
  if(!choice||score>choice.score+.00001)choice={c:plan.c,i:plan.i,sacs:plan.sacs,lane:plan.lane,score};
 }
 return choice&&choice.score>.15?choice:null;
}
function openingEnemyChoice(){return aiChooseDeployment()}
function aiColumnValue(enemy,player){
 const e=Array(5).fill(null),p=Array(5).fill(null);e[2]=enemy;p[2]=player;
 const result=aiEvaluatePosition(e,p);return {...result,damage:Math.max(0,G.ehp-result.ehp),hit:Math.max(0,G.hp-result.hp),enemy:result.e[2],player:result.p[2]};
}
function aiChooseMove(index){
 const card=G.e[index];if(!card)return null;const profile=aiProfile(),before=openingForecast(),longBefore=profile.depth>1?openingForecast(null,{rounds:2}):before;let best=null;
 for(const d of [-1,1]){
  if(!canMove('e',index,d))continue;const e=G.e.slice();[e[index],e[index+d]]=[e[index+d],e[index]];
  const after=aiEvaluatePosition(e,G.p);if(after.ehp<=0&&before.ehp>0)continue;
  let score=after.score-before.score;
  if(profile.depth>1){const future=aiEvaluatePosition(e,G.p,{rounds:2});if(future.ehp<=0&&longBefore.ehp>0&&after.hp>0)continue;score+=Math.max(-80,Math.min(80,future.score-longBefore.score))*profile.future}
  if(score>(.9-profile.rank/95*.6)&&(!best||score>best.score))best={d,score};
 }
 return best;
}
