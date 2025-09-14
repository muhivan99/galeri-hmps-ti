'use client';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <p className="text-slate-400 text-sm">
          Kolaborasi, donasi, atau liputan kegiatan? Kirim pesan melalui formulir.
        </p>
        <div className="mt-10 text-xs text-slate-500">
          © {new Date().getFullYear()} HMPS Teknik Informatika. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
