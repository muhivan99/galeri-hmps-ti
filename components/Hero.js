// components/Hero.js
import ParallaxLayers from '@/components/ParallaxLayers';

export default function Hero({ stats }) {
  return (
    <header className="relative overflow-hidden">
      <ParallaxLayers />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-white">
            <span className="neon-text">Galeri Kegiatan & Struktur Organisasi</span><br />
            <span className="text-slate-300">Dari Mahasiswa, untuk warga bergerak nyata.</span>
          </h1>

          <p className="max-w-2xl mt-4 text-slate-300/90">
            Di sini, setiap ide dihargai, setiap algoritma diperdebatkan, dan setiap solusi diciptakan bersama.
          </p>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Stat label="Kegiatan" value={stats.kegiatan} />
            <Stat label="Pengurus Inti" value={stats.pengurus} />
            <Stat label="Divisi" value={stats.divisi} />
            <Stat label="Anggota" value={stats.anggota} />
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl p-4 text-center bg-white/5 backdrop-blur border border-white/10 neon-ring">
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}
