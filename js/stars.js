// Generate starfield
(function() {
  const container = document.getElementById('stars');
  const count = 120;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    s.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      --dur:${(Math.random()*4+2).toFixed(1)}s;
      --delay:${(Math.random()*5).toFixed(1)}s;
    `;
    container.appendChild(s);
  }
  // Add colored accent pixels (blue/purple dots)
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const colors = ['#00e5ff','#4fc3f7','#ce93d8','#ffd700'];
    const col = colors[Math.floor(Math.random()*colors.length)];
    s.style.cssText = `
      width:3px;height:3px;
      left:${Math.random()*100}%;
      top:${Math.random()*100}%;
      background:${col};
      box-shadow:0 0 4px ${col};
      --dur:${(Math.random()*5+3).toFixed(1)}s;
      --delay:${(Math.random()*6).toFixed(1)}s;
    `;
    container.appendChild(s);
  }
})();
