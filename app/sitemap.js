export default function sitemap(){
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
  return [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/galeri`, lastModified: new Date() },
    { url: `${base}/kepengurusan`, lastModified: new Date() },
  ];
}
