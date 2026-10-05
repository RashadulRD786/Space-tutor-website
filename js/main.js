/* Hash router, home page and global progress UI. */
(function () {
  const C = window.Cosmo;
  const view = document.getElementById('view');
  const starCount = document.getElementById('starCount');
  const ROUTES = {
    home: { nav: 'home', title: 'Home', render: renderHome },
    explore: { nav: 'explore', title: 'Explore the Solar System', render: (r) => { r.innerHTML = '<div class="section-title"><h1>Explore the solar system</h1></div><div id="ss"></div>'; C.mountSolarSystem(C.$('#ss', r)); } },
    learn: { nav: 'learn', title: 'Missions', render: (r) => C.renderLearn(r) },
    lesson: { nav: 'learn', title: 'Lesson', render: (r, id) => C.renderLesson(r, id) },
    play: { nav: 'play', title: 'Games', render: (r, id) => (id ? C.renderGame(r, id) : C.renderGames(r)) },
    quiz: { nav: 'quiz', title: 'Quizzes', render: (r, id) => (id ? C.renderQuiz(r, id) : C.renderQuizMenu(r)) },
  };
  let greeted = false;

  function renderHome(root) {
    const done = C.LESSONS.filter((l) => C.Progress.lessonDone(l.id)).length;
    const earned = C.Progress.badges.filter((b) => C.Progress.hasBadge(b.id)).length;
    const dot = (id, ps) => { const p = C.PLANETS.find((x) => x.id === id); return `--ps:${ps}px;--c1:${p.c1};--c2:${p.c2}`; };
    const seen = C.journeySeen(); // first visit: journey on top; afterwards the hero comes first
    root.innerHTML = `
      ${seen ? '' : '<div id="journey"></div>'}

      <section class="hero">
        <div class="hero-copy">
          <p class="tag">🚀 Space school for curious kids</p>
          <h1>Blast off into <span>space!</span></h1>
          <p class="lead">Meet the planets, visit the stars, race through galaxies and play games with Cosmo the astronaut pup. Ready for launch?</p>
          <div class="btn-row"><a class="btn" href="#learn">Start your mission 🚀</a><a class="btn ghost" href="#explore">Explore the planets</a></div>
        </div>
        <div class="hero-scene" id="heroScene" title="Tap the space for a shooting star!">
          <div class="h-ring r1"><i style="${dot('mercury', 14)}"></i></div>
          <div class="h-ring r2"><i style="${dot('earth', 24)}"></i><i class="moon" style="${dot('mars', 16)}"></i></div>
          <div class="h-ring r3"><i class="ringed" style="${dot('saturn', 28)}"></i></div>
          <div class="h-sun"></div>
          <div class="h-cosmo" aria-hidden="true"><svg viewBox="0 0 120 120"><use href="#cosmo"/></svg></div>
        </div>
      </section>

      <section class="panel fact-card" aria-live="polite">
        <span class="fact-ico" aria-hidden="true">💡</span>
        <p id="fact"><b>Space fact:</b> ${C.pick(C.FACTS)}</p>
        <button class="btn small ghost" id="moreFact" type="button">Another!</button>
      </section>

      ${seen ? '<div id="journey" style="margin-top:34px"></div>' : ''}

      <div class="section-title"><h2>Your missions</h2><p>${done} of ${C.LESSONS.length} complete</p></div>
      <div class="grid cards">${C.LESSONS.map((l) =>
        `<a class="card" href="#lesson/${l.id}" style="--c:${l.color}">
          <span class="emoji" aria-hidden="true">${l.emoji}</span><h3>${l.title}</h3><p>${l.blurb}</p>
          <div class="meta"><span class="tag${C.Progress.lessonDone(l.id) ? ' done' : ''}">${C.Progress.lessonDone(l.id) ? '✅ Completed' : l.steps.length + ' steps'}</span></div></a>`).join('')}</div>

      <div class="section-title"><h2>Your badges</h2><p>${earned} of ${C.Progress.badges.length} earned</p></div>
      <div class="badges">${C.Progress.badges.map((b) =>
        `<div class="badge${C.Progress.hasBadge(b.id) ? ' on' : ''}"><span class="b-ico" aria-hidden="true">${b.icon}</span><b>${b.name}</b><small>${b.desc}</small></div>`).join('')}</div>

      <p class="foot">Progress is saved on this device. <button type="button" id="reset">Start over</button></p>`;

    C.mountJourney(C.$('#journey', root));
    C.$('#heroScene', root).addEventListener('click', () => C.shootingStar());
    C.$('#moreFact', root).addEventListener('click', () => {
      C.$('#fact', root).innerHTML = '<b>Space fact:</b> ' + C.pick(C.FACTS);
      C.shootingStar();
    });
    const reset = C.$('#reset', root);
    reset.addEventListener('click', () => {
      if (reset.dataset.armed) { C.Progress.reset(); route(); return; }
      reset.dataset.armed = '1';
      reset.textContent = 'Tap again to erase all stars and badges';
      setTimeout(() => { reset.textContent = 'Start over'; delete reset.dataset.armed; }, 4000);
    });
  }

  function route() {
    const [name = 'home', param] = decodeURIComponent(location.hash.slice(1)).split('/');
    const r = ROUTES[name] || ROUTES.home;
    document.title = (r.title === 'Home' ? '' : r.title + ' · ') + 'Cosmo Academy';
    C.$$('.nav a').forEach((a) => (a.dataset.nav === r.nav ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current')));
    C.Mascot.hush();
    view.classList.remove('enter');
    r.render(view, param);
    void view.offsetWidth;
    view.classList.add('enter');
    window.scrollTo(0, 0);
    view.focus({ preventScroll: true });
    if (name === 'explore') setTimeout(() => C.Mascot.say('Tap a planet to say hello!', 5000), 700);
    if (!greeted && (name === 'home' || !ROUTES[name])) {
      greeted = true;
      setTimeout(() => C.Mascot.say('Hi! I\'m Cosmo! Tap me any time for a space fact.', 7000), 1200);
    }
  }

  const refreshStars = (flash) => {
    starCount.textContent = C.Progress.stars();
    if (flash) { const box = starCount.parentElement; box.classList.remove('pop'); void box.offsetWidth; box.classList.add('pop'); }
  };
  C.Progress.onChange(({ gained, badges }) => {
    refreshStars(gained > 0);
    if (badges.length) {
      C.toast('🏅 New badge: ' + badges.map((b) => b.icon + ' ' + b.name).join(', ') + '!', 4200);
      C.confetti(80);
    }
  });

  refreshStars(false);
  window.addEventListener('hashchange', route);
  route();
})();
