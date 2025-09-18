import ParallaxLayers from '@/components/ParallaxLayers';
import dynamic from 'next/dynamic';

// render di client saja
const LogoStardustOrbit = dynamic(() => import('./LogoStardustOrbit'), { ssr: false });

export default function Hero({ stats }) {
  return (
    <header className="relative overflow-hidden">
      <ParallaxLayers />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-[1fr,400px] gap-10">
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-slate-900 dark:text-white">
              <span className="neon-text">Galeri Kegiatan &amp; Struktur Organisasi</span><br />
              <span className="text-slate-600 dark:text-slate-300">Dari Mahasiswa, untuk warga bergerak nyata.</span>
            </h1>
            <p className="max-w-2xl mt-4 text-slate-600 dark:text-slate-300/90">
              Di sini, setiap ide dihargai, setiap algoritma diperdebatkan, dan setiap solusi diciptakan bersama.
            </p>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Stat label="Kegiatan" value={stats.kegiatan} />
              <Stat label="Pengurus Inti" value={stats.pengurus} />
              <Stat label="Divisi" value={stats.divisi} />
              <Stat label="Anggota" value={stats.anggota} />
            </div>
          </div>

          {/* Kanan: logo organisasi + stardust */}
          <div className="hidden md:flex items-center justify-end md:self-center">
            <LogoStardustOrbit
            src="/logos/organisasi.png"
            size={260}
            particles={100}    // ini sudah adaptif mobile otomatis
            comets={1}         // 1 komet cukup, hemat GPU
            speed={0.7}
            inner={0.28}
            outer={0.98}
            tiltDeg={30}
            ellip={0.56}
          />
        </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl p-4 text-center backdrop-blur
                    bg-[var(--card)] dark:bg-white/5
                    border border-black/10 dark:border-white/10 neon-ring">
      <div className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</div>
      <div className="text-slate-600 dark:text-slate-400 text-sm">{label}</div>
    </div>
  );
}
