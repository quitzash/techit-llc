'use strict';
const fs = require('fs');

const css = fs.readFileSync('public/css/styles.css', 'utf8');
const js  = fs.readFileSync('public/js/main.js', 'utf8');

const csA = css.indexOf('.platforms-stack');
const csB = css.indexOf('@media (prefers-reduced-motion: reduce)', csA);
console.log('====== CSS: platforms stack block (real bytes) ======');
console.log(css.slice(csA, csB));

console.log('\n====== JS: boot() + initPlatformStack call ======');
const bi = js.indexOf('function boot()');
const be = js.indexOf('\n  }', bi) + 4;
console.log(js.slice(bi, be));

console.log('\n====== JS: initPlatformStack def (first ~4 lines) ======');
const dri = js.indexOf('function initPlatformStack');
console.log(js.slice(dri, js.indexOf('\n  }', dri) + 3));
