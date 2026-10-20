/* ============================================================
   VANTAGE V1 prototype — core, icons, onboarding & connection flow
   READ-ONLY: nothing here edits athlete data. The only writes are the
   VANTAGE user's own account, plan and connection requests.
   ============================================================ */
var LOGO='__LOGO__';
var I={
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg>',
  chev:'<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5.5 6.5 6.5L9 18.5"/></svg>',
  left:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg>',
  right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9.5 5.5 6.5 6.5-6.5 6.5"/></svg>',
  x:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 10.2 12 4l7.5 6.2V19a1 1 0 0 1-1 1H15v-5.2H9V20H5.5a1 1 0 0 1-1-1Z"/></svg>',
  users:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8.2" r="3.4"/><path d="M3 19.5c.6-3.3 3.1-5.3 6-5.3s5.4 2 6 5.3"/><path d="M15.2 4.9a3.4 3.4 0 0 1 0 6.6M17.6 14.6c1.8.7 3 2.4 3.4 4.9"/></svg>',
  cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 9.8h17M8 3v4M16 3v4"/><path d="M7.5 13.5h2M11 13.5h2M14.5 13.5h2M7.5 16.8h2M11 16.8h2" opacity=".7"/></svg>',
  doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5h7.5l4.5 4.5v11a1.5 1.5 0 0 1-1.5 1.5h-10.5A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M13.5 3.5V8.5h5"/><path d="M8.5 16.5v-2M11.5 16.5v-4.5M14.5 16.5v-3"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="2.2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2 19 6v5.6c0 4.3-2.9 7.9-7 9.2-4.1-1.3-7-4.9-7-9.2V6Z"/><path d="m9 12 2.2 2.2L15.3 10"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  spark:'<svg viewBox="0 0 16 16" fill="none"><path d="M8 1.8 9.4 6.6 14.2 8 9.4 9.4 8 14.2 6.6 9.4 1.8 8 6.6 6.6Z" fill="currentColor"/></svg>',
  parent:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.5" cy="6.5" r="2.8"/><circle cx="16.5" cy="10.5" r="2.2"/><path d="M3.5 20v-3.2a5 5 0 0 1 10 0V20"/><path d="M13.6 20v-1.8a2.9 2.9 0 0 1 5.8 0V20"/></svg>',
  agent:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="7.5" width="17" height="12" rx="2.2"/><path d="M9 7.5V6a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 6v1.5M3.5 12.5h17"/></svg>',
  coach:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 9.5h6.2v3.2L14 14"/><circle cx="9" cy="13.5" r="5.5"/><path d="M9 8V4.5h5"/><circle cx="9" cy="13.5" r="1.6"/></svg>',
  other:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.6 3.6-5.8 7-5.8s6.2 2.2 7 5.8"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 3.5 10 14M20.5 3.5 14 20.5l-4-6.5-6.5-4Z"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  apple:'<svg class="ico" viewBox="0 0 24 24"><path fill="#F5F7FB" d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>',
  google:'<svg class="ico" viewBox="0 0 48 48"><path fill="#F5F7FB" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#F5F7FB" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#F5F7FB" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#F5F7FB" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>',
  mail:'<svg class="ico" viewBox="0 0 24 24" fill="none"><rect x="3" y="5.5" width="18" height="13" rx="2.5" stroke="#F5F7FB" stroke-width="1.4"/><path d="m4 7.5 8 6 8-6" stroke="#F5F7FB" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pitch:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M12 5v14"/><circle cx="12" cy="12" r="2.6"/></svg>',
  bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 19.5V14M10 19.5V9M15 19.5v-7M20 19.5V5.5"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19.5 14.6A7.5 7.5 0 0 1 9.4 4.5a7.5 7.5 0 1 0 10.1 10.1Z"/></svg>',
  wave:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h3.5l2-5 3.5 10 2.5-7 1.5 2H21"/></svg>',
  play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5.5" width="17" height="13" rx="2.4"/><path d="M10.2 9.3v5.4l4.4-2.7Z" fill="currentColor"/></svg>',
  card:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2.4"/><path d="M3 10h18M6.5 14.5h4"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5M12 3.5C9.6 5.9 8.5 8.7 8.5 12s1.1 6.1 3.5 8.5"/></svg>',
  out:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4.5h4a1.5 1.5 0 0 1 1.5 1.5v12a1.5 1.5 0 0 1-1.5 1.5h-4M10 16.5 5.5 12 10 7.5M5.5 12H15"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/></svg>',
  list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M8.5 6.5h11M8.5 12h11M8.5 17.5h11"/><circle cx="4.6" cy="6.5" r=".9" fill="currentColor"/><circle cx="4.6" cy="12" r=".9" fill="currentColor"/><circle cx="4.6" cy="17.5" r=".9" fill="currentColor"/></svg>',
  reqp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="8" r="3.5"/><path d="M3.5 19.5c.7-3.4 3.3-5.5 6.5-5.5 1.3 0 2.5.3 3.5.9"/><circle cx="17.5" cy="16.5" r="3"/><path d="m19.7 18.7 1.8 1.8"/></svg>',
  info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.4"/></svg>',
  role:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3.5" width="16" height="17" rx="2.4"/><circle cx="12" cy="10" r="2.6"/><path d="M8 16.5c.6-1.8 2.1-2.8 4-2.8s3.4 1 4 2.8"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z"/></svg>',
  folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7a1.5 1.5 0 0 1 1.5-1.5h4.5l2 2H19a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18Z"/></svg>'
};
var PERM_ICON={schedule:I.cal,development:I.bolt,training:I.pitch,matches:I.pitch,sleep:I.moon,learning:I.play,reports:I.doc,health:I.heart,medical:I.folder};

/* ---------- Languages (same set and treatment as RYSEON) ---------- */
var LANGS=[
 ['en','English','English','United Kingdom · United States · Canada · Australia','Choose your language','Continue',-30,45],
 ['zh-Hans','中文','Chinese · 简体','中国 · 新加坡','选择你的语言','继续',116,35],
 ['es-ES','Español','España','España','Elige tu idioma','Continuar',-3.7,40.3],
 ['es-MX','Español','México','México','Elige tu idioma','Continuar',-99,19.4],
 ['es-AR','Español','Argentina','Argentina','Elegí tu idioma','Continuar',-58.4,-34.6],
 ['ar','العربية','Arabic','العالم العربي','اختر لغتك','متابعة',40,25],
 ['fr','Français','French','France · Belgique · Suisse · Québec','Choisis ta langue','Continuer',2.35,48.9],
 ['pt-BR','Português','Brasil','Brasil','Escolha seu idioma','Continuar',-47.9,-15.8],
 ['pt-PT','Português','Portugal','Portugal','Escolhe o teu idioma','Continuar',-9.1,38.7],
 ['de','Deutsch','German','Deutschland · Österreich · Schweiz','Sprache wählen','Weiter',11,50],
 ['it','Italiano','Italian','Italia','Scegli la lingua','Continua',12.5,42],
 ['hr','Hrvatski','Croatian','Hrvatska','Odaberi jezik','Nastavi',16,45.5],
 ['sl','Slovenščina','Slovenian','Slovenija','Izberi jezik','Nadaljuj',14.5,46],
 ['sr-Latn','Srpski','Latinica','Srbija · Crna Gora','Izaberi jezik','Nastavi',20.5,44.8],
 ['nl','Nederlands','Dutch','Nederland · België','Kies je taal','Doorgaan',4.9,52.4],
 ['pl','Polski','Polish','Polska','Wybierz język','Dalej',21,52.2],
 ['cs','Čeština','Czech','Česko','Vyber si jazyk','Pokračovat',14.4,50.1],
 ['ro','Română','Romanian','România · Moldova','Alege limba','Continuă',26.1,44.4],
 ['el','Ελληνικά','Greek','Ελλάδα · Κύπρος','Επίλεξε γλώσσα','Συνέχεια',23.7,38],
 ['tr','Türkçe','Turkish','Türkiye','Dilini seç','Devam et',32.9,39.9],
 ['sv','Svenska','Swedish','Sverige','Välj ditt språk','Fortsätt',18,59.3],
 ['da','Dansk','Danish','Danmark','Vælg dit sprog','Fortsæt',12.6,55.7],
 ['nb-NO','Norsk','Norwegian','Norge','Velg språket ditt','Fortsett',10.8,59.9],
 ['ja','日本語','Japanese','日本','言語を選択','続ける',139.7,35.7]
];

/* ---------- State ---------- */
var S={ob:true,step:'lang',lang:0,role:null,user:'Ivan',email:'ivan@example.com',scn:null,plan:'individual',cons:[],
  view:'home',aid:null,atab:'overview',sch:{mode:'day',date:new Date(TODAY),who:'all'},asch:{mode:'day',date:new Date(TODAY)},dev:'week',
  athQ:'',athF:'all',athV:'cards',repF:'all',repA:'all',read:{},req:{q:'',sel:null,rel:null,src:'ob'},ov:null,calcN:null,plan2:null,trail:[]};

function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function A(id){return DIRECTORY[id]}
function nm(a){return a.first+' '+a.last}
function he(a){return a.g==='f'?'she':(a.g==='x'?'they':'he')}
function his(a){return a.g==='f'?'her':(a.g==='x'?'their':'his')}
function him(a){return a.g==='f'?'her':(a.g==='x'?'them':'him')}
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1)}
function ava(a,cls,st){var ph=a.photo&&st!=='locked'&&st!=='ended'&&window.PHOTOS&&PHOTOS[a.photo];return '<span class="ava '+(cls||'')+(st?' '+st:'')+(ph?' ph':'')+'" style="--h:'+a.h+'" aria-hidden="true">'+(ph?'<img src="'+ph+'" alt="">':a.first[0]+a.last[0])+'</span>'}
function conOf(id){for(var i=0;i<S.cons.length;i++) if(S.cons[i].a===id) return S.cons[i];return null}
function live(){return S.cons.filter(function(c){return c.st==='connected'})}
function liveIds(){return live().map(function(c){return c.a})}
function others(){return S.cons.filter(function(c){return c.st!=='connected'})}
function P(id){var c=conOf(id);if(!c||c.st!=='connected') return {};var p={},k;for(k in DEF_PERMS)p[k]=DEF_PERMS[k];for(k in (c.p||{}))p[k]=c.p[k];return p}
function roleLabel(r){return {parent:'Parent',agent:'Agent',coach:'Private Coach',other:'Other'}[r]||'Parent'}
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\u0111/g,'d')}
function toast(t){var el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.innerHTML=I.check+'<span>'+esc(t)+'</span>';document.body.appendChild(el);setTimeout(function(){el.remove()},3300)}
function greeting(){var h=new Date().getHours();return h<12?'Good morning':(h<18?'Good afternoon':'Good evening')}
function store(){try{localStorage.setItem('vantage.v1',JSON.stringify({scn:S.scn,ob:S.ob,lang:S.lang}))}catch(e){}}

/* ================= ONBOARDING ================= */
var OB_FLOW=['lang','intro','role','how','account','find','request','sent','approved'];
var OB_DOTS=['role','how','account','connect','find','request'];
function obHead(showBack){
  var i=OB_DOTS.indexOf(S.step==='invite'?'find':S.step);
  return '<div class="ob-top">'+(showBack?'<button class="back" type="button" data-a="obBack" aria-label="Back">'+I.back+'</button>':'<span></span>')+
    (i>=0?'<span class="ob-steps" aria-label="Step '+(i+1)+' of '+OB_DOTS.length+'">'+OB_DOTS.map(function(_,j){return '<i class="'+(j<=i?'on':'')+'"></i>'}).join('')+'</span>':'<span></span>')+'<span style="width:44px"></span></div>';
}
function hl(lines){return '<h1 class="display hl">'+lines.map(function(l){return '<span class="line"><span class="li">'+l+'</span></span>'}).join('')+'</h1>'}

function renderOb(){
  var s=S.step,h='';
  if(s==='lang'){
    var L=LANGS[S.lang];
    h='<div class="ob-col">'+
      '<div class="ob-brand rise d1"><span><span class="wm-v">Vantage</span><small>by <span class="wm">RYSE<span class="on">ON</span></span></small></span></div>'+
      '<div class="lang-globe rise d1"><canvas id="globe" width="600" height="600" aria-hidden="true" style="width:min(280px,70vw);height:auto;aspect-ratio:1"></canvas></div>'+
      '<div class="lang-head"><h1 id="lang-title" class="rise d1">'+esc(L[4])+'</h1><p class="lang-region rise d2" id="lang-region">'+esc(L[3])+'</p></div>'+
      '<div class="lang-rail rise d2"><div class="lang-track" id="lang-track" role="listbox" aria-label="Language">'+
        LANGS.map(function(l,i){return '<button class="lang-item'+(i===S.lang?' on':'')+'" type="button" role="option" aria-selected="'+(i===S.lang)+'" data-a="lang" data-i="'+i+'"><b>'+esc(l[1])+'</b><small>'+esc(l[2])+'</small></button>'}).join('')+
      '</div></div>'+
      '<div class="lang-dial rise d2" id="lang-dial" aria-hidden="true">'+LANGS.map(function(_,i){return '<i class="'+(i===S.lang?'on':'')+'"></i>'}).join('')+'</div>'+
      '<div class="ob-act rise d3"><button class="btn btn-primary" type="button" data-a="obGo" data-to="intro" id="lang-go">'+esc(L[5])+'</button></div>'+
    '</div>';
  }
  else if(s==='intro'){
    h=obHead(true)+'<div class="ob-col">'+
      '<div class="ob-visual">'+introSvg()+'</div>'+
      '<div class="ob-body">'+
        '<div class="ob-brand rise d1"><span><span class="wm-v">Vantage</span><small>by <span class="wm">RYSE<span class="on">ON</span></span></small></span></div>'+
        hl(['Stay connected','to their','development.'])+
        '<p class="sub rise d2">Be part of the team around athletes who share their <b class="wm" style="color:var(--text)">RYSE<span class="on">ON</span></b> development with you.</p>'+
        '<ul class="concepts"><li style="--i:0">Progress</li><li style="--i:1">Schedule</li><li style="--i:2">Development</li></ul>'+
      '</div>'+
      '<div class="ob-act rise d3"><button class="btn btn-primary" type="button" data-a="obGo" data-to="role">Get started</button>'+
      '<p class="ob-foot">Already have an account?<button class="link" type="button" data-a="login">Log in</button></p>'+
      '<button class="btn btn-sim" type="button" data-a="demoIn"><span class="sim-k">Prototype</span>Enter as approved</button></div>'+
    '</div>';
  }
  else if(s==='role'){
    var R=[['parent','Parent','Stay connected to your child’s development.',I.parent],['agent','Agent','Connect with the players you represent.',I.agent],['coach','Private Coach','Connect with the athletes you train.',I.coach],['other','Other','A trusted person in an athlete’s development.',I.other]];
    h=obHead(true)+'<div class="ob-col">'+
      '<div class="ob-body">'+hl(['How will you','use Vantage?'])+
      '<p class="sub rise d2">This shapes how VANTAGE is set up for you.</p>'+
      '<div class="roles rise d2" role="radiogroup" aria-label="Your role">'+R.map(function(r){return '<button class="role" type="button" role="radio" aria-checked="'+(S.role===r[0])+'" data-a="role" data-r="'+r[0]+'"><span class="tick">'+I.check+'</span>'+r[3]+'<b>'+r[1]+'</b><span>'+r[2]+'</span></button>'}).join('')+'</div>'+
      '<p class="note rise d3">Your role doesn’t change what athletes share with you. Only they decide that.</p></div>'+
      '<div class="ob-act rise d3"><button class="btn btn-primary" type="button" data-a="obGo" data-to="how"'+(S.role?'':' disabled')+'>Continue</button></div>'+
    '</div>';
  }
  else if(s==='how'){
    h=obHead(true)+'<div class="ob-col">'+
      '<div class="ob-body">'+hl(['How Vantage','works.'])+
      '<ol class="how">'+
        '<li style="--i:0"><span class="n">'+I.search+'</span><span><b>Find</b><p>Find an athlete on RYSEON by name or RYSEON ID.</p></span></li>'+
        '<li style="--i:1"><span class="n">'+I.send+'</span><span><b>Request</b><p>Send a request. The athlete approves it in RYSEON.</p></span></li>'+
        '<li style="--i:2"><span class="n">'+I.eye+'</span><span><b>Connect</b><p>See the development information they choose to share.</p></span></li>'+
      '</ol>'+
      '<div class="control rise d4">'+I.shield+'<span><b>The athlete stays in control.</b><p>They choose what you see and can end access at any time. You can’t change their data.</p></span></div>'+
      '</div>'+
      '<div class="ob-act rise d4"><button class="btn btn-primary" type="button" data-a="obGo" data-to="account">Continue</button></div>'+
    '</div>';
  }
  else if(s==='account'){
    h=obHead(true)+'<div class="ob-col"><div class="ob-body">'+hl(['Create your','account.'])+
      '<p class="sub rise d2">Your VANTAGE account is yours. It’s separate from any athlete’s RYSEON profile.</p></div>'+
      (S.emailMode?
      '<form class="ob-act rise d1" data-f="email" novalidate><label class="lbl-in"><span class="mlabel">Your name</span><span class="field"><input id="in-name" autocomplete="name" value="'+esc(S.user)+'" required></span></label>'+
        '<label class="lbl-in"><span class="mlabel">Email</span><span class="field"><input id="in-mail" type="email" autocomplete="email" value="'+esc(S.email)+'" required></span></label>'+
        '<p class="note">We’ll send a sign-in link to this address.</p>'+
        '<button class="btn btn-primary" type="submit">Continue</button></form>'
      :
      '<div class="ob-act rise d3">'+
        '<button class="btn btn-quiet btn-auth" type="button" data-a="auth">'+I.apple+'Continue with Apple</button>'+
        '<button class="btn btn-quiet btn-auth" type="button" data-a="auth">'+I.google+'Continue with Google</button>'+
        '<button class="btn btn-quiet btn-auth" type="button" data-a="authMail">'+I.mail+'Continue with email</button>'+
        '<p class="ob-foot">Already have an account?<button class="link" type="button" data-a="login">Log in</button></p></div>')+
    '</div>';
  }
  else if(s==='find'){ h=obHead(true)+'<div class="ob-col">'+findBody(true)+'</div>' }
  else if(s==='request'){ h=obHead(true)+'<div class="ob-col">'+requestBody(true)+'</div>' }
  else if(s==='sent'){ h='<div class="ob-col">'+sentBody(true)+'</div>' }
  else if(s==='approved'){ h='<div class="ob-col">'+approvedBody(true)+'</div>' }
  return '<div class="ob" id="ob">'+h+'</div>';
}

function introSvg(){
  // three athlete trajectories rising and converging on one point of view
  var paths=['M10 230 C 90 222, 140 200, 190 168 S 270 92, 312 64','M10 250 C 100 246, 160 224, 210 186 S 280 104, 312 64','M10 270 C 110 268, 170 252, 226 210 S 290 116, 312 64'];
  return '<svg viewBox="0 0 340 290" aria-hidden="true">'+
    '<defs><linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#F5F7FB" stop-opacity=".08"/><stop offset="1" stop-color="#9DB8FF" stop-opacity=".95"/></linearGradient></defs>'+
    [0,1,2,3].map(function(i){return '<path d="M10 '+(110+i*50)+'H330" stroke="rgba(255,255,255,.06)" stroke-width="1"/>'}).join('')+
    paths.map(function(p,i){return '<path class="draw" pathLength="1" d="'+p+'" fill="none" stroke="url(#tg)" stroke-width="'+(1.8-i*.35)+'" stroke-linecap="round" style="--d:'+(.3+i*.25)+'s"/>'}).join('')+
    [[190,168,.9],[210,186,1.15],[226,210,1.4],[120,214,.7],[150,240,1],[96,262,1.2]].map(function(p){return '<circle class="nodein" cx="'+p[0]+'" cy="'+p[1]+'" r="2.4" fill="rgba(245,247,251,.6)" style="--d:'+p[2]+'s"/>'}).join('')+
    '<circle class="nodein" cx="312" cy="64" r="5" fill="#9DB8FF" style="--d:2s"/>'+
    '<circle cx="312" cy="64" r="5" fill="none" stroke="rgba(157,184,255,.6)" stroke-width="1"><animate attributeName="r" values="5;34" dur="3.6s" begin="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="3.6s" begin="2.2s" repeatCount="indefinite"/></circle>'+
    '<circle cx="312" cy="64" r="5" fill="none" stroke="rgba(157,184,255,.4)" stroke-width="1"><animate attributeName="r" values="5;34" dur="3.6s" begin="4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".7;0" dur="3.6s" begin="4s" repeatCount="indefinite"/></circle>'+
  '</svg>';
}

/* ---------- Find / request / sent / approved (shared by onboarding and in-app) ---------- */
function searchDir(q){
  q=norm(q.trim()); if(q.length<2) return [];
  var qid=q.replace(/[^a-z0-9]/g,'');
  return Object.keys(DIRECTORY).map(function(k){return DIRECTORY[k]}).filter(function(a){
    return norm(nm(a)).indexOf(q)>=0||norm(a.last+' '+a.first).indexOf(q)>=0||(qid.length>=3&&a.ryid.toLowerCase().replace(/[^a-z0-9]/g,'').indexOf(qid)>=0);
  }).sort(function(x,y){return nm(x)<nm(y)?-1:1});
}
function resultsHtml(){
  var q=S.req.q,res=searchDir(q);
  if(q.trim().length<2) return '<div class="card" style="display:flex;gap:14px;align-items:flex-start">'+'<span style="color:var(--blue-3);flex:none;width:22px;height:22px;display:block">'+I.info+'</span><p class="sub" style="font-size:14px">Ask the athlete for their RYSEON ID. They can find it in RYSEON under Profile. Searching by ID avoids sending a request to the wrong person.</p></div>';
  if(!res.length) return '<div class="empty-s fade">'+I.search+'<b>Athlete not found</b><p>No RYSEON athlete matches “'+esc(q.trim())+'”. Check the spelling, or ask the athlete for their RYSEON ID.</p></div>';
  return '<p class="mlabel" style="margin-bottom:-2px">'+res.length+' athlete'+(res.length>1?'s':'')+' on RYSEON</p>'+res.map(function(a){
    var c=conOf(a.id),st='';
    if(c&&c.st==='connected') st='<span class="pill blue st">Connected</span>';
    else if(c&&c.st==='pending') st='<span class="pill st">Requested</span>';
    return '<button class="res fade" type="button" data-a="pick" data-id="'+a.id+'">'+ava(a,'')+'<span class="t"><b>'+esc(nm(a))+'</b><small>'+esc(a.club)+' · '+esc(a.team)+'</small><small>'+esc(a.pos)+' · '+esc(a.city)+'</small><span class="id">'+a.ryid+'</span></span>'+(st||I.chev)+'</button>';
  }).join('');
}
function findBody(ob){
  return '<div class="ob-body '+(ob?'':'top')+'">'+(ob?hl(['Find an','athlete.']):'<h1 class="ptitle">Request another athlete</h1>')+
    '<p class="sub rise d2">Search RYSEON by name or RYSEON ID.</p>'+
    '<label class="field rise d2">'+I.search+'<span class="sr">Search athletes</span><input id="find-q" data-in="find" placeholder="Name or RYSEON ID, e.g. RY-418273" autocomplete="off" value="'+esc(S.req.q)+'"></label>'+
    '<div class="results" id="results">'+resultsHtml()+'</div>'+
    '<p class="note">Before an athlete approves your request, VANTAGE only shows the basic profile they make visible on RYSEON.</p>'+
  '</div>'+
  (ob?'<div class="ob-act" style="margin-top:28px"><button class="textbtn" type="button" data-a="skipFind" style="align-self:center">Skip for now</button></div>':'');
}
function idCard(a){
  return '<div class="idcard"><div class="who">'+ava(a,'lg')+'<div><div class="nm">'+esc(nm(a))+'</div><span class="tag">'+esc(a.pos)+'</span></div></div>'+
    '<dl><div><dt>Club</dt><dd>'+esc(a.club)+'</dd></div><div><dt>Team</dt><dd>'+esc(a.team)+'</dd></div><div><dt>City</dt><dd>'+esc(a.city)+'</dd></div><div><dt>RYSEON ID</dt><dd>'+a.ryid+'</dd></div></dl></div>';
}
function planNote(){
  var n=live().length+S.cons.filter(function(c){return c.st==='pending'}).length, pl=PLANS[S.plan];
  if(n<pl.incl) return '';
  if(n>=pl.max) return '';
  return '<p class="note">If approved, this adds €3.90 / month to your '+pl.name+' plan.</p>';
}
function requestBody(ob){
  var a=A(S.req.sel); if(!a) return '';
  var rels=['Parent','Agent','Private Coach','Other'];
  return '<div class="ob-body '+(ob?'':'top')+'">'+(ob?hl(['Request','access.']):'<h1 class="ptitle">Request access</h1>')+
    '<div class="rise d1">'+idCard(a)+'</div>'+
    '<div class="rise d2" style="display:flex;flex-direction:column;gap:12px"><span class="mlabel">Your relationship to '+esc(a.first)+'</span>'+
    '<div class="relgrid" role="radiogroup" aria-label="Relationship">'+rels.map(function(r){return '<button class="rel" type="button" role="radio" aria-checked="'+(S.req.rel===r)+'" data-a="rel" data-r="'+r+'">'+r+'</button>'}).join('')+'</div></div>'+
    '<p class="sub rise d2" style="font-size:14px">'+esc(a.first)+' will see your name, email and relationship in RYSEON. Nothing is shared with you until '+he(a)+' approves, and '+he(a)+' decides what you can see.</p>'+
    planNote()+
  '</div>'+
  '<div class="ob-act rise d3"><button class="btn btn-primary" type="button" data-a="sendReq"'+(S.req.rel?'':' disabled')+'>Request access</button></div>';
}
function sentBody(ob){
  var a=A(S.req.sel);
  return '<div class="state" style="margin:auto 0">'+
    '<div class="orbit rise d1"><span class="ring"></span><span class="ring"></span><span class="ring"></span>'+ava(a,'','locked')+'<span class="lock">'+I.lock+'</span></div>'+
    '<span class="pill rise d1"><span class="dot"></span>Pending approval</span>'+
    '<h1 class="display hl" style="text-align:center"><span class="line"><span class="li">Request sent</span></span></h1>'+
    '<p class="sub rise d2" style="max-width:34ch">'+esc(a.first)+' needs to approve your connection before you can view '+his(a)+' development.</p>'+
    '<div class="locked-list rise d3">'+['Schedule','Development','Reports'].map(function(t,i){return '<div><span>'+t+'</span><span style="display:flex;align-items:center;gap:10px"><i style="--w:'+(70-i*14)+'px"></i>'+I.lock+'</span></div>'}).join('')+'</div>'+
    '<p class="note rise d3">No information is available until '+esc(a.first)+' approves.</p>'+
  '</div>'+
  '<div class="ob-act rise d4"><button class="btn btn-primary" type="button" data-a="'+(ob?'enterApp':'doneReq')+'">'+(ob?'Continue to VANTAGE':'Done')+'</button>'+
    '<button class="btn btn-sim" type="button" data-a="'+(ob?'simApprove':'simApproveApp')+'" data-id="'+a.id+'"><span class="sim-k">Prototype</span>'+esc(a.first)+' approves access</button>'+
  '</div>';
}
function approvedBody(ob){
  var a=A(S.req.sel),p=P(a.id),sh=PERM_LABELS.filter(function(x){return p[x[0]]}).map(function(x){return x[1]});
  return '<div class="state" style="margin:auto 0">'+
    '<div class="orbit done rise d1"><span class="ring"></span><span class="ring"></span><span class="ring"></span>'+ava(a)+'<span class="ok">'+I.check+'</span></div>'+
    '<h1 class="display hl" style="text-align:center"><span class="line"><span class="li">You’re connected.</span></span></h1>'+
    '<p class="sub rise d2" style="max-width:36ch">'+esc(a.first)+' approved your request. You’re now connected to the development '+he(a)+' shares with you.</p>'+
    '<div class="card rise d3" style="width:100%;text-align:left"><span class="mlabel acc">'+esc(a.first)+' is sharing</span><p style="margin-top:10px;font:500 14.5px/1.55 var(--font-body)">'+sh.join(' · ')+'</p></div>'+
  '</div>'+
  '<div class="ob-act rise d4"><button class="btn btn-primary" type="button" data-a="openNew" data-id="'+a.id+'">Open VANTAGE</button></div>';
}

/* ---------- Globe for the language screen (canvas; quiet rotating dot sphere) ---------- */
var globeRAF=null,globeRot={lon:-30,lat:30,tl:-30,tt:30};
function startGlobe(){
  var cv=document.getElementById('globe'); if(!cv) return; var ctx=cv.getContext('2d'); var N=900,pts=[];
  for(var i=0;i<N;i++){var y=1-(i/(N-1))*2,r=Math.sqrt(1-y*y),t=i*2.399963;pts.push([Math.cos(t)*r,y,Math.sin(t)*r])}
  cancelAnimationFrame(globeRAF);
  var L=LANGS[S.lang];globeRot.tl=L[6];globeRot.tt=L[7]*.6;
  function frame(){
    if(!document.getElementById('globe')) return;
    globeRot.lon+=(globeRot.tl-globeRot.lon)*.06; globeRot.lat+=(globeRot.tt-globeRot.lat)*.06;
    var W=600,R=250,cx=300,cy=300;ctx.clearRect(0,0,W,W);
    var lo=globeRot.lon*Math.PI/180,la=globeRot.lat*Math.PI/180,cl=Math.cos(lo),sl=Math.sin(lo),ca=Math.cos(la),sa=Math.sin(la);
    var g=ctx.createRadialGradient(cx-60,cy-80,20,cx,cy,R);g.addColorStop(0,'rgba(47,107,255,.16)');g.addColorStop(1,'rgba(47,107,255,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.07)';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(cx,cy,R,0,7);ctx.stroke();
    for(var i=0;i<N;i++){var p=pts[i];var x=p[0]*cl-p[2]*sl,z=p[0]*sl+p[2]*cl,y=p[1];var y2=y*ca-z*sa,z2=y*sa+z*ca;
      if(z2<0) continue; ctx.fillStyle='rgba(214,224,245,'+(0.08+z2*.42)+')';ctx.beginPath();ctx.arc(cx+x*R,cy-y2*R,1.5+z2*.9,0,7);ctx.fill()}
    // marker at language centre (front-facing after rotation)
    var Lc=LANGS[S.lang],mlon=Lc[6]*Math.PI/180,mlat=Lc[7]*Math.PI/180;
    var mx=Math.cos(mlat)*Math.sin(mlon),my=Math.sin(mlat),mz=Math.cos(mlat)*Math.cos(mlon);
    var qx=mx*cl-mz*sl,qz=mx*sl+mz*cl,qy=my*ca-qz*sa;
    var t=Date.now()/1000, rr=8+((t%2.4)/2.4)*26;
    var px=cx+qx*R,py=cy-qy*R;
    ctx.fillStyle='#9DB8FF';ctx.beginPath();ctx.arc(px,py,6,0,7);ctx.fill();
    ctx.strokeStyle='rgba(157,184,255,'+(1-(rr-8)/26)*.7+')';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(px,py,rr,0,7);ctx.stroke();
    globeRAF=requestAnimationFrame(frame);
  }
  frame();
}
function bindLangRail(){
  var tr=document.getElementById('lang-track'); if(!tr) return;
  var it=tr.querySelectorAll('.lang-item');
  // centre the selected language without animation
  var el=it[S.lang]; tr.scrollLeft=el.offsetLeft-(tr.clientWidth-el.clientWidth)/2;
  var to=null;
  tr.addEventListener('scroll',function(){clearTimeout(to);to=setTimeout(function(){
    var mid=tr.scrollLeft+tr.clientWidth/2,best=0,bd=1e9;
    it.forEach(function(b,i){var c=b.offsetLeft+b.clientWidth/2,d=Math.abs(c-mid);if(d<bd){bd=d;best=i}});
    if(best!==S.lang) setLang(best,false);
  },70)},{passive:true});
}
function setLang(i,scroll){
  S.lang=i; var L=LANGS[i];
  var t=document.getElementById('lang-title'),r=document.getElementById('lang-region'),g=document.getElementById('lang-go');
  if(t){t.textContent=L[4];t.dir=L[0]==='ar'?'rtl':'ltr'} if(r) r.textContent=L[3]; if(g) g.textContent=L[5];
  document.querySelectorAll('.lang-item').forEach(function(b,j){b.classList.toggle('on',j===i);b.setAttribute('aria-selected',j===i)});
  document.querySelectorAll('#lang-dial i').forEach(function(b,j){b.classList.toggle('on',j===i)});
  globeRot.tl=L[6];globeRot.tt=L[7]*.6;
  if(scroll){var tr=document.getElementById('lang-track'),el=tr.querySelectorAll('.lang-item')[i];tr.scrollTo({left:el.offsetLeft-(tr.clientWidth-el.clientWidth)/2,behavior:'smooth'})}
}
