// components/NeonBackground.js
'use client';

import { useEffect, useRef } from 'react';

export default function NeonBackground() {
  const ref = useRef(null);
  const raf = useRef(0);
  const running = useRef(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });

    // DPR cap biar nggak berat
    const getDpr = () => Math.min(1.75, globalThis.devicePixelRatio || 1);

    const size = () => {
      const dpr = getDpr();
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    // warna dari CSS variable (ikut theme)
    const css = () => getComputedStyle(document.documentElement);
    const col = () => ({
      dot: (css().getPropertyValue('--bgDot') || 'rgba(255,255,255,.6)').trim(),
      line: (css().getPropertyValue('--bgLine') || 'rgba(255,255,255,.07)').trim(),
      glow1: (css().getPropertyValue('--neon2') || '#67e8f9').trim(),
      glow2: (css().getPropertyValue('--neon3') || '#60a5fa').trim(),
    });

    // inisiasi partikel (density adaptif)
    let particles = [];
    const init = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const area = w * h;
      const count = Math.min(160, Math.max(40, Math.floor(area / 14000))); // 14k px per partikel
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 0.6 + Math.random() * 1.4,
        tw: Math.random() * Math.PI * 2,
      }));
    };

    size();
    init();

    let visible = true;
    const onVis = () => (visible = document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);

    const onResize = () => {
      size();
      init();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);

    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const step = () => {
      if (!running.current) return;
      if (!visible) {
        raf.current = requestAnimationFrame(step);
        return;
      }
      const { width: W, height: H } = canvas;
      // catatan: ctx sudah scale ke DPR=1 dengan setTransform, jadi pakai clientWidth/Height
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

      ctx.clearRect(0, 0, cw, ch);

      const c = col();

      // radial glow lembut (ringan)
      const g1 = ctx.createRadialGradient(cw * 0.2, ch * 0.1, 0, cw * 0.2, ch * 0.1, Math.max(cw, ch) * 0.8);
      g1.addColorStop(0, c.glow1 + '22'); // + alpha
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, cw, ch);

      const g2 = ctx.createRadialGradient(cw * 0.85, ch * 0.8, 0, cw * 0.85, ch * 0.8, Math.max(cw, ch) * 0.7);
      g2.addColorStop(0, c.glow2 + '22');
      g2.addColorStop(1, 'transparent');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, cw, ch);

      // gerak & gambar partikel
      ctx.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // bounce
        if (p.x < -10) p.x = cw + 10;
        else if (p.x > cw + 10) p.x = -10;
        if (p.y < -10) p.y = ch + 10;
        else if (p.y > ch + 10) p.y = -10;

        // twinkle halus
        p.tw += 0.03;
        const a = 0.35 + 0.35 * Math.sin(p.tw);

        ctx.beginPath();
        ctx.fillStyle = c.dot;
        ctx.globalAlpha = a;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // garis koneksi (jarak dekat)
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          const max = 120; // px
          if (d2 < max * max) {
            const t = 1 - Math.sqrt(d2) / max;
            ctx.globalAlpha = 0.5 * t * t;
            ctx.strokeStyle = c.line;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      if (reduceMotion) {
        // 1 frame aja kalau user pilih reduce
        cancelAnimationFrame(raf.current);
        return;
      }
      raf.current = requestAnimationFrame(step);
    };

    running.current = true;
    raf.current = requestAnimationFrame(step);

    return () => {
      running.current = false;
      cancelAnimationFrame(raf.current);
      document.removeEventListener('visibilitychange', onVis);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
