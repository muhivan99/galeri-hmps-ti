'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function LogoTech({
  src, alt,
  size = 160,           // ubah kalau mau kotaknya lebih besar
  glow = true,
  glitch = true
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className={`relative isolate group rounded-2xl border border-white/10 bg-white/5 backdrop-blur ${
        glow ? 'neon-card floaty' : ''
      } ${loaded ? '' : 'skeleton'}`}
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

      {/* glitch layers (muncul saat hover) */}
      {glitch && (
        <>
          <img
            aria-hidden
            src={src}
            className="absolute inset-0 opacity-0 group-hover:opacity-70 glitch-r pointer-events-none"
          />
          <img
            aria-hidden
            src={src}
            className="absolute inset-0 opacity-0 group-hover:opacity-60 glitch-b pointer-events-none"
          />
        </>
      )}

      {/* outer neon glow overlay */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none neon-outer-glow" />
    </div>
  );
}
