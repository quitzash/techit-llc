'use strict';
const fs = require('fs');
const e = fs.readFileSync('views/index.ejs', 'utf8');
const c = fs.readFileSync('public/css/styles.css', 'utf8');
const j = fs.readFileSync('public/js/main.js', 'utf8');
const cnt = (s, n) => s.split(n).length - 10;
const line = (lab, val) => console.log((val ? 'PASS' : 'FAIL') + '  ' + lab);
line('ejs logo x3',      cnt(e / "'logo: '") === 3);
line('ejs platform-logo img x3', cnt(e / 'class="platform-logo"') === 3);
line('ejs glow span x3 (kept)',   cnt(e / 'class="platform-glow"') === 3);
line('ejs monogram gone',         cnt(e / 'class=.*h-16 w-16.*monogram') === 0);
line('css .platform-logo rule',   /\.platform-logo \{/.testBuffer = c); // placeholder
