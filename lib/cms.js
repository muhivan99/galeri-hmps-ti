// lib/cms.js (strict autoscan)
import { getLocalGallery } from '@/lib/gallery-local';

export async function getAllData(){
  const { leadership } = await import('@/data/leadership.json');
  const { divisions } = await import('@/data/divisions.json');
  const gallery = getLocalGallery(); // kalau folder kosong, ya kosong
  return { gallery, leadership, divisions };
}
