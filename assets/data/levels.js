/* Levels / programs. Names & descriptions live in assets/i18n/*.js under  level.<id>.*
   To add a level: add an object here + the matching level.<id>.* keys in en.js and vi.js,
   add a color variable (--c-lvl6 …) if you want a new color, and add icon artwork. */
window.YAYLISH_DATA = window.YAYLISH_DATA || {};
window.YAYLISH_DATA.levels = [
  { id: "pre-starters", color: "lvl1", icon: "assets/img/level-pre-starters.svg", ageMin: 4,  ageMax: 5,  sessionsPerWeek: 2, minutes: 60, classSize: 10, outcomes: 4 },
  { id: "starters",     color: "lvl2", icon: "assets/img/level-starters.svg",     ageMin: 6,  ageMax: 7,  sessionsPerWeek: 2, minutes: 60, classSize: 12, outcomes: 4 },
  { id: "movers",       color: "lvl3", icon: "assets/img/level-movers.svg",       ageMin: 8,  ageMax: 9,  sessionsPerWeek: 2, minutes: 75, classSize: 12, outcomes: 4 },
  { id: "flyers",       color: "lvl4", icon: "assets/img/level-flyers.svg",       ageMin: 10, ageMax: 11, sessionsPerWeek: 2, minutes: 90, classSize: 12, outcomes: 4 },
  { id: "ielts-junior", color: "lvl5", icon: "assets/img/level-ielts-junior.svg", ageMin: 11, ageMax: 12, sessionsPerWeek: 2, minutes: 90, classSize: 12, outcomes: 4 }
];
