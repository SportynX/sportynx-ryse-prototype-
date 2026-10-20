/* ============================================================
   VANTAGE prototype data — fictional athletes, clubs and values.
   Schedules, matches and reports are generated relative to today
   so the prototype always reads as current.
   ============================================================ */
var LEVELS=['Bronze','Silver','Gold','High Performance','Excellence'];

var ATHLETES={
  luka:{first:'James',last:'Smith',g:'m',age:17,club:'Kingsbridge FC Academy',team:'U18',pos:'Central Midfielder',ps:'CM',play:'Youth Academy',lvl:2,ryid:'RY-418273',h:222,city:'London',opp:['Hartley Rovers U18','Thornbury Town U18','Ashcombe United U18','Whitmore Athletic U18','Langford City U18','Redbridge Albion U18','Elmstead U18','Northgate Town U18'],tpl:'youth',off:0,mday:6,mtime:'11:00',drive:74,dt:+5,
    m:{c:81,i:72,l:78,p:70,h:76,r:66},since:'2026-03-14',
    lvh:[['Bronze','Joined RYSEON','Sep 2025'],['Silver','Sustained for 8 weeks','Jan 2026'],['Gold','Sustained for 12 weeks','Jul 2026']],
    ins:'Training load increased this week while sleep remained consistent. Recovery remained balanced.'},
  petra:{first:'Petra',last:'Šimić',g:'f',age:15,club:'ŽNK Sava Zagreb',team:'U15 Girls',pos:'Left Winger',ps:'LW',play:'Youth Academy',lvl:1,ryid:'RY-523904',h:204,city:'Zagreb',tpl:'youth',off:-30,mday:0,mtime:'10:00',drive:61,dt:+4,
    m:{c:66,i:62,l:71,p:55,h:58,r:63},since:'2026-05-02',
    lvh:[['Bronze','Joined RYSEON','Feb 2026'],['Silver','Sustained for 8 weeks','Aug 2026']],
    ins:'Football learning time doubled compared with last week. Training attendance stayed steady.'},
  mateo:{first:'Jenna',last:'Smith',g:'f',age:19,club:'Kingsbridge FC Women',team:'Senior Women',opp:['Hartley Rovers Women','Thornbury Town Women','Ashcombe United Women','Whitmore Athletic Women','Langford City Women','Redbridge Albion Women','Elmstead Women','Northgate Town Women'],pos:'Left Winger',ps:'LW',play:'Semi-professional',lvl:1,ryid:'RY-523911',h:196,city:'London',tpl:'youth',off:-30,mday:0,mtime:'10:00',drive:63,dt:+4,
    m:{c:68,i:61,l:73,p:56,h:60,r:64},since:'2026-05-02',
    lvh:[['Bronze','Joined RYSEON','Feb 2026'],['Silver','Sustained for 8 weeks','Aug 2026']],
    ins:'Football learning time doubled compared with last week. Training attendance stayed steady.'},
  marko:{first:'Marko',last:'Babić',g:'m',age:19,club:'HNK Jadran Split',team:'First Team',pos:'Striker',ps:'ST',play:'Professional',lvl:3,ryid:'RY-305617',h:230,city:'Split',tpl:'pro',off:0,mday:6,mtime:'17:00',drive:82,dt:+3,
    m:{c:86,i:80,l:74,p:85,h:84,r:78},since:'2025-11-20',
    lvh:[['Bronze','Joined RYSEON','Jan 2025'],['Silver','Sustained for 8 weeks','Apr 2025'],['Gold','Sustained for 12 weeks','Sep 2025'],['High Performance','Sustained for 16 weeks','May 2026']],
    ins:'Match preparation routine was completed before every fixture this month. Sleep was shorter after the evening cup match.'},
  toni:{first:'Toni',last:'Vuković',g:'m',age:17,club:'NK Drava Osijek',team:'U19',pos:'Centre-Back',ps:'CB',play:'Youth Academy',lvl:2,ryid:'RY-611480',h:212,city:'Osijek',tpl:'youth',off:30,mday:6,mtime:'13:00',drive:70,dt:0,
    m:{c:74,i:66,l:69,p:72,h:71,r:68},since:'2026-02-09',
    lvh:[['Bronze','Joined RYSEON','Oct 2025'],['Silver','Sustained for 8 weeks','Feb 2026'],['Gold','Sustained for 12 weeks','Aug 2026']],
    ins:'A steady week. Training and learning followed the usual pattern with no missed sessions.'},
  ana:{first:'Ana',last:'Kovač',g:'f',age:18,club:'ŽNK Adria Rijeka',team:'Senior Women',pos:'Goalkeeper',ps:'GK',play:'Semi-professional',lvl:2,ryid:'RY-274091',h:236,city:'Rijeka',tpl:'pro',off:420,mday:0,mtime:'16:00',drive:77,dt:+6,
    m:{c:79,i:83,l:72,p:76,h:74,r:80},since:'2026-01-18',
    lvh:[['Bronze','Joined RYSEON','Jun 2025'],['Silver','Sustained for 8 weeks','Oct 2025'],['Gold','Sustained for 12 weeks','Apr 2026']],
    ins:'Self-initiated individual sessions increased this month. Recovery days were planned around both matches.'},
  josip:{first:'Josip',last:'Perić',g:'m',age:15,club:'NK Sava Zagreb',team:'U16',pos:'Right-Back',ps:'RB',play:'Youth Academy',lvl:1,ryid:'RY-688125',h:198,city:'Zagreb',tpl:'youth',off:-60,mday:6,mtime:'09:30',drive:58,dt:+7,
    m:{c:60,i:57,l:64,p:52,h:56,r:61},since:'2026-06-03',
    lvh:[['Bronze','Joined RYSEON','Mar 2026'],['Silver','Sustained for 8 weeks','Sep 2026']],
    ins:'Consistency improved for the third week in a row. Bedtimes were more regular on school nights.'},
  filip:{first:'Filip',last:'Novak',g:'m',age:21,club:'NK Drava Osijek',team:'First Team',pos:'Attacking Midfielder',ps:'AM',play:'Professional',lvl:4,ryid:'RY-120994',h:226,city:'Osijek',tpl:'pro',off:30,mday:0,mtime:'15:00',drive:88,dt:0,
    m:{c:91,i:88,l:84,p:90,h:92,r:86},since:'2025-08-30',
    lvh:[['Bronze','Joined RYSEON','Feb 2024'],['Silver','Sustained for 8 weeks','May 2024'],['Gold','Sustained for 12 weeks','Oct 2024'],['High Performance','Sustained for 16 weeks','Apr 2025'],['Excellence','Sustained for 24 weeks','Mar 2026']],
    ins:'Development behaviour remained very stable. Video analysis was completed within 24 hours of each match.'},
  dario:{first:'Dario',last:'Jurić',g:'m',age:16,club:'HNK Jadran Split',team:'U17',pos:'Defensive Midfielder',ps:'DM',play:'Youth Academy',lvl:0,ryid:'RY-734456',h:214,city:'Split',tpl:'youth',off:0,mday:6,mtime:'10:30',drive:49,dt:+8,
    m:{c:52,i:48,l:58,p:44,h:47,r:50},since:'2026-09-21',
    lvh:[['Bronze','Joined RYSEON','Aug 2026']],
    ins:'First full month in RYSEON. Daily check-ins became a habit over the last two weeks.'},
  matej:{first:'Matej',last:'Horvat',g:'m',age:20,club:'HNK Adria Rijeka',team:'First Team',pos:'Left-Back',ps:'LB',play:'Professional',lvl:3,ryid:'RY-209733',h:218,city:'Rijeka',tpl:'pro',off:0,mday:6,mtime:'19:00',drive:80,dt:-2,
    m:{c:82,i:76,l:70,p:83,h:81,r:74},since:'2025-12-05',
    lvh:[['Bronze','Joined RYSEON','Nov 2024'],['Silver','Sustained for 8 weeks','Feb 2025'],['Gold','Sustained for 12 weeks','Jul 2025'],['High Performance','Sustained for 16 weeks','Jan 2026']],
    ins:'Two travel days affected sleep timing this week. Training sessions were all completed.'},
  nika:{first:'Ella',last:'Lennox',g:'f',age:19,club:'Harrow Athletic Women',team:'Senior Women',opp:['Hartley Rovers Women','Thornbury Town Women','Ashcombe United Women','Whitmore Athletic Women','Langford City Women','Redbridge Albion Women','Elmstead Women','Northgate Town Women'],pos:'Centre-Forward',ps:'CF',play:'Semi-professional',lvl:3,ryid:'RY-556802',h:208,city:'Manchester',tpl:'youth',off:60,mday:0,mtime:'14:00',drive:79,dt:+4,
    m:{c:84,i:79,l:81,p:75,h:78,r:73},since:'2026-04-11',
    lvh:[['Bronze','Joined RYSEON','Apr 2025'],['Silver','Sustained for 8 weeks','Jul 2025'],['Gold','Sustained for 12 weeks','Dec 2025'],['High Performance','Sustained for 16 weeks','Sep 2026']],
    ins:'Mental training sessions were added before both matches. Learning time stayed above her monthly average.'}
};
/* RYSEON athletes who are findable but not connected in any scenario */
var DIRECTORY={
  luka2:{first:'Luka',last:'Marin',g:'m',age:17,club:'NK Una Karlovac',team:'U19',pos:'Goalkeeper',ps:'GK',ryid:'RY-447108',h:190,city:'Karlovac'},
  luka3:{first:'Luka',last:'Mihalj',g:'m',age:15,club:'NK Sava Zagreb',team:'U16',pos:'Striker',ps:'ST',ryid:'RY-902215',h:240,city:'Zagreb'},
  mia:{first:'Mia',last:'Tomić',g:'f',age:16,club:'ŽNK Sava Zagreb',team:'U17 Girls',pos:'Central Midfielder',ps:'CM',ryid:'RY-371559',h:202,city:'Zagreb'},
  leon:{first:'Leon',last:'Kralj',g:'m',age:18,club:'NK Drava Osijek',team:'U19',pos:'Winger',ps:'RW',ryid:'RY-664020',h:232,city:'Osijek'},
  bruno:{first:'Bruno',last:'Lovrić',g:'m',age:22,club:'HNK Jadran Split',team:'First Team',pos:'Centre-Back',ps:'CB',ryid:'RY-158347',h:210,city:'Split'},
  karla:{first:'Karla',last:'Babić',g:'f',age:15,club:'ŽNK Adria Rijeka',team:'U16 Girls',pos:'Defender',ps:'CB',ryid:'RY-820473',h:216,city:'Rijeka'}
};
Object.keys(ATHLETES).forEach(function(k){ATHLETES[k].id=k;DIRECTORY[k]=ATHLETES[k]});
Object.keys(DIRECTORY).forEach(function(k){DIRECTORY[k].id=k});

var DEF_PERMS={schedule:1,development:1,training:1,matches:1,sleep:1,learning:1,reports:1,health:0,medical:0};
var PERM_LABELS=[['schedule','Schedule'],['development','Development'],['training','Training'],['matches','Matches'],['sleep','Sleep & Recovery'],['learning','Learning'],['reports','Reports'],['health','Health / Injury'],['medical','Medical Documents']];

/* Scenarios — who the VANTAGE user follows, under which plan */
var SCENARIOS={
  parent1:{label:'Parent · 1 athlete',role:'parent',plan:'individual',user:'Ivan',
    con:[{a:'luka',rel:'Parent',p:{health:1}}]},
  parent2:{label:'Parent · son & daughter (Smith)',role:'parent',plan:'individual',user:'Ivan',
    con:[{a:'luka',rel:'Parent',p:{health:1}},{a:'mateo',rel:'Parent',p:{health:1}}]},
  coach5:{label:'Private coach · 5 athletes',role:'coach',plan:'v5',user:'Ivan',
    con:[{a:'luka',rel:'Private Coach'},{a:'josip',rel:'Private Coach'},{a:'toni',rel:'Private Coach',p:{sleep:0}},{a:'dario',rel:'Private Coach'},{a:'nika',rel:'Private Coach',p:{reports:0}},
      {a:'mia',st:'pending',rel:'Private Coach',ago:2},{a:'leon',st:'declined',rel:'Private Coach'}]},
  agent10:{label:'Agent · 10 athletes',role:'agent',plan:'pro',user:'Ivan',
    con:[{a:'marko',rel:'Agent',p:{sleep:0}},{a:'filip',rel:'Agent'},{a:'matej',rel:'Agent'},{a:'ana',rel:'Agent',p:{learning:0}},{a:'nika',rel:'Agent'},{a:'luka',rel:'Agent',p:{sleep:0,reports:0}},
      {a:'toni',rel:'Agent'},{a:'dario',rel:'Agent'},{a:'josip',rel:'Agent'},{a:'petra',rel:'Agent',p:{sleep:0}},{a:'bruno',st:'ended',rel:'Agent'}]},
  empty:{label:'No athletes connected',role:'parent',plan:'individual',user:'Ivan',con:[]},
  waiting:{label:'Waiting for approval',role:'parent',plan:'individual',user:'Ivan',con:[{a:'luka',st:'pending',rel:'Parent',ago:0}]}
};

var PLANS={
  individual:{name:'VANTAGE Individual',short:'Individual',price:6.9,incl:1,max:3},
  v5:{name:'VANTAGE 5',short:'VANTAGE 5',price:15.9,incl:5,max:9},
  pro:{name:'VANTAGE Professional',short:'Professional',price:25.9,incl:10,max:10}
};
var EXTRA=3.9;

/* ---------- Schedule generation ---------- */
var TPL={
  youth:{
    1:[['Team Training','17:30',90,'NK pitch 2']],
    2:[['Gym','16:00',45,'Academy gym'],['Team Training','17:30',90,'Main pitch']],
    3:[['Video Analysis','16:45',30,'Club video assignment'],['Team Training','17:30',90,'Main pitch']],
    4:[['Individual Training','16:30',60,'Finishing and first touch'],['Football Learning','20:00',20,'RYSEON learning']],
    5:[['Match Preparation','17:00',60,'Team session'],['Sport Meditation','21:00',10,'Pre-match routine']],
    6:[],
    0:[['Recovery','10:00',40,'Light recovery'],['Mobility','18:00',20,'Mobility routine']]
  },
  pro:{
    1:[['Recovery','10:00',60,'Post-match recovery'],['Gym','11:30',50,'Strength block']],
    2:[['Team Training','10:00',100,'Training centre'],['Video Analysis','12:30',40,'Opponent analysis']],
    3:[['Team Training','10:00',90,'Training centre'],['Physio','14:00',30,'Scheduled maintenance']],
    4:[['Team Training','10:00',90,'Training centre'],['Mental Training','15:00',30,'Focus routine']],
    5:[['Match Preparation','10:30',60,'Set pieces'],['Football Learning','18:00',20,'RYSEON learning']],
    6:[],
    0:[['Mobility','11:00',25,'Mobility routine']]
  }
};
var KIND={'Match':'m','Team Training':'t','Individual Training':'t','Gym':'t','Match Preparation':'t','Recovery':'r','Mobility':'r','Physio':'r','Sport Meditation':'r','Video Analysis':'l','Football Learning':'l','Mental Training':'l'};
var OPP={youth:['NK Lika Gospić','NK Una Karlovac','HNK Neretva','NK Velebit','NK Kupa Sisak','NK Mura Čakovec','NK Krka','HNK Cetina'],
  pro:['NK Velebit','HNK Neretva','NK Mura Čakovec','NK Kupa Sisak','HNK Cetina','NK Lika Gospić','NK Una Karlovac','NK Krka']};
var COMP={youth:'Youth League',pro:'Prva Liga'};

function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0)/4294967295}
function addMin(t,m){var p=t.split(':'),x=(+p[0])*60+(+p[1])+m;x=Math.max(0,Math.min(23*60+30,x));return pad(Math.floor(x/60))+':'+pad(x%60)}
function pad(n){return (n<10?'0':'')+n}
var TODAY=new Date();TODAY.setHours(0,0,0,0);
function dkey(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function addDays(d,n){var x=new Date(d);x.setDate(x.getDate()+n);return x}
function weekNo(d){var x=new Date(d);x.setHours(0,0,0,0);return Math.floor((x-new Date(2026,0,5))/6048e5)}
function sameDay(a,b){return dkey(a)===dkey(b)}

/* special one-off events relative to today (keeps the demo varied) */
var SPECIAL={marko:{0:[['Match','18:30',90,'Cup · Round of 16','NK Velebit','Home']]},ana:{0:[['Recovery','09:30',45,'Pool recovery'],['Mobility','17:00',25,'Mobility routine']]},
  filip:{0:[['Recovery','10:00',60,'Post-match recovery'],['Physio','12:00',30,'Scheduled maintenance']]},matej:{0:[['Team Training','10:00',100,'Training centre']]}};

function eventsFor(id,d){
  var a=ATHLETES[id]; if(!a) return [];
  var off=Math.round((d-TODAY)/864e5);
  var sp=SPECIAL[id]&&SPECIAL[id][off];
  var list=[];
  if(sp){ sp.forEach(function(e){list.push(mk(a,d,e[0],e[1],e[2],e[3],e[4],e[5]))}); return sort(list) }
  var dow=d.getDay();
  var tp=dow===a.mday?[]:(TPL[a.tpl][dow]||[]);
  if(a.mday===0&&dow===6) tp=[['Match Preparation','11:00',60,'Team session'],['Sport Meditation','21:00',10,'Pre-match routine']];
  if(a.mday===0&&dow===1) tp=[['Recovery','10:00',45,'Post-match recovery']].concat(a.tpl==='pro'?[['Gym','11:30',50,'Strength block']]:[['Team Training','17:30',90,'Main pitch']]);
  tp.forEach(function(e){
    var t=a.tpl==='pro'?addMin(e[1],a.off>=360?0:a.off):addMin(e[1],a.off);
    if(a.off>=360&&a.tpl==='pro'&&KIND[e[0]]==='t') t=addMin(e[1],420); // evening schedule (semi-pro)
    list.push(mk(a,d,e[0],t,e[2],e[3]));
  });
  // match day: every week except one in four
  var wn=weekNo(d), hasMatch=((wn+a.h)%4)!==0;
  if(dow===a.mday&&hasMatch){
    var OL=a.opp||OPP[a.tpl],opp=OL[(wn+Math.round(a.h/7))%OL.length];
    var home=((wn+a.h)%2)===0;
    list.push(mk(a,d,'Match',a.mtime,90,COMP[a.tpl],opp,home?'Home':'Away'));
    if(a.mday===6&&!(TPL[a.tpl][0]||[]).length) {}
  }
  if(dow===a.mday&&!hasMatch){ list.push(mk(a,d,a.tpl==='pro'?'Team Training':'Individual Training',a.tpl==='pro'?'10:00':'10:30',75,'No fixture this week')) }
  // athletes whose match is on Sunday recover on Monday instead; swap Sunday template for a light day
  return sort(list);
}
function mk(a,d,type,time,dur,note,opp,ha){return {a:a.id,date:d,type:type,time:time,dur:dur,note:note||'',opp:opp,ha:ha,k:KIND[type]}}
function sort(l){return l.sort(function(x,y){return x.time<y.time?-1:1})}
function primary(evs){
  if(!evs.length) return 'Rest';
  if(evs.some(function(e){return e.k==='m'})) return 'Match';
  if(evs.some(function(e){return e.k==='t'})) return 'Training';
  if(evs.some(function(e){return e.k==='r'})) return 'Recovery';
  return 'Learning';
}
function nextMatch(id,from){
  from=from||TODAY;
  for(var i=0;i<28;i++){var d=addDays(from,i);var m=eventsFor(id,d).filter(function(e){return e.k==='m'})[0];if(m) return m}
  return null;
}
function pastMatches(id,n){
  var out=[];
  for(var i=1;i<120&&out.length<n;i++){var d=addDays(TODAY,-i);eventsFor(id,d).forEach(function(e){if(e.k==='m'){
    var r=hash(id+dkey(d)),g1=Math.floor(r*4),g2=Math.floor(hash(dkey(d)+id)*3);
    var mins=r>.2?90:(r>.1?72:61); if(ATHLETES[id].ps==='GK') mins=90;
    e.score=(e.ha==='Home'?g1+'–'+g2:g2+'–'+g1); e.res=g1>g2?'W':(g1<g2?'L':'D'); e.mins=mins; e.rpe=6+Math.round(hash('rpe'+id+dkey(d))*3);
    out.push(e)}})}
  return out;
}

/* ---------- Development / performance series ---------- */
function driveSeries(id,mode){
  var a=ATHLETES[id],n=mode==='week'?7:(mode==='month'?5:12),out=[];
  var step=mode==='week'?a.dt/7:(mode==='month'?a.dt/1.2:a.dt*1.1);
  for(var i=0;i<n;i++){var back=n-1-i;var v=a.drive-step*back/ (mode==='week'?1:1)+ (hash(id+mode+i)-.5)*(mode==='year'?5:3);
    if(mode==='year') v=a.drive-(a.dt*1.6+6)*(back/11)*1.4+(hash(id+'y'+i)-.5)*4;
    out.push(Math.max(20,Math.min(99,Math.round(i===n-1?a.drive:v))))}
  return out;
}
function seriesLabels(mode){
  var out=[],i;
  if(mode==='week'){for(i=6;i>=0;i--) out.push(fmt(addDays(TODAY,-i),'dow1'))}
  else if(mode==='month'){for(i=4;i>=0;i--) out.push(i===0?'This wk':'W-'+i)}
  else {for(i=11;i>=0;i--){var d=new Date(TODAY.getFullYear(),TODAY.getMonth()-i,1);out.push(d.toLocaleString('en-GB',{month:'short'}).slice(0,3))}}
  return out;
}
function trainingWeeks(id){var a=ATHLETES[id],out=[];for(var i=5;i>=0;i--){var base=a.tpl==='pro'?470:390;out.push(Math.round(base+(hash(id+'tw'+i)-.45)*120+(i===0?a.dt*6:0)))}return out}
function sleepNights(id){var a=ATHLETES[id],out=[];var base=a.age<17?8.6:(a.age<19?8.2:7.8);for(var i=6;i>=0;i--){var v=base+(hash(id+'sl'+i)-.5)*1.3;if(id==='matej'&&(i===2||i===3))v-=1.1;if(id==='marko'&&i===0)v-=.9;out.push(Math.round(v*10)/10)}return out}
function hm(h){var m=Math.round(h*60);return Math.floor(m/60)+'h '+pad(m%60)+'m'}
function weekSummary(id){
  var evs=[],start=addDays(TODAY,-((TODAY.getDay()+6)%7));
  for(var i=0;i<7;i++) evs=evs.concat(eventsFor(id,addDays(start,i)));
  var done=evs.filter(function(e){return e.date<=TODAY});
  var tr=done.filter(function(e){return e.k==='t'||e.k==='m'});
  var mins=tr.reduce(function(s,e){return s+e.dur},0);
  var lrn=evs.filter(function(e){return e.k==='l'});
  return {sessions:tr.length,mins:mins,rpe:(6.1+hash(id+'rp')*1.4).toFixed(1),learn:lrn.length,planned:evs.length};
}
var LEARN_LIB=[['Scanning before receiving','Performance',6],['Pressing triggers in midfield','Training',8],['Body shape on the half-turn','Training',5],['Pre-match routine: visualisation','Mindset',7],
  ['Sleep and performance','Performance',6],['Fuelling for a double session','Nutrition',5],['Defending the far post','Training',6],['Handling pressure in front of a crowd','Mindset',9],
  ['How professionals prepare the day before','Pro Insights',7],['Hydration on match day','Nutrition',4],['Breathing reset between phases','Mindset',4],['Counter-pressing in the first five seconds','Training',7]];
var CLUB_VIDEO=['Opponent analysis · weekend fixture','Set-piece responsibilities','Last match: build-up phase','Defensive shape clips'];
function learning(id){
  var a=ATHLETES[id],r=hash(id+'lr');
  var mins=Math.round(55+r*70+(a.m.l-60)),vids=4+Math.floor(r*5),assigned=a.tpl==='pro'?4:3,clubDone=Math.min(assigned,assigned-(r>.6?1:0));
  var items=[];for(var i=0;i<6;i++){var it=LEARN_LIB[Math.floor(hash(id+'li'+i)*LEARN_LIB.length)];items.push({t:it[0],c:it[1],min:it[2],d:addDays(TODAY,-Math.floor(i*1.3)-(i?0:0))})}
  var club=[];for(var j=0;j<assigned;j++) club.push({t:CLUB_VIDEO[j],done:j<clubDone,d:addDays(TODAY,-(j*2+1))});
  return {mins:mins,vids:vids,assigned:assigned,clubDone:clubDone,mental:a.m.p>70?3:2,items:items,club:club,weeks:[0,1,2,3,4,5].map(function(i){return Math.round(mins*(.7+hash(id+'lw'+i)*.5))}).reverse()};
}
function recoveryStatus(id){var a=ATHLETES[id];if(id==='matej') return ['Monitor','Travel affected sleep timing this week'];if(a.m.r>=70) return ['Balanced','Recovery days were completed as planned'];return ['Balanced','Planned recovery sessions completed']}

/* ---------- Reports ---------- */
function reportsFor(id){
  var a=ATHLETES[id],out=[];
  var mon=addDays(TODAY,-((TODAY.getDay()+6)%7)); // this week's Monday
  for(var w=0;w<6;w++){var pub=addDays(mon,-7*w);if(pub>TODAY) continue;
    var end=addDays(pub,-1),start=addDays(pub,-7);
    out.push({id:id+'-w'+w,a:id,type:'Weekly Report',start:start,end:end,pub:pub,title:'Week of '+fmt(start,'d mon')})}
  for(var m=0;m<3;m++){var p=new Date(TODAY.getFullYear(),TODAY.getMonth()-m,1);if(p>TODAY)continue;var s=new Date(p.getFullYear(),p.getMonth()-1,1);
    out.push({id:id+'-m'+m,a:id,type:'Monthly Report',start:s,end:addDays(p,-1),pub:p,title:s.toLocaleString('en-GB',{month:'long',year:'numeric'})})}
  var q=new Date(2026,6,1);
  out.push({id:id+'-d0',a:id,type:'Development Report',start:new Date(2026,3,1),end:addDays(q,-1),pub:q,title:'Q2 2026 · April – June'});
  return out.sort(function(x,y){return y.pub-x.pub});
}

/* ---------- Formatting ---------- */
var DOW=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function fmt(d,f){
  if(!(d instanceof Date)) d=new Date(d);
  if(f==='dow') return DOW[d.getDay()];
  if(f==='dow3') return DOW[d.getDay()].slice(0,3);
  if(f==='dow1') return DOW[d.getDay()].slice(0,3);
  if(f==='d mon') return d.getDate()+' '+MON[d.getMonth()];
  if(f==='d mon y') return d.getDate()+' '+MON[d.getMonth()]+' '+d.getFullYear();
  if(f==='rel'){var o=Math.round((d-TODAY)/864e5);if(o===0)return 'Today';if(o===1)return 'Tomorrow';if(o===-1)return 'Yesterday';if(o>1&&o<7)return DOW[d.getDay()];return DOW[d.getDay()].slice(0,3)+' '+d.getDate()+' '+MON[d.getMonth()]}
  return d.toDateString();
}
