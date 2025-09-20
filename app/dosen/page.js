import faculty from '@/data/faculty.json';
import FacultyGrid from '@/components/FacultyGrid';
import { Users } from 'lucide-react';

export const metadata = { title: 'Dosen Teknik Informatika' };

export default function LecturersPage() {
  const { head, lecturers } = faculty;

  return (
    <main className="relative">
      {/* Hero */}
      <section className="container mx-auto px-4 pt-8 sm:pt-12">
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold">
          Dosen <span className="neon-text">Program Studi Teknik Informatika</span>
        </h1>
        <p className="mt-3 text-muted max-w-3xl">
          Daftar dosen pengajar—lengkap dengan kaprodi, bidang keahlian, dan deskripsi singkat.
          Klik kartu untuk melihat detail ringkas.
        </p>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 mt-8 sm:mt-10 mb-16">
        <FacultyGrid head={head} lecturers={lecturers} />
      </section>
    </main>
  );
}
