import ParallaxLayers from '@/components/ParallaxLayers';
import LogoOrbitFlow from '@/components/LogoOrbitFlow';

export default function Hero({ stats }){
  return (
    <header className="relative overflow-hidden">
      <ParallaxLayers />
      <div className="container mx-auto px-4 py-16 md:py-24">
      {/* align-start di desktop supaya kolom kanan nempel atas */}
      <div className="grid md:grid-cols-[1fr,360px] items-center md:items-start gap-10">
          {/* kiri: judul + copy + stats */}
          <div>
            <h1 className="text-3xl md:text-5xl font-semibold leading-tight text-white">
              <span className="neon-text">Galeri Kegiatan & Struktur Organisasi</span><br/>
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

          {/* kanan: dua logo orbit tanpa box */}
          <div className="flex items-center justify-center md:justify-end gap-8
            md:self-start md:mt-[32px] lg:mt-[40px]">
          <LogoOrbitFlow
              src="/logos/organisasi.png"
              alt="Logo Organisasi"
              size={184}
              particles={72}
              speed={0.7}
              inner={0.36}   // lebih kecil -> makin “masuk” ke logo
              outer={0.92}
              tiltDeg={35}   // sudut diagonal
              ellip={0.6}    // 0.4-0.8: rasio elips
        />
          <LogoOrbitFlow
              src="/logos/kampus.png"
              alt="Logo Kampus"
              size={184}
              particles={64}
              speed={0.6}
              inner={0.4}
              outer={0.95}
              tiltDeg={-35}  // lawan arah biar kontras
              ellip={0.65}
          />
        </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value }){
  return (
    <div className="rounded-2xl p-4 text-center bg-white/5 backdrop-blur border border-white/10 neon-ring">
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}
