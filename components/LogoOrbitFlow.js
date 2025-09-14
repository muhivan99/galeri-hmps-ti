'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

/** Partikel orbit diagonal masuk–keluar logo (tanpa box) */
export default function LogoOrbitFlow({
  src, alt = '', size = 180, particles = 64, speed = 0.65,
  inner = 0.38, outer = 0.92, tiltDeg = 35, ellip = 0.62
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const W = size, H = size;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = W / 2, cy = H / 2;
    const Rmin = Math.min(W, H) * 0.5 * inner;
    const Rmax = Math.min(W, H) * 0.5 * outer;
    const amp = (Rmax - Rmin) * 0.5;
    const r0 = Rmin + amp;

    const css = getComputedStyle(document.documentElement);
    const colors = [
      (css.getPropertyValue('--neon1') || '#f0abfc').trim(),
      (css.getPropertyValue('--neon2') || '#67e8f9').trim(),
      (css.getPropertyValue('--neon3') || '#60a5fa').trim()
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

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let t = 0;

    function frame() {
      ctx.clearRect(0, 0, W, H);

      ctx.beginPath();
      ctx.ellipse(cx, cy, Rmax, Rmax * k, phi, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(cx, cy, Rmin, cx, cy, Rmax);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(255,255,255,0.07)');
      ctx.strokeStyle = g; ctx.lineWidth = 1; ctx.stroke();

      for (const d of dots) {
        d.a += d.w;
        const r = r0 + Math.sin(t * d.rf + d.phase) * amp;
        const ex = Math.cos(d.a), ey = Math.sin(d.a);
        const x = cx + (ex * cosP - (ey * k) * sinP) * r;
        const y = cy + (ex * sinP + (ey * k) * cosP) * r;

        const norm = (r - Rmin) / (Rmax - Rmin);
        ctx.beginPath();
        ctx.globalAlpha = 0.45 + (1 - norm) * 0.4;
        ctx.fillStyle = d.c;
        ctx.shadowBlur = 14; ctx.shadowColor = d.c;
        ctx.arc(x, y, d.s * (1.2 - 0.5 * norm), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      t += 1; rafRef.current = requestAnimationFrame(frame);
    }

    if (reduce) { frame(); cancelAnimationFrame(rafRef.current); }
    else { frame(); }
    return () => cancelAnimationFrame(rafRef.current);
  }, [size, particles, speed, inner, outer, tiltDeg, ellip]);

  return (
    <div className="relative" style={{ width: size, height: size }} aria-label={alt} role="img">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 grid place-items-center">
        <Image src={src} alt={alt} width={size * 0.7} height={size * 0.7}
               className="object-contain w-[70%] h-[70%]" priority />
      </div>
    </div>
  );
}
