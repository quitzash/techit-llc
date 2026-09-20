'use strict';
const https = require('https');
const http = require('http');

const brands = [
  { id: 'wfrlee',  domain: 'wfrlee.com',      www: 'www.wfrlee.com' },
  { id: 'sabaah',  domain: 'www.sabaah.net',  www: 'sabaah.net' },
  { id: 'oneegate', domain: 'oneegate.com',   www: 'www.oneegate.com' },
];

const endpoints = [
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-192x192.png',
  '/android-chrome-512x512.png',
  '/favicon.png',
  '/favicon.ico',
  '/logo.png',
  '/logo.svg',
  '/assets/logo.png',
];

function hit(host, filePath, done) {
  const url = 'https://' + host + filePath;
  const req = https.get(url, { timeout: 7000, headers: { 'User-Agent': 'Mozilla/5.0 (logo probe; Techit LLC)' } }, (res) => {
    const len = Number(res.headers['content-length'] || 0);
    const ct = String(res.headers['content-type'] || '').toLowerCase();
    const ok = res.statusCode >= 200 && res.statusCode < 400 && /image/.test(ct);
    res.resume();
    done({ url, status: res.statusCode, ct, len, ok });
  });
  req.on('timeout', () => { req.destroy(); done({ url, status: 'timeout', ct: '', len: 0, ok: false }); });
  req.on('error', () => { req.destroy(); done({ url, status: 'err', ct: '', len: 0, ok: false }); });
}

function checkBrand(idx) {
  if (idx >= brands.length) return summarize();
  const b = brands[idx];
  let host = b.domain;
  let i = 0;
  function next() {
    if (i >= endpoints.length) {
      console.log('MISS ' + b.id.padEnd(9) + ' — no standard logo endpoint on ' + b.domain + ' answered with an image (https).');
      return checkBrand(idx + 1);
    }
    const ep = endpoints[i++];
    hit(host, ep, (r) => {
      if (r.ok && r.len > 0) {
        console.log('HIT  ' + b.id.padEnd(9) + ' ' + r.url.bold());
        return checkBrand(idx + 1);
      }
      next();
    });
  }
  next();
}

function summarize() {
  console.log('---- probe finished ----');
}
checkBrand(0);
