/* ============================================================
   VANTAGE — navigation transitions (RYSEON pattern).
   Changing screen: the current page eases out (fade + 8px up),
   then the next page is swapped in and its sections rise in.
   Everything else re-renders in place without motion (see morph).
   ============================================================ */
(function(){
function vkey(){return S.ob?'ob:'+S.step:'v:'+S.view+':'+(S.view==='athlete'?S.aid:'')}
var LAST=vkey(),PEND=null,PAT=0,TOP=false,inner=render;
function leaving(){var m=document.getElementById('main');
  if(!S._wasOb&&m) return Array.prototype.slice.call(m.children);
  return Array.prototype.slice.call(root.children).filter(function(n){return !isOv(n)&&!n.classList.contains('bnav')})}
render=function(top){
  var k=vkey();
  /* Never get stuck (RYSEON, 23 Oct): a screen change older than 1.5 s is released */
  if(PEND&&Date.now()-PAT<1500){TOP=TOP||!!top;return}
  if(PEND){clearTimeout(PEND);PEND=null}
  if(k===LAST||!root.firstChild){LAST=k;S._wasOb=S.ob;inner(top);return}
  var els=leaving(),obSwitch=S._wasOb!==S.ob;
  els.forEach(function(e){e.classList.add('v-leave')});
  TOP=!!top;PAT=Date.now();
  PEND=setTimeout(function(){PEND=null;LAST=vkey();SCREEN_FRESH=true;try{inner(TOP)}catch(err){console.error(err)}finally{SCREEN_FRESH=false;document.querySelectorAll('.v-leave').forEach(function(e){e.classList.remove('v-leave')})}S._wasOb=S.ob;
    var m=document.getElementById('main');if(m) m.scrollTop=0;
    var col=document.querySelector('.ob-col');if(col) col.scrollTop=0},obSwitch?260:170);
};
S._wasOb=S.ob;
})();
