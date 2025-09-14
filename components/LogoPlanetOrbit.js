'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

/**
 * Partikel mengelilingi logo seperti orbit planet.
 * Occlusion: separuh lintasan di belakang logo (canvas bawah),
 * separuh di depan logo (canvas atas). No box/no shadow container.
 */
export default function LogoPlanetOrbit({
  src,
  alt = 'Logo Organisasi',
  size = 220,       // <<< logo area besar
  particles = 80,   // jumlah partikel
  speed = 0.7,      // kecepatan putaran
  inner = 0.34,     // radius minimum (fraksi dari setengah size)
  outer = 0.96,     // radius maksimum
  tiltDeg = 30,     // sudut orbit (derajat) → diagonal
  ellip = 0.6       // gepeng elips (0..1)
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
    const amp  = (Rmax - Rmin) * 0.5;
    const r0   = Rmin + amp;

    // warna ikut tema neon
    const css = getComputedStyle(document.documentElement);
    const colors = [
      (css.getPropertyValue('--neon1') || '#f0abfc').trim(),
      (css.getPropertyValue('--neon2') || '#67e8f9').trim(),
      (css.getPropertyValue('--neon3') || '#60a5fa').trim()
    ];

    // elips diagonal
    const phi = (tiltDeg * Math.PI) / 180;
    const cosP = Math.cos(phi), sinP = Math.sin(phi);
    const k = Math.max(0.25, Math.min(1, ellip));

    // partikel
    const dots = Array.from({ length: particles }, (_, i) => ({
      a: Math.random() * Math.PI * 2,                 // sudut awal
      w: (0.6 + Math.random() * 0.8) * speed / 120,   // kecepatan sudut
      phase: Math.random() * Math.PI * 2,
      rf: (0.5 + Math.random()) * speed / 90,         // kecepatan in–out
      c: colors[i % colors.length],
      s: 1 + Math.random() * 1.8                      // ukuran dasar
    }));

    let t = 0;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function draw() {
      ctxBack.clearRect(0, 0, W, H);
      ctxFront.clearRect(0, 0, W, H);

      // cincin orbit halus (di belakang)
      ctxBack.beginPath();
      ctxBack.ellipse(cx, cy, Rmax, Rmax * k, phi, 0, Math.PI * 2);
      const g = ctxBack.createRadialGradient(cx, cy, Rmin, cx, cy, Rmax);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(1, 'rgba(255,255,255,0.07)');
      ctxBack.strokeStyle = g; ctxBack.lineWidth = 1; ctxBack.stroke();

      for (const d of dots) {
        d.a += d.w;

        // radius oscil (keluar–masuk)
        const r = r0 + Math.sin(t * d.rf + d.phase) * amp;

        // koordinat lingkaran
        const ex = Math.cos(d.a), ey = Math.sin(d.a);

        // proyeksi ke elips yg di-rotate
        const x = cx + (ex * cosP - (ey * k) * sinP) * r;
        const y = cy + (ex * sinP + (ey * k) * cosP) * r;

        // front/back dari "ey": ey > 0 = bagian depan ellipse
        const ctx = ey > 0 ? ctxFront : ctxBack;

        const norm  = (r - Rmin) / (Rmax - Rmin);        // 0..1
        const sizeN = d.s * (1.2 - 0.5 * norm);          // dekat → lebih besar
        const alpha = 0.45 + (1 - norm) * 0.4;           // dekat → lebih terang

        ctx.beginPath();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = d.c;
        ctx.shadowBlur = 14; ctx.shadowColor = d.c;
        ctx.arc(x, y, sizeN, 0, Math.PI * 2);
        ctx.fill();
      }

      ctxBack.globalAlpha = ctxFront.globalAlpha = 1;
      ctxBack.shadowBlur  = ctxFront.shadowBlur  = 0;
      t += 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    if (reduce) { draw(); cancelAnimationFrame(rafRef.current); }
    else { draw(); }

    return () => cancelAnimationFrame(rafRef.current);
  }, [size, particles, speed, inner, outer, tiltDeg, ellip]);

  return (
    <div className="relative" style={{ width: size, height: size }} aria-label={alt} role="img">
      {/* partikel belakang logo */}
      <canvas ref={backRef}  className="absolute inset-0 pointer-events-none" />
      {/* logo */}
      <div className="absolute inset-0 grid place-items-center">
        <Image
          src={src}
          alt={alt}
          width={size * 0.72}
          height={size * 0.72}
          className="object-contain w-[72%] h-[72%]"
          priority
        />
      </div>
      {/* partikel depan logo */}
      <canvas ref={frontRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}
