// Forest Whisper - Grounding exercise with nature sounds simulation
function renderForest(container) {
  const poems = [
    `The forest doesn't rush.\nNeither must you.\nYour roots run deep,\neven when you can't feel them.`,
    `You are part of something vast.\nThe trees know stillness.\nToday, you can too.`,
    `Every leaf falls in its own time.\nYour pace is perfect\nfor where you are right now.`,
    `In the forest, there is no wrong way to grow.\nYou are reaching toward light,\neven now.`,
    `The moss doesn't worry.\nThe stream doesn't hurry.\nYou are nature too.`,
  ];

  const groundingItems = [
    { prompt: "5 things you can SEE", icon: "👁️", color: "#66bb6a" },
    { prompt: "4 things you can TOUCH", icon: "✋", color: "#a5d6a7" },
    { prompt: "3 things you can HEAR", icon: "👂", color: "#81c784" },
    { prompt: "2 things you can SMELL", icon: "👃", color: "#4caf50" },
    { prompt: "1 thing you can TASTE", icon: "👅", color: "#c8e6c9" },
  ];

  container.innerHTML = `
    <div id="forest-section" class="section-wrapper fade-in">
      <h2 class="section-title" style="color:#66bb6a">🌲 FOREST WHISPER</h2>
      <p class="section-desc">Ground yourself in the present moment using your 5 senses — the forest way.</p>
      <div class="forest-scene">
        <div class="forest-bg"></div>
        <div class="fireflies" id="ff-container"></div>
        <div class="forest-trees">
          <span class="big-tree bt1">🌲</span>
          <span class="big-tree bt3">🌿</span>
          <span class="big-tree bt2">🌲</span>
          <span class="big-tree bt4">🌳</span>
          <span class="big-tree bt1">🌲</span>
        </div>
      </div>
      <div id="grounding-area">
        <div style="font-family:var(--pixel-font);font-size:8px;color:#66bb6a;text-align:center;margin-bottom:12px">
          5-4-3-2-1 GROUNDING EXERCISE
        </div>
        <div id="grounding-steps"></div>
        <button class="pixel-btn" style="--btn-bg:#031508;--btn-border:#66bb6a;--btn-color:#a5d6a7;margin-top:12px" onclick="nextGrounding()">🌿 NEXT SENSE</button>
      </div>
      <div class="sound-select-label" style="margin-top:20px">FOREST AMBIENCE</div>
      <div class="sound-btns">
        <button class="sound-btn" onclick="toggleAmbience('rain')" id="amb-rain">🌧️ Rain</button>
        <button class="sound-btn" onclick="toggleAmbience('wind')" id="amb-wind">🍃 Wind</button>
        <button class="sound-btn" onclick="toggleAmbience('birds')" id="amb-birds">🐦 Birds</button>
        <button class="sound-btn" onclick="toggleAmbience('stream')" id="amb-stream">💧 Stream</button>
      </div>
      <div class="nature-poem" id="nature-poem">${poems[0]}</div>
      <button class="pixel-btn" style="--btn-bg:#031508;--btn-border:#388e3c;--btn-color:#66bb6a;margin-top:8px" onclick="nextPoem()">🍃 NEW WHISPER</button>
    </div>
  `;

  // Fireflies
  const ffContainer = document.getElementById('ff-container');
  for (let i = 0; i < 12; i++) {
    const f = document.createElement('div');
    f.className = 'firefly';
    f.style.cssText = `
      left:${5 + Math.random()*90}%;
      top:${10 + Math.random()*70}%;
      --ff-dur:${(3+Math.random()*4).toFixed(1)}s;
      --ff-delay:${(Math.random()*5).toFixed(1)}s;
      --ff-x:${((Math.random()-0.5)*60).toFixed(0)}px;
      --ff-y:${((Math.random()-0.5)*40).toFixed(0)}px;
    `;
    ffContainer.appendChild(f);
  }

  // Grounding
  let groundIdx = 0;
  const stepsEl = document.getElementById('grounding-steps');

  function renderGrounding() {
    const g = groundingItems[groundIdx];
    stepsEl.innerHTML = `
      <div style="background:rgba(102,187,106,0.08);border:2px solid rgba(102,187,106,0.3);border-radius:12px;padding:16px;max-width:400px;margin:0 auto;text-align:center">
        <div style="font-size:36px;margin-bottom:8px">${g.icon}</div>
        <div style="font-family:var(--pixel-font);font-size:9px;color:${g.color};margin-bottom:12px">${g.prompt}</div>
        ${[...Array(parseInt(g.prompt[0]))].map((_, i) => `
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <span style="font-family:var(--pixel-font);font-size:8px;color:${g.color};min-width:20px">${i+1}.</span>
            <input type="text" class="pixel-input" placeholder="Name one..." style="margin:0;font-size:18px;padding:8px 12px;max-width:none;flex:1;border-color:rgba(102,187,106,0.3)">
          </div>
        `).join('')}
        <div style="font-family:var(--vt-font);font-size:16px;color:#4a7a4a;margin-top:8px">${groundIdx + 1} of 5</div>
      </div>
    `;
  }
  renderGrounding();

  window.nextGrounding = function() {
    groundIdx = (groundIdx + 1) % groundingItems.length;
    stepsEl.style.opacity = '0';
    setTimeout(() => {
      renderGrounding();
      stepsEl.style.transition = 'opacity 0.4s';
      stepsEl.style.opacity = '1';
    }, 200);
  };

  // Poem
  let poemIdx = 0;
  window.nextPoem = function() {
    poemIdx = (poemIdx + 1) % poems.length;
    const el = document.getElementById('nature-poem');
    el.style.opacity = '0';
    setTimeout(() => {
      el.textContent = poems[poemIdx];
      el.style.transition = 'opacity 0.6s';
      el.style.opacity = '1';
    }, 300);
  };

  // Ambience toggle (visual only - audio API not required)
  let activeAmb = null;
  window.toggleAmbience = function(type) {
    document.querySelectorAll('.sound-btn').forEach(b => b.classList.remove('active'));
    if (activeAmb !== type) {
      document.getElementById(`amb-${type}`).classList.add('active');
      activeAmb = type;
      // Visual feedback for ambience
      const msgs = {
        rain: '🌧️ Imagine gentle rain on leaves...',
        wind: '🍃 Feel the cool breeze through the canopy...',
        birds: '🐦 Morning birds calling in the distance...',
        stream: '💧 A clear stream bubbling nearby...'
      };
      document.getElementById('nature-poem').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('nature-poem').style.transition = 'opacity 0.4s';
        document.getElementById('nature-poem').style.opacity = '1';
      }, 300);
    } else {
      activeAmb = null;
    }
  };

  return () => {
    delete window.nextGrounding;
    delete window.nextPoem;
    delete window.toggleAmbience;
  };
}
