'use strict';
var fs = require('fs');
var s = fs.readFileSync('views/index.ejs', 'utf8');
var out = [];
function any(label, re) { out.push((re.test(s) ? 'PASS' : 'FAIL') + '  ' + label); }
function show(label, re) {
  var m = re.exec(s);
  out.push((m ? 'PASS' : 'FAIL') + '  ' + label + (m ? '  => ' + JSON.stringify(m[0]) : ''));
}
any('cards region wrapper present', /id="platforms-stack"/);
any('three article cards', /<article class="platform/g);
show('brand 1 title', /platform-wfrlee-name"/);
show('brand 2 title', /platform-sabaah-name"/);
show('brand 3 title', /platform-oneegate-name"/);
show('subtitle line', /platform-sub"/);
show('subtitle text (en)', /data-i18n="platform-sub"/g && /\bThree platforms, one intent\./);
out.forEach(function (l) { console.log(l); });
