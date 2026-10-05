/* Shared helpers, exposed on window.Cosmo */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});

  C.$ = (sel, root = document) => root.querySelector(sel);
  C.$$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  C.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  C.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  C.shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  /** Run fn(dt, t) every animation frame until `el` leaves the DOM or fn returns false. */
  C.loop = (el, fn) => {
    let last = performance.now();
    let id = 0;
    const tick = (t) => {
      if (!el.isConnected) return;
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (fn(dt, t / 1000) === false) return;
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  };

  /** setInterval that cancels itself once `el` is gone. */
  C.every = (el, ms, fn) => {
    const id = setInterval(() => {
      if (!el.isConnected) return clearInterval(id);
      fn();
    }, ms);
    return () => clearInterval(id);
  };

  /** A glossy CSS planet. */
  C.planetDot = (p, size = 40) =>
    `<span class="pdot${p.ring ? ' ringed' : ''}" style="--s:${typeof size === 'number' ? size + 'px' : size};--c1:${p.c1};--c2:${p.c2}"></span>`;

  /** Canvas confetti burst over the whole page. */
  C.confetti = (count = 140) => {
    const cv = document.getElementById('confetti');
    if (!cv || C.reduceMotion.matches) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = (cv.width = innerWidth * dpr);
    const h = (cv.height = innerHeight * dpr);
    const ctx = cv.getContext('2d');
    const colors = ['#ffd447', '#ff6fb5', '#3de0c9', '#8a6bff', '#ff9a3c', '#ffffff'];
    const bits = Array.from({ length: count }, () => ({
      x: w / 2 + (Math.random() - 0.5) * w * 0.3,
      y: h * 0.35,
      vx: (Math.random() - 0.5) * 16 * dpr,
      vy: (-Math.random() * 15 - 4) * dpr,
      s: (6 + Math.random() * 8) * dpr,
      r: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 0.4,
      c: colors[Math.floor(Math.random() * colors.length)],
      star: Math.random() < 0.3,
    }));
    let frames = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      frames++;
      let alive = 0;
      for (const b of bits) {
        b.vy += 0.38 * dpr;
        b.vx *= 0.99;
        b.x += b.vx;
        b.y += b.vy;
        b.r += b.vr;
        if (b.y < h + 40) alive++;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.r);
        ctx.fillStyle = b.c;
        if (b.star) {
          ctx.beginPath();
          for (let i = 0; i < 10; i++) {
            const rad = i % 2 ? b.s * 0.45 : b.s;
            const a = (i * Math.PI) / 5;
            ctx.lineTo(Math.sin(a) * rad, -Math.cos(a) * rad);
          }
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
        }
        ctx.restore();
      }
      if (alive && frames < 260) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, w, h);
    };
    requestAnimationFrame(draw);
  };

  C.toast = (msg, ms = 3200) => {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.hidden = false;
    t.style.animation = 'none';
    void t.offsetWidth;
    t.style.animation = '';
    clearTimeout(C._toastT);
    C._toastT = setTimeout(() => (t.hidden = true), ms);
  };
})();
