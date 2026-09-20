'use strict';
const fs = require('fs');
const s = fs.readFileSync('views/index.ejs', 'utf8');
const a = s.indexOf('<section id="platforms"');
const b = s.indexOf('<div class="platforms-runway', a); // future anchor check
const lines = s.slice(a, a + 1500).split('\n');
for (let i = 0; i < Math.min(lines.length, 16); i++) {
  console.log(String(i).padStart(3) + '| ' + lines[i]);
}
console.log('----');
console.log('runway wrapper already present:', s.indexOf('class="platforms-runway"') !== -1);
console.log('stage wrapper already present:', s.indexOf('class="platforms-stage"') !== -1);
