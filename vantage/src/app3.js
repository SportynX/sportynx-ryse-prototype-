/* ============================================================
   VANTAGE — schedule, reports, profile, pricing, request flow,
   overlays, prototype controls, events & boot
   ============================================================ */

/* ---------- SCHEDULE (view-only: no add / edit / delete / reschedule) ---------- */
function isPhone(){var d=document.getElementById('device');return (d?d.clientWidth:window.innerWidth)<=760}
function weekStart(d){return addDays(d,-((d.getDay()+6)%7))}
function scheduleBlock(ids,st,single){
  var key=single?'a':'p',mode=st.mode,d=st.date,label;
  if(mode==='day') label=(sameDay(d,TODAY)?'Today · ':'')+fmt(d,'dow')+' '+fmt(d,'d mon');
  else if(mode==='week'){var ws=weekStart(d);label=fmt(ws,'d mon')+' – '+fmt(addDays(ws,6),'d mon')}
  else label=d.toLocaleString('en-GB',{month:'long',year:'numeric'});
  var h='<div class="schedbar" style="margin-bottom:14px"><div class="seg" role="tablist" aria-label="Range">'+[['day','Day'],['week','Week'],['month','Month']].map(function(m){return '<button type="button" role="tab" data-a="schMode" data-s="'+key+'" data-m="'+m[0]+'" aria-selected="'+(mode===m[0])+'">'+m[1]+'</button>'}).join('')+'</div>'+
    '<div class="datenav"><button class="iconbtn" type="button" data-a="schNav" data-s="'+key+'" data-d="-1" aria-label="Previous">'+I.left+'</button><b>'+esc(label)+'</b><button class="iconbtn" type="button" data-a="schNav" data-s="'+key+'" data-d="1" aria-label="Next">'+I.right+'</button></div>'+
    '<button class="textbtn" type="button" data-a="schNav" data-s="'+key+'" data-d="0">Today</button><span style="flex:1"></span>'+
    '<div class="legend"><span><i class="m"></i>Match</span><span><i></i>Training</span><span><i class="r"></i>Recovery</span><span><i class="l"></i>Learning</span></div></div>';
  if(mode==='day'){
    var evs=[];ids.forEach(function(id){evs=evs.concat(eventsFor(id,d))});evs.sort(function(x,y){return x.time<y.time?-1:(x.time>y.time?1:0)});
    h+='<div class="card">'+(evs.length?'<div class="tl">'+evs.map(function(e){return tlItem(e,!single)}).join('')+'</div>':'<p class="sub">Nothing scheduled.</p>')+'</div>';
  } else if(mode==='week'){
    var ws2=weekStart(d),days=[];for(var i=0;i<7;i++) days.push(addDays(ws2,i));
    if(single||isPhone()){
      h+='<div class="days">'+days.map(function(day){var ev=[];ids.forEach(function(id){ev=ev.concat(eventsFor(id,day))});ev.sort(function(x,y){return x.time<y.time?-1:1});
        return '<div class="dayblk'+(sameDay(day,TODAY)?' today':'')+'"><h4><span>'+fmt(day,'dow')+' '+fmt(day,'d mon')+'</span><span>'+(sameDay(day,TODAY)?'Today':'')+'</span></h4>'+(ev.length?'<div class="tl">'+ev.map(function(e){return tlItem(e,!single)}).join('')+'</div>':'<p class="sub" style="padding:8px 0 4px;font-size:14px">Rest day</p>')+'</div>'}).join('')+'</div>';
    } else {
      h+='<div class="wk"><table><thead><tr><th>Athlete</th>'+days.map(function(day){return '<th class="'+(sameDay(day,TODAY)?'today':'')+'">'+fmt(day,'dow3')+' '+day.getDate()+'</th>'}).join('')+'</tr></thead><tbody>'+
        ids.map(function(id){var a=A(id);return '<tr><td><button class="ath" type="button" data-a="openA" data-id="'+id+'" data-t="schedule">'+ava(a)+'<span style="min-width:0"><b>'+esc(nm(a))+'</b><small>'+esc(a.ps)+' · '+esc(a.team)+'</small></span></button></td>'+
          days.map(function(day){var ev=eventsFor(id,day);return '<td class="'+(sameDay(day,TODAY)?'today':'')+'">'+ev.map(function(e){return '<span class="ev '+e.k+'"><small>'+e.time+'</small>'+esc(e.k==='m'?(e.ha==='Away'?'@ ':'vs ')+e.opp:e.type)+'</span>'}).join('')+'</td>'}).join('')+'</tr>'}).join('')+
      '</tbody></table></div>';
    }
  } else {
    var first=new Date(d.getFullYear(),d.getMonth(),1),gs=weekStart(first),cells=[];for(var j=0;j<42;j++) cells.push(addDays(gs,j));
    if(cells[35].getMonth()!==d.getMonth()) cells=cells.slice(0,35);
    h+='<div class="month">'+['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(function(x){return '<span class="dh">'+x+'</span>'}).join('')+
      cells.map(function(day){var ev=[];ids.forEach(function(id){ev=ev.concat(eventsFor(id,day))});var ms=ev.filter(function(e){return e.k==='m'});
        var dots=ids.length>3?ms.map(function(){return '<i class="m"></i>'}).join(''):ev.map(function(e){return '<i class="'+e.k+'"></i>'}).join('');
        var mt=ms.length?(ids.length>1?(ms.length===1?A(ms[0].a).first+' · '+ms[0].time:ms.length+' matches'):(ms[0].ha==='Away'?'@ ':'vs ')+ms[0].opp):'';
        return '<button class="dc'+(day.getMonth()!==d.getMonth()?' out':'')+(sameDay(day,TODAY)?' today':'')+'" type="button" data-a="schDay" data-s="'+key+'" data-k="'+dkey(day)+'" aria-label="'+fmt(day,'dow')+' '+fmt(day,'d mon')+(ms.length?', '+ms.length+' match':'')+'"><span class="n">'+day.getDate()+'</span><span class="dots">'+dots+'</span>'+(mt?'<span class="mt">'+esc(mt)+'</span>':'')+'</button>'}).join('')+'</div>';
    if(ids.length>3) h+='<p class="note" style="margin-top:10px">With several athletes, the month view shows matches. Select a day or one athlete for every session.</p>';
  }
  return h;
}
function viewSchedule(){
  var ids=liveIds(),shared=ids.filter(function(id){return P(id).schedule}),notS=ids.filter(function(id){return !P(id).schedule});
  var h='<div class="page">'+mtop()+'<div class="ptop rise d1"><div class="t"><h1 class="ptitle">Schedule</h1><p class="psub">Shared RYSEON schedules. View only.</p></div></div>';
  if(!ids.length) return h+zeroHome()+'</div>';
  if(!shared.length) return h+'<div class="endstate"><h2>No schedules shared</h2><p>None of your athletes are sharing their schedule with you.</p></div></div>';
  if(shared.length>1){
    h+='<div class="chips rise d1" role="group" aria-label="Athletes"><button class="chip" type="button" data-a="schWho" data-id="all" aria-pressed="'+(S.sch.who==='all')+'">All athletes</button>'+shared.map(function(id){var a=A(id);return '<button class="chip" type="button" data-a="schWho" data-id="'+id+'" aria-pressed="'+(S.sch.who===id)+'">'+ava(a)+esc(a.first)+'</button>'}).join('')+'</div>';
  }
  var sel=S.sch.who==='all'||shared.indexOf(S.sch.who)<0?shared:[S.sch.who];
  h+='<div class="rise d2">'+scheduleBlock(sel,S.sch,sel.length===1&&shared.length===1)+'</div>';
  if(notS.length) h+='<p class="note">'+notS.map(function(id){return A(id).first}).join(', ')+(notS.length>1?' aren’t':' isn’t')+' sharing a schedule with you.</p>';
  return h+'</div>';
}

/* ---------- REPORTS ---------- */
function viewReports(){
  var ids=liveIds(),shared=ids.filter(function(id){return P(id).reports}),notS=ids.filter(function(id){return !P(id).reports});
  var h='<div class="page'+(ids.length>1?'':' narrow')+'">'+mtop()+'<div class="ptop rise d1"><div class="t"><h1 class="ptitle">Reports</h1><p class="psub">Reports your athletes have chosen to share with you.</p></div></div>';
  if(!ids.length) return h+zeroHome()+'</div>';
  var all=[];shared.forEach(function(id){all=all.concat(reportsFor(id))});
  h+='<div class="toolbar rise d1"><div class="chips" role="group" aria-label="Type">'+[['all','All'],['Weekly Report','Weekly'],['Monthly Report','Monthly'],['Development Report','Development']].map(function(f){return '<button class="chip" type="button" data-a="repF" data-f="'+f[0]+'" aria-pressed="'+(S.repF===f[0])+'">'+f[1]+'</button>'}).join('')+'</div>'+
    (shared.length>1?'<div class="chips" role="group" aria-label="Athlete"><button class="chip" type="button" data-a="repA" data-f="all" aria-pressed="'+(S.repA==='all')+'">Everyone</button>'+shared.map(function(id){var a=A(id);return '<button class="chip" type="button" data-a="repA" data-f="'+id+'" aria-pressed="'+(S.repA===id)+'">'+ava(a)+esc(a.first)+'</button>'}).join('')+'</div>':'')+'</div>';
  var list=all.filter(function(r){return (S.repF==='all'||r.type===S.repF)&&(S.repA==='all'||r.a===S.repA)}).sort(function(x,y){return y.pub-x.pub||(x.a<y.a?-1:1)});
  var mon=weekStart(TODAY),nw=list.filter(function(r){return r.pub>=mon}),old=list.filter(function(r){return r.pub<mon});
  h+='<div class="rise d2" style="display:flex;flex-direction:column;gap:22px">';
  if(nw.length) h+='<div><div class="sec-h" style="margin:0 0 12px"><span class="mlabel acc">This week</span></div><div class="rlist">'+nw.map(function(r){return reportCard(r,shared.length>1)}).join('')+'</div></div>';
  h+='<div><div class="sec-h" style="margin:0 0 12px"><span class="mlabel">Earlier</span></div><div class="rlist">'+(old.length?old.slice(0,24).map(function(r){return reportCard(r,shared.length>1)}).join(''):'<p class="sub">No earlier reports.</p>')+'</div></div>';
  h+='</div>';
  if(notS.length) h+='<p class="note">'+notS.map(function(id){return A(id).first}).join(', ')+(notS.length>1?' aren’t':' isn’t')+' sharing reports with you.</p>';
  h+='<div class="rp-foot">'+I.shield+'<span>Health, injury and medical information is never included in reports unless the athlete shares it separately.</span></div>';
  return h+'</div>';
}
function findReport(rid){var id=rid.split('-')[0],rs=reportsFor(id);for(var i=0;i<rs.length;i++) if(rs[i].id===rid) return rs[i];return null}
function reportSheet(rid){
  var r=findReport(rid),a=A(r.a),p=P(a.id),rh=function(k){return hash(rid+k)};
  var weekly=r.type==='Weekly Report',monthly=r.type==='Monthly Report',mult=weekly?1:(monthly?4.3:13);
  var sess=Math.round((a.tpl==='pro'?8:6)*mult*(.85+rh('s')*.2)),mins=Math.round(sess*(70+rh('m')*15)),matches=Math.round((weekly?1:(monthly?4:11))*(.8+rh('x')*.25)),
    lmin=Math.round((weekly?28:(monthly?110:330))*(.8+rh('l')*.5)),slp=(a.age<17?8.4:7.9)+(rh('z')-.5)*.6,dd=Math.round((rh('d')-.3)*(weekly?6:10));
  var sum=weekly?a.ins:(monthly?'Training and learning followed a consistent pattern across the month. '+(dd>0?'Development Drive rose by '+dd+' points.':'Development Drive held steady.'):'Development behaviour across the quarter was sustained, supporting the current '+LEVELS[a.lvl]+' level.');
  S.read[rid]=1;
  return '<div class="sheet-h"><span style="display:flex;align-items:center;gap:12px;min-width:0">'+ava(a,'sm')+'<span class="mlabel" style="min-width:0">'+esc(nm(a))+' · '+esc(r.type)+'</span></span><button class="iconbtn" type="button" data-a="closeOv" aria-label="Close">'+I.x+'</button></div>'+
    '<div class="sheet-b"><div><h2 class="rp-h">'+esc(r.title)+'</h2><p class="sub" style="margin-top:8px;font-size:14px">'+fmt(r.start,'d mon')+' – '+fmt(r.end,'d mon y')+' · Published '+fmt(r.pub,'d mon')+' · Shared by '+esc(a.first)+'</p></div>'+
    '<div class="ai"><span class="mlabel acc">'+I.spark+'RYSEON AI summary</span><p>'+esc(sum)+'</p></div>'+
    (p.training||p.matches?'<div class="rp-sec"><span class="mlabel">Training & matches</span><div class="rp-kv"><div><b>'+(p.training?sess:'—')+'</b><span>Sessions</span></div><div><b>'+(p.training?mins:'—')+'</b><span>Training minutes</span></div><div><b>'+(p.matches?matches:'—')+'</b><span>Matches</span></div></div></div>':'')+
    (p.development?'<div class="rp-sec"><span class="mlabel">Development</span><div class="rp-kv"><div><b>'+a.drive+'</b><span>Development Drive</span></div><div><b>'+(dd>0?'+'+dd:(dd<0?'−'+Math.abs(dd):'±0'))+'</b><span>Change in period</span></div><div><b style="font-size:17px;text-transform:uppercase">'+LEVELS[a.lvl]+'</b><span>Athlete level</span></div></div></div>':'')+
    (p.learning?'<div class="rp-sec"><span class="mlabel">Learning</span><div class="rp-kv"><div><b>'+lmin+'</b><span>Learning minutes</span></div><div><b>'+Math.max(1,Math.round(lmin/7))+'</b><span>Videos completed</span></div><div><b>'+Math.round(weekly?1:(monthly?4:12))+'</b><span>Club videos watched</span></div></div></div>':'')+
    (p.sleep?'<div class="rp-sec"><span class="mlabel">Sleep & recovery</span><div class="rp-kv" style="grid-template-columns:1fr 1fr"><div><b>'+hm(slp)+'</b><span>Average sleep</span></div><div><b>'+Math.round((weekly?2:(monthly?9:26))*(.9+rh('r')*.2))+'</b><span>Recovery sessions</span></div></div></div>':'')+
    '<div class="rp-foot">'+I.lock+'<span>'+(p.health?'Health and injury information is shared separately in RYSEON and is not part of this report.':'Health and injury information is not included. '+esc(a.first)+' hasn’t shared it with you.')+'</span></div></div>';
}

/* ---------- PROFILE (the VANTAGE user's own account) ---------- */
function viewProfile(){
  var pl=PLANS[S.plan],L=live(),n=L.length;
  var h='<div class="page narrow">'+mtop()+'<div class="me rise d1">'+meAva()+'<div><b>'+esc(S.user)+'</b><small>'+esc(S.email)+' · '+roleLabel(S.role)+'</small></div></div>';
  h+='<div class="card focus rise d1"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap"><div><span class="mlabel acc">Your plan</span><p style="margin-top:10px;font:700 22px/1 var(--font-display);text-transform:uppercase">'+pl.name+'</p><p class="sub" style="margin-top:8px;font-size:14px">'+n+' of '+pl.max+' athletes · €'+price(S.plan,Math.max(n,1)).toFixed(2)+' / month</p></div>'+
    '<button class="btn btn-primary btn-sm" type="button" data-a="nav" data-v="pricing">Manage plan</button></div><div class="usage">'+usageBar()+'</div></div>';
  h+='<div class="sec-h rise d2"><h2 class="h3">Connections</h2><button class="link" type="button" data-a="reqNew">Request another athlete</button></div>';
  h+='<div class="set rise d2">'+(S.cons.length?S.cons.map(function(c){var a=A(c.a),st={connected:['Connected','blue'],pending:['Pending',''],declined:['Declined',''],ended:['Access ended','']}[c.st];
      return '<button type="button" data-a="openA" data-id="'+a.id+'"'+(c.st==='connected'?' data-t="access"':'')+'>'+ava(a,'',c.st==='connected'?'':(c.st==='pending'?'locked':'ended'))+'<span class="t">'+esc(nm(a))+'<small>'+esc(c.rel)+(c.st==='connected'?' · '+PERM_LABELS.filter(function(x){return P(a.id)[x[0]]}).length+' of 9 areas shared':'')+'</small></span><span class="pill '+st[1]+'">'+st[0]+'</span>'+I.chev+'</button>'}).join(''):'<div><span class="t muted">No connections yet</span></div>')+'</div>';
  h+='<div class="sec-h rise d2"><h2 class="h3">Account</h2></div><div class="set rise d2">'+
    '<button type="button" data-a="ovRole">'+I.role.replace('<svg','<svg class="i"')+'<span class="t">How you use VANTAGE<small>Personalises VANTAGE. It doesn’t change what athletes share.</small></span><span class="v">'+roleLabel(S.role)+'</span>'+I.chev+'</button>'+
    '<button type="button" data-a="goLang">'+I.globe.replace('<svg','<svg class="i"')+'<span class="t">Language</span><span class="v">'+esc(LANGS[S.lang][1])+'</span>'+I.chev+'</button>'+
    '<button type="button" data-a="nav" data-v="pricing">'+I.card.replace('<svg','<svg class="i"')+'<span class="t">Subscription & billing</span><span class="v">'+pl.short+'</span>'+I.chev+'</button>'+
    '<button type="button" data-a="signOut">'+I.out.replace('<svg','<svg class="i"')+'<span class="t">Sign out</span></button></div>';
  h+='<div class="sec-h rise d3"><h2 class="h3">Privacy</h2></div><div class="shield rise d3">'+I.shield+'<span><b>The athlete stays in control</b><p>VANTAGE is read-only. Athletes approve every connection, choose what you see, and can end access at any time from RYSEON. Health and medical information is private unless an athlete shares it separately.</p></span></div>';
  h+='<div class="sec-h rise d3"><h2 class="h3">RYSEON product family</h2></div>'+familyHtml();
  return h+'</div>';
}
function familyHtml(){
  return '<div class="family rise d3"><div><b class="wm">RYSE<span class="on">ON</span></b><p>For athlete development.</p></div><div class="here"><b>Vantage</b><p>For parents, private coaches and agents with athlete-approved viewing access.</p></div><div><b class="wm">RYSE<span class="on">ON</span> X</b><p>Professional command centre for teams, academies, national teams and football organisations.</p></div></div>';
}

/* ---------- PRICING ---------- */
function price(k,n){var p=PLANS[k];if(n>p.max) return null;return p.price+Math.max(0,n-p.incl)*EXTRA}
function bestPlan(n){var best=null;['individual','v5','pro'].forEach(function(k){var v=price(k,n);if(v!=null&&(best===null||v<best[1]-1e-9)) best=[k,v]});return best}
function viewPricing(){
  var n=S.calcN||Math.max(1,live().length),bp=bestPlan(n),cur=S.plan;
  var feats={individual:['<b>1 athlete</b> included','Add athletes for <b>€3.90</b> / athlete / month','Up to 3 athletes'],
    v5:['<b>Up to 5 athletes</b> included','Add athletes for <b>€3.90</b> / athlete / month','Up to 9 athletes'],
    pro:['<b>Up to 10 athletes</b> included','Built for agents and coaches with a full portfolio','10 athletes is the VANTAGE maximum']};
  var h='<div class="page">'+mtop()+'<div class="ptop rise d1"><div class="t"><button class="textbtn" type="button" data-a="nav" data-v="profile" style="display:flex;align-items:center;gap:6px;margin-bottom:10px">'+I.left.replace('<svg','<svg style="width:16px;height:16px"')+'Profile</button><h1 class="ptitle">Choose your plan</h1><p class="psub">Every plan includes the full read-only VANTAGE experience. Athletes always decide what you see.</p></div></div>';
  h+='<div class="plans rise d2">'+['individual','v5','pro'].map(function(k){var p=PLANS[k];return '<div class="plan'+(k==='v5'?' rec':'')+'">'+(k===cur?'<span class="pill blue cur">Current plan</span>':(k==='v5'?'<span class="pill cur">Most chosen</span>':''))+
    '<span class="nm">'+p.name+'</span><div class="price"><b>€'+p.price.toFixed(2)+'</b><span>/ month</span></div>'+
    '<ul>'+feats[k].map(function(f){return '<li>'+I.check+'<span>'+f+'</span></li>'}).join('')+'</ul>'+
    '<button class="btn '+(k===cur?'btn-quiet':'btn-primary')+'" type="button" data-a="choosePlan" data-p="'+k+'"'+(k===cur||live().length>p.max?' disabled':'')+'>'+(k===cur?'Your plan':(live().length>p.max?'Follows up to '+p.max:'Choose '+p.short))+'</button></div>'}).join('')+'</div>';
  h+='<div class="card rise d2 calc"><div class="out"><span class="mlabel acc">How many athletes will you follow?</span><span class="muted" style="font-size:13.5px">Best value</span></div>'+
    '<div class="out"><b><span id="calc-n">'+n+'</span> <span style="font-size:15px;font-family:var(--font-body);font-weight:500;color:var(--mut)">athlete'+(n>1?'s':'')+'</span></b><b id="calc-out">'+PLANS[bp[0]].short+' · €'+bp[1].toFixed(2)+'</b></div>'+
    '<input type="range" id="calc" min="1" max="11" step="1" value="'+n+'" data-in="calc" aria-label="Number of athletes"><div class="ticks">'+[1,2,3,4,5,6,7,8,9,10,'10+'].map(function(x){return '<span>'+x+'</span>'}).join('')+'</div><p class="note" id="calc-note">'+calcNote(n)+'</p></div>';
  h+='<div class="rx rise d3"><div><span class="mlabel acc">RYSEON X</span><h3 style="margin-top:10px">Managing more than<br>10 athletes?</h3><p>RYSEON X is the professional command centre for teams, academies, national teams and football organisations.</p></div><a class="btn btn-quiet btn-sm" href="https://ryseon.ai" target="_blank" rel="noopener" style="text-decoration:none">Discover RYSEON X</a></div>';
  h+='<p class="note">Prices include VAT where applicable. Cancel any time. Prototype only — no payment is taken.</p>';
  return h+'</div>';
}
function calcNote(n){
  if(n>10) return 'VANTAGE follows up to 10 athletes. For larger groups, RYSEON X is built for teams and organisations.';
  var b=bestPlan(n),parts=['individual','v5','pro'].map(function(k){var v=price(k,n);return v==null?null:PLANS[k].short+' €'+v.toFixed(2)}).filter(Boolean);
  return 'Options for '+n+': '+parts.join(' · ')+'.';
}

/* ---------- REQUEST ANOTHER ATHLETE (in-app) ---------- */
function slotsUsed(){return S.cons.filter(function(c){return c.st==='connected'||c.st==='pending'}).length}
function viewRequest(){
  var st=S.req.stage,h='<div class="page narrow">'+mtop()+'<div><button class="textbtn" type="button" data-a="reqBack" style="display:flex;align-items:center;gap:6px">'+I.left.replace('<svg','<svg style="width:16px;height:16px"')+(st==='find'?'Athletes':'Back')+'</button></div>';
  if(st==='find'){
    h+='<div class="rise d1" style="display:flex;flex-direction:column;gap:6px"><span class="mlabel acc">Search → Request → Athlete approval → Connected</span></div>'+findBody(false);
  } else if(st==='request') h+=requestBody(false);
  else if(st==='sent') h+=sentBody(false);
  else if(st==='approved') h+=approvedBody(false);
  return h+'</div>';
}

/* ---------- overlays ---------- */
function renderOv(){
  var o=S.ov;if(!o) return '';
  var inner='',cls='sheet';
  if(o.t==='report') inner=reportSheet(o.id);
  else if(o.t==='stop'){cls+=' sm';var a=A(o.id);inner='<div class="sheet-b" style="padding-top:26px"><h2 class="rp-h" style="font-size:24px">Stop following '+esc(a.first)+'?</h2><p class="sub">You’ll lose access to everything '+esc(a.first)+' shares with you. To follow again, you’ll need to send a new request and '+esc(a.first)+' will need to approve it.</p><div style="display:flex;flex-direction:column;gap:10px;margin-top:6px"><button class="btn btn-primary" type="button" data-a="doStop" data-id="'+a.id+'">Stop following</button><button class="btn btn-quiet" type="button" data-a="closeOv">Keep following</button></div></div>'}
  else if(o.t==='limit'){cls+=' sm';var pl=PLANS[S.plan];
    inner=S.plan==='pro'?'<div class="sheet-b" style="padding-top:26px"><span class="mlabel acc">RYSEON X</span><h2 class="rp-h" style="font-size:26px">Managing more than 10 athletes?</h2><p class="sub">VANTAGE follows up to 10 athletes. RYSEON X is the professional command centre for teams, academies and football organisations.</p><div style="display:flex;flex-direction:column;gap:10px;margin-top:6px"><a class="btn btn-primary" href="https://ryseon.ai" target="_blank" rel="noopener" style="text-decoration:none">Discover RYSEON X</a><button class="btn btn-quiet" type="button" data-a="closeOv">Not now</button></div></div>'
      :'<div class="sheet-b" style="padding-top:26px"><span class="mlabel acc">'+pl.name+'</span><h2 class="rp-h" style="font-size:26px">Your plan is full</h2><p class="sub">'+pl.name+' follows up to '+pl.max+' athletes. Move to a larger plan to request another athlete.</p><div style="display:flex;flex-direction:column;gap:10px;margin-top:6px"><button class="btn btn-primary" type="button" data-a="nav" data-v="pricing">See plans</button><button class="btn btn-quiet" type="button" data-a="closeOv">Not now</button></div></div>'}
  else if(o.t==='role'){cls+=' sm';inner='<div class="sheet-h"><span class="mlabel">How you use VANTAGE</span><button class="iconbtn" type="button" data-a="closeOv" aria-label="Close">'+I.x+'</button></div><div class="sheet-b"><div class="roles" role="radiogroup">'+[['parent','Parent',I.parent],['agent','Agent',I.agent],['coach','Private Coach',I.coach],['other','Other',I.other]].map(function(r){return '<button class="role" type="button" role="radio" style="min-height:104px" aria-checked="'+(S.role===r[0])+'" data-a="setRole" data-r="'+r[0]+'"><span class="tick">'+I.check+'</span>'+r[2]+'<b>'+r[1]+'</b></button>'}).join('')+'</div><p class="note">This personalises VANTAGE. It doesn’t change what any athlete shares with you.</p></div>'}
  else if(o.t==='proto'){
    var L=live(),pend=others().filter(function(c){return c.st==='pending'});
    inner='<div class="sheet-h"><span class="mlabel acc">Prototype controls</span><button class="iconbtn" type="button" data-a="closeOv" aria-label="Close">'+I.x+'</button></div><div class="sheet-b">'+
      '<p class="note" style="margin-top:-6px">For reviewing VANTAGE only. Not part of the product.</p>'+
      '<div><span class="mlabel" style="margin-bottom:10px">Portfolio</span><div class="pgrid">'+Object.keys(SCENARIOS).map(function(k){var s=SCENARIOS[k];return '<button class="pbtn" type="button" data-a="scn" data-k="'+k+'" aria-pressed="'+(S.scn===k&&!S.ob)+'"><b>'+s.label+'</b><small>'+PLANS[s.plan].name+'</small></button>'}).join('')+'</div></div>'+
      '<div><span class="mlabel" style="margin-bottom:10px">Onboarding</span><div class="pgrid"><button class="pbtn" type="button" data-a="restart"><b>Start onboarding</b><small>Language → connected</small></button><button class="pbtn" type="button" data-a="protoNF"><b>Athlete not found</b><small>Search with no match</small></button></div></div>'+
      (L.length?'<div><span class="mlabel" style="margin-bottom:10px">Simulate an athlete ending access</span><div class="chips" style="flex-wrap:wrap">'+L.map(function(c){var a=A(c.a);return '<button class="chip" type="button" data-a="revoke" data-id="'+a.id+'">'+ava(a)+esc(a.first)+'</button>'}).join('')+'</div></div>':'')+
      (pend.length?'<div><span class="mlabel" style="margin-bottom:10px">Simulate a response</span><div style="display:flex;flex-direction:column;gap:8px">'+pend.map(function(c){var a=A(c.a);return '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span style="flex:1;min-width:120px;font-weight:600">'+esc(nm(a))+'</span>'+(ATHLETES[a.id]?'<button class="btn btn-quiet btn-sm" type="button" data-a="simApproveApp" data-id="'+a.id+'">Approve</button>':'')+'<button class="btn btn-quiet btn-sm" type="button" data-a="simDecline" data-id="'+a.id+'">Decline</button></div>'}).join('')+'</div></div>':'')+
    '</div>';
  }
  return '<div class="scrim" data-a="scrim"><div class="'+cls+'" role="dialog" aria-modal="true">'+inner+'</div></div>';
}

/* ---------- state transitions ---------- */
function loadScenario(k){
  var s=SCENARIOS[k];S.scn=k;S.role=s.role;S.plan=s.plan;S.user='Ivan';S.ob=false;S.view='home';S.aid=null;S.atab='overview';S.read={};S.athF='all';S.athQ='';S.repA='all';S.repF='all';S.sch.who='all';
  S.athV=s.con.length>6?'cards':'cards';
  S.cons=s.con.map(function(c){return {a:c.a,st:c.st||'connected',rel:c.rel,p:c.p||{},ago:c.ago,since:A(c.a).since}});
  store();
}
function go(view,o){
  S.view=view;S.ov=null;o=o||{};
  if(view==='athlete'){ if(o.id&&o.id!==S.aid){S.aid=o.id;S.asch={mode:'day',date:new Date(TODAY)}} if(o.t) S.atab=o.t }
  if(view==='request'){S.req={q:'',sel:null,rel:roleLabel(S.role),src:'app',stage:'find'}}
  render(true);
}
function startRequest(){
  if(slotsUsed()>=PLANS[S.plan].max){S.ov={t:'limit'};render();return}
  go('request');
}

/* ---------- render ---------- */
var root;
function render(top){
  var main=document.getElementById('main'),sc=main?main.scrollTop:0;
  var aura=document.getElementById('aura');aura.className='aura'+(S.ob?'':' calm');
  root.innerHTML=(S.ob?renderOb():renderShell())+renderOv()+'<button class="proto'+(S.ob?' ob-on':'')+'" type="button" data-a="proto" aria-label="Prototype controls"><i></i>Prototype</button>';
  var m2=document.getElementById('main');if(m2) m2.scrollTop=top?0:sc;
  if(S.ob&&S.step==='lang'){bindLangRail();startGlobe()}
  var col=document.querySelector('.ob-col');if(col&&top) col.scrollTop=0;
}
function obGo(to){S.trail.push(S.step);S.step=to;render(true)}

/* ---------- events ---------- */
function onClick(e){
  var t=e.target.closest('[data-a]');if(!t) return;
  var a=t.getAttribute('data-a'),d=t.dataset;
  if(a==='scrim'){if(e.target===t){S.ov=null;render()}return}
  switch(a){
    case 'lang': setLang(+d.i,true);break;
    case 'obGo': obGo(d.to);break;
    case 'obBack': S.step=S.trail.pop()||'lang';if(S.step==='account') S.emailMode=false;render(true);break;
    case 'role': S.role=d.r;render();break;
    case 'auth': S.req={q:'',sel:null,rel:roleLabel(S.role),src:'ob'};obGo('find');break;
    case 'authMail': S.emailMode=true;render();break;
    case 'login': loadScenario(S.role==='agent'?'agent10':(S.role==='coach'?'coach5':'parent2'));render(true);toast('Signed in');break;
    case 'pick': var c0=conOf(d.id);if(c0&&c0.st==='connected'){ if(S.ob){loadScenarioFromOb();} go('athlete',{id:d.id,t:'overview'});break }
      if(c0&&c0.st==='pending'){ if(!S.ob){go('athlete',{id:d.id});} break }
      S.req.sel=d.id; if(!S.req.rel) S.req.rel=roleLabel(S.role); if(S.ob) obGo('request'); else {S.req.stage='request';render(true)} break;
    case 'rel': S.req.rel=d.r;render();break;
    case 'sendReq':
      var ex=conOf(S.req.sel); if(ex){ex.st='pending';ex.rel=S.req.rel;ex.ago=0;ex.p={}} else S.cons.push({a:S.req.sel,st:'pending',rel:S.req.rel,p:{},ago:0,since:dkey(TODAY)});
      if(S.ob) obGo('sent'); else {S.req.stage='sent';render(true)} break;
    case 'skipFind': S.cons=[];S.scn='empty';S.ob=false;S.view='home';render(true);break;
    case 'enterApp': S.ob=false;S.scn='custom';S.view='home';render(true);break;
    case 'simApprove': approve(d.id);if(S.ob) obGo('approved');break;
    case 'simApproveApp': approve(d.id);S.req.sel=d.id;S.ov=null;if(S.view==='request'){S.req.stage='approved';render(true)} else {go('athlete',{id:d.id,t:'overview'});toast(A(d.id).first+' approved your request')} break;
    case 'simDecline': var cd=conOf(d.id);cd.st='declined';S.ov=null;render();toast(A(d.id).first+' declined the request');break;
    case 'openNew': S.ob=false;if(!S.scn||S.scn==='empty') S.scn='custom';go('athlete',{id:d.id,t:'overview'});break;
    case 'doneReq': go('athletes');break;
    case 'nav': if(d.v==='pricing') S.calcN=null; go(d.v);break;
    case 'openA': S.atab=d.t||(S.view==='athlete'?S.atab:'overview');go('athlete',{id:d.id,t:S.atab});break;
    case 'atab': S.atab=d.t;var b=document.getElementById('atab-body');if(b){document.querySelectorAll('.atabs button').forEach(function(x){x.setAttribute('aria-selected',x.dataset.t===d.t)});b.classList.remove('fade');void b.offsetWidth;b.classList.add('fade');b.innerHTML=athTab(A(S.aid),P(S.aid))}break;
    case 'dev': S.dev=d.m;render();break;
    case 'athF': S.athF=d.f;render();break;
    case 'athV': S.athV=d.f;render();break;
    case 'repF': S.repF=d.f;render();break;
    case 'repA': S.repA=d.f;render();break;
    case 'schMode': var st=d.s==='a'?S.asch:S.sch;st.mode=d.m;render();break;
    case 'schNav': var st2=d.s==='a'?S.asch:S.sch,n=+d.d;if(n===0) st2.date=new Date(TODAY);else if(st2.mode==='day') st2.date=addDays(st2.date,n);else if(st2.mode==='week') st2.date=addDays(st2.date,7*n);else st2.date=new Date(st2.date.getFullYear(),st2.date.getMonth()+n,1);render();break;
    case 'schDay': var st3=d.s==='a'?S.asch:S.sch,pp=d.k.split('-');st3.date=new Date(+pp[0],+pp[1]-1,+pp[2]);st3.mode='day';render();break;
    case 'schWho': S.sch.who=d.id;render();break;
    case 'schedWeek': S.sch.mode='week';S.sch.date=new Date(TODAY);go('schedule');break;
    case 'openR': S.ov={t:'report',id:d.r};render();break;
    case 'closeOv': S.ov=null;render();break;
    case 'reqNew': startRequest();break;
    case 'reqAgain': var cr=conOf(d.id);S.cons.splice(S.cons.indexOf(cr),1);if(slotsUsed()>=PLANS[S.plan].max){S.ov={t:'limit'};render();break}S.view='request';S.req={q:'',sel:d.id,rel:cr.rel,src:'app',stage:'request'};render(true);break;
    case 'reqBack': if(S.req.stage==='request'){S.req.stage='find';render(true)} else go('athletes');break;
    case 'cancelReq': S.cons.splice(S.cons.indexOf(conOf(d.id)),1);go('athletes');toast('Request cancelled');break;
    case 'dismiss': S.cons.splice(S.cons.indexOf(conOf(d.id)),1);if(S.view==='athlete') go('athletes');else render();break;
    case 'askStop': S.ov={t:'stop',id:d.id};render();break;
    case 'doStop': S.cons.splice(S.cons.indexOf(conOf(d.id)),1);go('athletes');toast('You’re no longer following '+A(d.id).first);break;
    case 'choosePlan': S.plan=d.p;render();toast('Plan changed to '+PLANS[d.p].name);break;
    case 'ovRole': S.ov={t:'role'};render();break;
    case 'setRole': S.role=d.r;S.ov=null;render();break;
    case 'goLang': S.ob=true;S.step='lang';S.trail=[];S.langReturn=true;render(true);break;
    case 'signOut': S.ob=true;S.step='intro';S.trail=['lang'];S.cons=[];S.role=null;render(true);break;
    case 'proto': S.ov={t:'proto'};render();break;
    case 'scn': loadScenario(d.k);render(true);break;
    case 'restart': S.ob=true;S.step='lang';S.trail=[];S.role=null;S.cons=[];S.plan='individual';S.emailMode=false;S.ov=null;render(true);break;
    case 'protoNF': S.ob=true;S.step='find';S.trail=['lang','intro','role','how','account'];S.role=S.role||'parent';S.cons=[];S.req={q:'Luka Matić',sel:null,rel:'Parent',src:'ob'};S.ov=null;render(true);break;
    case 'revoke': var cv=conOf(d.id);cv.st='ended';cv.p={};S.ov=null;render();toast(A(d.id).first+' ended access');break;
  }
}
function loadScenarioFromOb(){S.ob=false;if(!S.scn) S.scn='custom'}
function approve(id){var c=conOf(id);if(!c) return;c.st='connected';c.since=dkey(TODAY);c.p={}}
function onInput(e){
  var t=e.target,k=t.getAttribute('data-in');if(!k) return;
  if(k==='find'){S.req.q=t.value;var r=document.getElementById('results');if(r) r.innerHTML=resultsHtml()}
  else if(k==='athQ'){S.athQ=t.value;var o=document.getElementById('ath-out');if(o) o.innerHTML=athOut()}
  else if(k==='calc'){var n=+t.value;S.calcN=n;var b=n>10?null:bestPlan(n);document.getElementById('calc-n').textContent=n>10?'10+':n;document.getElementById('calc-out').textContent=b?PLANS[b[0]].short+' · €'+b[1].toFixed(2):'RYSEON X';document.getElementById('calc-note').textContent=calcNote(n)}
}
function onSubmit(e){
  var f=e.target.getAttribute('data-f');if(!f) return;e.preventDefault();
  if(f==='email'){var n=document.getElementById('in-name').value.trim(),m=document.getElementById('in-mail').value.trim();
    if(!n||m.indexOf('@')<1){toast('Enter your name and a valid email');return}
    S.user=n;S.email=m;S.emailMode=false;S.req={q:'',sel:null,rel:roleLabel(S.role),src:'ob'};obGo('find')}
}
/* language "Continue" returns to profile when opened from settings */
var _obGo=obGo;obGo=function(to){if(S.langReturn&&S.step==='lang'){S.langReturn=false;S.ob=false;S.view='profile';render(true);toast('Language set to '+LANGS[S.lang][1]);return}_obGo(to)};

var rz;window.addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(function(){if(!S.ob&&(S.view==='schedule'||S.view==='athlete')) render()},200)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&S.ov){S.ov=null;render()}});

/* ---------- boot ---------- */
(function(){
  root=document.getElementById('app');
  document.addEventListener('click',onClick);document.addEventListener('input',onInput);document.addEventListener('submit',onSubmit);
  var hsh=(location.hash||'').slice(1),map={parent:'parent1',family:'parent2',coach:'coach5',agent:'agent10',empty:'empty',waiting:'waiting'};
  if(map[hsh]){loadScenario(map[hsh])}
  else if(hsh==='onboarding'){S.ob=true}
  else {try{var sv=JSON.parse(localStorage.getItem('vantage.v1')||'null');if(sv&&sv.lang!=null) S.lang=sv.lang}catch(e){}}
  render(true);
})();
