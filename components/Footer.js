'use client';
import ContactForm from '@/components/ContactForm';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Kolom Alamat / Kontak Langsung */}
          <div>
            <h4 className="text-white font-medium mb-2">Alamat & Kontak</h4>
            <address className="not-italic text-slate-400 text-sm space-y-1">
              <p>HMPS Teknik Informatika</p>
              <p>Jl. Contoh No. 123, Pentur</p>
              <p>Kabupaten / Kota, Provinsi</p>
              <p>Email: <a className="hover:text-white/90" href="mailto:hmps.ti@example.com">hmps.ti@example.com</a></p>
              <p>Instagram: <a className="hover:text-white/90" href="https://instagram.com/username" target="_blank" rel="noreferrer">@username</a></p>
            </address>
          </div>

          {/* Kolom Form Kontak */}
          <div>
            <h4 className="text-white font-medium mb-2">Kirim Pesan</h4>
            <p className="text-slate-400 text-sm mb-3">
              Kolaborasi, donasi, atau liputan kegiatan? Kirim pesan melalui formulir.
            </p>
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
