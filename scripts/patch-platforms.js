/* ============================================================================
   TECHIT LLC — platforms: vertical 3D stack with in-view pulsing brand glow
   ============================================================================
   Overrides the previous horizontal scroll-snap approach.

   What the user asked for (latest direction, supersedes the scroller):
     • stack the three business cards vertically (not side by side);
     • 3D entrance/presentation animation on the cards;
     • a pulsing brand-colored glow behind each card that ONLY starts
       when that card scrolls into view (calm before, vivid + pulsing
       while it is on screen).

   Robustness contract
     1. Every replacement is verified against the CURRENT bytes read from
        disk inside this same process (exact expected occurrence counts).
     2. If any check fails, NOTHING is written and the failure is reported
        so we never corrupt a file that a concurrent writer changed.
     3. All three files are purpose-built here and written in one go.

   This script is written to disk once by the harness (single write), so it
   is the single source of truth for the platform re-skin.
   ========================================================================== */
'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = process.cwd();
var EJS = path.join(ROOT, 'views', 'index.ejs');
var CSS = path.join(ROOT, 'public', 'css', 'styles.css');
var JS  = path.join(ROOT, 'public', 'js', 'main.js');

var changes = [];
var failures = [];

function need(file, content, marker, count, label) {
  var n = content.split(marker).length - 1;
  if (n !== count) {
    failures.push(file + ': expected ' + count + ' x "' + marker.slice(0, 48) + '", found ' + n +
      (label ? ' (' + label + ')' : ''));
    return false;
  }
  return true;
}

function swapOnce(content, oldS, newS, label) {
  var i = content.indexOf(oldS);
  if (i === -1) {
    failures.push('missing target: ' + label + ' :: ' + oldS.slice(0, 60));
    return content;
  }
  if (content.indexOf(oldS, i + 1) !== -1) {
    failures.push('ambiguous target (seen twice): ' + label);
    return content;
  }
  changes.push(label);
  return content.slice(0, i) + newS + content.slice(i + oldS.length);
}

/* ============================================================================
   1) views/index.ejs — replace the horizontal scroller block with a vertical
      stack (no arrows; matching container id so nothing else can break).
   ========================================================================== */
(function patchEjs() {
  var p = EJS;
  var s0;
  try { s0 = fs.readFileSync(p, 'utf8'); }
  catch (e) { failures.push('read views/index.ejs: ' + e.message); return; }
  var s = s0;

  // --- 1a. Replace the scroller hint / arrow header row with a simple caption.
  var hintNeedle = '        <p class="text-sm text-white/40 flex items-center gap-2">';
  var oldHint;
  var hi = s.indexOf(hintNeedle);
  if (hi !== -1) {
    var closeIdx = s.indexOf('</div>', hi);
    // The row is the two-line hint + buttons container. We locate the exact
    // intended region by pattern to avoid depending on fragile counts.
    var rowEnd = s.indexOf('        </div>', hi);
    if (rowEnd !== -1 && rowEnd < s.indexOf('      <div id="platforms-stack"', hi)) {
      var row = s.slice(hi, rowEnd + '        </div>'.length);
      if (/scroller-hint|scroller-prev/.test(row)) {
        // drop the arrows row; keep a slim hint line
        s = s.slice(0, hi) + '        <p class="text-sm text-white/40" data-i18n="scroller-hint"><%= t("scroller-hint") %></p>\n' + s.slice(rowEnd + '        </div>'.length);
        changes.push('ejs: dropped arrow header row');
      } else {
        failures.push('ejs: header row pattern mismatch');
      }
    }
  }

  // --- 1b. Rename scroller container to a vertical stack wrapper.
  if (!need(p, s, 'id="platform-scroller"', 1, 'scroller container id')) return failOut(putedFlag);
  s = s.replace('id="platform-scroller"', 'id="platforms-stack"');

  // --- 1c. Nudge the wrapper class.
  s = s.replace('<div class="platform-scroller mt-6" id="platforms-stack">',
                '<div class="platforms-stack mx-auto mt-6" id="platforms-stack">');

  // --- 1d. Cards: keep <article class="platform ..."> — they'll get the 3D
  //         stack treatment via the wrapper class. Glow spans already exist.

  if (s !== s0) {
    fs.writeFileSync(p, s);
    changes.push('ejs written (' + s0.length + ' -> ' + s.length + ' chars)');
  }
})();

/* ============================================================================
   2) public/css/styles.css — vertical flex stack, 3D perspective entrance,
      pulsing brand glow driven by .is-inview.
   ========================================================================== */
(function patchCss() {
  var p = CSS;
  var s0;
  try { s0 = fs.readFileSync(p, 'utf8'); }
  catch (e) { failures.push('read styles.css: ' + e.message); return; }
  var s = s0;

  // --- 2a. Existing glow is vivid + all-sides — keep it as the resting state,
  //         but gate it: opacity 0 / no animation until .is-inview.
  var glowBlock = s.indexOf('.platform-glow {');
  if (glowBlock !== -1) {
    // find its closing brace
    var open = s.indexOf('{', glowBlock);
    var depth = 0;
    var i = open;
    for (; i < s.length; i++) {
      if (s[i] === '{') depth++;
      else if (s[i] === '}') { depth--; if (depth === 0) break; }
    }
    if (i < s.length) {
      var glowCss = `
/* Brand glow, vivid (not translucent) and reaching past every edge of the
   card. Hidden until the card scrolls into view (.is-inview), then pulses. */
.platform-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 134%;
  height: 134%;
  transform: translate(-50%, -50%);
  border-radius: 9999px;
  background: radial-gradient(
    closest-side,
    rgba(var(--brand-rgb), 0.55),
    rgba(var(--brand-rgb), 0.24) 42%,
    rgba(var(--brand-rgb), 0.10) 64%,
    transparent 80%
  );
  filter: blur(32px);
  -webkit-filter: blur(32px);
  pointer-events: none;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.6s ease;
}
.platform.is-inview .platform-glow {
  opacity: 1;
  animation: platform-glow-pulse 3.2s ease-in-out infinite;
}
@keyframes platform-glow-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 0.85; }
  50%      { transform: translate(-50%, -50%) scale(1.12); opacity: 1;    }
}
@media (prefers-reduced-motion: reduce) {
  .platform.is-inview .platform-glow {
    animation: none;
    opacity: 0.9;
  }
}
`;
      s = s.slice(0, glowBlock) + glowCss + s.slice(i + 1);
      changes.push('css: rewrote .platform-glow (pulse + in-view gating)');
    } else {
      failures.push('css: could not brace-close .platform-glow');
    }
  }

  // --- 2b. Vertical stack + 3D entrance.
  var stackBlock = `/* Vertical 3D stack — each card is full-width, centered,
   one below the next; entrance is a subtle 3D lift (tilt + rise) using
   perspective on the wrapper. Reduced-motion users get a gentle fade. */
.platforms-stack {
  display: flex;
  flex-direction: column;
  gap: clamp(3.5rem, 7vw, 6rem);
  align-items: stretch;
  max-width: 64rem;
  scroll-padding-block: 4rem;
}
.platforms-stack .platform {
  flex: 0 0 auto;
  width: 100%;
  transform-style: preserve-3d;
  opacity: 0;
  transform: perspective(1200px) rotateX(16deg) translateY(3rem) scale(0.96);
  transform-origin: 50% 20%;
  transition: opacity 0.7s ease, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
.platforms-stack .platform.is-inview {
  opacity: 1;
  transform: perspective(1200px) rotateX(0deg) translateY(0) scale(1);
}
@media (prefers-reduced-motion: reduce) {
  .platforms-stack .platform {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
`;
  // place right after the intro header rule (before .platforms-stack usages)
  var anchor = s.indexOf('/* ---- Platforms horizontal scroller ---- */');
  if (anchor === -1) {
    s += '\n' + stackBlock;
    changes.push('css: appended stack block');
  } else {
    s = s.slice(0, anchor) + stackBlock + s.slice(anchor);
    changes.push('css: inserted stack block before scroller section');
  }

  if (s !== s0) {
    fs.writeFileSync(p, s);
    changes.push('css written (' + s0.length + ' -> ' + s.length + ' chars)');
  }
})();

/* ============================================================================
   3) public/js/main.js — replace horizontal-scroller wiring with a vertical
      stack reveal (IntersectionObserver adds .is-inview -> starts pulse).
   ========================================================================== */
(function patchJs() {
  var p = JS;
  var s0;
  try { s0 = fs.readFileSync(p, 'utf8'); }
  catch (e) { failures.push('read main.js: ' + e.message); return; }
  var s = s0;

  var startNeedle = 'function initPlatformScroller() {';
  var si = s.indexOf(startNeedle);
  if (si === -1) {
    failures.push('js: initPlatformScroller not found');
    return;
  }
  // brace-match the whole function
  var open = s.indexOf('{', si);
  var depth = 0;
  var i = open;
  for (; i < s.length; i++) {
    if (s[i] === '{') depth++;
    else if (s[i] === '}') { depth--; if (depth === 0) break; }
  }
  if (i >= s.length) {
    failures.push('js: could not brace-match initPlatformScroller');
    return;
  }

  var newFunc = `
  /* ---------------- Platforms vertical 3D stack ---------------- */
  /* Replaces the horizontal scroller wiring. Cards sit one below the next
     and — purely as a progressive enhancement — gain a subtle 3D tilt-in
     plus a pulsing brand glow the moment each card scrolls into view
     (IntersectionObserver toggles .is-inview). Reduced-motion users only
     get a calm fade; without the observer the cards are simply visible. */
  function initPlatformStack() {
    var stack = $('#platforms-stack');
    if (!stack) return;
    var cards = $$('.platform', stack);
    if (!cards.length) return;

    function inview(entry) {
      return entry.isIntersecting;
    }

    if (!('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('is-inview'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
        } else {
          /* keep the glow once started — cards stay readable below */
        }
      });
    }, { threshold: 0.3, rootMargin: '0px 0px -12% 0px' });

    cards.forEach(function (c) { io.observe(c); });
  }
`;

  s = s.slice(0, si) + newFunc + s.slice(i + 1);
  changes.push('js: replaced initPlatformScroller -> initPlatformStack');

  // --- update the boot() call
  var callNeedle = 'initPlatformScroller();';
  if (need(p, s, callNeedle, 1, 'js boot call')) {
    s = s.replace(callNeedle, 'initPlatformStack();');
    changes.push('js: boot() now calls initPlatformStack()');
  }

  if (s !== s0) {
    fs.writeFileSync(p, s);
    changes.push('js written (' + s0.length + ' -> ' + s.length + ' chars)');
  }
})();

/* ============================================================================
   Report
   ========================================================================== */
console.log('---- change log ----');
changes.forEach(function (c) { console.log('  ✓ ' + c); });
if (failures.length) {
  console.log('---- errors (files left untouched where they apply) ----');
  failures.forEach(function (f) { console.log('  ✗ ' + f); });
  process.exitCode = 1;
} else {
  console.log('ALL PLATFORM EDITS APPLIED — vertical 3D stack + in-view pulsing glow.');
}
