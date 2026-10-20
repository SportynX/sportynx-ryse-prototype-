/* ============================================================
   VANTAGE — live "Today" card on Home: a short feed that rotates
   1/3 → 2/3 → 3/3 (summary, then today's updates from the team).
   Only what each athlete shares appears.
   ============================================================ */
(function(){
KIND['Therapy & massage']='r';
var CENTRE='Sports Medical Centre · 35 Brendon Street';
/* today's logged sessions (what the athlete records in RYSEON after training) */
var LOGS={luka:{type:'Team Training',at:'19:12',intensity:'Heavy',rpe:8.5,pain:'Pain in the back of the thigh (hamstring)'}};
/* Jenna: therapy and massage today 16:30–17:50 */
function seed(){THER=THER.filter(function(t){return t.id!=='live1'});THER.push({id:'live1',a:'mateo',k:dkey(TODAY),time:'16:30',dur:80,type:'Therapy & massage',loc:CENTRE,by:'Jenna'})}
seed();var _seed=seedTher;seedTher=function(){_seed();seed()};

/* the logged session shows in the day report too */
var _ev=eventsFor;
eventsFor=function(id,d){var l=_ev(id,d),g=LOGS[id];
  if(g&&sameDay(d,TODAY)) l=l.map(function(e){if(e.type===g.type&&!e.logged){e=Object.assign({},e);e.logged=1;e.note=(e.note?e.note+' · ':'')+'Logged: '+g.intensity.toLowerCase()+', RPE '+g.rpe+(P(id).health?', hamstring pain':'')}return e});
  return l};

function hhmm(t,add){var p=t.split(':'),m=(+p[0])*60+(+p[1])+(add||0);return pad(Math.floor(m/60)%24)+':'+pad(m%60)}
function items(){
  var ids=liveIds(),out=[],sch=ids.filter(function(id){return P(id).schedule});
  /* therapy / massage today (needs Health for physio-type, schedule otherwise) */
  THER.forEach(function(t){if(t.k!==dkey(TODAY)||ids.indexOf(t.a)<0) return;var a=A(t.a),p=P(t.a);if(!p.schedule) return;if(/Physio|Osteopath|Therapy/.test(t.type)&&!p.health) return;
    out.push({k:'ther',id:t.a,at:t.time,ic:CI.heart,lbl:'Therapy',title:a.first+' has '+t.type.toLowerCase(),sub:t.time+'–'+hhmm(t.time,t.dur)+' · '+t.loc,t:'health'})});
  /* logged trainings */
  ids.forEach(function(id){var g=LOGS[id],p=P(id);if(!g||!p.training) return;var a=A(id);
    out.push({k:'log',id:id,at:g.at,ic:CI.up,lbl:'Training logged',title:a.first+' logged today’s '+(g.type==='Team Training'?'club training':g.type.toLowerCase()),sub:g.intensity+' · RPE '+g.rpe+'/10'+(p.health&&g.pain?' · '+g.pain:''),warn:p.health&&g.pain,t:'progress'})});
  /* other teams: one logged session from whoever trained today */
  if(!out.some(function(x){return x.k==='log'})){var who=sch.filter(function(id){return P(id).training&&eventsFor(id,TODAY).some(function(e){return e.k==='t'})})[0];
    if(who){var e=eventsFor(who,TODAY).filter(function(x){return x.k==='t'})[0],a=A(who),r=(6.5+hash(who+'lg')*2).toFixed(1);
      out.push({k:'log',id:who,at:hhmm(e.time,e.dur+15),ic:CI.up,lbl:'Training logged',title:a.first+' logged today’s '+e.type.toLowerCase(),sub:(r>7.5?'Heavy':'Moderate')+' · RPE '+r+'/10',t:'progress'})}}
  out.sort(function(x,y){return x.at<y.at?-1:1});
  return out.slice(0,2);
}
var IDX=0,N=1,RAF=0,T0=0,DIR=1,HOLD=2600,CPS=30,DRAG=null,SWIPED=0;
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function tw(txt){return '<span class="tw" data-full="'+esc(txt)+'"><span class="tw-on"></span><span class="tw-off">'+esc(txt)+'</span></span>'}
function pl(n,w){return n+' '+w+(n===1?'':'s')}
/* slide 1/N — the day across the team: counts, then the agenda */
function summary(){
  var ids=liveIds(),sch=ids.filter(function(id){return P(id).schedule}),ag=[],c={t:0,r:0,m:0,l:0};
  sch.forEach(function(id){var a=A(id);eventsFor(id,TODAY).forEach(function(e){if(c[e.k]!=null) c[e.k]++;ag.push({at:e.time,end:hhmm(e.time,e.dur||0),who:a.first,what:e.type,id:id,k:e.k})})});
  ag.sort(function(x,y){return x.at<y.at?-1:1});
  var parts=[];if(c.m) parts.push(pl(c.m,'match'));if(c.t) parts.push(pl(c.t,'training session'));if(c.r) parts.push(pl(c.r,'recovery session'));if(c.l) parts.push(pl(c.l,'learning session'));
  var title=parts.length?parts.slice(0,3).join(', ').replace(/, ([^,]*)$/,' and $1')+' today':'A rest day for your team';
  var now=pad(new Date().getHours())+':'+pad(new Date().getMinutes()),nx=ag.filter(function(x){return x.at>=now})[0]||ag[0];
  var inj=ids.filter(function(id){return P(id).health&&typeof INJ!=='undefined'&&INJ[id]}).map(function(id){return A(id).first});
  var sub=(nx?'Next up: '+nx.who+' · '+nx.what+' at '+nx.at+'.':'Nothing scheduled.')+(inj.length?' '+inj.join(' and ')+(inj.length===1?' is':' are')+' managing an injury.':'');
  var list=ag.slice(0,3).map(function(x,i){return '<span class="lv-ag" style="--d:'+i+'"><b>'+x.at+'</b><span>'+esc(x.who)+'</span><em>'+esc(x.what)+'</em></span>'}).join('')+
    (ag.length>3?'<span class="lv-ag more" style="--d:3"><b></b><span>+'+(ag.length-3)+' more in Schedule</span></span>':'')+
    (sch.length<ids.length?'<span class="lv-ag more" style="--d:4"><b></b><span>'+(ids.length-sch.length)+' not sharing schedule</span></span>':'');
  return '<div class="lv-s" data-i="0"><span class="mlabel acc">Today · '+fmt(TODAY,'dow')+'</span>'+
    '<span class="lv-t"><b>'+tw(title)+'</b><small>'+tw(sub)+'</small></span>'+(list?'<span class="lv-list">'+list+'</span>':'')+'</div>'}
function feedHTML(){
  var it=items();N=it.length+1;if(IDX>=N) IDX=0;
  var slides=summary()+it.map(function(x,i){var a=A(x.id);
    return '<div class="lv-s lvev'+(x.warn?' warn':'')+'" data-i="'+(i+1)+'" data-id="'+x.id+'" data-t="'+x.t+'"><span class="mlabel acc"><span class="live sm"><i></i>Live</span>'+x.lbl+' · '+x.at+'</span>'+
      '<span class="lv-row">'+ava(a)+'<span class="lv-t"><b>'+tw(x.title)+'</b><small>'+tw(x.sub)+'</small></span></span></div>'}).join('');
  return '<div class="gl focus lv" data-keep="'+esc(it.map(function(x){return x.title+x.sub}).join('|')+summary().length)+'" role="region" aria-label="Today, live" aria-roledescription="carousel"><div class="lv-top"><span class="lv-bars">'+Array.apply(null,Array(N)).map(function(_,i){return '<i class="'+(i<IDX?'done':'')+'"><b></b></i>'}).join('')+'</span><span class="lv-n">'+(IDX+1)+'/'+N+'</span></div><div class="lv-stage">'+slides+'</div></div>';
}
function root(){return document.querySelector('.gl.lv')}
/* lock the stage to the tallest slide so nothing below ever moves */
function fit(r){var st=r.querySelector('.lv-stage'),h=0;r.querySelectorAll('.lv-s').forEach(function(s){h=Math.max(h,s.scrollHeight)});st.style.height=h+'px'}
function typeSet(s,n){var tws=s.querySelectorAll('.tw'),left=n,done=true;
  tws.forEach(function(t){var f=t.dataset.full,k=Math.max(0,Math.min(f.length,left));left-=f.length;
    if(t._k!==k){t._k=k;t.firstChild.textContent=f.slice(0,k);t.lastChild.textContent=f.slice(k)}
    t.classList.toggle('typing',k>0&&k<f.length);if(k<f.length) done=false});
  return done}
function total(s){var n=0;s.querySelectorAll('.tw').forEach(function(t){n+=t.dataset.full.length});return n}
function show(i,dir){var r=root();if(!r) return;var prev=IDX;IDX=(i+N)%N;DIR=dir||(IDX>=prev?1:-1);
  r.querySelectorAll('.lv-s').forEach(function(s){var k=+s.dataset.i;s.style.transform='';s.style.transition='';
    s.classList.remove('in','out','l','r');
    if(k===IDX){s.classList.add('on',DIR>0?'r':'l');void s.offsetWidth;s.classList.remove('r','l');s.classList.add('in');typeSet(s,RM?1e9:0)}
    else if(s.classList.contains('on')){s.classList.remove('on');s.classList.add('out',DIR>0?'l':'r')}});
  r.querySelectorAll('.lv-bars i').forEach(function(b,j){b.className=j<IDX?'done':(j===IDX?'on':'');b.firstChild.style.width=j<IDX?'100%':'0'});
  r.querySelector('.lv-n').textContent=(IDX+1)+'/'+N;
  T0=performance.now()}
function tick(now){var r=root();if(!r){RAF=0;return}RAF=requestAnimationFrame(tick);
  if(document.hidden||DRAG){T0+=16;return}
  var s=r.querySelector('.lv-s.on');if(!s) return;
  var len=total(s),dur=RM?0:len*1000/CPS,el=now-T0,span=dur+HOLD;
  typeSet(s,RM?1e9:Math.floor(el*CPS/1000));
  var b=r.querySelector('.lv-bars i.on b');if(b) b.style.width=Math.min(100,el/span*100)+'%';
  if(N>1&&el>=span) show(IDX+1,1)}
function start(){var r=root();if(!r||r._live) return;r._live=1;fit(r);show(IDX,1);if(!RAF) RAF=requestAnimationFrame(tick)}

var _vh=viewHome;
viewHome=function(){var h=_vh(),i=h.indexOf('<button class="gl focus"');if(i<0) return h;var j=h.indexOf('</button>',i)+9;
  return h.slice(0,i)+feedHTML()+h.slice(j)};
var _r=render;render=function(top){_r(top);start()};
addEventListener('resize',function(){var r=root();if(r) fit(r)});
/* swipe left = next, swipe right = back; the slide follows the finger */
document.addEventListener('pointerdown',function(e){var st=e.target.closest('.lv-stage');if(!st||N<2) return;
  DRAG={x:e.clientX,y:e.clientY,dx:0,on:0,s:st.querySelector('.lv-s.on'),id:e.pointerId,st:st}});
document.addEventListener('pointermove',function(e){if(!DRAG||e.pointerId!==DRAG.id) return;var dx=e.clientX-DRAG.x,dy=e.clientY-DRAG.y;
  if(!DRAG.on){if(Math.abs(dy)>10&&Math.abs(dy)>Math.abs(dx)){DRAG=null;return}if(Math.abs(dx)<8) return;DRAG.on=1;try{DRAG.st.setPointerCapture(e.pointerId)}catch(_){}}
  DRAG.dx=dx;if(DRAG.s){DRAG.s.style.transition='none';DRAG.s.style.transform='translate3d('+dx*.55+'px,0,0)';DRAG.s.style.opacity=Math.max(.35,1-Math.abs(dx)/320)}});
function end(e){if(!DRAG||e.pointerId!==DRAG.id) return;var d=DRAG;DRAG=null;if(!d.on) return;SWIPED=Date.now();
  if(Math.abs(d.dx)>40){if(d.s) d.s.style.opacity='';show(IDX+(d.dx<0?1:-1),d.dx<0?1:-1)}
  else if(d.s){d.s.style.transition='';d.s.style.transform='';d.s.style.opacity=''}}
document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
document.addEventListener('click',function(e){var s=e.target.closest('.gl.lv');if(!s) return;
  if(Date.now()-SWIPED<350){e.preventDefault();e.stopPropagation();return}
  var bar=e.target.closest('.lv-bars i');if(bar){var k=Array.prototype.indexOf.call(bar.parentNode.children,bar);show(k,k>=IDX?1:-1);return}
  var cur=s.querySelector('.lv-s.on');if(cur&&cur.dataset.id){go('athlete',{id:cur.dataset.id,t:cur.dataset.t});return}
  go('schedule')},true);
var _ls=loadScenario;loadScenario=function(k){IDX=0;_ls(k);seed()};
render(true);
})();
