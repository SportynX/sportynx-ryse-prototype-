/* ============================================================
   VANTAGE — prototype athlete photos + VANTAGE user's own photo
   ============================================================ */
ATHLETES.luka.photo='james';ATHLETES.mateo.photo='jenna';
try{var _ph=localStorage.getItem('vantage.photo');if(_ph) S.userPhoto=_ph}catch(e){}
document.addEventListener('change',function(e){
  var t=e.target;if(t.id!=='me-file'||!t.files||!t.files[0]) return;
  var r=new FileReader();r.onload=function(){
    var img=new Image();img.onload=function(){ // square-crop and shrink so it stays light
      var s=Math.min(img.width,img.height),c=document.createElement('canvas');c.width=c.height=320;
      c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,320,320);
      S.userPhoto=c.toDataURL('image/jpeg',.85);try{localStorage.setItem('vantage.photo',S.userPhoto)}catch(_){}
      render();toast('Profile photo updated')};img.src=r.result};
  r.readAsDataURL(t.files[0]);
});
render(true);
