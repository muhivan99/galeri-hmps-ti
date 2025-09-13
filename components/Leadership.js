'use client';
import SmartImage from '@/components/SmartImage';
import { useState } from 'react';
import Modal from '@/components/Modal';

export default function Leadership({ items }){
  const [selected, setSelected] = useState(null);
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(p => (
          <button
            key={p.role}
            type="button"
            onClick={() => setSelected(p)}
            className="text-left rounded-2xl p-4 flex items-center gap-4 bg-white/5 backdrop-blur border border-white/10 card-glow hover:scale-[1.02] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <div className="relative">
              <SmartImage src={p.photo} alt={p.name} width={64} height={64} className="h-16 w-16 rounded-xl object-cover" />
            </div>
            <div>
              <div className="text-white/90 font-medium leading-tight">{p.name}</div>
              <div className="text-fuchsia-300/90 text-sm">{p.role}</div>
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="flex items-center gap-4">
            <SmartImage src={selected.photo} alt={selected.name} width={96} height={96} className="h-24 w-24 rounded-xl object-cover" />
            <div>
              <div className="text-white/90 text-lg font-medium">{selected.name}</div>
              <div className="text-fuchsia-300/90">{selected.role}</div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
