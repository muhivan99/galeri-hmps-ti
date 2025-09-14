'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';

export default function LogoTech({
  src, alt,
  size = 168,
  effects = ['glow','shine','scanlines','tilt','aura','ripple'] // pilih sebagian juga boleh
}) {
  const boxRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const has = (k) => effects.includes(k);

  function onMove(e){
    if (!boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;

    // buat ripple & highlight
    boxRef.current.style.setProperty('--mx', `${x}px`);
    boxRef.current.style.setProperty('--my', `${y}px`);

    // 3D tilt
    const rx = ((x / r.width) - 0.5) * 12;   // rotateY
    const ry = -((y / r.height) - 0.5) * 12; // rotateX
    boxRef.current.style.setProperty('--rx', has('tilt') ? `${rx}deg` : '0deg');
    boxRef.current.style.setProperty('--ry', has('tilt') ? `${ry}deg` : '0deg');
  }
  function onLeave(){
    if (!boxRef.current) return;
    boxRef.current.style.setProperty('--rx', '0deg');
    boxRef.current.style.setProperty('--ry', '0deg');
  }

  return (
    <div
      ref={boxRef}
      onMouseMove={(has('tilt') || has('ripple')) ? onMove : undefined}
      onMouseLeave={onLeave}
      onTouchMove={(has('ripple')) ? onMove : undefined}
      className={[
        'logo-wrap group relative isolate rounded-2xl border border-white/10 bg-white/5 backdrop-blur',
        loaded ? '' : 'skeleton',
        has('glow') ? 'logo-glow' : '',
        has('shine') ? 'logo-shine' : '',
        has('scanlines') ? 'logo-scan' : '',
        has('aura') ? 'logo-aura' : '',
        has('tilt') ? 'logo-tilt' : ''
      ].join(' ')}
      style={{ width: size, height: size }}
      aria-label={alt}
      role="img"
    >
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="object-contain p-4 w-full h-full"
        onLoadingComplete={() => setLoaded(true)}
        priority
      />

      {/* ripple spotlight */}
      {has('ripple') && <span aria-hidden className="logo-ripple" />}

      {/* neon outer glow */}
      {has('glow') && <span aria-hidden className="logo-outer" />}
    </div>
  );
}
