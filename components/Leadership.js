'use client';
import SmartImage from '@/components/SmartImage';
import { useState } from 'react';
import Modal from '@/components/Modal';

export default function Leadership({ items }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((p, i) => (
          <button
            key={`${p.role}-${i}`}
            type="button"
            onClick={() => setSelected(p)}
            className="
              card-surface p-4 text-left
              flex items-center gap-4 group
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
            "
          >
            <div className="relative shrink-0">
              <SmartImage
                src={p.photo}
                alt={p.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-xl object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="title-strong font-semibold leading-tight truncate">
                {p.name}
              </div>
              <div className="text-sm text-muted truncate">
                {p.role}
              </div>
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name}>
        {selected && (
          <div className="flex items-center gap-4">
            <SmartImage
              src={selected.photo}
              alt={selected.name}
              width={96}
              height={96}
              className="h-24 w-24 rounded-xl object-cover"
            />
            <div className="min-w-0">
              <div className="title-strong text-lg font-semibold truncate">
                {selected.name}
              </div>
              <div className="text-muted truncate">{selected.role}</div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
