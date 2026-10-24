import {db,ref,onValue,path,missing} from './firebase-config.js';
import {build,play,norm} from './animations.js';
const stage=document.getElementById('stage'),info=document.getElementById('info'),dbg=location.search.includes('debug');
const fit=()=>stage.style.transform=`scale(${Math.min(innerWidth/1920,innerHeight/1080)})`;addEventListener('resize',fit);fit();
const say=t=>{info.textContent=t;info.style.display=(dbg||t.startsWith('Falta')||t.startsWith('Error'))?'block':'none'};
const nodes=new Map();
const kill=id=>{const o=nodes.get(id);if(o){clearTimeout(o.t);o.box.remove();nodes.delete(id)}};
const out=(id,instant)=>{const o=nodes.get(id);if(!o||o.leaving)return;if(instant)return kill(id);o.leaving=true;clearTimeout(o.t);play(o.box,o.d,'out').then(()=>{if(nodes.get(id)===o)kill(id)})};
function sync(id,n){
  const d=norm(n.design),end=d.dur?n.run+d.dur*1000:0,alive=n.visible&&!(end&&Date.now()>end);
  let o=nodes.get(id);
  if(!alive){if(o)out(id,n.instant);return}
  if(o&&o.run!==n.run){kill(id);o=null}
  if(!o){
    const box=document.createElement('div');box.className='box';stage.append(box);build(box,d);
    o={box,d,run:n.run,sig:JSON.stringify(d)};nodes.set(id,o);play(box,d,'in');
    if(end)o.t=setTimeout(()=>out(id),Math.max(0,end-Date.now()));
  }else if(!o.leaving){const sig=JSON.stringify(d);if(sig!==o.sig){o.sig=sig;o.d=d;build(o.box,d)}}
}
if(!db)say('Falta configurar firebase-config.js: '+missing.join(', '));
else{
  onValue(ref(db,'.info/connected'),s=>say(s.val()?'Conectado':'Desconectado de Firebase'));
  onValue(ref(db,path('live')),s=>{
    const v=s.val()||{};
    for(const id in v)if(v[id]&&v[id].design)sync(id,v[id]);
    for(const id of [...nodes.keys()])if(!(id in v))out(id,false);
  },e=>say('Error: '+e.message));
}
