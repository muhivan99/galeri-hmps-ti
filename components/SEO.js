import Script from 'next/script';
export default function SEO(){
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Komunitas Aksi Pentur",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    "logo": "/icon-192.png"
  };
  const umamiSrc = process.env.NEXT_PUBLIC_UMAMI_SRC;
  const umamiId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  return (
    <>
      <Script id="schema-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      {umamiSrc && umamiId && (
        <Script async defer src={umamiSrc} data-website-id={umamiId} />
      )}
    </>
  );
}
