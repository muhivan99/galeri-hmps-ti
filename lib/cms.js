// lib/cms.js
import { getLocalGallery } from '@/lib/gallery-local';

export async function getAllData(){
  // (opsional) CMS JSON eksternal
  const cmsUrl = process.env.CMS_JSON_URL;
  if (cmsUrl){
    try{
      const res = await fetch(cmsUrl, { next: { revalidate: 3600 } });
      const json = await res.json();
      if (json.gallery && json.leadership && json.divisions) return json;
    }catch{ /* fallback */ }
  }

  // Pengurus & divisi tetap dari file lokal
  const { leadership } = await import('@/data/leadership.json');
  const { divisions } = await import('@/data/divisions.json');

  // 1st: auto-scan /public/gallery
  const localGallery = getLocalGallery();
  if (localGallery.length){
    return { gallery: localGallery, leadership, divisions };
  }

  // Fallback: data/gallery.json (biarin ada aja)
  try{
    const { gallery } = await import('@/data/gallery.json');
    return { gallery, leadership, divisions };
  }catch{
    return { gallery: [], leadership, divisions };
  }
}
