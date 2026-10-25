from pathlib import Path
import json,re,hashlib
P=Path(__file__).resolve().parents[1]
def data(name):return json.loads((P/'data'/name).read_text())
cards=data('cards.json');baseline=json.loads((P/'tests/mechanics-baseline.json').read_text());names={c['n']for c in cards};byname={c['n']:c for c in cards};english=data('cards-en.json');campaign=data('campaigns.json');skills=data('boss-abilities.json');decks=data('boss-decks.json');dialog=data('boss-dialogue.json');checks=[]
def check(name,value):assert value,name;checks.append({'name':name,'passed':True})
check('988 distinct original card names',len(cards)==len(names)==988)
check('Every mechanical card field matches its baseline',all({k:v for k,v in c.items()if k not in ['n','lore','alias','baseName','game']}==baseline[c['n']]for c in cards))
check('All 988 English names and descriptions exist',set(english)==names and all(v['name']and v['lore']and not re.search('[\u3400-\u9fff]',v['name']+v['lore'])for v in english.values()))
labels=data('card-names.json');stories=data('card-stories.json');joins=data('companion-dialogue.json');plot=data('loop-story.json')
check('All 988 cards have unique short bilingual display names',set(labels)==names and len({v['zh']for v in labels.values()})==988 and len({v['en']for v in labels.values()})==988 and all(2<=len(v['zh'])<=(8 if byname[n].get('rarity')=='rare'else 5)and len(v['en'])<=25 for n,v in labels.items()))
check('Every card has newly written bilingual story flavour',set(stories)==names and all(v.get('zh')and v.get('en')and not re.search('[\u3400-\u9fff]',v['en'])for v in stories.values()))
check('Six chapters lead back to the first world and all main Bosses can join',set(plot['chapters'])==set(campaign)and all(st['boss']in joins and joins[st['boss']].get('join')and joins[st['boss']].get('joinEn')for stages in campaign.values()for st in stages))
check('Gilded base relationships preserved',all(c.get('baseName')in names and c['n']=='鎏金·'+c['baseName']for c in cards if c.get('rarity')=='rare'))
check('Six cycles of sixteen unique encounters',len(campaign)==6 and all(len(x)==16 for x in campaign.values())and len({st['boss']for world in campaign.values()for st in world})==96)
check('Every stage has a matching skill and retinue',all(st['boss']in {a['boss']for a in skills}and st['boss']in decks and st['boss']in names for world in campaign.values()for st in world))
check('108 active skill configurations retained',len(skills)==108 and len({a['boss']for a in skills})==108)
check('All retinue cards exist and normal-only',all(n in names and byname[n].get('rarity')!='rare'for d in decks.values()for n in d['companions']))
check('Every stage has newly written bilingual defeat and death dialogue',all(st['boss']in dialog and all(dialog[st['boss']].get(k)for k in ['farewell','farewellEn','echo','echoEn'])for world in campaign.values()for st in world))
check('Thirty original scores retained',len(data('music-scores.json'))==30)
check('Every portrait profile belongs to an original card',set(data('portraits.json'))==names)
# Specific franchise/creator/sigil references remain excluded. The user explicitly requested the original Fire Warden archetype name 防火女.
foreign=['宫崎','miyazaki','fromsoftware','inscryption','邪恶冥刻','黑暗之魂','dark souls','demon\'s souls','demon’s souls','elden ring','艾尔登法环','血源','bloodborne','只狼','sekiro','黄金树','苇名','亚楠','权力的游戏','game of thrones','三首金龙','三首龙','帕奇','火防女','薪王葛温','亚尔特留斯']
files=[*P.glob('data/*.json'),*P.glob('src/*'),P/'index.html',P/'standalone.html']
problems=[]
for f in files:
 text=f.read_text().lower();problems.extend((str(f.relative_to(P)),word)for word in foreign if word in text)
check('No retired work, creator, character or coin-sigil references in project content',not problems)
check('Audio tables stay outside the first-load gameplay core',all('const '+n+'={};'in(P/'src/runtime.template.js').read_text()for n in ['SMP','CARD_AUDIO_SAMPLES','COMBAT_AUDIO_SAMPLES']))
audio=json.loads((P/'audio/shared-manifest.json').read_text())
check('Shared audio assets retain their recorded fingerprint',hashlib.sha256((P/audio['asset']).read_bytes()).hexdigest()==audio['sha256'])
check('Independent save namespace',"'lo_collection_v1'"in(P/'src/runtime.template.js').read_text()and'mz_'not in(P/'src/runtime.template.js').read_text())
(P/'tests/data-results.json').write_text(json.dumps(checks,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'passed':len(checks),'failed':0}))
