"""Builds index.html (fullscreen iPhone web app) from src/prototype.html.
src/prototype.html is the same file published as the Claude artifact: page content without <html>/<head>/<body>."""
import pathlib
root = pathlib.Path(__file__).parent
body = (root / "src/prototype.html").read_text()
import time, json
BUILD = str(int(time.time()))
head = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1,user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="RYSEON">
<meta name="theme-color" content="#03050A">
<meta name="robots" content="noindex,nofollow">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png?v=6">
<link rel="icon" type="image/png" href="icon-192.png?v=6">
<style>
html{background:#03050A;-webkit-text-size-adjust:100%}
html,body{height:100%;margin:0;overscroll-behavior:none}
body{position:fixed;inset:0;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;user-select:none}
/* Home-screen app on newer iPhones (Pro Max): iOS can report a viewport a little shorter than the screen, leaving a black strip at the bottom.
   Size the app to the full screen height instead (Ivan, 23 Oct). */
html.ryse-fs,html.ryse-fs body{height:var(--app-h)}html.ryse-fs body{bottom:auto}
input,textarea{-webkit-user-select:text;user-select:text}
img{max-width:100%}[hidden]{display:none!important}
</style>
<script>
(function(){ function fit(){ try{ var sa=window.navigator.standalone||matchMedia('(display-mode: standalone)').matches; if(!sa) return;
  var port=innerHeight>=innerWidth, sh=port?Math.max(screen.height,screen.width):Math.min(screen.height,screen.width), h=Math.max(innerHeight,sh);
  var r=document.documentElement; r.style.setProperty('--app-h',h+'px'); r.classList.add('ryse-fs') }catch(e){} }
  fit(); addEventListener('resize',fit); addEventListener('orientationchange',function(){ setTimeout(fit,250) }) })();
/* Update gate (Ivan, 24 Oct): the version check starts at the very first byte, while the app downloads behind the loading screen.
   When the app is ready and a newer build is live, it reloads straight from the loading screen — the old first screen never shows. */
(function(){ var B='""" + BUILD + """'; window.__ryseB=B;
  var ver=window.fetch?fetch('version.json?u='+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(v){return v&&v.b}).catch(function(){return null}):Promise.resolve(null);
  window.__ryseGate=function(cb){ var fired=false; function go(){ if(!fired){ fired=true; cb() } } setTimeout(go,1500);
    ver.then(function(nb){ if(fired) return; if(nb&&nb!==B){ var k='ryse-upd'; try{ if(sessionStorage.getItem(k)!==nb){ sessionStorage.setItem(k,nb); fired=true; location.replace(location.pathname+'?v='+nb); setTimeout(cb,20000); return } }catch(_){} } go() }) } })();
</script>
"""
import re
body = re.sub(r"<title>.*?</title>", "<title>RYSEON</title>", body, count=1)
i = body.index('<div class="stage">')
doc = head + body[:i] + "</head>\n<body>\n" + body[i:] + "\n</body>\n</html>\n"
# Auto-update on the phone (Ivan, 23 Oct): the home-screen app keeps an old copy, so when it opens or comes back to the front
# it reads the tiny version.json and reloads itself if a newer build is live
upd = """<script>
/* Auto-update + offline copy (Ivan, 26 Oct): the app keeps a copy of itself on the phone (sw.js), so it opens instantly
   and works without internet. When it opens or comes back to the front and a newer build is live, the new build is
   downloaded in the background first; only when it is fully on the phone, nobody is touching the screen and the
   language screen is showing, the app switches to it (in about a second, under the loading cover). The screen is never
   left frozen on an old page while a download runs, which made Continue look dead. */
(function(){var B='""" + BUILD + """',busy=0,touch=0,CN='ryseon-app',BASE=new URL('./',location.href).href;
  addEventListener('pointerdown',function(){touch=Date.now()},true);addEventListener('touchstart',function(){touch=Date.now()},{capture:true,passive:true});
  try{ if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')) addEventListener('load',function(){ navigator.serviceWorker.register('sw.js').then(function(){ return navigator.serviceWorker.ready }).then(function(){ return cachedB() }).then(function(cb){ if(!cb) setTimeout(function(){ prefetch(B) },3000) }).catch(function(){}) }) }catch(_){}
  function safe(){ var L=document.getElementById('sLang'); return Date.now()-touch>4000&&L&&!L.classList.contains('is-hidden')&&!L.classList.contains('is-leaving')&&!window.__ryseQ&&!document.hidden }
  function cachedB(){ if(!window.caches) return Promise.resolve(null); return caches.open(CN).then(function(c){ return c.match(BASE+'__b') }).then(function(r){ return r?r.text():null }).catch(function(){ return null }) }
  function prefetch(nb){ if(!window.caches) return Promise.resolve(false);
    return fetch(BASE+'index.html?fresh='+nb,{cache:'no-store'}).then(function(r){ if(!r.ok) throw 0; return r.text() }).then(function(t){
      var m=/var B='(\\d+)'; window\\.__ryseB=B/.exec(t.slice(0,60000)); if(!m||t.indexOf('</html>')<0) return false;
      return caches.open(CN).then(function(c){ return Promise.all([c.put(BASE+'__app',new Response(t,{headers:{'Content-Type':'text/html; charset=utf-8'}})),c.put(BASE+'__b',new Response(m[1]))]) }).then(function(){ return m[1]===nb }) }).catch(function(){ return false }) }
  function cover(){ try{ var d=document.createElement('div'); d.id='ryse-upd-cover'; d.style.cssText='position:fixed;inset:0;z-index:2147483000;background:radial-gradient(90% 60% at 50% 42%,#0B1222 0%,#04060B 62%,#020305 100%);display:grid;place-items:center;font:600 15px/1 Archivo,Helvetica Neue,Arial,sans-serif;letter-spacing:.42em;color:#F5F7FB;opacity:0;transition:opacity .25s';
    d.innerHTML='<span>RYSE<span style="color:rgba(184,192,207,.62)">ON</span></span>'; document.body.appendChild(d); requestAnimationFrame(function(){ d.style.opacity='1' });
    setTimeout(function(){ if(d.parentNode) d.parentNode.removeChild(d) },15000) }catch(_){} }
  function apply(nb){ if(!safe()) return; var k='ryse-upd'; try{ if(sessionStorage.getItem(k)===nb) return; sessionStorage.setItem(k,nb) }catch(_){} cover(); setTimeout(function(){ location.replace(location.pathname+'?v='+nb) },260) }
  function check(){if(busy||!window.fetch) return;busy=1;
  fetch('version.json?u='+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(v){ var nb=v&&v.b; if(!nb||nb===B){ busy=0; return }
    return cachedB().then(function(cb){ return cb===nb?true:prefetch(nb) }).then(function(ok){ busy=0; if(ok) apply(nb) }) }).catch(function(){busy=0})}
  document.addEventListener('visibilitychange',function(){if(!document.hidden) check()});
  addEventListener('pageshow',function(e){ if(e.persisted) check() });
  setTimeout(check,8000) })();
</script>
"""
doc = doc.replace("\n</body>\n</html>\n", "\n" + upd + "</body>\n</html>\n")
(root / "version.json").write_text(json.dumps({"b": BUILD}))
# Offline copy (Ivan, 26 Oct): opening the app never depends on the internet. The app page is served from the phone's
# copy (instant, also offline) unless a specific newer build is asked for (?v=); the page itself downloads newer builds
# in the background. version.json always comes from the network. Only this app's own page and files are handled.
(root / "sw.js").write_text(r"""/* RYSEON offline copy — generated by build.py */
var CN='ryseon-app';
self.addEventListener('install',function(e){ self.skipWaiting() });
self.addEventListener('activate',function(e){ e.waitUntil(self.clients.claim()) });
function base(){ return self.registration.scope }
function store(c,r){ return r.clone().text().then(function(t){ var m=/var B='(\d+)'; window\.__ryseB=B/.exec(t.slice(0,60000)); if(!m||t.indexOf('</html>')<0) return;
  return Promise.all([c.put(base()+'__app',new Response(t,{headers:{'Content-Type':'text/html; charset=utf-8'}})),c.put(base()+'__b',new Response(m[1]))]) }).catch(function(){}) }
self.addEventListener('fetch',function(e){ var q=e.request; if(q.method!=='GET') return; var u=new URL(q.url), b=new URL(base());
  if(u.origin!==b.origin||u.pathname.indexOf(b.pathname)!==0) return;
  var rest=u.pathname.slice(b.pathname.length);
  if(q.mode==='navigate'){ if(rest!==''&&rest!=='index.html') return;
    var want=u.searchParams.get('v');
    e.respondWith(caches.open(CN).then(function(c){ return Promise.all([c.match(base()+'__app'),c.match(base()+'__b').then(function(r){ return r?r.text():null })]).then(function(x){ var hit=x[0], hb=x[1];
      if(hit&&(!want||want===hb)) return hit;
      return fetch(b.pathname+'index.html',{cache:'no-store'}).then(function(r){ if(r.ok) e.waitUntil(store(c,r)); return r }).catch(function(err){ if(hit) return hit; throw err }) }) }));
    return }
  if(/(^|\/)(version\.json|sw\.js)$/.test(rest)||rest.indexOf('vantage/')===0||u.searchParams.has('fresh')||/\.html?$/.test(rest)) return;
  e.respondWith(caches.open(CN).then(function(c){ return c.match(q).then(function(hit){
    var net=fetch(q).then(function(r){ if(r&&r.ok&&r.type==='basic') c.put(q,r.clone()); return r });
    if(hit){ e.waitUntil(net.catch(function(){})); return hit }
    return net }) }));
});
""")
(root / "index.html").write_text(doc)
print("index.html built,", len(doc), "bytes")
