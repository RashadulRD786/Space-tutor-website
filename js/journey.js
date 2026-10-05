/* Home-page journey: astronaut Riyad flies from Earth to the Milky Way, the Universe
   and up a stack of seven layers. All motion is CSS (css/journey.css); this file only
   renders the markup and wires the controls. */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});

  // Layers 2-7 are imaginative ideas, not facts, so the UI says so.
  const LAYERS = [
    { name: 'Universe', text: 'Everything we can see: every star, planet and galaxy, and all the space between them.' },
    { name: 'Multiverse', text: 'A whole stack of universes, each one a bubble with its own galaxies.' },
    { name: 'Hidden Folds', text: 'Extra directions that are curled up too small for anyone to see.' },
    { name: 'Time Stream', text: 'Where past, present and future all sit side by side.' },
    { name: 'Branching Paths', text: 'Every choice splits into a new possible story.' },
    { name: 'All Paths', text: 'Every branch from every universe, gathered into one place.' },
    { name: 'The Whole Picture', text: 'The top layer, where all the other layers fit together as one.' },
  ];

  const STOPS = [
    { title: 'Planet Earth', text: 'This is home. Meet Riyad, our astronaut, blasting off in his spaceship!' },
    { title: 'Our Solar System', text: 'Earth is one of eight planets circling our Sun.' },
    { title: 'The Milky Way', text: 'The Sun is one tiny star among hundreds of billions in our galaxy.' },
    { title: 'The Universe', text: 'Our galaxy is one speck in a web of countless galaxies. This is layer 1.' },
    { title: 'Seven layers (imagined)', text: 'Now imagine zooming out once more. What if our Universe is just layer 1 of a bigger stack? Riyad climbs all seven!' },
  ];

  const ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>',
    replay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
    skip: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 5v14l9-7zM16 5h3v14h-3z"/></svg>',
  };

  const GALAXY = `
    <svg viewBox="0 0 400 400">
      <defs>
        <radialGradient id="mwDisk"><stop offset="0" stop-color="#8a6bff" stop-opacity=".38"/><stop offset=".7" stop-color="#5a3fd0" stop-opacity=".12"/><stop offset="1" stop-color="#5a3fd0" stop-opacity="0"/></radialGradient>
        <radialGradient id="mwCore"><stop offset="0" stop-color="#fff7d6"/><stop offset=".18" stop-color="#ffd447" stop-opacity=".9"/><stop offset=".5" stop-color="#ff9a3c" stop-opacity=".25"/><stop offset="1" stop-color="#ff9a3c" stop-opacity="0"/></radialGradient>
        <filter id="mwBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="7"/></filter>
        <g id="mwArms" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M214 200L222 204L229 211L234 220L236 232L235 245L231 258L223 271L211 282L196 291L177 297L157 300L135 297L112 290L91 278L71 261L54 239L40 213L32 183L29 151L33 118"/>
          <path d="M200 214L196 222L189 229L180 234L168 236L155 235L142 231L129 223L118 211L109 196L103 177L100 157L103 135L110 112L122 91L139 71L161 54L187 40L217 32L249 29L282 33"/>
          <path d="M186 200L178 196L171 189L166 180L164 168L165 155L169 142L177 129L189 118L204 109L223 103L243 100L265 103L288 110L309 122L329 139L346 161L360 187L368 217L371 249L367 282"/>
          <path d="M200 186L204 178L211 171L220 166L232 164L245 165L258 169L271 177L282 189L291 204L297 223L300 243L297 265L290 288L278 309L261 329L239 346L213 360L183 368L151 371L118 367"/>
        </g>
      </defs>
      <circle cx="200" cy="200" r="198" fill="url(#mwDisk)"/>
      <use href="#mwArms" stroke="#9aa8ff" stroke-opacity=".5" stroke-width="22" filter="url(#mwBlur)"/>
      <use href="#mwArms" stroke="#ffd9f0" stroke-opacity=".9" stroke-width="3" stroke-dasharray=".1 6"/>
      <use href="#mwArms" stroke="#ffffff" stroke-opacity=".8" stroke-width="1.6" stroke-dasharray=".1 3.3" stroke-dashoffset="1.5"/>
      <use href="#mwArms" stroke="#a8f3ea" stroke-opacity=".6" stroke-width="5" stroke-dasharray=".1 11" stroke-dashoffset="4"/>
      <circle cx="200" cy="200" r="70" fill="url(#mwCore)"/>
    </svg>`;

  const UNIVERSE = `
    <svg viewBox="0 0 400 400">
      <defs>
        <radialGradient id="uvBall"><stop offset="0" stop-color="#1f2f78" stop-opacity=".55"/><stop offset=".8" stop-color="#0c1448" stop-opacity=".5"/><stop offset="1" stop-color="#3de0c9" stop-opacity=".18"/></radialGradient>
        <radialGradient id="uvNode"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".25" stop-color="#9ff0e6" stop-opacity=".6"/><stop offset="1" stop-color="#3de0c9" stop-opacity="0"/></radialGradient>
        <filter id="uvBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
        <g id="uvWeb" fill="none" stroke-linecap="round">
          <path d="M200 200Q221 170 233 133M200 200Q142 167 104 161M329 224Q349 173 368 147M329 224Q285 258 258 306M258 306Q214 319 196 335M196 335Q161 329 129 304M129 304Q87 263 44 215M44 215Q74 193 104 161M126 59Q114 104 104 161M126 59Q193 110 233 133M368 147Q310 146 233 133"/>
        </g>
      </defs>
      <circle cx="200" cy="200" r="196" fill="url(#uvBall)" stroke="#3de0c9" stroke-opacity=".4" stroke-width="1.5"/>
      <use href="#uvWeb" stroke="#3de0c9" stroke-opacity=".45" stroke-width="9" filter="url(#uvBlur)"/>
      <use href="#uvWeb" stroke="#e8fffb" stroke-opacity=".9" stroke-width="2.2" stroke-dasharray=".1 5.5"/>
      <use href="#uvWeb" stroke="#ffd9f0" stroke-opacity=".7" stroke-width="1.4" stroke-dasharray=".1 3" stroke-dashoffset="2"/>
      <g>
        <circle cx="329" cy="224" r="16" fill="url(#uvNode)"/><circle cx="258" cy="306" r="16" fill="url(#uvNode)"/>
        <circle cx="196" cy="335" r="14" fill="url(#uvNode)"/><circle cx="129" cy="304" r="16" fill="url(#uvNode)"/>
        <circle cx="44" cy="215" r="14" fill="url(#uvNode)"/><circle cx="104" cy="161" r="18" fill="url(#uvNode)"/>
        <circle cx="126" cy="59" r="14" fill="url(#uvNode)"/><circle cx="233" cy="133" r="18" fill="url(#uvNode)"/>
        <circle cx="368" cy="147" r="14" fill="url(#uvNode)"/><circle cx="200" cy="200" r="20" fill="url(#uvNode)"/>
      </g>
      <circle class="mw" cx="200" cy="200" r="3.5" fill="#ffd447"/>
      <circle cx="200" cy="200" r="3.5" fill="#ffd447"/>
    </svg>`;

  // Riyad, in his spaceship (facing up).
  const SHIP = `
    <svg viewBox="0 0 100 150">
      <defs>
        <linearGradient id="shHull" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#d9d4ff"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#b3acea"/></linearGradient>
        <radialGradient id="shGlass" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff" stop-opacity=".7"/><stop offset="1" stop-color="#9ad7ff" stop-opacity=".16"/></radialGradient>
      </defs>
      <g class="flame">
        <path d="M37 118Q50 160 63 118Z" fill="#ff9a3c"/>
        <path d="M43 118Q50 144 57 118Z" fill="#ffe27a"/>
      </g>
      <path d="M30 84L8 118Q8 126 17 121L35 108Z" fill="#ff6fb5"/>
      <path d="M70 84L92 118Q92 126 83 121L65 108Z" fill="#ff6fb5"/>
      <path d="M50 4Q82 34 79 86L75 116H25L21 86Q18 34 50 4Z" fill="url(#shHull)"/>
      <path d="M50 4Q65 16 71 34H29Q35 16 50 4Z" fill="#ff6fb5"/>
      <rect x="37" y="114" width="26" height="9" rx="3" fill="#6b5bd6"/>
      <circle cx="50" cy="62" r="22" fill="#ffd447"/>
      <circle cx="50" cy="62" r="18" fill="#1c1c5c"/>
      <circle cx="50" cy="64" r="10" fill="#c98f62"/>
      <path d="M40 60Q50 47 60 60Q50 55 40 60Z" fill="#2a1a14"/>
      <circle cx="46" cy="64" r="1.7" fill="#26263a"/><circle cx="54" cy="64" r="1.7" fill="#26263a"/>
      <path d="M45.5 69Q50 73 54.5 69" fill="none" stroke="#26263a" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="50" cy="63" r="15" fill="url(#shGlass)" stroke="#d6ecff" stroke-width="2.5"/>
      <path d="M39 53Q43 47 50 46" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>
      <circle cx="29" cy="96" r="2.2" fill="#8a6bff"/><circle cx="71" cy="96" r="2.2" fill="#8a6bff"/>
    </svg>`;

  /** The animated scene. Re-rendering it restarts every CSS animation from the beginning. */
  const artHTML = (active) => `
    <div class="j-twk"><div class="j-stars"></div><div class="j-stars b"></div></div>
    <div class="j-tint t1"></div><div class="j-tint t2"></div><div class="j-tint t3"></div>

    <div class="j-scene earthS">
      <div class="j-earth-glow"></div>
      <div class="j-earth"><div class="land"></div><div class="clouds"></div><div class="shade"></div></div>
      <div class="j-moon-orbit"><i></i></div>
    </div>

    <div class="j-scene solarS">
      <div class="j-orb j-o1"><i></i></div><div class="j-orb j-o2"><i></i></div><div class="j-orb j-o3"><i></i></div>
      <div class="j-orb j-o4"><i></i></div><div class="j-orb j-o5"><i></i></div><div class="j-orb j-o6"><i></i></div>
      <div class="j-orb j-o7"><i></i></div><div class="j-orb j-o8"><i></i></div>
      <div class="j-sun"></div>
    </div>

    <div class="j-scene galS"><div class="j-gal-rot">${GALAXY}<div class="j-you"><span>You are here</span></div></div></div>
    <div class="j-scene uniS j-uni">${UNIVERSE}</div>

    <div class="j-stackbox">
      <div class="j-stack${active >= 0 ? ' has-on' : ''}">
        ${LAYERS.map((l, i) => `<div class="j-slab j-l${i + 1}${active === i ? ' on' : ''}"><b>${i + 1}</b></div>`).join('')}
      </div>
      ${LAYERS.map((l, i) => `<div class="j-lab j-l${i + 1}"><em>${i + 1}</em>${l.name}</div>`).join('')}
    </div>

    <div class="j-flash"></div>
    <div class="j-ship"><div class="j-ship-bob">${SHIP}<span class="j-ship-tag">Riyad</span></div></div>

    <div class="j-caps">
      ${STOPS.map((st, i) => `<div class="j-cap c${i + 1}${i === STOPS.length - 1 ? ' last' : ''}"><small>Stop ${i + 1} of ${STOPS.length}</small><h2>${st.title}</h2><p>${st.text}</p></div>`).join('')}
    </div>

    <div class="j-fade"></div>
    <div class="j-prog" aria-hidden="true">
      <div class="j-rail"><i></i></div>
      <div class="j-stops">
        <span class="j-stop s1">Earth</span><span class="j-stop s2">Solar System</span><span class="j-stop s3">Milky Way</span>
        <span class="j-stop s4">Universe</span><span class="j-stop s5">7 Layers</span>
      </div>
    </div>`;

  // Play the full animation once per browser session; later visits open on the finished stack.
  const SEEN = 'cosmo-journey-seen';
  C.journeySeen = () => { try { return sessionStorage.getItem(SEEN) === '1'; } catch (e) { return false; } };

  C.mountJourney = function (root) {
    let active = -1;
    const instant = C.journeySeen() || C.reduceMotion.matches;
    try { sessionStorage.setItem(SEEN, '1'); } catch (e) { /* ignore */ }
    root.innerHTML = `
      <section aria-label="Journey from Earth to the seven-layer stack">
        <div class="sr">
          <h2>Animated journey</h2>
          <p>Astronaut Riyad flies his spaceship from Earth, zooming out in five stops. You can pause, replay or skip the animation.</p>
          <ol>${STOPS.map((st) => `<li><b>${st.title}.</b> ${st.text}</li>`).join('')}</ol>
        </div>
        <div class="j-stage" id="jStage">
          <div class="j-art" id="jArt" aria-hidden="true"></div>
          <div class="j-ctls">
            <button class="j-ctl" id="jPause" type="button" aria-label="Pause the journey">${ICON.pause}</button>
            <button class="j-ctl" id="jReplay" type="button" aria-label="Replay the journey">${ICON.replay}</button>
            <button class="j-ctl" id="jSkip" type="button" aria-label="Skip to the seven layers">${ICON.skip}</button>
          </div>
        </div>
      </section>
      <section aria-labelledby="jLayersTitle">
        <div class="section-title"><h2 id="jLayersTitle">The seven layers</h2><p>Tap a layer to light it up</p></div>
        <div class="j-lgrid">${LAYERS.map((l, i) => `
          <button class="j-lcard j-l${i + 1}" type="button" data-layer="${i}" aria-pressed="false">
            <span class="n">${i + 1}</span><b>${l.name}</b><small>${i === 0 ? 'Layer 1 · real' : 'Layer ' + (i + 1) + ' · big idea'}</small>
          </button>`).join('')}
        </div>
        <div class="panel j-ldetail" id="jDetail" aria-live="polite"></div>
      </section>`;

    const stage = C.$('#jStage', root);
    const art = C.$('#jArt', root);
    const pause = C.$('#jPause', root);
    const detail = C.$('#jDetail', root);
    const cards = C.$$('.j-lcard', root);

    const setPaused = (p) => {
      stage.classList.toggle('paused', p);
      pause.innerHTML = p ? ICON.play : ICON.pause;
      pause.setAttribute('aria-label', p ? 'Play the journey' : 'Pause the journey');
    };

    const showDetail = () => {
      cards.forEach((c, i) => c.setAttribute('aria-pressed', String(i === active)));
      detail.className = 'panel j-ldetail' + (active >= 0 ? ' j-l' + (active + 1) : '');
      detail.innerHTML = (active >= 0
        ? `<h3>${active + 1}. ${LAYERS[active].name}</h3><p>${LAYERS[active].text}</p>`
        : '<h3>Tap a layer</h3><p>Pick any of the seven layers to see what lives there.</p>')
        + '<p class="note">Layers 2 to 7 are big ideas that scientists and storytellers explore. Nobody has seen them yet!</p>';
      const stack = C.$('.j-stack', art);
      stack.classList.toggle('has-on', active >= 0);
      C.$$('.j-slab', art).forEach((s, i) => s.classList.toggle('on', i === active));
    };

    const play = () => {
      stage.classList.remove('spd-skip');
      setPaused(false);
      art.innerHTML = artHTML(active);
    };

    pause.addEventListener('click', () => setPaused(!stage.classList.contains('paused')));
    C.$('#jReplay', root).addEventListener('click', play);
    C.$('#jSkip', root).addEventListener('click', () => { stage.classList.add('spd-skip'); setPaused(false); });
    cards.forEach((c, i) => c.addEventListener('click', () => {
      active = active === i ? -1 : i;
      showDetail();
    }));

    play();
    if (instant) stage.classList.add('spd-skip');
    showDetail();

    // Stop the endless animations while the stage is scrolled out of view.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (!stage.isConnected) return io.disconnect();
        stage.classList.toggle('offscreen', !entries[entries.length - 1].isIntersecting);
      });
      io.observe(stage);
    }
  };
})();
