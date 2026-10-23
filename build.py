"""Builds index.html (fullscreen iPhone web app) from src/prototype.html.
src/prototype.html is the same file published as the Claude artifact: page content without <html>/<head>/<body>."""
import pathlib
root = pathlib.Path(__file__).parent
body = (root / "src/prototype.html").read_text()
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
<link rel="apple-touch-icon" href="icon-180.png?v=5">
<link rel="icon" type="image/png" href="icon-192.png?v=5">
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
</script>
"""
import re
body = re.sub(r"<title>.*?</title>", "<title>RYSE</title>", body, count=1)
i = body.index('<div class="stage">')
doc = head + body[:i] + "</head>\n<body>\n" + body[i:] + "\n</body>\n</html>\n"
(root / "index.html").write_text(doc)
print("index.html built,", len(doc), "bytes")
