'use client';
import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Lightbox({ items, index, onClose, onIndex }){
  const item = items[index];

  const neighbors = useMemo(()=>{
    if (!items.length) return [];
    return [ (index - 1 + items.length) % items.length, (index + 1) % items.length ];
  }, [index, items.length]);

  useEffect(()=>{
    neighbors.forEach(i => {
      const img = new window.Image();
      img.src = items[i].src;
    });
  }, [neighbors, items]);

  useEffect(()=>{
    const onKey = (e)=>{
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onIndex((index - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onIndex((index + 1) % items.length);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return ()=>{ document.removeEventListener('keydown', onKey); document.body.style.overflow = prev || ''; };
  }, [index, items.length, onClose, onIndex]);

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 p-4 sm:p-8 grid place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
        <motion.div className="absolute inset-0 bg-black/85" />
        <motion.div
          onClick={(e)=>e.stopPropagation()}
          className="relative w-full max-w-5xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-3"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
        >
          <div className="absolute -top-4 -right-4">
            <button onClick={onClose} className="p-3 rounded-full bg-white/10 hover:bg-white/20" aria-label="Tutup">
              <X />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=> onIndex((index - 1 + items.length) % items.length)} className="p-3 rounded-full bg-white/10 hover:bg-white/20" aria-label="Sebelumnya"><ChevronLeft /></button>
            <motion.div
              key={item.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info)=>{
                if (info.offset.x > 80) onIndex((index - 1 + items.length) % items.length);
                else if (info.offset.x < -80) onIndex((index + 1) % items.length);
              }}
              className="relative flex-1 rounded-xl overflow-hidden"
            >
              <Image src={item.src} alt={item.title} width={1600} height={1000} className="w-full h-auto object-contain" priority />
            </motion.div>
            <button onClick={()=> onIndex((index + 1) % items.length)} className="p-3 rounded-full bg-white/10 hover:bg-white/20" aria-label="Berikutnya"><ChevronRight /></button>
          </div>
          <div className="mt-3 px-1">
            <div className="text-white/90 font-medium">{item.title}</div>
            <div className="text-slate-300 text-sm">{item.desc || `Kategori ${item.category}`}</div>
          </div>
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            {items.map((it, i) => (
              <button key={it.id} onClick={()=> onIndex(i)} className={`rounded-lg border ${i===index ? 'border-cyan-300' : 'border-white/10'} overflow-hidden flex-shrink-0`}>
                <Image src={it.src} alt={it.title} width={96} height={64} className="h-16 w-24 object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
