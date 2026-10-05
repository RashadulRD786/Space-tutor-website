/* Animated lesson visuals. Each entry is (stage) => void and fills the stage element. */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});
  const V = (C.Visuals = {});
  const P = (id) => C.PLANETS.find((p) => p.id === id);
  const caption = (t) => `<div class="v-caption">${t}</div>`;
  const replayBtn = (label = '↻ Replay') => `<button class="btn small ghost v-btn" type="button">${label}</button>`;

  function setupCanvas(cv, logical) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = cv.height = logical * dpr;
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

  /* ---------- galaxy point clouds ---------- */
  function makeGalaxy(shape, n) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      let x, y, r;
      if (shape === 'spiral') {
        if (i % 6 === 0) { x = gauss() * 0.16; y = gauss() * 0.16; r = Math.hypot(x, y); }
        else {
          r = Math.pow(Math.random(), 0.65) * 0.95;
          const th = r * 5.4 + (i % 2) * Math.PI + gauss() * 0.45 * (1.1 - r * 0.5);
          x = Math.cos(th) * r; y = Math.sin(th) * r;
        }
      } else if (shape === 'elliptical') {
        x = gauss() * 0.5; y = gauss() * 0.3; r = Math.hypot(x / 0.5, y / 0.3) * 0.5;
        const c = Math.cos(0.5), s = Math.sin(0.5);
        [x, y] = [x * c - y * s, x * s + y * c];
      } else {
        const cl = [[-0.3, 0.1], [0.28, -0.2], [0.1, 0.32], [-0.12, -0.34]][i % 4];
        x = cl[0] + gauss() * 0.2; y = cl[1] + gauss() * 0.2; r = Math.hypot(x, y);
      }
      const warm = Math.max(0, 1 - r * 1.5);
      pts.push({ x, y, s: Math.random() < 0.08 ? 2.2 : 1.1, a: 0.35 + Math.random() * 0.65,
        col: `rgb(${Math.round(170 + warm * 85)},${Math.round(190 + warm * 40)},${Math.round(255 - warm * 90)})` });
    }
    return pts;
  }

  function runGalaxy(cv, shape, { n = 3200, speed = 0.25, marker = false, size = 360 } = {}) {
    const ctx = setupCanvas(cv, size);
    const pts = makeGalaxy(shape, n);
    const R = size * 0.46, tilt = shape === 'spiral' ? 0.9 : 1;
    let ang = 0;
    const markR = 0.62, markTh = markR * 5.4;
    const draw = (t) => {
      ctx.clearRect(0, 0, size, size);
      const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, R * 0.55);
      g.addColorStop(0, 'rgba(255,240,200,.75)'); g.addColorStop(1, 'rgba(255,200,120,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
      const ca = Math.cos(ang), sa = Math.sin(ang);
      for (const p of pts) {
        const x = p.x * ca - p.y * sa, y = (p.x * sa + p.y * ca) * tilt;
        ctx.globalAlpha = p.a; ctx.fillStyle = p.col;
        ctx.fillRect(size / 2 + x * R, size / 2 + y * R, p.s, p.s);
      }
      ctx.globalAlpha = 1;
      if (marker) {
        const mx = Math.cos(markTh) * markR, my = Math.sin(markTh) * markR;
        const x = size / 2 + (mx * ca - my * sa) * R, y = size / 2 + (mx * sa + my * ca) * tilt * R;
        const k = (Math.sin(t * 3) + 1) / 2;
        ctx.strokeStyle = `rgba(255,212,71,${1 - k})`; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(x, y, 5 + k * 14, 0, 6.283); ctx.stroke();
        ctx.fillStyle = '#ffd447'; ctx.beginPath(); ctx.arc(x, y, 4, 0, 6.283); ctx.fill();
        ctx.font = '700 15px system-ui, sans-serif'; ctx.textAlign = 'center';
        ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(8,8,40,.9)';
        ctx.strokeText('You are here!', x, y - 24); ctx.fillStyle = '#ffd447'; ctx.fillText('You are here!', x, y - 24);
      }
    };
    draw(0);
    if (!C.reduceMotion.matches) C.loop(cv, (dt, t) => { ang += speed * dt; draw(t); });
  }

  V.galaxy = (stage) => {
    stage.innerHTML = `<div class="gx-wrap"><canvas aria-label="A spinning spiral galaxy"></canvas></div>${caption('A spiral galaxy: billions of stars swirling around the center')}`;
    runGalaxy(stage.querySelector('canvas'), 'spiral');
  };
  V.milkyway = (stage) => {
    stage.innerHTML = `<div class="gx-wrap"><canvas aria-label="The Milky Way with a marker showing where the Sun is"></canvas></div>${caption('Our Sun lives about halfway out from the center')}`;
    runGalaxy(stage.querySelector('canvas'), 'spiral', { marker: true, speed: 0.12 });
  };
  V['galaxy-shapes'] = (stage) => {
    stage.innerHTML = `<div class="gx-three">${[['spiral', 'Spiral'], ['elliptical', 'Elliptical'], ['irregular', 'Irregular']]
      .map(([k, n]) => `<figure><canvas data-k="${k}" aria-label="${n} galaxy"></canvas><figcaption>${n}</figcaption></figure>`).join('')}</div>`;
    stage.querySelectorAll('canvas').forEach((cv) => runGalaxy(cv, cv.dataset.k, { n: 1600, size: 200, speed: 0.2 }));
  };

  /* ---------- solar system lesson ---------- */
  V.sun = (stage) => {
    stage.innerHTML = `<div class="v-sun"><div class="v-sun-glow"></div><div class="v-sun-core"></div></div>
      <div class="v-compare"><span class="pdot" style="--s:6px;--c1:${P('earth').c1};--c2:${P('earth').c2}"></span> = Earth</div>
      ${caption('The Sun is 109 times wider than Earth!')}`;
  };

  V['planet-groups'] = (stage) => {
    const f = window.innerWidth < 720 ? 0.6 : 1;
    const row = (ids, k) => ids.map((id, i) => {
      const p = P(id);
      return `<figure style="--dl:${i * 0.4}s">${C.planetDot(p, Math.round((14 + (p.size / 139820) * k) * f))}${p.name}</figure>`;
    }).join('');
    stage.innerHTML = `<div class="v-groups">
      <div class="v-group"><h4>Rocky planets</h4><div class="v-row">${row(['mercury', 'venus', 'earth', 'mars'], 300)}</div></div>
      <div class="v-group"><h4>Gas &amp; ice giants</h4><div class="v-row">${row(['jupiter', 'saturn', 'uranus', 'neptune'], 120)}</div></div></div>`;
  };

  V.gravity = (stage) => {
    stage.innerHTML = `<svg class="v-svg" viewBox="0 0 400 300" role="img" aria-label="A planet circling the Sun on a gravity rope">
        <circle cx="200" cy="150" r="95" fill="none" stroke="rgba(255,255,255,.15)" stroke-dasharray="3 7"/>
        <circle cx="200" cy="150" r="32" fill="#ffb53c" opacity=".2"/><circle cx="200" cy="150" r="22" fill="#ffd447"/>
        <line id="rope" x1="200" y1="150" x2="295" y2="150" stroke="#ffd447" stroke-width="3" stroke-dasharray="6 5"/>
        <circle id="gp" r="11" cx="295" cy="150" fill="${P('earth').c2}" stroke="${P('earth').c1}" stroke-width="3"/>
        <text id="snip" x="200" y="40" text-anchor="middle" fill="#ff9a3c" font-size="20" font-weight="700" hidden>No gravity: off it goes!</text>
      </svg>${replayBtn('✂️ Cut the rope!')}${caption('Gravity pulls the planet toward the Sun, so it curves instead of flying straight')}`;
    const btn = stage.querySelector('.v-btn'), rope = stage.querySelector('#rope'), gp = stage.querySelector('#gp'), snip = stage.querySelector('#snip');
    const v = 130, R = 95;
    let a = 0, cut = false, x = 0, y = 0, vx = 0, vy = 0;
    const place = (px, py) => {
      gp.setAttribute('cx', 200 + px); gp.setAttribute('cy', 150 + py);
      rope.setAttribute('x2', 200 + px); rope.setAttribute('y2', 150 + py);
    };
    btn.addEventListener('click', () => {
      cut = !cut;
      btn.textContent = cut ? '🔗 Reconnect' : '✂️ Cut the rope!';
      rope.toggleAttribute('hidden', cut); snip.toggleAttribute('hidden', !cut);
      if (cut) { x = Math.cos(a) * R; y = Math.sin(a) * R; vx = -Math.sin(a) * v; vy = Math.cos(a) * v; }
      else { a = Math.atan2(y, x); }
      if (cut) C.Mascot.say('Whoosh! Without gravity a planet would zoom off in a straight line.');
    });
    C.loop(stage, (dt) => {
      if (C.reduceMotion.matches && !cut) { place(R, 0); return; }
      if (!cut) { a += (v / R) * dt; place(Math.cos(a) * R, Math.sin(a) * R); }
      else { x += vx * dt; y += vy * dt; place(x, y); if (Math.abs(x) > 420 || Math.abs(y) > 320) btn.click(); }
    });
  };

  V.spin = (stage) => {
    const blobs = `<svg viewBox="0 0 170 170" preserveAspectRatio="none"><g fill="#4fcf7f">
      <ellipse cx="40" cy="60" rx="26" ry="20" transform="rotate(-20 40 60)"/><ellipse cx="62" cy="108" rx="14" ry="26" transform="rotate(15 62 108)"/>
      <ellipse cx="118" cy="52" rx="22" ry="14"/><ellipse cx="128" cy="100" rx="18" ry="24" transform="rotate(-15 128 100)"/><ellipse cx="90" cy="140" rx="12" ry="8"/></g></svg>`;
    stage.innerHTML = `<div style="position:relative;display:grid;place-items:center">
        <div class="v-axis" aria-hidden="true"></div>
        <div class="v-earth" role="img" aria-label="Earth spinning"><div class="land">${blobs}${blobs}</div></div></div>
      <div class="tag" style="position:absolute;top:14px;left:14px;font-size:1rem">🕒 Hour <b id="hr">0</b></div>
      ${caption('One spin = one day · one trip around the Sun = one year')}`;
    const hr = stage.querySelector('#hr');
    C.loop(stage, (dt, t) => { hr.textContent = Math.floor(((t % 12) / 12) * 24); });
  };

  /* ---------- stars lesson ---------- */
  V['star-colors'] = (stage) => {
    const list = [['Blue', 'hottest', '#7aa8ff', 56], ['White', 'very hot', '#f4f6ff', 50], ['Yellow', 'like our Sun', '#ffd447', 46], ['Orange', 'cooler', '#ff9a3c', 42], ['Red', 'coolest', '#ff5f5f', 38]];
    stage.innerHTML = `<div style="width:100%"><div class="star-row">${list.map(([n, d, c, s], i) =>
      `<figure><span class="star-dot" style="--c:${c};--s:${s}px;--dl:${i * 0.3}s"></span><b>${n}</b><br>${d}</figure>`).join('')}</div>
      <div class="heat-arrow" aria-hidden="true"></div></div>${caption('🔥 hot ———————— cool ❄️')}`;
  };

  V['star-life'] = (stage) => {
    const S = [
      ['Nebula', 150, '#8a6bff', '#e0d4ff', 30, 10, 'A giant cloud of gas and dust floats in space. This is a star nursery!'],
      ['Baby star', 44, '#ff9a3c', '#ffe3b8', 40, 0, 'Gravity squeezes the cloud tighter and tighter until a baby star lights up.'],
      ['Grown-up star', 96, '#ffd447', '#fff7c4', 60, 0, 'The star shines steadily for billions of years, just like our Sun does now.'],
      ['Red giant', 170, '#ff5f4a', '#ffbba6', 70, 0, 'When its fuel runs low, the star puffs up big and turns red.'],
      ['White dwarf', 30, '#dff0ff', '#ffffff', 28, 0, 'The outer layers drift away and a tiny, hot core is left. (Really big stars explode as a supernova instead!)'],
    ];
    stage.innerHTML = `<div class="life"><div class="life-box"><div class="life-star" id="ls"></div></div>
      <div class="life-chips" role="group" aria-label="Star life stages">${S.map((s, i) => `<button type="button" aria-pressed="false" data-i="${i}">${i + 1}. ${s[0]}</button>`).join('')}</div>
      <p class="life-desc" id="ld"></p></div>`;
    const ls = stage.querySelector('#ls'), ld = stage.querySelector('#ld'), chips = stage.querySelectorAll('button');
    let cur = 0, auto = !C.reduceMotion.matches;
    const show = (i) => {
      cur = i; const s = S[i];
      ls.style.cssText = `--sz:${s[1]}px;--col:${s[2]};--hi:${s[3]};--glow:${s[4]}px;--blur:${s[5]}px`;
      ld.textContent = s[6];
      chips.forEach((c, k) => c.setAttribute('aria-pressed', String(k === i)));
    };
    show(0);
    chips.forEach((c) => c.addEventListener('click', () => { auto = false; show(+c.dataset.i); }));
    C.every(stage, 3200, () => { if (auto) show((cur + 1) % S.length); });
  };

  V.constellation = (stage) => {
    const pts = [['Alkaid', 25, 40], ['Mizar', 70, 60], ['Alioth', 112, 72], ['Megrez', 150, 85], ['Phecda', 160, 135], ['Merak', 225, 130], ['Dubhe', 232, 82]];
    const order = [0, 1, 2, 3, 4, 5, 6, 3];
    let lines = '';
    for (let i = 0; i < order.length - 1; i++) {
      const [, x1, y1] = pts[order[i]], [, x2, y2] = pts[order[i + 1]];
      lines += `<line class="const-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="--len:${Math.hypot(x2 - x1, y2 - y1).toFixed(1)};--i:${i}"/>`;
    }
    const dots = pts.map(([n, x, y], i) => `<circle class="const-star" cx="${x}" cy="${y}" r="5" style="--i:${i}"/>${['Dubhe', 'Merak', 'Alkaid'].includes(n) ? `<text class="const-label" style="--i:${i}" x="${x}" y="${y + (y > 100 ? 20 : -12)}" text-anchor="middle">${n}</text>` : ''}`).join('');
    stage.innerHTML = `<svg class="v-svg" viewBox="0 0 260 170" role="img" aria-label="Dot to dot picture of the Big Dipper">${lines}${dots}</svg>
      ${replayBtn()}${caption('The Big Dipper: seven bright stars that look like a spoon')}`;
    const svg = stage.querySelector('svg');
    const play = () => { svg.classList.remove('const-on'); void svg.getBoundingClientRect(); svg.classList.add('const-on'); };
    stage.querySelector('.v-btn').addEventListener('click', play);
    requestAnimationFrame(play);
  };

  /* ---------- galaxies lesson ---------- */
  V.lightyear = (stage) => {
    const rows = [['🌙 Light from the Moon to Earth', '1.3 seconds', 1.3], ['☀️ Light from the Sun to Earth', '8 minutes', 6], ['⭐ Light from the nearest star', '4.2 years', 16]];
    stage.innerHTML = `<div class="ly">${rows.map(([n, t, d]) =>
      `<div class="ly-row"><span>${n}: <b>${t}</b></span><div class="ly-track"><i class="ly-photon" style="--t:${d}s"></i></div></div>`).join('')}</div>
      ${caption('Animation is sped up and not to scale!')}`;
  };

  /* ---------- exploration lesson ---------- */
  V.rocket = (stage) => {
    const smoke = Array.from({ length: 7 }, (_, i) => `<i class="smoke" style="left:calc(50% + ${(i - 3) * 18}px);--dx:${(i - 3) * 22}px;--dl:${1.6 + i * 0.12}s"></i>`).join('');
    stage.innerHTML = `<div class="rocket-scene"><div class="countdown" aria-live="polite"></div><div class="rocket-ground"></div>${smoke}
      <svg class="rocket" viewBox="0 0 70 140" aria-hidden="true">
        <g class="flame"><path d="M22 104 Q35 150 48 104z" fill="#ff9a3c"/><path d="M28 104 Q35 132 42 104z" fill="#fff3a0"/></g>
        <path d="M35 4 Q58 30 54 78 L54 104 L16 104 L16 78 Q12 30 35 4z" fill="#f4f4ff"/>
        <path d="M35 4 Q47 16 51 38 L19 38 Q23 16 35 4z" fill="#ff5f7a"/>
        <circle cx="35" cy="62" r="11" fill="#4aa8ff" stroke="#c9c9e8" stroke-width="4"/>
        <path d="M16 84 L2 112 L16 104z M54 84 L68 112 L54 104z" fill="#ff5f7a"/><rect x="24" y="100" width="22" height="8" rx="3" fill="#8a8aa8"/></svg>
      </div>${replayBtn('↻ Launch again')}`;
    const scene = stage.querySelector('.rocket-scene'), rocket = stage.querySelector('.rocket'), cd = stage.querySelector('.countdown');
    const timers = [];
    const launch = () => {
      timers.forEach(clearTimeout); timers.length = 0;
      scene.classList.remove('go'); rocket.classList.remove('go'); void rocket.getBoundingClientRect();
      ['3', '2', '1', 'Blast off! 🚀'].forEach((t, i) => timers.push(setTimeout(() => { cd.textContent = t; }, i * 800)));
      timers.push(setTimeout(() => { scene.classList.add('go'); rocket.classList.add('go'); }, 2400));
      timers.push(setTimeout(() => { cd.textContent = ''; }, 5600));
    };
    stage.querySelector('.v-btn').addEventListener('click', launch);
    launch();
  };

  V.satellite = (stage) => {
    stage.innerHTML = `<div class="sat-scene"><div class="sat-earth"></div>
      <div class="sat-orbit"><i class="sat-beep"></i>
        <svg class="sat" viewBox="0 0 30 30" style="animation:spinBack 8s linear infinite" aria-label="Sputnik">
          <circle cx="15" cy="15" r="7" fill="#d8d8ee"/><circle cx="12.5" cy="12.5" r="2.4" fill="#fff"/>
          <path d="M15 15 L2 4 M15 15 L28 4 M15 15 L2 26 M15 15 L28 26" stroke="#d8d8ee" stroke-width="1.5"/></svg></div></div>
      ${caption('Sputnik 1 (1957) went around Earth every 96 minutes, beeping the whole way!')}`;
  };

  V.moon = (stage) => {
    const prints = [10, 20, 30].map((l, i) => `<ellipse cx="${l}" cy="${6 + (i % 2) * 6}" rx="3.6" ry="6" fill="#6f6f88" opacity=".6"/>`).join('');
    stage.innerHTML = `<div class="moon-scene"><div class="moon-earth"><svg viewBox="0 0 70 70" style="position:absolute;inset:0"><g fill="#4fcf7f"><ellipse cx="26" cy="28" rx="12" ry="9"/><ellipse cx="46" cy="44" rx="8" ry="11"/></g></svg></div>
      <div class="moon-ground"></div>
      <svg class="flag" viewBox="0 0 50 90" aria-hidden="true"><rect x="3" y="2" width="3" height="86" fill="#ddd"/>
        <g class="flag-cloth"><rect x="6" y="4" width="40" height="26" fill="#fff"/><rect x="6" y="9" width="40" height="4" fill="#ff5f5f"/><rect x="6" y="17" width="40" height="4" fill="#ff5f5f"/><rect x="6" y="4" width="16" height="13" fill="#4a6cff"/></g></svg>
      <svg class="astro" viewBox="0 0 74 110" aria-label="Astronaut hopping on the Moon">
        <rect x="8" y="30" width="20" height="40" rx="8" fill="#cfd0e6"/><rect x="22" y="28" width="38" height="46" rx="14" fill="#fff"/>
        <rect x="26" y="70" width="14" height="32" rx="6" fill="#fff"/><rect x="44" y="70" width="14" height="32" rx="6" fill="#fff"/>
        <rect x="24" y="96" width="18" height="10" rx="5" fill="#9a9ab8"/><rect x="42" y="96" width="18" height="10" rx="5" fill="#9a9ab8"/>
        <circle cx="46" cy="22" r="20" fill="#fff"/><path d="M34 14 Q50 4 62 18 Q64 32 50 34 Q36 34 34 14z" fill="#f2b74a" stroke="#d9a032" stroke-width="2"/>
        <path d="M52 44 L72 36" stroke="#fff" stroke-width="10" stroke-linecap="round"/><circle cx="72" cy="36" r="5" fill="#9a9ab8"/>
        <rect x="36" y="48" width="12" height="8" rx="2" fill="#ff5f7a"/></svg>
      <svg style="position:absolute;left:44%;bottom:34px;width:50px" viewBox="0 0 40 20" aria-hidden="true">${prints}</svg>
      ${caption('Moon gravity is 1/6 of Earth\'s, so astronauts could hop super high!')}</div>`;
  };

  V.rover = (stage) => {
    const wheel = (cx) => `<g class="wheel"><circle cx="${cx}" cy="66" r="10" fill="#33334d" stroke="#9a9ab8" stroke-width="3"/><path d="M${cx - 9} 66h18M${cx} 57v18" stroke="#9a9ab8" stroke-width="2"/></g>`;
    stage.innerHTML = `<div class="mars-scene">
      <div class="mars-hill" style="left:-5%;width:55%;height:90px"></div><div class="mars-hill" style="right:-8%;width:60%;height:120px;background:#a34a22"></div>
      <div class="mars-ground"></div>
      <svg class="rover" viewBox="0 0 130 80" aria-label="A Mars rover driving">
        <path d="M30 30 L20 8 M20 8 h10" stroke="#e8e8f4" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="22" cy="8" r="6" fill="#e8e8f4"/><circle cx="22" cy="8" r="2.4" fill="#33334d"/>
        <rect x="26" y="30" width="80" height="24" rx="6" fill="#e8e8f4"/><rect x="34" y="22" width="64" height="10" rx="3" fill="#4a6cff"/>
        <path d="M30 54 L65 66 M65 66 L110 54" stroke="#9a9ab8" stroke-width="5" fill="none"/>
        ${wheel(24)}${wheel(65)}${wheel(108)}</svg>
      ${caption('A rover rolls across Mars looking for clues about water and life')}</div>`;
  };

  V.telescope = (stage) => {
    const s = 27, hexes = [];
    for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) {
      const d = Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r));
      if (d === 1 || d === 2) hexes.push([q, r]);
    }
    const poly = (cx, cy) => Array.from({ length: 6 }, (_, k) => `${(cx + s * 0.94 * Math.cos((k * Math.PI) / 3)).toFixed(1)},${(cy + s * 0.94 * Math.sin((k * Math.PI) / 3)).toFixed(1)}`).join(' ');
    stage.innerHTML = `<svg class="v-svg" viewBox="-140 -150 280 300" style="max-height:94%" role="img" aria-label="The 18 golden mirror segments of the James Webb Space Telescope">
      <defs><linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0a8"/><stop offset=".5" stop-color="#f2b73c"/><stop offset="1" stop-color="#b8791c"/></linearGradient></defs>
      ${hexes.map(([q, r], i) => `<polygon class="hex" style="--dl:${(i * 0.17).toFixed(2)}s" points="${poly(s * 1.5 * q, s * Math.sqrt(3) * (r + q / 2))}"/>`).join('')}
      <circle class="v-twinkle" cx="-120" cy="-90" r="2.5" fill="#fff"/><circle class="v-twinkle" cx="118" cy="-70" r="2" fill="#fff" style="animation-delay:.8s"/><circle class="v-twinkle" cx="-110" cy="84" r="2" fill="#fff" style="animation-delay:1.4s"/></svg>
      ${caption('18 golden mirrors work together as one giant eye')}`;
  };
})();
