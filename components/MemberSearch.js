// components/MemberSearch.js
'use client';
import { useMemo, useState } from 'react';
import SmartImage from '@/components/SmartImage';
import Modal from '@/components/Modal';

export default function MemberSearch({ divisions }) {
  const allMembers = useMemo(
    () => divisions.flatMap(d => d.members.map(m => ({ ...m, division: d.name }))),
    [divisions]
  );
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState(null);

  const res = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return allMembers;
    return allMembers.filter(m =>
      [m.name, m.role, m.division].join(' ').toLowerCase().includes(s)
    );
  }, [q, allMembers]);

  return (
    <div>
      {/* INPUT: surface + warna ikut tema */}
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Cari nama / jabatan / divisi"
        aria-label="Cari anggota"
        className="
          w-full mb-4 px-3 py-2 rounded-lg
          bg-[var(--card)] border border-[var(--cardBorder)] backdrop-blur
          text-[var(--text)] placeholder:text-[var(--muted)]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
        "
      />

      {/* GRID HASIL */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {res.map(m => (
          <button
            key={`${m.name}-${m.division}`}
            type="button"
            onClick={() => setSelected(m)}
            className="
              card-surface p-4 text-left
              hover:-translate-y-0.5 transition
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
            "
          >
            <div className="flex items-center gap-4">
              {m.photo && (
                <SmartImage
                  src={m.photo}
                  alt={m.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-xl object-cover"
                />
              )}
              <div className="min-w-0">
                <div className="title-strong font-medium leading-tight truncate">
                  {m.name}
                </div>
                <div className="text-sm text-muted truncate">{m.role}</div>
                <div className="text-xs text-muted mt-1 truncate">{m.division}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* MODAL DETAIL */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="flex items-center gap-4">
            {selected.photo && (
              <SmartImage
                src={selected.photo}
                alt={selected.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-xl object-cover"
              />
            )}
            <div className="min-w-0">
              <div className="title-strong text-lg font-semibold truncate">
                {selected.name}
              </div>
              <div className="text-muted truncate">{selected.role}</div>
              <div className="text-sm text-muted truncate">{selected.division}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
