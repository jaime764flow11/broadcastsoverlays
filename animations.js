const K={
fade:[{opacity:0},{opacity:1}],
slideL:[{transform:'translateX(-120%)',opacity:0},{transform:'none',opacity:1}],
slideR:[{transform:'translateX(120%)',opacity:0},{transform:'none',opacity:1}],
slideU:[{transform:'translateY(120%)',opacity:0},{transform:'none',opacity:1}],
slideD:[{transform:'translateY(-120%)',opacity:0},{transform:'none',opacity:1}],
zoom:[{transform:'scale(.3)',opacity:0},{transform:'none',opacity:1}],
pop:[{transform:'scale(0)'},{transform:'scale(1.15)',offset:.7},{transform:'none'}],
wipe:[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0 0 0)'}],
blur:[{filter:'blur(24px)',opacity:0},{filter:'blur(0)',opacity:1}]};
export const ANIMS=['none',...Object.keys(K)];
export const norm=d=>{d=d||{};d.elements=Object.values(d.elements||{});d.elements.forEach(e=>e.anim={in:'fade',out:'fade',dur:600,delay:0,...(e.anim||{})});return d};
const JM={left:'flex-start',center:'center',right:'flex-end'};
export function build(root,d){
  root.innerHTML='';
  (d.elements||[]).forEach((e,z)=>{
    if(e.hidden)return;
    const o=document.createElement('div');o.className='e';o.dataset.id=e.id;
    Object.assign(o.style,{left:e.x+'px',top:e.y+'px',width:e.w+'px',height:e.h+'px',transform:`rotate(${e.rot||0}deg)`,opacity:e.op??1,zIndex:z});
    const n=document.createElement('div'),s=n.style;n.className='i';
    s.background=e.fill||'transparent';s.borderRadius=e.type==='circle'?'50%':(e.radius||0)+'px';
    if(e.type==='image'&&e.src)s.background=`center/contain no-repeat url(${JSON.stringify(e.src)})`;
    if(e.type==='text'){n.textContent=e.text;s.color=e.color;s.fontFamily=e.font;s.fontSize=e.size+'px';s.fontWeight=e.weight;s.letterSpacing=(e.ls||0)+'px';s.justifyContent=JM[e.align]||'flex-start'}
    if(e.pulse)n.animate({opacity:[1,.25,1]},{duration:1200,iterations:Infinity});
    o.append(n);root.append(o);
  });
}
export function play(root,d,dir){
  const p=[];
  root.querySelectorAll('.e').forEach(o=>{
    const e=d.elements.find(x=>x.id===o.dataset.id);if(!e)return;
    const a=e.anim,k=dir==='in'?a.in:a.out;
    if(!K[k]){if(dir==='out')o.firstChild.style.opacity=0;return}
    const an=o.firstChild.animate(K[k],{duration:a.dur||600,delay:dir==='in'?a.delay||0:0,easing:'cubic-bezier(.2,.8,.2,1)',fill:dir==='in'?'backwards':'forwards',direction:dir==='in'?'normal':'reverse'});
    p.push(an.finished.catch(()=>{}));
  });
  return Promise.all(p);
}
