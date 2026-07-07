import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import PageViewTracker from '@/components/PageViewTracker';
import HomeTabs from '@/components/HomeTabs';

export const revalidate = 0;

export const metadata = {
  title: 'Unnaidee — ของดีที่แนะนำ',
  description: 'คัดของดีจาก Shopee มาให้แล้ว ใช้จริง รู้จริง',
};

const SOCIALS = [
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@Unnaidee',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
      </svg>
    ),
    color: '#FF0000',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/unnaideee/',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.2c3.2 0 3.6 0 4.9.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8 0 3.2 0 3.6-.1 4.8-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.9.1-3.2 0-3.6 0-4.8-.1-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12c0-3.2 0-3.6.1-4.8C2.4 3.9 4 2.3 7.2 2.3c1.2-.1 1.6-.1 4.8-.1zM12 0C8.7 0 8.3 0 7.1.1 2.7.3.3 2.7.1 7.1.0 8.3 0 8.7 0 12c0 3.3 0 3.7.1 4.9.2 4.4 2.6 6.8 7 7C8.3 24 8.7 24 12 24c3.3 0 3.7 0 4.9-.1 4.4-.2 6.8-2.6 7-7 .1-1.2.1-1.6.1-4.9 0-3.3 0-3.7-.1-4.9C23.7 2.7 21.3.3 16.9.1 15.7 0 15.3 0 12 0zm0 5.8a6.2 6.2 0 1 0 0 12.4A6.2 6.2 0 0 0 12 5.8zm0 10.2a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.4-11.8a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"/>
      </svg>
    ),
    color: '#E1306C',
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61590529512211',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1C0 18.1 4.4 23 10.1 24v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-1.9.9-1.9 1.9v2.2h3.3l-.5 3.5h-2.8V24C19.6 23 24 18.1 24 12.1z"/>
      </svg>
    ),
    color: '#1877F2',
  },
  {
    name: 'Lemon8',
    url: 'https://s.lemon8-app.com/s/GgNmbyycFf',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
      </svg>
    ),
    color: '#FFC200',
  },
];

export default async function HomePage() {
  const supabase = createClient();

  const [
    { data: categories },
    { data: products },
    { data: settings },
    { data: allProductImages },
    { data: contents },
    { data: contentProducts },
  ] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('products').select('*').eq('active', true).order('rank'),
    supabase.from('site_settings').select('*'),
    supabase.from('product_images').select('*').order('rank'),
    supabase.from('contents').select('*').eq('active', true).order('rank'),
    supabase.from('content_products').select('*, products(*)').order('rank'),
  ]);

  const settingsMap = Object.fromEntries((settings || []).map((r) => [r.key, r.value]));
  const displayMode = settingsMap.display_mode || 'grid';
  const headerStyle = settingsMap.header_style || 'minimal';
  const headerBannerUrl = settingsMap.header_banner_url || '';

  const imagesByProduct = {};
  (allProductImages || []).forEach((img) => {
    if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id] = [];
    imagesByProduct[img.product_id].push(img);
  });

  const productsByContent = {};
  (contentProducts || []).forEach((cp) => {
    if (!productsByContent[cp.content_id]) productsByContent[cp.content_id] = [];
    if (cp.products) productsByContent[cp.content_id].push(cp.products);
  });

  return (
    <main className="max-w-xl mx-auto px-5 py-9">
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>

      {/* ── Header ── */}
      {headerStyle === 'banner' && headerBannerUrl ? (
        /* Banner style */
        <div className="mb-6 -mx-5">
          <div className="relative w-full" style={{ paddingBottom: '33.3%' }}>
            <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: '#1C1B18' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={headerBannerUrl} alt="Unnaidee" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent flex items-end px-5 pb-4">
                <div>
                  <h1 className="font-display font-bold text-2xl text-white tracking-tight">Unnaidee</h1>
                  <p className="text-white/70 text-xs mt-0.5">ของดีจาก Shopee ที่คัดมาให้แล้ว</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-5 mt-3">
            <div className="flex items-center gap-2.5">
              {SOCIALS.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}
                  className="w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all hover:scale-110"
                  style={{ color: s.color }}>
                  {s.icon}
                </a>
              ))}
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 border border-dashed border-coral rounded-full font-mono text-[10px] text-coral">
              ✓ คัดสรรมาให้แล้ว
            </div>
          </div>
        </div>
      ) : (
        /* Minimal style (default) */
        <div className="text-center mb-7">
          <h1 className="font-display font-bold text-3xl tracking-tight">Unnai<span className="text-coral">dee</span></h1>
          <p className="text-inkSoft text-sm mt-1.5">ของดีจาก Shopee ที่คัดมาให้แล้ว</p>
          <div className="flex items-center justify-center gap-3 mt-4">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center transition-all hover:scale-110"
                style={{ color: s.color }}>
                {s.icon}
              </a>
            ))}
          </div>
          <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 border border-dashed border-coral rounded-full font-mono text-[11px] text-coral -rotate-1">
            ✓ คัดสรรมาให้แล้ว
          </div>
        </div>
      )}

      <HomeTabs
        categories={categories || []}
        products={products || []}
        displayMode={displayMode}
        imagesByProduct={imagesByProduct}
        contents={contents || []}
        productsByContent={productsByContent}
      />

      <div className="mt-10 pt-6 border-t border-border">
        <div className="flex items-center justify-center gap-4 mb-3">
          {SOCIALS.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-inkSoft hover:text-ink transition-colors">
              {s.name}
            </a>
          ))}
        </div>
        <p className="text-center font-mono text-[11px] text-inkSoft">
          *ลิงก์ทั้งหมดเป็นลิงก์ affiliate — ไม่มีค่าใช้จ่ายเพิ่มเติม
        </p>
      </div>
    </main>
  );
}
