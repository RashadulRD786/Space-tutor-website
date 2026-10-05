/* Lesson player: one animated visual + a short explanation per step. */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});

  C.renderLearn = function (root) {
    root.innerHTML = `
      <div class="section-title"><h1>Pick a mission</h1></div>
      <p class="lead">Each mission has short, animated steps. Finish one to earn ⭐⭐⭐, then test yourself with a quiz!</p>
      <div class="grid cards" style="margin-top:20px">${C.LESSONS.map((l) => {
        const done = C.Progress.lessonDone(l.id);
        return `<article class="card" style="--c:${l.color}">
          <span class="emoji" aria-hidden="true">${l.emoji}</span>
          <h3>${l.title}</h3>
          <p>${l.blurb}</p>
          <div class="meta"><span class="tag${done ? ' done' : ''}">${done ? '✅ Completed' : l.steps.length + ' steps'}</span>
            <span class="tag">Quiz best: ${C.Progress.quizBest(l.id)}/5</span></div>
          <div class="actions"><a class="btn small" href="#lesson/${l.id}">${done ? 'Replay' : 'Start'} lesson</a>
            <a class="btn small ghost" href="#quiz/${l.id}">Take quiz</a></div>
        </article>`;
      }).join('')}</div>`;
  };

  C.renderLesson = function (root, id) {
    const lesson = C.LESSONS.find((l) => l.id === id);
    if (!lesson) { location.hash = '#learn'; return; }
    let i = 0;

    root.innerHTML = `
      <div class="lesson">
        <div class="lesson-head">
          <a class="btn small ghost" href="#learn" aria-label="Back to missions">←</a>
          <h2>${lesson.emoji} ${lesson.title}</h2>
          <span class="tag" id="lsCount"></span>
        </div>
        <div class="dots" id="lsDots" aria-hidden="true">${lesson.steps.map(() => '<i></i>').join('')}</div>
        <div class="stage" id="lsStage"></div>
        <div class="step-body" id="lsBody" aria-live="polite"></div>
        <div class="lesson-nav">
          <button class="btn ghost" id="lsPrev" type="button">← Back</button>
          <button class="btn" id="lsNext" type="button">Next →</button>
        </div>
      </div>`;

    const $ = (s) => C.$(s, root);

    function show() {
      const step = lesson.steps[i];
      // A fresh stage element per step: it stops any animation loops started by the previous visual.
      const stage = document.createElement('div');
      stage.className = 'stage';
      stage.id = 'lsStage';
      $('#lsStage').replaceWith(stage);
      C.Visuals[step.visual](stage);

      $('#lsBody').innerHTML = `<h3>${step.title}</h3><p>${step.text}</p>`;
      $('#lsCount').textContent = `Step ${i + 1} of ${lesson.steps.length}`;
      C.$$('#lsDots i', root).forEach((d, k) => d.classList.toggle('on', k <= i));
      $('#lsPrev').disabled = i === 0;
      $('#lsNext').textContent = i === lesson.steps.length - 1 ? 'Finish! 🎉' : 'Next →';
    }

    function finish() {
      const res = C.Progress.completeLesson(id);
      C.confetti();
      C.Mascot.say(res.gained ? 'Mission complete! You earned 3 stars!' : 'Great job! Ready for the quiz?');
      root.innerHTML = `
        <div class="lesson panel done-card">
          <div class="big" aria-hidden="true">🏆</div>
          <h2>Mission complete!</h2>
          <p class="lead" style="margin:0 auto 18px">${res.gained ? 'You earned <b>3 ⭐</b> for finishing ' : 'You finished '}${lesson.title}.</p>
          <div class="btn-row" style="justify-content:center">
            <a class="btn" href="#quiz/${id}">Take the quiz 🧠</a>
            <a class="btn ghost" href="#learn">More missions</a>
            <a class="btn ghost" href="#play">Play a game 🎮</a>
          </div>
        </div>`;
    }

    $('#lsPrev').addEventListener('click', () => { if (i > 0) { i--; show(); } });
    $('#lsNext').addEventListener('click', () => {
      if (i < lesson.steps.length - 1) { i++; show(); } else finish();
    });
    show();
  };
})();
