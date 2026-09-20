// Read-only inspector: dumps exact byte regions from the single-write
// temp snapshots (internally consistent; immune to the file-race that
// made multi-read splice reads unreliable). No writes to the repo.
var fs = require('fs');
var path = require('path');
var T = process.env.TEMP + '\\techit_snaps';

function snap(name) {
  return fs.readFileSync(path.join(T, name), 'utf8');
}

var args = process.argv.slice(2);
var which = args[0] || 'ejs';
var start = args[1] || '0';
var count = args[2] || '4000';
start = parseInt(start, 10) || 0;
count = parseInt(count, 10) || 4000;

var src, label;
if (which === 'ejs') { src = snap('views_index.ejs'); label = 'views/index.ejs'; }
else if (which === 'css') { src = snap('public_css_styles.css'); label = 'public/css/styles.css'; }
else if (which === 'js') { src = snap('public_js_main.js'); label = 'public/js/main.js'; }
else if (which === 'i18n') { src = snap('src_i18n.js'); label = 'src/i18n.js'; }

console.log('=== ' + label + ' | chars ' + start + '..' + (start + count) + ' (len ' + src.length + ') ===');
process.stdout.write(src.slice(start, start + count));
