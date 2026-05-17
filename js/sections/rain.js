// Rain Room Realm - Animated rain canvas + meditation guide
function renderRain(container) {
  const meditations = [
    "Close your eyes. Each drop of rain carries away one anxious thought. Let it go.",
    "The rain doesn't judge. It simply falls. You can simply be — without judgment.",
    "Notice the rhythm of rain. Breathe in sync with it. Slow. Even. Steady.",
    "Rain nourishes what it touches. You are being nourished right now.",
    "The storm always passes. You are watching it go from a safe place.",
    "Each raindrop is complete. So are you — exactly as you are in this moment.",
  ];

  container.innerHTML = `
    <div id="rain-section" class="section-wrapper fade-in">
      <h2 class="section-title" style="color:#90a4ae">🌧️ RAIN ROOM REALM</h2>
      <p class="section-desc">Sit in the rain room. Let the steady rhythm reset your mind.</p>
      <div class="rain-canvas-wrap">
        <canvas id="rain-canvas"></canvas>
      </div>
      <div class="rain-controls">
        <label class="rain-ctrl-label">
          INTENSITY
          <input type="range" id="rain-intensity" min="20" max="150" value="60">
        </label>
        <label class="rain-ctrl-label">
          SPEED
          <input type="range" id="rain-speed" min="2" max="12" value="5">
        </label>
        <label class="rain-ctrl-label">
          WIND
          <input type="range" id="rain-wind" min="-3" max="3" value="0">
        </label>
      </div>
      <div class="meditation-guide" id="med-guide">${meditations[0]}</div>
      <button class="pixel-btn" style="--btn-bg:#07131e;--btn-border:#90a4ae;--btn-color:#b0bec5;margin-top:12px" onclick="nextMeditation()">🌧️ NEXT REFLECTION</button>
      <div style="margin-top:16px">
        <div style="font-family:var(--pixel-font);font-size:8px;color:#90a4ae;text-align:center;margin-bottom:10px">TAP THE RAIN TO ADD RIPPLES</div>
      </div>
    </div>
  `;

  const canvas = document.getElementById('rain-canvas');
  const wrap = canvas.parentElement;
  canvas.width = wrap.clientWidth;
  canvas.height = wrap.clientHeight;
  const ctx = canvas.getContext('2d');

  let drops = [];
  let ripples = [];
  let animId;

  function makeDrops(count, speed, wind) {
    drops = [];
    for (let i = 0; i < count; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        len: 8 + Math.random() * 16,
        speed: speed * (0.5 + Math.random()),
        wind: wind,
        alpha: 0.3 + Math.random() * 0.5,
      });
    }
  }

  let intensity = 60, speed = 5, wind = 0;
  makeDrops(intensity, speed, wind);

  document.getElementById('rain-intensity').addEventListener('input', e => {
    intensity = parseInt(e.target.value);
    makeDrops(intensity, speed, wind);
  });
  document.getElementById('rain-speed').addEventListener('input', e => {
    speed = parseInt(e.target.value);
    drops.forEach(d => d.speed = speed * (0.5 + Math.random()));
  });
  document.getElementById('rain-wind').addEventListener('input', e => {
    wind = parseInt(e.target.value);
    drops.forEach(d => d.wind = wind);
  });

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    ripples.push({ x, y, r: 2, maxR: 40, alpha: 0.8 });
  });
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const t = e.touches[0];
    const x = (t.clientX - rect.left) * (canvas.width / rect.width);
    const y = (t.clientY - rect.top) * (canvas.height / rect.height);
    ripples.push({ x, y, r: 2, maxR: 40, alpha: 0.8 });
  }, {passive:false});

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#020d18';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rain drops
    drops.forEach(d => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(144, 164, 174, ${d.alpha})`;
      ctx.lineWidth = 1;
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x + d.wind * 2, d.y + d.len);
      ctx.stroke();

      d.y += d.speed;
      d.x += d.wind * 0.5;

      if (d.y > canvas.height) {
        d.y = -d.len;
        d.x = Math.random() * canvas.width;
        // Random small ripple at bottom
        if (Math.random() > 0.7) {
          ripples.push({ x: d.x, y: canvas.height - 2, r: 1, maxR: 12, alpha: 0.4 });
        }
      }
      if (d.x > canvas.width) d.x = 0;
      if (d.x < 0) d.x = canvas.width;
    });

    // Ripples
    ripples = ripples.filter(r => r.r < r.maxR);
    ripples.forEach(r => {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(144, 164, 174, ${r.alpha * (1 - r.r / r.maxR)})`;
      ctx.lineWidth = 1;
      ctx.ellipse(r.x, r.y, r.r, r.r * 0.3, 0, 0, Math.PI * 2);
      ctx.stroke();
      r.r += 0.8;
    });

    animId = requestAnimationFrame(draw);
  }
  draw();

  let medIdx = 0;
  window.nextMeditation = function() {
    medIdx = (medIdx + 1) % meditations.length;
    const el = document.getElementById('med-guide');
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = meditations[medIdx];
      el.style.transition = 'opacity 0.6s';
      el.style.opacity = '1';
    }, 300);
  };

  return () => {
    cancelAnimationFrame(animId);
    delete window.nextMeditation;
  };
}
