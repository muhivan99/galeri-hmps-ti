export async function getAllData(){
  const cmsUrl = process.env.CMS_JSON_URL;
  if (cmsUrl){
    try{
      const res = await fetch(cmsUrl, { next: { revalidate: 3600 } });
      const json = await res.json();
      if (json.gallery && json.leadership && json.divisions) return json;
    } catch(e){ console.error('CMS fetch fail, fallback local', e); }
  }
  const { gallery } = await import('@/data/gallery.json');
  const { leadership } = await import('@/data/leadership.json');
  const { divisions } = await import('@/data/divisions.json');
  return { gallery, leadership, divisions };
}
