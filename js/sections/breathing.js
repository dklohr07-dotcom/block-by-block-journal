// Breathing Blocks - Box breathing exercise
function renderBreathing(container) {
  const phases = [
    { name: 'INHALE', duration: 4, color: '#4fc3f7', instruction: 'Breathe in slowly...', scale: 1.3 },
    { name: 'HOLD', duration: 4, color: '#b3e5fc', instruction: 'Hold your breath...', scale: 1.3 },
    { name: 'EXHALE', duration: 6, color: '#0288d1', instruction: 'Breathe out gently...', scale: 0.8 },
    { name: 'REST', duration: 2, color: '#78909c', instruction: 'Rest...', scale: 0.8 },
  ];

  container.innerHTML = `
    <div id="breathing-section" class="section-wrapper fade-in">
      <h2 class="section-title">🧊 BREATHING BLOCKS</h2>
      <p class="section-desc">Let the cube guide your breath. Box breathing calms the nervous system in minutes.</p>
      <div class="breathing-cube-wrapper">
        <div class="big-cube" id="breath-cube">
          <div class="big-cube-inner" id="cube-inner">
            <div class="bcf front"></div>
            <div class="bcf back"></div>
            <div class="bcf left"></div>
            <div class="bcf right"></div>
            <div class="bcf top"></div>
            <div class="bcf bottom"></div>
          </div>
        </div>
        <div class="breathing-label" id="breath-phase">Press START to begin</div>
        <div class="breathing-timer" id="breath-timer"></div>
        <div class="breathing-instruction" id="breath-instruction">Box breathing: inhale, hold, exhale, rest</div>
        <div class="breath-cycle-bar">
          <div class="breath-cycle-fill" id="breath-fill" style="width:0%"></div>
        </div>
      </div>
      <button class="pixel-btn" style="--btn-bg:#061830;--btn-border:#4fc3f7;--btn-color:#4fc3f7" id="breath-btn" onclick="toggleBreathing()">▶ START</button>
      <div class="feedback-box" id="breath-feedback" style="border-color:rgba(79,195,247,0.2);color:#b3e5fc">
        Focus on the cube. Let each breath slow your thoughts.
      </div>
    </div>
  `;

  let running = false;
  let phaseIndex = 0;
  let timer = null;
  let tickInterval = null;
  let elapsed = 0;
  let cycleCount = 0;

  const cubeInner = document.getElementById('cube-inner');
  const phaseEl = document.getElementById('breath-phase');
  const timerEl = document.getElementById('breath-timer');
  const instrEl = document.getElementById('breath-instruction');
  const fillEl = document.getElementById('breath-fill');
  const btn = document.getElementById('breath-btn');
  const feedback = document.getElementById('breath-feedback');

  function runPhase(idx) {
    const phase = phases[idx];
    phaseEl.textContent = phase.name;
    phaseEl.style.color = phase.color;
    instrEl.textContent = phase.instruction;
    fillEl.style.background = phase.color;
    fillEl.style.boxShadow = `0 0 8px ${phase.color}`;
    elapsed = 0;

    // Scale cube
    const faces = document.querySelectorAll('.bcf');
    faces.forEach(f => f.style.borderColor = phase.color);

    // Animation speed change
    const s = phase.scale;
    cubeInner.style.transform = `scale(${s})`;
    cubeInner.style.transition = `transform ${phase.duration * 0.8}s ease-in-out`;

    // Tick countdown
    tickInterval = setInterval(() => {
      elapsed += 0.1;
      timerEl.textContent = Math.ceil(phase.duration - elapsed);
      const pct = (elapsed / phase.duration) * 100;
      fillEl.style.width = Math.min(pct, 100) + '%';
    }, 100);

    timer = setTimeout(() => {
      clearInterval(tickInterval);
      phaseIndex = (phaseIndex + 1) % phases.length;
      if (phaseIndex === 0) {
        cycleCount++;
        feedback.textContent = `✨ Cycle ${cycleCount} complete. You're doing great.`;
        if (cycleCount >= 4) {
          feedback.textContent = '🌟 Amazing! You\'ve completed 4 cycles. Take a moment to notice how you feel.';
        }
      }
      if (running) runPhase(phaseIndex);
    }, phase.duration * 1000);
  }

  window.toggleBreathing = function() {
    if (!running) {
      running = true;
      btn.textContent = '⏸ PAUSE';
      phaseIndex = 0;
      runPhase(phaseIndex);
    } else {
      running = false;
      clearTimeout(timer);
      clearInterval(tickInterval);
      btn.textContent = '▶ RESUME';
      phaseEl.textContent = 'PAUSED';
      cubeInner.style.transform = 'scale(1)';
    }
  };

  return () => {
    running = false;
    clearTimeout(timer);
    clearInterval(tickInterval);
    delete window.toggleBreathing;
  };
}
