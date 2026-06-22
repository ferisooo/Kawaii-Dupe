'use strict';

/* DupeNova cosmetic engine: drifting particles, cursor trail, click ripples.
   All layers are pointer-events:none so they never block the UI. */

(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------- particle field ------------------------- */
  const pCanvas = document.getElementById('particles');
  const pCtx = pCanvas.getContext('2d');
  let particles = [];
  let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    for (const c of [pCanvas, tCanvas]) {
      c.width = W * dpr; c.height = H * dpr;
      c.style.width = W + 'px'; c.style.height = H + 'px';
    }
    pCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    tCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const COLORS = ['77,243,255', '184,107,255', '255,92,240'];
  function makeParticles() {
    const count = Math.round((W * H) / 26000);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22 - 0.06,
        a: Math.random() * 0.5 + 0.15,
        tw: Math.random() * Math.PI * 2,
        c: COLORS[(Math.random() * COLORS.length) | 0]
      });
    }
  }

  function drawParticles() {
    pCtx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.tw += 0.03;
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
      const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(${p.c},${alpha})`;
      pCtx.shadowBlur = 8;
      pCtx.shadowColor = `rgba(${p.c},${alpha})`;
      pCtx.fill();
    }
  }

  /* ------------------------------ cursor trail -------------------------- */
  const tCanvas = document.getElementById('trail');
  const tCtx = tCanvas.getContext('2d');
  let trail = [];
  let mx = -100, my = -100, moving = false, moveTimer = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY; moving = true;
    clearTimeout(moveTimer);
    moveTimer = setTimeout(() => { moving = false; }, 120);
    trail.push({ x: mx, y: my, life: 1 });
    if (trail.length > 26) trail.shift();
  });

  function drawTrail() {
    tCtx.clearRect(0, 0, W, H);
    for (let i = 0; i < trail.length; i++) {
      const t = trail[i];
      t.life -= 0.045;
      if (t.life <= 0) continue;
      const r = 7 * t.life + 1;
      tCtx.beginPath();
      tCtx.arc(t.x, t.y, r, 0, Math.PI * 2);
      const grd = tCtx.createRadialGradient(t.x, t.y, 0, t.x, t.y, r);
      grd.addColorStop(0, `rgba(150,220,255,${0.5 * t.life})`);
      grd.addColorStop(1, 'rgba(150,220,255,0)');
      tCtx.fillStyle = grd;
      tCtx.fill();
    }
    trail = trail.filter((t) => t.life > 0);
  }

  /* ------------------------------- main loop ---------------------------- */
  function loop() {
    drawParticles();
    drawTrail();
    requestAnimationFrame(loop);
  }

  /* ------------------------------ click ripples ------------------------- */
  const rippleHost = document.getElementById('ripples');
  window.addEventListener('mousedown', (e) => {
    const max = 220;
    const el = document.createElement('span');
    el.className = 'ripple';
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    el.style.width = max + 'px';
    el.style.height = max + 'px';
    rippleHost.appendChild(el);
    setTimeout(() => el.remove(), 700);
  });

  /* -------------------------------- boot -------------------------------- */
  window.addEventListener('resize', () => { resize(); makeParticles(); });

  resize();
  if (!reduce) {
    makeParticles();
    loop();
  }
})();
