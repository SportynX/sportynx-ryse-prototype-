/* ============================================================
   VANTAGE — Progress, identical to the RYSEON app's Progress tab.
   The helpers, charts, Development Drive card and the data shape
   below are copied from RYSEON (src/prototype.html) so both apps
   render the same components. Only the wording is turned to the
   athlete (third person) and values follow the connected athlete.
   ============================================================ */
(function(){
var CUR=null; // athlete being shown
function SE(){return esc}
function rT(t,o){t=String(t);if(o) for(var k in o) t=t.split('{'+k+'}').join(o[k]);return t}
function rTp(t,n){var r=rT(t,{n:n});return n===1?r.replace(/\b1 (\w+?)(ches|shes|xes|s)\b/,function(_,w,e){return '1 '+w+(e==='s'?'':e.slice(0,-2))}):r}
function locN(){return 'en'}
function fmtN(v){return typeof v==='number'?(Math.round(v*10)/10).toLocaleString('en-GB'):v}
var SI={doc:''};
  var PROG={per:'month',fresh:false};
  /* Development Drive — illustrative prototype values only. The future model must reward meaningful behaviour (not app opens or more training),
     weigh data provenance (verified vs self-reported), detect gaming, and use a longer history than the visible period for long-term commitment. */
  var DRIVE_DIMS=[['consistency','Consistency'],['initiative','Self-initiative'],['learning','Football learning'],['preparation','Preparation'],['habits','Professional habits'],['recovery','Recovery discipline'],['engagement','Development engagement'],['return','Return'],['longterm','Long-term commitment']];
  var DRIVE={week:{v:86,st:'High',d:2,per:'this week',tr:[78,80,81,83,84,85,86],dims:[90,84,79,93,85,80,87,82,89],dd:[2,3,1,0,1,-1,2,0,0],ai:['Your strongest signals this week are preparation and consistency.','Biggest opportunity: football learning between team sessions.']},
    month:{v:84,st:'High',d:6,per:'this month',tr:[72,74,73,76,78,79,82,84],dims:[88,81,76,91,84,79,86,82,89],dd:[4,5,-2,3,2,1,3,6,1],ai:['Your strongest signals this month are consistency and match preparation.','Biggest opportunity: football learning between team sessions.']},
    year:{v:82,st:'High',d:14,per:'this year',tr:[66,68,71,72,74,73,70,76,79,82],dims:[86,78,77,88,82,78,84,85,89],dd:[11,15,9,8,10,6,12,18,14],ai:['Your development behaviour grew steadily all year.','Self-initiative improved the most since spring.']}};
  var PD={
    week:{q:'How did this week go?',sum:'Your week',
      ai:['A solid week: four team sessions plus one extra individual session.','Sleep was steady on training days but shorter before Sunday’s match.','You completed all three videos your club sent you.'],
      chg:[['Individual training','+1 session','up'],['Sleep','−12 min average','down'],['Football learning','+2 videos','up'],['Match minutes','−8 min','down']],
      idx:[['Discipline',84,'Improving','You completed 9 of 10 planned football activities this week.'],['Consistency',79,'Stable','You trained on 5 of 7 days with regular bedtimes on training nights.'],['Recovery',73,'Stable','Recovery stayed Good after your extra session.'],['Football learning',88,'Improving','5 videos completed, including all 3 from your club.']],
      tr:{team:4,ind:1,min:455,rpe:6.9,hi:2,ch:{l:'days',team:[90,90,0,90,75,0,0],ind:[0,0,45,0,0,0,0]}},
      add:{n:1,min:45,br:[['Football',45]]},
      ma:{club:[1,72],nat:null,n:1,min:72,avg:72,rpe:7.5,starts:1,ha:[0,1],ty:[['League',1]],ch:null},
      sl:{avg:415,cons:'Good',d:-12,ch:{l:'days',v:[7.8,7.6,7.9,6.2,7.7,3.8,7.4]},nights:'6 of 7'},
      rc:{dist:[2,4,1,0],strong:3,combo:1},
      ln:{done:5,min:38,re:2,club:[3,3,1]},
      ry:{n:3,min:34,top:'Position education'},
      mp:{n:2,min:16,pre:1},
      hl:{steps:7840,km:31.2,kcal:512,rhr:52,hrv:68},
      wb:[['Fatigue','Moderate'],['Soreness','Low'],['General feeling','Good']],
      av:{full:7,mod:0,un:0,inj:0},
      dev:2,
      best:['Club video','You completed all 3 videos from your club on the day they arrived.'],
      att:['Sleep before the match','Your shortest night this week was the one before Sunday’s match.'],
      ins:{tr:'Your extra session on Wednesday added load without reducing your sleep that night.',ma:'Your recovery the day after the match was Good — keep the same post-match routine.',ln:'You watched every club video in full instead of skipping through.'},
      next:'Next week, be in bed by 22:30 on the two nights before your match and keep one extra individual session.'},
    month:{q:'Am I moving in the right direction?',sum:'Your month',
      ai:['You trained consistently and increased your match minutes this month.','Sleep consistency improved, while recovery after high-load days still needs attention.','Your football learning activity was higher than last month.'],
      chg:[['Individual training','+2 sessions','up'],['Match minutes','+74 min','up'],['Sleep','+18 min average','up'],['RYSEON','−2 sessions','down'],['Recovery after matches','Lower','down']],
      idx:[['Discipline',82,'Improving','You completed 89% of your planned football activities this month.'],['Consistency',78,'Stable','You trained in all 4 weeks and kept a regular bedtime on 21 of 28 nights.'],['Recovery',71,'Monitor','Recovery dipped after your two highest-load match days.'],['Training',80,'Improving','More individual work on top of a steady team schedule.'],['Match activity',74,'Improving','327 minutes across 5 matches, up from 253 last month.'],['Football learning',85,'Improving','18 videos completed, including 11 of 12 from your club.'],['Mental preparation',62,'Stable','6 sessions — 3 of them before matches.'],['Professional habits',77,'Stable','Earlier bedtimes before matches and fewer late nights.']],
      tr:{team:14,ind:5,min:1450,rpe:6.8,hi:4,ch:{l:'weeks',team:[360,375,360,345],ind:[45,90,0,70]}},
      add:{n:5,min:205,br:[['Football',95],['Gym',50],['Running',40],['Swimming',20]]},
      ma:{club:[4,262],nat:[1,65],n:5,min:327,avg:65,rpe:7.4,starts:4,ha:[2,3],ty:[['League',3],['Cup',1],['National team',1]],ch:{l:'weeks',club:[90,72,45,55],nat:[0,65,0,0]}},
      sl:{avg:462,cons:'Good',d:18,ch:{l:'nights',v:[7.4,7.9,7.6,8.1,7.2,5.9,7.5,7.8,8.0,7.7,7.6,7.9,7.1,4.1,7.9,8.2,7.8,7.6,7.7,7.3,6.4,7.9,8.0,7.8,7.6,7.9,7.7,8.1]},nights:'21 of 28'},
      rc:{dist:[8,14,5,1],strong:12,combo:3},
      ln:{done:18,min:134,re:6,club:[12,11,3]},
      ry:{n:9,min:102,top:'Position education'},
      mp:{n:6,min:48,pre:3},
      hl:{steps:8120,km:128,kcal:540,rhr:51,hrv:71},
      wb:[['Fatigue','Higher after matches'],['Soreness','Low'],['General feeling','Good']],
      av:{full:25,mod:3,un:0,inj:1},
      dev:4,
      best:['Sleep consistency','You kept a consistent sleep schedule on 21 of 28 tracked nights.'],
      att:['Recovery after matches','Recovery was lower after 3 of your last 4 matches. Consider prioritising post-match recovery.'],
      ins:{tr:'Your individual training increased this month without reducing sleep consistency.',ma:'You played 327 minutes this month. Your lowest recovery readings came after two high-load matches.',ln:'You completed almost all club-assigned video, but your RYSEON position learning decreased compared with last month.'},
      next:'Your training consistency is strong. For the next seven days, prioritise recovery after matches and return to two short position-learning sessions.'},
    year:{q:'How did I develop this year?',sum:'Your year so far',
      ai:['Since January you’ve built a steady routine: 180 training sessions and 41 matches, including 4 for your national team.','Your sleep became more regular from spring onwards, and availability stayed high.','Football learning grew every quarter — most of it position-specific.'],
      chg:null,
      idx:[['Discipline',80,'Improving','Your share of completed planned activities rose from 71% in Q1 to 89% in Q3.'],['Consistency',77,'Improving','You trained in 41 of 42 weeks.'],['Recovery',72,'Stable','Recovery held steady while match minutes increased.'],['Training',79,'Improving','236 hours in total, 38 of them individual.'],['Match activity',76,'Improving','2,658 minutes for club and country.'],['Football learning',84,'Improving','164 videos completed across the year.'],['Mental preparation',64,'Improving','54 sessions, 29 of them before matches.'],['Professional habits',76,'Stable','Fewer late nights in the second half of the year.']],
      tr:{team:142,ind:38,min:14160,rpe:6.7,hi:47,ch:{l:'months',team:[1310,1290,1420,1380,1350,980,640,1440,1460,1450],ind:[60,90,140,180,200,260,310,240,190,205]}},
      add:{n:38,min:2280,br:[['Football',840],['Gym',620],['Running',480],['Swimming',190],['Cycling',100],['Other',50]]},
      ma:{club:[37,2410],nat:[4,248],n:41,min:2658,avg:65,rpe:7.3,starts:31,ha:[19,22],ty:[['League',31],['Cup',6],['National team',4]],ch:{l:'months',club:[180,250,310,290,270,0,90,300,340,380],nat:[0,0,65,0,58,0,0,0,60,65]}},
      sl:{avg:456,cons:'Good',d:null,ch:{l:'months',v:[7.2,7.3,7.5,7.6,7.7,7.8,7.4,7.6,7.6,7.7]},nights:'214 of 288'},
      rc:{dist:[71,143,61,13],strong:96,combo:22},
      ln:{done:164,min:1180,re:41,club:[118,109,27]},
      ry:{n:86,min:910,top:'Position education'},
      mp:{n:54,min:425,pre:29},
      hl:{steps:7960,km:1214,kcal:528,rhr:52,hrv:69},
      wb:[['Fatigue','Higher in match-heavy months'],['Soreness','Mostly low'],['General feeling','Good']],
      av:{full:271,mod:14,un:6,inj:2},
      dev:31,
      best:['Availability','You were fully available on 271 of 291 days.'],
      att:['Summer break','Training volume dropped in June and July — plan a structured off-season routine next year.'],
      ins:{tr:'Your individual work grew steadily through the year while team training stayed stable.',ma:'Your match minutes rose in autumn, and recovery held steady.',ln:'Learning grew every quarter, with position education the most consistent part.'},
      next:'For the rest of the season, keep your training rhythm and add one recovery-focused session after every match week.'}
  };
  function hm(min){ var h=Math.floor(min/60), m=Math.round(min%60); return h?(h+'h'+(m?' '+m+'m':'')):(m+'m') }
  function nfmt(v){ return fmtN(v) }
  function pAI(t){ var e=SE(); return '<div class="pg-ai"><span class="k"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.8 9.4 6.6 14.2 8 9.4 9.4 8 14.2 6.6 9.4 1.8 8 6.6 6.6Z" fill="currentColor"/></svg>RYSE AI</span><p>'+e(rT(t))+'</p></div>' }
  function ib(k,lab){ return '<button type="button" class="ib" data-info="'+k+'" aria-label="'+SE()(rT('About {x}',{x:rT(lab||'this')}))+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.9v.2"/></svg></button>' }
  function pH(t,sub,info){ var e=SE(); return '<h3 class="pg-h">'+e(rT(t))+(info?ib(info,t):'')+'</h3>'+(sub?'<p class="pg-hs">'+e(rT(sub))+'</p>':'') }
  function pStats(a){ var e=SE(); return '<div class="pg-stats">'+a.map(function(x){ return '<div><b>'+e(x[0])+'</b><small>'+e(rT(x[1]))+'</small></div>' }).join('')+'</div>' }
  function pRows(a){ var e=SE(); return '<div class="pg-rows">'+a.map(function(x){ return '<div><span>'+e(rT(x[0]))+'</span><b class="'+(x[2]||'')+'">'+e(rT(x[1]))+'</b></div>' }).join('')+'</div>' }
  function labelsFor(kind,n){ if(Array.isArray(kind)) return kind; var loc=locN(), o=[];
    if(kind==='days'){ var f; try{ f=new Intl.DateTimeFormat(loc,{weekday:'narrow'}) }catch(_){ f=new Intl.DateTimeFormat('en',{weekday:'narrow'}) } for(var i=0;i<n;i++) o.push(f.format(new Date(2024,0,1+i))) }
    else if(kind==='months'){ var g; try{ g=new Intl.DateTimeFormat(loc,{month:'narrow'}) }catch(_){ g=new Intl.DateTimeFormat('en',{month:'narrow'}) } for(var j=0;j<n;j++) o.push(g.format(new Date(2026,j,1))) }
    else if(kind==='weeks'){ for(var k=0;k<n;k++) o.push(rT('W{n}',{n:k+1})) }
    else { for(var q=0;q<n;q++) o.push((q%7===0)?String(q+1):'') }
    return o }
  /* compact stacked bar chart; tap a bar to read its value */
  function pBars(id,kind,series,unit){ var n=series[0].v.length, L=labelsFor(kind,n), tot=[], mx=0, i;
    for(i=0;i<n;i++){ var t=0; series.forEach(function(s){ t+=s.v[i]; if(s.v[i]>mx) mx=s.v[i] }); tot.push(t) }
    /* nice scale: 3 grid lines */
    var step=unit==='min'?(mx>600?300:(mx>240?120:(mx>90?60:30))):Math.ceil(mx/3); var top=Math.max(step,Math.ceil(mx/step)*step); if(top/step>4){ step*=2; top=Math.ceil(mx/step)*step }
    var W=330,H=150,pl=0,pr=34,pt=8,pb=6,cw=W-pl-pr,ch=H-pt-pb, gw=cw/n, ns=series.length, bw=Math.max(5,Math.min(12,gw*(ns>1?.2:.32))), gap=ns>1?4:0, svg='';
    for(var g=0;g<=top;g+=step){ var y=pt+ch-(g/top)*ch; svg+='<line x1="'+pl+'" x2="'+(pl+cw)+'" y1="'+y.toFixed(1)+'" y2="'+y.toFixed(1)+'" class="gl'+(g?'':' base')+'"/>'+(g?'<text x="'+(W-2)+'" y="'+(y+3.5).toFixed(1)+'" class="gt">'+(unit==='min'?(g>=60?(g/60)+'h':g+'m'):g)+'</text>':'') }
    for(i=0;i<n;i++){ var cx=pl+gw*i+gw/2, x0=cx-(ns*bw+(ns-1)*gap)/2;
      series.forEach(function(s,si){ var v=s.v[i], h=v/top*ch, x=x0+si*(bw+gap), y=pt+ch-h, r=Math.min(bw/2,h);
        if(v>0) svg+='<path class="b'+si+'" d="M'+x.toFixed(1)+' '+(pt+ch)+' V'+(y+r).toFixed(1)+' Q'+x.toFixed(1)+' '+y.toFixed(1)+' '+(x+r).toFixed(1)+' '+y.toFixed(1)+' H'+(x+bw-r).toFixed(1)+' Q'+(x+bw).toFixed(1)+' '+y.toFixed(1)+' '+(x+bw).toFixed(1)+' '+(y+r).toFixed(1)+' V'+(pt+ch)+' Z"/>';
        else svg+='<circle class="bz" cx="'+(x+bw/2).toFixed(1)+'" cy="'+(pt+ch-2)+'" r="1.6"/>' });
      svg+='<rect x="'+(pl+gw*i).toFixed(1)+'" y="0" width="'+gw.toFixed(1)+'" height="'+H+'" class="hit" data-bi="'+i+'"/>' }
    var lab=L.map(function(l){ return '<span>'+SE()(l)+'</span>' }).join('');
    return '<div class="pg-chart" id="'+id+'" data-unit="'+unit+'" data-vals="'+SE()(JSON.stringify({t:tot,s:series.map(function(s){return {n:rT(s.n),v:s.v}}),l:L}))+'"><svg viewBox="0 0 '+W+' '+H+'" aria-hidden="true">'+svg+'</svg><div class="lb" style="grid-template-columns:repeat('+n+',1fr);margin-right:'+(pr/W*100).toFixed(1)+'%">'+lab+'</div>'+
      '<div class="lg">'+series.map(function(s,si){ return '<span><i class="b'+si+'"></i>'+SE()(rT(s.n))+'</span>' }).join('')+'<em class="cap"></em></div></div>' }
  function pLine(id,kind,v){ var n=v.length, mn=Math.min.apply(null,v)-0.4, mx=Math.max.apply(null,v)+0.3, W=320,H=110, pts=v.map(function(x,i){ return [(i/(n-1))*W, H-(x-mn)/(mx-mn)*(H-10)-5] });
    var d=pts.map(function(p,i){ return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1) }).join(' '), area=d+' L'+W+' '+H+' L0 '+H+' Z', L=labelsFor(kind,n);
    var hits=pts.map(function(p,i){ return '<rect class="hit" x="'+(p[0]-W/n/2).toFixed(1)+'" y="0" width="'+(W/n).toFixed(1)+'" height="'+H+'" data-bi="'+i+'"/>' }).join('');
    return '<div class="pg-chart line" id="'+id+'" data-unit="h" data-vals="'+SE()(JSON.stringify({t:v,l:L,line:1}))+'"><svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><path d="'+area+'" class="ar"/><path d="'+d+'" class="ln"/>'+hits+'</svg><div class="lb" style="grid-template-columns:repeat('+n+',1fr)">'+L.map(function(l){return '<span>'+SE()(l)+'</span>'}).join('')+'</div><div class="lg"><em class="cap"></em></div></div>' }
  function pDist(d){ var e=SE(), t=d.reduce(function(a,b){return a+b},0)||1, N=['Optimal','Good','Monitor','Recovery needed'];
    return '<div class="pg-dist">'+d.map(function(x,i){ return x?'<i class="d'+i+'" style="flex:'+x+'"></i>':'' }).join('')+'</div><div class="pg-distl">'+d.map(function(x,i){ return '<span><i class="d'+i+'"></i>'+e(rT(N[i]))+' <b>'+x+'</b></span>' }).join('')+'</div>' }


  function ring(v,sz,sw){ var r=(sz-sw)/2, c=2*Math.PI*r; return '<svg viewBox="0 0 '+sz+' '+sz+'" aria-hidden="true"><circle cx="'+sz/2+'" cy="'+sz/2+'" r="'+r+'" class="trk" stroke-width="'+sw+'"/>'+(v===null?'':'<circle cx="'+sz/2+'" cy="'+sz/2+'" r="'+r+'" class="val" stroke-width="'+sw+'" stroke-dasharray="'+(c*v/100).toFixed(1)+' '+c.toFixed(1)+'"/>')+'</svg>' }
  function spark(v){ var n=v.length, mn=Math.min.apply(null,v)-2, mx=Math.max.apply(null,v)+1, W=120, H=40, pts=v.map(function(x,i){ return [(i/(n-1))*W, H-(x-mn)/(mx-mn)*(H-6)-3] });
    return '<svg class="dv-spark" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><path class="ln" d="'+pts.map(function(p,i){return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)}).join(' ')+'"/><circle class="dt" cx="'+pts[n-1][0].toFixed(1)+'" cy="'+pts[n-1][1].toFixed(1)+'" r="3"/></svg>' }
  var DRIVE_OPEN=false;
  function driveHTML(per){ var e=SE(), LV=['Bronze','Silver','Gold','High Performance','Excellence'], lv=CUR.lvl;
    var head='<div class="dv-head"><div><b>'+e(rT('Development Drive'))+'</b><small>'+e(rT('Development behaviour intelligence'))+'</small></div>'+ib('drive','Development Drive')+'</div>';
    if(!per){ var days=Math.min(30,(P.trainingLogs||[]).length+3);
      return '<section class="dv dk dv-new">'+head+'<div class="dv-base"><span class="r">'+ring(days/30*100,64,4)+'<i>'+days+'<em>/30</em></i></span><div><b>'+e(rT('Building your baseline'))+'</b><p>'+e(rT('RYSE needs more time to understand your development patterns.'))+'</p></div></div>'+
        '<div class="dv-grid">'+DRIVE_DIMS.slice(0,6).map(function(d){ return '<button type="button" class="dv-d" data-info="'+d[0]+'"><span class="r">'+ring(null,46,3.5)+'<i>—</i></span><span class="l">'+e(rT(d[1]))+'</span><span class="t na">'+e(rT('Early signal'))+'</span></button>' }).join('')+'</div>'+
        '<button type="button" class="dv-more" data-pg="drive">'+e(rT('Learn more'))+'</button></section>' }
    var D=athleteDrive(CUR,per), show=DRIVE_OPEN?DRIVE_DIMS:DRIVE_DIMS.slice(0,6);
    return '<section class="dv dk">'+head+
      '<div class="dv-main"><div class="dv-score"><b>'+D.v+'</b><div><span class="st">'+e(rT(D.st))+'</span><span class="tr">↑ '+D.d+' '+e(rT(D.per))+'</span></div></div>'+spark(D.tr)+'</div>'+
      '<button type="button" class="dv-conf" data-info="confidence"><i></i>'+e(rT('High confidence'))+'</button>'+
      '<div class="dv-grid">'+show.map(function(d){ var k=DRIVE_DIMS.indexOf(d), v=D.dims[k], dd=D.dd[k]; return '<button type="button" class="dv-d" data-info="'+d[0]+'"><span class="r">'+ring(v,46,3.5)+'<i>'+v+'</i></span><span class="l">'+e(rT(d[1]))+'</span><span class="t">'+(dd>0?'↑ '+dd:(dd<0?'↓ '+Math.abs(dd):'→'))+'</span></button>' }).join('')+'</div>'+
      '<button type="button" class="dv-all" data-drive-all>'+e(rT(DRIVE_OPEN?'Show less':'View all 9'))+'</button>'+
      '<div class="pg-ai dv-ai"><span class="k"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.8 9.4 6.6 14.2 8 9.4 9.4 8 14.2 6.6 9.4 1.8 8 6.6 6.6Z" fill="currentColor"/></svg>RYSE AI</span><p>'+D.ai.map(function(t){return e(rT(t))}).join('<br>')+'</p></div>'+
      '<button type="button" class="dv-lvl" data-pg="levels"><span><small>'+e(rT('Athlete level'))+'</small><b>'+e(rT(LV[lv]))+'</b></span><span class="ar">→</span><span><small>'+e(rT('Next'))+'</small><b>'+e(rT(LV[lv+1]))+'</b></span><span class="ar">→</span><span class="gold"><small>'+e(rT('Gold'))+'</small><b>'+e(rT('Club discovery eligibility'))+'</b></span></button>'+
      '<button type="button" class="dv-more" data-pg="drive">'+e(rT('Learn more'))+'</button></section>' }


    function renderFor(a,p){ var e=SE(), per=PROG.per, D=athletePD(a,per), age=a.age, ps={};
    var seg='<div class="pg-seg" role="tablist">'+[['week','Weekly'],['month','Monthly'],['year','Yearly']].map(function(x){ return '<button type="button" role="tab" data-per="'+x[0]+'" aria-selected="'+(per===x[0])+'">'+e(rT(x[1]))+'</button>' }).join('')+'</div>';
    var h=''+
      '<div class="pg-sticky">'+seg+'</div>';
    if(false){ var nlog=(P.trainingLogs||[]).length, nm=(P.matches||[]).length;
      h+=driveHTML(null);
      h+=pH('What we have so far')+pRows([['Training sessions logged',String(nlog)],['Matches in your calendar',String(nm)],['Sleep','Not available yet','na'],['Recovery','Not available yet','na'],['HRV','Not available','na']])+
        pAI('Log your next training and connect Apple Health so RYSE can start reading sleep and recovery.');
      return h }
    h+='<p class="pg-q">'+e(rT(D.q))+' <span class="pg-ex">'+e(rT('Example data · scoring not final'))+'</span></p>';
    /* summary */
    h+='<section class="pg-sum"><span class="k">'+e(rT(D.sum))+'</span>'+D.ai.slice(0,2).map(function(t){ return '<p>'+e(rT(t))+'</p>' }).join('')+'</section>';
    h+=driveHTML(per);
    /* what changed */
    if(D.chg) h+=pH('What changed?',per==='week'?'vs last week':'vs last month')+'<div class="pg-chg">'+D.chg.map(function(c){ return '<div><i class="'+c[2]+'">'+(c[2]==='up'?'↑':'↓')+'</i><span>'+e(rT(c[0]))+'</span><b>'+e(rT(c[1]))+'</b></div>' }).join('')+'</div>';
    else h+=pH('What changed?')+'<p class="pg-note">'+e(rT('This is your first year in RYSE. Year-on-year comparison starts next year.'))+'</p>';
    /* indices */
    h+=pH('Development indices',null,'indices')+'<div class="pg-idx">'+D.idx.map(function(x){ return '<button type="button" data-info="idx:'+e(x[0])+'"><span class="n">'+e(rT(x[0]))+'</span><b>'+x[1]+'</b><span class="tr '+x[2].toLowerCase()+'">'+(x[2]==='Improving'?'↑ ':(x[2]==='Monitor'?'• ':'→ '))+e(rT(x[2]))+'</span></button>' }).join('')+'</div>';
    /* training */
    var T=D.tr; h+=pH('Training')+pStats([[String(T.team),'Team sessions'],[String(T.ind),'Individual sessions'],[hm(T.min),'Total training'],[nfmt(T.rpe),'Average RPE'],[String(T.hi),'High-load days']])+
      pBars('ch-tr',T.ch.l,[{n:'Team training',v:T.ch.team},{n:'Individual',v:T.ch.ind}],'min')+pAI(D.ins.tr);
    var A=D.add, am=Math.max.apply(null,A.br.map(function(b){return b[1]}));
    h+='<div class="pg-sub2"><div class="pg-subh"><b>'+e(rT('Additional training'))+'</b><span>'+e(rTp('{n} sessions',A.n))+' · '+e(hm(A.min))+'</span></div>'+
      '<div class="pg-hbars">'+A.br.map(function(b){ return '<div><span>'+e(rT(b[0]))+'</span><i><em style="width:'+(b[1]/am*100).toFixed(0)+'%"></em></i><b>'+e(hm(b[1]))+'</b></div>' }).join('')+'</div></div>';
    /* matches */
    var M=D.ma, nat=M.nat, ntn='England'+(age<21?' U'+([15,16,17,18,19,21].filter(function(t){return age<=t})[0]||21):'');
    h+=pH('Match activity')+'<div class="pg-split"><div><small>'+e(rT('Club'))+'</small><b>'+e(rTp('{n} matches',M.club[0]))+'</b><span>'+e(M.club[1]+' min')+'</span></div><div'+(nat?'':' class="na"')+'><small>'+e(rT('National team'))+'</small>'+(nat?'<b>'+e(rTp('{n} matches',nat[0]))+'</b><span>'+e(nat[1]+' min · '+ntn)+'</span>':'<b>—</b><span>'+e(rT('No national team match'))+'</span>')+'</div></div>'+
      pStats([[String(M.n),'Matches'],[nfmt(M.min),'Minutes played'],[M.avg+' min','Average minutes'],[String(M.starts),'Starts'],[nfmt(M.rpe),'Match RPE']])+
      '<div class="pg-tags">'+M.ty.map(function(t){ return '<span>'+e(rT(t[0]))+' <b>'+t[1]+'</b></span>' }).join('')+'<span>'+e(rT('Home'))+' <b>'+M.ha[0]+'</b></span><span>'+e(rT('Away'))+' <b>'+M.ha[1]+'</b></span></div>'+
      (M.ch?pBars('ch-ma',M.ch.l,[{n:'Club',v:M.ch.club},{n:'National team',v:M.ch.nat}],'min'):'')+pAI(D.ins.ma);
    /* sleep & recovery */
    var S=D.sl; h+=pH('Sleep & recovery',null,'recoverystates')+pStats([[hm(S.avg),'Average sleep'],[rT(S.cons),'Consistency'],[S.d===null?'—':((S.d>0?'+':'−')+Math.abs(S.d)+' min'),per==='week'?'vs last week':(per==='month'?'vs last month':'vs last year')],[S.nights,'Regular bedtime']])+
      pLine('ch-sl',S.ch.l,S.ch.v)+'<div class="pg-subh" style="margin-top:18px"><b>'+e(rT('Recovery'))+'</b><span>'+e(rTp('{n} strong recovery days',D.rc.strong))+'</span></div>'+pDist(D.rc.dist)+
      pRows([['High load with low recovery',rTp('{n} times',D.rc.combo)]]);
    /* learning */
    var Ln=D.ln, cp=Math.round(Ln.club[1]/Ln.club[0]*100); h+=pH('Football learning')+pStats([[String(Ln.done),'Videos completed'],[hm(Ln.min),'Watch time'],[String(Ln.re),'Rewatched']])+
      '<div class="pg-sub2"><div class="pg-subh"><b>'+e(rT('Club video'))+'</b><span>'+e(rT('{a} of {b} completed',{a:Ln.club[1],b:Ln.club[0]}))+' · '+e(rTp('{n} rewatched',Ln.club[2]))+'</span></div><div class="pg-prog"><i style="width:'+cp+'%"></i></div></div>'+pAI(D.ins.ln);
    /* RYSEON + mental */
    h+=pH('RYSEON')+pRows([['Sessions completed',String(D.ry.n)],['Learning time',hm(D.ry.min)],['Most active',rT(D.ry.top)]]);
    h+=pH('Mental preparation')+pRows([['Sessions',String(D.mp.n)],['Time',hm(D.mp.min)],['Before matches',String(D.mp.pre)]]);
    /* health */
    var Hh=D.hl; h+=pH('Activity & health','From Apple Health')+pRows([['Steps per day',nfmt(Hh.steps)],['Walking & running',nfmt(Hh.km)+' km'],['Active energy per day',nfmt(Hh.kcal)+' kcal'],['Resting heart rate',Hh.rhr+' bpm'],['HRV',Hh.hrv+' ms'],['VO₂ max','Not available','na']]);
    h+=pH('Wellbeing','Self-reported')+pRows(D.wb.map(function(w){ return [w[0],rT(w[1])] }));
    /* availability */
    var Av=D.av; h+=pH('Availability',null,'availability')+pRows([['Fully available',rTp('{n} days',Av.full)],['Modified training',rTp('{n} days',Av.mod)],['Unavailable',rTp('{n} days',Av.un)],['Injury events',String(Av.inj)]]);
    /* development focus */
    var foc=(a.focus||['Explosiveness','Agility']).slice(0,3);
    h+=pH('Development focus',null,'devfocus')+'<div class="pg-tags big">'+foc.map(function(f){ return '<span>'+e(rT(f))+'</span>' }).join('')+'</div>'+pAI(rT('You completed {n} development activities related to your current focus.',{n:D.dev}));
    /* strongest / attention */
    h+='<div class="pg-pair"><div class="best"><small>'+e(rT('Your strongest progress'))+'</small><b>'+e(rT(D.best[0]))+'</b><p>'+e(rT(D.best[1]))+'</p></div><div class="att"><small>'+e(rT('Needs attention'))+'</small><b>'+e(rT(D.att[0]))+'</b><p>'+e(rT(D.att[1]))+'</p></div></div>';
    /* athlete level */
    var LV=['Bronze','Silver','Gold','High Performance','Excellence'], lv=a.lvl;
    h+=pH('Athlete level')+'<div class="pg-lvl"><b>'+e(rT(LV[lv]))+'</b><span>'+e(rT('Next · {level}',{level:rT(LV[lv+1])}))+'</span></div><p class="pg-hs">'+e(rT('Contributing areas'))+'</p><div class="pg-tags">'+['Discipline','Consistency','Football learning','Verified activity','Professional habits'].map(function(x){ return '<span>'+e(rT(x))+'</span>' }).join('')+'</div>';
    /* next focus */
    h+='<section class="pg-next"><span class="k"><svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 1.8 9.4 6.6 14.2 8 9.4 9.4 8 14.2 6.6 9.4 1.8 8 6.6 6.6Z" fill="currentColor"/></svg>'+e(rT('Next focus'))+'</span><p>'+e(rT(D.next))+'</p></section>';
    h+='<p class="pg-src">'+e(rT('Sources'))+': Apple Health · '+e(rT('Self-reported'))+' · RYSE · '+e(rT('Club'))+'</p>';
    return h }

/* ---------- athlete-specific values in RYSEON's data shape ---------- */
var PROG={per:'month'};window.PROG9=PROG;
function third(t,a){
  var n=a.first,P2=his(a),O=him(a),S2=he(a);
  return String(t).replace(/sent you/g,'sent '+O).replace(/\bYou were\b/g,n+' was').replace(/\byou were\b/g,S2+' was').replace(/\bYou\b/g,n).replace(/\bYour\b/g,n+'’s').replace(/\byour\b/g,P2).replace(/\byou\b/g,O)
    .replace(new RegExp(n+' completed','g'),n+' completed').replace(/\b(he|she) are\b/g,'$1 is').replace(/\b(he|she) have\b/g,'$1 has');
}
function clone(o){return JSON.parse(JSON.stringify(o))}
function athletePD(a,per){
  var D=clone(PD[per]),k=hash(a.id+per),f=a.tpl==='pro'?1.12:.92;
  D.q='How did '+a.first+'’s '+(per==='week'?'week':(per==='month'?'month':'year'))+' go?';D.sum=a.first+'’s '+(per==='week'?'week':(per==='month'?'month':'year'));
  D.ai=D.ai.map(function(x){return third(x,a)});
  ['best','att'].forEach(function(z){D[z]=[D[z][0],third(D[z][1],a)]});
  for(var z in D.ins) D.ins[z]=third(D.ins[z],a);D.next=third(D.next,a);
  var M={Discipline:Math.round(a.m.c*.6+a.m.h*.4),Consistency:a.m.c,Recovery:a.m.r,'Football learning':a.m.l,Training:a.m.p,'Match activity':Math.round((a.m.p+a.m.c)/2),'Mental preparation':Math.round(a.m.p*.8+10),'Professional habits':a.m.h};
  D.idx=D.idx.map(function(x){var v=M[x[0]]!=null?M[x[0]]:x[1];return [x[0],v,a.dt>3&&v>70?'Improving':(v<60?'Monitor':x[2]==='Monitor'&&v>=70?'Stable':x[2]),third(x[3]||'',a)]});
  var T=D.tr;T.min=Math.round(T.min*f);T.ch.team=T.ch.team.map(function(v,i){return Math.round(v*f*(.9+hash(a.id+'t'+i)*.2))});T.ch.ind=T.ch.ind.map(function(v,i){return Math.round(v*(.8+hash(a.id+'i'+i)*.4))});
  var nights=[];for(var i=0;i<7;i++) nights.push(nightOf(a.id,addDays(TODAY,-i)).dur);var avg=nights.reduce(function(s,x){return s+x},0)/7;
  D.sl.avg=Math.round(per==='week'?avg:avg+(k-.5)*12);
  if(per==='week'){D.sl.ch.v=[];for(var j=6;j>=0;j--) D.sl.ch.v.push(Math.round(nightOf(a.id,addDays(weekStart(TODAY),6-j)).dur/6)/10)}
  else D.sl.ch.v=D.sl.ch.v.map(function(v,i){return Math.round((v+(hash(a.id+'s'+i)-.5)*.5+(a.age<17?.4:0))*10)/10});
  if(INJ[a.id]&&P(a.id).health){var j2=INJ[a.id];D.av={full:per==='week'?0:Math.max(0,D.av.full-(-j2.start)),mod:Math.min(-j2.start+1,per==='week'?7:30),un:j2.avail==='Unavailable'?(-j2.start):0,inj:1}}
  return D;
}
function athleteDrive(a,per){
  var D=clone(DRIVE[per]),dd=per==='week'?a.dt:(per==='month'?a.dt+3:a.dt*2+8);
  D.v=a.drive;D.d=Math.abs(dd);D.st=a.drive>=80?'High':(a.drive>=65?'Good':'Building');
  var n=D.tr.length;D.tr=D.tr.map(function(_,i){return Math.round(a.drive-dd*(n-1-i)/(n-1)+(hash(a.id+'dr'+i)-.5)*2)});D.tr[n-1]=a.drive;
  var dims=[a.m.c,a.m.i,a.m.l,a.m.p,a.m.h,a.m.r];dims.forEach(function(v,i){D.dims[i]=v;D.dd[i]=Math.round((hash(a.id+'dd'+i+per)-.35)*6)});
  D.ai=D.ai.map(function(x){return third(x,a)});
  return D;
}
/* sections follow what the athlete shares */
var GATE={'What changed?':'development','Development indices':'development','Training':'training','Match activity':'matches','Sleep &amp; recovery':'sleep','Football learning':'learning','RYSEON':'learning','Mental preparation':'learning','Activity &amp; health':'sleep','Wellbeing':'sleep','Availability':'health','Development focus':'development','Athlete level':'development'};
function progressTab(a,p){
  CUR=a;var h=renderFor(a,p),parts=h.split('<h3 class="pg-h">'),out=parts[0];
  if(!p.development){var i=out.indexOf('<p class="pg-q">');out=out.slice(0,i>0?i:out.length)+lockline(a,'Development')}
  var locked={};
  for(var x=1;x<parts.length;x++){var title=parts[x].slice(0,parts[x].search(/<button|<\/h3>/)),g=GATE[title];
    if(g&&!p[g]){var lbl={development:'Development',training:'Training',matches:'Matches',sleep:'Sleep & Recovery',learning:'Learning',health:'Health / Injury'}[g];
      if(!locked[g]){locked[g]=1;out+='<h3 class="pg-h">'+title+'</h3>'+lockline(a,lbl)}
      var tail=parts[x].indexOf('<p class="pg-src">');if(tail>=0) out+=parts[x].slice(tail);continue}
    out+='<h3 class="pg-h">'+parts[x]}
  return '<div class="ryp">'+out+'</div>';
}
/* overview: the four score rings from RYSEON Home */
window.ringsHTML=function(a,p){
  var CC=2*Math.PI*24,nights=[];for(var i=1;i<=7;i++) nights.push(nightOf(a.id,addDays(TODAY,-i+1)).dur);var avg=nights.reduce(function(s,x){return s+x},0)/7;
  var lv=function(v){return v>=80?'Good':(v>=65?'Moderate':'Low')};
  var IX=[['sleep','Sleep',Math.round(60+(avg-390)/3),hm(avg),'<path d="M19.5 14.6A7.5 7.5 0 0 1 9.4 4.5a7.5 7.5 0 1 0 10.1 10.1Z"/>',p.sleep],
    ['training','Training',a.m.p,null,'<path d="M3.5 12h2M18.5 12h2M6 8.5v7M18 8.5v7M8.5 6.5v11M15.5 6.5v11M8.5 12h7"/>',p.training],
    ['recovery','Recovery',a.m.r+(INJ[a.id]&&p.health?-12:4),null,'<path d="M13 3 5.5 13.5H12L11 21l7.5-10.5H12Z"/>',p.sleep],
    ['discipline','Discipline',Math.round(a.m.c*.6+a.m.h*.4),null,'<path d="M12 3.5 4.5 7v5c0 4.4 3.2 7.6 7.5 8.5 4.3-.9 7.5-4.1 7.5-8.5V7Z"/><path d="m9 12 2.2 2.2L15.5 10"/>',p.development]];
  return '<div class="h-idx">'+IX.map(function(x){var v=Math.max(30,Math.min(99,x[2])),on=x[5];
    return '<button type="button" class="h-ix" data-a="atab" data-t="progress"><span class="r"><svg viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="24" class="trk"/>'+(on?'<circle cx="28" cy="28" r="24" class="val" style="stroke-dasharray:'+(CC*v/100).toFixed(1)+' '+CC.toFixed(1)+'"/>':'')+'</svg><span><b>'+(on?v:'—')+'</b><em>100</em></span></span>'+
      '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+x[4]+'</svg><small>'+x[1]+'</small><i>'+(on?(x[3]||lv(v)):'Not shared')+'</i></button>'}).join('')+'</div>';
};
var _athTab9=athTab;
athTab=function(a,p){if(S.atab==='progress') return progressTab(a,p);return _athTab9(a,p)};
/* RYSEON interactions: period, tap a bar to read it, "View all 9" */
document.addEventListener('click',function(ev){
  var b=ev.target.closest('.ryp [data-per]');if(b){PROG.per=b.dataset.per;render();return}
  var all=ev.target.closest('.ryp [data-drive-all]');if(all){DRIVE_OPEN=!DRIVE_OPEN;render();return}
  var hb=ev.target.closest('.ryp .pg-chart .hit');if(hb){var c=hb.closest('.pg-chart'),V=JSON.parse(c.dataset.vals),i=+hb.dataset.bi,u=c.dataset.unit;
    c.querySelectorAll('.hit').forEach(function(x){x.classList.toggle('on',x===hb)});
    var txt=V.l[i]?V.l[i]+' · ':'',val=V.line?(fmtN(V.t[i])+' h'):(u==='min'?hm(V.t[i]):V.t[i]);
    if(V.s&&V.s.length>1) val+=' ('+V.s.map(function(s){return s.n+' '+hm(s.v[i])}).join(', ')+')';
    if(!V.l[i]) txt=(i+1)+' · ';c.querySelector('.cap').textContent=txt+val}
});
window.ryPBars=pBars;
render(true);
})();
