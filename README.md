# Cosmo Academy 🚀

A playful, animated astronomy tutor for kids, built as a zero-dependency prototype
(plain HTML, CSS and JavaScript: no build step, no external requests).

## Run it

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## What's inside

| Area | What it shows |
| --- | --- |
| **Home** | A cinematic journey intro (astronaut Riyad flies his spaceship from Earth, through the solar system, the Milky Way and the Universe, then up a stack of seven layers; pause, replay or skip it). It plays in full once per browser session, then the hero comes first and the journey sits below it on its finished stack. It pauses when scrolled out of view, and its five stops are also available as text for screen readers. pure-CSS orbiting-planets hero, parallax starfield with shooting stars (tap the scene for one!), space-fact card, mission and badge overview |
| **Explore** | Interactive solar system: live SVG orbits, speed slider, pause, planet fact cards, and a size-comparison view |
| **Learn** | 4 missions (Solar System, Stars, Galaxies, Space Exploration), each with animated, interactive visuals such as "cut the gravity rope", star life cycle, dot-to-dot constellation, spinning galaxies, rocket countdown and a golden JWST mirror |
| **Quiz** | 5-question quizzes per mission plus a mixed round, with instant feedback, stars and confetti |
| **Play** | Planet Order (drag or tap), Star Catcher (canvas game, touch/mouse/keys), Planet Match (memory cards) |
| **Progress** | Stars and badges saved in `localStorage`; Cosmo the astronaut pup cheers and shares facts |

Responsive from phones (bottom tab bar, large tap targets) to desktops, keyboard accessible,
and `prefers-reduced-motion` calms the animations.

## Structure

```
index.html          app shell + the Cosmo mascot SVG symbol
css/styles.css      tokens, layout, components, responsive rules
css/animations.css  keyframes and CSS-animated scenes
css/journey.css     the home-page journey animation (one timeline length, --d, drives it all)
js/util.js          helpers (animation loop, confetti, toast)
js/data.js          ALL content: planets, facts, lessons, quizzes, games
js/progress.js      stars, badges, saved progress
js/mascot.js        Cosmo's speech bubble
js/starfield.js     canvas background
js/solar-system.js  Explore page
js/journey.js       home-page journey: renders the scene markup, pause/replay/skip, layer cards
js/visuals.js       lesson visuals (registry: name -> function(stage))
js/lessons.js       lesson list + step player
js/quiz.js          quiz engine
js/games.js         the three mini-games
js/main.js          hash router + home page
```

## Adding a lesson

1. Add an entry to `LESSONS` in `js/data.js`; each step names a visual from `js/visuals.js`.
2. Add five questions under the same id in `QUIZZES`, plus an entry in `QUIZ_META`.
3. New visuals are just `Cosmo.Visuals['my-visual'] = (stage) => { stage.innerHTML = ... }`.
   Use `Cosmo.loop(stage, fn)` for animation: it stops by itself when the step changes.
