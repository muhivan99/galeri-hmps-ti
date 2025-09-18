'use client';
import { useMemo, useState, useEffect, useRef } from 'react';
import SmartImage from '@/components/SmartImage';
import Lightbox from '@/components/Lightbox';

function uniqueCategories(items){
  return Array.from(new Set(items.map(i => i.category))).sort();
}

export default function Gallery({ items, enableFilters=false, paginate=false }){
  const cats = useMemo(()=> uniqueCategories(items), [items]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [lbIndex, setLbIndex] = useState(-1);

  const allFiltered = useMemo(()=> {
    if (!enableFilters || selectedCats.length === 0) return items;
    return items.filter(i => selectedCats.includes(i.category));
  }, [items, enableFilters, selectedCats]);

  const [visible, setVisible] = useState(paginate ? 12 : allFiltered.length);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    setVisible(paginate ? 12 : allFiltered.length);
    setLbIndex(-1);
  }, [allFiltered, paginate]);

  useEffect(() => {
    if (!paginate) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setVisible(v => Math.min(v + 9, allFiltered.length)); });
    });
    const el = loadMoreRef.current;
    if (el) io.observe(el);
    return () => io.disconnect();
  }, [allFiltered, paginate]);

  const gridItems = allFiltered.slice(0, visible);

  return (
    <div>
      {enableFilters && (
        <div className="flex flex-wrap gap-2 mb-6">
          {cats.map(cat => {
            const active = selectedCats.includes(cat);
            return (
              <button
                key={cat}
                onClick={() =>
                  setSelectedCats(active ? selectedCats.filter(c => c !== cat) : [...selectedCats, cat])
                }
                className={`chip ${active ? 'is-active' : ''}`}
              >
                <span className="text-sm">{cat}</span>
              </button>
            );
          })}
          {selectedCats.length > 0 && (
            <button onClick={() => setSelectedCats([])} className="chip">
              Reset
            </button>
          )}
        </div>
      )}

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {gridItems.map((g, idx) => (
          <figure key={g.id} className="mb-4 break-inside-avoid">
            <button
              onClick={() => setLbIndex(idx)}
              className="block w-full text-left cursor-zoom-in"
              aria-label={`Buka ${g.title}`}
            >
              <div
                className="
                  relative overflow-hidden rounded-2xl
                  border border-[var(--cardBorder)]
                  hover:-translate-y-0.5 transition
                "
              >
                <SmartImage
                  src={g.src}
                  alt={g.title}
                  width={900}
                  height={600}
                  className="w-full h-auto object-cover"
                />
                <figcaption
                  className="
                    absolute bottom-0 left-0 right-0 p-3
                    text-white/95 text-sm flex items-center justify-between
                    bg-gradient-to-t from-black/60 via-black/15 to-transparent
                  "
                >
                  <span className="truncate">{g.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/15 text-white/95 backdrop-blur">
                    {g.category}
                  </span>
                </figcaption>
              </div>
            </button>
          </figure>
        ))}
      </div>

      {paginate && visible < allFiltered.length && (
        <div ref={loadMoreRef} className="h-10 grid place-items-center text-muted text-sm mt-4">
          Memuat lagi…
        </div>
      )}

      {lbIndex >= 0 && (
        <Lightbox items={gridItems} index={lbIndex} onClose={() => setLbIndex(-1)} onIndex={setLbIndex} />
      )}
    </div>
  );
}
