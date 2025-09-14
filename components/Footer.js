// components/Footer.js
import LogoPlanetOrbit from '@/components/LogoPlanetOrbit';
import ContactForm from '@/components/ContactForm';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Kolom 1: teks + logo orbit */}
          <div>
            <div className="font-semibold mb-2 neon-text">HMPS Teknik Informatika</div>
            <p className="text-slate-400 text-sm">
              Kolaborasi, donasi, atau liputan kegiatan? Kirim pesan melalui formulir.
            </p>

            {/* Logo kampus & organisasi di bawah kalimat di atas */}
            <div className="mt-4 flex items-center gap-4">
              <LogoPlanetOrbit
                src="/logos/organisasi.png"
                alt="Logo Organisasi"
                size={132}
                particles={56}
                speed={0.65}
                inner={0.36}
                outer={0.92}
                tiltDeg={28}
                ellip={0.62}
              />
              <LogoPlanetOrbit
                src="/logos/kampus.png"
                alt="Logo Kampus"
                size={132}
                particles={52}
                speed={0.6}
                inner={0.38}
                outer={0.95}
                tiltDeg={-28}
                ellip={0.62}
              />
            </div>
          </div>

          {/* Kolom 2: navigasi singkat */}
          <div>
            <h4 className="text-white font-medium mb-2">Navigasi</h4>
            <ul className="text-slate-400 text-sm space-y-1">
              <li><a href="/" className="hover:text-white/90">Home</a></li>
              <li><a href="/galeri" className="hover:text-white/90">Galeri</a></li>
              <li><a href="/kepengurusan" className="hover:text-white/90">Kepengurusan</a></li>
            </ul>
          </div>

          {/* Kolom 3: form kontak */}
          <div>
            <ContactForm />
          </div>
        </div>

        <div className="mt-10 text-xs text-slate-500">
          © {new Date().getFullYear()} HMPS Teknik Informatika. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
