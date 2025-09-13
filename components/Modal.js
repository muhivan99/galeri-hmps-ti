'use client';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function isIOS(){
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iP(ad|hone|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export default function Modal({ open, onClose, title, children }){
  const dialogRef = useRef(null);
  const lastFocus = useRef(null);
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      setTimeout(() => {
        const el = dialogRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        el?.focus();
      }, 0);
    } else if (lastFocus.current instanceof HTMLElement) {
      lastFocus.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
      if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const arr = Array.from(nodes || []);
        if (arr.length === 0) return;
        const first = arr[0]; const last = arr[arr.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);

    // Scroll lock (iOS-safe)
    if (isIOS()){
      scrollYRef.current = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = '0'; document.body.style.right = '0'; document.body.style.width = '100%';
    } else {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev || ''; };
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollYRef.current || 0);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 p-6 grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-0 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            ref={dialogRef}
            onClick={(e)=>e.stopPropagation()}
            role="dialog" aria-modal="true" aria-label={title}
            className="relative w-full max-w-lg rounded-2xl bg-white/5 backdrop-blur border border-white/10"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-white/90 font-medium">{title}</h3>
              <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-white/10" aria-label="Tutup">
                <X className="h-5 w-5 text-white/80" />
              </button>
            </div>
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
