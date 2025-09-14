'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

/**
 * LogoPlanetOrbit
 * Dua canvas (belakang & depan) + logo di tengah -> partikel bisa "melewati" belakang & depan logo.
 * Tanpa box/shadow, full transparan.
 */
export default function LogoPlanetOrbit({
  src,
  alt = '',
  size = 140,     // total area komponen
  particles = 60, // jumlah partikel
  speed = 0.6,    // kecepatan dasar putaran
  inner = 0.38,   // radius minimum (fraksi dari setengah size)
  outer = 0.92,   // radius maksimum
  tiltDeg = 30,   // sudut orbit (derajat) -> bikin diagonal
  ellip = 0.65    // gepeng elips (0..1)
}) {
  const backRef = useRef(null);
  const frontRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const setup = (canvas) => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const W = size, H = size;
      const ctx = canvas.getContext('2d', { alpha: true });
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { ctx, W, H };
    };

    const { ctx: ctxBack, W, H } = setup(backRef.current);
    const { ctx: ctxFront } = setup(frontRef.current);

    const cx = W / 2, cy = H / 2;
    const Rmin = Math.min(W, H) * 0.5 * inner;
    const Rmax = Math.min(W, H) * 0.5 * outer;
    const amp = (Rmax - Rmin) * 0.5;
    const r0 = Rmin + amp;

    const css = getComputedStyle(document.documentElement);
    const colors = [
      css.getPropertyValue('--neon1').trim() || '#f0abfc',
      css.getPropertyValue('--neon2').trim() || '#67e8f9',
      css.getPropertyValue('--neon3').trim() || '#60a5fa'
    ];

    const phi = (tiltDeg * Math.PI) / 180;
    const cosP = Math.cos(phi), sinP = Math.sin(phi);
    const k = Math.max(0.2, Math.min(1, ellip));

    const dots = Array.from({ length: particles }, (_, i) => ({
      a: Math.random() * Math.PI * 2,
      w: (0.6 + Math.random() * 0.8) * speed / 120,
      phase: Math.random() * Math.PI * 2,
      rf: (0.5 + Math.random()) * speed / 90,
      c: colors[i % colors.length],
      s: 1 + Math.random() * 1.6
    }));

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t = 0;

    function draw() {
      ctxBack.clearRect(0, 0, W, H);
      ctxFront.clearRect(0, 0, W, H);

      // cincin orbit tipis (di layer belakang biar subtle)
      ctxBack.beginPath();
      ctxBack.ellipse(cx, cy, Rmax, Rmax * k, phi, 0, Math.PI * 2);
      const g = ctxBack.createRadialGradient(cx, cy, Rmin, cx, cy, Rmax);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(255,255,255,0.07)');
      ctxBack.strokeStyle = g;
      ctxBack.lineWidth = 1;
      ctxBack.stroke();

      for (const d of dots) {
        d.a += d.w;
        const r = r0 + Math.sin(t * d.rf + d.phase) * amp; // masuk–keluar

        const ex = Math.cos(d.a);
        const ey = Math.sin(d.a);
        // elips diagonal (rotate + flatten)
        const x = cx + (ex * cosP - (ey * k) * sinP) * r;
        const y = cy + (ex * sinP + (ey * k) * cosP) * r;

        // separasi depan/belakang pakai sin sudut (half orbit)
        const front = Math.sin(d.a) > 0;
        const ctx = front ? ctxFront : ctxBack;

        const norm = (r - Rmin) / (Rmax - Rmin);
        const sizeNow = d.s * (1.2 - 0.5 * norm);
        const alpha = 0.45 + (1 - norm) * 0.4;

        ctx.beginPath();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = d.c;
        ctx.shadowBlur = 14;
        ctx.shadowColor = d.c;
        ctx.arc(x, y, sizeNow, 0, Math.PI * 2);
        ctx.fill();
      }
      ctxBack.globalAlpha = ctxFront.globalAlpha = 1;
      ctxBack.shadowBlur = ctxFront.shadowBlur = 0;

      t += 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    if (reduce) {
      draw(); cancelAnimationFrame(rafRef.current);
    } else {
      draw();
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, particles, speed, inner, outer, tiltDeg, ellip]);

  return (
    <div className="relative" style={{ width: size, height: size }} aria-label={alt} role="img">
      {/* partikel belakang logo */}
      <canvas ref={backRef} className="absolute inset-0 pointer-events-none" />
      {/* logo */}
      <div className="absolute inset-0 grid place-items-center">
        <Image src={src} alt={alt} width={size * 0.7} height={size * 0.7}
               className="object-contain w-[70%] h-[70%]" priority />
      </div>
      {/* partikel depan logo */}
      <canvas ref={frontRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
