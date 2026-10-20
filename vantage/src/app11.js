/* ============================================================
   VANTAGE — Log activity (same for every role: parent, private
   coach, agent, other). Calendar day → Log activity → choose:
   Training · Therapy & massage · Other. The screen first shows
   how busy each athlete's day already is (club commitments from
   RYSEON + entries already added), and every form warns on clashes.
   ============================================================ */
(function(){
var OTYPES=['Meeting','Video session','Medical check','Travel','Other'];
OTYPES.forEach(function(t){KIND[t]='o'});
canAdd=function(){return true};
canAddTher=function(){return true};
var _evIcon=evIcon;evIcon=function(e){return e.k==='o'?CI.cal:_evIcon(e)};
CI.dots='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="6" cy="12" r=".9"/><circle cx="12" cy="12" r=".9"/><circle cx="18" cy="12" r=".9"/></svg>';

function mins(t){var p=t.split(':');return (+p[0])*60+(+p[1])}
function hm(m){return pad(Math.floor(m/60)%24)+':'+pad(m%60)}
function src(e){return e.by==='you'||e.tby==='you'?'added':(e.k==='m'||e.type==='Team Training'||e.type==='Match Preparation'?'club':'plan')}
/* clashes against everything already in the athlete's day (club + entries) */
clashes=function(f){
  if(!f.k||!f.time) return [];
  var d=parseK(f.k),s=mins(f.time),e=s+f.dur,out=[];
  (f.ath||[]).forEach(function(id){eventsFor(id,d).forEach(function(x){var xs=mins(x.time),xe=xs+x.dur;
    if(xs<e&&s<xe) out.push(A(id).first+' is busy '+x.time+'–'+hm(xe)+' · '+(x.k==='m'?'match':x.type)+(src(x)==='added'?' (already added)':src(x)==='club'?' (club)':''))})});
  return out};

/* day bar 06:00–23:00 with busy blocks */
var D0=360,D1=1380;
function dayBar(evs){return '<span class="lg-bar">'+evs.map(function(x){var s=Math.max(D0,mins(x.time)),e=Math.min(D1,mins(x.time)+x.dur);if(e<=s) return '';
  return '<i class="s-'+src(x)+(x.k==='m'?' m':'')+'" style="left:'+((s-D0)/(D1-D0)*100).toFixed(2)+'%;width:'+Math.max(1.5,(e-s)/(D1-D0)*100).toFixed(2)+'%"></i>'}).join('')+'</span>'}
function free(evs){var b=evs.map(function(x){return [mins(x.time),mins(x.time)+x.dur]}).sort(function(p,q){return p[0]-q[0]}),cur=480,best=null;
  b.concat([[1290,1290]]).forEach(function(r){if(r[0]-cur>=60&&(!best||r[0]-cur>best[1]-best[0])) best=[cur,r[0]];cur=Math.max(cur,r[1])});
  return best?'Free '+hm(best[0])+'–'+hm(best[1]):'No long free window'}
function logSheet(o){
  var d=parseK(o.k),ids=calIds(),off=Math.round((d-TODAY)/864e5);
  var ey=off===0?'Today':(off===1?'Tomorrow':fmt(d,'rel'));
  var h='<div class="dr-top"><button class="lt-back" type="button" data-a="logBack" aria-label="Back">'+I.left+'</button><h2>Log activity</h2><span style="width:46px"></span></div><div class="dr-body">'+
    '<div class="dv-hero"><small>'+esc(ey)+'</small><h3>'+DOW[d.getDay()]+', '+MONTHS[d.getMonth()]+' '+d.getDate()+'</h3><p>What would you like to add?</p></div>'+
    rgroup('Add',[
      rrow({ic:CI.up,l:'Training',sub:'Individual or small-group session · tag athletes',act:'addOpen',attr:' data-k="'+o.k+'"'}),
      rrow({ic:CI.heart,l:'Therapy or massage',sub:'Physio, massage, recovery · with location',act:'therOpen',attr:' data-k="'+o.k+'"'}),
      rrow({ic:CI.dots,l:'Something else',sub:'Meeting, video session, medical check, travel',act:'othOpen',attr:' data-k="'+o.k+'"'})]);
  h+='<section class="rgroup"><h4>Already on this day</h4><div class="lg-legend"><span><i class="s-club"></i>Club</span><span><i class="s-plan"></i>RYSEON plan</span><span><i class="s-added"></i>Added by you</span></div>'+
    '<div class="lg-ticks">'+[6,10,14,18,22].map(function(h){return '<span style="left:'+((h*60-D0)/(D1-D0)*100).toFixed(2)+'%">'+pad(h)+'</span>'}).join('')+'</div><div class="rp-g">'+
    ids.map(function(id){var a=A(id),ev=eventsFor(id,d);
      return '<div class="rp-item lg-a">'+ava(a)+'<span class="t"><b>'+esc(a.first)+'<span class="lg-st">'+(ev.length?ev.length+' busy · '+free(ev):'Free all day')+'</span></b>'+dayBar(ev)+
        (ev.length?'<small>'+ev.map(function(x){return x.time+' '+esc(x.k==='m'?(x.ha==='Away'?'@ ':'vs ')+x.opp:x.type)}).join(' · ')+'</small>':'')+'</span></div>'}).join('')+'</div></section>';
  var notS=liveIds().filter(function(id){return !P(id).schedule});
  if(notS.length) h+='<p class="note">'+notS.map(function(id){return A(id).first}).join(', ')+(notS.length>1?' aren’t':' isn’t')+' sharing a schedule, so you can’t see when '+(notS.length>1?'they are':'they are')+' busy.</p>';
  h+='<p class="note">Anything you add goes to the athlete’s RYSEON calendar. The athlete decides whether to keep it.</p>';
  return h+'</div>';
}

/* Training / Other share one form: mode 'other' swaps the type list and title */
var _addSheet=addSheet;
addSheet=function(o){var h=_addSheet(o);if(o.mode!=='other') return h;
  h=h.replace('<h2>Add training</h2>','<h2>Something else</h2>');
  h=h.replace(/<section class="rgroup"><h4>Session<\/h4><div class="chips wrap">[\s\S]*?<\/div><\/section>/,'<section class="rgroup"><h4>Type</h4><div class="chips wrap">'+OTYPES.map(function(t){return '<button class="chip" type="button" data-a="fType" data-v="'+t+'" aria-pressed="'+(o.f.type===t)+'">'+t+'</button>'}).join('')+'</div></section>');
  h=h.replace(/Add training · (\d+)/,'Add '+esc(o.f.type.toLowerCase())+' · $1').replace('placeholder="Focus, e.g. finishing and first touch"','placeholder="e.g. meeting with the academy staff"').replace('Location, e.g. Jarun pitch 3','Location or address');
  return h};
/* therapy form: show clashes for the chosen athlete */
var _therSheet=therSheet;
therSheet=function(o){var h=_therSheet(o),f=o.f;if(!f.a) return h;var cl=clashes({k:f.k,time:f.time,dur:f.dur,ath:[f.a]});if(!cl.length) return h;
  return h.replace('<section class="rgroup"><h4>Location</h4>','<div class="clash">'+I.info+'<span>'+cl.map(esc).join('<br>')+'</span></div><section class="rgroup"><h4>Location</h4>')};

/* Day report: one "Log activity" entry for everyone */
var _daySheet=daySheet;
daySheet=function(o){var h=_daySheet(o),d=parseK(o.k);
  h=h.replace(/<section class="rgroup"><h4>Plan this day<\/h4>[\s\S]*?<\/div><\/section>(?=<\/div>$)/,'').replace('<p class="note" style="margin-top:18px">View only. Each athlete shares this schedule from RYSEON.</p>','');
  h=h.replace(/<span class="by">Added by you/g,'<span class="by">Added by you in VANTAGE');
  if(d<TODAY) return h;
  return h.replace(/<\/div>$/,'<div class="dr-foot"><button class="lt-save" type="button" data-a="logOpen" data-k="'+o.k+'">'+CI.plus.replace('<svg','<svg style="width:18px;height:18px;margin-right:6px;vertical-align:-3px"')+'Log activity</button></div></div>')};
/* calendar sheet: one button */
var _calSheet=calSheet;
calSheet=function(o){var h=_calSheet(o),m=o.m,k=m.getMonth()===TODAY.getMonth()&&m.getFullYear()===TODAY.getFullYear()?dkey(TODAY):dkey(m<TODAY?TODAY:m);
  return h.replace(/<button class="cal-add" type="button" data-a="(addOpen|therOpen)"[^>]*>[\s\S]*?<\/button>/,'<button class="cal-add" type="button" data-a="logOpen" data-k="'+k+'">'+CI.plus+'Log activity</button>')};
/* Schedule page header button */
var _vs=viewSchedule;
viewSchedule=function(){return _vs().replace(/data-a="addOpen"([^>]*)>(<svg[\s\S]*?<\/svg>)Add training<\/button>/,'data-a="logOpen"$1>$2Log activity</button>')};
/* Health tab: therapy button stays (already there for everyone now) */

var _renderOv=renderOv;
renderOv=function(){var o=S.ov;if(o&&o.t==='log') return '<div class="fullscr" role="dialog" aria-label="Log activity">'+logSheet(o)+'</div>';return _renderOv()};

document.addEventListener('click',function(e){var t=e.target.closest('[data-a]');if(!t) return;var a=t.getAttribute('data-a'),d=t.dataset,o=S.ov;
  if(a==='logOpen'){var k=d.k<dkey(TODAY)?dkey(TODAY):d.k;S.ov={t:'log',k:k,back:o};render()}
  else if(a==='logBack'){S.ov=o.back||null;render()}
  else if(a==='othOpen'){var f=newForm(d.k);f.type='Meeting';f.time='12:00';S.ov={t:'add',mode:'other',f:f,back:o};render()}
},true);
/* therapy save: app7 returns to day only when back is a day sheet; map log → day */
document.addEventListener('click',function(e){var t=e.target.closest('[data-a="therSave"],[data-a="addSave"]');if(!t) return;var o=S.ov;
  if(o&&o.back&&o.back.t==='log'){var lb=o.back;o.back={t:'day',k:lb.k,back:lb.back&&lb.back.t==='day'?lb.back.back:lb.back}}},true);
document.addEventListener('click',function(e){var t=e.target.closest('[data-a="addSave"]');var o=S.ov;if(!t||!o||o.mode!=='other') return;
  e.stopImmediatePropagation();var f=o.f;if(!f.ath.length) return;
  ADDED.push({id:'x'+Date.now(),k:f.k,time:f.time,dur:f.dur,type:f.type,loc:f.loc.trim(),note:f.note.trim(),ath:f.ath.slice()});
  S.ov={t:'day',k:f.k,back:o.back&&o.back.t==='day'?o.back.back:{t:'cal',m:new Date(parseK(f.k).getFullYear(),parseK(f.k).getMonth(),1)}};render();
  toast(f.type+' added · '+f.ath.map(function(z){return A(z).first}).join(', '))},true);
render(true);
})();
