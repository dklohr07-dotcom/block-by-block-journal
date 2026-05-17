// App Controller
const sections = {
  diamond: renderDiamond,
  breathing: renderBreathing,
  thought: renderThought,
  campfire: renderCampfire,
  forest: renderForest,
  sunset: renderSunset,
  rain: renderRain,
  biome: renderBiome,
  deep: renderDeep,
};

let currentCleanup = null;

// Build pixel heart preview on hub
(function buildHubHeart() {
  const pattern = [
    0,1,1,0,1,1,0,
    1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,
    0,1,1,1,1,1,0,
    0,0,1,1,1,0,0,
    0,0,0,1,0,0,0,
    0,0,0,0,0,0,0,
  ];
  const container = document.getElementById('heart-preview');
  if (!container) return;
  pattern.forEach(v => {
    const d = document.createElement('div');
    d.className = 'hp ' + (v ? 'on' : 'off');
    container.appendChild(d);
  });
})();

// Build rain drops on hub preview
(function buildRainPreview() {
  const c = document.getElementById('rain-preview-drops');
  if (!c) return;
  for (let i = 0; i < 12; i++) {
    const d = document.createElement('div');
    d.style.cssText = `
      position:absolute;
      width:1px;height:${6+Math.random()*8}px;
      background:rgba(144,164,174,0.5);
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      animation:rain-fall ${(0.6+Math.random()*0.8).toFixed(2)}s linear infinite;
      animation-delay:${(Math.random()*1.5).toFixed(2)}s;
    `;
    c.appendChild(d);
  }
  // Add keyframes
  if (!document.getElementById('rain-kf')) {
    const s = document.createElement('style');
    s.id = 'rain-kf';
    s.textContent = `@keyframes rain-fall{0%{transform:translateY(-20px);opacity:0}50%{opacity:0.8}100%{transform:translateY(40px);opacity:0}}`;
    document.head.appendChild(s);
  }
})();

// Card click handler
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const sec = card.dataset.section;
    if (sections[sec]) {
      openSection(sec);
    }
  });
});

function openSection(name) {
  const hub = document.getElementById('hub-screen');
  const sec = document.getElementById('section-screen');
  const content = document.getElementById('section-content');

  if (currentCleanup) { currentCleanup(); currentCleanup = null; }
  content.innerHTML = '';

  hub.classList.remove('active');
  sec.classList.add('active');

  window.scrollTo(0, 0);

  const cleanup = sections[name](content);
  if (typeof cleanup === 'function') currentCleanup = cleanup;
}

function goBack() {
  if (currentCleanup) { currentCleanup(); currentCleanup = null; }
  const hub = document.getElementById('hub-screen');
  const sec = document.getElementById('section-screen');
  sec.classList.remove('active');
  hub.classList.add('active');
  document.getElementById('section-content').innerHTML = '';
  window.scrollTo(0, 0);
}
