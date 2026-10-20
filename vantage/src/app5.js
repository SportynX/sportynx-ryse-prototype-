/* ============================================================
   VANTAGE — two ways to connect with an athlete
   A) Find: the athlete already uses RYSEON → request access
   B) Invite: the athlete isn't on RYSEON yet → send a link;
      the VANTAGE user can pay for the athlete's RYSEON plan.
   The athlete still decides: joining via the link = approving
   the connection, and they choose what to share.
   ============================================================ */
var RYSEON_PRICE='£11.99 / month',RYSEON_TRIAL='7 days free';
var INV_N=0;
function invCode(){var c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',s='';for(var i=0;i<4;i++) s+=c[Math.floor(Math.random()*c.length)];return s}
function newInvite(){return {first:'',last:'',contact:'',rel:roleLabel(S.role),pay:'me'}}
var II={
  find:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>',
  link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/></svg>',
  share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3.5M8 7.5l4-4 4 4"/><path d="M6 11H5a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 5 20h14a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 19 11h-1"/></svg>',
  copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2.2"/><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2.5" width="10" height="19" rx="2.4"/><path d="M11 18.5h2"/></svg>',
  dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/></svg>',
  card:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5.5" width="18" height="13" rx="2.4"/><path d="M3 10h18M6.5 14.5h4"/></svg>'
};

/* ---------- choose: find or invite ---------- */
function chooseBody(ob){
  return '<div class="ob-body '+(ob?'':'top')+'">'+(ob?hl(['Connect with','an athlete.']):'<h1 class="ptitle">Request another athlete</h1>')+
    '<p class="sub rise d2">Does the athlete already use RYSEON?</p>'+
    '<div class="paths rise d2">'+
      '<button class="path" type="button" data-a="conFind"><span class="pi">'+II.find+'</span><span class="t"><b>Find on RYSEON</b><span>They already use RYSEON. Search by name or RYSEON ID and request access.</span></span>'+I.chev+'</button>'+
      '<button class="path" type="button" data-a="conInvite"><span class="pi">'+II.link+'</span><span class="t"><b>Invite to RYSEON</b><span>They don’t have RYSEON yet. Send them a link to download it. You can pay for their plan.</span></span>'+I.chev+'</button>'+
    '</div>'+
    '<p class="note rise d3">Either way, the athlete approves the connection and chooses what you see.</p>'+
  '</div>'+
  (ob?'<div class="ob-act"><button class="textbtn" type="button" data-a="skipFind" style="align-self:center">Skip for now</button></div>':'');
}

/* ---------- invite form ---------- */
function inviteBody(ob){
  var f=S.inv,ok=f.first.trim().length>0,nmF=f.first.trim()||'the athlete';
  var rels=['Parent','Agent','Private Coach','Other'];
  return '<div class="ob-body '+(ob?'':'top')+'">'+(ob?hl(['Invite to','RYSEON.']):'<h1 class="ptitle">Invite to RYSEON</h1>')+
    '<p class="sub rise d2">We’ll create a personal link. They download RYSEON, create their profile and you’re connected.</p>'+
    '<div class="rise d2" style="display:flex;flex-direction:column;gap:10px">'+
      '<div class="two"><label class="field"><span class="sr">First name</span><input id="inv-first" data-in="invFirst" placeholder="First name" autocomplete="off" value="'+esc(f.first)+'"></label>'+
      '<label class="field"><span class="sr">Last name</span><input id="inv-last" data-in="invLast" placeholder="Last name" autocomplete="off" value="'+esc(f.last)+'"></label></div>'+
      '<label class="field">'+II.phone+'<span class="sr">Phone or email</span><input id="inv-contact" data-in="invContact" placeholder="Phone or email · optional" autocomplete="off" value="'+esc(f.contact)+'"></label>'+
    '</div>'+
    '<div class="rise d2" style="display:flex;flex-direction:column;gap:12px"><span class="mlabel">Your relationship</span><div class="relgrid" role="radiogroup" aria-label="Relationship">'+rels.map(function(r){return '<button class="rel" type="button" role="radio" aria-checked="'+(f.rel===r)+'" data-a="invRel" data-r="'+r+'">'+r+'</button>'}).join('')+'</div></div>'+
    '<div class="rise d3" style="display:flex;flex-direction:column;gap:12px"><span class="mlabel">Who pays for RYSEON?</span>'+
      '<button class="payopt" type="button" role="radio" aria-checked="'+(f.pay==='me')+'" data-a="invPay" data-v="me"><span class="rd"></span><span class="t"><b>I’ll pay for '+esc(nmF)+'</b><span>'+RYSEON_TRIAL+', then '+RYSEON_PRICE+'. Billed to you. Cancel anytime.</span></span></button>'+
      '<button class="payopt" type="button" role="radio" aria-checked="'+(f.pay==='athlete')+'" data-a="invPay" data-v="athlete"><span class="rd"></span><span class="t"><b>'+esc(f.first.trim()||'The athlete')+' pays</b><span>They start their own RYSEON free trial.</span></span></button>'+
    '</div>'+
    (f.pay==='me'?'<p class="note">You’re only charged once '+esc(nmF)+' activates RYSEON. Paying doesn’t give you extra access. '+esc(nmF)+' still chooses what to share.</p>':'')+
  '</div>'+
  '<div class="ob-act rise d3"><button class="btn btn-primary" type="button" data-a="invSend"'+(ok?'':' disabled')+'>Create invite link</button></div>';
}

/* ---------- invite sent ---------- */
function invLink(c){return 'ryseon.ai/join/'+c.code}
function invSentBody(ob){
  var c=conOf(S.req.sel),a=A(c.a);
  return '<div class="ob-body '+(ob?'':'top')+'" style="gap:18px">'+
    '<div class="state" style="align-items:flex-start;text-align:left;gap:14px"><span class="pill rise d1"><span class="dot"></span>Invite ready</span>'+
    '<h1 class="display hl"><span class="line"><span class="li">Send '+esc(a.first)+'</span></span><span class="line"><span class="li">the link.</span></span></h1>'+
    '<p class="sub rise d2">'+esc(a.first)+' opens it, downloads RYSEON and creates a profile. You’re connected once '+esc(a.first)+' approves.</p></div>'+
    '<div class="invlink rise d2"><span class="mlabel acc">Personal invite link</span><div class="lk"><b id="inv-url">'+invLink(c)+'</b><button class="iconbtn" type="button" data-a="invCopy" aria-label="Copy link">'+II.copy+'</button></div>'+
      '<button class="btn btn-blue" type="button" data-a="invShare">'+II.share+'Share link</button>'+
      (c.contact?'<p class="note">Also sent to '+esc(c.contact)+'.</p>':'')+'</div>'+
    '<ol class="steps3 rise d3">'+
      '<li><i>1</i><span><b>'+esc(a.first)+' opens the link</b><small>On iPhone or Android</small></span></li>'+
      '<li><i>2</i><span><b>Downloads RYSEON and creates a profile</b><small>'+(c.sponsor?'Paid by you · '+RYSEON_TRIAL+', then '+RYSEON_PRICE:esc(a.first)+' starts their own free trial')+'</small></span></li>'+
      '<li><i>3</i><span><b>Approves your connection</b><small>'+esc(a.first)+' chooses what you can see</small></span></li>'+
    '</ol>'+
  '</div>'+
  '<div class="ob-act rise d4"><button class="btn btn-primary" type="button" data-a="'+(ob?'enterApp':'doneReq')+'">'+(ob?'Continue to VANTAGE':'Done')+'</button>'+
    '<button class="btn btn-sim" type="button" data-a="invJoin" data-id="'+a.id+'"><span class="sim-k">Prototype</span>'+esc(a.first)+' joins RYSEON</button></div>';
}

/* ---------- joined + connected ---------- */
function joinedBody(ob){
  var c=conOf(S.req.sel),a=A(c.a),p=P(a.id),sh=PERM_LABELS.filter(function(x){return p[x[0]]}).map(function(x){return x[1]});
  return '<div class="state" style="margin:auto 0">'+
    '<div class="orbit done rise d1"><span class="ring"></span><span class="ring"></span><span class="ring"></span>'+ava(a)+'<span class="ok">'+I.check+'</span></div>'+
    '<span class="pill blue rise d1"><span class="dot"></span>Joined RYSEON</span>'+
    '<h1 class="display hl" style="text-align:center"><span class="line"><span class="li">You’re connected.</span></span></h1>'+
    '<p class="sub rise d2" style="max-width:36ch">'+esc(a.first)+' joined RYSEON with your invite and approved your connection.</p>'+
    (c.sponsor?'<div class="card focus rise d3" style="width:100%;text-align:left;display:flex;gap:12px;align-items:flex-start"><span style="width:22px;height:22px;flex:none;color:var(--blue-3)">'+II.card+'</span><span><span class="mlabel acc">RYSEON paid by you</span><p style="margin-top:8px;font:500 14px/1.5 var(--font-body)">'+RYSEON_TRIAL+', then '+RYSEON_PRICE+' for '+esc(a.first)+'. Manage it in Profile.</p></span></div>':'')+
    '<div class="card rise d3" style="width:100%;text-align:left"><span class="mlabel">'+esc(a.first)+' is sharing</span><p style="margin-top:10px;font:500 14px/1.55 var(--font-body)">'+sh.join(' · ')+'</p></div>'+
  '</div>'+
  '<div class="ob-act rise d4"><button class="btn btn-primary" type="button" data-a="openNew" data-id="'+a.id+'">Open '+esc(a.first)+'’s development</button></div>';
}

/* ---------- invited states elsewhere ---------- */
function invitedNotice(a,c){
  return '<div class="req pending">'+ava(a,'','locked')+'<span class="t"><b>Invited · '+esc(nm(a))+'</b><p>Waiting for '+esc(a.first)+' to join RYSEON with your link.'+(c.sponsor?' RYSEON paid by you.':'')+'</p></span><span class="acts"><button class="btn btn-quiet btn-sm" type="button" data-a="openA" data-id="'+a.id+'">View</button></span></div>';
}
function invitedState(a,c){
  return '<div class="endstate fade"><div class="orbit"><span class="ring"></span><span class="ring"></span><span class="ring"></span>'+ava(a,'','locked')+'<span class="lock">'+I.lock+'</span></div><span class="pill"><span class="dot"></span>Invited to RYSEON</span><h2>'+esc(nm(a))+'</h2>'+
    '<p>'+esc(a.first)+' hasn’t joined RYSEON yet. You’ll be connected once '+esc(a.first)+' creates a profile with your link and approves.</p>'+
    '<div class="invlink" style="width:100%;text-align:left"><div class="lk"><b>'+invLink(c)+'</b><button class="iconbtn" type="button" data-a="invCopyId" data-id="'+a.id+'" aria-label="Copy link">'+II.copy+'</button></div>'+
      '<button class="btn btn-blue" type="button" data-a="invShareId" data-id="'+a.id+'">'+II.share+'Send link again</button></div>'+
    (c.sponsor?'<p class="note">RYSEON paid by you · '+RYSEON_TRIAL+', then '+RYSEON_PRICE+'. Not charged until '+esc(a.first)+' activates.</p>':'')+
    '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn-quiet btn-sm" type="button" data-a="cancelReq" data-id="'+a.id+'">Cancel invite</button><button class="btn btn-sim btn-sm" type="button" data-a="invJoin" data-id="'+a.id+'"><span class="sim-k">Prototype</span>'+esc(a.first)+' joins</button></div></div>';
}

/* ---------- hooks into onboarding and the in-app request flow ---------- */
var _renderOb5=renderOb;
renderOb=function(){
  var s=S.step,b=null;
  if(s==='connect') b=obHead(true)+'<div class="ob-col">'+chooseBody(true)+'</div>';
  else if(s==='invite') b=obHead(true)+'<div class="ob-col">'+inviteBody(true)+'</div>';
  else if(s==='invsent') b='<div class="ob-col">'+invSentBody(true)+'</div>';
  else if(s==='joined') b='<div class="ob-col">'+joinedBody(true)+'</div>';
  return b===null?_renderOb5():'<div class="ob" id="ob">'+b+'</div>';
};
var _viewRequest5=viewRequest;
viewRequest=function(){
  var st=S.req.stage,body=null;
  if(st==='choose') body=chooseBody(false);
  else if(st==='invite') body=inviteBody(false);
  else if(st==='invsent') body=invSentBody(false);
  else if(st==='joined') body=joinedBody(false);
  if(body===null) return _viewRequest5();
  return '<div class="page narrow">'+mtop()+'<div><button class="textbtn" type="button" data-a="reqBack" style="display:flex;align-items:center;gap:6px">'+I.left.replace('<svg','<svg style="width:16px;height:16px"')+(st==='choose'?'Athletes':'Back')+'</button></div>'+body+'</div>';
};
/* Profile: RYSEON plans the user pays for */
var _viewProfile5=viewProfile;
viewProfile=function(){
  var h=_viewProfile5(),sp=S.cons.filter(function(c){return c.sponsor&&(c.st==='connected'||c.st==='invited')});
  if(!sp.length) return h;
  var sec='<div class="sec-h rise d2"><h2 class="h3">RYSEON paid by you</h2></div><div class="set rise d2">'+sp.map(function(c){var a=A(c.a);return '<div>'+ava(a,'',c.st==='invited'?'locked':'')+'<span class="t">RYSEON for '+esc(a.first)+'<small>'+(c.st==='invited'?'Starts when '+esc(a.first)+' joins · '+RYSEON_TRIAL:RYSEON_TRIAL+', then billed monthly')+'</small></span><span class="v">'+RYSEON_PRICE+'</span></div>'}).join('')+'</div>';
  var i=h.indexOf('<div class="sec-h rise d2"><h2 class="h3">Connections');
  return i<0?h:h.slice(0,i)+sec+h.slice(i);
};
/* sidebar & search: show invited like pending */
var _resultsHtml5=resultsHtml;

/* ---------- actions ---------- */
function shareLink(c){
  var url='https://'+invLink(c),a=A(c.a),txt=S.user+' invited you to RYSEON. Download the app and create your profile:';
  if(navigator.share){navigator.share({title:'Join RYSEON',text:txt,url:url}).catch(function(){})}
  else copyLink(c);
}
function copyLink(c){
  var url='https://'+invLink(c);
  try{navigator.clipboard.writeText(url).then(function(){toast('Link copied')},function(){toast(invLink(c))})}catch(e){toast(invLink(c))}
}
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-a]'); if(!t) return; var a=t.getAttribute('data-a'),d=t.dataset;
  switch(a){
    case 'conFind': if(S.ob) obGo('find'); else {S.req.stage='find';render(true)} break;
    case 'conInvite': S.inv=newInvite(); if(S.ob) obGo('invite'); else {S.req.stage='invite';render(true)} break;
    case 'invRel': S.inv.rel=d.r;render();break;
    case 'invPay': S.inv.pay=d.v;render();break;
    case 'invSend':
      var f=S.inv; if(!f.first.trim()) break;
      if(!S.ob&&slotsUsed()>=PLANS[S.plan].max){S.ov={t:'limit'};render();break}
      var id='inv'+(++INV_N),fn=f.first.trim(),ln=f.last.trim();
      DIRECTORY[id]={id:id,first:fn.charAt(0).toUpperCase()+fn.slice(1),last:ln?ln.charAt(0).toUpperCase()+ln.slice(1):'',g:'x',age:null,club:'',team:'',pos:'',ps:'',ryid:'',h:200+Math.floor(Math.random()*40),city:''};
      if(!DIRECTORY[id].last) DIRECTORY[id].last=' ';
      S.cons.push({a:id,st:'invited',rel:f.rel,p:{},sponsor:f.pay==='me',code:invCode(),contact:f.contact.trim()});
      S.req.sel=id;
      if(S.ob) obGo('invsent'); else {S.req.stage='invsent';render(true)}
      break;
    case 'invShare': shareLink(conOf(S.req.sel));break;
    case 'invCopy': copyLink(conOf(S.req.sel));break;
    case 'invShareId': shareLink(conOf(d.id));break;
    case 'invCopyId': copyLink(conOf(d.id));break;
    case 'invJoin':
      var c=conOf(d.id),dd=DIRECTORY[d.id];
      // the athlete creates their RYSEON profile (prototype values)
      dd.age=15;dd.club='NK Sava Zagreb';dd.team='U17';dd.pos='Central Midfielder';dd.ps='CM';dd.city='Zagreb';dd.ryid='RY-'+(600000+Math.floor(Math.random()*399999));
      ensureFull(d.id);var A2=ATHLETES[d.id];A2.lvl=0;A2.drive=48;A2.dt=0;A2.m={c:50,i:46,l:52,p:44,h:47,r:49};A2.lvh=[['Bronze','Joined RYSEON',MON[TODAY.getMonth()]+' '+TODAY.getFullYear()]];A2.ins='First days in RYSEON. Training sessions and daily check-ins are starting to come in.';A2.since=dkey(TODAY);
      c.st='connected';c.since=dkey(TODAY);c.p={};S.req.sel=d.id;S.ov=null;
      if(S.ob) obGo('joined');
      else if(S.view==='request'){S.req.stage='joined';render(true)}
      else {go('athlete',{id:d.id,t:'overview'});toast(dd.first+' joined RYSEON and approved your connection')}
      break;
  }
});
document.addEventListener('input',function(e){
  var t=e.target,k=t.getAttribute('data-in');if(!k||!S.inv) return;
  if(k==='invFirst'){S.inv.first=t.value;var b=document.querySelector('[data-a=invSend]');if(b) b.disabled=!t.value.trim();
    document.querySelectorAll('[data-a=invPay] b').forEach(function(x,i){x.textContent=i===0?'I’ll pay for '+(t.value.trim()||'the athlete'):(t.value.trim()||'The athlete')+' pays'})}
  else if(k==='invLast') S.inv.last=t.value;
  else if(k==='invContact') S.inv.contact=t.value;
});
render(true);
