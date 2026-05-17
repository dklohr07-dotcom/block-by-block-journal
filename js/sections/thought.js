// Thought Miner Cave - CBT thought reframing
function renderThought(container) {
  const prompts = [
    { question: "What thought is weighing on you right now?", reframe: "Let's dig deeper. What's the evidence FOR this thought being 100% true?" },
    { question: "Is this thought a FACT or a FEELING?", reframe: "Feelings are real, but they aren't always facts. What would you tell a friend thinking this?" },
    { question: "What's the WORST that could realistically happen?", reframe: "And if that happened... could you handle it? What would you do?" },
    { question: "What's a kinder, more balanced way to see this?", reframe: "That's the gold ore — a thought that's honest but gentler on you." },
  ];

  container.innerHTML = `
    <div id="thought-section" class="section-wrapper fade-in">
      <h2 class="section-title" style="color:#ce93d8">⛏ THOUGHT MINER CAVE</h2>
      <p class="section-desc">Mine through anxious thoughts and discover what's really ore-dinary underneath.</p>
      <div class="ore-label">THOUGHTS MINED</div>
      <div class="ore-counter" id="ore-counter"></div>
      <div class="cave-wall">
        <div class="cave-torch">🔥</div>
        <div class="thought-prompt" id="thought-q">Ready to mine your thoughts?</div>
        <textarea class="thought-textarea" id="thought-input" placeholder="Write your thought here... the cave is safe." rows="4"></textarea>
      </div>
      <button class="pixel-btn" style="--btn-bg:#0a0520;--btn-border:#9c27b0;--btn-color:#ce93d8" onclick="mineThought()">⛏ MINE THIS THOUGHT</button>
      <div class="feedback-box" id="thought-feedback" style="display:none;border-color:rgba(156,39,176,0.3);color:#e1bee7;background:rgba(156,39,176,0.07)"></div>
      <button class="pixel-btn" style="--btn-bg:#0a0520;--btn-border:#4a1a6b;--btn-color:#9c27b0;display:none" id="next-thought-btn" onclick="nextThought()">→ NEXT DEPTH</button>
    </div>
  `;

  const ORES = ['💎','🔮','💜','✨','🌟','🪩','💫'];
  let step = 0;
  let mined = 0;

  // Build ore counter
  const counter = document.getElementById('ore-counter');
  for (let i = 0; i < 7; i++) {
    const o = document.createElement('div');
    o.className = 'ore';
    o.textContent = ORES[i];
    o.id = `ore-${i}`;
    counter.appendChild(o);
  }

  function setPrompt(text) {
    const el = document.getElementById('thought-q');
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = text;
      el.style.transition = 'opacity 0.4s';
      el.style.opacity = '1';
    }, 300);
  }

  setPrompt(prompts[0].question);

  window.mineThought = function() {
    const input = document.getElementById('thought-input');
    const val = input.value.trim();
    if (!val) {
      input.placeholder = "The cave needs your words first... ⛏";
      input.style.borderColor = '#7b1fa2';
      return;
    }
    input.style.borderColor = '#9c27b0';

    const feedback = document.getElementById('thought-feedback');
    const nextBtn = document.getElementById('next-thought-btn');

    // Mine ore
    if (mined < 7) {
      document.getElementById(`ore-${mined}`).classList.add('mined');
      mined++;
    }

    // Show reframe
    feedback.style.display = 'flex';
    feedback.style.opacity = '0';
    const reframe = step < prompts.length ? prompts[step].reframe : "You've done deep work today. The cave has been cleared. 🌟";
    setTimeout(() => {
      feedback.textContent = reframe;
      feedback.style.transition = 'opacity 0.4s';
      feedback.style.opacity = '1';
    }, 200);

    step++;
    if (step < prompts.length) {
      nextBtn.style.display = 'block';
    } else {
      nextBtn.style.display = 'none';
      nextBtn.textContent = '✓ CAVE CLEARED';
      input.disabled = true;
      document.querySelector('[onclick="mineThought()"]').textContent = '✓ THOUGHTS MINED';
    }
  };

  window.nextThought = function() {
    if (step < prompts.length) {
      setPrompt(prompts[step].question);
      document.getElementById('thought-input').value = '';
      document.getElementById('thought-input').placeholder = "Go deeper...";
      document.getElementById('thought-feedback').style.display = 'none';
      document.getElementById('next-thought-btn').style.display = 'none';
    }
  };

  return () => {
    delete window.mineThought;
    delete window.nextThought;
  };
}
