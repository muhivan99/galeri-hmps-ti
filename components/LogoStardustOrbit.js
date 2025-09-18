'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

/**
 * Stardust Orbit — ringan tapi mewah:
 * - Bintang berkilau (front/back occlusion)
 * - Komet dengan trail
 * - Spark burst saat hover/tap
 * - Optimasi: cap DPR, adaptif mobile, pause saat off-screen/tab hidden
 */
export default function LogoStardustOrbit({
  src,
  alt = 'Logo Organisasi',
  size = 280,         // area total
  particles = 120,    // density bintang (akan diturunkan otomatis di HP)
  comets = 2,         // jumlah komet
  speed = 0.7,        // kecepatan dasar
  inner = 0.28,       // radius min (fraksi dari 1/2 size)
  outer = 0.98,       // radius max
  tiltDeg = 30,       // sudut elips (deg)
  ellip = 0.56        // rasio elips (0..1, kecil = gepeng)
}) {
  const wrapRef  = useRef(null);
  const backRef  = useRef(null);
  const frontRef = useRef(null);
  const rafRef   = useRef(0);
  const running  = useRef(false);
  const { resolvedTheme } = useTheme(); // <- biar re-render pas ganti tema

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvasBack = backRef.current;
    const canvasFront = frontRef.current;

    // ==== PERF: cap DPR & adaptif mobile ====
    const rawDpr = (globalThis.devicePixelRatio || 1);
    const dpr = Math.min(1.75, rawDpr);                // cap retina biar nggak jebol GPU
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const deviceMem = (navigator && navigator.deviceMemory) || 8;
    let STAR_COUNT = particles;
    if (isMobile || deviceMem <= 4) STAR_COUNT = Math.floor(particles * 0.55); // kurangi di HP
    const COMET_COUNT = Math.max(0, comets);

    // ==== Canvas setup ====
    const W = size, H = size;
    const setup = (c) => {
      const ctx = c.getContext('2d', { alpha: true });
      c.width = W * dpr; c.height = H * dpr;
      c.style.width = `${W}px`; c.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      ctx.globalCompositeOperation = 'lighter';
      return ctx;
    };
    const ctxBack  = setup(canvasBack);
    const ctxFront = setup(canvasFront);

    const cx = W / 2, cy = H / 2;
    const Rmin = Math.min(W, H) * 0.5 * inner;
    const Rmax = Math.min(W, H) * 0.5 * outer;
    const amp  = (Rmax - Rmin) * 0.5;
    const r0   = Rmin + amp;

    // Elips diagonal
    const phi = (tiltDeg * Math.PI) / 180;
    const cosP = Math.cos(phi), sinP = Math.sin(phi);
    const k = Math.max(0.25, Math.min(1, ellip));

    // Palet warna (mix neon + gold)
    const css = getComputedStyle(document.documentElement);
    const palette = [
      (css.getPropertyValue('--neon1') || '#f0abfc').trim(),
      (css.getPropertyValue('--neon2') || '#67e8f9').trim(),
      (css.getPropertyValue('--neon3') || '#60a5fa').trim(),
      '#ffd166', '#ffe6a7', '#ffc2e7'
    ];

    // ======= Stardust =======
    const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
      a: Math.random() * Math.PI * 2,
      w: (0.5 + Math.random()) * speed / 120,
      phase: Math.random() * Math.PI * 2,
      rf: (0.5 + Math.random()) * speed / 90,
      tw: (0.4 + Math.random() * 0.8) * speed / 40,
      c: palette[i % palette.length],
      s: 0.9 + Math.random() * 1.8,
      rot: Math.random() * Math.PI * 2
    }));

    // ======= Comets (trail ringkas) =======
    const TRAIL = isMobile ? 10 : 16;                 // ring buffer panjang trail
    const cometsArr = Array.from({ length: COMET_COUNT }, () => ({
      a: Math.random() * Math.PI * 2,
      w: (1.2 + Math.random() * 0.8) * speed / 60,   // komet lebih cepat
      rPhase: Math.random() * Math.PI * 2,
      rf: (0.7 + Math.random() * 0.6) * speed / 90,
      hueIx: Math.floor(Math.random() * palette.length),
      size: 1.6 + Math.random() * 1.2,
      trail: new Array(TRAIL).fill(null)              // pos history
    }));

    // ======= Burst saat hover/tap =======
    const bursts = []; // {x,y,t,life}
    const spawnBurst = () => {
      const now = performance.now();
      bursts.push({ t0: now, life: 420, seeds: Array.from({ length: isMobile ? 10 : 16 }, () => ({
        a: Math.random() * Math.PI * 2,
        v: (1 + Math.random() * 1.6) * (Rmax / 120),
        r: 0,
        c: palette[Math.floor(Math.random() * palette.length)],
        rot: Math.random() * Math.PI * 2
      })) });
      // keep bursts small
      if (bursts.length > 4) bursts.shift();
    };

    wrap.addEventListener('mouseenter', spawnBurst);
    wrap.addEventListener('click', spawnBurst);
    wrap.addEventListener('touchstart', spawnBurst, { passive: true });

    // ======= Helper draw spark/star =======
    const drawSpark = (ctx, x, y, r, color, alpha, rot) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;

      // glow disk (lebih ringan: tanpa shadowBlur besar)
      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.arc(0, 0, r * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // cross spikes
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(0.8, r * 0.25);
      ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();

      ctx.globalAlpha = alpha * 0.55;
      ctx.lineWidth = Math.max(0.6, r * 0.18);
      const d = r * 0.7;
      ctx.beginPath(); ctx.moveTo(-d, -d); ctx.lineTo(d, d); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(d, -d);  ctx.lineTo(-d, d); ctx.stroke();
      ctx.restore();
    };

    // ======= Visibility / Intersection (pause saat offscreen/tab hidden) =======
    let visible = true;
    const onVis = () => { visible = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; });
    io.observe(wrap);

    // ======= Main loop (rAF) =======
    let t = 0;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const frame = () => {
      if (!running.current) return;
      // skip jika tidak terlihat -> hemat
      if (!visible) { rafRef.current = requestAnimationFrame(frame); return; }

      ctxBack.clearRect(0, 0, W, H);
      ctxFront.clearRect(0, 0, W, H);

      // ring dotted (subtle)
      ctxBack.save();
      ctxBack.setLineDash([2, 6]);
      ctxBack.strokeStyle = 'rgba(255,255,255,0.06)';
      ctxBack.lineWidth = 1;
      ctxBack.beginPath();
      ctxBack.ellipse(cx, cy, Rmax, Rmax * k, phi, 0, Math.PI * 2);
      ctxBack.stroke();
      ctxBack.restore();

      // ----- stars -----
      for (const d of stars) {
        d.a += d.w;
        const r = r0 + Math.sin(t * d.rf + d.phase) * amp;
        const ex = Math.cos(d.a), ey = Math.sin(d.a);
        const x = cx + (ex * cosP - (ey * k) * sinP) * r;
        const y = cy + (ex * sinP + (ey * k) * cosP) * r;

        const ctx = ey > 0 ? ctxFront : ctxBack;
        const norm = (r - Rmin) / (Rmax - Rmin);
        const tw = 0.6 + 0.4 * Math.sin(t * d.tw + d.phase);
        const alpha = (0.34 + (1 - norm) * 0.45) * tw;
        const sz = d.s * (1.08 - 0.4 * norm);

        drawSpark(ctx, x, y, sz, d.c, alpha, d.rot);
      }

      // ----- comets (trail segmented front/back) -----
      for (const c of cometsArr) {
        c.a += c.w;
        const r = r0 + Math.sin(t * c.rf + c.rPhase) * amp * 0.85;
        const ex = Math.cos(c.a), ey = Math.sin(c.a);
        const x = cx + (ex * cosP - (ey * k) * sinP) * r;
        const y = cy + (ex * sinP + (ey * k) * cosP) * r;

        // update trail ring buffer
        c.trail.pop(); c.trail.unshift({ x, y, ey });

        // gambar trail: segment per sisi supaya occlusion bener
        for (let side = 0; side < 2; side++) {
          const frontSide = side === 0;
          const ctx = frontSide ? ctxFront : ctxBack;
          let last = null;
          ctx.beginPath();
          for (let i = 0; i < c.trail.length; i++) {
            const p = c.trail[i];
            if (!p || (p.ey > 0) !== frontSide) { last = null; continue; }
            if (!last) { ctx.moveTo(p.x, p.y); last = p; }
            else { ctx.lineTo(p.x, p.y); last = p; }
          }
          const col = palette[c.hueIx];
          ctx.strokeStyle = col;
          ctx.globalAlpha = 0.5;
          ctx.lineWidth = 2.2;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // kepala komet (depan/belakang)
        const ctxHead = ey > 0 ? ctxFront : ctxBack;
        drawSpark(ctxHead, x, y, c.size * 1.6, palette[c.hueIx], 0.9, 0);
      }

      // ----- bursts -----
      for (let i = bursts.length - 1; i >= 0; i--) {
        const B = bursts[i];
        const age = performance.now() - B.t0;
        if (age > B.life) { bursts.splice(i, 1); continue; }
        const p = age / B.life;
        const ctx = ctxFront; // burst di depan biar mengkilat
        for (const s of B.seeds) {
          const r = (Rmax * 0.25) * (p * (0.7 + 0.6 * Math.random()));
          const x = cx + Math.cos(s.a) * r;
          const y = cy + Math.sin(s.a) * r;
          const fade = 1 - p;
          drawSpark(ctx, x, y, 1.2 + s.v * fade, s.c, 0.9 * fade, s.rot);
        }
      }

      t += 1;
      rafRef.current = requestAnimationFrame(frame);
    };

    running.current = true;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      // satu frame statis
      frame(); cancelAnimationFrame(rafRef.current);
    } else {
      rafRef.current = requestAnimationFrame(frame);
    }

    // cleanup
    return () => {
      running.current = false;
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVis);
      io.disconnect();
      wrap.removeEventListener('mouseenter', spawnBurst);
      wrap.removeEventListener('click', spawnBurst);
      wrap.removeEventListener('touchstart', spawnBurst);
    };
  }, [resolvedTheme, size, particles, comets, speed, inner, outer, tiltDeg, ellip]);

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ width: size, height: size }}
      aria-label={alt}
      role="img"
    >
      {/* partikel belakang logo */}
      <canvas ref={backRef} className="absolute inset-0 pointer-events-none" />
      {/* logo */}
      <div className="absolute inset-0 grid place-items-center">
        <Image
          src={src}
          alt={alt}
          width={size * 0.7}
          height={size * 0.7}
          className="object-contain w-[70%] h-[70%]"
          priority
        />
      </div>
      {/* partikel depan logo */}
      <canvas ref={frontRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
