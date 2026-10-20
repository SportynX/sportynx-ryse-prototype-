/* ============================================================
   VANTAGE — app shell & read-only views
   ============================================================ */

/* ---------- small chart helpers (one scale per chart) ---------- */
function lineChart(vals,labels,o){
  o=o||{};var W=600,H=o.h||170,pl=30,pr=14,pt=14,pb=26,mn=o.min!=null?o.min:Math.min.apply(null,vals)-6,mx=o.max!=null?o.max:Math.max.apply(null,vals)+6;
  mn=Math.floor(mn/10)*10;mx=Math.ceil(mx/10)*10;if(mx===mn)mx=mn+10;
  var x=function(i){return pl+(W-pl-pr)*(vals.length===1?.5:i/(vals.length-1))},y=function(v){return pt+(H-pt-pb)*(1-(v-mn)/(mx-mn))};
  var g='',step=(mx-mn)/2;for(var k=0;k<=2;k++){var v=mn+step*k;g+='<line class="gl'+(k===0?' base':'')+'" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y(v)+'" y2="'+y(v)+'"/><text class="gt" x="'+(pl-8)+'" y="'+(y(v)+3.5)+'" text-anchor="end">'+Math.round(v)+'</text>'}
  var d=vals.map(function(v,i){return (i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)}).join(' ');
  var area=d+' L'+x(vals.length-1)+' '+y(mn)+' L'+x(0)+' '+y(mn)+'Z';
  var lb=labels.map(function(l,i){return '<text class="lb" x="'+x(i)+'" y="'+(H-6)+'">'+esc(l)+'</text>'}).join('');
  var last=vals.length-1;
  return '<div class="chart"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.label||'Trend')+'"><defs><linearGradient id="ag" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1F6BFF" stop-opacity=".32"/><stop offset="1" stop-color="#1F6BFF" stop-opacity="0"/></linearGradient></defs>'+g+
    '<path class="ar" d="'+area+'"/><path class="ln" d="'+d+'"/>'+
    vals.map(function(v,i){return '<circle class="pt" cx="'+x(i)+'" cy="'+y(v)+'" r="'+(i===last?4.5:2.4)+'" '+(i===last?'':'opacity=".55"')+'/>'}).join('')+
    '<text class="vl" x="'+Math.min(x(last),W-pr-12)+'" y="'+(y(vals[last])-12)+'">'+vals[last]+'</text>'+lb+'</svg></div>';
}
function barChart(vals,labels,o){
  o=o||{};var W=600,H=o.h||160,pl=34,pr=8,pt=18,pb=26,mx=o.max||Math.max.apply(null,vals)*1.15,n=vals.length,bw=(W-pl-pr)/n;
  var tick=o.tick||niceTick(mx),top=Math.ceil(mx/tick)*tick;var y=function(v){return pt+(H-pt-pb)*(1-v/top)};
  var g='';for(var v=0;v<=top+1e-9;v+=tick){g+='<line class="gl'+(v===0?' base':'')+'" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y(v)+'" y2="'+y(v)+'"/><text class="gt" x="'+(pl-8)+'" y="'+(y(v)+3.5)+'" text-anchor="end">'+(o.fmt?o.fmt(v):v)+'</text>'}
  var b=vals.map(function(v,i){var w=Math.min(46,bw*.56),xx=pl+bw*i+(bw-w)/2;return '<rect class="bar'+(i===n-1?' on':'')+'" x="'+xx+'" y="'+y(v)+'" width="'+w+'" height="'+Math.max(0,y(0)-y(v))+'" rx="5"/>'+(i===n-1?'<text class="vl" x="'+(xx+w/2)+'" y="'+(y(v)-7)+'">'+(o.vfmt?o.vfmt(v):v)+'</text>':'')+'<text class="lb" x="'+(xx+w/2)+'" y="'+(H-6)+'">'+esc(labels[i])+'</text>'}).join('');
  return '<div class="chart"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.label||'Bars')+'">'+g+b+'</svg></div>';
}
function niceTick(m){var s=[1,2,2.5,5,10,20,25,50,100,200,250,500];for(var i=0;i<s.length;i++) if(m/s[i]<=4) return s[i];return 1000}
function spark(vals){
  var W=84,H=26,mn=Math.min.apply(null,vals)-2,mx=Math.max.apply(null,vals)+2;var x=function(i){return 2+(W-4)*i/(vals.length-1)},y=function(v){return 3+(H-6)*(1-(v-mn)/(mx-mn))};
  var d=vals.map(function(v,i){return (i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)}).join(' ');
  return '<svg class="spark" viewBox="0 0 '+W+' '+H+'" aria-hidden="true"><path class="l" d="'+d+'"/><circle cx="'+x(vals.length-1)+'" cy="'+y(vals[vals.length-1])+'" r="2.4"/></svg>';
}
function ladder(l,lg){var h='<span class="ladder'+(lg?' lg':'')+'" aria-hidden="true">';for(var i=0;i<5;i++)h+='<i class="'+(i<=l?'on':'')+'"></i>';return h+'</span>'}
function trendTxt(d,unit){if(d>0) return '+'+d+(unit||'')+' ';if(d<0) return '−'+Math.abs(d)+(unit||'')+' ';return 'Stable '}

/* ---------- shell ---------- */
var NAV=[['home','Home',I.home],['athletes','Athletes',I.users],['schedule','Schedule',I.cal],['reports','Reports',I.doc],['profile','Profile',null]];
function meAva(cls){return '<span class="ava '+(cls||'')+'" style="--h:226" aria-hidden="true">'+esc(S.user.split(' ').map(function(w){return w[0]}).join('').slice(0,2))+'</span>'}
function navCur(k){var v=S.view;if(v==='athlete'||v==='request') v='athletes';if(v==='pricing') v='profile';return v===k}
function renderShell(){
  var L=live(),pl=PLANS[S.plan];
  var side='<aside class="side" aria-label="Main">'+
    '<div class="side-brand"><span class="t"><span class="wm-v">Vantage</span><small>RYSEON family</small></span></div>'+
    '<nav class="snav">'+NAV.map(function(n){return '<button type="button" data-a="nav" data-v="'+n[0]+'"'+(navCur(n[0])?' aria-current="page"':'')+'>'+(n[2]||meAva('sm'))+'<span>'+n[1]+'</span>'+(n[0]==='athletes'&&L.length?'<span class="cnt">'+L.length+'</span>':'')+(n[0]==='reports'&&newReports().length?'<span class="cnt"><i class="dotnew" style="display:inline-block"></i></span>':'')+'</button>'}).join('')+'</nav>'+
    (S.cons.length?'<div class="side-sec"><span class="mlabel">Your athletes</span></div><div class="side-list">'+
      L.map(function(c){var a=A(c.a);return '<button type="button" data-a="openA" data-id="'+a.id+'"'+(S.view==='athlete'&&S.aid===a.id?' aria-current="true"':'')+' title="'+esc(nm(a))+'">'+ava(a)+'<span class="t"><b>'+esc(nm(a))+'</b><small>'+esc(a.ps)+' · '+esc(LEVELS[a.lvl])+'</small></span></button>'}).join('')+
      others().filter(function(c){return c.st==='pending'}).map(function(c){var a=A(c.a);return '<button type="button" class="pend" data-a="openA" data-id="'+a.id+'" title="'+esc(nm(a))+' · pending">'+ava(a,'','locked')+'<span class="t"><b>'+esc(nm(a))+'</b><small>Waiting for approval</small></span></button>'}).join('')+
    '</div>':'')+
    '<button class="side-req" type="button" data-a="reqNew" title="Request another athlete">'+I.reqp+'<span>Request another athlete</span></button>'+
    '<div class="side-foot"><b>'+pl.name+'</b><br>'+L.length+' of '+pl.max+' athletes<div class="usage">'+usageBar()+'</div></div>'+
  '</aside>';
  var bnav='<nav class="bnav" aria-label="Main">'+NAV.map(function(n){return '<button type="button" data-a="nav" data-v="'+n[0]+'"'+(navCur(n[0])?' aria-current="page"':'')+'>'+(n[2]||meAva())+'<span>'+n[1]+'</span></button>'}).join('')+'</nav>';
  return '<div class="shell">'+side+'<main class="main" id="main">'+renderView()+'</main></div>'+bnav;
}
function usageBar(){var pl=PLANS[S.plan],n=live().length,h='';for(var i=0;i<pl.max;i++)h+='<i class="'+(i<n?'on':'')+'"></i>';return h}
function mtop(){return '<div class="mtop"><span class="mwm" aria-label="VANTAGE">Vantage</span><button class="iconbtn" type="button" data-a="reqNew" aria-label="Request another athlete">'+I.reqp+'</button></div>'}

function renderView(){
  var v=S.view;
  if(v==='home') return viewHome();
  if(v==='athletes') return viewAthletes();
  if(v==='athlete') return viewAthlete();
  if(v==='schedule') return viewSchedule();
  if(v==='reports') return viewReports();
  if(v==='profile') return viewProfile();
  if(v==='pricing') return viewPricing();
  if(v==='request') return viewRequest();
  return viewHome();
}

/* ---------- HOME ---------- */
function newReports(){
  var mon=addDays(TODAY,-((TODAY.getDay()+6)%7)),out=[];
  liveIds().forEach(function(id){if(!P(id).reports) return;reportsFor(id).forEach(function(r){if(r.pub>=mon&&!S.read[r.id]) out.push(r)})});
  return out;
}
function todayCounts(ids){
  var c={Training:0,Recovery:0,Match:0,Learning:0,Rest:0};ids.forEach(function(id){c[primary(eventsFor(id,TODAY))]++});return c;
}
function weekMatches(ids){var n=0,end=7-((TODAY.getDay()+6)%7);ids.forEach(function(id){for(var i=0;i<end;i++) if(eventsFor(id,addDays(TODAY,i)).some(function(e){return e.k==='m'})) n++});return n}
function viewHome(){
  var L=live(),ids=liveIds(),h='<div class="page">'+mtop();
  h+='<div class="home-hero rise d1"><div><p class="greet">'+greeting()+', '+esc(S.user.split(' ')[0])+'</p><p class="psub">'+(L.length?(L.length===1?'Your team at a glance.':'Your team at a glance.'):'Welcome to VANTAGE.')+'</p></div>'+
    (L.length?'<div class="count"><b>'+L.length+'</b><span>'+(L.length===1?'Athlete':'Athletes')+'</span></div>':'')+'</div>';
  h+=statusNotices();
  if(!L.length){ return h+zeroHome()+'</div>' }
  var sch=ids.filter(function(id){return P(id).schedule}),c=todayCounts(sch),wm=weekMatches(ids.filter(function(id){return P(id).schedule&&P(id).matches})),nr=newReports();
  var todayRows=[['Training',c.Training],['Recovery',c.Recovery],['Match',c.Match],['Learning',c.Learning],['Rest',c.Rest]].filter(function(x){return x[1]>0});
  h+='<div class="glance rise d1">'+
    '<button class="gl focus" type="button" data-a="nav" data-v="schedule"><span class="mlabel acc">Today · '+fmt(TODAY,'dow')+'</span><span class="row">'+todayRows.map(function(x){return '<span class="kv"><b>'+x[1]+'</b><span>'+x[0]+'</span></span>'}).join('')+'</span>'+(sch.length<ids.length?'<span class="ln">'+(ids.length-sch.length)+' not sharing schedule</span>':'')+'</button>'+
    '<button class="gl" type="button" data-a="schedWeek"><span class="mlabel">Upcoming</span><span class="big">'+wm+'<small>'+(wm===1?'match':'matches')+' this week</small></span>'+upcomingLine(ids)+'</button>'+
    '<button class="gl" type="button" data-a="nav" data-v="reports"><span class="mlabel">Latest reports</span><span class="big">'+nr.length+'<small>new weekly '+(nr.length===1?'report':'reports')+'</small></span><span class="ln">'+(nr.length?'From '+uniq(nr.map(function(r){return A(r.a).first})).slice(0,3).join(', ')+(uniq(nr.map(function(r){return r.a})).length>3?' and others':''):'You’re up to date')+'</span></button>'+
  '</div>';
  if(L.length===1){
    var a=A(L[0].a);
    h+='<div class="grid2 rise d2"><div class="col">'+athleteCard(a,true)+'</div><div class="col">'+todayCard(a)+aiCard(a)+'</div></div>';
  } else {
    h+='<div class="sec-h rise d2"><h2 class="h3">Your team</h2><button class="link" type="button" data-a="nav" data-v="athletes">View all</button></div>';
    h+='<div class="agrid rise d2">'+sortForHome(L).map(function(c){return athleteCard(A(c.a))}).join('')+'</div>';
  }
  return h+'</div>';
}
function uniq(a){return a.filter(function(x,i){return a.indexOf(x)===i})}
function upcomingLine(ids){
  var best=null;ids.forEach(function(id){if(!P(id).schedule||!P(id).matches)return;var m=nextMatch(id);if(m&&(!best||m.date<best.date||(+m.date===+best.date&&m.time<best.time))) best=m});
  if(!best) return '<span class="ln">No matches shared</span>';
  return '<span class="ln">Next: '+esc(A(best.a).first)+' · '+fmt(best.date,'rel')+' '+best.time+'</span>';
}
function sortForHome(L){var ord={Match:0,Training:1,Recovery:2,Learning:3,Rest:4};return L.slice().sort(function(x,y){var px=P(x.a).schedule?ord[primary(eventsFor(x.a,TODAY))]:5,py=P(y.a).schedule?ord[primary(eventsFor(y.a,TODAY))]:5;return px-py})}
function statusNotices(){
  var o=others();if(!o.length) return '';
  return '<div class="reqs rise d1">'+o.map(function(c){var a=A(c.a);
    if(c.st==='invited') return invitedNotice(a,c);
    if(c.st==='pending') return '<div class="req pending">'+ava(a,'','locked')+'<span class="t"><b>Request pending · '+esc(nm(a))+'</b><p>'+esc(a.first)+' needs to approve your connection in RYSEON. Nothing is shared until then.</p></span><span class="acts"><button class="btn btn-quiet btn-sm" type="button" data-a="openA" data-id="'+a.id+'">View</button></span></div>';
    if(c.st==='declined') return '<div class="req">'+ava(a,'','ended')+'<span class="t"><b>Request declined · '+esc(nm(a))+'</b><p>'+esc(a.first)+' chose not to share '+his(a)+' development. No information was shared.</p></span><span class="acts"><button class="btn btn-quiet btn-sm" type="button" data-a="dismiss" data-id="'+a.id+'">Dismiss</button></span></div>';
    if(c.st==='ended') return '<div class="req">'+ava(a,'','ended')+'<span class="t"><b>Access ended · '+esc(nm(a))+'</b><p>This athlete is no longer sharing their RYSEON development with you.</p></span><span class="acts"><button class="btn btn-quiet btn-sm" type="button" data-a="dismiss" data-id="'+a.id+'">Dismiss</button></span></div>';
    return '';}).join('')+'</div>';
}
function zeroHome(){
  var pend=others().some(function(c){return c.st==='pending'||c.st==='invited'});
  return '<div class="endstate rise d2">'+
    '<div class="orbit" style="width:150px;height:150px"><span class="ring"></span><span class="ring"></span><span class="ring"></span><span style="position:relative;width:14px;height:14px;border-radius:50%;background:var(--blue-3);box-shadow:0 0 24px rgba(111,152,255,.7)"></span></div>'+
    '<h2>'+(pend?'Waiting for approval':'No athletes connected')+'</h2>'+
    '<p>'+(pend?'Your request has been sent. As soon as the athlete approves it in RYSEON, their shared development appears here.':'Find an athlete on RYSEON and request access. Once they approve, you’re connected to the development they choose to share.')+'</p>'+
    '<div style="width:min(320px,100%);margin-top:6px;display:flex;flex-direction:column;gap:10px"><button class="btn btn-primary" type="button" data-a="reqNew">'+(pend?'Request another athlete':'Find an athlete')+'</button>'+
      (pend?others().filter(function(c){return c.st==='pending'||c.st==='invited'}).map(function(c){var a=A(c.a);return '<button class="btn btn-sim" type="button" data-a="'+(c.st==='invited'?'invJoin':'simApproveApp')+'" data-id="'+a.id+'"><span class="sim-k">Prototype</span>'+esc(a.first)+(c.st==='invited'?' joins RYSEON</button>':' approves access</button>')}).join(''):'<button class="btn btn-sim" type="button" data-a="demoIn"><span class="sim-k">Prototype</span>Enter as approved</button>')+'</div>'+
  '</div>'+
  '<div class="grid3 rise d3">'+[['Find',I.search,'Search by name or RYSEON ID.'],['Request',I.send,'The athlete approves in RYSEON.'],['Connect',I.eye,'See what they choose to share.']].map(function(s){return '<div class="card"><span class="mlabel acc">'+s[1].replace('<svg','<svg style="width:14px;height:14px"')+s[0]+'</span><p class="sub" style="margin-top:8px;font-size:14px">'+s[2]+'</p></div>'}).join('')+'</div>';
}
function evLabel(e){return e.k==='m'?(e.ha==='Away'?'@ ':'vs ')+e.opp:e.type}
function todayFact(a){
  var p=P(a.id);if(!p.schedule) return '<div class="fact"><span class="mlabel">Today</span><span class="mini-lock">'+I.lock+'Not shared</span></div>';
  var evs=eventsFor(a.id,TODAY),m=evs.filter(function(e){return e.k==='m'})[0],t=m||evs.filter(function(e){return e.k==='t'})[0]||evs[0];
  if(!t) return '<div class="fact"><span class="mlabel">Today</span><b>Rest day</b><span>Nothing scheduled</span></div>';
  return '<div class="fact"><span class="mlabel">Today</span><b>'+esc(m?'Match':t.type)+' · '+t.time+'</b><span>'+(evs.length>1?(evs.length-1)+' more planned':esc(t.note))+'</span></div>';
}
function matchFact(a){
  var p=P(a.id);if(!p.schedule||!p.matches) return '<div class="fact"><span class="mlabel">Next match</span><span class="mini-lock">'+I.lock+'Not shared</span></div>';
  var m=nextMatch(a.id);if(!m) return '<div class="fact"><span class="mlabel">Next match</span><b>None scheduled</b></div>';
  return '<div class="fact match"><span class="mlabel">Next match</span><b>'+fmt(m.date,'rel')+' · '+m.time+'</b><span>'+(m.ha==='Away'?'@ ':'vs ')+esc(m.opp)+'</span></div>';
}
function athleteCard(a,feature){
  var p=P(a.id),dv=p.development;
  return '<button class="acard'+(feature?' feature':'')+'" type="button" data-a="openA" data-id="'+a.id+'">'+
    '<span class="who">'+ava(a,feature?'':'')+'<span class="t"><span class="nm">'+esc(nm(a))+'</span><span class="meta">'+a.age+' · '+esc(a.pos)+' · '+esc(a.club)+'</span></span></span>'+
    '<span class="facts">'+todayFact(a)+matchFact(a)+'</span>'+
    '<span class="lvrow"><span><span class="mlabel" style="font-size:9.5px;color:var(--faint);margin-bottom:6px">Development</span>'+(dv?'<span style="display:flex;align-items:center;gap:10px"><span class="lvl">'+LEVELS[a.lvl]+'</span>'+ladder(a.lvl)+'</span>':'<span class="mini-lock">'+I.lock+'Not shared</span>')+'</span>'+
      (dv?'<span style="display:flex;align-items:center;gap:10px"><span class="trend'+(a.dt?'':' st')+'">'+(a.dt>0?'+'+a.dt:(a.dt<0?'−'+Math.abs(a.dt):'Stable'))+'</span>'+spark(driveSeries(a.id,'week'))+'</span>':'')+'</span>'+
  '</button>';
}
function todayCard(a){
  var p=P(a.id);
  if(!p.schedule) return lockbox(a,'Schedule');
  var evs=eventsFor(a.id,TODAY);
  return '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center"><span class="mlabel acc">Today · '+fmt(TODAY,'dow')+'</span><button class="link" type="button" data-a="openA" data-id="'+a.id+'" data-t="schedule">Full schedule</button></div>'+
    (evs.length?'<div class="tl" style="margin-top:8px">'+evs.map(function(e){return tlItem(e)}).join('')+'</div>':'<p class="sub" style="margin-top:12px">Rest day. Nothing scheduled.</p>')+'</div>';
}
function nowMin(){var d=new Date();return d.getHours()*60+d.getMinutes()}
function tlItem(e,withWho){
  var t=e.time.split(':'),st=(+t[0])*60+(+t[1]),isToday=sameDay(e.date,TODAY),past=e.date<TODAY||(isToday&&st+e.dur<nowMin()),now=isToday&&st<=nowMin()&&st+e.dur>=nowMin();
  var a=A(e.a);
  return '<div class="it '+e.k+(past?' past':'')+(now?' now':'')+'"><span class="tm">'+e.time+'<small>'+e.dur+' min</small></span><span class="mk"></span><span><b>'+esc(e.k==='m'?'Match '+(e.ha==='Away'?'@ ':'vs ')+e.opp:e.type)+'</b><p>'+esc(e.k==='m'?e.note+' · '+e.ha:e.note)+(now?' · <span style="color:var(--blue-2)">Now</span>':'')+'</p>'+(withWho?'<span class="who">'+ava(a,'')+esc(nm(a))+'</span>':'')+'</span></div>';
}
function aiCard(a){
  if(!P(a.id).development) return '';
  return '<div class="ai"><span class="mlabel acc">'+I.spark+'RYSEON AI insight</span><p>'+esc(a.ins)+'</p><span class="src">Shared by '+esc(a.first)+' · This week</span></div>';
}
function lockbox(a,what){return '<div class="lockbox">'+I.lock+'<span><b>'+esc(what)+' not shared</b><p>'+esc(a.first)+' hasn’t shared '+esc(what.toLowerCase())+' with you. Only '+esc(a.first)+' can change this in RYSEON.</p></span></div>'}

/* ---------- ATHLETES ---------- */
function viewAthletes(){
  var L=live(),h='<div class="page">'+mtop();
  h+='<div class="ptop rise d1"><div class="t"><h1 class="ptitle">Athletes</h1><p class="psub">'+L.length+' of '+PLANS[S.plan].max+' on '+PLANS[S.plan].name+'</p></div>'+
    '<button class="btn btn-primary btn-sm" type="button" data-a="reqNew">'+I.reqp+'Request another athlete</button></div>';
  h+=statusNotices();
  if(!L.length) return h+zeroHome()+'</div>';
  if(L.length>2){
    var levelsHere=uniq(L.map(function(c){return A(c.a).lvl})).sort();
    h+='<div class="toolbar rise d1"><label class="field sm">'+I.search+'<span class="sr">Search your team</span><input id="ath-q" data-in="athQ" placeholder="Search your team" value="'+esc(S.athQ)+'"></label>'+
      '<div class="chips" role="group" aria-label="Filter">'+[['all','All'],['match','Match this week']].concat(levelsHere.map(function(l){return ['l'+l,LEVELS[l]]})).map(function(f){return '<button class="chip" type="button" data-a="athF" data-f="'+f[0]+'" aria-pressed="'+(S.athF===f[0])+'">'+f[1]+'</button>'}).join('')+'</div>'+
      '<span class="grow"></span><div class="seg" role="tablist" aria-label="Layout"><button type="button" role="tab" data-a="athV" data-f="cards" aria-selected="'+(S.athV==='cards')+'" aria-label="Cards" style="min-width:48px">'+I.grid.replace('<svg','<svg style="width:17px;height:17px"')+'</button><button type="button" role="tab" data-a="athV" data-f="list" aria-selected="'+(S.athV==='list')+'" aria-label="List" style="min-width:48px">'+I.list.replace('<svg','<svg style="width:17px;height:17px"')+'</button></div></div>';
  }
  h+='<div id="ath-out">'+athOut()+'</div>';
  return h+'</div>';
}
function athFiltered(){
  var q=norm(S.athQ.trim()),f=S.athF;
  return live().map(function(c){return A(c.a)}).filter(function(a){
    if(q&&norm(nm(a)+' '+a.club+' '+a.pos).indexOf(q)<0) return false;
    if(f==='match'){var m=P(a.id).matches&&nextMatch(a.id);if(!m||(m.date-TODAY)/864e5>=7-((TODAY.getDay()+6)%7)) return false}
    if(f.charAt(0)==='l'&&a.lvl!==+f.slice(1)) return false;
    return true;
  });
}
function athOut(){
  var list=athFiltered();
  if(!list.length) return '<div class="empty-s">'+I.search+'<b>No athletes match</b><p>Try another name or clear the filter.</p></div>';
  if(S.athV==='list'&&live().length>2){
    return '<div class="alist fade"><div class="arow head"><span class="mlabel">Athlete</span><span class="mlabel c hide-m">Level</span><span class="mlabel c hide-m">Today</span><span class="mlabel c hide-m">Next match</span><span class="mlabel c">Drive</span><span></span></div>'+
      list.map(function(a){var p=P(a.id),evs=p.schedule?eventsFor(a.id,TODAY):[],m=p.matches&&p.schedule?nextMatch(a.id):null,t=evs.filter(function(e){return e.k==='m'})[0]||evs.filter(function(e){return e.k==='t'})[0]||evs[0];
        return '<button class="arow" type="button" data-a="openA" data-id="'+a.id+'"><span class="who">'+ava(a)+'<span style="min-width:0"><b>'+esc(nm(a))+'</b><small>'+a.age+' · '+esc(a.ps)+' · '+esc(a.club)+'</small></span></span>'+
        '<span class="c hide-m">'+(p.development?'<span>'+LEVELS[a.lvl]+'</span>':'<span class="faint">Not shared</span>')+'</span>'+
        '<span class="c hide-m">'+(p.schedule?(t?'<span>'+esc(t.k==='m'?'Match':t.type)+' · '+t.time+'</span>':'<span class="muted">Rest day</span>'):'<span class="faint">Not shared</span>')+'</span>'+
        '<span class="c hide-m">'+(m?'<span>'+fmt(m.date,'rel')+' · '+m.time+'</span><small>'+(m.ha==='Away'?'@ ':'vs ')+esc(m.opp)+'</small>':'<span class="faint">'+(p.matches&&p.schedule?'None':'Not shared')+'</span>')+'</span>'+
        '<span class="c tab">'+(p.development?'<span>'+a.drive+' <small style="display:inline;color:'+(a.dt>0?'var(--blue-2)':'var(--faint)')+'">'+(a.dt>0?'+'+a.dt:(a.dt<0?'−'+Math.abs(a.dt):'±0'))+'</small></span>':'<span class="faint">—</span>')+'</span>'+I.chev+'</button>'}).join('')+'</div>';
  }
  return '<div class="agrid fade">'+list.map(function(a){return athleteCard(a)}).join('')+'</div>';
}

/* ---------- ATHLETE PROFILE ---------- */
var ATABS=[['overview','Overview'],['schedule','Schedule'],['development','Development'],['performance','Performance'],['learning','Learning'],['reports','Reports'],['access','Access']];
function viewAthlete(){
  var a=A(S.aid),c=conOf(S.aid),h='<div class="page">';
  var L=live();
  h+='<div class="ptop" style="align-items:center"><button class="textbtn" type="button" data-a="nav" data-v="athletes" style="display:flex;align-items:center;gap:6px">'+I.left.replace('<svg','<svg style="width:16px;height:16px"')+'Athletes</button>'+
    (L.length>1?'<div class="switcher" role="group" aria-label="Switch athlete">'+L.map(function(x){var b=A(x.a);return '<button type="button" data-a="openA" data-id="'+b.id+'" aria-current="'+(b.id===S.aid)+'" title="'+esc(nm(b))+'">'+ava(b)+'</button>'}).join('')+'</div>':'')+'</div>';
  if(!c||c.st==='ended') return h+endedState(a)+'</div>';
  if(c.st==='pending') return h+pendingState(a,c)+'</div>';
  if(c.st==='invited') return h+invitedState(a,c)+'</div>';
  if(c.st==='declined') return h+declinedState(a)+'</div>';
  var p=P(a.id);
  h+='<header class="ahead fade">'+ava(a,'xl')+'<div style="min-width:0"><div class="nm">'+esc(a.first)+'<br>'+esc(a.last)+'</div>'+
    '<p class="meta"><b>'+a.age+'</b> · '+esc(a.pos)+' · <b>'+esc(a.club)+'</b> '+esc(a.team)+'</p>'+
    '<div class="tags"><span class="pill solid">'+esc(a.play)+'</span><span class="pill">'+esc(a.ps)+'</span><span class="pill blue"><span class="dot"></span>Shared with you as '+esc(c.rel)+'</span></div></div>'+
    '<div class="lv"><span class="mlabel">Athlete level</span>'+(p.development?'<span class="lvl">'+LEVELS[a.lvl]+'</span>'+ladder(a.lvl,true):'<span class="mini-lock">'+I.lock+'Not shared</span>')+'</div></header>';
  h+='<div class="atabs" role="tablist" aria-label="'+esc(nm(a))+'">'+ATABS.map(function(t){return '<button type="button" role="tab" data-a="atab" data-t="'+t[0]+'" aria-selected="'+(S.atab===t[0])+'">'+t[1]+'</button>'}).join('')+'</div>';
  h+='<div id="atab-body" class="fade">'+athTab(a,p)+'</div>';
  return h+'</div>';
}
function athTab(a,p){
  var t=S.atab;
  if(t==='overview') return tabOverview(a,p);
  if(t==='schedule') return p.schedule?scheduleBlock([a.id],S.asch,true):lockbox(a,'Schedule');
  if(t==='development') return p.development?tabDevelopment(a):lockbox(a,'Development');
  if(t==='performance') return tabPerformance(a,p);
  if(t==='learning') return p.learning?tabLearning(a):lockbox(a,'Learning');
  if(t==='reports') return p.reports?tabReports(a,p):lockbox(a,'Reports');
  if(t==='access') return tabAccess(a,p);
  return '';
}
function tabOverview(a,p){
  var ws=weekSummary(a.id),sl=sleepNights(a.id),avgS=sl.reduce(function(s,v){return s+v},0)/sl.length,lr=learning(a.id),rec=recoveryStatus(a.id),m=p.matches&&p.schedule?nextMatch(a.id):null;
  var left='<div class="col">'+todayCard(a)+
    (p.development?'<div class="card drive"><div style="display:flex;justify-content:space-between;align-items:center"><span class="mlabel acc">Development Drive</span><button class="link" type="button" data-a="atab" data-t="development">Development</button></div>'+
      '<div class="v"><b>'+a.drive+'</b><span class="'+(a.dt?'':'st')+'">'+(a.dt>0?'+'+a.dt+' this week':(a.dt<0?'−'+Math.abs(a.dt)+' this week':'Stable this week'))+'</span></div>'+lineChart(driveSeries(a.id,'month'),seriesLabels('month'),{h:130,label:'Development Drive, last 5 weeks'})+'</div>':lockbox(a,'Development'))+
  '</div>';
  var right='<div class="col">'+
    (p.schedule&&p.matches?(m?'<div class="card focus nm-card"><span class="mlabel acc">Next match</span><div class="vs"><b>'+(m.ha==='Away'?'@ ':'vs ')+esc(m.opp)+'</b></div><p class="when"><b>'+fmt(m.date,'rel')+' · '+m.time+'</b> · '+esc(m.note)+' · '+m.ha+'</p></div>':'<div class="card"><span class="mlabel">Next match</span><p class="sub" style="margin-top:10px">No match in the next four weeks.</p></div>'):lockbox(a,'Matches'))+
    aiCard(a)+
    '<div class="grid4" style="grid-template-columns:1fr 1fr">'+
      statTile('Training',p.training,ws.sessions+'<small>sessions</small>',ws.mins+' min this week')+
      statTile('Sleep',p.sleep,avgS.toFixed(1).replace('.0','')+'<small>h avg</small>','Last 7 nights')+
      statTile('Recovery',p.sleep,'<span style="font-size:22px">'+rec[0]+'</span>',rec[1])+
      statTile('Football learning',p.learning,lr.mins+'<small>min</small>','This month · '+lr.vids+' videos')+
    '</div>'+
    (p.development?'<button class="card tap" type="button" data-a="atab" data-t="development" style="text-align:left;width:100%"><span class="mlabel">Athlete level</span><span style="display:flex;justify-content:space-between;align-items:center;margin-top:12px"><span class="lvl" style="font-size:20px">'+LEVELS[a.lvl]+'</span>'+ladder(a.lvl,true)+'</span><p class="sub" style="margin-top:10px;font-size:13px">'+(a.lvl<4?'Next: '+LEVELS[a.lvl+1]+'. Levels reflect sustained development behaviour.':'Highest level. Levels reflect sustained development behaviour.')+'</p></button>':'')+
  '</div>';
  return '<div class="grid2">'+left+right+'</div>';
}
function statTile(label,ok,v,d){return '<div class="card stat'+(ok?'':' off')+'"><span class="mlabel">'+label+'</span>'+(ok?'<div class="v">'+v+'</div><p class="d">'+d+'</p>':'<div class="v" style="display:flex;align-items:center;gap:6px">'+I.lock.replace('<svg','<svg style="width:13px;height:13px"')+'Not shared</div>')+'</div>'}

var METS=[['c','Consistency','Showing up for planned sessions, week after week.'],['i','Self-Initiative','Sessions and learning started without being assigned.'],['l','Football Learning','Videos, club assignments and learning time.'],['p','Preparation','Match preparation and pre-session routines.'],['h','Professional Habits','Check-ins, sleep timing and daily routine.'],['r','Recovery Discipline','Completing planned recovery and mobility.']];
function tabDevelopment(a){
  var mode=S.dev,vals=driveSeries(a.id,mode),lab=seriesLabels(mode);
  var d=vals[vals.length-1]-vals[0];
  var h='<div class="grid2"><div class="col">'+
    '<div class="card drive"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap"><div><span class="mlabel acc">Development Drive</span><div class="v"><b>'+a.drive+'</b><span class="'+(d?'':'st')+'">'+(d>0?'+'+d:(d<0?'−'+Math.abs(d):'±0'))+' over '+(mode==='week'?'7 days':(mode==='month'?'5 weeks':'12 months'))+'</span></div></div>'+
      '<div class="seg" role="tablist" aria-label="Range">'+[['week','Weekly'],['month','Monthly'],['year','Yearly']].map(function(m){return '<button type="button" role="tab" data-a="dev" data-m="'+m[0]+'" aria-selected="'+(mode===m[0])+'">'+m[1]+'</button>'}).join('')+'</div></div>'+
      lineChart(vals,lab,{h:190,label:'Development Drive'})+
      '<p class="note" style="margin-top:10px">Development Drive summarises the behaviours below. It becomes more reliable as RYSEON collects more history.</p></div>'+
    '<div class="mets">'+METS.map(function(m,i){var v=a.m[m[0]],tr=Math.round((hash(a.id+m[0]+mode)-.35)*8);
      return '<div class="met"><div class="top"><span class="mlabel">'+m[1]+'</span><b>'+v+'</b></div><div class="bar"><i style="width:'+v+'%;animation-delay:'+(i*.06)+'s"></i></div><p class="tr'+(tr>0?'':(tr<0?' mo':' st'))+'">'+(tr>0?'+'+tr+' ':(tr<0?'−'+Math.abs(tr)+' ':'Stable '))+(mode==='week'?'this week':(mode==='month'?'this month':'this year'))+'</p><p class="note" style="margin-top:6px">'+m[2]+'</p></div>'}).join('')+'</div>'+
  '</div><div class="col">'+
    '<div class="card"><span class="mlabel acc">Athlete level</span><div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:12px"><span class="lvl" style="font-size:26px">'+LEVELS[a.lvl]+'</span><span class="muted" style="font-size:13px">Level '+(a.lvl+1)+' of 5</span></div>'+
      '<div class="levels">'+LEVELS.map(function(l,i){return '<div class="'+(i<a.lvl?'on':(i===a.lvl?'cur':''))+'"><i></i><span>'+l+'</span></div>'}).join('')+'</div>'+
      '<div class="lvhist">'+a.lvh.slice().reverse().map(function(x){return '<div><b style="font-weight:600">'+x[0]+'</b><span>'+x[2]+'</span></div>'}).join('')+'</div>'+
      '<p class="note" style="margin-top:14px">Athlete Level represents sustained development behaviour. It does not measure talent, playing ability, fame or popularity.</p></div>'+
    aiCard(a)+
  '</div></div>';
  return h;
}
function tabPerformance(a,p){
  var h='<div class="grid2"><div class="col">';
  if(p.training){var tw=trainingWeeks(a.id),ws=weekSummary(a.id);
    h+='<div class="card"><span class="mlabel acc">Training</span><div class="rp-kv"><div><b>'+ws.sessions+'</b><span>Sessions this week</span></div><div><b>'+ws.mins+'</b><span>Minutes this week</span></div><div><b>'+ws.rpe+'</b><span>Avg RPE · self-reported</span></div></div>'+
      barChart(tw,['W-5','W-4','W-3','W-2','W-1','This wk'],{h:160,label:'Training minutes per week'})+'<p class="note">Training minutes per week, from sessions logged in RYSEON.</p></div>';
  } else h+=lockbox(a,'Training');
  if(p.matches){var pm=pastMatches(a.id,5);
    h+='<div class="card"><span class="mlabel acc">Recent matches</span><div class="rows" style="margin-top:6px">'+(pm.length?pm.map(function(m){return '<div class="r"><span class="ic">'+I.pitch+'</span><span class="t"><b>'+(m.ha==='Away'?'@ ':'vs ')+esc(m.opp)+'</b><small>'+fmt(m.date,'d mon')+' · '+esc(m.note)+' · '+m.mins+' min played · RPE '+m.rpe+'</small></span><span class="v"><span class="res-w">'+m.res+'</span> '+m.score+'</span></div>'}).join(''):'<p class="sub">No matches logged yet.</p>')+'</div></div>';
  } else h+=lockbox(a,'Matches');
  h+='</div><div class="col">';
  if(p.sleep){var sl=sleepNights(a.id),avg=sl.reduce(function(s,v){return s+v},0)/sl.length,rec=recoveryStatus(a.id),lab=[];for(var i=6;i>=0;i--) lab.push(fmt(addDays(TODAY,-i),'dow3'));
    h+='<div class="card"><span class="mlabel acc">Sleep</span><div class="rp-kv" style="grid-template-columns:1fr 1fr"><div><b>'+hm(avg)+'</b><span>Average, last 7 nights</span></div><div><b>'+hm(sl[6])+'</b><span>Last night</span></div></div>'+
      barChart(sl,lab,{h:150,max:10,tick:2.5,fmt:function(v){return v+'h'},vfmt:function(v){return v+'h'},label:'Sleep hours per night'})+'<p class="note">From the health data '+esc(a.first)+' connects to RYSEON.</p></div>'+
      '<div class="card"><span class="mlabel acc">Recovery</span><div style="display:flex;align-items:baseline;gap:12px;margin-top:12px"><b style="font:700 24px/1 var(--font-display);text-transform:uppercase">'+rec[0]+'</b><span class="muted" style="font-size:13.5px">'+rec[1]+'</span></div>'+
      '<div class="rows" style="margin-top:10px">'+recoveryRows(a)+'</div></div>';
  } else h+=lockbox(a,'Sleep & Recovery');
  h+='<div class="rp-foot">'+I.info+'<span>VANTAGE shows what '+esc(a.first)+' logs and shares in RYSEON. It doesn’t draw medical conclusions. Health and injury information is only visible if '+esc(a.first)+' shares it separately.</span></div>';
  return h+'</div></div>';
}
function recoveryRows(a){
  var out=[];for(var i=0;i<10&&out.length<3;i++){var d=addDays(TODAY,-i);eventsFor(a.id,d).forEach(function(e){if(e.k==='r'&&out.length<3&&(i>0||e.time<pad(new Date().getHours())+':00')) out.push(e)})}
  if(!out.length) return '<p class="sub">No recovery sessions in the last 10 days.</p>';
  return out.map(function(e){return '<div class="r"><span class="ic">'+I.wave+'</span><span class="t"><b>'+esc(e.type)+'</b><small>'+fmt(e.date,'rel')+' · '+e.dur+' min · '+esc(e.note)+'</small></span><span class="v muted" style="font-weight:500">Completed</span></div>'}).join('');
}
function tabLearning(a){
  var lr=learning(a.id);
  return '<div class="grid2"><div class="col">'+
    '<div class="card"><span class="mlabel acc">Football learning · this month</span><div class="rp-kv" style="grid-template-columns:repeat(4,1fr)"><div><b>'+lr.mins+'</b><span>Minutes</span></div><div><b>'+lr.vids+'</b><span>Videos completed</span></div><div><b>'+lr.clubDone+'/'+lr.assigned+'</b><span>Club videos</span></div><div><b>'+lr.mental+'</b><span>Mental prep</span></div></div>'+
      barChart(lr.weeks,['W-5','W-4','W-3','W-2','W-1','This wk'],{h:150,label:'Learning minutes per week'})+'<p class="note">Learning minutes per week across RYSEON, club assignments and mental preparation.</p></div>'+
    '<div class="card"><span class="mlabel acc">Recently completed in RYSEON</span><div class="rows" style="margin-top:6px">'+lr.items.map(function(x){return '<div class="r"><span class="ic">'+I.play+'</span><span class="t"><b>'+esc(x.t)+'</b><small>'+esc(x.c)+' · '+x.min+' min</small></span><span class="v muted" style="font-weight:500;font-size:13px">'+fmt(x.d,'rel')+'</span></div>'}).join('')+'</div></div>'+
  '</div><div class="col">'+
    '<div class="card"><span class="mlabel acc">Club learning</span><p class="sub" style="margin-top:8px;font-size:13.5px">Video assignments from '+esc(a.club)+'.</p><div class="rows" style="margin-top:6px">'+lr.club.map(function(x){return '<div class="r"><span class="ic">'+I.play+'</span><span class="t"><b>'+esc(x.t)+'</b><small>Assigned '+fmt(x.d,'rel')+'</small></span><span class="v" style="font-weight:600;font-size:13px;color:'+(x.done?'var(--blue-3)':'var(--faint)')+'">'+(x.done?'Watched':'Not yet')+'</span></div>'}).join('')+'</div></div>'+
    '<div class="card"><span class="mlabel acc">Mental preparation</span><div class="rows" style="margin-top:6px">'+
      '<div class="r"><span class="ic">'+I.wave+'</span><span class="t"><b>Sport Meditation</b><small>Pre-match routine</small></span><span class="v">'+lr.mental+'<small> this month</small></span></div>'+
      '<div class="r"><span class="ic">'+I.bolt+'</span><span class="t"><b>Mental Training</b><small>Focus and pressure routines</small></span><span class="v">'+(lr.mental-1)+'<small> this month</small></span></div></div></div>'+
    '<p class="note">Development goes beyond the pitch. Learning shows how '+esc(a.first)+' studies the game and prepares mentally.</p>'+
  '</div></div>';
}
function tabReports(a,p){
  var rs=reportsFor(a.id);
  return '<div class="grid2"><div class="col"><div class="rlist">'+rs.map(reportCard).join('')+'</div></div><div class="col">'+
    '<div class="shield">'+I.shield+'<span><b>Shared by '+esc(a.first)+'</b><p>Reports summarise schedule, development, training and learning. Health and injury details are never included unless shared separately.</p></span></div></div></div>';
}
function reportCard(r,withName){
  var a=A(r.a),isNew=!S.read[r.id]&&r.pub>=addDays(TODAY,-((TODAY.getDay()+6)%7));
  return '<button class="rcard" type="button" data-a="openR" data-r="'+r.id+'"><span class="doc"><i></i><i></i><i></i></span><span class="t"><b>'+esc(r.type)+(withName?' · '+esc(nm(a)):'')+'</b><small>'+esc(r.title)+' · Published '+fmt(r.pub,'d mon')+'</small></span><span class="r">'+(isNew?'<span class="pill blue">New</span>':'')+I.chev+'</span></button>';
}
function tabAccess(a,p){
  var c=conOf(a.id);
  return '<div class="grid2"><div class="col">'+
    '<div class="shield">'+I.shield+'<span><b>Access provided by '+esc(a.first)+'</b><p>'+esc(a.first)+' decides what you can see and can change it or end access at any time in RYSEON.</p></span></div>'+
    permList(p)+
    '<p class="note">You can’t turn these on from VANTAGE. Health, injury and medical documents always need a separate, explicit choice by the athlete.</p>'+
  '</div><div class="col">'+
    '<div class="card"><span class="mlabel">Connection</span><div class="rows" style="margin-top:6px">'+
      '<div class="r"><span class="t"><b>Relationship</b></span><span class="v">'+esc(c.rel)+'</span></div>'+
      '<div class="r"><span class="t"><b>Connected since</b></span><span class="v">'+fmt(new Date(c.since||a.since),'d mon y')+'</span></div>'+
      '<div class="r"><span class="t"><b>RYSEON ID</b></span><span class="v">'+a.ryid+'</span></div>'+
      '<div class="r"><span class="t"><b>Your access</b></span><span class="v">'+(canAdd()?'View + add training':'Read-only')+'</span></div></div></div>'+
    '<div class="card"><span class="mlabel">Disconnect</span><p class="sub" style="margin-top:8px;font-size:14px">This ends your access to '+esc(a.first)+'’s shared information. To connect again, you’ll need to send a new request.</p><div style="margin-top:14px"><button class="btn btn-quiet btn-sm" type="button" data-a="askStop" data-id="'+a.id+'">Disconnect from '+esc(a.first)+'</button></div></div>'+
  '</div></div>';
}
function permList(p){
  return '<div class="perm">'+PERM_LABELS.map(function(x){var on=!!p[x[0]],sens=x[0]==='health'||x[0]==='medical';return '<div class="p'+(sens?' sens':'')+'"><span>'+PERM_ICON[x[0]]+x[1]+'</span><span class="s'+(on?'':' no')+'"><i></i>'+(on?'Shared':'Not shared')+'</span></div>'}).join('')+'</div>';
}
function endedState(a){
  return '<div class="endstate fade"><span class="ava xl ended" style="--h:'+a.h+'">'+a.first[0]+a.last[0]+'</span><span class="pill">Access ended</span><h2>Access ended</h2><p>This athlete is no longer sharing their RYSEON development with you. Previously shared information is no longer available.</p>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-top:6px"><button class="btn btn-quiet btn-sm" type="button" data-a="dismiss" data-id="'+a.id+'">Remove from list</button><button class="btn btn-primary btn-sm" type="button" data-a="reqAgain" data-id="'+a.id+'">Request again</button></div></div>';
}
function pendingState(a,c){
  return '<div class="endstate fade"><div class="orbit"><span class="ring"></span><span class="ring"></span><span class="ring"></span>'+ava(a,'','locked')+'<span class="lock">'+I.lock+'</span></div><span class="pill"><span class="dot"></span>Request pending</span><h2>'+esc(nm(a))+'</h2><p>'+esc(a.first)+' needs to approve your connection in RYSEON before you can view '+his(a)+' development. No information is shared until then.</p>'+
    '<p class="note">Requested '+(c.ago?c.ago+' days ago':'today')+' as '+esc(c.rel)+'</p>'+
    '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn-quiet btn-sm" type="button" data-a="cancelReq" data-id="'+a.id+'">Cancel request</button>'+'<button class="btn btn-sim btn-sm" type="button" data-a="simApproveApp" data-id="'+a.id+'"><span class="sim-k">Prototype</span>'+esc(a.first)+' approves</button>'+'</div></div>';
}
function declinedState(a){
  return '<div class="endstate fade"><span class="ava xl ended" style="--h:'+a.h+'">'+a.first[0]+a.last[0]+'</span><span class="pill">Request declined</span><h2>Request declined</h2><p>'+esc(a.first)+' chose not to share '+his(a)+' RYSEON development. No information was shared.</p>'+
    '<button class="btn btn-quiet btn-sm" type="button" data-a="dismiss" data-id="'+a.id+'">Remove from list</button></div>';
}
