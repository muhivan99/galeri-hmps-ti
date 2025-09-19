// app/about/page.js
import {
  Cpu, BookOpen, Building2, Server, DoorOpen, ShieldCheck, CheckCircle2, CalendarClock
} from 'lucide-react';

export const metadata = { title: 'Tentang HMPS TI' };

const timeline = [
  { year: '2018', title: 'Pembentukan Awal', desc: 'HMPS TI berdiri sebagai wadah kolaborasi, pengabdian masyarakat, dan pengembangan skill teknologi.' },
  { year: '2020', title: 'Digitalisasi Arsip', desc: 'Mulai menerapkan pengelolaan dokumen & inventaris berbasis cloud agar rapi dan mudah dilacak.' },
  { year: '2022', title: 'Sistem Kegiatan & Gallery', desc: 'Dokumentasi kegiatan dipublikasikan terstruktur dengan metadata kategori & deskripsi.' },
  { year: '2024', title: 'Standardisasi Operasional', desc: 'Alur peminjaman, jadwal piket, dan SOP sekretariatan disusun agar operasional makin tertib.' },
];

const rules = [
  'Jam akses 08.00–21.00 (di luar itu wajib izin pengurus inti).',
  'Kunci ruang dipinjam via pengurus jaga; catat nama, keperluan, dan waktu keluar/masuk.',
  'Jaga kebersihan: meja rapi, sampah dibuang, kabel tidak berserakan.',
  'Perangkat (PC/monitor/alat elektronik) hanya untuk kegiatan organisasi—login gunakan akun organisasi.',
  'Peminjaman inventaris wajib di-entry pada buku/lembar peminjaman dan dikembalikan sesuai tenggat.',
  'Makanan/minuman jauhkan dari perangkat; gunakan area makan yang disediakan.',
  'Hemat listrik: matikan AC, lampu, dan perangkat setelah dipakai.',
  'Tamu/visitor wajib didampingi anggota; dilarang membawa barang non-izin masuk ke ruang.',
  'Piket bertanggung jawab terhadap kebersihan harian dan checklist peralatan.',
  'Keadaan darurat: amankan listrik utama, evakuasi sesuai denah, lalu hubungi pengurus inti.',
];

export default function AboutPage() {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-8 sm:pt-12">
        <p className="text-sm text-muted flex items-center gap-2">
          <CalendarClock className="h-4 w-4" /> Versi ringkas • mengikuti tema gelap/terang
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold">
          Tentang <span className="neon-text">HMPS Teknik Informatika</span>
        </h1>
        <p className="mt-3 text-muted max-w-3xl">
          Organisasi mahasiswa yang bergerak di bidang teknologi, kolaborasi, dan pengabdian.
          Fokus kami: budaya belajar yang sustainable, eksekusi kegiatan yang rapi, dan dokumentasi yang dapat dilacak.
        </p>

        <div className="mt-6 grid sm:grid-cols-3 gap-3">
          {[
            { icon: <BookOpen/>, k: 'Sejarah', v: '2018–sekarang' },
            { icon: <ShieldCheck/>, k: 'SOP & Dokumen', v: 'Tertata' },
            { icon: <Cpu/>, k: 'Fokus', v: 'Teknologi & Sosial' },
          ].map((s,i)=>(
            <div key={i} className="card-surface p-4 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 text-cyan-300">{s.icon}</div>
              <div>
                <div className="text-sm text-muted">{s.k}</div>
                <div className="text-lg font-semibold">{s.v}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="container mx-auto px-4 mt-10 sm:mt-14">
        <h2 className="text-2xl font-semibold">Sejarah Singkat</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {timeline.map((t,i)=>(
            <div key={i} className="card-surface p-5">
              <div className="flex items-center gap-2">
                <span className="text-sm px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 border border-white/15">
                  {t.year}
                </span>
                <span className="font-semibold">{t.title}</span>
              </div>
              <p className="text-muted mt-2">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fasilitas */}
      <section className="container mx-auto px-4 mt-10 sm:mt-14">
        <h2 className="text-2xl font-semibold">Fasilitas Organisasi</h2>
        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <div className="card-surface p-5">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="text-cyan-300"/> <span className="font-semibold">Ruang Kesekretariatan</span>
            </div>
            <ul className="text-muted list-disc ml-5 space-y-1">
              <li>Meja rapat kecil, whiteboard, rak arsip, loker kunci.</li>
              <li>Area dokumentasi & backdrop sederhana.</li>
              <li>Sirkulasi listrik aman; multi–power outlet bersertifikasi.</li>
            </ul>
          </div>

          <div className="card-surface p-5">
            <div className="flex items-center gap-2 mb-2">
              <Server className="text-cyan-300"/> <span className="font-semibold">Perlengkapan IT</span>
            </div>
            <ul className="text-muted list-disc ml-5 space-y-1">
              <li>PC/monitor untuk desain, laporan, dan pengarsipan.</li>
              <li>Perangkat foto dasar & tool dokumentasi kegiatan.</li>
              <li>NAS/Cloud untuk backup & kolaborasi dokumen.</li>
            </ul>
          </div>

          <div className="card-surface p-5">
            <div className="flex items-center gap-2 mb-2">
              <DoorOpen className="text-cyan-300"/> <span className="font-semibold">Akses & Operasional</span>
            </div>
            <ul className="text-muted list-disc ml-5 space-y-1">
              <li>Log peminjaman inventaris & kunci terpusat.</li>
              <li>Jadwal piket & checklist peralatan harian.</li>
              <li>Formulir online untuk keperluan administrasi.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Peraturan */}
      <section className="container mx-auto px-4 mt-10 sm:mt-14 mb-16">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-cyan-300"/><h2 className="text-2xl font-semibold">Peraturan Ruang Kesekretariatan</h2>
        </div>
        <p className="text-muted mt-2 max-w-3xl">
          Peraturan ini untuk memastikan ruang aman, nyaman, dan terpakai efisien. Pelanggaran berulang akan dibahas bersama pengurus inti.
        </p>
        <div className="card-surface mt-4 p-5">
          <ul className="grid sm:grid-cols-2 gap-3">
            {rules.map((r,i)=>(
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-400"/>
                <span className="text-sm leading-relaxed">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
