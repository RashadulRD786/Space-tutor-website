/* Multiple-choice quizzes with instant, friendly feedback. */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});

  C.renderQuizMenu = function (root) {
    root.innerHTML = `
      <div class="section-title"><h1>Quiz time!</h1></div>
      <p class="lead">Five questions each. Every correct answer earns a ⭐, and your best score is saved.</p>
      <div class="grid cards" style="margin-top:20px">${Object.entries(C.QUIZ_META).map(([id, m]) =>
        `<a class="card" href="#quiz/${id}" style="--c:${m.color}">
          <span class="emoji" aria-hidden="true">${m.emoji}</span><h3>${m.title}</h3>
          <div class="meta"><span class="tag">${id === 'mixed' ? 'Random questions' : '5 questions'}</span>
          <span class="tag${C.Progress.quizBest(id) === 5 ? ' done' : ''}">Best: ${C.Progress.quizBest(id)}/5</span></div>
        </a>`).join('')}</div>`;
  };

  C.renderQuiz = function (root, id) {
    const meta = C.QUIZ_META[id];
    if (!meta) { location.hash = '#quiz'; return; }
    const pool = id === 'mixed' ? Object.values(C.QUIZZES).flat() : C.QUIZZES[id];
    const qs = C.shuffle(pool).slice(0, 5).map((q) => {
      const correct = q.a[q.c];
      return { ...q, a: C.shuffle(q.a), correct };
    });
    let n = 0, score = 0;
    const cheers = ['Awesome!', 'Super!', 'You got it!', 'Stellar!', 'Out of this world!'];
    const oops = ['Almost!', 'Good try!', 'Not quite!'];

    function ask() {
      const q = qs[n];
      root.innerHTML = `
        <div class="quiz">
          <div class="q-top"><a class="btn small ghost" href="#quiz" aria-label="Back to quizzes">←</a>
            <span>${meta.emoji} ${meta.title}</span><span>Question ${n + 1} / ${qs.length} · ⭐ ${score}</span></div>
          <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="${qs.length}" aria-valuenow="${n}"><i style="width:${(n / qs.length) * 100}%"></i></div>
          <h2 class="q-text" id="qt">${q.q}</h2>
          <div class="opts" role="group" aria-labelledby="qt">${q.a.map((opt, k) =>
            `<button class="opt" type="button" data-k="${k}"><span class="letter">${'ABCD'[k]}</span><span>${opt}</span></button>`).join('')}</div>
          <div id="fb" aria-live="polite"></div>
        </div>`;
      C.$$('.opt', root).forEach((b) => b.addEventListener('click', () => answer(b)));
    }

    function answer(btn) {
      const q = qs[n];
      const chosen = q.a[+btn.dataset.k];
      const right = chosen === q.correct;
      C.$$('.opt', root).forEach((b) => {
        b.disabled = true;
        if (q.a[+b.dataset.k] === q.correct) b.classList.add('correct');
      });
      if (!right) btn.classList.add('wrong');
      if (right) { score++; C.Mascot.say(C.pick(cheers), 2500); }
      else C.Mascot.say(C.pick(oops), 2500);
      C.$('#fb', root).innerHTML = `
        <div class="feedback${right ? '' : ' bad'}">
          <b>${right ? '🎉 Correct!' : '💡 Here\'s the answer:'}</b> ${q.why}
        </div>
        <div style="margin-top:16px;text-align:right"><button class="btn" id="nx" type="button">${n === qs.length - 1 ? 'See my score 🏁' : 'Next question →'}</button></div>`;
      const nx = C.$('#nx', root);
      nx.addEventListener('click', () => { n++; n < qs.length ? ask() : finish(); });
      nx.focus();
    }

    function finish() {
      const res = C.Progress.recordQuiz(id, score);
      const stars = score === 5 ? 3 : score >= 3 ? 2 : score >= 1 ? 1 : 0;
      const msg = score === 5 ? 'Perfect! You are a space genius!' : score >= 3 ? 'Great work, astronaut!' : 'Good try! Review the lesson and have another go.';
      if (score >= 4) C.confetti();
      C.Mascot.say(msg);
      root.innerHTML = `
        <div class="quiz panel result">
          <h2>${msg}</h2>
          <div class="stars-row" aria-label="${stars} out of 3 stars">${[0, 1, 2].map((k) => `<span class="${k < stars ? 'on' : ''}" style="animation-delay:${k * 0.25}s">⭐</span>`).join('')}</div>
          <p class="score">You got <b>${score}</b> out of ${qs.length} right${res.gained ? ` and earned <b>${res.gained} ⭐</b>` : ''}.</p>
          <div class="btn-row" style="justify-content:center;margin-top:10px">
            <button class="btn" id="again" type="button">Try again 🔁</button>
            <a class="btn ghost" href="#quiz">More quizzes</a>
            ${C.LESSONS.some((l) => l.id === id) ? `<a class="btn ghost" href="#lesson/${id}">Review lesson</a>` : ''}
          </div>
        </div>`;
      C.$('#again', root).addEventListener('click', () => C.renderQuiz(root, id));
    }

    ask();
  };
})();
