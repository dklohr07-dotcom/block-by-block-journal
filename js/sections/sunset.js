// Sunset Reset - Gratitude & day reflection journaling
function renderSunset(container) {
  container.innerHTML = `
    <div id="sunset-section" class="section-wrapper fade-in">
      <h2 class="section-title" style="color:#ff7043">🌅 SUNSET RESET</h2>
      <p class="section-desc">As the sun sets on this day, reflect on what made it worth living. Even one small thing counts.</p>
      <div class="sunset-scene" id="sunset-scene">
        <div class="sky-gradient" id="sky"></div>
        <div class="horizon-line"></div>
        <div class="pixel-sun" id="pixel-sun" style="bottom:80px"></div>
        <div class="pixel-blocks">
          <div class="block grass"></div>
          <div class="block dirt"></div>
          <div class="block grass"></div>
          <div class="block water"></div>
          <div class="block water"></div>
          <div class="block grass"></div>
          <div class="block grass"></div>
          <div class="block dirt"></div>
          <div class="block grass"></div>
        </div>
      </div>
      <div class="journal-prompt">Today I am grateful for...</div>
      <div class="gratitude-list" id="gratitude-list">
        ${[1,2,3].map(n => `
          <div class="gratitude-item">
            <span class="gratitude-num">#${n}</span>
            <input type="text" class="gratitude-input" placeholder="One good thing..." id="grat-${n}">
            <span class="grat-check" id="gcheck-${n}" style="font-size:18px;opacity:0;transition:opacity 0.3s">✨</span>
          </div>
        `).join('')}
      </div>
      <button class="pixel-btn" style="--btn-bg:#1a0800;--btn-border:#ff7043;--btn-color:#ffab91;margin-top:16px" onclick="saveSunset()">🌅 SEAL THIS MOMENT</button>
      <div class="feedback-box" id="sunset-fb" style="display:none;border-color:rgba(255,112,67,0.3);color:#ffcc80;background:rgba(255,112,67,0.07)"></div>
      <div style="margin-top:20px">
        <div style="font-family:var(--pixel-font);font-size:8px;color:#ff7043;text-align:center;margin-bottom:10px">HOW WAS TODAY?</div>
        <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap">
          ${[
            {e:'😫',l:'Rough'},
            {e:'😔',l:'Hard'},
            {e:'😐',l:'Okay'},
            {e:'🙂',l:'Good'},
            {e:'😊',l:'Great'},
          ].map(({e,l},i) => `
            <div onclick="rateDay(${i})" id="day-rate-${i}" style="text-align:center;cursor:pointer;opacity:0.5;transition:all 0.2s;padding:8px">
              <div style="font-size:32px">${e}</div>
              <div style="font-family:var(--pixel-font);font-size:7px;color:#ff7043;margin-top:4px">${l}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div id="day-response" style="font-family:var(--vt-font);font-size:20px;color:#ffab91;text-align:center;margin-top:16px;min-height:40px;line-height:1.5"></div>
    </div>
  `;

  // Animate sun setting
  let sunPos = 80;
  const sun = document.getElementById('pixel-sun');
  const sunInterval = setInterval(() => {
    sunPos = Math.max(10, sunPos - 0.3);
    sun.style.bottom = sunPos + 'px';
  }, 200);

  const dayMessages = [
    "Even rough days show your strength. You made it through.",
    "Hard days are part of every journey. Tomorrow is new.",
    "Okay days happen. You showed up — that matters.",
    "A good day! You deserve to celebrate that.",
    "What a great day! Hold onto this feeling. ✨",
  ];

  window.rateDay = function(idx) {
    document.querySelectorAll('[id^="day-rate-"]').forEach((el, i) => {
      el.style.opacity = i === idx ? '1' : '0.3';
      el.style.transform = i === idx ? 'scale(1.2)' : 'scale(1)';
    });
    const resp = document.getElementById('day-response');
    resp.style.opacity = '0';
    setTimeout(() => {
      resp.textContent = dayMessages[idx];
      resp.style.transition = 'opacity 0.4s';
      resp.style.opacity = '1';
    }, 200);
  };

  // Listen for typing
  [1,2,3].forEach(n => {
    const input = document.getElementById(`grat-${n}`);
    const check = document.getElementById(`gcheck-${n}`);
    input.addEventListener('input', () => {
      check.style.opacity = input.value.trim() ? '1' : '0';
    });
  });

  const responses = [
    "Beautiful. These small lights carry you forward. 🌅",
    "You noticed goodness today. That's a superpower. ✨",
    "Gratitude is an act of courage. Well done. 🌟",
    "These moments are yours to keep. 💛",
  ];

  window.saveSunset = function() {
    const vals = [1,2,3].map(n => document.getElementById(`grat-${n}`).value.trim()).filter(Boolean);
    const fb = document.getElementById('sunset-fb');
    if (!vals.length) {
      fb.style.display = 'flex';
      fb.textContent = "Add even one small thing — it counts more than you know.";
      return;
    }
    fb.style.display = 'flex';
    fb.style.opacity = '0';
    fb.textContent = responses[Math.floor(Math.random() * responses.length)];
    setTimeout(() => { fb.style.transition = 'opacity 0.4s'; fb.style.opacity = '1'; }, 100);

    // Animate sky lighter briefly
    const sky = document.getElementById('sky');
    sky.style.background = 'linear-gradient(to bottom, #2a0414 0%, #6d1800 40%, #c44000 70%, #ff7043 100%)';
    setTimeout(() => {
      sky.style.transition = 'background 3s ease';
      sky.style.background = 'linear-gradient(to bottom, #1a0210 0%, #3d0c00 40%, #8b2500 70%, #bf4c00 85%, #e65100 100%)';
    }, 1000);
  };

  return () => {
    clearInterval(sunInterval);
    delete window.rateDay;
    delete window.saveSunset;
  };
}
