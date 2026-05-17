// Biome Shift Portal - Perspective shift & affirmations by biome
function renderBiome(container) {
  const biomes = [
    {
      id: 'mountain', icon: '🏔️', name: 'MOUNTAIN\nSTRENGTH',
      color: '#78909c', bg: 'linear-gradient(to bottom, #1a1a2e, #263238)',
      affirmations: [
        "You are immovable. Storms pass, but you remain.",
        "The higher you climb, the stronger you become.",
        "Every summit was once a place no one had stood. You're breaking ground.",
        "Mountains don't rush their formation. Neither must you.",
      ]
    },
    {
      id: 'ocean', icon: '🌊', name: 'OCEAN\nFLOW',
      color: '#0288d1', bg: 'linear-gradient(to bottom, #001a2e, #01579b)',
      affirmations: [
        "You are deep beyond measure. Waves are only the surface.",
        "Ebb and flow — both are natural. Your low tides will rise.",
        "The ocean doesn't apologize for its size. Neither should you.",
        "Even the ocean needs to touch the shore sometimes. Rest is okay.",
      ]
    },
    {
      id: 'desert', icon: '🏜️', name: 'DESERT\nRESILIENCE',
      color: '#ff8f00', bg: 'linear-gradient(to bottom, #1a0800, #4e2500)',
      affirmations: [
        "Survival in the desert is not luck — it's strength you've built.",
        "The cactus blooms most beautifully after the hardest drought.",
        "Solitude is not emptiness. It is space to hear yourself.",
        "You have endured harsh things. That is not weakness — it is wisdom.",
      ]
    },
    {
      id: 'space', icon: '🌌', name: 'SPACE\nPEACE',
      color: '#ce93d8', bg: 'linear-gradient(to bottom, #050015, #1a0a3e)',
      affirmations: [
        "You are made of stardust. Literally. You belong to something vast.",
        "In the infinite universe, this moment is the only one exactly like it.",
        "Space is mostly empty — and that emptiness makes the stars more beautiful.",
        "You are a rare thing. This exact version of you has never existed before.",
      ]
    },
  ];

  container.innerHTML = `
    <div id="biome-section" class="section-wrapper fade-in">
      <h2 class="section-title" style="color:#ce93d8">🌀 BIOME SHIFT PORTAL</h2>
      <p class="section-desc">Step through the portal to a new perspective. Each biome holds a different truth for you.</p>
      <div class="portal-scene">
        <div class="big-portal" id="big-portal">
          <div class="portal-frame"></div>
        </div>
      </div>
      <div style="font-family:var(--pixel-font);font-size:8px;color:#ce93d8;text-align:center;margin-bottom:12px">CHOOSE YOUR REALM</div>
      <div class="biome-cards">
        ${biomes.map(b => `
          <div class="biome-card" id="biome-${b.id}" onclick="selectBiome('${b.id}')">
            <span class="biome-icon">${b.icon}</span>
            <span class="biome-name">${b.name}</span>
          </div>
        `).join('')}
      </div>
      <div class="biome-affirmation" id="biome-aff">Choose a realm to receive its wisdom...</div>
      <button class="pixel-btn" style="--btn-bg:#120520;--btn-border:#9c27b0;--btn-color:#ce93d8;display:none;margin-top:12px" id="biome-next-btn" onclick="nextBiomeAff()">→ NEXT TRUTH</button>
    </div>
  `;

  let currentBiome = null;
  let affIdx = 0;

  window.selectBiome = function(id) {
    const biome = biomes.find(b => b.id === id);
    if (!biome) return;

    document.querySelectorAll('.biome-card').forEach(c => c.classList.remove('selected'));
    document.getElementById(`biome-${id}`).classList.add('selected');

    currentBiome = biome;
    affIdx = 0;

    // Portal color shift
    const portal = document.getElementById('big-portal');
    portal.style.background = biome.bg;
    portal.style.boxShadow = `0 0 40px ${biome.color}, 0 0 80px ${biome.color}55`;

    // Section bg
    document.getElementById('biome-section').style.background = biome.bg;

    showBiomeAff();
    document.getElementById('biome-next-btn').style.display = 'block';
  };

  function showBiomeAff() {
    const el = document.getElementById('biome-aff');
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = currentBiome.affirmations[affIdx];
      el.style.borderColor = `rgba(${hexToRgb(currentBiome.color)}, 0.3)`;
      el.style.color = currentBiome.color;
      el.style.transition = 'opacity 0.5s';
      el.style.opacity = '1';
    }, 200);
  }

  window.nextBiomeAff = function() {
    if (!currentBiome) return;
    affIdx = (affIdx + 1) % currentBiome.affirmations.length;
    showBiomeAff();
  };

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '206,147,216';
    return `${parseInt(result[1],16)},${parseInt(result[2],16)},${parseInt(result[3],16)}`;
  }

  return () => {
    delete window.selectBiome;
    delete window.nextBiomeAff;
  };
}
