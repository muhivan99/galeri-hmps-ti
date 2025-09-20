'use client';
import { useMemo, useState } from 'react';
import SmartImage from '@/components/SmartImage';
import Modal from '@/components/Modal';
import { Search } from 'lucide-react';

export default function FacultyGrid({ head, lecturers }) {
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return lecturers;
    return lecturers.filter((d) =>
      [d.name, d.field, d.title, d.bio].join(' ').toLowerCase().includes(s)
    );
  }, [q, lecturers]);

  return (
    <>
      {/* Kaprodi highlight */}
      <div className="card-surface p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
        <SmartImage
          src={head.photo}
          alt={head.name}
          width={140}
          height={140}
          className="h-36 w-36 rounded-2xl object-cover"
        />
        <div className="flex-1">
          <div className="text-sm text-cyan-300 font-medium">{head.title}</div>
          <h3 className="text-2xl font-semibold">{head.name}</h3>
          <div className="text-muted mt-1">{head.field}</div>
          <p className="text-muted mt-3">{head.bio}</p>
          {head.email && (
            <a
              href={`mailto:${head.email}`}
              className="inline-block mt-3 text-sm px-3 py-1.5 rounded-full bg-white/10 border border-white/15 hover:bg-white/15"
            >
              {head.email}
            </a>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mt-6 flex items-center gap-2 card-surface px-3 py-2">
        <Search className="h-4 w-4 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari dosen: nama / bidang / deskripsi"
          className="w-full bg-transparent outline-none text-sm"
          aria-label="Cari dosen"
        />
      </div>

      {/* Grid dosen */}
      <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((d) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setSelected(d)}
            className="text-left card-surface p-4 hover:translate-y-[-2px] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <div className="flex items-center gap-4">
              <SmartImage
                src={d.photo}
                alt={d.name}
                width={72}
                height={72}
                className="h-18 w-18 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <div className="text-sm text-cyan-300">{d.title}</div>
                <div className="font-semibold leading-tight truncate">{d.name}</div>
                <div className="text-xs text-muted truncate">{d.field}</div>
              </div>
            </div>
            {d.bio && <p className="text-sm text-muted mt-3 line-clamp-3">{d.bio}</p>}
          </button>
        ))}
      </div>

      {/* Modal detail */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="flex items-start gap-4">
            <SmartImage
              src={selected.photo}
              alt={selected.name}
              width={104}
              height={104}
              className="h-26 w-26 rounded-xl object-cover"
            />
            <div>
              <div className="text-sm text-cyan-300">{selected.title}</div>
              <div className="font-semibold text-lg">{selected.name}</div>
              <div className="text-sm text-muted">{selected.field}</div>
              {selected.bio && <p className="text-sm text-muted mt-2">{selected.bio}</p>}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
