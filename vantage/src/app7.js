/* ============================================================
   VANTAGE — Progress (day-by-day charts, like RYSEON's Progress tab)
   and Health (live injury report on RYSEON's 3D body, photos,
   documents, therapy & massage schedule).
   Parent & private coach can add a therapy or massage + location.
   Agent: view only. Everything here needs the athlete's sharing.
   All values are illustrative prototype data.
   ============================================================ */
ATABS=[['overview','Overview'],['progress','Progress'],['schedule','Schedule'],['health','Health'],['development','Development'],['learning','Learning'],['reports','Reports'],['access','Access']];
function canAddTher(){return S.role==='parent'||S.role==='coach'}
var PROG7={per:'week'};
function hhmm(m){m=((m%1440)+1440)%1440;return pad(Math.floor(m/60))+':'+pad(m%60)}
function hmin(m){return Math.floor(m/60)+'h '+pad(Math.round(m%60))+'m'}

/* ---------- injuries (shared by the athlete in RYSEON) ---------- */
var INJ={
  mateo:{key:'hamstring|left',part:'Left hamstring',type:'Muscle strain',start:-6,est:21,where:'Team training · sprint drill',stage:'Recovering',avail:'Modified training',
    note:'Physio assessment recorded by Oliver: grade 1 strain. Return to full training expected in about three weeks.',
    pain:[7,6,5,5,4,3,3],
    log:[[0,'09:40','Light jogging done without pain. Mobility routine completed.'],[-1,'18:10','Physio session: soft-tissue work and light strengthening.'],[-3,'20:05','Soreness down to 4/10. Walking normally.'],[-5,'12:30','Ultrasound scan done at the club.'],[-6,'18:45','Felt tightness during a sprint in team training. Stopped the session.']],
    photos:[[-6,'Back of left thigh'],[-3,'Swelling check']],docs:[['Physio report','PDF',-5],['Ultrasound scan','Image',-5]]},
  josip:{key:'ankle|right',part:'Right ankle',type:'Ligament sprain',start:-3,est:14,where:'Match · tackle',stage:'Recovering',avail:'Unavailable',
    note:'Club doctor’s note recorded by Josip: mild sprain, no fracture. Rest and physio, then gradual return.',
    pain:[8,7,6,5],log:[[0,'08:15','Swelling going down. Able to put weight on it.'],[-1,'16:00','Physio session and ice.'],[-3,'17:20','Twisted the ankle in a tackle. Left the match at 61′.']],
    photos:[[-3,'Right ankle'],[-1,'Swelling check']],docs:[['Doctor’s note','PDF',-2]]},
  matej:{key:'kneelig|left',part:'Left knee',type:'Ligament irritation',start:-10,est:18,where:'Team training · change of direction',stage:'Back in training',avail:'Modified training',
    note:'Club medical team note recorded by Matej: irritation of the medial ligament. Modified training with load control.',
    pain:[5,5,4,4,3,3,2,2,2,1],log:[[0,'11:30','Full team warm-up completed. No pain.'],[-2,'15:00','Physio and strength session.'],[-10,'12:10','Knee felt unstable after a quick turn.']],
    photos:[[-10,'Left knee']],docs:[['MRI report','PDF',-8],['MRI scan','Image',-8]]}
};
function injOf(id){var j=INJ[id];if(!j) return null;return j}
function injDay(j){return -j.start+1}

/* ---------- therapy & massage schedule ---------- */
var THER=[]; // {id,a,k,time,dur,type,loc,by,note}
var TT=['Physio','Massage','Cryotherapy','Hydrotherapy','Stretching','Osteopath'];
KIND['Massage']='r';KIND['Cryotherapy']='r';KIND['Hydrotherapy']='r';KIND['Stretching']='r';KIND['Osteopath']='r';KIND['Modified Training']='t';
function seedTher(){
  THER=[];var n=0;function add(a,off,time,dur,type,loc,by){THER.push({id:'t'+(++n),a:a,k:dkey(addDays(TODAY,off)),time:time,dur:dur,type:type,loc:loc,by:by})}
  add('mateo',-5,'10:00',30,'Physio','Kingsbridge medical room','Club physio');add('mateo',-3,'17:00',45,'Physio','Physio Plus Wimbledon','Oliver');add('mateo',-1,'18:10',45,'Physio','Physio Plus Wimbledon','Oliver');
  add('mateo',1,'17:00',45,'Physio','Physio Plus Wimbledon','Oliver');add('mateo',4,'17:00',45,'Physio','Physio Plus Wimbledon','Club physio');
  add('luka',2,'19:00',40,'Massage','Elite Sports Massage Putney','James');add('nika',3,'18:30',40,'Massage','Northern Sports Recovery','Jenna');
  add('josip',-1,'16:00',45,'Physio','NK Sava medical room','Club physio');add('josip',1,'16:00',45,'Physio','NK Sava medical room','Club physio');add('josip',2,'18:00',20,'Cryotherapy','Cryo Zagreb','Josip');
  add('matej',-2,'15:00',50,'Physio','HNK Adria medical centre','Club physio');add('matej',2,'14:00',50,'Physio','HNK Adria medical centre','Club physio');add('matej',3,'19:30',40,'Massage','Rijeka Sports Clinic','Matej');
  add('marko',2,'19:00',45,'Massage','Split Sports Recovery','Marko');add('filip',1,'13:00',45,'Hydrotherapy','Drava recovery pool','Filip');
}
seedTher();

/* injury changes the schedule: no team training or matches until return; modified sessions instead */
var _ev7=eventsFor;
eventsFor=function(id,d){
  var l=_ev7(id,d),j=INJ[id],k=dkey(d),hs=!!P(id).health;
  if(j&&hs){
    var s=addDays(TODAY,j.start),e=addDays(TODAY,j.start+j.est);
    if(d>=s&&d<e){
      var full=j.stage==='Back in training';
      l=l.filter(function(x){return x.k!=='m'&&(full||!/Team Training|Match Preparation|Gym|Individual Training/.test(x.type))});
      if(!full&&d.getDay()!==0&&j.avail!=='Unavailable') l.push({a:id,date:d,type:'Modified Training',time:'16:30',dur:45,note:'Rehab programme',k:'t'});
    }
  }
  THER.forEach(function(t){if(t.a===id&&t.k===k&&(hs||t.by==='you'||!/Physio|Osteopath/.test(t.type))) l.push({a:id,date:d,type:t.type,time:t.time,dur:t.dur,note:t.loc+(t.by==='you'?' · Added by you':''),k:'r',ther:t.id,tby:t.by})});
  return l.sort(function(p,q){return p.time<q.time?-1:(p.time>q.time?1:0)});
};

/* ---------- daily data, consistent with the shared schedule ---------- */
function nightOf(id,d){ // the night before morning d
  var a=ATHLETES[id],h=hash(id+'n'+dkey(d)),young=a.age<17;
  var bed=(young?22*60+15:22*60+50)+Math.round((h-.5)*70),wake=(young?6*60+50:7*60+20)+Math.round((hash(id+'w'+dkey(d))-.5)*50);
  var dow=d.getDay();if(dow===0||dow===6){bed+=40;wake+=55}
  if(id==='matej'&&(dkey(d)===dkey(addDays(TODAY,-3))||dkey(d)===dkey(addDays(TODAY,-4)))){bed+=95}
  var dur=wake+1440-bed;return {bed:bed,wake:wake,dur:dur}
}
function dayTrain(id,d){var ev=_baseEvents?eventsFor(id,d):[];var team=0,ind=0,rpe=0,n=0,match=0;
  ev.forEach(function(e){if(e.k==='m'){match+=e.dur}else if(e.k==='t'){if(/Team|Match Prep/.test(e.type)) team+=e.dur;else ind+=e.dur;n++;rpe+=5.5+hash(id+e.type+dkey(d))*3}});
  if(match){n++;rpe+=7+hash(id+'m'+dkey(d))*2}
  return {team:team,ind:ind,match:match,rpe:n?Math.round(rpe/n*10)/10:0,n:n}}
function dayDisc(id,d){var ev=eventsFor(id,d).filter(function(e){return e.k!=='m'}),pl=ev.length,a=ATHLETES[id],miss=0;
  ev.forEach(function(e,i){if(hash(id+'dc'+dkey(d)+i)>a.m.c/100+.08) miss++});if(d>TODAY) return {pl:pl,done:0,fut:1};if(sameDay(d,TODAY)){var nowM=nowMin();var done=ev.filter(function(e){var t=e.time.split(':');return (+t[0])*60+(+t[1])+e.dur<nowM}).length;return {pl:pl,done:done,today:1}}
  return {pl:pl,done:pl-miss}}
function daySteps(id,d){var t=dayTrain(id,d);return Math.round(5200+hash(id+'st'+dkey(d))*3600+(t.team+t.ind+t.match)*34)}
function dayRec(id,d){var t=dayTrain(id,d),n=nightOf(id,d),sc=(n.dur-420)/60*1.2-(t.team+t.ind+t.match)/90+hash(id+'rc'+dkey(d))*1.4;return sc>1?'Good':(sc>-.4?'Normal':'Low')}
function days(per){var out=[],i,n=per==='week'?7:30;for(i=n-1;i>=0;i--) out.push(addDays(TODAY,-i));return out}

/* ---------- chart: bars with a value on every bar ---------- */
function vbars(series,labels,o){
  o=o||{};var n=labels.length,W=600,H=o.h||200,pl=30,pr=6,pt=22,pb=24,bw=(W-pl-pr)/n;
  var tot=labels.map(function(_,i){return series.reduce(function(s,x){return s+(x.v[i]||0)},0)});
  var mx=o.max||Math.max.apply(null,tot.concat([1]))*1.12,tick=o.tick||nt7(mx),top=Math.ceil(mx/tick)*tick,y=function(v){return pt+(H-pt-pb)*(1-v/top)};
  var g='';for(var v=0;v<=top+1e-9;v+=tick){g+='<line class="gl'+(v===0?' base':'')+'" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+y(v)+'" y2="'+y(v)+'"/><text class="gt" x="'+(pl-6)+'" y="'+(y(v)+3.5)+'" text-anchor="end">'+(o.fmt?o.fmt(v):v)+'</text>'}
  var b='',w=Math.max(4,Math.min(o.bw||34,bw*.62));
  for(var i=0;i<n;i++){var x=pl+bw*i+(bw-w)/2,acc=0;
    series.forEach(function(s,si){var val=s.v[i]||0;if(!val) return;var y0=y(acc),y1=y(acc+val);b+='<rect x="'+x.toFixed(1)+'" y="'+y1.toFixed(1)+'" width="'+w.toFixed(1)+'" height="'+Math.max(1,y0-y1).toFixed(1)+'" rx="'+(n>12?2:5)+'" class="sb '+(o.cls?o.cls[si]:'s'+si)+(o.hi===i?' hi':'')+'"/>';acc+=val});
    if(o.lab!==false&&tot[i]>0&&(n<=12||i%5===4||i===n-1)) b+='<text class="vl" x="'+(x+w/2)+'" y="'+(y(tot[i])-6)+'">'+(o.vfmt?o.vfmt(tot[i],i):tot[i])+'</text>';
    if(o.empty&&!tot[i]) b+='<text class="lb" x="'+(x+w/2)+'" y="'+(y(0)-6)+'">'+o.empty+'</text>';
    if(n<=12||i%5===0||i===n-1) b+='<text class="lb'+(o.hi===i?' on':'')+'" x="'+(x+w/2)+'" y="'+(H-6)+'">'+esc(labels[i])+'</text>'}
  if(o.avg!=null){var ya=y(o.avg);b+='<line class="avgl" x1="'+pl+'" x2="'+(W-pr)+'" y1="'+ya+'" y2="'+ya+'"/>'}
  return '<div class="chart pchart"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(o.label||'Chart')+'">'+g+b+'</svg>'+
    (series.length>1||o.legend?'<div class="plg">'+series.map(function(s,si){return '<span><i class="'+(o.cls?o.cls[si]:'s'+si)+'"></i>'+esc(s.n)+'</span>'}).join('')+(o.avg!=null?'<span><i class="avg"></i>'+esc(o.avgLabel||'Average')+'</span>':'')+'</div>':'')+'</div>';
}
function pstats(L){return '<div class="pstats">'+L.map(function(x){return '<div><b>'+x[0]+'</b><small>'+esc(x[1])+'</small></div>'}).join('')+'</div>'}
function psec(t,sub,body,id){return '<section class="psec"'+(id?' id="'+id+'"':'')+'><h3 class="pg-h">'+esc(t)+'</h3>'+(sub?'<p class="pg-hs">'+esc(sub)+'</p>':'')+body+'</section>'}
function lockline(a,what){return '<div class="lockbox" style="margin-top:12px">'+I.lock+'<span><b>'+esc(what)+' not shared</b><p>'+esc(a.first)+' hasn’t shared this with you.</p></span></div>'}

/* ---------- PROGRESS tab ---------- */
function tabProgress(a,p){
  var per=PROG7.per,id=a.id,D=days(per==='year'?'month':per),lab,todayI=-1;
  var h='<div class="ptopbar"><div class="seg" role="tablist" aria-label="Period">'+[['week','Week'],['month','Month'],['year','Year']].map(function(x){return '<button type="button" role="tab" data-a="p7per" data-p="'+x[0]+'" aria-selected="'+(per===x[0])+'">'+x[1]+'</button>'}).join('')+'</div>'+
    '<span class="muted" style="font-size:13px">'+(per==='week'?'Last 7 days':(per==='month'?'Last 30 days':'Last 12 months'))+'</span></div>';
  if(per==='week'){lab=D.map(function(d){return fmt(d,'dow3')});D.forEach(function(d,i){if(sameDay(d,TODAY)) todayI=i})}
  else if(per==='month'){lab=D.map(function(d){return String(d.getDate())});todayI=29}
  var past=D.filter(function(d){return d<=TODAY});
  /* indices */
  if(p.development){
    var idx=[['Discipline',Math.round(a.m.c*.6+a.m.h*.4),a.dt>0?'Improving':'Stable'],['Consistency',a.m.c,a.dt>2?'Improving':'Stable'],['Recovery',a.m.r,id==='matej'||INJ[id]?'Monitor':'Stable'],['Football learning',a.m.l,'Improving']];
    h+=psec('Development indices',null,'<div class="pg-idx">'+idx.map(function(x){return '<div><span class="n">'+x[0]+'</span><b>'+x[1]+'</b><span class="tr '+x[2].toLowerCase()+'">'+(x[2]==='Improving'?'↑ ':(x[2]==='Monitor'?'• ':'→ '))+x[2]+'</span></div>'}).join('')+'</div>');
  }
  /* discipline per day */
  if(p.development&&p.schedule){
    if(per==='year'){var dv=[],dl=[];for(var mi=11;mi>=0;mi--){var md=new Date(TODAY.getFullYear(),TODAY.getMonth()-mi,1);dl.push(MON[md.getMonth()].slice(0,3));dv.push(Math.min(99,Math.round(a.m.c-(mi*a.dt*.35)+(hash(id+'y'+mi)-.5)*6)))}
      h+=psec('Discipline','Planned activities completed, per month',vbars([{n:'Completed',v:dv}],dl,{max:100,tick:25,vfmt:function(v){return v+'%'},fmt:function(v){return v+'%'},label:'Discipline per month',hi:11}));}
    else{var dd=D.map(function(d){return dayDisc(id,d)}),done=dd.reduce(function(s,x){return s+(x.fut?0:x.done)},0),pl=dd.reduce(function(s,x){return s+(x.fut?0:x.pl)},0);
      h+=psec('Discipline',done+' of '+pl+' planned activities completed',vbars([{n:'Completed',v:dd.map(function(x){return x.done})},{n:x0('Missed'),v:dd.map(function(x){return x.fut?0:Math.max(0,x.pl-x.done-(x.today?x.pl-x.done:0))})},{n:'Planned',v:dd.map(function(x){return x.fut||x.today?x.pl-x.done:0})}],lab,{cls:['s0','sx','s2'],tick:1,h:180,vfmt:function(v,i){var x=dd[i];return x.fut?x.pl:x.done+'/'+x.pl},label:'Planned vs completed per day',hi:todayI,bw:28}));}
  } else h+=psec('Discipline',null,lockline(a,'Development'));
  /* training */
  if(p.training){
    if(per==='year'){var tw=[],tl=[];for(var m2=11;m2>=0;m2--){var md2=new Date(TODAY.getFullYear(),TODAY.getMonth()-m2,1);tl.push(MON[md2.getMonth()].slice(0,3));tw.push(Math.round((a.tpl==='pro'?36:28)*(.8+hash(id+'tm'+m2)*.35)*(m2===0?.7:1)))}
      h+=psec('Training','Training hours per month',vbars([{n:'Hours',v:tw}],tl,{vfmt:function(v){return v+'h'},label:'Training hours per month',hi:11}));}
    else{var tr=past.map(function(d){return dayTrain(id,d)}),all=D.map(function(d){return d<=TODAY?dayTrain(id,d):{team:0,ind:0,match:0,rpe:0,n:0}});
      var tm=tr.reduce(function(s,x){return s+x.team+x.ind},0),sess=tr.reduce(function(s,x){return s+x.n},0),rp=tr.filter(function(x){return x.rpe}),avgR=rp.length?(rp.reduce(function(s,x){return s+x.rpe},0)/rp.length).toFixed(1):'—',hi=tr.filter(function(x){return x.rpe>=7.5}).length;
      h+=psec('Training',per==='week'?'Minutes per day, last 7 days':'Minutes per day, last 30 days',pstats([[String(sess),'Sessions'],[hmin(tm),'Total training'],[avgR,'Average RPE'],[String(hi),'High-load days']])+
        vbars([{n:'Team',v:all.map(function(x){return x.team})},{n:'Individual',v:all.map(function(x){return x.ind})},{n:'Match',v:all.map(function(x){return x.match})}],lab,{cls:['s0','s1','sm'],h:200,label:'Training minutes per day',hi:todayI,empty:per==='week'?'–':''})+
        (per==='week'?'<div class="rpe-row"><span class="mlabel">RPE</span>'+all.map(function(x,i){return '<span class="'+(x.rpe>=7.5?'hi':'')+'">'+(D[i]>TODAY?'':(x.rpe?x.rpe:'–'))+'</span>'}).join('')+'</div><p class="note" style="margin-top:6px">RPE is the effort '+esc(a.first)+' rates after each session, from 1 to 10.</p>':''));}
  } else h+=psec('Training',null,lockline(a,'Training'));
  /* matches */
  if(p.matches){var pm=pastMatches(id,per==='week'?2:(per==='month'?5:12)),mins=pm.reduce(function(s,m){return s+m.mins},0);
    h+=psec('Match activity',null,pstats([[String(pm.length),'Matches'],[String(mins),'Minutes played'],[pm.length?Math.round(mins/pm.length)+'′':'—','Average minutes'],[pm.length?(pm.reduce(function(s,m){return s+m.rpe},0)/pm.length).toFixed(1):'—','Match RPE']])+
      (pm.length?'<div class="rows" style="margin-top:8px">'+pm.slice(0,4).map(function(m){return '<div class="r"><span class="ic">'+I.pitch+'</span><span class="t"><b>'+(m.ha==='Away'?'@ ':'vs ')+esc(m.opp)+'</b><small>'+fmt(m.date,'d mon')+' · '+m.mins+' min · RPE '+m.rpe+'</small></span><span class="v"><span class="res-w">'+m.res+'</span> '+m.score+'</span></div>'}).join('')+'</div>':'<p class="note">No matches in this period.</p>'));
  }
  /* sleep */
  if(p.sleep){
    if(per==='year'){var sv=[],sl2=[];for(var m3=11;m3>=0;m3--){var md3=new Date(TODAY.getFullYear(),TODAY.getMonth()-m3,1);sl2.push(MON[md3.getMonth()].slice(0,3));sv.push(Math.round((a.age<17?8.3:7.8+(hash(id+'sy'+m3)-.5)*.6)*10)/10)}
      h+=psec('Sleep','Average sleep per month',vbars([{n:'Sleep',v:sv}],sl2,{max:10,tick:2.5,fmt:function(v){return v+'h'},vfmt:function(v){return v+'h'},label:'Sleep per month',hi:11}));}
    else{var nights=past.map(function(d){return nightOf(id,d)}),nv=D.map(function(d){return d<=TODAY?Math.round(nightOf(id,d).dur/6)/10:0}),avgS=nights.reduce(function(s,x){return s+x.dur},0)/nights.length,
        reg=nights.filter(function(x){return Math.abs(x.bed-nights[0].bed)<45}).length;
      h+=psec('Sleep',per==='week'?'Every night, last 7 days':'Every night, last 30 days',pstats([[hmin(avgS),'Average sleep'],[hmin(Math.max.apply(null,nights.map(function(x){return x.dur}))),'Longest night'],[hmin(Math.min.apply(null,nights.map(function(x){return x.dur}))),'Shortest night'],[reg+' of '+nights.length,'Regular bedtime']])+
        vbars([{n:'Sleep',v:nv}],lab,{max:11,tick:2,fmt:function(v){return v+'h'},vfmt:function(v){var m=Math.round(v*60);return Math.floor(m/60)+'h'+(per==='week'?' '+pad(m%60):'')},avg:Math.round(avgS/6)/10,avgLabel:'Average '+hmin(avgS),legend:1,label:'Sleep per night',hi:todayI,bw:30})+
        (per==='week'?'<div class="nights">'+D.map(function(d){if(d>TODAY) return '';var n=nightOf(id,d);return '<div><span class="d">'+fmt(d,'dow3')+'</span><span class="bw">'+hhmm(n.bed)+' → '+hhmm(n.wake)+'</span><span class="bar"><i style="left:'+((n.bed-1260)/840*100).toFixed(1)+'%;width:'+(n.dur/840*100).toFixed(1)+'%"></i></span><b>'+hmin(n.dur)+'</b></div>'}).join('')+'</div>':''));
      /* recovery */
      var recs=past.map(function(d){return dayRec(id,d)}),cnt={Good:0,Normal:0,Low:0};recs.forEach(function(r){cnt[r]++});
      h+=psec('Recovery','Recovery state each day',pstats([[String(cnt.Good),'Good days'],[String(cnt.Normal),'Normal days'],[String(cnt.Low),'Low days']])+
        '<div class="recrow'+(per==='month'?' m':'')+'">'+D.map(function(d,i){if(d>TODAY) return '<span class="fut"><i></i><small>'+lab[i]+'</small></span>';var r=dayRec(id,d);return '<span class="'+r.toLowerCase()+'" title="'+fmt(d,'dow')+': '+r+'"><i></i>'+(per==='week'||i%5===4?'<small>'+lab[i]+'</small>':'')+'</span>'}).join('')+'</div>'+
        '<div class="plg"><span><i class="rc good"></i>Good</span><span><i class="rc normal"></i>Normal</span><span><i class="rc low"></i>Low</span></div>');
      /* activity */
      var st=D.map(function(d){return d<=TODAY?daySteps(id,d):0});
      h+=psec('Activity','From Apple Health',vbars([{n:'Steps',v:st}],lab,{h:160,vfmt:function(v){return (v/1000).toFixed(1)+'k'},fmt:function(v){return v>=1000?(v/1000)+'k':v},label:'Steps per day',hi:todayI,bw:26})+
        '<div class="rows" style="margin-top:6px">'+[['Resting heart rate',Math.round(48+hash(id+'rhr')*8)+' bpm'],['HRV',Math.round(58+hash(id+'hrv')*24)+' ms'],['Active energy per day',Math.round(420+hash(id+'kc')*220)+' kcal']].map(function(r){return '<div class="r"><span class="t"><b>'+r[0]+'</b></span><span class="v">'+r[1]+'</span></div>'}).join('')+'</div>');
      h+=psec('Wellbeing','Self-reported each morning',vbars([{n:'Fatigue',v:D.map(function(d){return d<=TODAY?2+Math.round(hash(id+'fa'+dkey(d))*5):0})}],lab,{h:140,max:10,tick:5,label:'Fatigue per day (1–10)',hi:todayI,legend:1,bw:22})+
        '<div class="rows">'+[['Soreness',INJ[id]?'Moderate':'Low'],['General feeling',a.m.r>65?'Good':'Okay']].map(function(r){return '<div class="r"><span class="t"><b>'+r[0]+'</b></span><span class="v">'+r[1]+'</span></div>'}).join('')+'</div>');
    }
  } else h+=psec('Sleep & recovery',null,lockline(a,'Sleep & Recovery'));
  h+='<p class="note" style="margin-top:20px">Sources: RYSEON logs, Apple Health and self-reported check-ins, as shared by '+esc(a.first)+'. VANTAGE doesn’t draw medical conclusions.</p>';
  return h;
}
function x0(s){return s}

/* ---------- 3D body (RYSEON's model, read-only, injured area highlighted) ---------- */
var BODY_SRC='media/body3d.bin',B7={};
function bodyData(){
  if(B7.data) return Promise.resolve(B7.data);
  var p=window.BODY_B64?Promise.resolve(Uint8Array.from(atob(window.BODY_B64),function(c){return c.charCodeAt(0)}).buffer):fetch(BODY_SRC).then(function(r){return r.arrayBuffer()});
  return p.then(function(buf){var u=new Uint8Array(buf),dv=new DataView(buf),hl=dv.getUint32(0,true),head=JSON.parse(new TextDecoder().decode(u.subarray(4,4+hl))),o=4+hl;
    var pos=new Uint16Array(buf.slice(o,o+head.posBytes)),ind=new Uint16Array(buf.slice(o+head.posBytes,o+head.posBytes+head.indBytes));return B7.data={head:head,pos:pos,ind:ind}});
}
function three(){if(B7.T) return Promise.resolve(B7.T);return import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js').then(function(T){return B7.T=T})}
function mountBody(cv,keys){
  if(B7.raf) cancelAnimationFrame(B7.raf);
  Promise.all([three(),bodyData()]).then(function(r){
    var T=r[0],D=r[1],H=D.head;if(!document.body.contains(cv)) return;
    var R=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
    var sc=new T.Scene(),cam=new T.PerspectiveCamera(28,1,.05,20),mn=H.bmin,mx=H.bmax,dq=function(q,a){return mn[a]+q/65535*(mx[a]-mn[a])};
    function build(f){var vs=0,is=0,list=[];H.parts.forEach(function(p,k){if(f(p)){list.push(k);vs+=p.nv;is+=p.ni}});
      var P=new Float32Array(vs*3),I2=new Uint32Array(is),S2=new Float32Array(vs),vo=0,io=0;
      list.forEach(function(k){var p=H.parts[k],hit=keys.indexOf(p.id+'|'+(p.side||''))>=0?1:0;for(var v=0;v<p.nv;v++){for(var a=0;a<3;a++)P[(vo+v)*3+a]=dq(D.pos[(p.vo+v)*3+a],a);S2[vo+v]=hit}for(var j=0;j<p.ni;j++)I2[io+j]=D.ind[p.io+j]+vo;vo+=p.nv;io+=p.ni});
      var g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(P,3));g.setAttribute('hit',new T.BufferAttribute(S2,1));g.setIndex(new T.BufferAttribute(I2,1));g.computeVertexNormals();g.computeBoundingSphere();return g}
    var vsh='attribute float hit; varying vec3 vN; varying vec3 vV; varying float vS; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.0); vV=normalize(-mv.xyz); vS=hit; gl_Position=projectionMatrix*mv; }';
    var fsh='varying vec3 vN; varying vec3 vV; varying float vS; uniform vec3 base; uniform vec3 glow; uniform float t; void main(){ vec3 n=normalize(vN); if(!gl_FrontFacing) n=-n; float l=max(dot(n,normalize(vec3(-0.3,0.55,0.8))),0.0)*0.8+0.2; float f=pow(1.0-max(dot(n,vV),0.0),2.0); vec3 c=(base*l+glow*f*1.25)*(1.0-0.5*step(0.5,0.0)); if(vS>0.5){ float p=0.75+0.25*sin(t*3.2); vec3 r=vec3(1.0,0.26,0.27); c=r*(0.35+0.65*l)*p+vec3(1.0,0.7,0.7)*f*0.8; } else { c*=0.62; } gl_FragColor=vec4(c,1.0); }';
    var mat=new T.ShaderMaterial({vertexShader:vsh,fragmentShader:fsh,uniforms:{base:{value:new T.Color(.05,.16,.34)},glow:{value:new T.Color(.32,.78,1)},t:{value:0}},side:T.DoubleSide});
    var skin=new T.ShaderMaterial({vertexShader:'varying vec3 vN; varying vec3 vV; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.0); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',fragmentShader:'varying vec3 vN; varying vec3 vV; void main(){ float f=pow(1.0-abs(dot(normalize(vN),vV)),3.0); gl_FragColor=vec4(vec3(0.35,0.8,1.0)*f*0.7,f*0.35); }',transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide});
    var gm=build(function(p){return p.sys==='muscular'||p.sys==='joints'}),gs=build(function(p){return p.sys==='skin'});
    var grp=new T.Group();grp.add(new T.Mesh(gm,mat));var ms=new T.Mesh(gs,skin);ms.renderOrder=2;grp.add(ms);
    var wire=new T.LineSegments(new T.WireframeGeometry(gm),new T.LineBasicMaterial({color:0x6FD3FF,transparent:true,opacity:.1,blending:T.AdditiveBlending,depthWrite:false}));grp.add(wire);sc.add(grp);
    var ctr=gs.boundingSphere.center.clone(),hgt=mx[1]-mn[1];
    // aim at the injured area
    var tgt=null;H.parts.forEach(function(p,k){if(!tgt&&keys.indexOf(p.id+'|'+(p.side||''))>=0){var sx=0,sy=0,sz=0;for(var v=0;v<p.nv;v++){sx+=dq(D.pos[(p.vo+v)*3],0);sy+=dq(D.pos[(p.vo+v)*3+1],1);sz+=dq(D.pos[(p.vo+v)*3+2],2)}tgt={x:sx/p.nv,y:sy/p.nv,z:sz/p.nv}}});
    var back=tgt&&tgt.z<ctr.z-0.01;
    var st={yaw:back?Math.PI:0,pitch:.03,dist:hgt*2.75,ty:0,auto:true};B7.st=st;
    function size(){var w=cv.clientWidth,h2=cv.clientHeight;if(!w||!h2) return;R.setSize(w,h2,false);cam.aspect=w/h2;cam.updateProjectionMatrix()}size();
    var drag=null;cv.onpointerdown=function(e){drag={x:e.clientX,y:e.clientY};st.auto=false;cv.setPointerCapture(e.pointerId)};
    cv.onpointermove=function(e){if(!drag) return;st.yaw-=(e.clientX-drag.x)*.0105;st.pitch=Math.max(-1,Math.min(1,st.pitch+(e.clientY-drag.y)*.006));drag={x:e.clientX,y:e.clientY}};
    cv.onpointerup=cv.onpointercancel=function(){drag=null;clearTimeout(B7.it);B7.it=setTimeout(function(){st.auto=true},6000)};
    cv.onwheel=function(e){e.preventDefault();st.dist=Math.max(hgt*.8,Math.min(hgt*4,st.dist*(e.deltaY>0?1.1:.9)))};
    B7.setView=function(v){st.auto=false;st.yaw=v==='back'?Math.PI:(v==='side'?Math.PI/2:0)};
    var t0=performance.now();
    (function loop(t){if(!document.body.contains(cv)) return;size();if(st.auto) st.yaw+=.0035*Math.sin((t-t0)/4000)*0;mat.uniforms.t.value=(t-t0)/1000;
      var x=ctr.x+Math.sin(st.yaw)*Math.cos(st.pitch)*st.dist,y=ctr.y+st.ty+Math.sin(st.pitch)*st.dist,z=ctr.z+Math.cos(st.yaw)*Math.cos(st.pitch)*st.dist;
      cam.position.set(x,y,z);cam.lookAt(ctr.x,ctr.y+st.ty,ctr.z);R.render(sc,cam);B7.raf=requestAnimationFrame(loop)})(t0);
    var m=cv.parentNode.querySelector('.b7-msg');if(m) m.remove();
  }).catch(function(){var m=cv.parentNode.querySelector('.b7-msg');if(m) m.textContent='The 3D body needs an internet connection.'});
}

/* ---------- HEALTH tab ---------- */
function photoTile(seed,label,off){return '<button type="button" class="ph7" data-a="p7photo" data-l="'+esc(label)+'" style="--h1:'+(200+seed*17)%360+'"><span class="ph7-i"></span><span class="ph7-t"><b>'+esc(label)+'</b><small>'+fmt(addDays(TODAY,off),'d mon')+'</small></span></button>'}
function tabHealth(a,p){
  if(!p.health) return '<div class="shield" style="margin-bottom:14px">'+I.lock.replace('<svg','<svg style="width:30px;height:30px"')+'<span><b>Health isn’t shared</b><p>'+esc(a.first)+' hasn’t shared health and injury information with you. Only '+esc(a.first)+' can turn this on in RYSEON.</p></span></div>';
  var j=injOf(a.id),h='';
  if(j){
    var day=injDay(j),pct=Math.min(100,Math.round(day/j.est*100)),lastU=j.log[0];
    h+='<div class="inj-hero"><div class="inj-top"><span class="live"><i></i>Live · shared by '+esc(a.first)+'</span><span class="muted" style="font-size:12.5px">Updated '+(lastU[0]===0?'today '+lastU[1]:fmt(addDays(TODAY,lastU[0]),'rel'))+'</span></div>'+
      '<h3>'+esc(j.part)+'</h3><p class="inj-ty">'+esc(j.type)+' · '+esc(j.where)+'</p>'+
      '<div class="inj-st"><span class="pill '+(j.stage==='Back in training'?'blue':'warn')+'"><span class="dot"></span>'+esc(j.stage)+'</span><span class="pill">'+esc(j.avail)+'</span></div>'+
      '<div class="inj-prog"><div class="lbl"><span>Day '+day+' of about '+j.est+'</span><span>Expected return '+fmt(addDays(TODAY,j.start+j.est),'d mon')+'</span></div><div class="bar"><i style="width:'+pct+'%"></i></div></div></div>';
    h+='<div class="b7"><canvas class="b7-cv" id="b7cv"></canvas><span class="b7-msg">Loading 3D body…</span><div class="b7-tag"><i></i>'+esc(j.part)+'</div><div class="b7-v">'+[['front','Front'],['side','Side'],['back','Back']].map(function(x){return '<button type="button" data-a="b7v" data-v="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div></div>';
    h+='<div class="rp-foot" style="margin-top:12px">'+I.info+'<span>'+esc(j.note)+' RYSEON doesn’t diagnose; it shows what '+esc(a.first)+' recorded.</span></div>';
    h+=psec('Soreness','Self-reported each morning, 0–10',vbars([{n:'Soreness',v:j.pain}],j.pain.map(function(_,i){return 'D'+(i+1)}),{h:150,max:10,tick:5,label:'Soreness per day',hi:j.pain.length-1,bw:24}));
    h+=psec('Updates',null,'<div class="tl" style="margin-top:6px">'+j.log.map(function(l,i){return '<div class="it '+(i===0?'r':'')+'"><span class="tm">'+l[1]+'<small>'+fmt(addDays(TODAY,l[0]),'rel')+'</small></span><span class="mk"></span><span><b>'+esc(l[2])+'</b><p>'+esc(a.first)+'</p></span></div>'}).join('')+'</div>');
    h+=psec('Photos',j.photos.length+' shared by '+a.first,'<div class="ph7-grid">'+j.photos.map(function(x,i){return photoTile(i+a.h,x[1],x[0])}).join('')+'</div>');
    h+=psec('Medical documents',null,p.medical?'<div class="rows">'+j.docs.map(function(dc){return '<div class="r"><span class="ic">'+I.doc+'</span><span class="t"><b>'+esc(dc[0])+'</b><small>'+dc[1]+' · '+fmt(addDays(TODAY,dc[2]),'d mon')+'</small></span><span class="v muted" style="font-size:13px;font-weight:500">View</span></div>'}).join('')+'</div>':
      '<div class="lockbox">'+I.lock+'<span><b>Medical documents not shared</b><p>'+esc(a.first)+' keeps medical documents private. Only '+esc(a.first)+' can share them from RYSEON.</p></span></div>');
  } else {
    h+='<div class="inj-hero ok"><div class="inj-top"><span class="live"><i></i>Live · shared by '+esc(a.first)+'</span></div><h3>No active injury</h3><p class="inj-ty">Fully available for training and matches.</p></div>';
  }
  /* therapy & massage schedule */
  var mine=THER.filter(function(t){return t.a===a.id}).sort(function(x,y){return x.k<y.k?-1:(x.k>y.k?1:(x.time<y.time?-1:1))});
  var up=mine.filter(function(t){return t.k>=dkey(TODAY)}),pastT=mine.filter(function(t){return t.k<dkey(TODAY)}).reverse();
  var rowT=function(t){var d=parseK(t.k);return '<div class="r'+(t.by==='you'?' mine':'')+'"><span class="ic">'+CI.heart+'</span><span class="t"><b>'+esc(t.type)+' · '+t.time+'</b><small>'+fmt(d,'rel')+' · '+t.dur+' min · '+esc(t.loc)+'</small><small class="by">'+(t.by==='you'?'Added by you':'Added by '+esc(t.by))+'</small></span>'+(t.by==='you'?'<button class="rp-x" type="button" data-a="therDel" data-x="'+t.id+'" aria-label="Remove">'+CI.trash+'</button>':'')+'</div>'};
  h+=psec('Therapy & massage',up.length?up.length+' upcoming':'Nothing planned',
    (up.length?'<div class="rows ther">'+up.map(rowT).join('')+'</div>':'')+
    (canAddTher()?'<button class="cal-add" type="button" data-a="therOpen" data-id="'+a.id+'" style="margin-top:12px">'+CI.plus+'Add therapy or massage</button>':'<p class="note" style="margin-top:10px">View only.</p>')+
    (pastT.length?'<details class="pastT"><summary>Past sessions · '+pastT.length+'</summary><div class="rows ther">'+pastT.map(rowT).join('')+'</div></details>':''));
  return h;
}

/* ---------- add therapy / massage (parent & private coach) ---------- */
function therSheet(o){
  var f=o.f,ids=liveIds(),ok=f.a&&f.time&&f.k&&f.loc.trim();
  var locs=uniq(THER.filter(function(t){return t.a===f.a}).map(function(t){return t.loc})).slice(0,3);
  return '<div class="dr-top"><button class="lt-back" type="button" data-a="therBack" aria-label="Back">'+I.left+'</button><h2>Therapy or massage</h2><span style="width:46px"></span></div><div class="dr-body">'+
    (ids.length>1?'<section class="rgroup"><h4>Athlete</h4><div class="tags-a">'+ids.map(function(id){var a=A(id);return '<button type="button" class="tag-a" data-a="tA" data-id="'+id+'" aria-pressed="'+(f.a===id)+'">'+ava(a)+'<span><b>'+esc(a.first)+'</b><small>'+(INJ[id]&&P(id).health?esc(INJ[id].part):esc(a.ps))+'</small></span><i>'+I.check+'</i></button>'}).join('')+'</div></section>':'')+
    '<section class="rgroup"><h4>Type</h4><div class="chips wrap">'+TT.map(function(t){return '<button class="chip" type="button" data-a="tType" data-v="'+t+'" aria-pressed="'+(f.type===t)+'">'+t+'</button>'}).join('')+'</div></section>'+
    '<section class="rgroup"><h4>When</h4><div class="rp-g">'+
      '<label class="rp-item fld"><span class="ri">'+CI.cal+'</span><span class="t"><b>Date</b></span><input id="t-date" type="date" data-in="tDate" value="'+f.k+'" min="'+dkey(TODAY)+'"></label>'+
      '<label class="rp-item fld"><span class="ri">'+CI.up+'</span><span class="t"><b>Start</b></span><input id="t-time" type="time" data-in="tTime" value="'+f.time+'" step="900"></label></div>'+
      '<div class="chips wrap" style="margin-top:10px">'+[20,30,45,60,90].map(function(m){return '<button class="chip" type="button" data-a="tDur" data-v="'+m+'" aria-pressed="'+(f.dur===m)+'">'+m+' min</button>'}).join('')+'</div></section>'+
    '<section class="rgroup"><h4>Location</h4><div class="rp-g"><label class="rp-item fld"><span class="ri">'+CI.pin+'</span><input id="t-loc" type="text" data-in="tLoc" placeholder="Clinic, spa or address" value="'+esc(f.loc)+'"></label></div>'+
      (locs.length?'<div class="chips wrap" style="margin-top:10px">'+locs.map(function(l){return '<button class="chip" type="button" data-a="tLocQ" data-v="'+esc(l)+'">'+esc(l)+'</button>'}).join('')+'</div>':'')+'</section>'+
    '<section class="rgroup"><h4>Note · optional</h4><div class="rp-g"><label class="rp-item fld"><span class="ri">'+CI.play+'</span><input id="t-note" type="text" data-in="tNote" placeholder="e.g. bring the physio report" value="'+esc(f.note)+'"></label></div></section>'+
    '<p class="note" style="margin-top:14px">'+(f.a?esc(A(f.a).first)+' sees it in the RYSEON calendar.':'')+'</p>'+
    '<div class="dr-foot"><button class="lt-save" type="button" data-a="therSave"'+(ok?'':' disabled')+'>'+(ok?'Add '+f.type.toLowerCase():(f.a?'Add a location':'Choose an athlete'))+'</button></div></div>';
}

/* ---------- hooks ---------- */
var _athTab7=athTab;
athTab=function(a,p){if(S.atab==='progress') return tabProgress(a,p);if(S.atab==='health') return tabHealth(a,p);if(S.atab==='performance') {S.atab='progress';return tabProgress(a,p)}return _athTab7(a,p)};
var _renderOv7=renderOv;
renderOv=function(){var o=S.ov;if(o&&o.t==='ther') return '<div class="fullscr" role="dialog" aria-label="Add therapy or massage">'+therSheet(o)+'</div>';
  if(o&&o.t==='photo') return '<div class="scrim" data-a="scrim"><div class="sheet sm" role="dialog"><div class="sheet-h"><span class="mlabel">'+esc(o.l)+'</span><button class="iconbtn" type="button" data-a="closeOv" aria-label="Close">'+I.x+'</button></div><div class="sheet-b"><div class="ph7 big" style="--h1:'+o.h+'"><span class="ph7-i"></span></div><p class="note">Photo shared by the athlete in RYSEON. Prototype placeholder.</p></div></div></div>';
  return _renderOv7()};
/* Home: health notice for shared injuries */
var _viewHome7=viewHome;
viewHome=function(){var h=_viewHome7(),inj=liveIds().filter(function(id){return INJ[id]&&P(id).health});if(!inj.length) return h;
  var block='<div class="reqs rise d1">'+inj.map(function(id){var a=A(id),j=INJ[id];return '<button type="button" class="hnote" data-a="openA" data-id="'+id+'" data-t="health"><span class="hn-i"></span>'+ava(a)+'<span class="t"><b>'+esc(a.first)+' · '+esc(j.part)+'</b><small>'+esc(j.stage)+' · '+esc(j.avail)+' · day '+injDay(j)+' of ~'+j.est+'</small></span><span class="live sm"><i></i>Live</span>'+I.chev+'</button>'}).join('')+'</div>';
  var i=h.indexOf('<div class="wk-wrap');return i<0?h:h.slice(0,i)+block+h.slice(i)};
/* athlete header: availability pill */
var _viewAthlete7=viewAthlete;
viewAthlete=function(){var h=_viewAthlete7(),j=INJ[S.aid];if(j&&P(S.aid).health) h=h.replace('<span class="pill solid">','<span class="pill warn"><span class="dot"></span>'+esc(j.avail)+'</span><span class="pill solid">');return h};
var _render7=render;
render=function(top){_render7(top);var cv=document.getElementById('b7cv');if(cv){var j=INJ[S.aid];mountBody(cv,j?[j.key]:[])}};
/* calendar: parents can add therapy; coaches training + therapy */
var _daySheet7=daySheet;
daySheet=function(o){var h=_daySheet7(o),d=parseK(o.k);if(d<TODAY||!canAddTher()) return h;
  var row=rrow({ic:CI.heart,l:'Add therapy or massage',sub:'Physio, massage, recovery · with location',act:'therOpen',attr:' data-k="'+o.k+'"'});
  if(canAdd()){var q=h.lastIndexOf('</div></section></div>');return q<0?h:h.slice(0,q)+row+h.slice(q)}
  return h.replace('<p class="note" style="margin-top:18px">View only. Each athlete shares this schedule from RYSEON.</p>',rgroup('Plan this day',[row]))};
var _calSheet7=calSheet;
calSheet=function(o){var h=_calSheet7(o);if(canAdd()||!canAddTher()) return h;
  return h.replace('<p class="note" style="text-align:center;margin-top:4px">View only. Athletes share their schedule from RYSEON.</p>','<button class="cal-add" type="button" data-a="therOpen" data-k="'+dkey(TODAY)+'">'+CI.plus+'Add therapy or massage</button>')};
/* scenario data: who shares health */
var _loadScenario7=loadScenario;
loadScenario=function(k){_loadScenario7(k);seedTher();
  S.cons.forEach(function(c){if(k==='parent2'){if(c.a==='mateo') c.p.medical=1}
    if(k==='coach5'&&(c.a==='josip'||c.a==='luka')) c.p.health=1;
    if(k==='agent10'&&c.a==='matej') c.p.health=1})};

/* ---------- actions ---------- */
function newTher(k,id){var ids=liveIds();return {a:id||(S.view==='athlete'&&ids.indexOf(S.aid)>=0?S.aid:(ids.length===1?ids[0]:null)),k:k&&k>=dkey(TODAY)?k:dkey(addDays(TODAY,1)),time:'18:00',dur:45,type:'Massage',loc:'',note:''}}
document.addEventListener('click',function(e){
  var t=e.target.closest('[data-a]');if(!t) return;var a=t.getAttribute('data-a'),d=t.dataset,o=S.ov;
  switch(a){
    case 'p7per': PROG7.per=d.p;render();break;
    case 'b7v': if(B7.setView) B7.setView(d.v);break;
    case 'p7photo': S.ov={t:'photo',l:d.l,h:t.style.getPropertyValue('--h1')};render();break;
    case 'therOpen': if(!canAddTher()) break;S.ov={t:'ther',f:newTher(d.k,d.id),back:o};render();break;
    case 'therBack': S.ov=o.back||null;render();break;
    case 'tA': o.f.a=d.id;render();break;
    case 'tType': o.f.type=d.v;render();break;
    case 'tDur': o.f.dur=+d.v;render();break;
    case 'tLocQ': o.f.loc=d.v;render();break;
    case 'therSave': var f=o.f;if(!f.a||!f.loc.trim()) break;
      THER.push({id:'u'+Date.now(),a:f.a,k:f.k,time:f.time,dur:f.dur,type:f.type,loc:f.loc.trim(),note:f.note.trim(),by:'you'});
      S.ov=o.back&&o.back.t==='day'?{t:'day',k:f.k,back:o.back.back}:null;render();toast(f.type+' added for '+A(f.a).first+' · '+fmt(parseK(f.k),'rel')+' '+f.time);break;
    case 'therDel': THER=THER.filter(function(x){return x.id!==d.x});render();toast('Removed');break;
  }
});
document.addEventListener('input',function(e){var t=e.target,k=t.getAttribute('data-in'),o=S.ov;if(!o||o.t!=='ther') return;
  if(k==='tDate'&&t.value){o.f.k=t.value;render()}else if(k==='tTime'&&t.value) o.f.time=t.value;
  else if(k==='tLoc'){o.f.loc=t.value;var b=document.querySelector('[data-a=therSave]');if(b){var ok=o.f.a&&t.value.trim();b.disabled=!ok;b.textContent=ok?'Add '+o.f.type.toLowerCase():(o.f.a?'Add a location':'Choose an athlete')}}
  else if(k==='tNote') o.f.note=t.value});
/* re-apply scenario sharing for the scenario loaded at start */
if(S.scn&&SCENARIOS[S.scn]) S.cons.forEach(function(c){if(S.scn==='parent2'&&c.a==='mateo') c.p.medical=1;if(S.scn==='coach5'&&(c.a==='josip'||c.a==='luka')) c.p.health=1;if(S.scn==='agent10'&&c.a==='matej') c.p.health=1});
render(true);

function nt7(m){var t=[1,2,2.5,5,10,20,25,50,100,200,250,500,1000,2000,2500,5000,10000];for(var i=0;i<t.length;i++) if(m/t[i]<=5) return t[i];return 20000}
