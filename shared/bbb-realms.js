(function(){
  window.BBBRealms = window.BBBRealms || {};

  const SOUND_BASE = "/public/sounds/";
  const files = {
    forest: "ES_Ambience, Birdsong, Birds Chirping, Seagulls, Insects In Background - Epidemic Sound.mp3",
    beach: "ES_Water, Wave, Ocean, Big Waves, Crashing In On Beach, Swells 01 - Epidemic Sound.mp3",
    snow: "ES_Wind, Designed, Swirling Wind, Howling - Epidemic Sound.mp3",
    desert: "ES_Wind, General, Wind, Soft Tree Foliage - Epidemic Sound.mp3",
    mushroom: "ES_Musical, Chime, Windchime, Large, Metal, Resonant, Major, Gentle, Isolated - Epidemic Sound.mp3",
    caves: "ES_Water, Drip, Reverberant Echo, Cave, Cavern - Epidemic Sound.mp3",
    rain: "ES_Weather, Thunder, Light Rain - Epidemic Sound.mp3",
    campfire: "ES_Fire, Burning, Fireplace, Outdoor, Seaside, Plank Firewood Burning Slow, Few Crackles, Seagulls, Birds, Boat In Background, Slight Distance - Epidemic Sound.mp3",
    mine: "ES_Rocks, Crash & Debris, Building Block, Big, Throw On Asphalt, Hit Medium Block Pieces - Epidemic Sound.mp3",
    chime: "ES_Musical, Chime, Windchime, Large, Metal, Resonant, Major, Gentle, Isolated - Epidemic Sound.mp3"
  };

  let currentTrack = null;

  function playFile(key, options){
    const src = files[key];
    if (!src) return null;
    if (currentTrack) {
      currentTrack.pause();
      currentTrack.currentTime = 0;
    }
    const audio = new Audio(SOUND_BASE + encodeURIComponent(src));
    audio.loop = !!(options && options.loop);
    audio.volume = (options && options.volume) || 0.42;
    currentTrack = audio;
    audio.play().catch(()=>{});
    return audio;
  }

  function ctx(){
    const C = window.AudioContext || window.webkitAudioContext;
    if(!C) return null;
    if(!window.__bbbAudio) window.__bbbAudio = new C();
    return window.__bbbAudio;
  }

  function chime(){
    playFile("chime", {volume:.34});
    const c=ctx(); if(!c) return;
    [660,880,1174].forEach((f,i)=>{
      const o=c.createOscillator(),g=c.createGain();
      o.frequency.value=f;
      g.gain.setValueAtTime(.001,c.currentTime+i*.08);
      g.gain.exponentialRampToValueAtTime(.06,c.currentTime+i*.08+.02);
      g.gain.exponentialRampToValueAtTime(.001,c.currentTime+i*.08+.45);
      o.connect(g); g.connect(c.destination);
      o.start(c.currentTime+i*.08); o.stop(c.currentTime+i*.08+.5);
    });
  }

  function crackle(){ playFile("campfire", {loop:true, volume:.32}); }
  function rain(){ playFile("rain", {loop:true, volume:.34}); }
  function thunder(){ playFile("rain", {loop:false, volume:.62}); }
  function mine(){ playFile("mine", {volume:.55}); }
  function ambient(kind){ playFile(kind || "forest", {loop:true, volume:.38}); }
  function stop(){ if(currentTrack){ currentTrack.pause(); currentTrack.currentTime=0; currentTrack=null; } }

  window.BBBRealms.sound = { rain, thunder, chime, crackle, mine, ambient, stop, files };

  window.BBBRealms.addDiamonds=function(n){
    const key='bbb_diamonds';
    const next=parseInt(localStorage.getItem(key)||'250',10)+n;
    localStorage.setItem(key,next);
    document.querySelectorAll('[data-diamonds]').forEach(e=>e.textContent=next);
    chime();
    return next;
  };

  addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('[data-diamonds]').forEach(e=>e.textContent=localStorage.getItem('bbb_diamonds')||'250');
    document.querySelectorAll('[data-sound]').forEach(el=>{
      el.addEventListener('click',()=>ambient(el.dataset.sound));
    });
  });
})();