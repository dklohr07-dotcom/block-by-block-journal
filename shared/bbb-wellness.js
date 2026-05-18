
(function(){
  const KEY="bbb_wellness_v1";
  const today=()=>new Date().toISOString().slice(0,10);
  const defaults={
    xp:0, diamonds:250, streak:0, lastCheckin:null, moodLogs:[], quests:[],
    base:{name:"My Safe Base", blocks:["grass","wood","water","flower"], rooms:["Calm Corner"]},
    companion:{name:"Pebble", type:"golem", level:1},
    skills:{calm:0, thoughts:0, courage:0, sleep:0, gratitude:0}
  };
  function load(){try{return Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||"{}"))}catch{return {...defaults}}}
  function save(s){localStorage.setItem(KEY,JSON.stringify(s)); renderHUD(); return s}
  function award(skill,xp=10,diamonds=5){
    const s=load(); s.xp=(s.xp||0)+xp; s.diamonds=(s.diamonds||0)+diamonds;
    if(skill) s.skills[skill]=(s.skills[skill]||0)+1;
    localStorage.setItem("bbb_diamonds",s.diamonds);
    save(s); toast(`+${xp} XP  +${diamonds} diamonds`);
    return s;
  }
  function checkin(label,emoji,note){
    const s=load(); const d=today();
    if(s.lastCheckin!==d){ s.streak=(s.lastCheckin && ((new Date(d)-new Date(s.lastCheckin))/86400000===1)) ? (s.streak||0)+1 : 1; }
    s.lastCheckin=d;
    s.moodLogs.unshift({date:d,label,emoji,note:(note||"").slice(0,500)});
    s.moodLogs=s.moodLogs.slice(0,60);
    save(s); award("calm",15,8);
  }
  function quest(title,skill,xp,diamonds){
    const s=load(); s.quests.unshift({title,skill,date:today(),xp,diamonds}); s.quests=s.quests.slice(0,80); save(s); return award(skill,xp,diamonds);
  }
  function progress(){const s=load(); return Math.min(100,Math.round((s.xp||0)/12));}
  function renderHUD(){
    const s=load();
    document.querySelectorAll("[data-bbb-xp]").forEach(e=>e.textContent=s.xp||0);
    document.querySelectorAll("[data-bbb-diamonds]").forEach(e=>e.textContent=s.diamonds||0);
    document.querySelectorAll("[data-bbb-streak]").forEach(e=>e.textContent=s.streak||0);
    document.querySelectorAll("[data-bbb-progress]").forEach(e=>e.style.width=progress()+"%");
    document.querySelectorAll("[data-bbb-companion]").forEach(e=>e.textContent=s.companion?.type==="fox"?"🦊":s.companion?.type==="axolotl"?"🩷":"🪨");
  }
  function toast(msg){
    let t=document.querySelector(".bbb-toast");
    if(!t){t=document.createElement("div");t.className="bbb-toast";document.body.appendChild(t)}
    t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2100);
  }
  function crisisCheck(text){
    const v=(text||"").toLowerCase();
    return /(kill myself|suicide|end my life|hurt myself|self harm|cut myself|want to die|don'?t want to live)/.test(v);
  }
  function safetyBox(){
    return `<div class="bbb-card bbb-safety"><h3>Safety Lantern</h3><p class="bbb-muted">If you might hurt yourself or someone else, get help from a trusted adult now. In the U.S. or Canada, call or text <strong>988</strong>. If there is immediate danger, call emergency services.</p><a class="bbb-btn gold" href="/safety.html">Open safety plan</a></div>`;
  }
  window.BBBWellness={load,save,award,checkin,quest,renderHUD,toast,crisisCheck,safetyBox,today};
  document.addEventListener("DOMContentLoaded",renderHUD);
})();
