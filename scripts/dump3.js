'use strict';
const fs = require('fs');

const e = fs.readFileSync('views/index.ejs', 'utf8');
const sA = e.indexOf('<section id="platforms"');
const sB = e.indexOf('</section>', sA) + '</section>'.length;
console.log('===== EJS platforms region (' + (sB - sA) + ' chars) =====');
console.log(e.slice(sA, sB));

console.log('\n\n===== CSS stack region =====');
const c = fs.readFileSync('public/css/styles.css', 'utf8');
const cA = c.indexOf('.platforms-stack');
const cB = c.indexOf('@media (prefers-reduced-motion: reduce)', cA);
console.log(c.slice(cA, cB === -1 ? cA + 7400 : cB));

console.log('\n\n===== JS initPlatformStack =====');
const m = fs.readFileSync('public/js/main.js', 'utf8');
const mA = m.indexOf('function initPlatformStack');
const mB = m.indexOf('\n\n  initPlatformStack', mA);
console.log(m.slice(mA, mB === -1 ? mA + 2600 : mB));
