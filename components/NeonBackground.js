'use client';
import { useEffect, useRef } from 'react';

export default function NeonBackground(){
  const ref = useRef(null);
  const mouse = useRef({ x: -9999, y: -9999 });

  useEffect(()=>{
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const onResize = ()=>{ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; init(); };
    window.addEventListener('resize', onResize);

    const particles = []; const COUNT = Math.min(140, Math.floor((w*h)/18000));
    function init(){
      particles.length = 0;
      for (let i=0; i<COUNT; i++){
        particles.push({
          x: Math.random()*w,
          y: Math.random()*h,
          vx: (Math.random()-0.5)*0.3,
          vy: (Math.random()-0.5)*0.3,
          r: Math.random()*1.8+0.6,
          hue: 280 + Math.random()*80
        });
      }
    }

    let raf;
    function draw(){
      ctx.clearRect(0,0,w,h);
      const g = ctx.createRadialGradient(w*0.7,h*0.3,0,w*0.7,h*0.3,Math.max(w,h));
      g.addColorStop(0,'rgba(124,58,237,0.18)');
      g.addColorStop(1,'rgba(6,182,212,0.06)');
      ctx.fillStyle = g; ctx.fillRect(0,0,w,h);

      for (let i=0;i<particles.length;i++){
        const p = particles[i];
        const dx = p.x - mouse.current.x; const dy = p.y - mouse.current.y; const d2 = dx*dx+dy*dy; const r = 90;
        if (d2 < r*r){
          const d = Math.sqrt(d2)||1; const force = (r-d)/r;
          p.vx += (dx/d)*force*0.7; p.vy += (dy/d)*force*0.7;
        }
        p.x += p.vx; p.y += p.vy; p.vx*=0.995; p.vy*=0.995;
        if (p.x<0) p.x=w; if (p.x>w) p.x=0; if (p.y<0) p.y=h; if (p.y>h) p.y=0;
      }

      ctx.lineWidth = 0.6;
      for (let i=0;i<particles.length;i++){
        for (let j=i+1;j<particles.length;j++){
          const a=particles[i], b=particles[j];
          const dx=a.x-b.x, dy=a.y-b.y; const d2=dx*dx+dy*dy;
          if (d2<120*120){
            ctx.strokeStyle = `rgba(147,197,253,${1 - d2/(120*120)})`;
            ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }

      for (const p of particles){
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = `hsla(${p.hue},90%,60%,0.9)`; ctx.shadowBlur=20; ctx.shadowColor=`hsla(${p.hue},100%,60%,0.8)`; ctx.fill();
      }
      ctx.shadowBlur=0;
      raf = requestAnimationFrame(draw);
    }

    function onMove(e){
      const x = e.touches? e.touches[0].clientX : e.clientX;
      const y = e.touches? e.touches[0].clientY : e.clientY;
      mouse.current.x = x; mouse.current.y = y;
    }

    init(); draw();
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('mousemove', onMove); window.removeEventListener('touchmove', onMove); };
  },[]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10 opacity-90" />;
}
