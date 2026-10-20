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
var IDX=0,TMR=null,N=1;
function slideSummary(inner){return '<div class="lv-s" data-i="0">'+inner+'</div>'}
function feedHTML(summaryInner){
  var it=items();N=it.length+1;if(IDX>=N) IDX=0;
  var slides=slideSummary(summaryInner)+it.map(function(x,i){var a=A(x.id);
    return '<div class="lv-s lvev'+(x.warn?' warn':'')+'" data-i="'+(i+1)+'" data-id="'+x.id+'" data-t="'+x.t+'"><span class="mlabel acc"><span class="live sm"><i></i>Live</span>'+x.lbl+' · '+x.at+'</span>'+
      '<span class="lv-row">'+ava(a)+'<span class="lv-t"><b>'+esc(x.title)+'</b><small>'+esc(x.sub)+'</small></span></span></div>'}).join('');
  return '<div class="gl focus lv" role="region" aria-label="Today, live" aria-live="polite"><div class="lv-top"><span class="lv-bars">'+Array.apply(null,Array(N)).map(function(_,i){return '<i class="'+(i<IDX?'done':(i===IDX?'on':''))+'"><b></b></i>'}).join('')+'</span><span class="lv-n">'+(IDX+1)+'/'+N+'</span></div><div class="lv-stage">'+slides+'</div></div>';
}
function show(i){var r=document.querySelector('.lv');if(!r) return;IDX=i;
  r.querySelectorAll('.lv-s').forEach(function(s){s.classList.toggle('on',+s.dataset.i===i)});
  r.querySelectorAll('.lv-bars i').forEach(function(b,j){b.className=j<i?'done':(j===i?'on':'');var bb=b.querySelector('b');if(bb&&j===i){bb.style.animation='none';void bb.offsetWidth;bb.style.animation=''}});
  var n=r.querySelector('.lv-n');if(n) n.textContent=(i+1)+'/'+N}
function start(){clearInterval(TMR);if(!document.querySelector('.lv')) return;show(IDX);if(N>1) TMR=setInterval(function(){if(document.hidden) return;show((IDX+1)%N)},4500)}

var _vh=viewHome;
viewHome=function(){var h=_vh(),i=h.indexOf('<button class="gl focus"');if(i<0) return h;var j=h.indexOf('</button>',i)+9,btn=h.slice(i,j);
  var inner=btn.replace(/^<button[^>]*>/,'').replace(/<\/button>$/,'');
  return h.slice(0,i)+feedHTML(inner)+h.slice(j)};
var _r=render;render=function(top){_r(top);start()};
document.addEventListener('click',function(e){var s=e.target.closest('.lv');if(!s) return;
  var bar=e.target.closest('.lv-bars i');if(bar){show(Array.prototype.indexOf.call(bar.parentNode.children,bar));start();return}
  var cur=s.querySelector('.lv-s.on');if(cur&&cur.dataset.id){go('athlete',{id:cur.dataset.id,t:cur.dataset.t});return}
  go('schedule')});
var _ls=loadScenario;loadScenario=function(k){IDX=0;_ls(k);seed()};
render(true);
})();
