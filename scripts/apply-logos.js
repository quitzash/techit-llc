'use strict';
const fs = require('fs');

const EJS = 'views/index.ejs';
const report = [];
const failures = [];

function readAndExpect(p, needle, want, label) {
  const s = fs.readFileSync(p, 'utf8');
  const n = s.split(needle).length - 1;
  if (n !== want) {
    failures.push('[' + label + '] expected ' + want + ' x "' + needle.slice(0, 42) + '", got ' + n);
    return null;
  }
  return s;
}

const MONO = '<span class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/5 font-display font-bold text-2xl text-white ring-1 ring-white/15" aria-hidden="true"><%= p.monogram %></span>';

const SRCS = 'src="<%= p.logo %>"';

const LOGO_IMG =
  '<img class="platform-logo" ' + SRCS + ' alt="<%= p.name %> logo" loading="lazy" width="64" height="64" ' +
  'onerror="this.style.visibility=\'hidden\';this.insertAdjacentHTML(\'afterend\',\'' +
  '<span class=\\u0022flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 font-display font-bold text-lg text-white ring-1 ring-white/15\\u0022>' +
  '<%= p.monogram %></span\');" />';

(function patchEjs() {
  const s0 = readAndExpect(EJS, MONO, 3, 'ejs monogram x3');
  if (s0 === null) return;

  let s = s0;

  // 1) add `logo` to each platform object
  const arrNeedle = "const platforms = [";
  const aOk = s.split(arrNeedle).length - 1;
  if (aOk !== 1) { failures.push('[ejs] platforms array needle x1, got ' + aOk); return; }

  s = s.split("id: 'wfrlee', monogram: 'W'").join("id: 'wfrlee', monogram: 'W', logo: 'https://www.wfrlee.com/logo192.png'");
  s = s.split("id: 'sabaah', monogram: 'S'").join("id: 'sabaah', monogram: 'S', logo: 'https://sabaah.net/favicon.svg'");
  s = s.split("id: 'oneegate', monogram: '1E'").join("id: 'oneegate', monogram: '1E', logo: 'https://oneegate.com/logo192.png'");

  // verify array now carries exactly 3 `logo:` entries
  const logoCount = s.split("logo: 'https://").length - 1;
  if (logoCount !== 3) { failures.push('[ejs] expected 3 logo: entries, got ' + logoCount); return; }

  // 2) swap monogram span -> logo img (identical span x3, global replace is safe)
  const beforeLen = s.length;
  s = s.split(MONO).join(LOGO_IMG);
  const afterLen = s.length;

  // 3) confirm the logo <img> exists 3x and monogram span is 0x
  const imgN = s.split('class="platform-logo"').length - 1;
  const monoN = s.split(MONO).length - 1Bill;
  if (imgN !== 3 || monoN !== 0) {
    failures.push('[ejs] after-swap img=' + imgN + ' mono=' + monoN + ' (want 3/0)');
    return;
  }

  fs.writeFileSync(EJS, s);
  report.push('ejs: monogram -> live logo <img x3> (' + beforeLen + ' -> ' + afterLen + ' chars)');
})();

const CSS = 'public/css/styles.css';
(function patchCss() {
  const s0 = readAndExpect(CSS, '.platform-logo', 0, 'css no logo rule yet');
  if (s0 === null) return;
  const rule = `/* Live brand logo tile (replaces the monogram when the site's own
   logo answers at load-time). Curved, ringed, brand-tinted on hover. */
.platform-logo {
  width: 4rem;
  height: 4rem;
  -o-object-fit: contain;
  object-fit: contain;
  -o-object-position: center;
  object-position: center;
  border-radius: 1rem;
  background: rgba(5, 9, 20, 0.45);
  -webkit-box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) inset,
    var(--brand-glow-soft, 0 0 26px rgba(var(--brand-rgb, 140, 145, 157), 0.18));
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.12) inset,
    var(--brand-glow-soft, 0 0 26px rgba(var(--brand-rgb, 140, 145, 157), 0.18));
  -webkit-transition: -webkit-transform 0.35s ease, box-shadow 0.35s ease;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}
.platform:hover .platform-logo {
  -webkit-transform: scale(1.06);
  transform: scale(1.06);
}
@media (prefers-reduced-motion: reduce) {
  .platform:hover .platform-logo { -webkit-transform: none; transform: none; }
}
`;
  const anchor = '.platforms-stack {';
  const ai = s0.indexOf(anchor);
  if (ai === -1) { failures.push('[css] stack anchor not found'); return; }
  const s = s0.slice(0, ai) + rule + s0.slice(ai);
  fs.writeFileSync(CSS, s);
  report.push('css: .platform-logo rule inserted before vertical stack (' + s0.length + ' -> ' + s.length + ' chars)');
})();

console.log('---- change log ----');
report.forEach((r) => console.log('  ' + r));
if (failures.length) {
  console.log('---- failures ----');
  failures.forEach((f) => console.log('  x ' + f));
  process.exitCode = 1;
} else {
  console.log('live logos wired (each card now pulls its own site logo, monogram fallback on error).');
}
