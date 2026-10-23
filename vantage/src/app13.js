/* ============================================================
   VANTAGE — taken over from RYSEON (Ivan, 23 Oct 2026)
   1 Tab bar glass lens · 3 anthracite background + one blue orb on
   the welcome screens · 4 never-stuck navigation, one-shot pulses
   that start in view, language rail that follows the finger + tick.
   ============================================================ */
(function(){
var RM=function(){return window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches};

/* ---------- 1 · Tab bar lens (RYSEON "Tab bar lens (Ivan, 23 Oct)") ---------- */
var _rs=renderShell;
renderShell=function(){return _rs().replace('<nav class="bnav" aria-label="Main">','<nav class="bnav" aria-label="Main"><i class="hnav-pill" data-keep="pill" aria-hidden="true"></i>')};
var LBAR=null,PILL=null,ANIM=null,RO=null;
function box(t){return {x:t.offsetLeft+4,w:t.offsetWidth-8}}
function curTab(){return LBAR&&LBAR.querySelector('button[aria-current=page]')}
function place(){var c=curTab();if(!c||!LBAR.offsetWidth){if(PILL) PILL.classList.remove('on');return}var b=box(c);PILL.style.left=b.x+'px';PILL.style.width=b.w+'px';PILL.classList.add('on');PILL._at=c.dataset.v}
function lens(from,t){
  if(!LBAR||!from||from===t||!LBAR.offsetWidth||!PILL.animate||RM()){requestAnimationFrame(place);return}
  var a=box(from),b=box(t),mid=(a.x+b.x)/2,big=Math.max(a.w,b.w)*1.28,
    glass='inset 0 0 0 1px rgba(255,255,255,.26),inset 0 1px 10px rgba(255,255,255,.12),0 6px 20px rgba(0,0,0,.35)',
    rest='inset 0 0 0 0 rgba(255,255,255,0),inset 0 0 0 rgba(255,255,255,0),0 0 0 rgba(0,0,0,0)';
  if(ANIM) ANIM.cancel();PILL.classList.add('on');
  ANIM=PILL.animate([
    {left:a.x+'px',width:a.w+'px',transform:'scale(1,1)',background:'rgba(255,255,255,.075)',boxShadow:rest},
    {left:(a.x-(a.w*.08))+'px',width:(a.w*1.16)+'px',transform:'scale(1,1.3)',background:'rgba(255,255,255,.03)',boxShadow:glass,offset:.22},
    {left:(mid+(Math.min(a.w,b.w)-big)/2)+'px',width:big+'px',transform:'scale(1,1.36)',background:'rgba(255,255,255,.025)',boxShadow:glass,offset:.55},
    {left:(b.x-(b.w*.06))+'px',width:(b.w*1.12)+'px',transform:'scale(1,1.22)',background:'rgba(255,255,255,.035)',boxShadow:glass,offset:.8},
    {left:b.x+'px',width:b.w+'px',transform:'scale(1,1)',background:'rgba(255,255,255,.075)',boxShadow:rest}
  ],{duration:620,easing:'cubic-bezier(.3,.7,.25,1)'});
  LBAR.animate([{transform:'scale(1)'},{transform:'scale(1.035)',offset:.35},{transform:'scale(1)'}],{duration:560,easing:'cubic-bezier(.3,.7,.25,1)'});
  PILL.style.left=b.x+'px';PILL.style.width=b.w+'px';PILL._at=t.dataset.v;ANIM.onfinish=function(){ANIM=null}}
function bindBar(){var bar=document.querySelector('.bnav');if(!bar) return;
  if(bar!==LBAR){LBAR=bar;PILL=bar.querySelector('.hnav-pill');
    if(RO) RO.disconnect();try{RO=new ResizeObserver(function(){if(!ANIM) place()});RO.observe(bar)}catch(_){}
    setTimeout(place,0);return}
  /* screen changed without a tab tap (e.g. opening an athlete): glide there too */
  var c=curTab();if(!ANIM&&c&&PILL._at&&PILL._at!==c.dataset.v){var f=LBAR.querySelector('button[data-v="'+PILL._at+'"]');if(f) lens(f,c);else place()}
  else if(!ANIM) place()}
document.addEventListener('click',function(e){var t=e.target.closest('.bnav button[data-a=nav]');if(!t||!LBAR) return;var c=curTab();if(c!==t) lens(c||LBAR.querySelector('button[data-v="'+PILL._at+'"]'),t)},true);
addEventListener('resize',function(){if(!ANIM&&LBAR) place()});

/* ---------- 3 · background: anthracite + one slow blue orb on the welcome screens (RYSEON orb(t)) ---------- */
var aura=document.getElementById('aura'),cv=document.createElement('canvas'),ctx=cv.getContext('2d'),W=0,H=0,t0=performance.now(),last=0,TAU=Math.PI*2;
aura.appendChild(cv);
function size(){var r=aura.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);W=Math.max(1,Math.round(r.width*d*.5));H=Math.max(1,Math.round(r.height*d*.5));cv.width=W;cv.height=H}
size();addEventListener('resize',size);
function orb(t){
  var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#131519');g.addColorStop(.45,'#0d0e11');g.addColorStop(1,'#08090b');
  ctx.globalCompositeOperation='source-over';ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.globalCompositeOperation='lighter';
  var fx=.5+.30*Math.sin(TAU*t/23)+.08*Math.sin(TAU*t/7.3),fy=.28+.13*Math.sin(TAU*t/17+1.1)+.04*Math.sin(TAU*t/5.9);
  var x=fx*W,y=fy*H,br=.5+.5*Math.sin(TAU*t/6.5),R=(.42+.05*br)*W;
  function blob(r,stops){var rg=ctx.createRadialGradient(x,y,0,x,y,r);stops.forEach(function(s){rg.addColorStop(s[0],s[1])});ctx.fillStyle=rg;ctx.fillRect(0,0,W,H)}
  blob(R*2.6,[[0,'rgba(30,70,190,'+(.16+.04*br)+')'],[.5,'rgba(22,52,150,.06)'],[1,'rgba(20,40,120,0)']]);
  blob(R,[[0,'rgba(120,160,255,'+(.62+.1*br)+')'],[.35,'rgba(56,108,255,.42)'],[.7,'rgba(36,80,220,.14)'],[1,'rgba(30,70,200,0)']])}
var hideAt=0;
function frame(now){requestAnimationFrame(frame);
  var calm=aura.classList.contains('calm');
  if(calm){if(!hideAt) hideAt=now;if(now-hideAt>700) return}else hideAt=0;   /* inside the app: no orb, nothing to draw */
  if(now-last<33) return;last=now;orb(RM()?0:(now-t0)/1000)}
requestAnimationFrame(frame);

/* ---------- 4a · one-shot pulses that start only once in view (threshold .45) ---------- */
var IO=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){IO.unobserve(en.target);en.target.classList.add('go')}})},{threshold:.45}):null;
function watch(){document.querySelectorAll('.live:not(.go)').forEach(function(el){if(el._io) return;el._io=1;if(IO) IO.observe(el);else el.classList.add('go')})}
var _intro=introSvg;introSvg=function(){return _intro().replace(/repeatCount="indefinite"/g,'repeatCount="1" fill="freeze"')};

/* ---------- 4b · language rail: the language inside the frame is full colour and a little bigger; follows the finger; quiet tick ---------- */
var AC=null,BUF=null,LT=0;
function ac(){try{if(!AC){var A=window.AudioContext||window.webkitAudioContext;if(!A) return null;AC=new A();try{if(navigator.audioSession) navigator.audioSession.type='ambient'}catch(_){}
  var n=Math.floor(AC.sampleRate*.014);BUF=AC.createBuffer(1,n,AC.sampleRate);var d=BUF.getChannelData(0);
  for(var j=0;j<n;j++){var q=j/n;d[j]=(Math.random()*2-1)*Math.pow(1-q,7)*.7+Math.sin(j/AC.sampleRate*2*Math.PI*2600)*Math.pow(1-q,9)*.55}}
  if(AC.state==='suspended') AC.resume();return AC}catch(e){return null}}
['touchstart','touchend','pointerdown'].forEach(function(t){document.addEventListener(t,function(){if(document.getElementById('lang-track')) ac()},{passive:true,capture:true})});
window.vantageTick=function(){var now=performance.now();if(now-LT<38) return;LT=now;
  try{var c=ac();if(c&&BUF&&c.state==='running'){var s=c.createBufferSource(),hp=c.createBiquadFilter(),g=c.createGain();s.buffer=BUF;hp.type='highpass';hp.frequency.value=1400;g.gain.value=.16;s.connect(hp);hp.connect(g);g.connect(c.destination);s.start()}}catch(e){}};
function rail(){var tk=document.getElementById('lang-track');if(!tk||tk._k) return;tk._k=1;tk.classList.add('kr');
  var it=[].slice.call(tk.querySelectorAll('.lang-item')),raf=0;
  function near(){var mid=tk.scrollLeft+tk.clientWidth/2,best=null,bd=1e9;it.forEach(function(b){var d=Math.abs(b.offsetLeft+b.offsetWidth/2-mid);if(d<bd){bd=d;best=b}});return best}
  function paint(){raf=0;var mid=tk.scrollLeft+tk.clientWidth/2;it.forEach(function(b){var w=b.offsetWidth||1,d=Math.abs(b.offsetLeft+w/2-mid)/w,k=Math.max(0,1-d);k=k*k*(3-2*k);b.style.setProperty('--k',k.toFixed(3))});
    var nb=near();if(tk._nb!==nb){if(tk._nb&&tk._user) window.vantageTick();tk._nb=nb}}
  tk.addEventListener('scroll',function(){if(!raf) raf=requestAnimationFrame(paint)},{passive:true});
  ['touchstart','pointerdown','wheel'].forEach(function(t){tk.addEventListener(t,function(){tk._user=true},{passive:true})});
  requestAnimationFrame(paint);setTimeout(paint,120)}

/* ---------- hook after every render ---------- */
var _r=render;render=function(top){_r(top);bindBar();watch();rail()};
render(true);
})();
