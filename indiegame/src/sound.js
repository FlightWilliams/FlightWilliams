// All effects here are generated with oscillators/noise; no recordings are used.
Object.assign(SND,{shuffle:OLD.shuffle,draw:OLD.draw,place:OLD.place,eplace:OLD.place,burn:OLD.burn,
 heal:()=>{tone(523,659,.35,'sine',.12);tone(659,784,.45,'sine',.09,.1);tone(1046,1046,.6,'sine',.045,.18)},
 rare:()=>{tone(1046,1046,.9,'sine',.15);tone(1568,1568,1,'sine',.09,.04);tone(2093,2093,.7,'sine',.04,.08)}});
playCardAttackSound=function(card){
 if(mute)return;const type=cardAttackSoundType(card);
 if(type==='beast'){tone(170,52,.3,'sawtooth',.14);nz(.26,.1,750,160)}
 else if(type==='magic'||type==='spirit'){tone(660,990,.23,'sine',.11);tone(880,440,.3,'triangle',.06,.04);nz(.15,.035,3600,1200)}
 else if(type==='bow'){nz(.06,.15,5500,1800);tone(260,110,.15,'triangle',.09)}
 else if(type==='impact'){tone(100,38,.22,'sine',.25);nz(.11,.12,800,200)}
 else{nz(.1,.15,5000,1700);tone(1480,720,.12,'triangle',.055);tone(130,65,.12,'sine',.1)}
};
