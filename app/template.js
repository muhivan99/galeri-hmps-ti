'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function Template({ children }){
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0, transition: { duration: .25 } }}
        exit={{ opacity: 0, y: -8, transition: { duration: .18 } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
