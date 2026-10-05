/* Mini-games: Planet Order (drag or tap), Star Catcher (canvas), Planet Match (memory). */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});
  const starsText = (n) => '⭐'.repeat(n) + '☆'.repeat(3 - n);

  C.renderGames = function (root) {
    root.innerHTML = `
      <div class="section-title"><h1>Game zone</h1></div>
      <p class="lead">Play to practice what you learned. Beat your best to earn up to 3 ⭐ in each game!</p>
      <div class="grid cards" style="margin-top:20px">${C.GAMES.map((g) =>
        `<a class="card" href="#play/${g.id}" style="--c:${g.color}">
          <span class="emoji" aria-hidden="true">${g.emoji}</span><h3>${g.title}</h3><p>${g.blurb}</p>
          <div class="meta"><span class="tag">Best: ${starsText(C.Progress.gameBest(g.id))}</span><span class="btn small">Play</span></div>
        </a>`).join('')}</div>`;
  };

  C.renderGame = function (root, id) {
    const g = C.GAMES.find((x) => x.id === id);
    if (!g) { location.hash = '#play'; return; }
    root.innerHTML = `
      <div class="game">
        <div class="game-head"><a class="btn small ghost" href="#play" aria-label="Back to games">←</a><h2>${g.emoji} ${g.title}</h2></div>
        <div id="gameBox"></div>
        <div id="gameResult" aria-live="polite"></div>
      </div>`;
    const box = C.$('#gameBox', root);
    const res = C.$('#gameResult', root);
    const again = () => C.renderGame(root, id);

    function finish(stars, line) {
      const out = C.Progress.recordGame(id, stars);
      if (stars === 3) C.confetti();
      C.Mascot.say(stars === 3 ? 'Perfect! You are a star!' : stars ? 'Nice one, astronaut!' : 'Good try, play again!');
      res.innerHTML = `
        <div class="panel result" style="margin-top:18px">
          <h2>${stars === 3 ? 'Fantastic!' : stars ? 'Well done!' : 'Nice try!'}</h2>
          <div class="stars-row">${[0, 1, 2].map((k) => `<span class="${k < stars ? 'on' : ''}" style="animation-delay:${k * 0.25}s">⭐</span>`).join('')}</div>
          <p class="score">${line}${out.gained ? ` You earned <b>${out.gained} ⭐</b>!` : ''}</p>
          <div class="btn-row" style="justify-content:center"><button class="btn" id="again" type="button">Play again 🔁</button><a class="btn ghost" href="#play">More games</a></div>
        </div>`;
      C.$('#again', res).addEventListener('click', again);
      res.scrollIntoView({ behavior: C.reduceMotion.matches ? 'auto' : 'smooth', block: 'nearest' });
    }

    ({ order: orderGame, catcher: catcherGame, memory: memoryGame })[id](box, finish);
  };

  /* ---------------------------------------------------------------- Planet Order */
  function orderGame(box, finish) {
    const planets = C.PLANETS;
    let selected = null, placed = 0, mistakes = 0;
    box.innerHTML = `
      <p>Put the planets in order from <b>closest to the Sun</b> to <b>farthest</b>. Drag a planet onto a slot, or tap a planet and then tap a slot.</p>
      <div class="hud"><span class="tag">☀️ Closest ➜ Farthest</span><span class="tag">Placed: <b id="oPlaced">0</b>/8</span><span class="tag">Oops: <b id="oMiss">0</b></span></div>
      <div class="order-slots" id="oSlots">${planets.map((_, i) => `<div class="slot" data-i="${i}" role="button" tabindex="0" aria-label="Slot ${i + 1}"><span class="n">${i + 1}</span></div>`).join('')}</div>
      <div class="tray" id="oTray">${C.shuffle(planets).map((p) =>
        `<div class="pchip" draggable="true" role="button" tabindex="0" data-id="${p.id}" aria-label="${p.name}">${C.planetDot(p, 38)}<span>${p.name}</span></div>`).join('')}</div>`;
    const slots = C.$$('.slot', box), tray = C.$('#oTray', box);

    const setSel = (chip) => {
      selected = selected === chip ? null : chip;
      C.$$('.pchip', box).forEach((c) => c.classList.toggle('sel', c === selected));
      slots.forEach((s) => s.classList.toggle('ready', !!selected && !s.classList.contains('filled')));
    };

    function attempt(slot, chip) {
      if (!chip || slot.classList.contains('filled')) return;
      const i = +slot.dataset.i, p = planets.find((x) => x.id === chip.dataset.id);
      if (planets[i].id === p.id) {
        slot.classList.remove('ready', 'over', 'hint');
        slot.classList.add('filled');
        slot.innerHTML = `<span class="n">${i + 1}</span>${C.planetDot(p, 36)}<b>${p.name}</b>`;
        chip.remove(); selected = null; placed++;
        slots.forEach((s) => s.classList.remove('ready', 'hint'));
        C.$('#oPlaced', box).textContent = placed;
        if (placed === planets.length) {
          finish(mistakes <= 1 ? 3 : mistakes <= 4 ? 2 : 1, `You sorted all 8 planets with ${mistakes} mistake${mistakes === 1 ? '' : 's'}.`);
        }
      } else {
        mistakes++;
        C.$('#oMiss', box).textContent = mistakes;
        chip.classList.remove('shake'); void chip.offsetWidth; chip.classList.add('shake');
        const dist = planets.findIndex((x) => x.id === p.id);
        C.Mascot.say(i < dist ? `${p.name} is farther from the Sun than that. Try a later slot!` : `${p.name} is closer to the Sun than that. Try an earlier slot!`);
        if (mistakes >= 3) { slots[dist].classList.add('hint'); }
        setSel(null);
      }
    }

    tray.addEventListener('click', (e) => { const c = e.target.closest('.pchip'); if (c) setSel(c); });
    tray.addEventListener('keydown', (e) => { const c = e.target.closest('.pchip'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setSel(c); } });
    slots.forEach((s) => {
      const tryTap = () => selected ? attempt(s, selected) : C.Mascot.say('Pick a planet from the tray first!', 3000);
      s.addEventListener('click', tryTap);
      s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tryTap(); } });
      s.addEventListener('dragover', (e) => { e.preventDefault(); s.classList.add('over'); });
      s.addEventListener('dragleave', () => s.classList.remove('over'));
      s.addEventListener('drop', (e) => {
        e.preventDefault(); s.classList.remove('over');
        attempt(s, box.querySelector(`.pchip[data-id="${e.dataTransfer.getData('text/plain')}"]`));
      });
    });
    tray.addEventListener('dragstart', (e) => { const c = e.target.closest('.pchip'); if (c) e.dataTransfer.setData('text/plain', c.dataset.id); });
  }

  /* ---------------------------------------------------------------- Star Catcher */
  function catcherGame(box, finish) {
    const W = 640, H = 420, TIME = 30;
    box.innerHTML = `
      <p>Slide your finger, move the mouse, or use the ← → keys to steer. Catch ⭐ stars and dodge the 🪨 asteroids!</p>
      <div class="hud"><span class="tag">⏱ <b id="cTime">${TIME}</b>s</span><span class="tag">⭐ <b id="cScore">0</b></span><span class="tag" id="cLives" aria-label="Lives">❤️❤️❤️</span></div>
      <div class="catcher-wrap" id="cWrap"><canvas width="${W}" height="${H}" aria-label="Star Catcher game"></canvas>
        <div class="overlay" id="cOver"><h3>Ready for launch?</h3><p>Catch as many stars as you can in ${TIME} seconds. You have 3 lives.</p><button class="btn" id="cGo" type="button">Start! 🚀</button></div></div>`;
    const cv = C.$('canvas', box), wrap = C.$('#cWrap', box), over = C.$('#cOver', box);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const bg = Array.from({ length: 60 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: Math.random() * 1.6 + 0.4, v: 20 + Math.random() * 60 }));
    const rockShape = () => Array.from({ length: 9 }, (_, k) => [(k / 9) * 6.283, 0.75 + Math.random() * 0.4]);
    let running = false, time = TIME, score = 0, lives = 3, items = [], parts = [], spawn = 0, tx = W / 2, sx = W / 2, flash = 0;
    const keys = { l: false, r: false };

    const setLives = () => { C.$('#cLives', box).textContent = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives); };
    function start() {
      running = true; time = TIME; score = 0; lives = 3; items = []; parts = []; spawn = 0.3; flash = 0;
      C.$('#cScore', box).textContent = 0; C.$('#cTime', box).textContent = TIME; setLives();
      over.hidden = true;
    }
    function end() {
      running = false;
      const stars = score >= 18 ? 3 : score >= 10 ? 2 : score >= 1 ? 1 : 0;
      over.hidden = false;
      over.innerHTML = `<h3>${lives ? "Time's up!" : 'Oh no, asteroids!'}</h3><p>You caught <b>${score}</b> stars.</p>`;
      finish(stars, `You caught ${score} stars. Catch 10 for two stars and 18 for three!`);
      const b = document.createElement('button');
      b.className = 'btn'; b.textContent = 'Play again 🚀'; b.type = 'button'; b.addEventListener('click', () => C.renderGame(box.closest('main'), 'catcher'));
      over.appendChild(b);
    }
    const burst = (x, y, col) => { for (let i = 0; i < 10; i++) parts.push({ x, y, vx: (Math.random() - 0.5) * 220, vy: (Math.random() - 0.5) * 220, l: 0.5, col }); };
    const pointer = (e) => { const r = wrap.getBoundingClientRect(); tx = Math.max(24, Math.min(W - 24, ((e.clientX - r.left) / r.width) * W)); };
    wrap.addEventListener('pointermove', pointer);
    wrap.addEventListener('pointerdown', pointer);
    const onDown = (e) => onKey(e, true), onUp = (e) => onKey(e, false);
    function onKey(e, down) {
      if (!box.isConnected) { document.removeEventListener('keydown', onDown); document.removeEventListener('keyup', onUp); return; }
      if (e.key === 'ArrowLeft') { keys.l = down; e.preventDefault(); }
      if (e.key === 'ArrowRight') { keys.r = down; e.preventDefault(); }
    }
    document.addEventListener('keydown', onDown);
    document.addEventListener('keyup', onUp);
    C.$('#cGo', box).addEventListener('click', start);

    function drawStar(x, y, r, rot) {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) { const rad = i % 2 ? r * 0.48 : r, a = rot + (i * Math.PI) / 5; ctx.lineTo(x + Math.sin(a) * rad, y - Math.cos(a) * rad); }
      ctx.closePath(); ctx.fill();
    }

    C.loop(cv, (dt, t) => {
      if (running) {
        if (keys.l) tx -= 420 * dt;
        if (keys.r) tx += 420 * dt;
        tx = Math.max(24, Math.min(W - 24, tx));
        time -= dt;
        spawn -= dt;
        if (spawn <= 0) {
          const star = Math.random() < 0.68;
          items.push({ star, x: 30 + Math.random() * (W - 60), y: -24, r: star ? 15 : 18 + Math.random() * 8, vy: 130 + (TIME - time) * 4 + Math.random() * 70, rot: 0, vr: (Math.random() - 0.5) * 3, shape: star ? null : rockShape() });
          spawn = Math.max(0.35, 0.8 - (TIME - time) * 0.012) * (0.7 + Math.random() * 0.6);
        }
        for (let i = items.length - 1; i >= 0; i--) {
          const it = items[i];
          it.y += it.vy * dt; it.rot += it.vr * dt;
          if (Math.hypot(it.x - sx, it.y - (H - 52)) < it.r + 22) {
            items.splice(i, 1);
            if (it.star) { score++; burst(it.x, it.y, '#ffd447'); C.$('#cScore', box).textContent = score; }
            else { lives--; flash = 0.4; burst(it.x, it.y, '#aaa'); setLives(); if (lives <= 0) { end(); break; } }
          } else if (it.y > H + 40) items.splice(i, 1);
        }
        C.$('#cTime', box).textContent = Math.max(0, Math.ceil(time));
        if (running && time <= 0) end();
      }
      sx += (tx - sx) * Math.min(1, dt * 12);
      flash = Math.max(0, flash - dt);

      // draw
      ctx.fillStyle = '#070722'; ctx.fillRect(0, 0, W, H);
      if (flash > 0) { ctx.fillStyle = `rgba(255,80,80,${flash})`; ctx.fillRect(0, 0, W, H); }
      ctx.fillStyle = '#fff';
      bg.forEach((s) => { s.y = (s.y + s.v * dt) % H; ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 2 + s.x); ctx.fillRect(s.x, s.y, s.s, s.s); });
      ctx.globalAlpha = 1;
      for (const it of items) {
        if (it.star) { ctx.fillStyle = '#ffd447'; ctx.shadowColor = '#ffd447'; ctx.shadowBlur = 14; drawStar(it.x, it.y, it.r, it.rot); ctx.shadowBlur = 0; }
        else {
          ctx.fillStyle = '#8b8ba3'; ctx.strokeStyle = '#5f5f7a'; ctx.lineWidth = 3;
          ctx.beginPath();
          it.shape.forEach(([a, k]) => ctx.lineTo(it.x + Math.cos(a + it.rot) * it.r * k, it.y + Math.sin(a + it.rot) * it.r * k));
          ctx.closePath(); ctx.fill(); ctx.stroke();
          ctx.fillStyle = '#6c6c86'; ctx.beginPath(); ctx.arc(it.x - it.r * 0.25, it.y - it.r * 0.1, it.r * 0.22, 0, 6.283); ctx.fill();
        }
      }
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i]; p.l -= dt; if (p.l <= 0) { parts.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt; ctx.globalAlpha = p.l * 2; ctx.fillStyle = p.col; ctx.fillRect(p.x, p.y, 4, 4);
      }
      ctx.globalAlpha = 1;
      // rocket
      const y = H - 52;
      ctx.save(); ctx.translate(sx, y);
      ctx.fillStyle = '#ff9a3c'; ctx.beginPath(); ctx.moveTo(-8, 22); ctx.lineTo(0, 22 + 14 + Math.sin(t * 40) * 6); ctx.lineTo(8, 22); ctx.fill();
      ctx.fillStyle = '#ff5f7a'; ctx.beginPath(); ctx.moveTo(-14, 22); ctx.lineTo(-24, 28); ctx.lineTo(-14, 4); ctx.moveTo(14, 22); ctx.lineTo(24, 28); ctx.lineTo(14, 4); ctx.fill();
      ctx.fillStyle = '#f4f4ff'; ctx.beginPath(); ctx.moveTo(0, -30); ctx.quadraticCurveTo(18, -8, 14, 24); ctx.lineTo(-14, 24); ctx.quadraticCurveTo(-18, -8, 0, -30); ctx.fill();
      ctx.fillStyle = '#4aa8ff'; ctx.beginPath(); ctx.arc(0, -4, 6.5, 0, 6.283); ctx.fill();
      ctx.restore();
    });
  }

  /* ---------------------------------------------------------------- Planet Match */
  function memoryGame(box, finish) {
    const six = C.shuffle(C.PLANETS).slice(0, 6);
    const deck = C.shuffle(six.flatMap((p) => [{ p, kind: 'pic' }, { p, kind: 'name' }]));
    let first = null, lock = false, moves = 0, matches = 0;
    box.innerHTML = `
      <p>Flip two cards at a time. Match each planet's <b>picture</b> with its <b>name</b>!</p>
      <div class="hud"><span class="tag">Moves: <b id="mMoves">0</b></span><span class="tag">Matches: <b id="mMatch">0</b>/6</span></div>
      <div class="memory-grid">${deck.map((c, i) =>
        `<button class="mcard" type="button" data-i="${i}" aria-label="Card ${i + 1}, face down">
          <span class="face back" aria-hidden="true">🌟</span>
          <span class="face front">${c.kind === 'pic' ? C.planetDot(c.p, 48) : `<b>${c.p.name}</b>`}</span></button>`).join('')}</div>`;
    const cards = C.$$('.mcard', box);
    const label = (el, c, open) => el.setAttribute('aria-label', `Card ${+el.dataset.i + 1}, ${open ? (c.kind === 'pic' ? 'picture of ' + c.p.name : c.p.name) : 'face down'}`);

    cards.forEach((el) => el.addEventListener('click', () => {
      const c = deck[+el.dataset.i];
      if (lock || el.classList.contains('flip') || el.classList.contains('matched')) return;
      el.classList.add('flip'); label(el, c, true);
      if (!first) { first = { el, c }; return; }
      moves++; C.$('#mMoves', box).textContent = moves;
      const a = first; first = null;
      if (a.c.p.id === c.p.id) {
        [a.el, el].forEach((x) => { x.classList.remove('flip'); x.classList.add('matched'); });
        matches++; C.$('#mMatch', box).textContent = matches;
        C.Mascot.say(`${c.p.name}! ${c.p.tag}.`, 3500);
        if (matches === 6) setTimeout(() => finish(moves <= 9 ? 3 : moves <= 14 ? 2 : 1, `You matched all 6 planets in ${moves} moves.`), 600);
      } else {
        lock = true;
        setTimeout(() => { [a.el, el].forEach((x) => { x.classList.remove('flip'); label(x, deck[+x.dataset.i], false); }); lock = false; }, 950);
      }
    }));
  }
})();
