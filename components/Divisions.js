'use client';
import SmartImage from '@/components/SmartImage';
import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Modal from '@/components/Modal';

export default function Divisions({ items }){
  const [open, setOpen] = useState(null);
  const [selected, setSelected] = useState(null);
  return (
    <>
      <div className="space-y-3">
        {items.map((d, idx)=> {
          const isOpen = open === idx;
          return (
            <div key={d.name} className="rounded-2xl overflow-hidden bg-white/5 border border-white/10">
              <button onClick={()=> setOpen(isOpen? null: idx)} className="w-full flex items-center justify-between p-4 text-left">
                <div>
                  <div className="text-white/90 font-medium">{d.name}</div>
                  <div className="text-slate-400 text-sm">{d.desc}</div>
                </div>
                {isOpen? <ChevronDown className="text-cyan-300"/>: <ChevronRight className="text-cyan-300"/>}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {d.members.map(m => (
                    <button key={m.name} type="button" onClick={()=> setSelected(m)}
                      className="text-left rounded-2xl p-4 flex items-center gap-4 bg-white/5 border border-white/10 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
                      <SmartImage src={m.photo} alt={m.name} width={64} height={64} className="h-16 w-16 rounded-xl object-cover" />
                      <div>
                        <div className="text-white/90 font-medium leading-tight">{m.name}</div>
                        <div className="text-fuchsia-300/90 text-sm">{m.role}</div>
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
