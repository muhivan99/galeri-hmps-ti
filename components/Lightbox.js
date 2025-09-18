// components/Lightbox.js
'use client';
import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ items = [], index = -1, onClose, onIndex }) {
  const open = index >= 0 && index < items.length;
  const overlayRef = useRef(null);

  // Body scroll lock + key controls
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

  if (!open) return null;
  const curr = items[index];

  const prev = () => onIndex?.((index - 1 + items.length) % items.length);
  const next = () => onIndex?.((index + 1) % items.length);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onMouseDown={(e) => {
        // close kalau klik area overlay (bukan konten)
        if (e.target === overlayRef.current) onClose?.();
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Tutup"
        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/40 text-white hover:bg-black/60"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev/Next */}
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

      {/* Frame gambar: fit viewport */}
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
        {(curr.title || curr.desc) && (
          <figcaption className="mt-3 text-center text-sm text-white/90">
            {curr.title || curr.desc}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
