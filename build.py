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
    ver.then(function(nb){ if(fired) return; if(nb&&nb!==B){ var k='ryse-upd'; try{ if(sessionStorage.getItem(k)!==nb){ sessionStorage.setItem(k,nb); fired=true; location.replace(location.pathname+'?v='+nb); return } }catch(_){} } go() }) } })();
</script>
"""
import re
body = re.sub(r"<title>.*?</title>", "<title>RYSEON</title>", body, count=1)
i = body.index('<div class="stage">')
doc = head + body[:i] + "</head>\n<body>\n" + body[i:] + "\n</body>\n</html>\n"
# Auto-update on the phone (Ivan, 23 Oct): the home-screen app keeps an old copy, so when it opens or comes back to the front
# it reads the tiny version.json and reloads itself if a newer build is live
upd = """<script>
(function(){var B='""" + BUILD + """',busy=0,touch=0;addEventListener('pointerdown',function(){touch=Date.now()},true);addEventListener('touchstart',function(){touch=Date.now()},{capture:true,passive:true});
  /* never reload under the finger (Ivan, 24 Oct): only while nobody has touched the screen for 4 s, and only on the language screen — otherwise the update waits for the next launch */
  function safe(){ var L=document.getElementById('sLang'); return Date.now()-touch>4000&&L&&!L.classList.contains('is-hidden')&&!window.__ryseQ }
  function check(){if(busy||!window.fetch) return;busy=1;
  fetch('version.json?u='+Date.now(),{cache:'no-store'}).then(function(r){return r.json()}).then(function(v){busy=0;if(v&&v.b&&v.b!==B&&safe()){ var k='ryse-upd'; try{ if(sessionStorage.getItem(k)===v.b) return; sessionStorage.setItem(k,v.b) }catch(_){} location.replace(location.pathname+'?v='+v.b) }}).catch(function(){busy=0})}
  document.addEventListener('visibilitychange',function(){if(!document.hidden) check()})})();
</script>
"""
doc = doc.replace("\n</body>\n</html>\n", "\n" + upd + "</body>\n</html>\n")
(root / "version.json").write_text(json.dumps({"b": BUILD}))
(root / "index.html").write_text(doc)
print("index.html built,", len(doc), "bytes")
