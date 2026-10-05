/* Interactive solar system: SVG orbits driven by requestAnimationFrame. */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});
  const NS = 'http://www.w3.org/2000/svg';
  const START = [0.5, 2.4, 4.1, 5.6, 1.2, 3.3, 0.2, 4.9]; // fixed start angles so every visit looks nice

  C.mountSolarSystem = function (root) {
    const planets = C.PLANETS;
    let selected = null;
    let paused = C.reduceMotion.matches;
    let speed = 1;
    let mode = 'orbit';

    root.innerHTML = `
      <div class="explore">
        <div class="panel sys-stage">
          <div class="sys-toolbar">
            <button class="btn small ghost" id="ssPause" type="button"></button>
            <label>Speed <input id="ssSpeed" type="range" min="0.2" max="4" step="0.1" value="1" aria-label="Orbit speed"></label>
            <div class="seg" role="group" aria-label="View">
              <button type="button" data-mode="orbit" aria-pressed="true">Orbits</button>
              <button type="button" data-mode="size" aria-pressed="false">Sizes</button>
            </div>
          </div>
          <div id="ssOrbit"></div>
          <div id="ssSize" class="size-view" hidden></div>
          <div class="chips" id="ssChips" role="group" aria-label="Choose a planet"></div>
        </div>
        <aside class="panel info" id="ssInfo" aria-live="polite"></aside>
      </div>`;

    /* ---- orbit map (SVG) ---- */
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '-378 -378 756 756');
    svg.setAttribute('class', 'sys-svg');
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-label', 'Map of the solar system. Choose a planet to learn about it.');
    let defs = '';
    planets.forEach((p) => {
      defs += `<radialGradient id="g-${p.id}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="${p.c1}"/><stop offset="1" stop-color="${p.c2}"/></radialGradient>`;
    });
    defs += `<radialGradient id="g-sun" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff8c0"/><stop offset=".55" stop-color="#ffc93c"/><stop offset="1" stop-color="#ff8a1f"/></radialGradient>`;
    let body = `<defs>${defs}</defs>`;
    body += `<circle class="sun-halo" r="52" fill="#ffb53c" opacity=".25"/><circle r="40" fill="url(#g-sun)"/>`;
    planets.forEach((p) => { body += `<circle class="orbit-line" data-orbit="${p.id}" r="${p.orbit}"/>`; });
    planets.forEach((p) => {
      const hit = Math.max(p.r + 9, 22);
      body += `<g class="planet" id="pl-${p.id}" data-id="${p.id}" tabindex="0" role="button" aria-label="${p.name}">
        <circle r="${hit}" fill="transparent"/>
        <circle class="sel-ring" r="${p.r + 7}" fill="none" stroke="#ffd447" stroke-width="3" stroke-dasharray="6 5"/>
        ${p.ring ? `<ellipse rx="${p.r * 1.9}" ry="${p.r * 0.55}" fill="none" stroke="#f1dc9e" stroke-width="4" opacity=".55" transform="rotate(-18)"/>` : ''}
        <circle r="${p.r}" fill="url(#g-${p.id})"/>
        ${p.ring ? `<path d="M${-p.r * 1.9} 0 A${p.r * 1.9} ${p.r * 0.55} 0 0 0 ${p.r * 1.9} 0" fill="none" stroke="#f1dc9e" stroke-width="4" transform="rotate(-18)"/>` : ''}
        ${p.id === 'earth' ? '<circle class="moon" r="2.6" cx="17" fill="#ddd"/>' : ''}
        <text class="plabel" y="${-p.r - 12}" text-anchor="middle" fill="#ffd447" font-size="19" font-weight="700" font-family="inherit" hidden>${p.name}</text>
      </g>`;
    });
    svg.innerHTML = body;
    C.$('#ssOrbit', root).appendChild(svg);

    const nodes = planets.map((p, i) => ({ p, el: svg.querySelector('#pl-' + p.id), a: START[i], moonA: 0 }));
    const placeAll = () => nodes.forEach((n) => {
      n.el.setAttribute('transform', `translate(${(Math.cos(n.a) * n.p.orbit).toFixed(1)} ${(Math.sin(n.a) * n.p.orbit).toFixed(1)})`);
      const moon = n.el.querySelector('.moon');
      if (moon) { moon.setAttribute('cx', Math.cos(n.moonA) * 17); moon.setAttribute('cy', Math.sin(n.moonA) * 17); }
    });
    placeAll();

    C.loop(root, (dt) => {
      if (paused) return;
      nodes.forEach((n) => {
        n.a += ((Math.PI * 2) / n.p.period) * dt * speed;
        n.moonA += 3.2 * dt * speed;
      });
      placeAll();
    });

    /* ---- size comparison ---- */
    const maxSize = planets[4].size;
    C.$('#ssSize', root).innerHTML = planets.map((p) =>
      `<button class="size-item" type="button" data-id="${p.id}">${C.planetDot(p, `calc(var(--jup) * ${(p.size / maxSize).toFixed(4)})`)}<span>${p.name}</span></button>`
    ).join('');

    /* ---- chips ---- */
    C.$('#ssChips', root).innerHTML = planets.map((p) =>
      `<button class="chip" type="button" data-id="${p.id}" aria-pressed="false">${C.planetDot(p, 24)}${p.name}</button>`
    ).join('');

    /* ---- info card ---- */
    const info = C.$('#ssInfo', root);
    function showWelcome() {
      info.innerHTML = `
        <h2>🪐 Solar System Explorer</h2>
        <p class="tagline">Tap a planet to meet it!</p>
        <p>The Sun is at the center and eight planets travel around it. Planets close to the Sun zoom around fast, and far away ones take much longer.</p>
        <p class="funfact">The orbits here are <b>not to scale</b>. In real life the planets are much, much farther apart!</p>
        <button class="btn" type="button" data-id="mercury">Start with Mercury →</button>`;
    }
    function select(id) {
      selected = id;
      const i = planets.findIndex((p) => p.id === id);
      const p = planets[i];
      const prev = planets[(i + planets.length - 1) % planets.length];
      const next = planets[(i + 1) % planets.length];
      info.innerHTML = `
        <h2>${C.planetDot(p, 46)} ${p.name}</h2>
        <p class="tagline">${p.tag} · ${p.type} planet</p>
        <div class="stats">
          <div class="stat"><small>Day length</small><b>${p.day}</b></div>
          <div class="stat"><small>Year length</small><b>${p.year}</b></div>
          <div class="stat"><small>Moons</small><b>${p.moons}</b></div>
          <div class="stat"><small>From the Sun</small><b>${p.dist}</b></div>
          <div class="stat" style="grid-column:1/-1"><small>Width</small><b>${p.size.toLocaleString()} km</b></div>
        </div>
        <p class="funfact">💡 ${p.fact}</p>
        <div class="btn-row">
          <button class="btn small ghost" type="button" data-id="${prev.id}">← ${prev.name}</button>
          <button class="btn small" type="button" data-id="${next.id}">${next.name} →</button>
        </div>`;
      svg.querySelectorAll('.planet').forEach((g) => {
        const on = g.dataset.id === id;
        g.classList.toggle('sel', on);
        g.querySelector('.plabel').toggleAttribute('hidden', !on);
      });
      svg.querySelectorAll('.orbit-line').forEach((o) => o.classList.toggle('sel', o.dataset.orbit === id));
      root.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.id === id)));
      root.querySelectorAll('.size-item').forEach((c) => c.classList.toggle('sel', c.dataset.id === id));
      C.Mascot.say(p.fact, 8000);
    }
    showWelcome();

    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-id]');
      if (t && root.contains(t)) select(t.dataset.id);
    });
    svg.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.id) { e.preventDefault(); select(e.target.dataset.id); }
    });

    /* ---- controls ---- */
    const pauseBtn = C.$('#ssPause', root);
    const syncPause = () => { pauseBtn.textContent = paused ? '▶️ Play' : '⏸️ Pause'; pauseBtn.setAttribute('aria-pressed', String(paused)); };
    pauseBtn.addEventListener('click', () => { paused = !paused; syncPause(); });
    syncPause();
    C.$('#ssSpeed', root).addEventListener('input', (e) => { speed = parseFloat(e.target.value); });
    root.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => {
      mode = b.dataset.mode;
      root.querySelectorAll('.seg button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      C.$('#ssOrbit', root).hidden = mode !== 'orbit';
      C.$('#ssSize', root).hidden = mode !== 'size';
      pauseBtn.hidden = C.$('label', root).hidden = mode !== 'orbit';
      if (mode === 'size') C.Mascot.say('Jupiter is so big that all the other planets could fit inside it! Can you spot Earth?', 8000);
    }));
  };
})();
