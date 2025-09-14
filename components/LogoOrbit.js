'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function LogoOrbit({
  src,
  alt = '',
  size = 180,
  particles = 56,     // banyak partikel
  speed = 0.6,        // kecepatan dasar
  ring = 0.78         // rasio radius orbit vs setengah ukuran
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    let w = size, h = size;
    let dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    // ambil warna neon dari CSS var
    const css = getComputedStyle(document.documentElement);
    const colors = [
      css.getPropertyValue('--neon1').trim() || '#f0abfc',
      css.getPropertyValue('--neon2').trim() || '#67e8f9',
      css.getPropertyValue('--neon3').trim() || '#60a5fa'
    ];

    const cx = w / 2, cy = h / 2;
    const R = (Math.min(w, h) / 2) * ring; // radius orbit di luar logo
    const dots = [];

    for (let i = 0; i < particles; i++) {
      dots.push({
        a: Math.random() * Math.PI * 2,             // angle
        r: R * (0.88 + Math.random() * 0.18),       // sedikit tebal
        s: (0.5 + Math.random()) * speed / 180,     // speed (rad/frame)
        z: 1 + Math.random() * 1.6,                 // size
        c: colors[i % colors.length]
      });
    }

    let t = 0, running = true;
    function draw() {
      if (!running) return;
      // clear transparan (NO box)
      ctx.clearRect(0, 0, w, h);

      // garis orbit tipis (halus, transparan)
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(1, 'rgba(255,255,255,0.08)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.stroke();

      // partikel
      for (const d of dots) {
        d.a += d.s; // gerak
        const x = cx + Math.cos(d.a) * d.r;
        const y = cy + Math.sin(d.a) * d.r;

        ctx.beginPath();
        ctx.fillStyle = d.c;
        ctx.shadowBlur = 14;
        ctx.shadowColor = d.c;
        ctx.arc(x, y, d.z, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // putaran halus
      t += 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    // respect prefers-reduced-motion
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) {
      // render satu frame statis
      draw();
      cancelAnimationFrame(rafRef.current);
    } else {
      draw();
    }

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [size, particles, speed, ring]);

  return (
    <div
      ref={wrapRef}
      className="logo-orbit relative"
      style={{ width: size, height: size }}
      aria-label={alt}
      role="img"
    >
      {/* kanvas partikel, transparan, full area */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0" />

      {/* logo di tengah, tanpa box/border */}
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
    </div>
  );
}
