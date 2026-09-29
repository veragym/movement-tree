import sys,json,re
from urllib.parse import quote,unquote
from pathlib import Path
from urllib.request import Request,urlopen
sys.path.insert(0,str(Path(__file__).resolve().parents[3]/'photo_storage_review'))
# This script only reads exercise data and emits public image URLs, never credentials.
root=Path(__file__).resolve().parents[1]
config=(root.parent/'veragym-app/veragym-app-main/config.js').read_text(encoding='utf-8')
url=re.search(r"const SUPABASE_URL\s*=\s*'([^']+)'",config).group(1)
anon=re.search(r"const SUPABASE_ANON_KEY\s*=\s*'([^']+)'",config).group(1)
(root/'src/config.json').write_text(json.dumps({'url':url,'anon':anon}),encoding='utf-8')
input_path=Path('C:/Users/iksun/Desktop/weight_movement_db_final/exercise_tree_nodes.json')
source=json.loads(input_path.read_text(encoding='utf-8-sig'))
catalog=[{'id':r['id'],'name':r['label']} for r in source if r['type']=='exercise']
(root/'public').mkdir(exist_ok=True)
(root/'public/exercises.json').write_text(json.dumps(catalog,ensure_ascii=False),encoding='utf-8')
req=Request(url+'/rest/v1/rpc/get_all_exercise_refs',data=b'{}',headers={'apikey':anon,'Authorization':'Bearer '+anon,'Content-Type':'application/json'})
try:
 with urlopen(req,timeout=20) as response: rows=json.load(response)
 print('RPC rows',len(rows),'fields',list(rows[0]) if rows else [])
except Exception as e:
 print('RPC read failed',type(e).__name__); rows=[]
images=[]
for r in rows:
 raw=r.get('image_url') or ''
 prefix='https://veragym.github.io/veragym-app/images/exercise/'
 if raw.startswith(prefix): raw=url+'/storage/v1/object/public/exercise-images/'+quote(unquote(raw[len(prefix):]),safe='/')
 if raw.startswith(url+'/storage/v1/object/public/exercise-images/'):
  images.append({'id':str(r.get('id')),'name':r.get('name_ko') or r.get('name_en') or '운동 이미지','url':raw})
(root/'public/images.json').write_text(json.dumps(images,ensure_ascii=False),encoding='utf-8')
print('Exported inputs',len(catalog),'images',len(images))
