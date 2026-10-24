import {db,ref,onValue,set,update,remove,path,missing} from './firebase-config.js';
import {TEMPLATES,uid} from './templates.js';
import {build,play,norm} from './animations.js';
import {createEditor} from './editor.js';
window.__ok=true;
const $=s=>document.querySelector(s),clone=o=>JSON.parse(JSON.stringify(o));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>'&#'+c.charCodeAt(0)+';');
const say=t=>{$('#msg').textContent=t;clearTimeout(say.t);say.t=setTimeout(()=>$('#msg').textContent='',4000)};
const pill=(on,t)=>{const s=$('#st');s.className='pill '+(on?'on':'off');s.textContent=t};
const wrap=$('#wrap'),stage=$('#stage');
const fit=()=>{const s=wrap.clientWidth/1920;stage.style.transform=`scale(${s})`;wrap.style.height=1080*s+'px'};
addEventListener('resize',fit);fit();
let lib={},live={},saveT,pv,lastLive='';
// Borrador: autoguardado en /drafts (nunca toca /live)
const ed=createEditor({stage,props:$('#pp'),layers:$('#layers')},d=>{if(!db)return;clearTimeout(saveT);saveT=setTimeout(()=>set(ref(db,path('drafts/'+d.id)),clone(d)).catch(()=>{}),1500)});
ed.load(clone(TEMPLATES[0]));
const card=(d,k)=>`<div class="card" data-k="${k}" data-id="${esc(d.id)}"><span class=nm>${esc(d.name)}</span><small>${esc(d.cat||'')}</small></div>`;
function lists(){const q=$('#q').value.toLowerCase(),f=a=>a.filter(d=>((d.name||'')+(d.cat||'')).toLowerCase().includes(q));
  $('#tpl').innerHTML=f(TEMPLATES).map(d=>card(d,'t')).join('');
  $('#lib').innerHTML=f(Object.values(lib)).map(d=>card(d,'l')).join('')||'<small>Vacío</small>'}
$('#q').oninput=lists;lists();
$('#left').onclick=e=>{const c=e.target.closest('.card');if(!c)return;ed.load(clone(c.dataset.k==='t'?TEMPLATES.find(x=>x.id===c.dataset.id):lib[c.dataset.id]))};
const ok=()=>db||(say('Configura firebase-config.js primero'),false);
const err=e=>say('Error: '+e.message);
const L=id=>ref(db,path('live/'+id));
const isLive=n=>n&&n.visible&&!(n.design.dur&&Date.now()-n.run>n.design.dur*1000);
function liveList(){
  const h=Object.entries(live).filter(([,n])=>isLive(n)).map(([id,n])=>`<div class="card"><span class=nm>${esc(n.design.name)}</span><button data-h="${esc(id)}">Ocultar</button></div>`).join('')||'<small>Nada en emisión</small>';
  if(h!==lastLive){lastLive=h;$('#live').innerHTML=h}}
$('#live').onclick=e=>{const id=e.target.dataset.h;if(id&&ok())update(L(id),{visible:false,instant:false}).catch(err)};
setInterval(liveList,1000);
if(!db)pill(false,'Falta configurar firebase-config.js: '+missing.join(', '));
else{
  onValue(ref(db,'.info/connected'),s=>pill(s.val(),s.val()?'Firebase conectado':'Sin conexión con Firebase'));
  onValue(ref(db,path('library')),s=>{lib=s.val()||{};lists()},e=>pill(false,'Error: '+e.message));
  onValue(ref(db,path('live')),s=>{live=s.val()||{};for(const k in live)norm(live[k].design);liveList()},e=>pill(false,'Error: '+e.message));
}
$('#prev').onclick=()=>{const d=ed.get();build(stage,d);play(stage,d,'in');clearTimeout(pv);if(d.dur)pv=setTimeout(()=>play(stage,d,'out'),d.dur*1000)};
$('#stop').onclick=()=>{clearTimeout(pv);ed.redraw()};
$('#save').onclick=()=>{if(!ok())return;const d=clone(ed.get());d.mod=Date.now();set(ref(db,path('library/'+d.id)),d).then(()=>say('Guardado en la biblioteca')).catch(err)};
$('#dup').onclick=()=>{const d=clone(ed.get());d.id=uid('d');d.name+=' (copia)';ed.load(d);say('Duplicado (pulsa Guardar para conservarlo)')};
$('#del').onclick=()=>{const d=ed.get();if(!ok()||!lib[d.id])return say('Ese diseño no está en tu biblioteca');if(confirm('¿Eliminar «'+d.name+'» de forma permanente?'))remove(ref(db,path('library/'+d.id))).then(()=>say('Eliminado')).catch(err)};
$('#go').onclick=()=>{if(!ok())return;const d=clone(ed.get());set(L(d.id),{design:d,visible:true,instant:false,run:Date.now()}).then(()=>say('Lanzado al directo')).catch(err)};
$('#upd').onclick=()=>{if(!ok())return;const d=clone(ed.get());if(!isLive(live[d.id]))return say('Este diseño no está en emisión');update(L(d.id),{design:d}).then(()=>say('Actualizado en emisión')).catch(err)};
$('#hide').onclick=()=>ok()&&update(L(ed.get().id),{visible:false,instant:false}).catch(err);
$('#hnow').onclick=()=>ok()&&update(L(ed.get().id),{visible:false,instant:true}).catch(err);
$('#clr').onclick=()=>{if(!ok())return;const u={};for(const id in live){u[id+'/visible']=false;u[id+'/instant']=false}update(ref(db,path('live')),u).then(()=>say('Salida limpia')).catch(err)};
document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>ed.add(b.dataset.add));
$('#udo').onclick=ed.undo;$('#rdo').onclick=ed.redo;$('#dupe').onclick=ed.dupEl;$('#dele').onclick=ed.delEl;
