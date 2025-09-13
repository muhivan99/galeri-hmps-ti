# Neon Org Gallery (Next.js) — v4.1 (Mobile Nav Fix + Theme pre-hydrate)

Yang baru di v4.1:
- **Navbar mobile**: hamburger + dropdown animasi, ThemeToggle selalu tampil di HP.
- **Auto-close** menu saat pindah halaman, Esc untuk tutup.
- **Theme pre-hydrate** (`ThemeScript`) supaya tidak FOUC (tema nyala sebelum React mount).
- **SW cache bump** → `kap-static-v3` & `kap-images-v3` agar update cepat kebaca.

## Jalankan lokal
```bash
npm install
npm run dev
```

## Deploy
1. Upload seluruh isi folder ini ke GitHub (Add file → Upload files).
2. Vercel akan auto deploy.
3. Di HP, lakukan **hard refresh**. Jika di-install sebagai PWA: tutup app & buka lagi (atau clear storage) agar SW baru aktif.

## Env opsional
- `NEXT_PUBLIC_SITE_URL` — untuk sitemap/OG absolute URL.
- `CMS_JSON_URL` — URL JSON (Notion/Sheets) bila mau CMS tanpa rebuild.
- `NEXT_PUBLIC_UMAMI_SRC` & `NEXT_PUBLIC_UMAMI_WEBSITE_ID` — analytics.
