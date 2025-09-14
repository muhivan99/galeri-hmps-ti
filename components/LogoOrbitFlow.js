'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

/**
 * LogoOrbitFlow
 * Partikel ber-orbit elips yang DIAGONAL + osilasi radius (in–out).
 * No box shadow, canvas transparan.
 */
export default function LogoOrbitFlow({
  src,
  alt = '',
  size = 180,        // ukuran area total komponen
  particles = 64,    // jumlah partikel
  speed = 0.65,      // speed dasar putaran (semakin besar -> semakin cepat)
  inner = 0.38,      // batas radius dalam (fraksi dari setengah size)
  outer = 0.92,      // batas radius luar (fraksi dari setengah size)
  tiltDeg = 35,      // rotasi elips (derajat) -> bikin diagonal
  ellip = 0.62       // rasio elips (0..1) makin kecil makin gepeng
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });

    // setup canvas DPR
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const W = size, H = size;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = W / 2, cy = H / 2;
    const Rmin = Math.min(W, H) * 0.5 * inner;
    const Rmax = Math.min(W, H) * 0.5 * outer;
    const amp = (Rmax - Rmin) * 0.5;           // amplitudo in–out
    const r0 = Rmin + amp;                     // radius tengah

    // ambil var neon dari CSS
    const css = getComputedStyle(document.documentElement);
    const colors = [
      css.getPropertyValue('--neon1').trim() || '#f0abfc',
      css.getPropertyValue('--neon2').trim() || '#67e8f9',
      css.getPropertyValue('--neon3').trim() || '#60a5fa'
    ];

    // konversi tilt
    const phi = (tiltDeg * Math.PI) / 180;     // rotasi elips
    const cosP = Math.cos(phi), sinP = Math.sin(phi);
    const k = Math.max(0.2, Math.min(1, ellip)); // penjepit rasio elips

    // init partikel
    const dots = Array.from({ length: particles }, (_, i) => ({
      a: Math.random() * Math.PI * 2,                // sudut awal
      w: (0.6 + Math.random() * 0.8) * speed / 120,  // kecepatan sudut
      phase: Math.random() * Math.PI * 2,            // fase osilasi radius
      rf: (0.5 + Math.random() * 0.8) * speed / 90,  // kecepatan osilasi radius
      c: colors[i % colors.length],                  // warna neon
      s: 1 + Math.random() * 1.6                     // ukuran dasar
    }));

    let t = 0;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function frame() {
      // clear transparan (tanpa box)
      ctx.clearRect(0, 0, W, H);

      // orbit ring tipis (opsional, sangat halus)
      ctx.beginPath();
      ctx.ellipse(cx, cy, Rmax, Rmax * k, phi, 0, Math.PI * 2);
      const g = ctx.createRadialGradient(cx, cy, Rmin, cx, cy, Rmax);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(255,255,255,0.07)');
      ctx.strokeStyle = g;
      ctx.lineWidth = 1;
      ctx.stroke();

      for (const d of dots) {
        // update sudut & radius (in–out)
        d.a += d.w;
        const r = r0 + Math.sin(t * d.rf + d.phase) * amp; // keluar–masuk

        // param elips diagonal (rotated ellipse)
        const ex = Math.cos(d.a);
        const ey = Math.sin(d.a);
        // rotasi + flatten elips
        const x = cx + (ex * cosP - (ey * k) * sinP) * r;
        const y = cy + (ex * sinP + (ey * k) * cosP) * r;

        // depth feel: makin ke dalam -> lebih besar/terang
        const norm = (r - Rmin) / (Rmax - Rmin);  // 0..1
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

      // reset
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      t += 1;
      rafRef.current = requestAnimationFrame(frame);
    }

    if (reduce) {
      frame();              // render satu frame
      cancelAnimationFrame(rafRef.current);
    } else {
      frame();
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [size, particles, speed, inner, outer, tiltDeg, ellip]);

  return (
    <div
      className="relative logo-orbit-flow"
      style={{ width: size, height: size }}
      aria-label={alt}
      role="img"
    >
      {/* Canvas partikel transparan */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      {/* Logo di tengah, tanpa box */}
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
