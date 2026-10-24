/* ============================================================
   VANTAGE — Membership (Ivan, 24 Oct 2026)
   RYSEON VANTAGE £14.90 / month includes one RYSEON athlete membership.
   Profile → Membership → Get VANTAGE → Invite Athlete → Share / QR →
   Pending → athlete accepts (and chooses what to share) → Connected.

   Four separate concepts (never one boolean):
     MEM.sub    VANTAGE subscription   — who pays £14.90 / month, status, dates
     MEM.cov    RYSEON coverage         — which athlete gets the included licence
     S.cons[]   Athlete connection      — who is connected to whom (the existing VANTAGE connection list)
     c.p        Permissions             — what the athlete lets the VANTAGE member see (set by the athlete only)
   Both invitation directions (VANTAGE → athlete, athlete → VANTAGE) end in the same
   records: one connection in S.cons + one coverage in MEM.cov.
   ============================================================ */
(function(){
var PRICE='£14.90',RY_PRICE='£11.90';
var MEM={sub:{st:'none',start:null,renew:null,ends:null},cov:null,inv:null,incoming:null,note:null};
window.VMEM=MEM;
function addM(d,n){var x=new Date(d);x.setMonth(x.getMonth()+n);return x}
function dl(d){return d.getDate()+' '+MONTHS[d.getMonth()]+' '+d.getFullYear()}
function tok(){var c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789',s='';for(var i=0;i<22;i++) s+=c[Math.floor(Math.random()*c.length)];return s}
function link(){return 'ryseon.ai/vantage/connect/'+MEM.inv.token}
function active(){return MEM.sub.st==='active'||MEM.sub.st==='cancelling'}
/* what the user sees (no technical state names) */
function state(){
  if(MEM.sub.st==='none') return 'inactive';
  if(MEM.sub.st==='expired') return 'expired';
  if(MEM.cov&&MEM.cov.st==='active') return MEM.sub.st==='cancelling'?'cancelling':'connected';
  if(MEM.inv&&MEM.inv.st==='pending') return MEM.sub.st==='cancelling'?'cancelling':'pending';
  return MEM.sub.st==='cancelling'?'cancelling':(MEM.note==='revoked'?'revoked':'available');
}
function covA(){return MEM.cov&&A(MEM.cov.a)}
var IC={
  tick:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  qr:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2"/><path d="M14 14h2.5v2.5H14zM18 18h2.5v2.5H18zM14 18.5v2M18.5 14h2"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.9-3.6 3.7-5.6 7-5.6s6.1 2 7 5.6"/></svg>'
};

/* ---------- Profile: membership card + settings row ---------- */
function summary(){var s=state(),a=covA();
  var line={inactive:'Not active',available:'Active · 1 athlete licence available',revoked:'Active · 1 athlete licence available',pending:'Active · invitation pending',
    connected:'Active · RYSEON included for '+(a?a.first:''),cancelling:'Ends on '+(MEM.sub.ends?dl(MEM.sub.ends):''),expired:'Ended'}[s];
  return line}
function profileCard(){var s=state();
  return '<div class="card focus rise d1 mb-card"><div class="mb-row"><span class="mlabel acc">Membership</span>'+pillFor(s)+'</div>'+
    '<p class="mb-name">RYSEON VANTAGE</p><p class="mb-price"><b>'+PRICE+'</b> / month</p>'+
    '<p class="mb-inc">'+IC.tick+'Includes 1 RYSEON athlete membership</p>'+
    (s==='inactive'||s==='expired'?'':'<p class="sub mb-st">'+esc(summary())+'</p>')+
    '<button class="btn '+(s==='inactive'||s==='expired'?'btn-primary':'btn-quiet')+' btn-sm" type="button" data-a="memOpen">'+(s==='inactive'||s==='expired'?'Get VANTAGE':'Manage membership')+'</button></div>'}
function pillFor(s){return {inactive:'<span class="pill">Not active</span>',expired:'<span class="pill">Ended</span>',cancelling:'<span class="pill">Ending</span>'}[s]||'<span class="pill blue"><span class="dot"></span>Active</span>'}
var _vp=viewProfile;
viewProfile=function(){var h=_vp();
  var i=h.indexOf('<div class="card focus rise d1">'),u=i<0?-1:h.indexOf('<div class="usage">',i),j=u<0?-1:h.indexOf('</div></div>',u)+12;
  if(i>=0&&j>i) h=h.slice(0,i)+profileCard()+h.slice(j);
  h=h.replace(/<button type="button" data-a="nav" data-v="pricing">(<svg[\s\S]*?<\/svg>)<span class="t">Subscription &amp; billing<\/span><span class="v">[^<]*<\/span>/,'<button type="button" data-a="memOpen">$1<span class="t">Membership<small>RYSEON VANTAGE · includes 1 RYSEON athlete membership</small></span><span class="v">'+({inactive:'Not active',expired:'Ended',cancelling:'Ending'}[state()]||'Active')+'</span>');
  h=h.replace(/<button type="button" data-a="nav" data-v="pricing">(<svg[\s\S]*?<\/svg>)<span class="t">Subscription & billing<\/span><span class="v">[^<]*<\/span>/,'<button type="button" data-a="memOpen">$1<span class="t">Membership<small>RYSEON VANTAGE · includes 1 RYSEON athlete membership</small></span><span class="v">'+({inactive:'Not active',expired:'Ended',cancelling:'Ending'}[state()]||'Active')+'</span>');
  return h};

/* ---------- Membership screen ---------- */
function top(t,back){return '<div class="dr-top"><button class="lt-back" type="button" data-a="'+(back||'memBack')+'" aria-label="Back">'+I.left+'</button><h2>'+t+'</h2><span style="width:46px"></span></div>'}
function hero(){
  return '<div class="mb-hero"><span class="mlabel acc">RYSEON VANTAGE</span><h3 class="mb-hl">Stay connected<br>to their development.</h3>'+
    '<p class="sub">Follow the development of an athlete who chooses to connect and share their information with you.</p>'+
    '<div class="mb-offer"><div class="mb-p"><b>'+PRICE+'</b><span>/ month</span></div>'+
      '<div class="mb-plus"><span class="mb-ic">'+IC.user+'</span><span><b>Includes 1 RYSEON athlete membership</b><small>The athlete you connect with gets full RYSEON, normally '+RY_PRICE+' / month, at no extra cost.</small></span></div></div></div>'}
function journey(){return '<ol class="steps3 mb-steps"><li><i>1</i><span><b>Get VANTAGE</b><small>'+PRICE+' / month · cancel any time</small></span></li><li><i>2</i><span><b>Invite an athlete</b><small>Share a link or show a QR code</small></span></li><li><i>3</i><span><b>The athlete accepts</b><small>They choose what you can see</small></span></li><li><i>4</i><span><b>Connected</b><small>Their RYSEON membership is included</small></span></li></ol>'}
function licence(s){var a=covA(),inv=MEM.inv,h='<section class="rgroup"><h4>Your included RYSEON membership</h4>';
  if(s==='connected'||(s==='cancelling'&&a)){
    h+='<div class="card mb-lic"><div class="mb-row"><b class="mb-lt">Included RYSEON Membership</b><span class="pill blue">1 of 1 licence in use</span></div>'+
      '<div class="mb-ath">'+ava(a)+'<span class="t"><b>'+esc(nm(a))+'</b><small>Athlete</small></span><span class="pill blue"><span class="dot"></span>Connected</span></div>'+
      '<p class="mb-cov">'+IC.tick+(s==='cancelling'?'RYSEON membership included until '+dl(MEM.sub.ends):'RYSEON membership included with your VANTAGE plan')+'</p>'+
      '<button class="btn btn-quiet btn-sm" type="button" data-a="memConn">Manage Connection</button></div>';
  } else if(inv&&inv.st==='pending'){
    h+='<div class="card mb-lic"><div class="mb-row"><b class="mb-lt">Athlete Invitation</b><span class="pill"><span class="dot"></span>Pending</span></div>'+
      '<div class="mb-ath"><span class="ava locked" style="--h:'+inv.h+'" aria-hidden="true">'+esc((inv.first[0]||'')+(inv.last[0]||''))+'</span><span class="t"><b>'+esc((inv.first+' '+inv.last).trim())+'</b><small>Athlete · invited '+fmt(inv.at,'rel').toLowerCase()+'</small></span></div>'+
      '<p class="mb-await">Awaiting athlete acceptance</p>'+
      '<div class="mb-acts"><button class="btn btn-quiet btn-sm" type="button" data-a="memShare">Share Again</button><button class="btn btn-quiet btn-sm" type="button" data-a="memQR">Show QR</button></div>'+
      '<button class="textbtn mb-cancel" type="button" data-a="memInvCancel">Cancel Invitation</button>'+
      '<button class="btn btn-sim btn-sm" type="button" data-a="memAthView"><span class="sim-k">Prototype</span>'+esc(inv.first||'Athlete')+' opens the invitation</button></div>';
  } else {
    h+='<div class="card focus mb-lic"><div class="mb-row"><b class="mb-lt">1 athlete licence available</b></div>'+
      (s==='revoked'?'<p class="sub" style="font-size:14px">'+esc(MEM.revokedName||'The athlete')+' ended the connection. Their RYSEON account and data stay with them. You can invite another athlete.</p>':'<p class="sub" style="font-size:14px">Your VANTAGE membership includes a full RYSEON membership for one athlete. Invite an athlete to activate it.</p>')+
      '<button class="btn btn-blue" type="button" data-a="memInvite">'+IC.user.replace('<svg','<svg style="width:18px;height:18px"')+'Invite Athlete</button></div>';
  }
  return h+'</section>'}
function billing(s){
  var h='<section class="rgroup"><h4>Subscription & billing</h4><div class="set">'+
    '<div><span class="t">RYSEON VANTAGE<small>'+PRICE+' / month · includes 1 RYSEON athlete membership</small></span></div>'+
    '<div><span class="t">Status</span><span class="v">'+(s==='cancelling'?'Ends '+dl(MEM.sub.ends):'Active')+'</span></div>'+
    '<div><span class="t">'+(s==='cancelling'?'Access until':'Renews')+'</span><span class="v">'+dl(s==='cancelling'?MEM.sub.ends:MEM.sub.renew)+'</span></div>'+
    '<div><span class="t">Billed through</span><span class="v">App Store</span></div></div>';
  h+=s==='cancelling'?'<button class="btn btn-primary btn-sm mb-gap" type="button" data-a="memResume">Keep VANTAGE</button>':'<button class="textbtn mb-cancel" type="button" data-a="memCancelAsk">Cancel VANTAGE</button>';
  return h+'</section>'}
function memScreen(){var s=state(),h=top('Membership');h+='<div class="dr-body">';
  if(s==='inactive'||s==='expired'){
    h+=hero();
    if(s==='expired') h+='<div class="lockbox">'+I.info+'<span><b>Your VANTAGE membership ended on '+dl(MEM.sub.ends)+'</b><p>Get VANTAGE again to reconnect and include an athlete’s RYSEON membership. Athletes keep their RYSEON accounts and all their data.</p></span></div>';
    if(MEM.incoming) h+='<div class="card focus mb-lic"><div class="mb-row"><b class="mb-lt">Invitation from '+esc(MEM.incoming.first)+'</b><span class="pill blue">From RYSEON</span></div><p class="sub" style="font-size:14px">'+esc(MEM.incoming.first+' '+MEM.incoming.last)+' asked you to get RYSEON through VANTAGE. Get VANTAGE to include '+esc(MEM.incoming.first)+'’s RYSEON membership and connect.</p></div>';
    h+='<section class="rgroup"><h4>How it works</h4>'+journey()+'</section>';
    h+='<p class="note">VANTAGE never gives you access on its own. The athlete accepts the connection and chooses what you can see. Paying for their RYSEON membership doesn’t change that.</p>';
    h+='<div class="dr-foot"><button class="lt-save" type="button" data-a="memBuy">Get VANTAGE · '+PRICE+' / month</button></div>';
  } else {
    h+='<div class="mb-hero sm"><div class="mb-row"><span class="mlabel acc">RYSEON VANTAGE</span>'+pillFor(s)+'</div><p class="mb-name">'+PRICE+' <span>/ month</span></p><p class="mb-inc">'+IC.tick+'Includes 1 RYSEON athlete membership</p></div>';
    if(s==='cancelling') h+='<div class="lockbox mb-end">'+I.info+'<span><b>Your VANTAGE membership is ending</b><p>Your VANTAGE membership and included RYSEON athlete membership will remain active until '+dl(MEM.sub.ends)+'.'+(covA()?' '+esc(covA().first)+' has been told that their VANTAGE-funded RYSEON coverage is ending.':'')+'</p></span></div>';
    h+=licence(s)+billing(s);
    if(s==='cancelling'&&covA()) h+='<button class="btn btn-sim btn-sm" type="button" data-a="memAthEnd"><span class="sim-k">Prototype</span>What '+esc(covA().first)+' sees in RYSEON</button>';
  }
  h+=protoStates();
  return h+'</div>'}
function protoStates(){var L=[['inactive','Not subscribed'],['available','Active'],['pending','Pending'],['connected','Connected'],['cancelling','Cancelling'],['expired','Expired'],['revoked','Revoked'],['incoming','Athlete invited you']];
  return '<div class="mb-proto"><span class="sim-k">Prototype</span><span class="mlabel">Jump to a membership state</span><div class="chips wrap">'+L.map(function(x){return '<button class="chip" type="button" data-a="memJump" data-s="'+x[0]+'" aria-pressed="'+(state()===x[0]||(x[0]==='available'&&state()==='available'))+'">'+x[1]+'</button>'}).join('')+'</div></div>'}

/* ---------- Get VANTAGE (checkout, prototype) ---------- */
function buySheet(){var inc=MEM.incoming;
  return '<div class="sheet-h"><span class="mlabel acc">RYSEON VANTAGE</span><button class="iconbtn" type="button" data-a="closeOv" aria-label="Close">'+I.x+'</button></div><div class="sheet-b">'+
    '<h2 class="rp-h" style="font-size:26px">'+PRICE+' / month</h2><p class="mb-inc">'+IC.tick+'Includes 1 RYSEON athlete membership</p>'+
    '<p class="sub" style="font-size:14px">'+(inc?'Activating VANTAGE includes '+esc(inc.first)+'’s RYSEON membership and connects you, with what '+esc(inc.first)+' chose to share.':'After you subscribe, invite an athlete. Their RYSEON membership is included while your VANTAGE membership is active.')+'</p>'+
    '<p class="note">Renews monthly until cancelled. Cancel at least 24 hours before the renewal date in your App Store or Google Play settings. Prototype only — no payment is taken.</p>'+
    '<button class="btn btn-primary" type="button" data-a="memPay">Subscribe · '+PRICE+' / month</button></div>'}

/* ---------- Invite an Athlete ---------- */
function inviteScreen(o){var f=o.f,ok=f.first.trim().length>0,inv=MEM.inv&&MEM.inv.st==='pending';
  var h=top('Invite an Athlete')+'<div class="dr-body">'+
    '<div class="mb-hero sm"><h3 class="mb-hl">Invite an athlete.</h3><p class="sub">Invite an athlete to connect with you through VANTAGE. Their RYSEON membership is included with your VANTAGE plan.</p></div>'+
    '<div class="shield mb-shield">'+IC.tick+'<span><b>No separate RYSEON membership to buy</b><p>They won’t need to purchase a separate RYSEON membership while their membership is covered by your VANTAGE plan. They still choose what you can see.</p></span></div>'+
    '<section class="rgroup"><h4>Athlete</h4><div class="two"><label class="field"><span class="sr">First name</span><input data-in="miFirst" placeholder="First name" autocomplete="off" value="'+esc(f.first)+'"'+(inv?' disabled':'')+'></label>'+
      '<label class="field"><span class="sr">Last name</span><input data-in="miLast" placeholder="Last name" autocomplete="off" value="'+esc(f.last)+'"'+(inv?' disabled':'')+'></label></div></section>'+
    '<section class="rgroup"><h4>Send the invitation</h4><div class="set mb-send'+(ok||inv?'':' off')+'">'+
      '<button type="button" data-a="memShare">'+II.share.replace('<svg','<svg class="i"')+'<span class="t">Share Invite Link<small>Messages, WhatsApp, email…</small></span>'+I.chev+'</button>'+
      '<button type="button" data-a="memQR">'+IC.qr.replace('<svg','<svg class="i"')+'<span class="t">Show QR Code<small>The athlete scans it with their phone</small></span>'+I.chev+'</button>'+
      '<button type="button" data-a="memCopy">'+II.copy.replace('<svg','<svg class="i"')+'<span class="t">Copy Link</span>'+I.chev+'</button>'+
      '<button type="button" data-a="memMail">'+I.mail.replace('<svg','<svg class="i"')+'<span class="t">Send by Email</span>'+I.chev+'</button></div>'+
      (ok||inv?'':'<p class="note" style="margin-top:10px">Add the athlete’s first name to create their invitation.</p>')+'</section>'+
    (inv?'<div class="invlink"><span class="mlabel acc">Personal invitation link</span><div class="lk"><b>'+link()+'</b></div><p class="note" style="margin:0">Unique and single-use. You can cancel it at any time.</p></div>':'')+
    '<p class="note">The link contains a secure one-time code. It doesn’t reveal your account details. The athlete is only connected after they accept.</p>'+
    (inv?'<div class="dr-foot"><button class="lt-save" type="button" data-a="memBack">Done</button></div>':'')+
  '</div>';
  return h}
function ensureInvite(f){if(MEM.inv&&MEM.inv.st==='pending') return MEM.inv;var fn=f.first.trim(),ln=f.last.trim();if(!fn) return null;
  MEM.inv={token:tok(),first:fn.charAt(0).toUpperCase()+fn.slice(1),last:ln?ln.charAt(0).toUpperCase()+ln.slice(1):'',at:new Date(TODAY),st:'pending',h:200+Math.floor(Math.random()*40),dir:'out'};MEM.note=null;return MEM.inv}

/* ---------- QR ---------- */
var QRL=null;
function qrLib(){if(window.qrcode) return Promise.resolve();if(QRL) return QRL;QRL=new Promise(function(res,rej){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js';s.onload=res;s.onerror=rej;document.head.appendChild(s)});return QRL}
function qrSvg(text){var q=qrcode(0,'M');q.addData(text);q.make();var n=q.getModuleCount(),p='';for(var r=0;r<n;r++) for(var c=0;c<n;c++) if(q.isDark(r,c)) p+='M'+c+' '+r+'h1v1h-1z';
  return '<svg viewBox="-2 -2 '+(n+4)+' '+(n+4)+'" shape-rendering="crispEdges" role="img" aria-label="QR code for the invitation"><rect x="-2" y="-2" width="'+(n+4)+'" height="'+(n+4)+'" fill="#fff" rx="1.5"/><path d="'+p+'" fill="#0C0D10"/></svg>'}
function qrSheet(){var inv=MEM.inv;
  return '<div class="sheet-h"><span class="mlabel acc">Invitation for '+esc(inv.first)+'</span><button class="iconbtn" type="button" data-a="closeOv" aria-label="Close">'+I.x+'</button></div><div class="sheet-b" style="align-items:center;text-align:center">'+
    '<div class="mb-qr" id="mb-qr" data-keep="'+inv.token+'"><span class="mb-qr-l">Creating QR code…</span></div>'+
    '<p class="sub" style="font-size:14px;max-width:32ch">'+esc(inv.first)+' scans this with their phone camera to accept and connect through RYSEON VANTAGE.</p><p class="note" style="margin:0">'+link()+'</p></div>'}
function fillQR(){var el=document.getElementById('mb-qr');if(!el||el._f) return;el._f=1;qrLib().then(function(){el.innerHTML=qrSvg('https://'+link())}).catch(function(){el.innerHTML='<span class="mb-qr-l">QR code needs a connection. Use Copy Link instead.</span>'})}

/* ---------- athlete side (prototype preview of what the athlete sees in RYSEON) ---------- */
function athView(o){var inv=o.inv||MEM.inv,st=o.step||'invite',v=o.v||'new',who=S.user;
  var h='<div class="dr-top"><button class="lt-back" type="button" data-a="memBack" aria-label="Back">'+I.left+'</button><h2><span class="mb-sim">Prototype</span> Athlete view</h2><span style="width:46px"></span></div><div class="dr-body mb-ath-side">';
  if(st==='invite'){
    h+='<div class="mb-variant"><span class="mlabel">Prototype · the athlete is</span><div class="chips wrap">'+[['new','New to RYSEON'],['trial','In the 15-day free trial'],['paying','Already paying '+RY_PRICE]].map(function(x){return '<button class="chip" type="button" data-a="memAthV" data-v="'+x[0]+'" aria-pressed="'+(v===x[0])+'">'+x[1]+'</button>'}).join('')+'</div></div>'+
      '<div class="state" style="gap:16px;margin-top:6px"><div class="orbit done"><span class="ring"></span><span class="ring"></span><span class="ring"></span>'+meAva()+'</div>'+
      '<h1 class="display hl" style="text-align:center;font-size:30px"><span class="line"><span class="li">'+esc(who)+' invited you</span></span><span class="line"><span class="li">to connect.</span></span></h1>'+
      '<p class="sub" style="max-width:34ch">'+esc(who)+' invited you to connect through RYSEON VANTAGE.</p></div>'+
      '<div class="card"><p style="font:500 14.5px/1.55 var(--font-body)">Accept the connection to share the development information you choose and receive your RYSEON membership through their VANTAGE plan.</p></div>'+
      (v==='trial'?'<div class="lockbox">'+I.info+'<span><b>You’re in your free trial</b><p>When you accept, your membership is covered by VANTAGE. You won’t be charged '+RY_PRICE+' / month. Your profile, progress and everything you logged stay exactly as they are.</p></span></div>':'')+
      (v==='paying'?'<div class="lockbox">'+I.info+'<span><b>You already pay for RYSEON</b><p>You’ll be asked to confirm. Your '+RY_PRICE+' / month subscription then stops renewing, so you’re never charged twice.</p></span></div>':'')+
      '<div class="dr-foot"><button class="lt-save" type="button" data-a="memAthNext">'+(v==='new'?'Create my RYSEON account':'Accept & Connect')+'</button></div>';
  } else if(st==='account'){
    h+='<div class="mb-hero sm"><h3 class="mb-hl">Create your<br>RYSEON account.</h3><p class="sub">You need a RYSEON account to accept '+esc(who)+'’s invitation.</p></div>'+
      '<div style="display:flex;flex-direction:column;gap:10px"><button class="btn btn-quiet btn-auth" type="button" data-a="memAthNext">'+I.apple+'Continue with Apple</button><button class="btn btn-quiet btn-auth" type="button" data-a="memAthNext">'+I.google+'Continue with Google</button><button class="btn btn-quiet btn-auth" type="button" data-a="memAthNext">'+I.mail+'Continue with email</button></div>'+
      '<p class="note">Your RYSEON account is yours. '+esc(who)+' never owns it or can change it.</p>';
  } else if(st==='confirm'){
    h+='<div class="mb-hero sm"><h3 class="mb-hl">Switch to<br>VANTAGE coverage?</h3><p class="sub">Your RYSEON membership will be covered by '+esc(who)+'’s VANTAGE plan.</p></div>'+
      '<div class="set"><div><span class="t">Now<small>RYSEON · paid by you</small></span><span class="v">'+RY_PRICE+' / month</span></div><div><span class="t">After you confirm<small>Included with VANTAGE</small></span><span class="v">£0.00</span></div></div>'+
      '<p class="note">Your current subscription stops renewing, so you’re never charged twice. You keep RYSEON without a break. Nothing in your account changes.</p>'+
      '<div class="dr-foot"><button class="lt-save" type="button" data-a="memAthNext">Confirm & Connect</button></div>';
  } else if(st==='share'){
    var p=o.p;
    h+='<div class="mb-hero sm"><h3 class="mb-hl">Choose what<br>'+esc(who)+' can see.</h3><p class="sub">You stay in control. You can change this or end the connection at any time in RYSEON.</p></div>'+
      '<div class="set mb-perm">'+PERM_LABELS.map(function(x){var on=!!p[x[0]];return '<button type="button" data-a="memPerm" data-k="'+x[0]+'" aria-pressed="'+on+'"><span class="t">'+x[1]+(x[0]==='health'||x[0]==='medical'?'<small>Private unless you turn it on</small>':'')+'</span><span class="msw'+(on?' on':'')+'"><i></i></span></button>'}).join('')+'</div>'+
      '<div class="dr-foot"><button class="lt-save" type="button" data-a="memAthNext">Connect with '+esc(who)+'</button></div>';
  } else if(st==='done'){
    h+='<div class="state" style="gap:14px;margin-top:10px"><div class="orbit done"><span class="ring"></span><span class="ring"></span><span class="ring"></span><span class="ava" style="--h:'+(inv?inv.h:210)+'">'+esc(inv?(inv.first[0]||'')+(inv.last[0]||''):'')+'</span><span class="ok">'+I.check+'</span></div></div>'+
      '<div class="card focus"><div class="mb-row"><span class="mlabel acc">RYSEON Membership</span><span class="pill blue"><span class="dot"></span>Active</span></div><p class="mb-name" style="margin-top:12px">Included with VANTAGE</p><p class="sub" style="font-size:14px;margin-top:6px">Your RYSEON membership is included through '+esc(who)+'’s VANTAGE membership.</p></div>'+
      '<p class="note">'+(o.v==='trial'?'Your free trial has moved to VANTAGE coverage. You won’t be charged '+RY_PRICE+'.':o.v==='paying'?'Your own '+RY_PRICE+' subscription has stopped renewing. You won’t be charged twice.':'You won’t be charged for RYSEON while this is active.')+'</p>'+
      '<div class="dr-foot"><button class="lt-save" type="button" data-a="memAthDone">Back to VANTAGE</button></div>';
  } else if(st==='ending'){
    var a=covA();
    h+='<div class="card"><div class="mb-row"><span class="mlabel acc">RYSEON Membership</span><span class="pill">Ending</span></div><p class="mb-name" style="margin-top:12px">Included with VANTAGE</p>'+
      '<p class="sub" style="font-size:14px;margin-top:6px">Your RYSEON membership through VANTAGE ends on '+dl(MEM.sub.ends)+'.</p></div>'+
      '<div class="card focus"><span class="mlabel acc">Continue with RYSEON</span><p class="mb-name" style="margin-top:10px">'+RY_PRICE+' <span>/ month</span></p><p class="sub" style="font-size:14px;margin-top:6px">Your account, profile, progress, training, health and learning history, videos and development data all stay with you.</p></div>'+
      '<div class="dr-foot"><button class="lt-save" type="button" data-a="memBack">Continue with RYSEON · '+RY_PRICE+' / month</button></div>';
  }
  return h+'</div>'}

/* ---------- Manage connection ---------- */
function connSheet(){var a=covA();
  return '<div class="sheet-h"><span class="mlabel">'+esc(nm(a))+'</span><button class="iconbtn" type="button" data-a="closeOv" aria-label="Close">'+I.x+'</button></div><div class="sheet-b">'+
    '<div class="set"><div><span class="t">Connection<small>Permission-based · '+esc(a.first)+' decides what you see</small></span><span class="v">Connected</span></div>'+
    '<div><span class="t">RYSEON membership<small>Included with your VANTAGE plan</small></span><span class="v">Covered</span></div>'+
    '<div><span class="t">Shared with you<small>'+PERM_LABELS.filter(function(x){return P(a.id)[x[0]]}).map(function(x){return x[1]}).join(' · ')+'</small></span></div></div>'+
    '<button class="btn btn-quiet btn-sm" type="button" data-a="memOpenA">Open '+esc(a.first)+'’s development</button>'+
    '<button class="btn btn-sim btn-sm" type="button" data-a="memRevoke"><span class="sim-k">Prototype</span>'+esc(a.first)+' ends the connection</button>'+
    '<p class="note">Only '+esc(a.first)+' can change what is shared. Ending your VANTAGE membership doesn’t delete anything in '+esc(a.first)+'’s RYSEON account.</p></div>'}
function cancelSheet(){var a=covA(),e=MEM.sub.renew;
  return '<div class="sheet-h"><span class="mlabel">Cancel VANTAGE</span><button class="iconbtn" type="button" data-a="closeOv" aria-label="Close">'+I.x+'</button></div><div class="sheet-b">'+
    '<h2 class="rp-h" style="font-size:24px">Cancel your VANTAGE membership?</h2>'+
    '<p class="sub" style="font-size:14.5px">Your VANTAGE membership and included RYSEON athlete membership will remain active until '+dl(e)+'.</p>'+
    (a?'<p class="sub" style="font-size:14.5px">'+esc(a.first)+' will be notified that their VANTAGE-funded RYSEON coverage is ending. '+esc(a.first)+' can continue with RYSEON for '+RY_PRICE+' / month and keeps all their data.</p>':'')+
    '<button class="btn btn-quiet" type="button" data-a="memCancel">Cancel VANTAGE</button><button class="btn btn-primary" type="button" data-a="closeOv">Keep VANTAGE</button></div>'}

/* ---------- connection for the athlete who accepted (same record as every other VANTAGE connection) ---------- */
function connect(inv,perms){var id='mem'+Date.now();
  DIRECTORY[id]={id:id,first:inv.first,last:inv.last||' ',g:'x',age:16,club:'Kingsbridge FC Academy',team:'U16',pos:'Central Midfielder',ps:'CM',ryid:'RY-'+(600000+Math.floor(Math.random()*399999)),h:inv.h,city:'London'};
  ensureFull(id);var a=ATHLETES[id];a.lvl=0;a.drive=48;a.dt=0;a.m={c:50,i:46,l:52,p:44,h:47,r:49};a.lvh=[['Bronze','Joined RYSEON',MON[TODAY.getMonth()]+' '+TODAY.getFullYear()]];a.since=dkey(TODAY);
  S.cons.push({a:id,st:'connected',rel:roleLabel(S.role),p:perms,since:dkey(TODAY),via:'vantage'});
  MEM.cov={a:id,st:'active',since:new Date(TODAY)};inv.st='accepted';MEM.inv=null;MEM.incoming=null;MEM.note=null}
function activate(){MEM.sub={st:'active',start:new Date(TODAY),renew:addM(TODAY,1),ends:null};
  if(MEM.incoming){var inc=MEM.incoming;var p={};PERM_LABELS.forEach(function(x){p[x[0]]=DEF_PERMS[x[0]]});connect(inc,p)}}

/* ---------- overlays ---------- */
var _ro=renderOv;
renderOv=function(){var o=S.ov;if(!o) return _ro();
  if(o.t==='mem') return '<div class="fullscr" role="dialog" aria-label="Membership">'+memScreen()+'</div>';
  if(o.t==='minv') return '<div class="fullscr" role="dialog" aria-label="Invite an Athlete">'+inviteScreen(o)+'</div>';
  if(o.t==='math') return '<div class="fullscr mb-athfs" role="dialog" aria-label="Athlete view">'+athView(o)+'</div>';
  var sh=o.t==='mbuy'?buySheet():o.t==='mqr'?qrSheet():o.t==='mconn'?connSheet():o.t==='mcancel'?cancelSheet():null;
  if(sh) return '<div class="scrim" data-a="scrim"><div class="sheet sm" role="dialog" aria-modal="true">'+sh+'</div></div>';
  return _ro()};
var _r=render;render=function(top){_r(top);fillQR()};

/* ---------- actions ---------- */
function toMem(){S.ov={t:'mem',back:null};render()}
function shareInv(){var inv=MEM.inv,url='https://'+link(),txt=S.user+' invited you to connect through RYSEON VANTAGE. Your RYSEON membership is included:';
  if(navigator.share){navigator.share({title:'RYSEON VANTAGE',text:txt,url:url}).catch(function(){})}else copyInv()}
function copyInv(){var url='https://'+link();try{navigator.clipboard.writeText(url).then(function(){toast('Link copied')},function(){toast('Link copied')})}catch(e){toast('Link copied')}}
document.addEventListener('click',function(e){var t=e.target.closest('[data-a]');if(!t) return;var a=t.getAttribute('data-a'),d=t.dataset,o=S.ov;
  if(a.indexOf('mem')!==0) return;e.stopImmediatePropagation();
  switch(a){
    case 'memOpen': S.ov={t:'mem',back:null};render();break;
    case 'memBack': if(o&&o.t==='math'&&o.step==='ending'){S.ov={t:'mem'};render();break} S.ov=o&&o.back?o.back:(o&&o.t==='mem'?null:{t:'mem'});render();break;
    case 'memBuy': S.ov={t:'mbuy',back:{t:'mem'}};render();break;
    case 'memPay': activate();S.ov={t:'mem'};render();toast(covA()?'VANTAGE active · '+covA().first+' connected':'VANTAGE is active');break;
    case 'memInvite': S.ov={t:'minv',f:{first:'',last:''},back:{t:'mem'}};render();break;
    case 'memShare': case 'memCopy': case 'memMail': case 'memQR':
      if(o&&o.t==='minv'){if(!ensureInvite(o.f)){toast('Add the athlete’s first name');break}}
      if(!MEM.inv) break;
      if(a==='memQR'){S.ov={t:'mqr',back:o};render();break}
      if(o&&o.t==='minv') render();
      if(a==='memShare') shareInv();else if(a==='memCopy') copyInv();
      else location.href='mailto:?subject='+encodeURIComponent('Connect with '+S.user+' on RYSEON VANTAGE')+'&body='+encodeURIComponent(S.user+' invited you to connect through RYSEON VANTAGE. Your RYSEON membership is included: https://'+link());
      break;
    case 'memInvCancel': MEM.inv=null;render();toast('Invitation cancelled');break;
    case 'memAthView': S.ov={t:'math',step:'invite',v:'new',inv:MEM.inv,back:{t:'mem'}};render(true);break;
    case 'memAthV': o.v=d.v;render();break;
    case 'memAthNext':
      if(o.step==='invite') o.step=o.v==='new'?'account':(o.v==='paying'?'confirm':'share');
      else if(o.step==='account'||o.step==='confirm') o.step='share';
      else if(o.step==='share'){connect(o.inv,o.p);o.step='done'}
      if(o.step==='share'&&!o.p){o.p={};PERM_LABELS.forEach(function(x){o.p[x[0]]=DEF_PERMS[x[0]]})}
      var fs=document.querySelector('.fullscr:not(.closing) .dr-body');render();if(fs) fs.scrollTop=0;break;
    case 'memPerm': o.p[d.k]=o.p[d.k]?0:1;render();break;
    case 'memAthDone': S.ov={t:'mem'};render();toast(covA().first+' accepted · RYSEON included');break;
    case 'memAthEnd': S.ov={t:'math',step:'ending',back:{t:'mem'}};render();break;
    case 'memConn': S.ov={t:'mconn',back:{t:'mem'}};render();break;
    case 'memOpenA': var id=MEM.cov.a;S.ov=null;go('athlete',{id:id,t:'overview'});break;
    case 'memRevoke': var c=conOf(MEM.cov.a);MEM.revokedName=A(MEM.cov.a).first;if(c){c.st='ended';c.p={}}MEM.cov=null;MEM.note='revoked';S.ov={t:'mem'};render();break;
    case 'memCancelAsk': S.ov={t:'mcancel',back:{t:'mem'}};render();break;
    case 'memCancel': MEM.sub.st='cancelling';MEM.sub.ends=MEM.sub.renew;if(MEM.cov) MEM.cov.st='active';S.ov={t:'mem'};render();toast('VANTAGE ends on '+dl(MEM.sub.ends));break;
    case 'memResume': MEM.sub.st='active';MEM.sub.ends=null;render();toast('VANTAGE will renew');break;
    case 'memJump': jump(d.s);render();break;
  }
},true);
/* closing a membership sheet returns to the screen it was opened from */
document.addEventListener('click',function(e){var o=S.ov;if(!o||['mbuy','mqr','mconn','mcancel'].indexOf(o.t)<0) return;var t=e.target.closest('[data-a]');if(!t) return;var a=t.getAttribute('data-a');
  if(a==='closeOv'||(a==='scrim'&&e.target===t)){e.stopImmediatePropagation();S.ov=o.back||null;render()}},true);
document.addEventListener('input',function(e){var k=e.target.getAttribute('data-in'),o=S.ov;if(!o||o.t!=='minv') return;
  if(k==='miFirst'){o.f.first=e.target.value;var s=document.querySelector('.mb-send');if(s) s.classList.toggle('off',!o.f.first.trim())}
  else if(k==='miLast') o.f.last=e.target.value});
/* prototype: jump straight to any membership state */
function jump(s){var demo={first:'Luka',last:'Horvat',h:214};
  if(MEM.cov){var c=conOf(MEM.cov.a);if(c&&c.via==='vantage') S.cons.splice(S.cons.indexOf(c),1)}
  MEM.cov=null;MEM.inv=null;MEM.incoming=null;MEM.note=null;
  if(s==='inactive'){MEM.sub={st:'none'};return}
  if(s==='incoming'){MEM.sub={st:'none'};MEM.incoming={first:'Luka',last:'Horvat',h:214,dir:'in',token:tok()};return}
  if(s==='expired'){MEM.sub={st:'expired',ends:new Date(TODAY.getTime()-5*864e5)};return}
  MEM.sub={st:'active',start:addM(TODAY,-2),renew:addM(TODAY,1),ends:null};
  if(s==='pending'){MEM.inv={token:tok(),first:demo.first,last:demo.last,at:new Date(TODAY.getTime()-864e5),st:'pending',h:demo.h,dir:'out'}}
  if(s==='connected'||s==='cancelling'){var p={};PERM_LABELS.forEach(function(x){p[x[0]]=DEF_PERMS[x[0]]});connect({first:demo.first,last:demo.last,h:demo.h},p)}
  if(s==='cancelling'){MEM.sub.st='cancelling';MEM.sub.ends=MEM.sub.renew}
  if(s==='revoked'){MEM.note='revoked';MEM.revokedName='Luka'}}
var _ls=loadScenario;loadScenario=function(k){_ls(k);MEM.sub={st:'none'};MEM.cov=null;MEM.inv=null;MEM.incoming=null;MEM.note=null};
render(true);
})();
