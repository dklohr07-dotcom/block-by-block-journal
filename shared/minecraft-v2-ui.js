
/* Minecraft V2 UX enhancements: chat-style toasts and keyboard-friendly hotbar nav */
(function(){
  function ensureToast(){
    var t=document.getElementById('toast');
    if(!t){
      t=document.createElement('div');
      t.id='toast';
      document.body.appendChild(t);
    }
    return t;
  }
  window.mc2Toast=function(message){
    var t=ensureToast();
    t.textContent=message || 'Quest updated!';
    t.classList.add('show');
    clearTimeout(window.__mc2ToastTimer);
    window.__mc2ToastTimer=setTimeout(function(){t.classList.remove('show');},3200);
  };
  var original=window.showToast;
  window.showToast=function(message){
    if(typeof original==='function'){
      try{ original(message); }catch(e){}
    }
    window.mc2Toast(message);
  };
  document.addEventListener('DOMContentLoaded',function(){
    ensureToast();
    document.querySelectorAll('.nav-link,.inner-tab,.mc-btn,.hero-btn,.modal-btn,.cb-btn,.dg-btn,.lock-btn,button,a.button,.btn').forEach(function(el){
      if(!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)){
        el.setAttribute('tabindex','0');
      }
      el.addEventListener('keydown',function(ev){
        if(ev.key==='Enter' || ev.key===' '){
          ev.preventDefault();
          el.click();
        }
      });
    });
    setTimeout(function(){ window.mc2Toast('Quest log loaded. Choose a slot to begin.'); }, 650);
  });
})();
