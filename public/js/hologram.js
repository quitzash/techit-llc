// ============================================================
//  PLANET HOLOGRAM — canvas 3D globe (no WebGL needed)
//  wireframe graticule + particle cloud + radar ring + orbits
// ============================================================
(function hologramGlobe() {
  const canvas = document.getElementById('hologram');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // ---- Fibonacci-sphere particle cloud (as in the Nexus reference) ----
  const FIB = 600;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const particles = [];
  for (let i = 0; i < FIB; i++) {
    const y = 1 - (i / (FIB - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const t = golden * i;
    const spread = 1 + (i % 3) / 3 * 0.26;
    particles.push([Math.cos(t) * r * spread, y * spread, Math.sin(t) * r * spread]);
  }

  // ---- Wireframe graticule (parallels + meridians) ----
  const LON = 22, LAT = 12;
  const parallels = [];
  for (let iv = 1; iv < LAT; iv++) {
    const phi = (iv / LAT) * Math.PI - Math.PI / 2;
    const line = [];
    for (let iu = 0; iu <= LON; iu++) {
      const th = (iu / LON) * Math.PI * 2;
      line.push([Math.cos(phi) * Math.cos(th), Math.sin(phi), Math.cos(phi) * Math.sin(th)]);
    }
    parallels.push(line);
  }
  const meridians = [];
  for (let iu = 0; iu < LON; iu++) {
    const th = (iu / LON) * Math.PI * 2;
    const line = [];
    for (let v = 0; v <= LAT; v++) {
      const phi = (v / LAT) * Math.PI - Math.PI / 2;
      line.push([Math.cos(phi) * Math.cos(th), Math.sin(phi), Math.cos(phi) * Math.sin(th)]);
    }
    meridians.push(line);
  }

  const palette = ['#34d399', '#10b981', '#6ee7b7', '#22d3ee', '#5eead4', '#0d9488'];

  let size = 0, dpr = 1;
  function resize() {
    const parent = canvas.parentElement;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parentW = parent ? parent.clientWidth : 0;
    // Fall back to viewport width if the wrapper isn't laid out yet.
    size = Math.max(240, Math.min(parentW || Math.min(window.innerWidth, 560), 560));
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) resize(); });
  setTimeout(resize, 300);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- mouse parallax ----
  let mx = 0, my = 0;
  const wrap = document.getElementById('hologram-wrap');
  if (wrap) {
    wrap.addEventListener('pointermove', e => {
      const r = wrap.getBoundingClientRect();
      mx = e.clientX / r.width - 0.5;
      my = e.clientY / r.height - 0.5;
    });
    wrap.addEventListener('pointerleave', () => { mx = 0; my = 0; });
  }

  function frame(now) {
    const w = size, h = size;
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = h / 2;
    const R = w * 0.37;

    const rotY = (reduced ? 0 : now * 0.00016) + mx * 0.7;
    const rotX = (reduced ? -0.3 : Math.sin(now * 0.00022) * 0.10) - my * 0.55;
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

    const P = 2.2;
    const transform = (px, py, pz) => {
      let x = px * cosY + pz * sinY;
      let z = -px * sinY + pz * cosY;
      let y = py * cosX - z * sinX;
      z = py * sinX + z * cosX;
      const s = P / (P - z);
      return { x: cx + x * R * s, y: cy + y * R * s, z, s };
    };

    // ---- atmospheric glow ----
    const glow = ctx.createRadialGradient(cx, cy, R * 0.15, cx, cy, R * 1.3);
    glow.addColorStop(0, 'rgba(16,185,129,0.13)');
    glow.addColorStop(0.55, 'rgba(16,185,129,0.05)');
    glow.addColorStop(1, 'rgba(16,185,129,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // ---- wireframe graticule (depth-shaded, smooth alpha) ----
    const drawLine = pts => {
      for (let k = 0; k < pts.length - 1; k++) {
        const a = transform(pts[k][0], pts[k][1], pts[k][2]);
        const b = transform(pts[k + 1][0], pts[k + 1][1], pts[k + 1][2]);
        const depthA = (a.z + b.z) / 2;
        const front = (depthA + 1) / 2;
        ctx.strokeStyle = 'rgba(16,185,129,' + (0.14 + front * 0.5).toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    };
    parallels.forEach(drawLine);
    meridians.forEach(drawLine);

    // ---- particle cloud (continuous alpha — no front/back pop) ----
    const projPts = [];
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      projPts.push(Object.assign(transform(p[0], p[1], p[2]), { c: palette[i % palette.length] }));
    }
    projPts.sort((a, b) => a.z - b.z);
    for (const q of projPts) {
      const depthA = (q.z + 1) / 2;
      ctx.globalAlpha = 0.16 + depthA * 0.55;
      ctx.fillStyle = q.c;
      ctx.beginPath();
      ctx.arc(q.x, q.y, Math.max(0.3, (0.4 + depthA * 1.4) * q.s), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // ---- radar sweep ring (great circle sweeping tilt, smooth alpha) ----
    const tilt = (reduced ? 0.4 : Math.sin(now * 0.00032)) * 0.9;
    const tC = Math.cos(tilt), tS = Math.sin(tilt);
    let prev = null;
    for (let k = 0; k <= 140; k++) {
      const a = (k / 140) * Math.PI * 2;
      const px = Math.cos(a), pz = Math.sin(a);
      const y2 = -pz * tS, z2 = pz * tC;
      const cur = transform(px, y2, z2);
      if (prev) {
        const front = ((prev.z + cur.z) / 2 + 1) / 2;
        ctx.strokeStyle = 'rgba(34,211,238,' + (0.06 + front * 0.5).toFixed(3) + ')';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(cur.x, cur.y);
        ctx.stroke();
      }
      prev = cur;
    }

    // ---- tilted orbit rings + satellites ----
    const orbPoint = (scale, tiltDeg, angle) => {
      const t = tiltDeg * Math.PI / 180;
      const oC = Math.cos(t), oS = Math.sin(t);
      const q = transform(Math.cos(angle) * scale, -Math.sin(angle) * scale * oS, Math.sin(angle) * scale * oC);
      return { x: q.x, y: q.y, z: q.z };
    };
    const drawRing = (scale, tiltDeg, rotSpeed, phase, color, lw) => {
      const rot = (reduced ? phase : now * rotSpeed + phase);
      ctx.beginPath();
      for (let k = 0; k <= 100; k++) {
        const a = (k / 100) * Math.PI * 2;
        const q = orbPoint(scale, tiltDeg, a + rot);
        if (k === 0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y);
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.stroke();
      const d = orbPoint(scale, tiltDeg, rot + Math.PI / 2);
      return d;
    };
    const d1 = drawRing(1.24, 26, 0.00025, 0.5, 'rgba(16,185,129,0.35)', 1.1);
    const d2 = drawRing(1.42, -16, -0.0002, 1.1, 'rgba(34,211,238,0.25)', 1);

    // satellite dots (with glow)
    [[d1, '#10b981', 'rgba(16,185,129,0.35)'], [d2, '#22d3ee', 'rgba(34,211,238,0.3)']].forEach(([d, fill, halo]) => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(d.x, d.y, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
    });

    // ---- rim light (subtle stylized edge highlight) ----
    ctx.beginPath();
    ctx.ellipse(cx, cy, R, R, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.stroke();

    if (!reduced) requestAnimationFrame(frame);
  }

  if (reduced) frame(performance.now());
  else requestAnimationFrame(frame);
})();