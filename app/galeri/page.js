import Section from '@/components/Section';
import Gallery from '@/components/Gallery';
import { getAllData } from '@/lib/cms';

export const metadata = { title: 'Galeri — Komunitas Aksi Pentur' };
export const revalidate = 3600;

export default async function Page(){
  const { gallery } = await getAllData();
  return (
    <main>
      <Section id="galeri-full" title="Galeri Lengkap" icon="camera" intro="Pilih beberapa kategori, klik gambar untuk membuka lightbox.">
        <Gallery items={gallery} enableFilters paginate />
      </Section>
    </main>
  );
}
