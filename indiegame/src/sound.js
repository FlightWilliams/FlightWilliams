// Both editions use the same recorded effects, levels and procedural fallback.
// The standalone build replaces this marker with the exact same local samples.
/*SHARED_AUDIO_INLINE*/
const SHARED_AUDIO_FILE='assets/sounds.9dd4337a50d2.js';
const SHARED_RECORDED_SOUNDS={...SND};
const sharedRecordedAttack=playCardAttackSound;
const sharedAudioState={audioReady:Object.keys(CARD_AUDIO_SAMPLES).length>0&&Object.keys(COMBAT_AUDIO_SAMPLES).length>0,audioLoading:false,retryAt:0};
let sharedAudioScript=null;
function loadSharedAudio(){
 if(sharedAudioState.audioReady||sharedAudioState.audioLoading||Date.now()<sharedAudioState.retryAt)return;
 sharedAudioState.audioLoading=true;
 const script=document.createElement('script');sharedAudioScript=script;script.async=true;script.src=SHARED_AUDIO_FILE;
 script.onload=()=>{sharedAudioState.audioLoading=false;sharedAudioState.audioReady=true;script.onload=null;script.onerror=null};
 script.onerror=()=>{sharedAudioState.audioLoading=false;sharedAudioState.retryAt=Date.now()+30000;script.onload=null;script.onerror=null;script.remove();if(sharedAudioScript===script)sharedAudioScript=null};
 document.head.appendChild(script);
}
sharedAudioState.loadAudio=loadSharedAudio;
window.LANTERN_AUDIO=sharedAudioState;
for(const kind of ['draw','shuffle','place','eplace','burn','heal','rare']){
 SND[kind]=()=>{
  if(sharedAudioState.audioReady)return SHARED_RECORDED_SOUNDS[kind]?.();
  loadSharedAudio();
  const basic=OLD[kind==='eplace'?'place':kind];
  if(basic)return basic();
  if(kind==='heal'){tone(523,659,.3,'sine',.12);tone(659,784,.4,'sine',.09,.12)}
  else if(kind==='rare'){tone(1046,1046,.8,'sine',.15);tone(1568,1568,.9,'sine',.09,.04)}
 };
}
playCardAttackSound=function(card){
 if(sharedAudioState.audioReady)return sharedRecordedAttack(card);
 loadSharedAudio();return OLD.hit();
};
function scheduleSharedAudio(){
 if(sharedAudioState.audioReady)return;
 const idle=()=>{if(!document.hidden)loadSharedAudio()};
 if(window.requestIdleCallback)window.requestIdleCallback(idle,{timeout:1800});else setTimeout(idle,600);
}
if(window.requestAnimationFrame)window.requestAnimationFrame(scheduleSharedAudio);else setTimeout(scheduleSharedAudio,0);
