import { Camera, Users, Sparkles } from 'lucide-react';
const icons = { camera: <Camera className="text-cyan-300" />, users: <Users className="text-cyan-300" />, sparkles: <Sparkles className="text-cyan-300" /> };

export default function Section({ id, title, icon, intro, children }){
  return (
    <section id={id} className="relative py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-white/5 to-transparent" />
      <div className="container mx-auto px-4">
        <h2 className="mb-3 text-2xl md:text-3xl font-semibold tracking-tight neon-text inline-flex items-center gap-3">{icons[icon]} {title}</h2>
        {intro && <p className="text-slate-400 max-w-2xl mb-8">{intro}</p>}
        {children}
      </div>
    </section>
  );
}
