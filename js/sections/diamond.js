// Diamond Mind Reset - Pixel heart affirmation builder
function renderDiamond(container) {
  const affirmations = [
    "You are worthy of peace and rest.",
    "Your feelings are valid. You are safe.",
    "Small steps forward still count.",
    "You have overcome hard things before.",
    "You deserve kindness — especially from yourself.",
    "Progress is not always visible, but it's happening.",
    "You are more resilient than you know.",
    "Today, existing is enough.",
    "Your mind deserves gentleness.",
    "You are not alone in this moment.",
  ];

  const heartPattern = [
    0,1,1,0,1,1,0,
    1,1,1,1,1,1,1,
    1,1,1,1,1,1,1,
    0,1,1,1,1,1,0,
    0,0,1,1,1,0,0,
    0,0,0,1,0,0,0,
    0,0,0,0,0,0,0,
  ];

  let litCount = 0;
  let currentAffIdx = 0;
  const totalLit = heartPattern.filter(v => v).length;

  container.innerHTML = `
    <div id="diamond-section" class="section-wrapper fade-in">
      <h2 class="section-title">💎 DIAMOND MIND RESET</h2>
      <p class="section-desc">Light up the heart, one pixel at a time. Each click reveals a truth about you.</p>
      <p class="diamond-progress" id="d-progress">0 / ${totalLit} pixels lit</p>
      <div class="heart-grid" id="d-heart"></div>
      <div class="affirmation-display" id="d-affirmation">Click any pixel to begin...</div>
      <button class="pixel-btn" style="--btn-bg:#0a2a40;--btn-border:#00e5ff;--btn-color:#00e5ff" onclick="resetHeart()">↺ RESET HEART</button>
    </div>
  `;

  const grid = document.getElementById('d-heart');
  const display = document.getElementById('d-affirmation');
  const progress = document.getElementById('d-progress');
  const cells = [];

  heartPattern.forEach((isHeart, i) => {
    const d = document.createElement('div');
    d.className = 'hpx' + (isHeart ? ' target' : '');
    if (isHeart) {
      d.addEventListener('click', () => {
        if (!d.classList.contains('lit')) {
          d.classList.add('lit');
          litCount++;
          progress.textContent = `${litCount} / ${totalLit} pixels lit`;
          const aff = affirmations[currentAffIdx % affirmations.length];
          currentAffIdx++;
          display.style.opacity = '0';
          setTimeout(() => {
            display.textContent = aff;
            display.style.opacity = '1';
          }, 200);
          // Flash effect
          d.style.animation = 'none';
          setTimeout(() => { d.style.animation = ''; }, 10);
          // Complete!
          if (litCount === totalLit) {
            setTimeout(() => {
              display.textContent = '✨ Your heart is whole. You are complete. ✨';
              display.style.color = '#fff';
            }, 500);
          }
        }
      });
    }
    grid.appendChild(d);
    cells.push(d);
  });

  window.resetHeart = function() {
    litCount = 0;
    currentAffIdx = 0;
    cells.forEach(c => c.classList.remove('lit'));
    display.textContent = 'Click any pixel to begin...';
    display.style.color = '#80f0ff';
    progress.textContent = `0 / ${totalLit} pixels lit`;
  };

  return () => { delete window.resetHeart; };
}
