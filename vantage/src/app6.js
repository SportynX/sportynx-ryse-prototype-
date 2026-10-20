/* ============================================================
   VANTAGE — video (view only)
   Shows WHICH RYSEON videos the athlete watched (player clips,
   motivation, mindset), only if Learning is shared. VANTAGE users
   don't play, browse or send videos — that belongs to RYSEON.
   ============================================================ */
function V(id){for(var i=0;i<VLIB.length;i++) if(VLIB[i].id===id) return VLIB[i];return null}
var CLOCKI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>';
var CAMI='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="6" width="13" height="12" rx="2"/><path d="M16.5 10.5 21 8v8l-4.5-2.5"/></svg>';
function vMeta(v){return v.n?CAMI+v.n+' videos':CLOCKI+v.m+' min'}

/* what each athlete watched recently (prototype data, stable per athlete) */
var WATCH_PREF={luka:['clip-kova','med','m-erling'],mateo:['clip-drib','m-zlatan','m-speed'],marko:['clip-shot','m-erling','adv'],filip:['clip-pos','m-zlatan','med'],matej:['clip-def','m-erling','focus'],
  ana:['focus','med','adv'],nika:['clip-shot','m-zlatan','med'],toni:['clip-def','m-rondo','adv'],dario:['m-rondo','med','clip-pos'],josip:['m-speed','clip-def','m-zlatan'],petra:['clip-drib','med','m-speed']};
function watched(id){
  var pref=WATCH_PREF[id]||['clip-kova','med','m-erling'],out=[];
  pref.forEach(function(vid,i){var v=V(vid);if(!v) return;var h=hash(id+vid);
    out.push({v:v,a:id,d:addDays(TODAY,-(i*2+Math.floor(h*2))),prog:v.n?Math.max(3,Math.round(v.n*(.15+h*.3)))+' of '+v.n+' clips':(h>.35?'Completed':Math.round(40+h*100)+'% watched')})});
  return out;
}
function vbox(w,opts){
  var v=w.v,a=A(w.a),o=opts||{};
  return '<div class="vbox" role="group" aria-label="'+esc(a.first)+' watched '+esc(v.t)+'"><span class="vimg" style="background-image:url(&quot;'+v.cov+'&quot;)'+(v.pos==='top'?';background-position:center top':'')+'"></span>'+
    '<span class="vseen">'+I.check+'Watched</span>'+
    '<span class="vtx"><span class="vk">'+(o.who?ava(a,'xs')+esc(a.first)+' · ':'')+esc(v.c)+' · '+fmt(w.d,'rel')+'</span><b>'+esc(v.t)+'</b><small>'+esc(w.prog)+(v.pl?' · '+esc(v.pl):'')+'</small></span></div>';
}
function rail(title,items,action){
  if(!items.length) return '';
  return '<div class="vrail-wrap"><div class="sec-h" style="margin:0"><h2 class="h3">'+title+'</h2>'+(action||'')+'</div><div class="vrail">'+items.join('')+'</div></div>';
}
/* ---------- Home: one rail of what the athletes watched ---------- */
var _viewHome6=viewHome;
viewHome=function(){
  var h=_viewHome6(),ids=liveIds().filter(function(id){return P(id).learning});
  if(!ids.length) return h;
  var items=[];ids.forEach(function(id){var w=watched(id);if(w[0]) items.push(w[0]);if(w[1]&&ids.length<3) items.push(w[1])});
  items.sort(function(x,y){return y.d-x.d});
  var block='<div class="rise d2" style="display:flex;flex-direction:column;gap:14px">'+rail('Watched in RYSEON',items.slice(0,6).map(function(w){return vbox(w,{who:1})}))+'</div>';
  var i=h.indexOf('<div class="sec-h rise d2"><h2 class="h3">Your athletes');
  if(i<0) i=h.indexOf('<div class="grid2 rise d2">');
  return i<0?h+block:h.slice(0,i)+block+h.slice(i);
};
/* ---------- Athlete overview: what they watched ---------- */
var _tabOverview6=tabOverview;
tabOverview=function(a,p){
  var h=_tabOverview6(a,p);
  if(!p.learning) return h;
  return h+'<div style="margin-top:22px;display:flex;flex-direction:column;gap:14px">'+rail(esc(a.first)+' watched',watched(a.id).map(function(w){return vbox(w)}),'<button class="link" type="button" data-a="atab" data-t="learning">Learning</button>')+'</div>';
};
/* ---------- Learning tab: video first, then the numbers ---------- */
var _tabLearning6=tabLearning;
tabLearning=function(a){
  return '<div style="margin-bottom:14px">'+rail('Watched this week',watched(a.id).map(function(w){return vbox(w)}))+'</div>'+_tabLearning6(a);
};

render(true);
