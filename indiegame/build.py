"""Build Lantern Oath from its own source and original setting data."""
from pathlib import Path
import json,re,hashlib,zipfile
ROOT=Path(__file__).resolve().parent
VERSION='1.0.0'

def read(name):return(ROOT/name).read_text(encoding='utf-8')
def data(name):return json.loads(read('data/'+name+'.json'))
def js(value):return json.dumps(value,ensure_ascii=False,separators=(',',':'))
def fingerprint(name,ext,content):
 raw=content.encode();digest=hashlib.sha256(raw).hexdigest()[:12];path='assets/'+name+'.'+digest+'.'+ext
 (ROOT/path).write_bytes(raw);return path

cards=data('cards');assert len(cards)==988 and len({c['n']for c in cards})==988
runtime=read('src/runtime.template.js')
for key,file in [('__PORTRAIT_SOURCE__','src/portraits.js'),('__STORY_SOURCE__','src/story.js'),('__COIN_SOURCE__','src/coin.js'),('__SOUND_SOURCE__','src/sound.js')]:runtime=runtime.replace(key,read(file))
for token,file in [('CARDS','cards'),('CARDS_EN','cards-en'),('PORTRAITS','portraits'),('CAMPAIGNS','campaigns'),('BOSS_ABILITIES','boss-abilities'),('BOSS_DECKS','boss-decks'),('MUSIC_SCORES','music-scores'),('UI_EN','ui-en'),('BOSS_DIALOGUE','boss-dialogue')]:runtime=runtime.replace('__DATA_'+token+'__',js(data(file)))
assert not re.search(r'__(?:DATA_|[A-Z]+_SOURCE)',runtime),'Unresolved build token'
script=fingerprint('pact','js',runtime);style=fingerprint('table','css',read('src/table.css'))
head='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#171a12"><meta name="game-version" content="1.0.0"><meta name="description" content="灯誓牌 Lantern Oath — an original five-lane card game by Will Wang."><title>灯誓牌 · Lantern Oath</title><style>html,body{margin:0;background:#171e17;color:#e4d3a8;font-family:Georgia,"Microsoft YaHei",sans-serif}.entry{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:18px;padding:20px;box-sizing:border-box}.entry img{width:90px;height:106px}.entry h1{font-size:36px;letter-spacing:.08em;margin:0}.entry p{font-size:13px;color:#bcb293}.recovery{position:fixed;z-index:3000;left:5%;right:5%;bottom:16px;padding:14px;background:#233327;border:1px solid #b49b65;border-radius:5px;font:13px/1.6 sans-serif}.recovery[hidden]{display:none}.recovery button{padding:8px 16px;background:#614f2a;color:#eed6a0;border:1px solid #b49b65;border-radius:4px}</style></head><body><div id="app"><main class="entry"><img src="assets/lantern-rest.svg" alt="灯契之灯"><h1 id="entry-title">灯誓牌</h1><p id="entry-copy">正在展开灯契…</p><small>Will Wang</small></main></div><div id="tip"></div><aside id="recovery" class="recovery" hidden><p id="recovery-copy"></p><button id="retry">重新打开 / Retry</button></aside>'''
boot='''(function(){var en=false;try{en=location.search.indexOf('lang=en')>=0||localStorage.getItem('lo_language_v1')==='en'}catch(e){}if(en){document.documentElement.lang='en';document.getElementById('entry-title').textContent='Lantern Oath';document.getElementById('entry-copy').textContent='Unfolding the lamp pacts…'}var done=false;function fail(){if(done)return;document.getElementById('recovery').hidden=false;document.getElementById('recovery-copy').textContent=en?'The game could not load. Retry, or open this address in your system browser.':'牌桌未能载入。请重试，或在系统浏览器打开这个地址。'}document.getElementById('retry').onclick=function(){location.reload()};window.addEventListener('error',function(e){if(e.message)fail()});var css=document.createElement('link');css.rel='stylesheet';css.href=__STYLE__;css.onerror=fail;document.head.appendChild(css);var script=document.createElement('script');script.src=__SCRIPT__;script.onload=function(){if(window.BOOT&&window.BOOT.ready){done=true;document.getElementById('recovery').hidden=true}else fail()};script.onerror=fail;document.head.appendChild(script);setTimeout(function(){if(!done)fail()},10000)})();'''.replace('__STYLE__',js(style)).replace('__SCRIPT__',js(script))
(ROOT/'index.html').write_text(head+'<script>'+boot+'</script></body></html>',encoding='utf-8')
(ROOT/'_headers').write_text('/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/\n  Cache-Control: no-cache\n\n/index.html\n  Cache-Control: no-cache\n')
manifest={'version':VERSION,'cards':len(cards),'stages':sum(map(len,data('campaigns').values())),'bossSkills':len(data('boss-abilities')),'musicTracks':len(data('music-scores')),'script':script,'style':style,'scriptSha256':hashlib.sha256(runtime.encode()).hexdigest()}
(ROOT/'build-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# The single-file edition uses our SVGs as embedded source, with no external images.
import base64
single=runtime
for image in ['lantern-rest.svg','lantern-alight.svg']:
 raw=(ROOT/'assets'/image).read_bytes();single=single.replace('assets/'+image,'data:image/svg+xml;base64,'+base64.b64encode(raw).decode())
(ROOT/'standalone.html').write_text('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>灯誓牌 · Lantern Oath</title><style>'+read('src/table.css')+'</style></head><body><div id="app"></div><div id="tip"></div><script>'+single+'</script></body></html>',encoding='utf-8')
files=['index.html',script,style,'assets/lantern-rest.svg','assets/lantern-alight.svg','assets/font-OFL.txt','_headers','CREDITS.txt']
with zipfile.ZipFile(ROOT/'lantern-oath-web.zip','w',zipfile.ZIP_DEFLATED)as z:
 for file in files:z.write(ROOT/file,file)
print(json.dumps(manifest,ensure_ascii=False))
