'use client';
import SmartImage from '@/components/SmartImage';
import { useMemo, useState, useEffect, useRef } from 'react';
import Lightbox from '@/components/Lightbox';

function uniqueCategories(items){
  return Array.from(new Set(items.map(i=>i.category))).sort();
}

export default function Gallery({ items, enableFilters=false, paginate=false }){
  const cats = useMemo(()=> uniqueCategories(items), [items]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [lbIndex, setLbIndex] = useState(-1);

  const allFiltered = useMemo(()=> {
    if (!enableFilters || selectedCats.length===0) return items;
    return items.filter(i=> selectedCats.includes(i.category));
  }, [items, enableFilters, selectedCats]);

  const [visible, setVisible] = useState(paginate ? 12 : allFiltered.length);
  const loadMoreRef = useRef(null);
  useEffect(()=>{ setVisible(paginate ? 12 : allFiltered.length); setLbIndex(-1); }, [allFiltered, paginate]);
  useEffect(()=>{
    if (!paginate) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setVisible(v => Math.min(v + 9, allFiltered.length)); });
    });
    if (loadMoreRef.current) io.observe(loadMoreRef.current);
    return ()=> io.disconnect();
  }, [allFiltered, paginate]);

  const gridItems = allFiltered.slice(0, visible);

  return (
    <div>
      {enableFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {cats.map(cat => {
            const active = selectedCats.includes(cat);
            return (
              <button key={cat} onClick={()=> setSelectedCats(active? selectedCats.filter(c=>c!==cat): [...selectedCats, cat])}
                className={`px-4 py-2 rounded-full text-sm ${active? 'bg-gradient-to-r from-[var(--neon1)] to-[var(--neon2)] text-slate-900':'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                {cat}
              </button>
            );
          })}
          {selectedCats.length>0 && (
            <button onClick={()=> setSelectedCats([])} className="px-3 py-2 rounded-full text-sm bg-white/10">Reset</button>
          )}
        </div>
      )}

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {gridItems.map((g, idx)=> (
          <figure key={g.id} className="mb-4 break-inside-avoid">
            <button onClick={()=> setLbIndex(idx)} className="block w-full text-left cursor-zoom-in">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 hover:scale-[1.01] transition-transform">
                <SmartImage src={g.src} alt={g.title} width={900} height={600} className="w-full h-auto object-cover" />
                <figcaption className="absolute bottom-0 left-0 right-0 p-3 text-white/90 text-sm flex items-center justify-between bg-gradient-to-t from-black/60 via-black/10 to-transparent">
                  <span>{g.title}</span>
                  <span className="text-cyan-300 text-xs px-2 py-0.5 rounded-full bg-white/10">{g.category}</span>
                </figcaption>
              </div>
            </button>
          </figure>
        ))}
      </div>

      {paginate && visible < allFiltered.length && (
        <div ref={loadMoreRef} className="h-10 grid place-items-center text-slate-400 text-sm mt-4">Memuat lagi…</div>
      )}

      {lbIndex >= 0 && (
        <Lightbox items={gridItems} index={lbIndex} onClose={()=> setLbIndex(-1)} onIndex={setLbIndex} />
      )}
    </div>
  );
}
