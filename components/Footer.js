'use client';
import { useState } from 'react';
import LogoPlanetOrbit from '@/components/LogoPlanetOrbit';

export default function Footer(){
  return (
    <footer id="kontak" className="border-t border-white/10 py-12">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
        <div>
          <div className="font-semibold mb-2 neon-text">HMPS Teknik Informatika</div>
          <p className="text-slate-400 text-sm">Kolaborasi, donasi, atau liputan kegiatan? Kirim pesan melalui formulir.</p>
  
     {/* LOGO DI SINI */}
  <div className="mt-4 flex items-center gap-4">
    <LogoPlanetOrbit
      src="/logos/organisasi.png"  // ganti sesuai file kamu
      alt="Logo Organisasi"
      size={132}
      particles={56}
      speed={0.65}
      inner={0.36}
      outer={0.92}
      tiltDeg={28}
      ellip={0.62}
    />
    <LogoPlanetOrbit
      src="/logos/kampus.png"      // ganti sesuai file kamu
      alt="Logo Kampus"
      size={132}
      particles={52}
      speed={0.6}
      inner={0.38}
      outer={0.95}
      tiltDeg={-28}
      ellip={0.62}
    />
  </div>
</div>
        
        </div>
        <div className="text-slate-300 text-sm">
          <div className="font-medium text-white/90 mb-2">Kontak</div>
          <div>Email: hmjtiunwidha@gmail.com</div>
          <div>@hmpsti.unwidha ( Instagram) ( TikTok ) ( Facebook ) ( Linktree )</div>
          <div>Alamat : Jalan Ki Hajar Dewantara, Desa Karanganom, 
          Kecamatan Klaten Utara, Kabupaten Klaten, Jawa Tengah.</div>
        </div>
        <ContactForm />
      </div>
    </footer>
  );
}

function ContactForm(){
  const [state, setState] = useState({ status: 'idle', msg: '' });
  const onSubmit = async (e)=>{
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState({ status: 'loading', msg: '' });
    try{
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok){
        setState({ status: 'ok', msg: 'Pesan terkirim. Terima kasih!' });
        form.reset();
      } else {
        setState({ status: 'err', msg: 'Gagal mengirim. Coba lagi nanti.' });
      }
    }catch{
      setState({ status: 'err', msg: 'Jaringan bermasalah. Coba lagi.' });
    }
  };
  return (
    <form action="https://formspree.io/f/your_form_id" method="POST" onSubmit={onSubmit} className="space-y-2">
      <input name="nama" placeholder="Nama" className="w-full px-3 py-2 rounded-lg bg-white/10 outline-none" required />
      <input name="email" type="email" placeholder="Email" className="w-full px-3 py-2 rounded-lg bg-white/10 outline-none" required />
      <textarea name="pesan" placeholder="Pesan" className="w-full px-3 py-2 rounded-lg bg-white/10 outline-none" rows="3" required />
      <button disabled={state.status==='loading'} className="px-4 py-2 rounded-xl bg-gradient-to-r from-[var(--neon1)] to-[var(--neon2)] text-slate-900 font-medium disabled:opacity-70">
        {state.status==='loading'? 'Mengirim...' : 'Kirim'}
      </button>
      {state.msg && <div className={`text-sm ${state.status==='ok'?'text-emerald-300':'text-rose-300'}`}>{state.msg}</div>}
    </form>
  );
}
