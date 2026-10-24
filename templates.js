export const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
export const mk=(type,o={})=>({id:uid('e'),type,x:0,y:0,w:200,h:100,rot:0,op:1,fill:'transparent',radius:0,text:'Texto',color:'#ffffff',font:'Montserrat',size:40,weight:700,ls:0,align:'left',...o,anim:{in:'fade',out:'fade',dur:600,delay:0,...(o.anim||{})}});
const an=(i,o,delay=0,dur=600)=>({anim:{in:i,out:o,delay,dur}});
const T=(id,name,cat,dur,elements)=>({id,name,cat,dur,res:[1920,1080],elements});
export const TEMPLATES=[
T('tpl-lola','Lower third · LOLA ÍNDIGO','Lower thirds',0,[
 mk('rect',{x:80,y:870,w:640,h:120,radius:10,fill:'linear-gradient(90deg,#ff2d75,#7c3aed)',...an('slideL','slideL')}),
 mk('rect',{x:80,y:996,w:640,h:8,fill:'#fff',...an('wipe','wipe',300)}),
 mk('text',{x:112,y:880,w:580,h:64,text:'LOLA ÍNDIGO',size:52,weight:800,...an('wipe','fade',250)}),
 mk('text',{x:112,y:938,w:580,h:36,text:'ARTISTA',size:24,weight:400,ls:6,...an('fade','fade',500)})]),
T('tpl-live','Indicador · Música y voz en directo','Indicadores',0,[
 mk('rect',{x:40,y:40,w:460,h:56,radius:28,fill:'rgba(10,10,20,.78)',...an('slideL','slideL')}),
 mk('circle',{x:62,y:59,w:18,h:18,fill:'#ff2d2d',pulse:true,...an('pop','fade',250)}),
 mk('text',{x:96,y:40,w:390,h:56,text:'MÚSICA Y VOZ EN DIRECTO',size:22,ls:2,...an('fade','fade',300)})]),
T('tpl-bumper','Bumper · Próxima actuación','Bumpers',5,[
 mk('rect',{x:0,y:0,w:1920,h:1080,fill:'linear-gradient(135deg,#0b0b1a,#7c3aed)',...an('wipe','wipe')}),
 mk('rect',{x:660,y:560,w:600,h:6,fill:'#ff2d75',...an('wipe','fade',500)}),
 mk('text',{x:0,y:440,w:1920,h:110,text:'PRÓXIMA ACTUACIÓN',size:96,weight:800,align:'center',...an('zoom','fade',300,800)})]),
T('tpl-vig','Efecto · Viñeta','Efectos',0,[
 mk('rect',{x:0,y:0,w:1920,h:1080,fill:'radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.7))',...an('fade','fade',0,1500)})])
];
