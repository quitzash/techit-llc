// Static site export for GitHub Pages.
//
// GitHub Pages serves static files only — it cannot run Express or render EJS.
// This script pre-renders the same templates server.js renders at runtime and
// copies the compiled assets into dist/, which is what Pages publishes.
//
// The output is deliberately path-agnostic: root-absolute asset URLs are
// rewritten to document-relative ones so the same build works unchanged on a
// custom domain, a project subpath (/repo/), or opened straight from disk.

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const SITE = require('../src/site');
const I18N = require('../src/i18n');

const ROOT = path.join(__dirname, '..');
const VIEWS = path.join(ROOT, 'views');
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');

// Turn href="/css/styles.css" into href="./css/styles.css".
// The negative lookahead leaves protocol-relative URLs (//cdn…) alone.
function relativize(html, prefix) {
  return html.replace(/(\s(?:href|src))="\/(?!\/)/g, `$1="${prefix}`);
}

function pageData(lang, sent = null) {
  const dict = I18N[lang] || I18N.en;
  return {
    ...SITE,
    lang,
    dict,
    sent,
    year: new Date().getFullYear(),
    t: (key) => (dict[key] != null ? dict[key] : key),
    // Full dictionary for the client-side language toggle (both languages).
    i18nJson: JSON.stringify(I18N).replace(/</g, '\\u003c'),
  };
}

function render(view, data) {
  const file = path.join(VIEWS, view);
  return ejs.render(fs.readFileSync(file, 'utf8'), data, { filename: file });
}

function write(relative, contents) {
  const target = path.join(DIST, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
  console.log(`  ${relative}  (${Buffer.byteLength(contents)} bytes)`);
}

// ---- Build ----
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

console.log('Copying static assets from public/');
fs.cpSync(PUBLIC, DIST, { recursive: true });

console.log('Rendering pages');
// English at the root, Arabic one level down. Each gets the asset prefix that
// resolves correctly relative to its own depth.
write('index.html', relativize(render('index.ejs', pageData('en')), './'));
write('ar/index.html', relativize(render('index.ejs', pageData('ar')), '../'));
write('404.html', relativize(render('404.ejs', { ...SITE, year: new Date().getFullYear() }), './'));

// Stops Pages' Jekyll pass from touching the output.
write('.nojekyll', '');

console.log('\nStatic build ready in dist/ — publish this directory on Pages.');