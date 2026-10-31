"""Build Lantern Oath from its own source and original setting data."""
from pathlib import Path
import json,re,hashlib,zipfile,struct
ROOT=Path(__file__).resolve().parent
VERSION='1.1.5'
SOUNDS='assets/sounds.9dd4337a50d2.js'

def read(name):return(ROOT/name).read_text(encoding='utf-8')
def data(name):return json.loads(read('data/'+name+'.json'))
def js(value):return json.dumps(value,ensure_ascii=False,separators=(',',':'))
def manuscript(text):return '\n\n'.join(line for line in text.splitlines()if line.strip())
def fingerprint(name,ext,content):
 raw=content.encode();digest=hashlib.sha256(raw).hexdigest()[:12];path='assets/'+name+'.'+digest+'.'+ext
 (ROOT/path).write_bytes(raw);return path
def painting_info(raw,image):
 if len(raw)>=24 and raw[:8]==b'\x89PNG\r\n\x1a\n'and raw[12:16]==b'IHDR':
  width,height=struct.unpack('>II',raw[16:24]);return 'image/png',width,height
 if len(raw)>=20 and raw[:4]==b'RIFF'and raw[8:12]==b'WEBP':
  assert int.from_bytes(raw[4:8],'little')+8==len(raw),'Invalid WebP container: '+image
  offset=12
  while offset+8<=len(raw):
   kind=raw[offset:offset+4];size=int.from_bytes(raw[offset+4:offset+8],'little');chunk=raw[offset+8:offset+8+size]
   assert len(chunk)==size,'Truncated WebP chunk: '+image
   if kind==b'VP8X'and size>=10:
    return 'image/webp',int.from_bytes(chunk[4:7],'little')+1,int.from_bytes(chunk[7:10],'little')+1
   if kind==b'VP8L'and size>=5 and chunk[0]==0x2f:
    bits=int.from_bytes(chunk[1:5],'little');return 'image/webp',(bits&0x3fff)+1,((bits>>14)&0x3fff)+1
   if kind==b'VP8 'and size>=10 and chunk[3:6]==b'\x9d\x01\x2a':
    return 'image/webp',int.from_bytes(chunk[6:8],'little')&0x3fff,int.from_bytes(chunk[8:10],'little')&0x3fff
   offset+=8+size+(size&1)
 raise AssertionError('Painting must be a supported PNG or WebP: '+image)

cards=data('cards');assert len(cards)==988 and len({c['n']for c in cards})==988
painted_art=data('painted-art')
ordinary={card['n']for card in cards if not card.get('baseName')}
assert ordinary<=painted_art.keys(),'Every ordinary card needs its own painting'
painted_paths=sorted({art['atlas']for art in painted_art.values()})
painted_cells=set();painted_assets=[]
for card_id,art in painted_art.items():
 assert re.fullmatch(r'assets/oil-[a-z0-9.-]+\.(?:png|webp)',art['atlas']),'Invalid painting path: '+card_id
 assert all(type(art.get(key))is int for key in ['column','row','columns','rows']),'Invalid painting coordinates: '+card_id
 assert art['columns']>0 and art['rows']>0 and 0<=art['column']<art['columns']and 0<=art['row']<art['rows'],'Painting cell out of bounds: '+card_id
 assert art.get('kind')in ['person','animal','object'],'Invalid painting subject: '+card_id
 if card_id in ordinary:
  cell=(art['atlas'],art['column'],art['row'])
  assert cell not in painted_cells,'Ordinary cards must not reuse the same painting: '+card_id
  painted_cells.add(cell)
for card in cards:
 if card.get('baseName')and card['n']in painted_art:
  assert painted_art[card['n']]==painted_art[card['baseName']],'Gold editions must share their ordinary painting'
for image in painted_paths:
 raw=(ROOT/image).read_bytes()
 mime,width,height=painting_info(raw,image)
 assert image.endswith('.png'if mime=='image/png'else'.webp'),'Painting extension does not match its image format: '+image
 grids={(art['columns'],art['rows'])for art in painted_art.values()if art['atlas']==image}
 assert len(grids)==1,'An atlas must use a single grid: '+image
 columns,rows=next(iter(grids))
 assert width>=columns*80 and height>=rows*80,'Painting cells are too small: '+image
 assert abs(width*rows-height*columns)<=max(columns,rows),'Painting cells must remain square: '+image
 assert len(raw)<25*1024*1024,'Painting exceeds the static hosting per-file limit: '+image
 painted_assets.append({'path':image,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw),'mime':mime,'width':width,'height':height,'columns':columns,'rows':rows})
# Resolve shared atlas URLs once, so the offline edition embeds each image only once.
painted_art_js=js(painted_art)
for index,image in enumerate(painted_paths):
 painted_art_js=painted_art_js.replace('"atlas":'+js(image),'"atlas":CARD_PAINTED_ATLASES['+str(index)+']')
painted_registry='const CARD_PAINTED_ATLASES='+js(painted_paths)+';'
runtime=painted_registry+'\nconst CARD_PAINTED_ART='+painted_art_js+';\n'+read('src/runtime.template.js')
for key,file in [('__NARRATIVE_SOURCE__','src/narrative.js'),('__AI_SOURCE__','src/ai.js'),('__BOSS_AI_POLICY_SOURCE__','src/boss-ai-policy.js'),('__PORTRAIT_SOURCE__','src/portraits.js'),('__STORY_SOURCE__','src/story.js'),('__COIN_SOURCE__','src/coin.js'),('__SOUND_SOURCE__','src/sound.js'),('__PLAYER_SKILL_UI_SOURCE__','src/player-skill-ui.js'),('__PLAYER_SKILL_EFFECTS_SOURCE__','src/player-skill-effects.js')]:runtime=runtime.replace(key,read(file))
for token,file in [('BOSS_ENTRANCES','boss-entrances'),('BOSS_IDENTITIES','boss-identities'),('BOSS_ABILITY_LEGACY','boss-ability-legacy'),('CARD_NAMES','card-names'),('CARD_STORIES','card-stories'),('LOOP_STORY','loop-story'),('STORY_CAST','story-cast'),('COMPANION_DIALOGUE','companion-dialogue'),('CARDS','cards'),('CARDS_EN','cards-en'),('PORTRAITS','portraits'),('CAMPAIGNS','campaigns'),('BOSS_ABILITIES','boss-abilities'),('BOSS_DECKS','boss-decks'),('MUSIC_SCORES','music-scores'),('UI_EN','ui-en'),('BOSS_DIALOGUE','boss-dialogue')]:runtime=runtime.replace('__DATA_'+token+'__',js(data(file)))
assert not re.search(r'__(?:DATA_|[A-Z_]+_SOURCE)',runtime),'Unresolved build token'
script=fingerprint('pact','js',runtime);styles=read('src/table.css')+'\n'+read('src/horror-theme.css')+'\n'+read('src/chapter-theme.css')+'\n'+read('src/player-skill-ui.css')+'\n'+read('src/player-skill-effects.css')+'\n'+read('src/oil-portraits.css')+'\n'+read('src/mobile-cards.css');style=fingerprint('table','css',styles)
head='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#171a12"><meta name="game-version" content="1.1.5"><meta name="description" content="灯誓牌 Lantern Oath — an original cosmic-horror card mystery by Will Wang."><title>灯誓牌 · Lantern Oath</title><style>html,body{margin:0;background:#171e17;color:#e4d3a8;font-family:Georgia,"Microsoft YaHei",sans-serif}.entry{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:18px;padding:20px;box-sizing:border-box}.entry img{width:90px;height:106px}.entry h1{font-size:36px;letter-spacing:.08em;margin:0}.entry p{font-size:13px;color:#bcb293}.recovery{position:fixed;z-index:3000;left:5%;right:5%;bottom:16px;padding:14px;background:#233327;border:1px solid #b49b65;border-radius:5px;font:13px/1.6 sans-serif}.recovery[hidden]{display:none}.recovery button{padding:8px 16px;background:#614f2a;color:#eed6a0;border:1px solid #b49b65;border-radius:4px}</style></head><body><div id="app"><main class="entry"><img src="assets/lantern-rest.svg" alt="灯契之灯"><h1 id="entry-title">灯誓牌</h1><p id="entry-copy">正在核对案卷…</p><small>Will Wang</small></main></div><div id="tip"></div><aside id="recovery" class="recovery" hidden><p id="recovery-copy"></p><button id="retry">重新打开 / Retry</button></aside>'''
boot='''(function(){var en=false;try{en=location.search.indexOf('lang=en')>=0||localStorage.getItem('lo_language_v1')==='en'}catch(e){}if(en){document.documentElement.lang='en';document.getElementById('entry-title').textContent='Lantern Oath';document.getElementById('entry-copy').textContent='Retrieving the case file…'}var done=false;function fail(){if(done)return;document.getElementById('recovery').hidden=false;document.getElementById('recovery-copy').textContent=en?'The game could not load. Retry, or open this address in your system browser.':'牌桌未能载入。请重试，或在系统浏览器打开这个地址。'}document.getElementById('retry').onclick=function(){location.reload()};window.addEventListener('error',function(e){if(e.message)fail()});var css=document.createElement('link');css.rel='stylesheet';css.href=__STYLE__;css.onerror=fail;document.head.appendChild(css);var script=document.createElement('script');script.src=__SCRIPT__;script.onload=function(){if(window.BOOT&&window.BOOT.ready){done=true;document.getElementById('recovery').hidden=true}else fail()};script.onerror=fail;document.head.appendChild(script);setTimeout(function(){if(!done)fail()},10000)})();'''.replace('__STYLE__',js(style)).replace('__SCRIPT__',js(script))
(ROOT/'index.html').write_text(head+'<script>'+boot+'</script></body></html>',encoding='utf-8')
(ROOT/'_headers').write_text('/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n\n/\n  Cache-Control: no-cache\n\n/index.html\n  Cache-Control: no-cache\n')
manifest={'version':VERSION,'cards':len(cards),'stages':sum(map(len,data('campaigns').values())),'bossSkills':len(data('boss-abilities')),'bossEntrances':len(data('boss-entrances')),'musicTracks':len(data('music-scores')),'sounds':SOUNDS,'script':script,'style':style,'scriptSha256':hashlib.sha256(runtime.encode()).hexdigest(),'paintedCards':len(ordinary),'paintingAtlases':painted_assets}
(ROOT/'build-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
# The single-file edition embeds every SVG and oil atlas, with no external images.
import base64
single=runtime.replace('/*SHARED_AUDIO_INLINE*/',read(SOUNDS))
painted_inline=[[asset['mime'],base64.b64encode((ROOT/asset['path']).read_bytes()).decode()]for asset in painted_assets]
# Shared short blob URLs also keep cached portrait markup small: a large data URL
# must not be copied into every card's SVG string when opening the collection.
inline_registry='const CARD_PAINTED_ATLASES='+js(painted_inline)+'''.map(([mime,encoded])=>{
 const binary=atob(encoded),bytes=new Uint8Array(binary.length);
 for(let index=0;index<binary.length;index++)bytes[index]=binary.charCodeAt(index);
 return URL.createObjectURL(new Blob([bytes],{type:mime}));
});'''
single=single.replace(painted_registry,inline_registry,1)
for image in ['lantern-rest.svg','lantern-alight.svg']:
 raw=(ROOT/'assets'/image).read_bytes();single=single.replace('assets/'+image,'data:image/svg+xml;base64,'+base64.b64encode(raw).decode())
(ROOT/'standalone.html').write_text('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>灯誓牌 · Lantern Oath</title><style>'+styles+'</style></head><body><div id="app"></div><div id="tip"></div><script>'+single+'</script></body></html>',encoding='utf-8')
# A readable, spoiler-containing manuscript is exported from the same story data.
# It is optional reading and does not add a request to the gameplay startup path.
plot=data('loop-story');story_files=[]
(ROOT/'story').mkdir(exist_ok=True)
for language,filename in [('zh','zh-CN.md'),('en','en.md')]:
 sections=['# 灯誓牌 · '+plot['title']['zh'] if language=='zh'else '# Lantern Oath · '+plot['title']['en'],
  '作者：Will Wang。完整剧情稿，包含结局。'if language=='zh'else 'By Will Wang. Complete story manuscript, including the ending.',
  '## '+plot['opening'][language]['title'],manuscript(plot['opening'][language]['text'])]
 for index,chapter in enumerate(plot['chapters'].values(),1):
  sections.extend(['## '+str(index)+' · '+chapter['name'][language]])
  for part in ['intro','clear']:
   sections.extend(['### '+chapter[part][language]['title'],manuscript(chapter[part][language]['text'])])
 sections.extend(['## '+plot['loop'][language]['returnTitle'],manuscript(plot['loop'][language]['returnText'])])
 path='story/'+filename;(ROOT/path).write_text('\n\n'.join(sections)+'\n',encoding='utf-8');story_files.append(path)
# Export the encounter roster so the names, roles and rules can be reviewed together.
identities=data('boss-identities');abilities={row['boss']:row for row in data('boss-abilities')};translations=data('ui-en')
for language,filename in [('zh','bosses.zh-CN.md'),('en','bosses.en.md')]:
 sections=['# Boss名册'if language=='zh'else '# Boss Roster','']
 def roster_row(boss,number):
  identity=identities[boss];ability=abilities[boss]
  cells=[str(number),identity['zh'if language=='zh'else'en'],identity['roleZh'if language=='zh'else'roleEn'],ability['name'if language=='zh'else'nameEn'],ability['description']if language=='zh'else translations[ability['description']]]
  return '| '+' | '.join(str(value).replace('|',' / ').replace('\n',' ')for value in cells)+' |'
 main=set()
 for world,stages in data('campaigns').items():
  sections.extend(['','## '+plot['chapters'][world]['name'][language],'',
   '| 关卡 | 姓名 | 身份 | 技能 | 效果 |'if language=='zh'else '| Stage | Name | Identity | Ability | Effect |',
   '| --- | --- | --- | --- | --- |'])
  for index,stage in enumerate(stages,1):sections.append(roster_row(stage['boss'],index));main.add(stage['boss'])
 sections.extend(['','## 收藏中的其他Boss'if language=='zh'else '## Other Collected Bosses','',
  '| 编号 | 姓名 | 身份 | 技能 | 效果 |'if language=='zh'else '| No. | Name | Identity | Ability | Effect |',
  '| --- | --- | --- | --- | --- |'])
 for index,boss in enumerate((boss for boss in identities if boss not in main),1):sections.append(roster_row(boss,index))
 path='story/'+filename;(ROOT/path).write_text('\n'.join(sections)+'\n',encoding='utf-8');story_files.append(path)
entrances=data('boss-entrances');display_names=data('card-names')
for language,filename in [('zh','entrances.zh-CN.md'),('en','entrances.en.md')]:
 sections=['# Boss出场集'if language=='zh'else '# Boss Entrances','作者：Will Wang。包含所有关卡出场。'if language=='zh'else 'By Will Wang. Contains every encounter entrance.']
 for world,stages in data('campaigns').items():
  sections.append('## '+plot['chapters'][world]['name'][language])
  for index,stage in enumerate(stages,1):
   boss=stage['boss'];row=entrances[boss];scene=row[language];speaker=row.get('speaker',boss)
   sections.extend(['### '+str(index)+' · '+display_names[speaker][language]+' · '+scene['title'],manuscript(scene['text'])])
 path='story/'+filename;(ROOT/path).write_text('\n\n'.join(sections)+'\n',encoding='utf-8');story_files.append(path)
files=['index.html',script,style,'build-manifest.json',*painted_paths,'assets/lantern-rest.svg','assets/lantern-alight.svg','assets/font-OFL.txt','_headers','CREDITS.txt',SOUNDS,*story_files,*[str(p.relative_to(ROOT))for p in sorted((ROOT/'audio').iterdir())if p.is_file()]]
with zipfile.ZipFile(ROOT/'lantern-oath-web.zip','w',zipfile.ZIP_DEFLATED)as z:
 for file in files:z.write(ROOT/file,file)
print(json.dumps(manifest,ensure_ascii=False))
