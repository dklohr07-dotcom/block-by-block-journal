// Deep Cave Calm - Mood check-in & coping toolkit
function renderDeep(container) {
  const moodResponses = [
    {
      mood: "😫", label: "Struggling",
      message: "You're allowed to struggle. It doesn't make you weak — it makes you human. Let's breathe first. Inhale for 4 counts. Hold for 4. Exhale for 4. You can do this.",
      tools: ['breathing', 'grounding', 'body', 'kind']
    },
    {
      mood: "😔", label: "Low",
      message: "Feeling low is part of the human experience. You don't have to fix it right now. Just acknowledge it without judgment. The crystals shine in the dark — so can you.",
      tools: ['writing', 'kind', 'walk', 'hydrate']
    },
    {
      mood: "😐", label: "Neutral",
      message: "A neutral day is a canvas. You don't have to feel great to take one small step forward. What one tiny thing would add a little sparkle to this moment?",
      tools: ['music', 'move', 'connect', 'create']
    },
    {
      mood: "🙂", label: "Okay",
      message: "Okay is underrated. Steady, manageable, present — that's actually a good place to be. What helped you feel this way today? Try to remember it.",
      tools: ['gratitude', 'rest', 'move', 'connect']
    },
    {
      mood: "😊", label: "Good",
      message: "Your good energy is real and it matters. Savor this feeling — notice exactly where you feel it in your body. This is yours to keep.",
      tools: ['gratitude', 'share', 'create', 'move']
    },
  ];

  const copingTools = {
    breathing: { icon: '🫁', name: 'BOX\nBREATHING', desc: 'Inhale 4 → Hold 4 → Exhale 4 → Rest 2. Repeat 4 times. This signals safety to your nervous system.' },
    grounding: { icon: '🌱', name: '5-4-3-2-1\nGROUNDING', desc: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Anchors you to now.' },
    body: { icon: '💪', name: 'BODY\nSCAN', desc: 'From your toes upward, notice each part of your body. Release tension as you go. No judgment.' },
    kind: { icon: '💌', name: 'SELF\nCOMPASSION', desc: 'Put your hand on your heart. Say: "This is a moment of suffering. Suffering is part of life. May I be kind to myself."' },
    writing: { icon: '📓', name: 'BRAIN\nDUMP', desc: 'Write everything in your head — no filter, no judgment. Then close it. The page holds it, not you.' },
    walk: { icon: '🚶', name: 'MINDFUL\nWALK', desc: 'Take 5 minutes outside. Focus only on what your feet feel and what you see. No phone.' },
    hydrate: { icon: '💧', name: 'HYDRATE\n& RESET', desc: 'Drink a full glass of water slowly. Your brain is often dehydrated when you feel low. It helps.' },
    music: { icon: '🎵', name: 'MOOD\nMUSIC', desc: 'Put on one song that matches how you want to feel, not how you do feel. Let it lead you.' },
    move: { icon: '🏃', name: 'MOVE\nYOUR BODY', desc: 'Even 2 minutes of movement changes your neurochemistry. Shake, stretch, or walk. Anything counts.' },
    connect: { icon: '👥', name: 'REACH\nOUT', desc: 'Send one text to someone you trust. It doesn\'t have to be deep. Just: "Hey, thinking of you."' },
    create: { icon: '🎨', name: 'CREATE\nSOMETHING', desc: 'Draw, doodle, cook, build. Creating is regulating. It doesn\'t have to be good — just yours.' },
    gratitude: { icon: '✨', name: 'GRATITUDE\nSPARK', desc: 'Name 3 things — tiny things are fine. A warm bed. Sunlight. A good smell. Let them land.' },
    rest: { icon: '🛌', name: 'PERMISSION\nTO REST', desc: 'You have permission to stop. Right now. Rest isn\'t earned. It\'s necessary. You deserve it.' },
    share: { icon: '🌟', name: 'SHARE\nJOY', desc: 'Good feelings grow when shared. Tell someone about something good that happened. Watch it multiply.' },
  };

  container.innerHTML = `
    <div id="deep-section" class="section-wrapper fade-in">
      <h2 class="section-title" style="color:#29b6f6">💎 DEEP CAVE CALM</h2>
      <p class="section-desc">Deep in the cave, the crystals glow with calm. How are you really feeling right now?</p>
      <div class="cave-scene" id="cave-scene">
        <div class="cave-glow"></div>
        ${[
          {s:'28px',l:'12%',b:'20%',rot:'-15deg',dur:'3.2s',delay:'0s'},
          {s:'44px',l:'35%',b:'10%',rot:'5deg',dur:'4s',delay:'0.5s'},
          {s:'36px',l:'55%',b:'25%',rot:'-8deg',dur:'3.5s',delay:'1s'},
          {s:'52px',l:'72%',b:'8%',rot:'12deg',dur:'4.5s',delay:'0.2s'},
          {s:'24px',l:'85%',b:'30%',rot:'-20deg',dur:'3s',delay:'1.5s'},
          {s:'30px',l:'20%',b:'40%',rot:'8deg',dur:'5s',delay:'0.8s'},
        ].map(c => `
          <div class="big-crystal" style="--size:${c.s};left:${c.l};bottom:${c.b};--rot:${c.rot};--cf-dur:${c.dur};--cf-delay:${c.delay}">💎</div>
        `).join('')}
      </div>
      <div class="mood-scale">
        <div class="mood-label">SELECT YOUR CURRENT MOOD</div>
        <div class="mood-emojis" id="mood-row">
          ${moodResponses.map((m,i) => `
            <div class="mood-emoji" id="mood-${i}" onclick="selectMood(${i})" title="${m.label}">${m.mood}</div>
          `).join('')}
        </div>
      </div>
      <div class="cave-response" id="cave-resp">Your cave companion awaits. Choose a mood above.</div>
      <div id="coping-area" style="display:none">
        <div style="font-family:var(--pixel-font);font-size:8px;color:#29b6f6;text-align:center;margin-bottom:10px">YOUR COPING TOOLKIT</div>
        <div class="coping-tools" id="coping-grid"></div>
      </div>
      <div id="tool-detail" style="display:none;margin-top:16px;padding:16px;background:rgba(41,182,246,0.07);border:1px solid rgba(41,182,246,0.2);border-radius:12px;max-width:400px;margin-left:auto;margin-right:auto">
        <div id="tool-detail-icon" style="font-size:36px;text-align:center;margin-bottom:8px"></div>
        <div id="tool-detail-name" style="font-family:var(--pixel-font);font-size:9px;color:#29b6f6;text-align:center;margin-bottom:10px"></div>
        <div id="tool-detail-desc" style="font-family:var(--vt-font);font-size:20px;color:#81d4fa;text-align:center;line-height:1.6"></div>
      </div>
    </div>
  `;

  window.selectMood = function(idx) {
    document.querySelectorAll('.mood-emoji').forEach((e,i) => {
      e.classList.toggle('selected', i === idx);
    });

    const mood = moodResponses[idx];
    const resp = document.getElementById('cave-resp');
    resp.style.opacity = '0';
    setTimeout(() => {
      resp.textContent = mood.message;
      resp.style.transition = 'opacity 0.5s';
      resp.style.opacity = '1';
    }, 200);

    // Build coping grid
    const area = document.getElementById('coping-area');
    const grid = document.getElementById('coping-grid');
    area.style.display = 'block';
    grid.innerHTML = mood.tools.map(t => {
      const tool = copingTools[t];
      return `
        <div class="coping-tool" onclick="showTool('${t}')">
          <span class="tool-icon">${tool.icon}</span>
          ${tool.name}
        </div>
      `;
    }).join('');
  };

  window.showTool = function(id) {
    const tool = copingTools[id];
    const detail = document.getElementById('tool-detail');
    detail.style.display = 'block';
    detail.style.opacity = '0';
    document.getElementById('tool-detail-icon').textContent = tool.icon;
    document.getElementById('tool-detail-name').textContent = tool.name.replace('\n', ' ');
    document.getElementById('tool-detail-desc').textContent = tool.desc;
    setTimeout(() => {
      detail.style.transition = 'opacity 0.4s';
      detail.style.opacity = '1';
      detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  return () => {
    delete window.selectMood;
    delete window.showTool;
  };
}
