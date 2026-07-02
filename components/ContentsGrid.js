'use client';

import { useState } from 'react';
import ContentPopup from './ContentPopup';

const PLATFORM_COLOR = {
  YouTube: '#FF0000',
  Instagram: '#E1306C',
  Facebook: '#1877F2',
  Lemon8: '#FFC200',
};

export default function ContentsGrid({ contents, productsByContent }) {
  const [active, setActive] = useState(null);

  if (contents.length === 0) {
    return <p className="text-center text-inkSoft text-sm mt-10">ยังไม่มีคลิปในตอนนี้</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {contents.map((c) => (
          <div
            key={c.id}
            onClick={() => setActive(c)}
            className="bg-white border border-border rounded-xl overflow-hidden cursor-pointer hover:border-coral transition-colors"
          >
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <div className="absolute inset-0 bg-ink overflow-hidden">
                {c.thumbnail_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.thumbnail_url} alt={c.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">🎬</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-black/60 flex items-center justify-center">
                    <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid white', marginLeft: 2 }} />
                  </div>
                </div>
                <span
                  className="absolute top-1.5 left-1.5 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: PLATFORM_COLOR[c.platform] || '#1C1B18' }}
                >
                  {c.platform}
                </span>
              </div>
            </div>
            <div className="p-2.5">
              <div className="text-[12px] font-medium leading-snug line-clamp-2 mb-1.5">{c.title}</div>
              <span className="inline-flex items-center gap-1 bg-coralDim text-coral text-[10px] px-2 py-0.5 rounded-full border border-coral/30">
                🛍 {(productsByContent[c.id] || []).length} ชิ้น
              </span>
            </div>
          </div>
        ))}
      </div>

      {active && (
        <ContentPopup
          content={active}
          products={productsByContent[active.id] || []}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
}
