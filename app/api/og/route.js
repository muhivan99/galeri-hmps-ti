import { ImageResponse } from 'next/server';
export const runtime = 'edge';

export async function GET(req){
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Komunitas Aksi Pentur';
  return new ImageResponse(
    (
      <div style={{ height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0b1022,#0d1b2a)' }}>
        <div style={{ fontSize: 72, fontWeight: 700, color: 'white', letterSpacing: -1 }}>
          <span style={{ background: 'linear-gradient(90deg,var(--neon1),var(--neon2),var(--neon3))', WebkitBackgroundClip: 'text', color: 'transparent' }}>{title}</span>
        </div>
      </div>
    ), { width: 1200, height: 630 }
  );
}
