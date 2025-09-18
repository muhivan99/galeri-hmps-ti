// components/Lightbox.js
'use client';
import { useEffect, useRef, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ items = [], index = -1, onClose, onIndex }) {
  const open = index >= 0 && index < items.length;
  const overlayRef = useRef(null);

  // Ambil item aktif
  const curr = open ? items[index] : null;

  // fallback nama file bila title kosong
  const fileName = useMemo(() => {
    if (!curr) return '';
    if (curr.title) return curr.title;
    const raw = (curr.src || curr.image || curr.url || '').split('?')[0];
    try { return decodeURIComponent(raw.split('/').pop() || ''); }
    catch { return raw.split('/').pop() || ''; }
  }, [curr]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'ArrowLeft') onIndex?.((index - 1 + items.length) % items.length);
      if (e.key === 'ArrowRight') onIndex?.((index + 1) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, index, items.length, onClose, onIndex]);

  if (!open || !curr) return null;

  const prev = () => onIndex?.((index - 1 + items.length) % items.length);
  const next = () => onIndex?.((index + 1) % items.length);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onMouseDown={(e) => { if (e.target === overlayRef.current) onClose?.(); }}
      role="dialog"
      aria-modal="true"
    >
      {/* tombol close */}
      <button
        onClick={onClose}
        aria-label="Tutup"
        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
      >
        <X className="h-5 w-5" />
      </button>

      {/* panah prev/next */}
      {items.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Sebelumnya"
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={next}
            aria-label="Berikutnya"
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* gambar selalu fit viewport */}
      <figure className="relative">
        <img
          src={curr.src || curr.image || curr.url}
          alt={curr.title || curr.desc || 'Foto'}
          draggable="false"
          className="
            block
            max-h-[90vh]
            max-w-[min(92vw,1100px)]
            w-auto h-auto
            object-contain
            rounded-2xl
            shadow-2xl
            bg-black/10
          "
        />

        {/* CAPTION: nama file/judul, kategori, deskripsi */}
        {(fileName || curr.category || curr.desc) && (
          <figcaption
            className="
              mt-3 mx-auto max-w-[min(92vw,1100px)]
              text-center text-white
            "
          >
            {/* Judul / nama file */}
            {fileName && (
              <div className="font-semibold text-base sm:text-lg leading-tight">
                {fileName}
              </div>
            )}

            {/* Kategori (pill) */}
            {curr.category && (
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs sm:text-sm bg-white/15 text-cyan-200 border border-white/20">
                  {curr.category}
                </span>
              </div>
            )}

            {/* Deskripsi */}
            {curr.desc && (
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/85">
                {curr.desc}
              </p>
            )}
          </figcaption>
        )}

        {/* indikator index */}
        <div className="mt-2 text-center text-xs text-white/70">
          {index + 1} / {items.length}
        </div>
      </figure>
    </div>
  );
}
