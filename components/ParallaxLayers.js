'use client';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxLayers(){
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 80]);
  const y2 = useTransform(scrollY, [0, 600], [0, 140]);
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div style={{ y: y1 }} className="absolute -top-32 -left-24 h-96 w-96 rounded-full blur-[120px] bg-[var(--neon1)]/35" />
      <motion.div style={{ y: y2 }} className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full blur-[140px] bg-[var(--neon2)]/30" />
    </div>
  );
}
