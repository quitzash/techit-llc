'use strict';
const fs = require('fs');
const report = [];
function probe(label, file, re) {
  const s = fs.readFileSync(file, 'utf8');
  const ok = re.test(s);
  report.push((ok ? 'PASS' : 'FAIL') + '  ' + label);
  return ok;
}
// CSS — vertical stack, 3D entrance, in-view pulse glow gate
probe('css: .platforms-stack exists (vertical column)', 'public/css/styles.css', /\.platforms-stack \{/);
probe('css: 3D perspective/rotateX entrance', 'public/css/styles.css', /perspective:\s*clamp\([^;]+;?\s*rotateX/);
probe('css: glow pulses only when .is-inview', 'public/css/styles.css', /\.platform\.is-inview \.platform-glow\{/);
probe('css: glow is vivid (not translucent) 0.52 core', 'public/css/styles.css', /rgba\(var\(--brand-rgb\), 0\.52\)/);
// JS
probe('js: initPlatformStack defined', 'public/js/main.js', /function initPlatformStack\(\)/);
probe('js: boot() calls initPlatformStack()', 'public/js/main.js', /initPlatformStack\(\);/);
probe('js: IntersectionObserver adds is-inview', 'public/js/main.js', /\.add\('is-inview'\)/);
// EJS
probe('ejs: glow span inside each card', 'views/index.ejs', /platform-glow/);
probe('ejs: vertical stack wrapper', 'views/index.ejs', /platforms-stack/);
console.log('\n--- final verification ---');
report.forEach((r) => console.log('  ' + r));
