// Campfire Reflection - Guided journaling with animated fire
function renderCampfire(container) {
  const questions = [
    "What is one thing you can let go of tonight?",
    "What made you smile recently, even a little?",
    "If the fire could burn away one worry, which would you choose?",
    "What is one thing you did today that took courage?",
    "Name something you're looking forward to.",
    "What would you tell someone you love who felt the way you do now?",
    "What does your body need right now?",
  ];

  container.innerHTML = `
    <div id="campfire-section" class="section-wrapper fade-in">
      <h2 class="section-title" style="color:#ff9800">🔥 CAMPFIRE REFLECTION</h2>
      <p class="section-desc">Sit by the campfire. Let your thoughts float up like sparks into the night.</p>
      <div class="campfire-scene" id="camp-scene">
        <div class="big-fire" id="big-fire">
          <div class="big-flame bf1"></div>
          <div class="big-flame bf2"></div>
          <div class="big-flame bf3"></div>
          <div class="big-flame bf4"></div>
        </div>
        <div class="logs">
          <div class="log"></div>
          <div class="log"></div>
          <div class="log"></div>
        </div>
      </div>
      <div class="campfire-prompt" id="camp-question">${questions[0]}</div>
      <textarea class="pixel-input" id="camp-input" placeholder="Let your thoughts flow like firelight..." rows="4" style="font-size:18px;height:100px;resize:none;max-width:440px;display:block;margin:0 auto 12px"></textarea>
      <button class="pixel-btn" style="--btn-bg:#1a0800;--btn-border:#ff9800;--btn-color:#ffca28" onclick="sendToFire()">🔥 RELEASE TO FIRE</button>
      <button class="pixel-btn" style="--btn-bg:#0d0500;--btn-border:#5d3a1a;--btn-color:#ff9800" onclick="nextCampQuestion()">→ NEW REFLECTION</button>
      <div class="feedback-box" id="camp-feedback" style="display:none;border-color:rgba(255,152,0,0.3);color:#ffcc80;background:rgba(255,152,0,0.07)"></div>
    </div>
  `;

  let qIdx = Math.floor(Math.random() * questions.length);
  const scene = document.getElementById('camp-scene');

  // Create sparks
  function spawnSpark() {
    const spark = document.createElement('div');
    spark.className = 'spark';
    const x = (Math.random() - 0.5) * 80;
    const y = -(40 + Math.random() * 60);
    const dur = (1 + Math.random() * 1.5).toFixed(2);
    spark.style.cssText = `
      left:${50 + (Math.random()-0.5)*30}%;
      bottom:${30 + Math.random()*20}px;
      --spark-x:${x}px;
      --spark-y:${y}px;
      --spark-dur:${dur}s;
    `;
    scene.appendChild(spark);
    setTimeout(() => spark.remove(), parseFloat(dur) * 1000);
  }

  const sparkInterval = setInterval(spawnSpark, 400);

  const affirm = [
    "That took courage to put into words. 🔥",
    "The fire holds it now. You can breathe. ✨",
    "Your words matter. You matter. 🌟",
    "Releasing is a form of strength. 💫",
    "You showed up for yourself today. That counts. 🧡",
  ];

  window.sendToFire = function() {
    const input = document.getElementById('camp-input');
    const val = input.value.trim();
    if (!val) { input.placeholder = 'The fire waits for your words...'; return; }

    const fb = document.getElementById('camp-feedback');
    fb.style.display = 'flex';
    fb.style.opacity = '0';
    fb.textContent = affirm[Math.floor(Math.random() * affirm.length)];
    setTimeout(() => {
      fb.style.transition = 'opacity 0.4s';
      fb.style.opacity = '1';
    }, 100);

    // Big spark burst
    for (let i = 0; i < 12; i++) {
      setTimeout(spawnSpark, i * 80);
    }
    input.value = '';
    input.placeholder = 'What else do you want to release?';
  };

  window.nextCampQuestion = function() {
    qIdx = (qIdx + 1) % questions.length;
    const el = document.getElementById('camp-question');
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = questions[qIdx];
      el.style.transition = 'opacity 0.4s';
      el.style.opacity = '1';
    }, 300);
    document.getElementById('camp-feedback').style.display = 'none';
  };

  return () => {
    clearInterval(sparkInterval);
    delete window.sendToFire;
    delete window.nextCampQuestion;
  };
}
