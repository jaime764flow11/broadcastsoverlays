import {build,norm,ANIMS} from './animations.js';
import {mk,uid} from './templates.js';
const F=[['text','Texto'],['src','URL imagen (https o assets/…)'],['x','X','n'],['y','Y','n'],['w','Ancho','n'],['h','Alto','n'],['rot','Giro °','n'],['op','Opacidad 0-1','n'],['fill','Fondo (color/degradado CSS)'],['radius','Radio','n'],['color','Color texto'],['font','Fuente'],['size','Tamaño','n'],['weight','Grosor','n'],['ls','Espaciado','n'],['align','Alineación left/center/right']];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>'&#'+c.charCodeAt(0)+';');
export function createEditor({stage,props,layers},onChange){
  let d,sel,hist=[],fut=[];
  const E=()=>d.elements.find(e=>e.id===sel);
  const snap=()=>{hist.push(JSON.stringify(d));hist.length>60&&hist.shift();fut=[]};
  const done=()=>{draw();onChange(d)};
  function draw(){
    build(stage,d);
    stage.querySelectorAll('.e').forEach(o=>{
      const e=d.elements.find(x=>x.id===o.dataset.id);o.style.cursor='move';
      o.onpointerdown=ev=>{ev.stopPropagation();const rs=ev.target.className==='hd';pick(e.id);if(!e.locked){snap();drag(ev,e,rs)}};
      if(e.id===sel){o.classList.add('sel');o.insertAdjacentHTML('beforeend','<i class="hd"></i>')}
    });
    drawLayers();
  }
  function pick(id){sel=id;draw();form()}
  function drag(ev,e,rs){
    const s=stage.getBoundingClientRect().width/1920,x0=ev.clientX,y0=ev.clientY,{x,y,w,h}=e;
    const mv=m=>{
      const dx=(m.clientX-x0)/s,dy=(m.clientY-y0)/s;
      if(rs){e.w=Math.max(10,Math.round(w+dx));e.h=Math.max(10,Math.round(h+dy))}else{e.x=Math.round((x+dx)/5)*5;e.y=Math.round((y+dy)/5)*5}
      const o=stage.querySelector('[data-id="'+e.id+'"]');Object.assign(o.style,{left:e.x+'px',top:e.y+'px',width:e.w+'px',height:e.h+'px'});
    };
    const up=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',up);form();onChange(d)};
    addEventListener('pointermove',mv);addEventListener('pointerup',up);
  }
  function form(){
    const e=E(),an=e&&e.anim,op=k=>ANIMS.map(a=>`<option ${an[k]===a?'selected':''}>${a}</option>`).join('');
    props.innerHTML=`<label>Nombre<input data-d=name value="${esc(d.name)}"></label><label>Categoría<input data-d=cat value="${esc(d.cat)}"></label><label>Duración total s (0 = permanente)<input data-d=dur type=number value="${d.dur||0}"></label>`+(e
      ?F.filter(([k])=>!((k==='text'&&e.type!=='text')||(k==='src'&&e.type!=='image'))).map(([k,l,t])=>`<label>${l}<input data-k=${k} ${t?'type=number step=any':''} value="${esc(e[k])}"></label>`).join('')
       +`<label>Animación de entrada<select data-a=in>${op('in')}</select></label><label>Animación de salida<select data-a=out>${op('out')}</select></label><label>Duración anim. (ms)<input data-a=dur type=number value="${an.dur}"></label><label>Retardo (ms)<input data-a=delay type=number value="${an.delay}"></label>`
      :'<small>Selecciona un elemento en el lienzo o en las capas</small>');
  }
  props.oninput=ev=>{const t=ev.target,v=t.type==='number'?+t.value:t.value;
    if(t.dataset.d)d[t.dataset.d]=v;else if(t.dataset.k)E()[t.dataset.k]=v;else if(t.dataset.a)E().anim[t.dataset.a]=v;
    draw();onChange(d)};
  props.onfocusin=snap;
  function drawLayers(){
    layers.innerHTML=[...d.elements].reverse().map(e=>`<div class="card ${e.id===sel?'on':''}" data-id="${e.id}"><span class=nm>${esc(e.name||e.type+': '+(e.text||''))}</span><button data-a=v>${e.hidden?'🚫':'👁'}</button><button data-a=l>${e.locked?'🔒':'🔓'}</button><button data-a=u>↑</button><button data-a=d>↓</button></div>`).join('');
  }
  layers.onclick=ev=>{
    const c=ev.target.closest('.card');if(!c)return;
    const e=d.elements.find(x=>x.id===c.dataset.id),a=ev.target.dataset.a;a&&snap();
    if(a==='v')e.hidden=!e.hidden;else if(a==='l')e.locked=!e.locked;
    else if(a){const i=d.elements.indexOf(e),j=a==='u'?i+1:i-1;if(j>=0&&j<d.elements.length){d.elements.splice(i,1);d.elements.splice(j,0,e)}}
    sel=e.id;done();form();
  };
  layers.ondblclick=ev=>{const c=ev.target.closest('.card');if(!c)return;const e=d.elements.find(x=>x.id===c.dataset.id),n=prompt('Nombre de la capa',e.name||'');if(n!==null){snap();e.name=n;done()}};
  const go=(a,b)=>{if(!a.length)return;b.push(JSON.stringify(d));d=JSON.parse(a.pop());if(!E())sel=null;done();form()};
  addEventListener('keydown',ev=>{
    if(!d||/INPUT|SELECT|TEXTAREA/.test(ev.target.tagName))return;
    if(ev.key==='Delete')api.delEl();
    if((ev.ctrlKey||ev.metaKey)&&ev.key==='z'){ev.preventDefault();ev.shiftKey?go(fut,hist):go(hist,fut)}
  });
  const api={
    load(x){d=norm(x);sel=null;hist=[];fut=[];draw();form()},
    get:()=>d,redraw:()=>draw(),
    undo:()=>go(hist,fut),redo:()=>go(fut,hist),
    add(t){snap();const e=mk(t,{x:760,y:440,w:400,h:t==='text'?80:200,fill:(t==='rect'||t==='circle')?'#7c3aed':'transparent'});d.elements.push(e);sel=e.id;done();form()},
    dupEl(){const e=E();if(!e)return;snap();const c=JSON.parse(JSON.stringify(e));c.id=uid('e');c.x+=30;c.y+=30;d.elements.push(c);sel=c.id;done();form()},
    delEl(){if(!sel)return;snap();d.elements=d.elements.filter(e=>e.id!==sel);sel=null;done();form()}
  };
  return api;
}
