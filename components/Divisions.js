'use client';
import SmartImage from '@/components/SmartImage';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import Modal from '@/components/Modal';

export default function Divisions({ items }) {
  const [open, setOpen] = useState(null);
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="space-y-3">
        {items.map((d, idx) => {
          const isOpen = open === idx;
          return (
            <div key={d.name} className="card-surface overflow-hidden">
              {/* header row */}
              <button
                onClick={() => setOpen(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between group
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
              >
                <div>
                  <div className="font-semibold title-strong">{d.name}</div>
                  <div className="text-sm text-muted">{d.desc}</div>
                </div>

                <ChevronRight
                  className={`h-5 w-5 transition-transform
                              text-muted group-hover:text-[var(--neon2)]
                              ${isOpen ? 'rotate-90' : ''}`}
                />
              </button>

              {/* panel anggota */}
              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {d.members.map((m, i) => (
                    <button
                      key={`${d.name}-${i}-${m.name}`}
                      type="button"
                      onClick={() => setSelected(m)}
                      className="card-surface p-4 text-left flex items-center gap-4
                                 hover:-translate-y-0.5 transition
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                    >
                      <SmartImage
                        src={m.photo}
                        alt={m.name}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <div className="title-strong font-medium leading-tight truncate">
                          {m.name}
                        </div>
                        <div className="text-sm text-muted truncate">
                          {m.role}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
