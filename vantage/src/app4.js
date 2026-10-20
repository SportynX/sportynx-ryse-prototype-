/* ============================================================
   VANTAGE — calendar (same pattern as RYSEON):
   week strip on Home  →  month calendar sheet  →  Day report.
   Private coach: can add a training and tag the athletes.
   Parent / agent / other: view only.
   ============================================================ */
KIND['Small-group Training']='t';
var ADDED=[]; // trainings the coach added in VANTAGE: {id,k,time,dur,type,loc,note,ath:[ids]}
function canAdd(){return S.role==='coach'}

/* merge coach-added sessions into every schedule view */
var _baseEvents=eventsFor;
eventsFor=function(id,d){
  var l=_baseEvents(id,d),k=dkey(d);
  ADDED.forEach(function(x){if(x.k===k&&x.ath.indexOf(id)>=0){var a=ATHLETES[id];l.push({a:id,date:d,type:x.type,time:x.time,dur:x.dur,note:x.loc||'Coach session',k:KIND[x.type]||'t',by:'you',xid:x.id})}});
  return l.sort(function(p,q){return p.time<q.time?-1:(p.time>q.time?1:0)});
};

/* icons (RYSEON day-report style) */
var CI={
  up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  ball:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="m12 7.6 3.6 2.6-1.4 4.2H9.8l-1.4-4.2Z"/><path d="M12 3.5v4.1M15.6 10.2l4.5-1.6M14.2 14.4l2.6 3.7M9.8 14.4l-2.6 3.7M8.4 10.2 3.9 8.6"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3.5" width="16" height="17" rx="2.4"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/></svg>',
  tr:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M7 8v8M17 8v8M4.5 10v4M19.5 10v4"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.8h17M8 3v4M16 3v4"/></svg>',
  trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7"/></svg>'
};
function evIcon(e){return e.k==='m'?CI.ball:(e.k==='r'?CI.heart:(e.k==='l'?CI.play:CI.up))}
function calIds(){return liveIds().filter(function(id){return P(id).schedule})}
function dayEvents(d,ids){var l=[];(ids||calIds()).forEach(function(id){l=l.concat(eventsFor(id,d))});return l}
function parseK(k){var p=k.split('-');return new Date(+p[0],+p[1]-1,+p[2])}
var WDS=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
var MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ---------- 1 · Week strip (Home) — swipe between weeks, tap opens the calendar ---------- */
function weekStrip(){
  var ids=calIds(); if(!ids.length) return '';
  var ws=weekStart(TODAY),pages='';
  for(var w=-2;w<=3;w++){
    var st=addDays(ws,w*7),h='';
    for(var i=0;i<7;i++){var d=addDays(st,i),ev=dayEvents(d,ids),off=Math.round((d-TODAY)/864e5);
      var mk=ev.some(function(e){return e.k==='m'})?'m':(ev.some(function(e){return e.by})?'y':(ev.some(function(e){return e.k==='t'})?'t':''));
      h+='<button type="button" class="h-day'+(off===0?' today':'')+(off<0?' past':'')+'" data-a="calOpen" data-k="'+dkey(d)+'" aria-label="'+fmt(d,'dow')+' '+fmt(d,'d mon')+'"><small>'+WDS[i]+'</small><b>'+d.getDate()+'</b><i class="'+mk+'"></i></button>'}
    pages+='<div class="wk-page'+(w===0?' cur':'')+'">'+h+'</div>';
  }
  return '<div class="wk-wrap rise d1"><div class="wk-head"><span class="mlabel" id="wk-lbl">This week</span><button class="link" type="button" data-a="calOpen" data-k="'+dkey(TODAY)+'">Calendar</button></div><div class="wk-strip" id="wk-strip">'+pages+'</div></div>';
}
function bindStrip(){
  var s=document.getElementById('wk-strip'); if(!s) return;
  var cur=s.querySelector('.wk-page.cur'); s.scrollLeft=cur.offsetLeft-s.offsetLeft;
  var lbl=document.getElementById('wk-lbl'),to;
  s.addEventListener('scroll',function(){clearTimeout(to);to=setTimeout(function(){var i=Math.round(s.scrollLeft/s.clientWidth)-2;lbl.textContent=i===0?'This week':(i===1?'Next week':(i===-1?'Last week':(i>0?'In '+i+' weeks':Math.abs(i)+' weeks ago')))},60)},{passive:true});
}

/* ---------- 2 · Month calendar sheet ---------- */
function calSheet(o){
  var m=o.m,ids=calIds(),first=new Date(m.getFullYear(),m.getMonth(),1),gs=weekStart(first),cells='';
  var last=new Date(m.getFullYear(),m.getMonth()+1,0),n=Math.ceil((((first.getDay()+6)%7)+last.getDate())/7)*7;
  for(var j=0;j<n;j++){var d=addDays(gs,j),ev=dayEvents(d,ids),out=d.getMonth()!==m.getMonth(),off=Math.round((d-TODAY)/864e5);
    var hasM=ev.some(function(e){return e.k==='m'}),hasT=ev.some(function(e){return e.k==='t'}),mine=ev.some(function(e){return e.by});
    var cls=out?'o':(hasM?'g':(ev.length?'n':''));
    var ic=out?'':((hasT?CI.tr:'')+(hasM?CI.ball:'')+(mine?'<i class="me"></i>':''));
    cells+='<button type="button" class="cal-d '+cls+(off===0?' today':'')+'" data-a="dayOpen" data-k="'+dkey(d)+'"><b>'+d.getDate()+'</b><span class="ic">'+ic+'</span></button>'}
  var who=ids.length>1?ids.length+' athletes':(ids.length?A(ids[0]).first:'');
  return '<div class="grab"></div>'+
    '<div class="cal-head"><button class="cal-nav" type="button" data-a="calNav" data-d="-1" aria-label="Previous month">'+I.left+'</button><h3>'+MONTHS[m.getMonth()]+' '+m.getFullYear()+'</h3><button class="cal-nav" type="button" data-a="calNav" data-d="1" aria-label="Next month">'+I.right+'</button></div>'+
    '<div class="cal-scroll"><div class="cal-wd">'+WDS.map(function(x){return '<span>'+x+'</span>'}).join('')+'</div><div class="cal-grid">'+cells+'</div>'+
    '<div class="cal-legend"><span><i class="lg-n"></i>Training</span><span><i class="lg-g"></i>Match</span>'+(canAdd()?'<span><i class="lg-me"></i>Added by you</span>':'')+'<span class="muted">'+esc(who)+'</span></div>'+
    (canAdd()?'<button class="cal-add" type="button" data-a="addOpen" data-k="'+(m.getMonth()===TODAY.getMonth()?dkey(TODAY):dkey(first))+'">'+CI.plus+'Add training</button>':'<p class="note" style="text-align:center;margin-top:4px">View only. Athletes share their schedule from RYSEON.</p>')+
    '</div>';
}

/* ---------- 3 · Day report ---------- */
function rgroup(title,rows){return '<section class="rgroup"><h4>'+title+'</h4><div class="rp-g">'+rows.join('')+'</div></section>'}
function rrow(o){return '<'+(o.act?'button type="button" data-a="'+o.act+'"'+(o.attr||''):'div')+' class="rp-item'+(o.cls?' '+o.cls:'')+'">'+(o.ic?'<span class="ri">'+o.ic+'</span>':'')+'<span class="t"><b>'+o.l+'</b>'+(o.sub?'<small>'+o.sub+'</small>':'')+'</span>'+(o.v?'<span class="v">'+o.v+'</span>':'')+(o.act?I.chev:'')+(o.act?'</button>':'</div>')}
function daySheet(o){
  var d=parseK(o.k),off=Math.round((d-TODAY)/864e5),ids=calIds();
  var ey=off===0?'Today':(off===-1?'Yesterday':(off===1?'Tomorrow':(off>0?'Upcoming':'Day report')));
  var all=dayEvents(d,ids),nMatch=all.filter(function(e){return e.k==='m'}).length;
  var h='<div class="dr-top"><button class="lt-back" type="button" data-a="dayBack" aria-label="Back">'+I.left+'</button><h2>Day report</h2><span style="width:46px"></span></div><div class="dr-body">'+
    '<div class="dv-hero"><small>'+ey+'</small><h3>'+DOW[d.getDay()]+', '+MONTHS[d.getMonth()]+' '+d.getDate()+'</h3><p>'+(all.length?all.length+' '+(all.length===1?'session':'sessions')+(nMatch?' · '+nMatch+(nMatch===1?' match':' matches'):''):'Nothing planned')+(ids.length>1?' · '+ids.length+' athletes':'')+'</p></div>';
  ids.forEach(function(id){
    var a=A(id),ev=eventsFor(id,d);
    var rows=ev.length?ev.map(function(e){
      var title=e.k==='m'?(e.ha==='Away'?'@ ':'vs ')+esc(e.opp):esc(e.type);
      var sub=e.time+' · '+e.dur+' min'+(e.k==='m'?' · '+esc(e.note)+' · '+e.ha:(e.note?' · '+esc(e.note):''));
      if(e.by){var x=ADDED.filter(function(z){return z.id===e.xid})[0],others=x.ath.filter(function(z){return z!==id}).map(function(z){return A(z).first});
        sub+='<span class="by">Added by you'+(others.length?' · with '+esc(others.join(', ')):'')+'</span>'}
      return rrow({ic:evIcon(e),l:title,sub:sub,cls:e.by?'mine':'',v:e.by?'<button class="rp-x" type="button" data-a="addDel" data-x="'+e.xid+'" aria-label="Remove">'+CI.trash+'</button>':''});
    }):[rrow({l:'<span class="muted" style="font-weight:500">Rest day</span>',sub:'Nothing scheduled'})];
    h+='<section class="rgroup"><h4><span class="ava xs" style="--h:'+a.h+'">'+a.first[0]+a.last[0]+'</span>'+esc(nm(a))+'</h4><div class="rp-g">'+rows.join('')+'</div></section>';
  });
  var notS=liveIds().filter(function(id){return !P(id).schedule});
  if(notS.length) h+='<p class="note" style="margin-top:14px">'+notS.map(function(id){return A(id).first}).join(', ')+(notS.length>1?' aren’t':' isn’t')+' sharing a schedule with you.</p>';
  if(canAdd()&&off>=0) h+=rgroup('Plan this day',[rrow({ic:CI.plus,l:'Add training',sub:'Individual or small-group session · tag your athletes',act:'addOpen',attr:' data-k="'+o.k+'"'})]);
  else if(!canAdd()) h+='<p class="note" style="margin-top:18px">View only. Each athlete shares this schedule from RYSEON.</p>';
  return h+'</div>';
}

/* ---------- 4 · Add training (private coach) ---------- */
var TTYPES=['Individual Training','Small-group Training','Gym','Mobility','Video Analysis'];
var DURS=[45,60,75,90,120];
function clashes(f){
  if(!f.k||!f.time) return [];
  var d=parseK(f.k),t=f.time.split(':'),s=(+t[0])*60+(+t[1]),e=s+f.dur,out=[];
  f.ath.forEach(function(id){_baseEvents(id,d).concat([]).forEach(function(x){var u=x.time.split(':'),xs=(+u[0])*60+(+u[1]),xe=xs+x.dur;if(xs<e&&s<xe) out.push(A(id).first+' has '+(x.k==='m'?'a match':x.type)+' at '+x.time)})});
  return out;
}
function addSheet(o){
  var f=o.f,ids=calIds(),cl=clashes(f),ok=f.ath.length>0&&f.time&&f.k;
  return '<div class="dr-top"><button class="lt-back" type="button" data-a="addBack" aria-label="Back">'+I.left+'</button><h2>Add training</h2><span style="width:46px"></span></div><div class="dr-body">'+
    '<section class="rgroup"><h4>Session</h4><div class="chips wrap">'+TTYPES.map(function(t){return '<button class="chip" type="button" data-a="fType" data-v="'+t+'" aria-pressed="'+(f.type===t)+'">'+t+'</button>'}).join('')+'</div></section>'+
    '<section class="rgroup"><h4>When</h4><div class="rp-g">'+
      '<label class="rp-item fld"><span class="ri">'+CI.cal+'</span><span class="t"><b>Date</b></span><input id="f-date" type="date" data-in="fDate" value="'+f.k+'" min="'+dkey(TODAY)+'"></label>'+
      '<label class="rp-item fld"><span class="ri">'+CI.up+'</span><span class="t"><b>Start</b></span><input id="f-time" type="time" data-in="fTime" value="'+f.time+'" step="900"></label>'+
    '</div><div class="chips wrap" style="margin-top:10px">'+DURS.map(function(m){return '<button class="chip" type="button" data-a="fDur" data-v="'+m+'" aria-pressed="'+(f.dur===m)+'">'+m+' min</button>'}).join('')+'</div></section>'+
    '<section class="rgroup"><h4>Tag athletes</h4><div class="tags-a">'+ids.map(function(id){var a=A(id),on=f.ath.indexOf(id)>=0;return '<button type="button" class="tag-a" data-a="fAth" data-id="'+id+'" aria-pressed="'+on+'">'+ava(a)+'<span><b>'+esc(a.first)+'</b><small>'+esc(a.ps)+'</small></span><i>'+I.check+'</i></button>'}).join('')+'</div>'+
      (ids.length>1?'<button class="link" type="button" data-a="fAll" style="margin-top:10px">'+(f.ath.length===ids.length?'Clear all':'Tag all '+ids.length)+'</button>':'')+
      (cl.length?'<div class="clash">'+I.info+'<span>'+cl.map(esc).join('<br>')+'</span></div>':'')+'</section>'+
    '<section class="rgroup"><h4>Details · optional</h4><div class="rp-g">'+
      '<label class="rp-item fld"><span class="ri">'+CI.pin+'</span><input id="f-loc" type="text" data-in="fLoc" placeholder="Location, e.g. Jarun pitch 3" value="'+esc(f.loc)+'"></label>'+
      '<label class="rp-item fld"><span class="ri">'+CI.play+'</span><input id="f-note" type="text" data-in="fNote" placeholder="Focus, e.g. finishing and first touch" value="'+esc(f.note)+'"></label>'+
    '</div></section>'+
    '<p class="note">Tagged athletes receive this session in RYSEON. Each athlete decides whether to add it to their calendar.</p>'+
    '<div class="dr-foot"><button class="lt-save" type="button" data-a="addSave" id="f-save"'+(ok?'':' disabled')+'>'+(f.ath.length?'Add training · '+f.ath.length+' '+(f.ath.length===1?'athlete':'athletes'):'Tag at least one athlete')+'</button></div>'+
  '</div>';
}

/* ---------- overlay hook: these render inside the device as RYSEON-style sheets/screens ---------- */
var _renderOv=renderOv;
renderOv=function(){
  var o=S.ov; if(!o) return '';
  if(o.t==='cal') return '<div class="scrim cal-scrim" data-a="scrim"><div class="sheet calsheet" role="dialog" aria-label="Calendar">'+calSheet(o)+'</div></div>';
  if(o.t==='day') return '<div class="fullscr" role="dialog" aria-label="Day report">'+daySheet(o)+'</div>';
  if(o.t==='add') return '<div class="fullscr" role="dialog" aria-label="Add training">'+addSheet(o)+'</div>';
  return _renderOv();
};

/* Home: week strip under the greeting · Schedule: Add training for coaches */
var _viewHome=viewHome;
viewHome=function(){var h=_viewHome();var i=h.indexOf('<div class="glance');if(i<0) i=h.indexOf('<div class="grid2');return i<0?h:h.slice(0,i)+weekStrip()+h.slice(i)};
var _viewSchedule=viewSchedule;
viewSchedule=function(){var h=_viewSchedule();if(!canAdd()||!calIds().length) return h.replace('Shared RYSEON schedules. View only.','Shared RYSEON schedules. View only.');
  return h.replace('Shared RYSEON schedules. View only.','Shared RYSEON schedules, plus the sessions you add.').replace('<div class="ptop rise d1"><div class="t"><h1 class="ptitle">Schedule</h1>','<div class="ptop rise d1" style="align-items:center"><div class="t"><h1 class="ptitle">Schedule</h1>').replace(/(<p class="psub">Shared RYSEON schedules, plus the sessions you add.<\/p><\/div>)/,'$1<button class="btn btn-primary btn-sm" type="button" data-a="addOpen" data-k="'+dkey(S.sch.date<TODAY?TODAY:S.sch.date)+'">'+CI.plus.replace('<svg','<svg style="width:16px;height:16px"')+'Add training</button>')};
var _render=render;
render=function(top){_render(top);bindStrip();var c=document.querySelector('.calsheet');if(c) requestAnimationFrame(function(){c.classList.add('on')})};

/* ---------- actions ---------- */
function newForm(k){var ids=calIds();return {k:k<dkey(TODAY)?dkey(TODAY):k,time:'17:00',dur:60,type:'Individual Training',ath:S.aid&&S.view==='athlete'&&ids.indexOf(S.aid)>=0?[S.aid]:(ids.length===1?[ids[0]]:[]),loc:'',note:''}}
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-a]'); if(!t) return; var a=t.getAttribute('data-a'),d=t.dataset,o=S.ov;
  switch(a){
    case 'calOpen': var dd=parseK(d.k);S.ov={t:'cal',m:new Date(dd.getFullYear(),dd.getMonth(),1)};render();break;
    case 'calNav': o.m=new Date(o.m.getFullYear(),o.m.getMonth()+(+d.d),1);var sh=document.querySelector('.calsheet');sh.innerHTML=calSheet(o);break;
    case 'dayOpen': S.ov={t:'day',k:d.k,back:o&&o.t==='cal'?o:null};render();break;
    case 'dayBack': S.ov=o.back||null;render();break;
    case 'addOpen': if(!canAdd()) break; S.ov={t:'add',f:newForm(d.k),back:o};render();break;
    case 'addBack': S.ov=o.back||null;render();break;
    case 'fType': o.f.type=d.v;render();break;
    case 'fDur': o.f.dur=+d.v;render();break;
    case 'fAth': var i=o.f.ath.indexOf(d.id);if(i>=0) o.f.ath.splice(i,1);else o.f.ath.push(d.id);render();break;
    case 'fAll': var all=calIds();o.f.ath=o.f.ath.length===all.length?[]:all.slice();render();break;
    case 'addSave': var f=o.f;if(!f.ath.length) break;
      ADDED.push({id:'x'+Date.now(),k:f.k,time:f.time,dur:f.dur,type:f.type,loc:f.loc.trim(),note:f.note.trim(),ath:f.ath.slice()});
      S.ov={t:'day',k:f.k,back:{t:'cal',m:new Date(parseK(f.k).getFullYear(),parseK(f.k).getMonth(),1)}};render();
      toast('Training added · '+f.ath.map(function(z){return A(z).first}).join(', '));break;
    case 'addDel': ADDED=ADDED.filter(function(z){return z.id!==d.x});render();toast('Training removed');break;
  }
});
document.addEventListener('input',function(e){
  var t=e.target,k=t.getAttribute('data-in'),o=S.ov; if(!o||o.t!=='add') return;
  if(k==='fDate'&&t.value){o.f.k=t.value;render()}
  else if(k==='fTime'&&t.value){o.f.time=t.value;var c=document.querySelector('.clash');var cl=clashes(o.f);if(c&&!cl.length) c.remove();else if(cl.length) render()}
  else if(k==='fLoc') o.f.loc=t.value;
  else if(k==='fNote') o.f.note=t.value;
});
/* scenario switch / sign-out clear coach sessions */
var _loadScenario=loadScenario;loadScenario=function(k){ADDED=[];_loadScenario(k)};
render(true);
