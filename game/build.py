"""Rebuild the bilingual original game while retaining deferred optional media."""
from pathlib import Path
import base64,hashlib,json,re,zipfile
ROOT=Path(__file__).resolve().parent
VERSION='0.18.3'
SOUNDS='assets/sounds.9dd4337a50d2.js'
MEDIA=['assets/bonfire_gif.50d0bb4f12db.gif','assets/bonfire_still.54749c12aee8.png']
def read(path):return(ROOT/path).read_text(encoding='utf-8')
def fingerprint(stem,extension,text):
 raw=text.encode();name=f'assets/{stem}.{hashlib.sha256(raw).hexdigest()[:12]}.{extension}';(ROOT/name).write_bytes(raw);return name
cards=json.loads(read('data/cards-en.json'));strings=json.loads(read('data/ui-en.json'));assert len(cards)==988
locale_data='const I18N_CARDS='+json.dumps(cards,ensure_ascii=False,separators=(',',':'))+';\nconst I18N_STRINGS='+json.dumps(strings,ensure_ascii=False,separators=(',',':'))+';\n'
runtime=read('src/runtime.js').replace('__I18N_DATA__',locale_data).replace('__I18N_SOURCE__',read('src/i18n.js'))
for token,file in [('__PLAYER_SKILL_UI_SOURCE__','src/player-skill-ui.js'),('__PLAYER_SKILL_EFFECTS_SOURCE__','src/player-skill-effects.js')]:runtime=runtime.replace(token,read(file))
assert not re.search(r'__(?:I18N_|PLAYER_SKILL_)',runtime),'Unresolved build token'
styles='\n'.join(read(name)for name in ['src/table.css','src/player-skill-ui.css','src/player-skill-effects.css','src/mobile-cards.css'])
script=fingerprint('game','js',runtime);style=fingerprint('game','css',styles)
index=read('src/index.template.html').replace('__VERSION__',VERSION).replace('__CORE__',script).replace('__CSS__',style)
(ROOT/'index.html').write_text(index,encoding='utf-8')
# The separate download embeds the same program, image sources and recordings.
offline=runtime[:runtime.index('const WEB_RECORDED_SOUNDS=')]
offline=offline.replace('initializeCollection();initializeIdentity();',read(SOUNDS)+'\ninitializeCollection();initializeIdentity();')
for path in MEDIA:
 mime='image/gif'if path.endswith('.gif')else'image/png'
 offline=offline.replace(path,'data:'+mime+';base64,'+base64.b64encode((ROOT/path).read_bytes()).decode())
inline_credits='\n'.join(line.rstrip()for line in read('CREDITS.txt').splitlines())
single='<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="game-version" content="'+VERSION+'"><title>薪火牌 · Will Wang</title><style>'+styles+'</style></head><body><div id="app"></div><div id="tip"></div><script>'+offline+'</script><script type="text/plain" id="game-credits">'+inline_credits.replace('</script','<\\/script')+'</script></body></html>'
(ROOT/'standalone.html').write_text(single,encoding='utf-8')
files=['index.html',script,style,SOUNDS,*MEDIA,'CREDITS.txt','_headers','发布说明.txt']
with zipfile.ZipFile(ROOT/'xinhuo-web.zip','w',zipfile.ZIP_DEFLATED)as z:
 for name in files:z.write(ROOT/name,name)
# Keep the original soundtrack, licenses and accompanying demo documents.
demo=ROOT/'xinhuo-demo.zip';extras={}
if demo.exists():
 with zipfile.ZipFile(demo)as z:extras={n:z.read(n)for n in z.namelist()if n!='index.html'}
else:
 for path in [*ROOT.glob('*.md'),*ROOT.glob('audio/*'),*ROOT.glob('music/*')]:
  if path.is_file():extras[str(path.relative_to(ROOT))]=path.read_bytes()
for name in ['README.md','UPDATE-0.18.3.md']:
 if(ROOT/name).exists():extras[name]=(ROOT/name).read_bytes()
with zipfile.ZipFile(demo,'w',zipfile.ZIP_DEFLATED)as z:
 z.writestr('index.html',single)
 for name,raw in extras.items():z.writestr(name,raw)
manifest={'version':VERSION,'cards':len(cards),'core':script,'styles':style,'sounds':SOUNDS,'media':MEDIA,'coreSha256':hashlib.sha256(runtime.encode()).hexdigest()}
(ROOT/'build-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(manifest,ensure_ascii=False))
