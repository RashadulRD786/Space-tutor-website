/* Home-page footer sections: ratings & reviews, then the FAQ.
   The seeded reviews are SAMPLES for the prototype (the UI says so); reviews typed into
   the form are stored on this device only (localStorage, with an in-memory fallback). */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});
  const KEY = 'cosmo-academy-reviews-v1';

  const SAMPLE_REVIEWS = [
    { name: 'Maya R.', role: 'Parent of a 7-year-old', stars: 5, text: 'My daughter now asks to do a "mission" before bedtime. The planet orbits and Cosmo the pup got her hooked.' },
    { name: 'Daniel K.', role: 'Parent of a 9-year-old', stars: 5, text: 'The galaxy lesson finally made the Milky Way click for him. He quizzed me on the planets afterwards!' },
    { name: 'Ms. Alvarez', role: 'Primary school teacher', stars: 4, text: 'Great for a quick science corner activity. The quizzes are the right length. I would love more lessons.' },
    { name: 'Amir S.', role: 'Age 10', stars: 5, text: 'Star Catcher is my favourite game. I got all three stars and unlocked a badge. The journey intro is so cool!' },
    { name: 'Priya N.', role: 'Parent of twins', stars: 5, text: 'No sign-up and no ads, so I can hand over the tablet without worrying. Both kids take turns collecting stars.' },
    { name: 'Tom H.', role: 'Homeschool parent', stars: 4, text: 'Clear explanations and lovely animations. Planet Match is a nice break between lessons.' },
  ];

  const FAQ = [
    { q: 'What is Cosmo Academy?', a: 'A playful space tutor for kids. You can explore the solar system, learn about stars and galaxies in short missions, take quizzes and play mini-games with Cosmo the astronaut pup.' },
    { q: 'Who is it for?', a: 'Curious kids who love space. Younger explorers will enjoy it most with a grown-up reading along, and older kids can race through the quizzes on their own.' },
    { q: 'Do I need an account or to pay?', a: 'No. There is nothing to sign up for. Just open the page and start your mission.' },
    { q: 'How do stars and badges work?', a: 'You earn stars for finishing lessons (3 each), for correct quiz answers and for your best score in each game. Collect enough stars and complete missions to unlock badges like Star Gazer and Quiz Whiz.' },
    { q: 'Where is my progress saved?', a: 'On this device, in your browser. It is never sent anywhere. Clearing your browser data, or using the "Start over" button, erases it.' },
    { q: 'Does it work on phones and tablets?', a: 'Yes. On small screens the menu moves to the bottom so it is easy to tap, and the games work with touch, mouse or keyboard.' },
    { q: 'Who is Riyad, and what are the seven layers?', a: 'Riyad is the astronaut in the journey animation at the top of the page. He flies from Earth out to the Universe, which is layer 1. Layers 2 to 7 are big ideas that scientists and storytellers explore, and nobody has seen them yet!' },
    { q: 'Can I turn the animations off?', a: 'Yes. Use the pause or skip buttons on the journey. If your device is set to reduce motion, Cosmo Academy calms its animations automatically.' },
  ];

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const STAR = 'M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.1 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z';
  const stars = (n, size = 18) => `<span class="stars" role="img" aria-label="${n} out of 5 stars">${[1, 2, 3, 4, 5].map((i) =>
    `<svg class="${i <= Math.round(n) ? 'on' : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}"/></svg>`).join('')}</span>`;

  let mine = null;
  try { mine = JSON.parse(localStorage.getItem(KEY)); } catch (e) { /* private mode: keep in memory */ }
  if (!mine || typeof mine.stars !== 'number') mine = null;
  const saveMine = () => { try { localStorage.setItem(KEY, JSON.stringify(mine)); } catch (e) { /* ignore */ } };

  function reviewsHTML() {
    const all = (mine ? [mine] : []).concat(SAMPLE_REVIEWS);
    const avg = all.reduce((a, r) => a + r.stars, 0) / all.length;
    const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: all.filter((r) => r.stars === n).length }));
    const draft = mine ? mine.stars : 0;
    return `
      <div class="section-title"><h2>Loved by young explorers</h2><p>Ratings and reviews <span class="tag">Sample reviews</span></p></div>
      <div class="rv-wrap">
        <div class="panel rv-summary">
          <div class="rv-score" aria-label="Average rating ${avg.toFixed(1)} out of 5"><b>${avg.toFixed(1)}</b><span>out of 5</span></div>
          ${stars(avg, 24)}
          <p class="rv-count">${all.length} reviews</p>
          <ul class="rv-bars">${dist.map((d) => `
            <li><span>${d.n}</span><svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}" fill="currentColor"/></svg>
              <i class="bar"><i style="width:${Math.round((d.c / all.length) * 100)}%"></i></i><em>${d.c}</em></li>`).join('')}
          </ul>
        </div>
        <div class="rv-list">${all.map((r, i) => `
          <article class="panel rv-card${mine && i === 0 ? ' mine' : ''}">
            <div class="rv-head"><span class="rv-avatar" aria-hidden="true">${esc(r.name.trim().charAt(0).toUpperCase())}</span>
              <div><b>${esc(r.name)}</b><small>${mine && i === 0 ? 'Your review' : esc(r.role)}</small></div></div>
            ${stars(r.stars)}
            <p>${esc(r.text)}</p>
          </article>`).join('')}
        </div>
      </div>
      <form class="panel rv-form" id="rvForm" novalidate>
        <h3>${mine ? 'Update your review' : 'Rate Cosmo Academy'}</h3>
        <fieldset class="rate"><legend>Your rating</legend>
          <div class="rate-stars">${[5, 4, 3, 2, 1].map((n) => `<input type="radio" name="rate" id="rate${n}" value="${n}"${draft === n ? ' checked' : ''}><label for="rate${n}" title="${n} star${n > 1 ? 's' : ''}"><span class="sr">${n} star${n > 1 ? 's' : ''}</span>
            <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="${STAR}"/></svg></label>`).join('')}</div>
        </fieldset>
        <div class="rv-fields">
          <label>Your name <small>(optional)</small><input type="text" name="name" maxlength="30" autocomplete="given-name" value="${mine ? esc(mine.name === 'A young explorer' ? '' : mine.name) : ''}"></label>
          <label>Your review<textarea name="text" rows="3" maxlength="300" required>${mine ? esc(mine.text) : ''}</textarea></label>
        </div>
        <div class="rv-actions"><button class="btn small" type="submit">${mine ? 'Save changes' : 'Post my review'}</button><span class="rv-msg" id="rvMsg" role="status" aria-live="polite"></span></div>
        <p class="rv-note">Your review is saved on this device only.</p>
      </form>`;
  }

  function faqHTML() {
    return `
      <div class="section-title"><h2>Questions? Cosmo has answers</h2><p>Frequently asked questions</p></div>
      <div class="faq">${FAQ.map((f, i) => `
        <details class="faq-item panel" name="faq"${i === 0 ? ' open' : ''}>
          <summary><span>${f.q}</span><svg class="chev" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></summary>
          <p>${f.a}</p>
        </details>`).join('')}
      </div>`;
  }

  C.mountCommunity = function (root) {
    const render = () => {
      root.innerHTML = `
        <section class="community reviews" aria-labelledby="rvTitle">${reviewsHTML().replace('<h2>', '<h2 id="rvTitle">')}</section>
        <section class="community" aria-labelledby="faqTitle">${faqHTML().replace('<h2>', '<h2 id="faqTitle">')}</section>`;
      const form = C.$('#rvForm', root);
      const msg = C.$('#rvMsg', root);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const rating = Number((form.elements.rate.value || 0));
        const text = form.elements.text.value.trim();
        if (!rating) { msg.textContent = 'Please tap a star rating first.'; msg.className = 'rv-msg bad'; return; }
        if (!text) { msg.textContent = 'Please write a few words about your visit.'; msg.className = 'rv-msg bad'; form.elements.text.focus(); return; }
        mine = { name: form.elements.name.value.trim() || 'A young explorer', role: 'You', stars: rating, text };
        saveMine();
        render();
        if (C.toast) C.toast('Thanks for your review!', 3000);
        if (C.confetti) C.confetti(40);
        const card = C.$('.rv-card.mine', root);
        if (card) card.scrollIntoView({ behavior: C.reduceMotion.matches ? 'auto' : 'smooth', block: 'center' });
      });
    };
    render();
  };
})();
