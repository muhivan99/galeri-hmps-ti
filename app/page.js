import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Gallery from '@/components/Gallery';
import Leadership from '@/components/Leadership';
import Divisions from '@/components/Divisions';
import { getAllData } from '@/lib/cms';

export const revalidate = 3600;

export default async function Page(){
  const data = await getAllData();
  return (
    <>
      <Hero stats={{
        kegiatan: data.gallery.length,
        pengurus: data.leadership.length,
        divisi: data.divisions.length,
        anggota: data.divisions.reduce((a,d)=>a+d.members.length,0)
      }} />

      <Section id="galeri" title="Galeri Kegiatan" icon="camera" intro="Klik foto untuk melihat detail. Filter lengkap di halaman Galeri.">
        <Gallery items={data.gallery.slice(0,9)} />
      </Section>

      <Section id="kepengurusan" title="Kepengurusan Inti" icon="users" intro="Bupati, Wakil, Sekretaris, Bendahara. Klik kartu untuk detail.">
        <Leadership items={data.leadership} />
      </Section>

      <Section id="divisi" title="Divisi & Anggota" icon="sparkles" intro="Buka panel untuk melihat daftar lengkap. Klik anggota untuk detail.">
        <Divisions items={data.divisions} />
      </Section>
    </>
  );
}
