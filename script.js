gsap.registerPlugin(ScrollTrigger);
const mob = () => window.innerWidth <= 768;

/* CURSOR */
const curDot  = document.getElementById('cur-dot');
const curRing = document.getElementById('cur-ring');
let mx = window.innerWidth/2, my = window.innerHeight/2, rx = mx, ry = my;
if (!mob()) {
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; }, { passive:true });
  (function loop() {
    curDot.style.left=mx+'px'; curDot.style.top=my+'px';
    rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
    curRing.style.left=rx+'px'; curRing.style.top=ry+'px';
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('a,button,.tool-card,.pcard,.email-btn,.soc-card').forEach(el => {
    el.addEventListener('mouseenter',()=>curRing.classList.add('hov'));
    el.addEventListener('mouseleave',()=>curRing.classList.remove('hov'));
  });
}

/* SCROLL PROGRESS */
const sfill=document.getElementById('sfill'), snum=document.getElementById('snum');
window.addEventListener('scroll',()=>{
  const p=Math.round(window.scrollY/(document.body.scrollHeight-window.innerHeight)*100);
  sfill.style.height=p+'%'; snum.textContent=p;
},{passive:true});

/* HERO TITLE BUILD */
function buildRow(el,text,baseDelay){
  if(!el)return;
  [...text].forEach((c,i)=>{
    const s=document.createElement('span'); s.className='ch';
    s.textContent=c===' '?'\u00A0':c;
    s.style.animationDelay=(baseDelay+i*0.08)+'s';
    el.appendChild(s);
  });
}
buildRow(document.getElementById('row1'),'ANMOL',0.4);

/* HERO 3D TILT */
const heroSec=document.getElementById('hero'), heroInner=document.getElementById('hero-inner');
heroSec.addEventListener('mousemove',e=>{
  if(mob())return;
  const r=heroSec.getBoundingClientRect();
  const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
  gsap.to(heroInner,{rotateY:x*8,rotateX:-y*5,x:x*10,y:-y*7,duration:.8,ease:'power2.out'});
},{passive:true});
heroSec.addEventListener('mouseleave',()=>{
  gsap.to(heroInner,{rotateX:0,rotateY:0,x:0,y:0,duration:.8,ease:'power2.out'});
});

/* HERO CANVAS */
(function(){
  const c=document.getElementById('hero-canvas'); if(!c)return;
  const ctx=c.getContext('2d'); let W,H,ps=[];
  const rs=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
  rs(); window.addEventListener('resize',rs,{passive:true});
  for(let i=0;i<80;i++)ps.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,o:Math.random()*.4+.08});
  function draw(){
    ctx.clearRect(0,0,W,H);
    ps.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(6,182,212,${p.o})`;ctx.fill();
    });
    for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){
      const d=Math.hypot(ps[i].x-ps[j].x,ps[i].y-ps[j].y);
      if(d<100){ctx.beginPath();ctx.moveTo(ps[i].x,ps[i].y);ctx.lineTo(ps[j].x,ps[j].y);ctx.strokeStyle=`rgba(6,182,212,${.12*(1-d/100)})`;ctx.lineWidth=.5;ctx.stroke();}
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* CONTACT */
(function(){
  function buildTitle(el,text){
    if(!el)return;
    [...text].forEach(c=>{
      const s=document.createElement('span');s.className='cbt-ch';
      s.textContent=c===' '?'\u00A0':c;el.appendChild(s);
    });
  }
  buildTitle(document.getElementById('cbt-row1'),"LET'S WORK");
  buildTitle(document.getElementById('cbt-row2'),'TOGETHER');

  const obs=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      obs.disconnect();
      document.getElementById('c-topbar').classList.add('in');
      gsap.to('.cbt-ch',{opacity:1,y:0,duration:1,stagger:0.04,ease:'power4.out',delay:0.2});
      setTimeout(()=>document.getElementById('email-wrap').classList.add('in'),900);
      setTimeout(()=>document.getElementById('socials').classList.add('in'),1100);
    });
  },{threshold:0.15});
  obs.observe(document.getElementById('contact'));
})();

/* LOCAL TIME */
function tickTime(){
  const el=document.getElementById('ltime');
  if(el)el.textContent=new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true});
}
tickTime();setInterval(tickTime,1000);

/* COPY EMAIL */
function copyEmail(){
  navigator.clipboard.writeText('hello@anmol.dev').catch(()=>{});
  const t=document.getElementById('copy-toast');
  t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2000);
}

/* CONTACT CANVAS */
(function(){
  const c=document.getElementById('contact-canvas');if(!c)return;
  const ctx=c.getContext('2d');let W,H,ps=[];
  const rs=()=>{W=c.width=c.offsetWidth;H=c.height=c.offsetHeight;};
  rs();window.addEventListener('resize',rs,{passive:true});
  for(let i=0;i<50;i++)ps.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.1+.2,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18,o:Math.random()*.22+.05});
  function draw(){
    ctx.clearRect(0,0,W,H);
    ps.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(244,63,94,${p.o})`;ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* MOBILE NAV */
document.getElementById('ham-btn').addEventListener('click',()=>document.getElementById('mob-menu').classList.add('open'));
document.getElementById('mob-close').addEventListener('click',closeMob);
function closeMob(){document.getElementById('mob-menu').classList.remove('open');}

/* NAV SCROLL */
window.addEventListener('scroll',()=>{
  document.querySelector('nav').style.background=window.scrollY>40?'rgba(8,8,8,.97)':'rgba(8,8,8,.85)';
},{passive:true});

/* REVEAL — simple show on scroll */
const revealObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); revealObs.unobserve(e.target); } });
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));
