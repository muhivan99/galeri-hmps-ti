// lib/gallery-local.js
import fs from 'fs';
import path from 'path';

export function getLocalGallery() {
  const pub = path.join(process.cwd(), 'public');
  const base = path.join(pub, 'gallery');
  if (!fs.existsSync(base)) return [];

  // Optional: override judul/desc/kategori via _meta.json
  const metaPath = path.join(base, '_meta.json');
  let meta = {};
  try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')); } catch {}

  let id = 1;
  const out = [];
  const exts = /\.(jpe?g|png|webp|avif)$/i;

  function humanize(s) {
    return s
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function pushItem(absPath, relFromPublic, categoryGuess = '') {
    const file = path.basename(absPath);

    // Default title & category
    let title = humanize(file);
    let category = categoryGuess || 'Umum';

    // Pola nama file: "Kategori__Judul-Foto.jpg"
    const nameNoExt = file.replace(/\.[^.]+$/, '');
    if (nameNoExt.includes('__')) {
      const [cat, rest] = nameNoExt.split('__');
      if (cat && rest) {
        category = cat;
        title = humanize(rest);
      }
    }

    // Override dari _meta.json (by "filename" atau "Folder/filename")
    const key1 = file;
    const key2 = categoryGuess ? `${categoryGuess}/${file}` : null;
    const ov = (key2 && meta[key2]) || meta[key1] || {};

    out.push({
      id: id++,
      title: ov.title || title,
      category: ov.category || category,
      src: `/${relFromPublic.replace(/\\\\/g, '/')}`,
      desc: ov.desc || ''
    });
  }

  function walk(dir, cat = '') {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.name.startsWith('.')) continue;
      const abs = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        walk(abs, ent.name); // nama folder = kategori
      } else if (exts.test(ent.name)) {
        const rel = path.relative(pub, abs);
        pushItem(abs, rel, cat);
      }
    }
  }

  walk(base);
  return out;
}
