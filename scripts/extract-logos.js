'use strict';
const https = require('https');
const http = require('http');
const { URL } = require('url');

const sites = [
  { id: 'wfrlee',   start: 'https://www.wfrlee.com/' },
  { id: 'sabaah',   start: 'https://sabaah.net/' },
  { id: 'oneegate', start: 'https://oneegate.com/' },
];

function fetchHtml(url, protocol, cb, redirects) {
  redirects = redirects || 0;
  const lib = protocol === 'https:' ? https : http;
  const req = lib.get(url, {
    timeout: 9000,
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; TechitLLC brand-logo extractor)', accept: 'text/html' },
  }, (res) => {
    let status = res.statusCode || 0;
    if (status >= 300 && status < 400 && res.headers.location && redirects < 4) {
      res.resume();
      const nextUrl = new URL(res.headers.location, url);
      return fetchHtml(nextUrl.href, nextUrl.protocol, cb, redirects + 1);
    }
    if (status !== 200) { res.resume(); return cb({ status, html: '', ct: '' }); }
    let html = '';
    res.on('data', (d) => { if (html.length < 2_500_000) html += d.toString('latin1'); });
    res.on('end', () => cb({ status, html, ct: String(res.headers['content-type'] || '') }));
  });
  req.on('timeout', () => { req.destroy(); cb({ status: 'timeout', html: '', ct: '' }); });
  req.on('error', () => { req.destroy(); cb({ status: 'error', html: '', ct: '' }); });
}

function absolutize(href, base) {
  try { return new URL(href, base).href; } catch (e) { return null; }
}

function pickLogos(html, base) {
  const found = [];
  const grab = (re, attr) => {
    const m = re.exec(html);
    if (m && m[1] && !/data:|content|javascript/i.test(m[1])) {
      const a = absolutize(m[1].replace(/&amp;/g, '&'), base);
      if (a) found.push({ url: a, via: attr });
    }
  };
  grab(/<link[^>]+rel=["']?(?:apple-touch-icon|apple-touch-icon-precomposed)["']?[^>]+href=["']([^"']+)["']/i, 'apple-touch-icon');
  grab(/<link[^>]+rel=["']icon["'][^>]+href=["']([^"']+)["']/i, 'icon');
  grab(/<link[^>]+rel=["']icon["'][^>]+href=["']([^"']+)["'][^>]*>/i, 'icon');
  grab(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i, 'og:image');
  grab(/<img[^>]+(?:class|id)=["'][^"']*(?:logo|brand)[^"']*["'][^>]*src=["']([^"']+)["']/i, 'img.logo');
  return found;
}

let i = 0;
function next() {
  if (i >= sites.length) return done();
  const site = sites[i];
  const startUrl = new URL(site.start);
  fetchHtml(startUrl.href, startUrl.protocol, (r) => {
    const logos = [];
    if (r.status === 200 && /html/.test(r.ct)) {
      logos.push(...pickLogos(r.html, startUrl.href));
    } else {
      // https failed -> try http once
      const httpUrl = new URL(startUrl.href); httpUrl.protocol = 'http:';
      fetchHtml(httpUrl.href, 'http:', (r2) => {
        if (r2.status === 200 && /html/.test(r2.ct)) logos.push(...pickLogos(r2.html, httpUrl.href));
        site.results = { httpsStatus: r.status, logos };
        i++;
        next();
      });
      return;
    }
    site.results = { httpsStatus: r.status, logos };
    i++;
    next();
  });
}

function done() {
  console.log('---- LOGO URLs the sites themselves declare ----');
  sites.forEach((s) => {
    console.log('[' + s.id + '] https-status=' + s.results.httpsStatus);
    if (s.results.logos.length) {
      s.results.logos.forEach((l) => console.log('    ' + l.via.padEnd(18) + ' ' + l.url));
    } else {
      console.log('    (none declared in served HTML)');
    }
  });
}
next();
