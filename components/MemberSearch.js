// components/MemberSearch.js
'use client';
import { useMemo, useState } from 'react';
import SmartImage from '@/components/SmartImage';
import Modal from '@/components/Modal';

export default function MemberSearch({ divisions }){
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
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Cari nama / jabatan / divisi"
        className="w-full mb-4 px-3 py-2 rounded-lg bg-white/10 outline-none"
        aria-label="Cari anggota"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {res.map(m => (
          <button
            key={`${m.name}-${m.division}`}
            type="button"
            onClick={() => setSelected(m)}
            className="text-left rounded-2xl p-4 bg-white/5 border border-white/10 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
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
              <div>
                <div className="text-white/90 font-medium leading-tight">{m.name}</div>
                <div className="text-fuchsia-300/90 text-sm">{m.role}</div>
                <div className="text-slate-400 text-xs mt-1">{m.division}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

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
            <div>
              <div className="text-white/90 text-lg font-medium">{selected.name}</div>
              <div className="text-fuchsia-300/90">{selected.role}</div>
              <div className="text-slate-400 text-sm">{selected.division}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
