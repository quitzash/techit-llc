'use strict';
const https = require('https');
const http = require('http');

const brands = [
  { id: 'wfrlee', domain: 'wfrlee.com' },
  { id: 'sabaah', domain: 'www.sabaah.net' },
  { id: 'oneegate', domain: 'oneegate.com' },
];

const pathsToTry = [
  '/favicon.ico',
  '/favicon.png',
  '/favicon-32x32.png',
  '/favicon-192x192.png',
  '/apple-touch-icon.png',
  '/apple-touch-icon-precomposed.png',
  '/android-chrome-512x512.png',
  '/logo.png',
  '/logo.svg',
  '/assets/logo.png',
  '/assets/img/logo.png',
  '/img/logo.png',
];

function probe(domain, filePath, cb) {
  let done = false;
  function finish(r) { if (!done) { done = true; cb(r); } }
  const attempt = (useTls) => {
    const lib = useTls ? https : http;
    const url = (useTls ? 'https://' : 'http://') + domain + filePath;
    const req = lib.get(url, {
      timeout: 8000,
      headers: { 'user-agent': 'Mozilla/5.0 (brand-probe) TechitLLC', accept: 'image/*,*/*' },
    }, (res) => {
      const len = Number(res.headers['content-length'] || 0);
      const ct = String(res.headers['content-type'] || '');
      const status = res.statusCode || 0;
      const isImg = /^image\/(svg\+xml|png|jpe?g|webp|gif|ico|x-icon|avif|bmp)/.test(ct);
      res.resume();
      finish({ status, ct, len, isImg, url, secure: useTls });
    });
    req.on('timeout', () => { req.destroy(); finish({ status: 'timeout', url, secure: useTls }); });
    req.on('error', () => { if (!useTls) finish({ status: 'err', url, secure: useTls }); });
  };
  attempt(true);
}

function runBrand(idx) {
  if (idx >= brands.length) return summarize();
  const b = brands[idx];
  b.results = [];
  let pi = 0;
  let triedCount = 0;
  let forcedStop = falsePin;
  function nextPath() {
    if (forcedStop || pi >= pathsToTry.length) return runBrand(idx + 1);
    const p = pathsToTry[pi++];
    probe(b.domain, p, (r) => {
      if (r.status !== 'timeout' && r.status !== 'err' && r.status >= 200 && r.status < 400 && r.isImg && r.len > 0) {
        b.results.push(r);
        forcedStop = true; // found the real logo; stop probing this brand
      }
    });
    // tiny stagger so we don't blast the host
    setTimeout(nextPath, 180);
  }
  nextPath();
}

function summarize() {
  console.log('---- LIVE LOGO DISCOVERY ----');
  brands.forEach((b) => {
    if (b.results && b.results.length) {
      const hit = b.results[0];
      console.log(b.id + '  ->  ' + hit.status + ' ' + hit.ct + ' ' + hit.len + 'B  ' + hit.url + (hit.secure ? ' [https]' : ''));
    } else {
      console.log(b.id + '  ->  (nope — no conventional live logo endpoint answered)');
    }
  });
}

runBrand(0);
