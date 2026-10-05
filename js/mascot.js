/* Cosmo the astronaut pup: speech bubbles that cheer, hint and share facts. */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});
  const bubble = document.getElementById('bubble');
  const btn = document.getElementById('mascotBtn');
  let timer = 0;

  C.Mascot = {
    say(text, ms = 6500) {
      bubble.textContent = text;
      bubble.hidden = false;
      bubble.style.animation = 'none';
      void bubble.offsetWidth;
      bubble.style.animation = '';
      clearTimeout(timer);
      timer = setTimeout(() => (bubble.hidden = true), ms);
    },
    hush() { clearTimeout(timer); bubble.hidden = true; },
    fact() { this.say('Did you know? ' + C.pick(C.FACTS), 9000); },
  };

  btn.addEventListener('click', () => C.Mascot.fact());
})();
