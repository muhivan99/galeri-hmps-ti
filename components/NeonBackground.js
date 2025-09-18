// components/NeonBackground.js
'use client';
import { useEffect, useRef } from 'react';

/**
 * Tech Constellation + Pulse Beams
 * - Node bergerak slow drift
 * - Garis koneksi adaptif jarak
 * - Beam/packet melintas (gradien neon)
 * - Tema-aware via CSS vars (--bgDot, --bgLine, --neon1/2/3)
 * - Hemat: DPR cap, jumlah node adaptif, pause saat offscreen/hidden
 */
export default function NeonBackground({ zIndex = -20 }) {
  const baseRef = useRef(null);
  const fxRef = useRef(null);
  const rafRef = useRef(0);
  const running = useRef(false);

  useEffect(() => {
    const canvas = baseRef.current;
    const canvasFX = fxRef.current;
    const ctx = canvas.getContext('2d', { alpha: true });
    const ctxFX = canvasFX.getContext('2d', { alpha: true });

    const DPR = Math.min(1.75, globalThis.devicePixelRatio || 1);
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
    const mem = navigator.deviceMemory || 8;

    // ukuran, DPR
    const fit = () => {
      const { innerWidth: W, innerHeight: H } = window;
      [canvas, canvasFX].forEach(c => {
        c.width = Math.floor(W * DPR);
        c.height = Math.floor(H * DPR);
        c.style.width = W + 'px';
        c.style.height = H + 'px';
      });
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctxFX.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    fit();
    const onResize = () => fit();
    window.addEventListener('resize', onResize);

    // jumlah node adaptif
    const baseNodes = isMobile || mem <= 4 ? 60 : 110;

    // warna dari CSS vars (tema-aware)
    const readPalette = () => {
      const css = getComputedStyle(document.documentElement);
      const dot = css.getPropertyValue('--bgDot').trim() || 'rgba(255,255,255,.6)';
      const line = css.getPropertyValue('--bgLine').trim() || 'rgba(255,255,255,.08)';
      const n1 = css.getPropertyValue('--neon1').trim() || '#f0abfc';
      const n2 = css.getPropertyValue('--neon2').trim() || '#67e8f9';
      const n3 = css.getPropertyValue('--neon3').trim() || '#60a5fa';
      return { dot, line, n1, n2, n3 };
    };
    let pal = readPalette();

    // Node/edges
    const nodes = [];
    const rand = (a, b) => a + Math.random() * (b - a);
    const W = () => canvas.width / DPR;
    const H = () => canvas.height / DPR;

    const initNodes = () => {
      nodes.length = 0;
      const N = Math.round(baseNodes * (W() * H()) / (1440 * 900)); // skala layar
      for (let i = 0; i < N; i++) {
        nodes.push({
          x: Math.random() * W(),
          y: Math.random() * H(),
          vx: rand(-0.08, 0.08),
          vy: rand(-0.08, 0.08),
          drift: rand(0.0008, 0.0022),
          a: Math.random() * Math.PI * 2,
          r: rand(0.6, 1.4),
        });
      }
    };
    initNodes();

    // beams (packet melintas)
    const beams = [];
    const spawnBeam = () => {
      if (nodes.length < 2) return;
      const a = nodes[(Math.random() * nodes.length) | 0];
      let b = nodes[(Math.random() * nodes.length) | 0];
      if (a === b) b = nodes[(Math.random() * nodes.length) | 0];

      const speed = rand(0.0040, 0.0075); // 0..1 per frame
      const huePick = Math.random();
      const colorFrom =
        huePick < 0.33 ? pal.n1 : huePick < 0.66 ? pal.n2 : pal.n3;

      beams.push({
        ax: a.x, ay: a.y, bx: b.x, by: b.y,
        t: 0, speed,
        color: colorFrom,
        life: 1 + Math.random() * 1.2
      });
      // keep kecil
      if (beams.length > 16) beams.shift();
    };

    // parallax ringan
    const cursor = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e) => {
      const x = (e.clientX || (e.touches && e.touches[0]?.clientX) || W() / 2) / W() - 0.5;
      const y = (e.clientY || (e.touches && e.touches[0]?.clientY) || H() / 2) / H() - 0.5;
      cursor.tx = x; cursor.ty = y;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });

    // pause saat offscreen/tab hidden
    let visible = true;
    const onVis = () => { visible = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', onVis);
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; });
    io.observe(canvas);

    // main loop
    let tick = 0;
    const frame = () => {
      if (!running.current) return;

      // refresh palette tiap beberapa frame (biar tema-switch kebaca)
      if ((tick++ & 63) === 0) pal = readPalette();

      // lerp cursor
      cursor.x += (cursor.tx - cursor.x) * 0.06;
      cursor.y += (cursor.ty - cursor.y) * 0.06;

      if (!visible) { rafRef.current = requestAnimationFrame(frame); return; }

      ctx.clearRect(0, 0, W(), H());
      ctxFX.clearRect(0, 0, W(), H());

      // update nodes
      for (const n of nodes) {
        n.a += n.drift;
        n.x += n.vx + Math.cos(n.a) * 0.12 + cursor.x * 0.7;
        n.y += n.vy + Math.sin(n.a) * 0.12 + cursor.y * 0.7;

        // wrap (infinite plane)
        if (n.x < -10) n.x = W() + 10; else if (n.x > W() + 10) n.x = -10;
        if (n.y < -10) n.y = H() + 10; else if (n.y > H() + 10) n.y = -10;
      }

      // draw edges + nodes
      const thresh = Math.min(160, Math.max(110, Math.hypot(W(), H()) / 14));
      ctx.lineWidth = 1;
      ctx.strokeStyle = pal.line;
      ctx.fillStyle = pal.dot;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        // edges: koneksi jarak dekat
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < thresh) {
            const alpha = 1 - d / thresh;
            ctx.globalAlpha = alpha * 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // node
        ctx.globalAlpha = 0.9;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // spawn beam kadang2
      if ((Math.random() < (isMobile ? 0.03 : 0.06)) && beams.length < 18) spawnBeam();

      // update + draw beams di canvas FX (di atas garis)
      for (let i = beams.length - 1; i >= 0; i--) {
        const b = beams[i];
        b.t += b.speed;
        b.life -= 0.01;
        if (b.t > 1 || b.life <= 0) { beams.splice(i, 1); continue; }

        const x = b.ax + (b.bx - b.ax) * b.t;
        const y = b.ay + (b.by - b.ay) * b.t;

        // trail
        const trail = 48;
        const dx = (b.bx - b.ax) / trail;
        const dy = (b.by - b.ay) / trail;

        for (let k = 0; k < trail; k++) {
          const px = x - dx * k;
          const py = y - dy * k;
          const fade = (1 - k / trail) * b.life;

          // ring glow
          ctxFX.globalAlpha = 0.75 * fade;
          ctxFX.fillStyle = b.color;
          ctxFX.beginPath();
          ctxFX.arc(px, py, Math.max(0.8, 2.2 * fade), 0, Math.PI * 2);
          ctxFX.fill();
        }
        ctxFX.globalAlpha = 1;
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    running.current = true;
    rafRef.current = requestAnimationFrame(frame);

    // cleanup
    return () => {
      running.current = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      document.removeEventListener('visibilitychange', onVis);
      io.disconnect();
    };
  }, []);

  // dua canvas: base (edges+nodes) & FX (beams)
  const commonClass =
    'pointer-events-none fixed inset-0 w-full h-full';
  return (
    <>
      <canvas ref={baseRef} className={commonClass} style={{ zIndex }} />
      <canvas ref={fxRef} className={commonClass} style={{ zIndex: zIndex + 1, mixBlendMode: 'screen' }} />
    </>
  );
}
