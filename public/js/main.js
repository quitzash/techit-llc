/* Techit LLC — front-end enhancements.
   All content is visible by default; this script only enhances:
   reveal-on-scroll, counters, wordmark rotation, mobile menu,
   scroll progress, language toggle, and the contact form. */

(function () {
  'use strict';

  var I18N = window.I18N || {};
  var LANG = window.LANG || 'en';
  var ICONS = window.LUCIDE_ICONS || {};
  var OTHER_LANG = LANG === 'ar' ? 'en' : 'ar';
  var YEAR = String(new Date().getFullYear());
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Touch / coarse-pointer devices and narrow viewports get the lighter,
  // fully-visible fallbacks instead of the GPU-heavy pinned scroller.
  var COARSE = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var transitionMs = 260;
  var toastTimer = null;

  function isSmallViewport() {
    return window.innerWidth < 900 || window.innerHeight < 640;
  }
  function useLiteMotion() {
    return REDUCED.matches || COARSE || isSmallViewport();
  }

  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* ---------------- Icons (inline SVGs generated at build time) ------------- */
  function swapIcon(el, name) {
    var svg = ICONS[name];
    if (!svg) return;
    var wrap = document.createElement('span');
    wrap.innerHTML = svg;
    var node = wrap.firstElementChild;
    var i;
    for (i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name === 'data-lucide') continue;
      node.setAttribute(a.name, a.value);
    }
    node.setAttribute('aria-hidden', 'true');
    el.parentNode.replaceChild(node, el);
    return node;
  }

  function initIcons() {
    $$('[data-lucide]').forEach(function (el) {
      swapIcon(el, el.getAttribute('data-lucide'));
    });
  }

  /* ---------------- Language toggle ---------------- */
  function fill(html) {
    return html.replace(/\{year\}/g, YEAR);
  }

  function getDict() {
    return I18N[LANG] || I18N.en || {};
  }

  function applyLang() {
    var dict = getDict();
    document.documentElement.lang = LANG;
    document.documentElement.dir = LANG === 'ar' ? 'rtl' : 'ltr';

    $$('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] != null) el.innerHTML = fill(dict[key]);
    });
    $$('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = fill(dict[key]);
    });
    $$('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
    });
    $$('[data-i18n-var-year]').forEach(function (el) {
      el.setAttribute('data-i18n-var-year', YEAR);
    });

    var toggle = $('#lang-toggle');
    if (toggle) toggle.textContent = LANG === 'ar' ? 'EN' : 'عربي';

    // Language switching rewrites textContent, which destroys the per-word
    // spans the scroll-scrub reveal depends on. Rebuild them.
    if (typeof rewrapScrub === 'function') rewrapScrub();
  }

  function setLang(next) {
    if (next === LANG) return;
    LANG = next;
    OTHER_LANG = LANG === 'ar' ? 'en' : 'ar';
    try {
      localStorage.setItem('techit-lang', LANG);
    } catch (e) {}
    applyLang();
    var url = new URL(window.location.href);
    if (LANG === 'en') url.searchParams.delete('lang');
    else url.searchParams.set('lang', 'ar');
    window.history.replaceState(null, '', url.toString());
  }

  function initLangToggle() {
    var toggle = $('#lang-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function () {
      setLang(OTHER_LANG);
    });
  }

  /* ---------------- Reveal on scroll ---------------- */
  function revealAll() {
    $$('[data-reveal]').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  function inViewport(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return r.top < vh * 0.92 && r.bottom > 0;
  }

  function initReveal() {
    var els = $$('[data-reveal]');
    if (!els.length) return;
    if (REDUCED.matches) {
      revealAll();
      return;
    }

    // Scroll-driven reveal that works everywhere — no IntersectionObserver
    // required. IntersectionObserver, when present, makes it more efficient,
    // but the rAF scroll pass is the always-on safety net so the fade-in
    // plays on every device (including webviews and older mobile browsers).
    var remaining = els.slice();
    function check() {
      if (!remaining.length) return;
      remaining = remaining.filter(function (el) {
        if (inViewport(el)) {
          el.classList.add('is-in');
          return false;
        }
        return true;
      });
    }

    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              io.unobserve(entry.target);
              var i = remaining.indexOf(entry.target);
              if (i > -1) remaining.splice(i, 1);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );
      els.forEach(function (el) {
        io.observe(el);
      });
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        check();
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('orientationchange', onScroll, { passive: true });

    // First paint + guarantee anything already on screen reveals immediately.
    requestAnimationFrame(check);
    setTimeout(check, 120);

    // Last-resort net: if for any reason nothing revealed, show everything so
    // content is never invisible.
    setTimeout(function () {
      if (remaining.length === els.length) revealAll();
    }, 3500);
  }

  /* ---------------- Scroll-scrubbed text reveal ----------------
     Unlike [data-reveal] (binary, fires once), this ties the reveal to
     scroll position: the further down the page you are, the more of the
     text has resolved. Words are wrapped in .scrub-word and each gets a
     staggered slice of the element's 0..1 progress. */
  var SCRUB_WORDS = [];   // { el, words }
  var scrubTicking = false;

  function scrubEase(t) {
    return t * t * (3 - 2 * t); // smoothstep
  }

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  // Wrap each text-bearing leaf under root in per-word spans.
  // Returns [{ el, words }] for the leaves it touched.
  //
  // Elements whose text is filled by a gradient (background-clip:text, e.g.
  // the rotating .hero-word) are deliberately left atomic: a child span
  // carrying filter:blur() would break the parent's text clip, and inline
  // transform/opacity would fight the rotator's own .is-active transition.
  function isGradientText(el) {
    if (el.hasAttribute('data-word-color')) return true;
    var bg = window.getComputedStyle(el).backgroundClip ||
             window.getComputedStyle(el).webkitBackgroundClip;
    return bg === 'text';
  }

  function wrapWords(root) {
    var out = [];
    var leaves = [root].concat(Array.prototype.slice.call(root.querySelectorAll('*')));
    leaves.forEach(function (el) {
      if (el.closest('.scrub-word')) return;      // already wrapped
      if (isGradientText(el)) {
        out.push({ el: el, atomic: true });
        return;
      }
      // Already-wrapped leaf (rewrapScrub can run more than once, e.g. after a
      // language switch). Re-derive the entry from the existing spans instead
      // of re-wrapping — otherwise the leaf drops out of SCRUB_WORDS and its
      // words stay frozen at whatever the previous paint left behind.
      var existing = Array.prototype.slice.call(el.children).filter(function (c) {
        return c.classList && c.classList.contains('scrub-word');
      });
      if (existing.length) {
        out.push({ el: el, words: existing });
        return;
      }
      var text = '';
      Array.prototype.slice.call(el.childNodes).forEach(function (n) {
        if (n.nodeType === 3) text += n.nodeValue;
      });
      if (!text.trim()) return;                    // no direct text to split
      el.textContent = '';
      var frag = document.createDocumentFragment();
      text.split(/(\s+)/).forEach(function (chunk) {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) {
          frag.appendChild(document.createTextNode(chunk));
          return;
        }
        var span = document.createElement('span');
        span.className = 'scrub-word';
        span.textContent = chunk;
        frag.appendChild(span);
      });
      el.appendChild(frag);
      out.push({ el: el, words: Array.prototype.slice.call(el.querySelectorAll('.scrub-word')) });
    });
    return out;
  }

  // Progress 0 once the leaf's top is near the bottom of the viewport,
  // 1 once it has travelled up to ~35% of viewport height.
  function scrubProgress(el) {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var startY = vh * 0.92;
    var endY = vh * 0.35;
    var top = el.getBoundingClientRect().top;
    if (startY === endY) return 1;
    return clamp01((startY - top) / (startY - endY));
  }

  function paintScrub() {
    scrubTicking = false;
    SCRUB_WORDS.forEach(function (entry) {
      var el = entry.el;
      var p = scrubProgress(el);

      // Gradient-filled text (the rotator words): opacity only. Transform and
      // blur are left to the .is-active CSS transition so the two animations
      // don't fight, and inactive words stay hidden by their own stylesheet.
      if (entry.atomic) {
        if (el.classList.contains('hero-word') && !el.classList.contains('is-active')) {
          el.style.opacity = '';
          return;
        }
        el.style.opacity = scrubEase(p).toFixed(3);
        return;
      }

      var n = entry.words.length;
      entry.words.forEach(function (w, i) {
        var span = n > 1 ? n * 0.55 : 1;          // stagger across the leaf
        var local = clamp01((p * (n + span) - i) / span);
        var e = scrubEase(local);
        if (e >= 1) {
          w.style.cssText = '';
        } else {
          w.style.opacity = e.toFixed(3);
          w.style.transform = 'translateY(' + ((1 - e) * 0.42).toFixed(3) + 'em)';
          w.style.filter = 'blur(' + ((1 - e) * 7).toFixed(2) + 'px)';
        }
      });
    });
  }

  function onScrubScroll() {
    if (scrubTicking) return;
    scrubTicking = true;
    requestAnimationFrame(paintScrub);
  }

  // Rewrap from scratch — needed after a language switch, because applyLang()
  // replaces textContent on [data-i18n] and would wipe the word spans.
  //
  // Also the single gate for reduced-motion users: they get the roots marked
  // ready but no spans and no inline styles at all, rather than relying on the
  // stylesheet's !important override to undo what JS just wrote.
  function rewrapScrub() {
    SCRUB_WORDS = [];
    var roots = $$('[data-scrub]');
    roots.forEach(function (root) {
      root.setAttribute('data-scrub-ready', '');
    });
    if (REDUCED.matches) return;
    roots.forEach(function (root) {
      SCRUB_WORDS = SCRUB_WORDS.concat(wrapWords(root));
    });
    paintScrub();
  }

  function initScrubReveal() {
    if (!$$('[data-scrub]').length) return;
    rewrapScrub();
    if (REDUCED.matches) return; // nothing scroll-driven to listen for
    window.addEventListener('scroll', onScrubScroll, { passive: true });
    window.addEventListener('resize', onScrubScroll);
  }

  /* ---------------- Counters ---------------- */
  function initCounters() {
    var els = $$('[data-count-to]');
    if (!els.length) return;

    function run(el) {
      var target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      if (REDUCED.matches) {
        el.textContent = String(target);
        return;
      }
      var start = null;
      var dur = 1300;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = String(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      els.forEach(run);
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            run(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  /* ---------------- Hero wordmark rotation ---------------- */
  var ROTATION_MS = 4400;

  function initWordmark() {
    var rotator = $('.hero-word-rotator');
    if (!rotator) return;
    var words = $$('.hero-word', rotator);
    if (words.length < 2) return;
    var idx = 0;
    var paused = false;

    function activate(i) {
      words.forEach(function (w, n) {
        w.classList.toggle('is-active', n === i);
      });
      var color = words[i].getAttribute('data-word-color') || '';
      rotator.setAttribute('data-active', color);
    }

    activate(0); // every (re)entry into view starts on Sabaah,
    if (REDUCED.matches) return; // never rotates for reduced-motion users.

    function tick() {
      if (paused) return;
      idx = (idx + 1) % words.length;
      activate(idx);
    }

    // Pause while the card is off-screen; on re-entry always begin on Sabaah.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              paused = false;
              if (idx !== 0) {
                idx = 0;
                activate(0);
              }
            } else {
              paused = true;
            }
          });
        },
        { threshold: 0.4 }
      );
      io.observe(rotator);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) paused = true;
      else if (idx === 0) paused = false;
    });

    setInterval(tick, ROTATION_MS);
  }

  /* ---------------- Mobile menu ---------------- */
  function initMobileMenu() {
    var toggle = $('#menu-toggle');
    var menu = $('#mobile-menu');
    var iconWrap = $('#menu-icon');
    if (!toggle || !menu) return;

    function close() {
      menu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      if (ICONS.menu) swapIcon($('#menu-icon') || iconWrap, 'menu');
      else if (iconWrap) iconWrap.removeAttribute('data-lucide');
    }

    toggle.addEventListener('click', function (ev) {
      ev.preventDefault();
      var open = menu.classList.contains('hidden');
      if (open) {
        menu.classList.remove('hidden');
        toggle.setAttribute('aria-expanded', 'true');
        if (ICONS.x) {
          var i = $('#menu-icon');
          if (i) swapIcon(i, 'x');
        }
      } else {
        close();
      }
    });

    $$('.mobile-link', menu).forEach(function (link) {
      link.addEventListener('click', close);
    });
    menu.addEventListener('click', function (ev) {
      if (ev.target === menu) close();
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !menu.classList.contains('hidden')) close();
    });
  }

  /* ---------------- Scroll progress bar ---------------- */
  function initScrollProgress() {
    var bar = $('#scroll-progress');
    if (!bar) return;
    var ticking = false;
    function update() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = 'scaleX(' + p + ')';
      ticking = false;
    }
    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  /* ---------------- Form toast ---------------- */
  function showToast(mode, message) {
    var existing = $('#form-toast');
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

    var dict = getDict();
    var icon = mode === 'success' ? ICONS['circleCheck'] : ICONS['circleAlert'];
    var toast = document.createElement('div');
    toast.id = 'form-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.className = 'toast-' + mode;
    var inner = document.createElement('div');
    inner.className = 'flex items-start gap-3';
    if (icon) {
      var wrap = document.createElement('span');
      wrap.innerHTML = icon;
      var svg = wrap.firstElementChild;
      svg.setAttribute('class', 'w-5 h-5 shrink-0');
      svg.setAttribute('aria-hidden', 'true');
      inner.appendChild(svg);
    }
    var label = document.createElement('span');
    label.textContent = message || dict[message] || dict['form-toast-' + (mode === 'success' ? 'success' : 'error')] || '';
    inner.appendChild(label);
    toast.appendChild(inner);
    document.body.appendChild(toast);

    requestAnimationFrame(function () {
      toast.classList.add('is-visible');
    });
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, transitionMs);
    }, 6000);

    toast.addEventListener('click', function () {
      toast.classList.remove('is-visible');
      if (toastTimer) clearTimeout(toastTimer);
    });
  }

  function initToast() {
    var serverToast = $('#form-toast');
    if (!serverToast) return;
    setTimeout(function () {
      serverToast.classList.add('is-visible');
      setTimeout(function () {
        if (serverToast.parentNode) serverToast.parentNode.removeChild(serverToast);
      }, 6000);
    }, 150);
    serverToast.addEventListener('click', function () {
      serverToast.classList.remove('is-visible');
    });
  }

  /* ---------------- Contact form ---------------- */
  function openMailto() {
    var form = $('#contact-form');
    if (!form) return;
    var name = $('#cf-name') ? $('#cf-name').value : '';
    var email = $('#cf-email') ? $('#cf-email').value : '';
    var message = $('#cf-message') ? $('#cf-message').value : '';
    var subject = 'Techit LLC contact inquiry' + (name ? ' — ' + name : '');
    var body =
      'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
    window.location.href =
      'mailto:' + 'info@techit-llc.com' + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function initForm() {
    var form = $('#contact-form');
    if (!form) return;
    var submit = $('#cf-submit');
    var label = $('#cf-submit-label');
    var t = getDict();

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var payload = new URLSearchParams();
      [['cf-name', 'name'], ['cf-email', 'email'], ['cf-message', 'message']].forEach(function (pair) {
        var input = document.getElementById(pair[0]);
        if (input && input.value) payload.append(pair[1], input.value);
      });
      if (submit) {
        submit.disabled = true;
        if (label) label.textContent = t['form-sending'] || 'Sending…';
      }

      fetch('/api/contact', { method: 'POST', body: payload, headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8', Accept: 'application/json' } })
        .then(function (res) {
          return res.json().then(function (data) {
            return { ok: res.ok && data.ok, data: data };
          });
        })
        .then(function (result) {
          var name = ($('#cf-name') && $('#cf-name').value.trim()) || '';
          if (result.ok) {
            form.reset();
            showToast('success', t['form-toast-success']);
          } else {
            openMailto();
            showToast('success', ('' + t['form-mailto']).replace('{name}', name));
          }
        })
        .catch(function () {
          var name = ($('#cf-name') && $('#cf-name').value.trim()) || '';
          openMailto();
          showToast('success', ('' + t['form-mailto']).replace('{name}', name));
        })
        .finally(function () {
          if (submit) {
            submit.disabled = false;
            if (label) label.textContent = t['form-submit'];
          }
        });
    });
  }

  /* ---------------- Platforms pinned scroller ---------------- */
  /* SkillLoop-inspired pinned section: on capable, motion-friendly displays
     the platforms section becomes a sticky full-screen stage on a tall
     track. Each card holds in place for a scroll window, then steps out to
     reveal the next — scrub-linked through requestAnimationFrame, with a
     progress bar and step counter. Everything is a progressive enhancement:
     without this script, or for reduced-motion users, the cards remain a
     plain, fully-visible vertical stack (tilt-in + brand glow on reveal). */
  function initPlatformScroller() {
    var section = $('[data-platform-scroll]');
    if (!section) return;
    var stage = $('.platforms-stage', section);
    var track = $('.platforms-track', section);
    var bar = $('.platforms-progress', section);
    var badge = $('[data-platform-badge]', section);
    var num = $('[data-platform-num]', section);
    var head = $('.platforms-head', section);
    var slides = $$('.platforms-slide', section);
    var cards = $$('.platform', section);
    if (!stage || !track || !slides.length) return;

    var pinned = false;
    var slideH = 0;
    var startY = 0;
    var range = 1;
    var current = 0;
    var smoothP = 0; // one scrubbed master progress drives bar + badge + track
    var rawP = 0;
    var ticking = false;
    var EARLY = 0.15; // share of the pin each card holds before stepping out
    var SNAP = 0.03;  // share of the pin spent stepping between cards
    var MIN_SLIDE = 600; // px of card window below which pinning is not worth it
    var TRACK = 8;    // scroll budget of the pin, in viewport-heights. The
    // section becomes TRACK+1 = 9 screens tall and the pin walks its cards
    // over TRACK = 8 screens of scroll — the SkillLoop system, where each
    // early panel is planted ~120vh then snaps out in ~24vh, and the final
    // card keeps the whole tail (~500vh) so it stays easy to read.

    /* Fallback for anyone who cannot pin: gentle tilt-in + brand glow. */
    function fallbackReveal() {
      function show(c) { c.classList.add('is-inview'); }
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              show(entry.target);
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
        cards.forEach(function (c) { io.observe(c); });
      }
      // Always-on safety net (also covers devices without IntersectionObserver)
      // so the tilt-in plays and the cards can never stay hidden.
      var ticking = false;
      function check() {
        cards.forEach(function (c) {
          if (c.classList.contains('is-inview')) return;
          if (inViewport(c)) show(c);
        });
      }
      function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () { ticking = false; check(); });
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      requestAnimationFrame(check);
      setTimeout(function () { cards.forEach(show); }, 3500);
    }

    if (useLiteMotion() || !('IntersectionObserver' in window)) {
      fallbackReveal();
      return;
    }

    /* --- Pinned mode --- */
    function measure() {
      var headH = head ? head.offsetHeight : 0;
      var stageH = stage.offsetHeight || window.innerHeight;
      slideH = Math.max(stageH - headH, window.innerHeight * 0.5);
      slides.forEach(function (s) { s.style.height = slideH + 'px'; });
      section.style.height = stageH + TRACK * stageH + 'px';
      if (stage.style) stage.style.setProperty('--head-h', headH + 'px');
      startY = section.getBoundingClientRect().top + window.scrollY;
      range = section.offsetHeight - stageH;
      if (range < 1) range = 1;
    }

    function readP() {
      var p = (window.scrollY - startY) / range;
      return Math.max(0, Math.min(1, p));
    }

    /* Map raw progress (0..1) to a slide offset (0..n-1). Each card holds
       for its own scroll window, then steps out quickly (linear, SkillLoop
       eases snaps with "none"); the last card keeps the whole tail of the
       track so it stays readable. */
    function offsetFor(p) {
      var n = slides.length;
      for (var i = 0; i < n - 1; i++) {
        var s = EARLY + i * (EARLY + SNAP);
        if (p < s) return i;
        if (p < s + SNAP) return i + (p - s) / SNAP;
      }
      return n - 1;
    }

    /* Per-frame card states: each card fades out as the next is scrolled
       in, and fades back in when you scroll the other way. Opacity only —
       a per-frame saturate() filter forces a repaint of the whole card and
       is the main source of jank on mobile GPUs. */
    function paint() {
      var o = current;
      for (var i = 0; i < cards.length; i++) {
        var a = 1 - Math.abs(i - o) * 1.4;
        if (a < 0) a = 0;
        if (a > 1) a = 1;
        cards[i].style.opacity = a.toFixed(3);
      }
    }

    function apply() {
      track.style.transform = 'translate3d(0, ' + (-(current * slideH)).toFixed(1) + 'px, 0)';
      var idx = Math.max(0, Math.min(slides.length - 1, Math.round(current)));
      slides.forEach(function (s, i) {
        s.classList.toggle('is-current', i === idx);
      });
      if (num) num.textContent = String(idx + 1);
      paint();
    }

    /* One lerped master progress feeds the track offset, the progress bar,
       and the rotating loop badge — exactly the shared-scrub feel of
       SkillLoop's timeline (its scrub: 0.2 ≈ lerp k 0.14). */
    function frame() {
      smoothP += (rawP - smoothP) * 0.14;
      if (Math.abs(rawP - smoothP) < 0.0004) {
        smoothP = rawP;
        ticking = false;
      }
      current = offsetFor(smoothP);
      if (bar) bar.style.transform = 'scaleX(' + smoothP.toFixed(4) + ')';
      if (badge) badge.style.transform = 'translateX(-50%) rotate(' + (smoothP * 360).toFixed(2) + 'deg)';
      apply();
      if (ticking) requestAnimationFrame(frame);
    }

    function onScroll() {
      if (!pinned) return;
      rawP = readP();
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    }

    function onResize() {
      measure();
      onScroll();
    }

    /* The pinned deck must always show a full card at natural height — a
       card that needs its own scrollbar would swallow the mouse wheel and
       trap the section on its first slide. If the viewport cannot give each
       card a tall-enough window, drop straight to the plain stack instead.
       The decision waits for the webfonts: fonts change the heading height,
       which is exactly what the window size is computed from. */
    function decide() {
      pinned = true;
      section.classList.add('is-pinned');
      measure();
      if (slideH < MIN_SLIDE) {
        pinned = false;
        section.classList.remove('is-pinned');
        section.style.height = '';
        slides.forEach(function (s) { s.style.height = ''; });
        fallbackReveal();
        return;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize);
      onScroll();
      apply();
    }

    var decided = false;

    function enable() {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () {
          if (!decided) { decided = true; decide(); }
          else { measure(); onScroll(); }
        });
        /* Safety: if the webfont promise stalls, decide after a beat anyway
           (the deck simply re-measures once fonts finally settle). */
        setTimeout(function () {
          if (!decided) { decided = true; decide(); }
        }, 1200);
      } else {
        decided = true;
        decide();
      }
    }

    enable();
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    // Tell the <head> failsafe that the enhancement script made it in, so it
    // leaves the 'js' gate in place for the animations.
    window.__techitReady = true;
    if (window.__techitFailsafe) clearTimeout(window.__techitFailsafe);
    initIcons();
    applyLang();
    initLangToggle();
    initReveal();
    initPlatformScroller();
    initCounters();
    initWordmark();
    initScrubReveal();
    initMobileMenu();
    initScrollProgress();
    initToast();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();