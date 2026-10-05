/* All learning content lives here: planets, facts, lessons and quiz questions.
   To add a lesson: add an entry to LESSONS (steps pick a visual from visuals.js)
   and a matching entry in QUIZZES with the same id. */
(function () {
  const C = (window.Cosmo = window.Cosmo || {});

  // r = visual radius in the orbit map, orbit = orbit radius, period = seconds for one animated lap
  C.PLANETS = [
    { id: 'mercury', name: 'Mercury', c1: '#d9d9df', c2: '#8d8d98', r: 6, orbit: 62, period: 6, size: 4879,
      tag: 'The speedy little one', day: '59 Earth days', year: '88 Earth days', moons: '0', dist: '58 million km', type: 'Rocky',
      fact: 'Mercury zooms around the Sun in just 88 days, so a year there is shorter than a season on Earth!' },
    { id: 'venus', name: 'Venus', c1: '#ffe2a3', c2: '#d39a45', r: 9, orbit: 92, period: 10, size: 12104,
      tag: 'The hottest planet', day: '243 Earth days', year: '225 Earth days', moons: '0', dist: '108 million km', type: 'Rocky',
      fact: 'Venus is hotter than Mercury! Its thick clouds trap heat like a super-strong blanket. It also spins backwards.' },
    { id: 'earth', name: 'Earth', c1: '#8fd3ff', c2: '#2b6fd6', r: 10, orbit: 124, period: 14, size: 12742,
      tag: 'Our home!', day: '24 hours', year: '365 days', moons: '1', dist: '150 million km', type: 'Rocky',
      fact: 'Earth is the only place we know of with life. Over two thirds of its surface is covered by ocean.' },
    { id: 'mars', name: 'Mars', c1: '#ff9d78', c2: '#c4482a', r: 7.5, orbit: 156, period: 20, size: 6779,
      tag: 'The Red Planet', day: '24.6 hours', year: '687 Earth days', moons: '2', dist: '228 million km', type: 'Rocky',
      fact: 'Mars has the tallest volcano in the solar system, Olympus Mons. It is about three times taller than Mount Everest!' },
    { id: 'jupiter', name: 'Jupiter', c1: '#f3d4b0', c2: '#c0865a', r: 21, orbit: 214, period: 34, size: 139820,
      tag: 'The giant king', day: '10 hours', year: '12 Earth years', moons: '95', dist: '778 million km', type: 'Gas giant',
      fact: 'Jupiter\'s Great Red Spot is a giant storm that has been swirling for hundreds of years, and it is bigger than Earth!' },
    { id: 'saturn', name: 'Saturn', c1: '#fff0b8', c2: '#d0aa5c', r: 17, orbit: 262, period: 46, size: 116460, ring: true,
      tag: 'The ringed beauty', day: '10.7 hours', year: '29 Earth years', moons: '140+', dist: '1.4 billion km', type: 'Gas giant',
      fact: 'Saturn is so light for its size that it would float in a giant bathtub. Its rings are made of ice and rock chunks.' },
    { id: 'uranus', name: 'Uranus', c1: '#c9fbff', c2: '#52c4cf', r: 13, orbit: 308, period: 60, size: 50724,
      tag: 'The sideways spinner', day: '17 hours', year: '84 Earth years', moons: '28', dist: '2.9 billion km', type: 'Ice giant',
      fact: 'Uranus rolls around the Sun on its side, like a ball rolling along its orbit!' },
    { id: 'neptune', name: 'Neptune', c1: '#8fa8ff', c2: '#2f46c9', r: 13, orbit: 352, period: 76, size: 49244,
      tag: 'The windy blue world', day: '16 hours', year: '165 Earth years', moons: '16', dist: '4.5 billion km', type: 'Ice giant',
      fact: 'Neptune has the fastest winds in the solar system, more than 2,000 km/h. That is faster than a jet plane!' },
  ];

  C.FACTS = [
    'A day on Venus is longer than its year!',
    'The Sun is a star, and it is so big that more than a million Earths could fit inside it.',
    'Footprints on the Moon can last for millions of years because there is no wind to blow them away.',
    'Light from the Sun takes about 8 minutes to reach Earth.',
    'There are more stars in the universe than grains of sand on all of Earth\'s beaches.',
    'Astronauts on the space station see 16 sunrises and sunsets every day!',
    'Saturn\'s moon Titan has lakes, rivers and clouds, but they are made of liquid methane.',
    'A spoonful of a neutron star would weigh as much as a mountain.',
    'The Milky Way galaxy has hundreds of billions of stars.',
    'On Mars, the sunset looks blue!',
    'The Moon is moving away from Earth by about 4 centimeters every year.',
    'Jupiter has the shortest day of all the planets: only about 10 hours.',
  ];

  C.LESSONS = [
    {
      id: 'solar', title: 'The Solar System', emoji: '🪐', color: '#8a6bff',
      blurb: 'Meet the Sun and its eight planets, and find out what keeps them zooming in circles.',
      steps: [
        { title: 'Our cosmic neighborhood', visual: 'sun',
          text: 'In the middle of our solar system sits the Sun, a giant ball of glowing gas. It is a star, and it is about 109 times wider than Earth! Eight planets travel around it.' },
        { title: 'Rocky worlds and giants', visual: 'planet-groups',
          text: 'The four planets closest to the Sun are small and rocky. The four farthest away are giants made of gas and ice. Jupiter is the biggest of all!' },
        { title: 'Gravity: the invisible rope', visual: 'gravity',
          text: 'Why don\'t planets fly away? The Sun\'s gravity pulls on them like an invisible rope. Try cutting the rope with the button and see where the planet goes!' },
        { title: 'Days and years', visual: 'spin',
          text: 'A planet spinning around once makes one day. A planet going all the way around the Sun makes one year. On Earth that is 24 hours and 365 days.' },
      ],
    },
    {
      id: 'stars', title: 'Stars & Constellations', emoji: '⭐', color: '#ffd447',
      blurb: 'Discover why stars twinkle, why they have different colors and how they live and die.',
      steps: [
        { title: 'Balls of glowing gas', visual: 'sun',
          text: 'Stars are enormous balls of super-hot gas that make their own light. Our Sun is a star too! The others look tiny only because they are very, very far away.' },
        { title: 'Star colors', visual: 'star-colors',
          text: 'Stars come in different colors, and the color tells us how hot they are. Blue stars are the hottest, our yellow Sun is medium, and red stars are the coolest.' },
        { title: 'The life of a star', visual: 'star-life',
          text: 'Stars are born in clouds of gas and dust. They shine for millions or even billions of years, then swell up, and finally fade. Tap each stage to see how it changes!' },
        { title: 'Join the dots', visual: 'constellation',
          text: 'People long ago imagined pictures in the stars called constellations. This one is the Big Dipper. It looks like a big cooking spoon!' },
      ],
    },
    {
      id: 'galaxies', title: 'Galaxies', emoji: '🌌', color: '#ff6fb5',
      blurb: 'Zoom out to giant cities of stars and learn how far a light-year really is.',
      steps: [
        { title: 'Cities of stars', visual: 'galaxy',
          text: 'A galaxy is a gigantic family of stars, gas and dust, all held together by gravity. Some galaxies have billions of stars, and some have even more!' },
        { title: 'Galaxy shapes', visual: 'galaxy-shapes',
          text: 'Galaxies come in different shapes. Spiral galaxies have swirly arms, elliptical galaxies are round like fuzzy eggs, and irregular galaxies have no special shape at all.' },
        { title: 'Our home: the Milky Way', visual: 'milkyway',
          text: 'We live in a spiral galaxy called the Milky Way. Our Sun is just one of hundreds of billions of stars in it. Our home is out in one of the arms, far from the middle.' },
        { title: 'What is a light-year?', visual: 'lightyear',
          text: 'Light is the fastest thing there is. A light-year is how far light travels in one whole year, which is almost 10 trillion kilometers! Space is so big that we measure it this way.' },
      ],
    },
    {
      id: 'explore', title: 'Space Exploration', emoji: '🚀', color: '#3de0c9',
      blurb: 'Blast off with rockets, satellites, moonwalkers, Mars rovers and giant space telescopes.',
      steps: [
        { title: 'Blast off!', visual: 'rocket',
          text: 'To escape Earth\'s gravity, a rocket needs a huge push. Its engines burn fuel and shoot hot gas down, which pushes the rocket up. It has to go about 28,000 km/h to stay in orbit!' },
        { title: 'The first satellite', visual: 'satellite',
          text: 'In 1957 a metal ball called Sputnik 1 became the first satellite. It went around Earth and beeped a radio signal. Today thousands of satellites help with maps, weather and TV.' },
        { title: 'One small step', visual: 'moon',
          text: 'In 1969 Neil Armstrong and Buzz Aldrin landed on the Moon. Moon gravity is only about one sixth of Earth\'s, so astronauts could hop very high!' },
        { title: 'Robots on Mars', visual: 'rover',
          text: 'Robot explorers called rovers drive across Mars. They study rocks, take photos and look for signs of ancient water and life. Sojourner, Curiosity and Perseverance are some of them.' },
        { title: 'Eyes in space', visual: 'telescope',
          text: 'The James Webb Space Telescope has a giant mirror made of 18 golden hexagons. It sees infrared light, and it can spot some of the very first galaxies ever formed!' },
      ],
    },
  ];

  // c = index of the correct option. Options are shuffled at play time.
  C.QUIZZES = {
    solar: [
      { q: 'Which planet is closest to the Sun?', a: ['Mercury', 'Venus', 'Earth', 'Mars'], c: 0, why: 'Mercury is the closest planet to the Sun, and it zooms around it in only 88 days.' },
      { q: 'Which planet is famous for its beautiful rings?', a: ['Mars', 'Saturn', 'Earth', 'Mercury'], c: 1, why: 'Saturn\'s bright rings are made of ice and rock, and you can see them with a small telescope.' },
      { q: 'What keeps the planets travelling around the Sun?', a: ['Wind', 'Magnets', 'Gravity', 'Rocket engines'], c: 2, why: 'The Sun\'s gravity pulls on the planets like an invisible rope.' },
      { q: 'Which planet is called the Red Planet?', a: ['Venus', 'Jupiter', 'Neptune', 'Mars'], c: 3, why: 'Mars looks red because its dust and rocks contain rusty iron.' },
      { q: 'How many planets are in our solar system?', a: ['Seven', 'Eight', 'Nine', 'Ten'], c: 1, why: 'There are eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune.' },
    ],
    stars: [
      { q: 'What is our Sun?', a: ['A planet', 'A comet', 'A star', 'A moon'], c: 2, why: 'The Sun is a star. It looks big and bright because it is so close to us.' },
      { q: 'Which color of star is the hottest?', a: ['Blue', 'Red', 'Orange', 'Yellow'], c: 0, why: 'Blue stars are the hottest, and red stars are the coolest.' },
      { q: 'What do we call a pattern of stars that makes a picture in the sky?', a: ['A planet', 'A constellation', 'An orbit', 'A crater'], c: 1, why: 'Constellations are star pictures, like the Big Dipper or Orion the hunter.' },
      { q: 'Stars are born inside giant clouds of gas and dust. What are these clouds called?', a: ['Craters', 'Comets', 'Moons', 'Nebulae'], c: 3, why: 'A cloud like this is called a nebula. Gravity squeezes it together until a baby star lights up!' },
      { q: 'What will a star like our Sun turn into at the end of its life?', a: ['A white dwarf', 'A new planet', 'A comet', 'A black hole'], c: 0, why: 'After puffing up into a red giant, a Sun-like star shrinks into a small, hot white dwarf.' },
    ],
    galaxies: [
      { q: 'What is a galaxy?', a: ['A huge group of stars, gas and dust', 'A very big planet', 'A type of comet', 'A space rock'], c: 0, why: 'A galaxy is a giant family of stars, gas and dust held together by gravity.' },
      { q: 'What is the name of the galaxy we live in?', a: ['Andromeda', 'Sombrero', 'The Milky Way', 'Pinwheel'], c: 2, why: 'Our home galaxy is the Milky Way. Andromeda is our nearest big neighbor.' },
      { q: 'What shape is the Milky Way?', a: ['A cube', 'A spiral', 'A triangle', 'A perfect ball'], c: 1, why: 'The Milky Way is a spiral with swirly arms, and the Sun lives in one of them.' },
      { q: 'A light-year measures...', a: ['Time', 'Weight', 'Brightness', 'Distance'], c: 3, why: 'Even though it has "year" in its name, a light-year is a distance: how far light travels in a year.' },
      { q: 'About how many stars are in the Milky Way?', a: ['Hundreds of billions', 'About one hundred', 'Exactly one million', 'Only the ones we can see'], c: 0, why: 'There are hundreds of billions of stars in the Milky Way, and most are too faint to see without a telescope.' },
    ],
    explore: [
      { q: 'What was the first human-made satellite?', a: ['Hubble', 'Sputnik 1', 'Voyager', 'Apollo 11'], c: 1, why: 'Sputnik 1 launched in 1957 and beeped radio signals as it circled Earth.' },
      { q: 'Who was the first person to walk on the Moon?', a: ['Neil Armstrong', 'Sally Ride', 'Yuri Gagarin', 'Buzz Lightyear'], c: 0, why: 'Neil Armstrong stepped onto the Moon on July 20, 1969.' },
      { q: 'What do we call robot vehicles that drive around on Mars?', a: ['Submarines', 'Gliders', 'Rovers', 'Canoes'], c: 2, why: 'Rovers like Curiosity and Perseverance explore the surface of Mars for us.' },
      { q: 'Which telescope has a mirror made of 18 golden hexagons?', a: ['Hubble', 'A pair of binoculars', 'The Moon lander', 'James Webb'], c: 3, why: 'The James Webb Space Telescope uses 18 gold-coated mirror pieces to catch faint infrared light.' },
      { q: 'What does a rocket need to leave Earth?', a: ['Powerful engines pushing it up', 'Big wings', 'A long runway', 'A parachute'], c: 0, why: 'Rockets need a huge push from their engines to beat Earth\'s gravity.' },
    ],
  };

  C.QUIZ_META = {
    solar: { title: 'Solar System Quiz', emoji: '🪐', color: '#8a6bff' },
    stars: { title: 'Stars Quiz', emoji: '⭐', color: '#ffd447' },
    galaxies: { title: 'Galaxy Quiz', emoji: '🌌', color: '#ff6fb5' },
    explore: { title: 'Exploration Quiz', emoji: '🚀', color: '#3de0c9' },
    mixed: { title: 'Mixed Mission', emoji: '🎲', color: '#ff9a3c' },
  };

  C.GAMES = [
    { id: 'order', title: 'Planet Order', emoji: '🪐', color: '#8a6bff', blurb: 'Put the planets in order, starting from the Sun.' },
    { id: 'catcher', title: 'Star Catcher', emoji: '🚀', color: '#ffd447', blurb: 'Fly your rocket to catch stars and dodge asteroids!' },
    { id: 'memory', title: 'Planet Match', emoji: '🃏', color: '#ff6fb5', blurb: 'Flip cards to match each planet with its name.' },
  ];
})();
