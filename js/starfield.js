/* Full-page canvas background: parallax twinkling stars + random shooting stars. */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});
  const cv = document.getElementById('starfield');
  const ctx = cv.getContext('2d');
  const TINTS = ['#ffffff', '#ffffff', '#ffffff', '#cfe0ff', '#fff1c4', '#ffd6ee'];
  let w = 0, h = 0, layers = [], shooters = [];
  let px = 0, py = 0, tx = 0, ty = 0, nextShot = 2;

  function build() {
    const n = Math.round((w * h) / 5200);
    layers = [[0.2, 0.55], [0.5, 0.3], [1, 0.15]].map(([depth, share]) => ({
      depth,
      stars: Array.from({ length: Math.round(n * share) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (0.4 + Math.random() * 0.9) * (0.7 + depth * 0.8),
        ph: Math.random() * 6.28,
        sp: 0.6 + Math.random() * 2,
        col: C.pick(TINTS),
      })),
    }));
  }

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    w = window.innerWidth;
    h = window.innerHeight;
    cv.width = w * dpr;
    cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    if (C.reduceMotion.matches) draw(0, 0);
  }

  function shoot() {
    const dir = Math.random() < 0.5 ? 1 : -1;
    const speed = 700 + Math.random() * 500;
    const ang = (0.4 + Math.random() * 0.3);
    shooters.push({
      x: dir > 0 ? Math.random() * w * 0.6 : w * 0.4 + Math.random() * w * 0.6,
      y: Math.random() * h * 0.45,
      vx: Math.cos(ang) * speed * dir,
      vy: Math.sin(ang) * speed,
      len: 120 + Math.random() * 120,
      life: 0, max: 0.9 + Math.random() * 0.5,
    });
  }
  C.shootingStar = () => { if (!C.reduceMotion.matches) shoot(); };

  function draw(dt, t) {
    ctx.clearRect(0, 0, w, h);
    px += (tx - px) * Math.min(1, dt * 3);
    py += (ty - py) * Math.min(1, dt * 3);
    for (const L of layers) {
      const ox = px * L.depth * 24, oy = py * L.depth * 24;
      for (const s of L.stars) {
        if (!C.reduceMotion.matches) {
          s.y += L.depth * 4 * dt;
          if (s.y > h + 4) { s.y = -4; s.x = Math.random() * w; }
        }
        const a = C.reduceMotion.matches ? 0.8 : 0.45 + 0.55 * Math.abs(Math.sin(t * s.sp + s.ph));
        ctx.globalAlpha = a;
        ctx.fillStyle = s.col;
        ctx.beginPath();
        ctx.arc(((s.x - ox) % w + w) % w, ((s.y - oy) % h + h) % h, s.r, 0, 6.283);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.life += dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const k = s.life / s.max;
      if (k >= 1) { shooters.splice(i, 1); continue; }
      const mag = Math.hypot(s.vx, s.vy);
      const tailX = s.x - (s.vx / mag) * s.len, tailY = s.y - (s.vy / mag) * s.len;
      const g = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      g.addColorStop(0, `rgba(255,255,255,${1 - k})`);
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 2.4;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tailX, tailY); ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${1 - k})`;
      ctx.shadowColor = '#bcd4ff'; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(s.x, s.y, 2.6, 0, 6.283); ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', (e) => {
    tx = e.clientX / w - 0.5;
    ty = e.clientY / h - 0.5;
  }, { passive: true });
  resize();

  if (!C.reduceMotion.matches) {
    C.loop(cv, (dt, t) => {
      nextShot -= dt;
      if (nextShot <= 0) { shoot(); nextShot = 2.5 + Math.random() * 4; }
      draw(dt, t);
    });
  }
  C.reduceMotion.addEventListener?.('change', () => location.reload());
})();
