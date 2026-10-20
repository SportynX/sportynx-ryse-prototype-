# Builds vantage/index.html (GitHub Pages) from vantage/src/*. Run: python3 vantage/build.py
import os
D=os.path.dirname(os.path.abspath(__file__)); S=os.path.join(D,'src')
r=lambda f:open(os.path.join(S,f),encoding='utf-8').read()
css=r('style.css'); js=r('data.js')+'\n'+r('app1.js').replace('__LOGO__','')+'\n'+r('app2.js')+'\n'+r('app3.js')+'\n'+r('app4.js')+'\n'+r('app5.js')+'\n'+r('media.js')+'\n'+r('app6.js')
head='''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,maximum-scale=1,user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="VANTAGE">
<meta name="theme-color" content="#03050A">
<meta name="robots" content="noindex,nofollow">
<title>VANTAGE</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icon-180.png?v=2">
<link rel="icon" type="image/png" href="icon-192.png?v=2">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap">
<style>
'''
body='''</style>
</head>
<body>
<div class="stage"><div class="device" id="device">
<div class="statusbar" aria-hidden="true"><span>9:41</span><span class="icons"><svg width="18" height="12" viewBox="0 0 18 12" fill="#F5F7FB"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg width="16" height="12" viewBox="0 0 16 12" fill="#F5F7FB"><path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.1-1.1A10 10 0 0 0 8 .7 10 10 0 0 0 .9 3.5L2 4.6a8.5 8.5 0 0 1 6-2.4Zm0 3.2c1.4 0 2.7.5 3.7 1.4l1.1-1.1A7 7 0 0 0 8 3.9a7 7 0 0 0-4.8 1.8l1.1 1.1A5.5 5.5 0 0 1 8 5.4Zm0 3.2c.6 0 1.1.2 1.5.6L8 10.7 6.5 9.2c.4-.4.9-.6 1.5-.6Z"/></svg><svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x=".5" y=".5" width="23" height="12" rx="3.5" stroke="#F5F7FB" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2" fill="#F5F7FB"/></svg></span></div>
<div class="aura" id="aura" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a3"></i></div>
<div id="app"></div>
</div></div>
<script>
'''
open(os.path.join(D,'index.html'),'w',encoding='utf-8').write(head+css+body+js+'\n</script>\n</body>\n</html>\n')
print('built vantage/index.html')
