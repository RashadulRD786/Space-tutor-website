/* Stars, badges and saved progress (localStorage, with an in-memory fallback). */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});
  const KEY = 'cosmo-academy-v1';

  const blank = () => ({ lessons: {}, quiz: {}, games: {}, badges: {} });
  let state = blank();
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && typeof saved === 'object') state = Object.assign(blank(), saved);
  } catch (e) { /* private mode or corrupted data: start fresh */ }

  const listeners = [];
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } };
  const sum = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);

  const BADGES = [
    { id: 'launch', icon: '🚀', name: 'First Launch', desc: 'Finish any lesson', test: () => Object.keys(state.lessons).length >= 1 },
    { id: 'solar', icon: '🪐', name: 'Solar Explorer', desc: 'Finish the Solar System lesson', test: () => !!state.lessons.solar },
    { id: 'stars', icon: '🔭', name: 'Star Gazer', desc: 'Finish the Stars lesson', test: () => !!state.lessons.stars },
    { id: 'galaxies', icon: '🌌', name: 'Galaxy Surfer', desc: 'Finish the Galaxies lesson', test: () => !!state.lessons.galaxies },
    { id: 'explore', icon: '👩‍🚀', name: 'Mission Control', desc: 'Finish the Exploration lesson', test: () => !!state.lessons.explore },
    { id: 'whiz', icon: '🧠', name: 'Quiz Whiz', desc: 'Get 5 out of 5 on a quiz', test: () => Object.values(state.quiz).some((s) => s >= 5) },
    { id: 'pro', icon: '🏅', name: 'Planet Pro', desc: 'Earn 3 stars in Planet Order', test: () => (state.games.order || 0) >= 3 },
    { id: 'collector', icon: '💫', name: 'Star Collector', desc: 'Collect 20 stars', test: () => P.stars() >= 20 },
  ];

  const P = (C.Progress = {
    badges: BADGES,
    stars: () => sum(state.lessons) + sum(state.quiz) + sum(state.games),
    lessonDone: (id) => !!state.lessons[id],
    quizBest: (id) => state.quiz[id] || 0,
    gameBest: (id) => state.games[id] || 0,
    hasBadge: (id) => !!state.badges[id],
    onChange: (fn) => listeners.push(fn),

    completeLesson(id) {
      const first = !state.lessons[id];
      if (first) state.lessons[id] = 3;
      return this._commit(first ? 3 : 0);
    },
    recordQuiz(id, score) {
      const gain = Math.max(0, score - (state.quiz[id] || 0));
      if (gain) state.quiz[id] = score;
      return this._commit(gain);
    },
    recordGame(id, stars) {
      const gain = Math.max(0, stars - (state.games[id] || 0));
      if (gain) state.games[id] = stars;
      return this._commit(gain);
    },
    reset() {
      state = blank();
      save();
      listeners.forEach((fn) => fn({ gained: 0, badges: [] }));
    },

    _commit(gained) {
      const fresh = BADGES.filter((b) => !state.badges[b.id] && b.test());
      fresh.forEach((b) => (state.badges[b.id] = Date.now()));
      save();
      listeners.forEach((fn) => fn({ gained, badges: fresh }));
      return { gained, badges: fresh };
    },
  });
})();
