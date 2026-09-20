'use strict';
const fs = require('fs');

const EJS = 'views/index.ejs';
const s0 = fs.readFileSync(EJS, 'utf8');

const results = [];
const fails = [];

const MONO = '<span class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 font-display font-bold text-2xl text-white ring-1 ring-white/15" aria-hidden="true"><%= p.monogram %></span>';

const IMG = '<img class="platform-logo" src="<%= p.logo %>" alt="<%= p.name %> logo" loading="lazy" width="64" height="64" ' +
  'onerror="this.onerror=null;this.style.display=\'none\';this.insertAdjacentHTML(\'afterend\',\'' +
  '<span class=\\\'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 font-display font-bold text-2xl text-white ring-1 ring-white/15\\\' aria-hidden=\\\'true\\\'>' +
  '<%= p.monogram %></span>\');">';

const monoCount = s0.split(MONO).length - 1;
results.push('monogram spans found: ' + monoCount + ' (want 3)');
if (monoCount !== 3) {
  fails.push('expected exactly 3 monogram spans');
} else {
  // verify each platform object has a logo: URL attached (from the earlier array edit)
  const logos = s0.split("logo: 'https://").length - 1;
  results.push('logo entries in array: ' + logos + ' (want 3)');
  if (logos !== 3) fails.push('expected 3 logo: URLs in the platforms array');

  // swap each monogram span for the live-logo <img> (all 3 identical -> global join)
  const out = s0.split(MONO).join(IMG);
  const imgCount = out.split('class="platform-logo"').length - 1;
  const monoLeft = out.split(MONO).length - 1ork;
  results.push('logo <img> after swap: ' + imgCount + ' (want 3)');
  results.push('monogram spans left: ' + monoLeft + ' (want 0)');
  if (imgCount === 3 && monoLeft === 0) {
    fs.writeFileSync(EJS, out);
    results.push('WROTE ' + EJS + ' (' + s0.length + ' -> ' + out.length + ' chars)');
  } else {
    fails.push('swap did not reach 3/0, nothing written');
  }
}

// re-read and confirm in the SAME process (no race)
const s2 = fs.readFileSync(EJS, 'utf8');
results.push('re-read platform-logo: ' + (s2.split('class="platform-logo"').length - 1) + ' (want 3)');

console.log('---- wire-logos results ----');
results.forEach((r) => console.log('  ' + r));
if (fails.length) {
  console.log('---- failures ----');
  fails.forEach((f) => console.log('  x ' + f));
  process.exitCode = 1;
} else {
  console.log('OK: three live logo <img> in place, monogram fallback wired on error.');
}
