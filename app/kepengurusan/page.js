import Section from '@/components/Section';
import Leadership from '@/components/Leadership';
import MemberSearch from '@/components/MemberSearch';
import { getAllData } from '@/lib/cms';

export const metadata = { title: 'Kepengurusan — Komunitas Aksi Pentur' };
export const revalidate = 3600;

export default async function Page(){
  const data = await getAllData();
  return (
    <main>
      <Section id="lead" title="Kepengurusan Inti" icon="users">
        <Leadership items={data.leadership} />
      </Section>
      <Section id="anggota" title="Cari Anggota Divisi" icon="sparkles" intro="Ketik nama/jabatan untuk mencari anggota dari semua divisi. Klik hasil untuk detail.">
        <MemberSearch divisions={data.divisions} />
      </Section>
    </main>
  );
}
