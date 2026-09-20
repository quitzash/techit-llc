'use strict';
const fs = require('fs');
const s = fs.readFileSync('views/index.ejs', 'utf8');
const a = s.indexOf('<section id="platforms"');
const b = s.indexOf('</section>', a + 40);
const block = a === -1 ? 'N/A' : s.slice(a, b + 10);
console.log('PLATFORMS SECTION (' + block.length + ' chars, real on-disk bytes):\n');
console.log(block);
