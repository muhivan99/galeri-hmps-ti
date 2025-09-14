'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

/**
 * Stardust / Glitter Orbit — partikel berkilau muter elips.
 * Occlusion depan-belakang: dua canvas (back & front) mengapit logo.
 * Tanpa box, full transparan.
 */
export default function LogoStardustOrbit({
  src,
  alt = 'Logo Organisasi',
  size = 260,       // area total (logo + orbit)
  particles = 110,  // density bintang
  speed = 0.7,      // kecepatan putar
  inner = 0.30,     // radius min (fraksi dari setengah size)
  outer = 0.98,     // radius max
  tiltDeg = 30,     // sudut orbit (derajat)
  ellip = 0.58      // rasio elips (0..1, kecil = gepeng)
}) {
  const backRef = useRef(null);
  const frontRef = useRef(null);
  const raf = useRef(0);

  useEffect(() => {
    const setup = (canvas) => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const W = size, H = size;
      const ctx = canvas.getContext('2d', { alpha: true });
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = 'round';
      return { ctx, W, H };
    };

    const { ctx: ctxBack, W, H } = setup(backRef.current);
    const { ctx: ctxFront } = setup(frontRef.current);

    const cx = W / 2, cy = H / 2;
    const Rmin = Math.min(W, H) * 0.5 * inner;
    const Rmax = Math.min(W, H) * 0.5 * outer;
    const amp  = (Rmax - Rmin) * 0.5;     // amplitudo in–out
    const r0   = Rmin + amp;

    // Warna: neon theme + emas/rose untuk glitter
    const css = getComputedStyle(document.documentElement);
    const palette = [
      (css.getPropertyValue('--neon1') || '#f0abfc').trim(),
      (css.getPropertyValue('--neon2') || '#67e8f9').trim(),
      (css.getPropertyValue('--neon3') || '#60a5fa').trim(),
      '#ffd166', // gold
      '#ffe6a7', // soft gold
      '#ffc2e7'  // pink glitter
    ];

    // Elips diagonal
    const phi = (tiltDeg * Math.PI) / 180;
    const cosP = Math.cos(phi), sinP = Math.sin(phi);
    const k = Math.max(0.25, Math.min(1, ellip));

    // Partikel
    const dots = Array.from({ length: particles }, (_, i) => ({
      a: Math.random() * Math.PI * 2,                       // sudut
      w: (0.5 + Math.random()) * speed / 120,               // kecepatan sudut
      phase: Math.random() * Math.PI * 2,                   // fase in–out
      rf: (0.5 + Math.random()) * speed / 90,               // kecepatan in–out
      tw: (0.4 + Math.random() * 0.8) * speed / 40,         // twinkle speed
      c: palette[i % palette.length],                       // warna
      s: 0.9 + Math.random() * 1.8,                         // base size
      rot: Math.random() * Math.PI * 2                      // rotasi spike
    }));

    // Helper: gambar spark bintang (bulat + spikes)
    function drawSpark(ctx, x, y, r, color, alpha, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalCompositeOperation = 'lighter'; // efek additive (glow)

      // glow disk
      ctx.beginPath();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
      ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // spikes (horizontal/vertikal + diagonal halus)
      ctx.lineWidth = Math.max(0.8, r * 0.28);
      ctx.strokeStyle = color;

      ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();

      ctx.globalAlpha = alpha * 0.6;
      ctx.lineWidth = Math.max(0.6, r * 0.2);
      const d = r * 0.75;
      ctx.beginPath(); ctx.moveTo(-d, -d); ctx.lineTo(d, d); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(d, -d);  ctx.lineTo(-d, d); ctx.stroke();

      ctx.restore();
    }

    let t = 0;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function frame() {
      ctxBack.clearRect(0, 0, W, H);
      ctxFront.clearRect(0, 0, W, H);

      // Ring tipis dotted (bintang halus)
      ctxBack.save();
      ctxBack.beginPath();
      ctxBack.ellipse(cx, cy, Rmax, Rmax * k, phi, 0, Math.PI * 2);
      const g = ctxBack.createRadialGradient(cx, cy, Rmin, cx, cy, Rmax);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(255,255,255,0.06)');
      ctxBack.strokeStyle = g;
      ctxBack.lineWidth = 1;
      ctxBack.setLineDash([2, 6]);
      ctxBack.stroke();
      ctxBack.restore();

      for (const d of dots) {
        d.a += d.w;

        // radius in–out (sparkling band)
        const r = r0 + Math.sin(t * d.rf + d.phase) * amp;

        // posisi elips
        const ex = Math.cos(d.a), ey = Math.sin(d.a);
        const x = cx + (ex * cosP - (ey * k) * sinP) * r;
        const y = cy + (ex * sinP + (ey * k) * cosP) * r;

        // depan/belakang berdasarkan ey (hemi-ellipse)
        const ctx = ey > 0 ? ctxFront : ctxBack;

        // twinkle
        const norm = (r - Rmin) / (Rmax - Rmin); // 0..1
        const twinkle = 0.6 + 0.4 * Math.sin(t * d.tw + d.phase);
        const alpha = (0.35 + (1 - norm) * 0.5) * twinkle;
        const size  = d.s * (1.1 - 0.4 * norm);

        drawSpark(ctx, x, y, size, d.c, alpha, d.rot);
      }

      // sesekali glitter micro-burst (subtle)
      if (Math.random() < 0.015) {
        const burst = dots[Math.floor(Math.random() * dots.length)];
        burst.phase += Math.PI / 2;
        burst.rot += 0.6;
      }

      t += 1;
      raf.current = requestAnimationFrame(frame);
    }

    if (reduce) { frame(); cancelAnimationFrame(raf.current); }
    else { frame(); }

    return () => cancelAnimationFrame(raf.current);
  }, [size, particles, speed, inner, outer, tiltDeg, ellip]);

  return (
    <div className="relative" style={{ width: size, height: size }} aria-label={alt} role="img">
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
