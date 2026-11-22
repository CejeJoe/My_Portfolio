/* Ngonzi Collin Joe — portfolio behaviour */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const names=['home','about','skills','journey','works','contact'],ids=['home','about','skills','journey','work','contact'];
const scenes=$$('.scene'),nodes=$$('#graph button'),wipe=$('#wipe');
let cur=-1,busy=false,started=false,palOpen=false,previewOpen=false,boost=0;
$('#yr').textContent=new Date().getFullYear();

/* Background = a skills constellation.
   Glowing words are my real skills; small glyphs are code. Words link to each other,
   brighten when the cursor is near, and all glow on the Skills chapter. Click to send a ripple. */
const cv=$('#bg'),cx=cv.getContext('2d');
const GL='{}</>;=01()#'.split(''),WORDS=['HTML','CSS','JavaScript','PHP','C#','SQL','UI/UX','Wireframes','Prototypes','Problem-solving'];
let W,H,P=[],M={x:-999,y:-999},R=[];
const mk=(c,w)=>({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*(w?.28:.4),vy:(Math.random()-.5)*(w?.28:.4),c,w});
function size(){W=cv.width=innerWidth;H=cv.height=innerHeight;
 P=Array.from({length:Math.min(55,W*H/22000|0)},()=>mk(GL[Math.random()*GL.length|0],0));
 WORDS.forEach(w=>P.push(mk(w,1)))}
function draw(){cx.clearRect(0,0,W,H);
 const g=cx.createRadialGradient(M.x,M.y,0,M.x,M.y,220);g.addColorStop(0,'rgba(255,176,0,.07)');g.addColorStop(1,'transparent');cx.fillStyle=g;cx.fillRect(0,0,W,H);
 for(const p of P){const dx=p.x-M.x,dy=p.y-M.y,d=Math.hypot(dx,dy)||1;
  if(!RM){p.x+=p.vx;p.y+=p.vy;if(d<(p.w?90:130)){const f=p.w?.5:1.6;p.x+=dx/d*f;p.y+=dy/d*f}
   if(p.x<-120)p.x=W;if(p.x>W+20)p.x=-100;if(p.y<0)p.y=H;if(p.y>H)p.y=0}
  p.near=Math.max(0,1-d/170)}
 for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j],d=Math.hypot(a.x-b.x,a.y-b.y),L=a.w&&b.w?260:130;
  if(d<L){cx.strokeStyle=`rgba(255,176,0,${(a.w&&b.w?.16:.07)*(1-d/L)+.15*Math.max(a.near,b.near)*(1-d/L)})`;cx.lineWidth=a.w&&b.w?1.2:1;cx.beginPath();cx.moveTo(a.x,a.y);cx.lineTo(b.x,b.y);cx.stroke()}}
 for(const p of P){const lit=Math.max(p.near,boost);
  if(p.w){cx.font='600 19px JetBrains Mono,monospace';cx.fillStyle=`rgba(255,176,0,${.15+.5*lit})`;cx.shadowColor='#ffb000';cx.shadowBlur=lit*14}
  else{cx.font='16px JetBrains Mono,monospace';cx.fillStyle=`rgba(255,176,0,${.1+.25*p.near})`;cx.shadowBlur=0}
  cx.fillText(p.c,p.x,p.y)}
 cx.shadowBlur=0;
 R=R.filter(r=>r.t<1);for(const r of R){r.t+=.02;cx.strokeStyle=`rgba(255,176,0,${.6*(1-r.t)})`;cx.beginPath();cx.arc(r.x,r.y,r.t*260,0,7);cx.stroke()}
 if(!RM)requestAnimationFrame(draw)}
addEventListener('resize',()=>{size();if(RM)draw()});
addEventListener('pointermove',e=>{M.x=e.clientX;M.y=e.clientY});
addEventListener('pointerdown',e=>{R.push({x:e.clientX,y:e.clientY,t:0});if(RM)draw()});
size();draw();

/* boot sequence */
const L=['[ ok ] mounting /home/collin','[ ok ] loading design-system','[ ok ] compiling curiosity','[ ok ] linking html css javascript php c# sql','[ .. ] warming up the creative workspace'];
const coarse=matchMedia('(pointer:coarse)').matches;let ready=false;
if(coarse)$('#press').innerHTML='Tap to run collin.exe';
let seen=false,skipNow=false;try{seen=!!localStorage.getItem('cj_seen')}catch(e){}
(function boot(){const t0=performance.now(),dur=RM?200:seen?800:2800;let shown=0;
 (function f(now){const p=skipNow?1:Math.min(1,(now-t0)/dur),n=Math.round(p*100);
  $('#pct').innerHTML=n+'<small>%</small>';$('#fill').style.width=n+'%';
  const want=Math.floor(p*L.length);while(shown<want){$('#log').textContent+=(shown?'\n':'')+L[shown];shown++}
  if(p<1)requestAnimationFrame(f);else{$('#log').textContent+='\n[ ok ] ready.';ready=true;$('#skip').hidden=true;$('#press').classList.add('show');$('#press').focus();if(seen)setTimeout(start,350)}})(t0)})();
function start(){if(started||!ready)return;started=true;try{localStorage.setItem('cj_seen','1')}catch(e){}$('#boot').classList.add('out');const h=ids.indexOf(location.hash.slice(1));go(h>-1?h:0,true);setTimeout(()=>$('#boot').remove(),1000)}
$('#skip').onclick=e=>{e.stopPropagation();ready?start():skipNow=true};$('#press').onclick=start;$('#boot').onclick=start;

/* navigation */
function swap(i){cur=i;boost=i===2?1:0;scenes.forEach((s,k)=>{s.classList.toggle('on',k===i);s.inert=k!==i});
 nodes.forEach((n,k)=>{n.classList.toggle('on',k===i);n.toggleAttribute('aria-current',k===i)});
 $('#graph ul').style.setProperty('--p',i/5);$('#count').textContent='0'+(i+1)+'/06';
 $$('.rv',scenes[i]).forEach((e,k)=>e.style.setProperty('--d',k));scenes[i].scrollTop=0;
 history.replaceState(null,'','#'+ids[i]);if(i===0)roles();}
function go(i,instant){i=Math.max(0,Math.min(5,i));if(busy||i===cur)return;
 if(instant||RM){swap(i);return}
 busy=true;wipe.textContent='0'+(i+1)+' — '+names[i];wipe.classList.remove('run');void wipe.offsetWidth;wipe.classList.add('run');
 setTimeout(()=>swap(i),320);setTimeout(()=>busy=false,700)}
const next=()=>go(cur>=5?0:cur+1),prev=()=>go(cur-1);
nodes.forEach(n=>n.onclick=()=>go(+n.dataset.i));
$$('[data-go]').forEach(a=>a.onclick=e=>{e.preventDefault();go(+a.dataset.go)});

const roleList=['Web Development','Software Engineering','UI/UX design','PHP & SQL'];let rt;
function roles(){clearTimeout(rt);const el=$('#role');if(RM){el.textContent=roleList[0];return}let r=0,c=0,d=1;
 (function tick(){const w=roleList[r];c+=d;el.textContent=w.slice(0,c);
  if(d>0&&c===w.length){d=-1;rt=setTimeout(tick,1500);return}
  if(d<0&&c===0){d=1;r=(r+1)%roleList.length}rt=setTimeout(tick,d>0?70:35)})()}

/* hologram portrait: true colour follows the cursor */
const shot=$('#shot');shot.addEventListener('pointermove',e=>{const b=shot.getBoundingClientRect();shot.style.setProperty('--mx',e.clientX-b.left+'px');shot.style.setProperty('--my',e.clientY-b.top+'px')});

/* project live preview */
const PROJ=[{t:'Élégante — Fashion & Design House',u:'https://fashiongreen.netlify.app/'},{t:'Genva — Branding Agency',u:'https://genva.netlify.app/genva/'},{t:'Chrisbert Consult',u:'https://chrisbertconsult.org/'}];
function openPrev(i){const p=PROJ[i];$('#ptitle').textContent=p.t;$('#pout').href=p.u;$('#pif').src=p.u;$('#prev').classList.add('open');previewOpen=true;setPreview(false);$('#pclose').focus()}
function closePrev(){$('#prev').classList.remove('open');$('#pif').src='about:blank';previewOpen=false}
function setPreview(m){$('.pframe').classList.toggle('mob',m);$('#pmob').classList.toggle('on',m);$('#pdesk').classList.toggle('on',!m)}
$$('[data-prev]').forEach(b=>b.onclick=()=>openPrev(+b.dataset.prev));
$('#pclose').onclick=closePrev;$('#pdesk').onclick=()=>setPreview(false);$('#pmob').onclick=()=>setPreview(true);
$('#prev').onclick=e=>{if(e.target.id==='prev')closePrev()};
const copyMail=()=>navigator.clipboard?navigator.clipboard.writeText('cj616543@gmail.com').then(()=>toast('✔ email copied'),()=>toast('cj616543@gmail.com')):toast('cj616543@gmail.com');
$('#copy').onclick=copyMail;

/* command palette */
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)};
const cmds=[...names.map((n,i)=>({n:'cd '+n,d:'chapter 0'+(i+1),f:()=>go(i)})),
 {n:'open elegante',d:'live preview',f:()=>openPrev(0)},{n:'open genva',d:'live preview',f:()=>openPrev(1)},{n:'open chrisbert',d:'live preview',f:()=>openPrev(2)},
 {n:'copy email',d:'copy to clipboard',f:copyMail},{n:'replay intro',d:'show the boot screen again',f:()=>{try{localStorage.removeItem('cj_seen')}catch(e){}location.reload()}},
 {n:'email collin',d:'open your mail app',f:()=>location.href='mailto:cj616543@gmail.com'},
 {n:'sudo hire collin',d:'elevate privileges',f:()=>{go(5);setTimeout(()=>toast('✔ permission granted. let’s talk.'),700)}}];
let sel=0,list=cmds;
function render(){const q=$('#pin').value.toLowerCase();list=cmds.filter(c=>c.n.includes(q));sel=Math.min(sel,Math.max(0,list.length-1));
 $('#pl').innerHTML=list.map((c,i)=>`<li class="${i===sel?'sel':''}" data-k="${i}">${c.n}<span>${c.d}</span></li>`).join('')||'<li><span>command not found</span></li>'}
function pal(o){palOpen=o;$('#pal').classList.toggle('open',o);if(o){$('#pin').value='';sel=0;render();$('#pin').focus()}}
const run=()=>{const c=list[sel];if(c){pal(false);c.f()}};
$('#pin').oninput=render;$('#cmdbtn').onclick=()=>pal(true);$('#pal').onclick=e=>{if(e.target.id==='pal')pal(false)};
$('#pl').onclick=e=>{const li=e.target.closest('li[data-k]');if(li){sel=+li.dataset.k;run()}};
$('#pin').onkeydown=e=>{if(e.key==='Escape')pal(false);else if(e.key==='Enter'){e.preventDefault();run()}
 else if(e.key==='ArrowDown'){e.preventDefault();sel=(sel+1)%list.length;render()}else if(e.key==='ArrowUp'){e.preventDefault();sel=(sel-1+list.length)%list.length;render()}};

/* keys, wheel, swipe */
addEventListener('keydown',e=>{
 if(!started){if(e.key==='Enter'||e.key==='Escape'){e.preventDefault();ready?start():skipNow=true}return}
 if(previewOpen){if(e.key==='Escape')closePrev();return}
 if(palOpen)return;
 const tg=e.target.tagName,typing=/INPUT|TEXTAREA/.test(tg);
 if((e.key==='/'&&!typing)||(e.key==='k'&&(e.ctrlKey||e.metaKey))){e.preventDefault();pal(true);return}
 if(typing)return;
 if(e.key==='Enter'&&/BUTTON|A/.test(tg))return;
 if(['Enter','ArrowRight','PageDown'].includes(e.key)){e.preventDefault();next()}
 else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();prev()}
 else if(/^[1-6]$/.test(e.key))go(+e.key-1)});
let wl=0;addEventListener('wheel',e=>{if(!started||palOpen||previewOpen||Date.now()-wl<1000||Math.abs(e.deltaY)<35)return;const s=scenes[cur];if(s.scrollHeight>s.clientHeight+4)return;wl=Date.now();e.deltaY>0?go(cur+1):prev()},{passive:true});
let tx,ty;addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
addEventListener('touchend',e=>{if(!started||palOpen||previewOpen)return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.5)dx<0?go(cur+1):prev()},{passive:true});

/* contact form: sends straight to my inbox (FormSubmit); falls back to the mail app */
$('#form').onsubmit=async e=>{e.preventDefault();if($('#hp').value)return;
 const b=$('#send'),st=$('#fstat'),n=$('#n').value,em=$('#e').value,m=$('#m').value;b.disabled=true;st.textContent='Sending…';
 try{const r=await fetch('https://formsubmit.co/ajax/cj616543@gmail.com',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
   body:JSON.stringify({name:n,email:em,message:m,_subject:'Portfolio message from '+n,_template:'table'})});
  const d=await r.json();if(!r.ok||d.success==='false')throw 0;
  st.textContent='✔ Sent. Thank you, '+n.split(' ')[0]+'! I’ll reply to '+em+'.';e.target.reset()}
 catch(x){const href='mailto:cj616543@gmail.com?subject='+encodeURIComponent('Portfolio message from '+n)+'&body='+encodeURIComponent(m+'\n\n— '+n+' ('+em+')');
  st.innerHTML='Couldn’t send from here. <a class="a" href="'+href+'">Open your email app instead ↗</a>'}
 b.disabled=false};
