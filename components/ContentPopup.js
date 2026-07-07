'use client';

const PLATFORM_COLOR = {
  YouTube: '#FF0000', Instagram: '#E1306C', Facebook: '#1877F2', Lemon8: '#FFC200',
};

export default function ContentPopup({ content, products, onClose }) {
  const isArticle = content.content_type === 'article';

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md flex flex-col"
        style={{ maxHeight: '92vh' }}
      >
        {/* รูปปก */}
        {content.thumbnail_url && (
          <div className="relative w-full flex-shrink-0" style={{ paddingBottom: '50%' }}>
            <div className="absolute inset-0 overflow-hidden rounded-t-2xl bg-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={content.thumbnail_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <button onClick={onClose} className="absolute top-2.5 left-2.5 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center text-ink shadow-sm z-10">✕</button>
            </div>
          </div>
        )}

        {/* เนื้อหา scroll ได้ */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-2 min-h-0">
          {!content.thumbnail_url && (
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-1 bg-border rounded-full mx-auto sm:hidden" />
              <button onClick={onClose} className="ml-auto w-7 h-7 rounded-full border border-border flex items-center justify-center text-inkSoft hover:text-ink text-xs">✕</button>
            </div>
          )}

          {/* badge ประเภท */}
          <div className="flex items-center gap-2 mb-2">
            {isArticle ? (
              <span className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full bg-bg border border-border text-inkSoft">📝 บทความ</span>
            ) : (
              <span
                className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: PLATFORM_COLOR[content.platform] || '#1C1B18' }}
              >
                {content.platform}
              </span>
            )}
          </div>

          <h2 className="font-display font-bold text-[16px] leading-snug mb-3">{content.title}</h2>

          {/* เนื้อหาบทความ */}
          {isArticle && content.body && (
            <div className="bg-bg rounded-xl p-4 mb-4">
              <p className="text-sm text-ink leading-relaxed whitespace-pre-line">{content.body}</p>
            </div>
          )}

          {/* ปุ่มดูคลิป (เฉพาะ video) */}
          {!isArticle && content.video_url && (
            <a
              href={content.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-xl mb-4 transition-opacity hover:opacity-90"
              style={{ backgroundColor: PLATFORM_COLOR[content.platform] || '#1C1B18' }}
            >
              ดูคลิปนี้บน {content.platform}
            </a>
          )}

          {/* สินค้าที่แนะนำ */}
          {products.length > 0 && (
            <>
              <div className="h-px bg-border mb-3" />
              <div className="text-[13px] font-semibold mb-2.5">
                {isArticle ? 'สินค้าที่แนะนำในบทความ' : 'สินค้าในคลิปนี้'} ({products.length})
              </div>
              <div className="flex flex-col gap-2">
                {products.map((p) => {
                  const hasDiscount = p.discount_price && p.price && p.discount_price < p.price;
                  const displayPrice = hasDiscount ? p.discount_price : p.price;
                  return (
                    <div key={p.id} className="flex items-center gap-2.5 bg-bg rounded-xl p-2.5 border border-border">
                      <div style={{ width: 44, height: 44, borderRadius: 7, overflow: 'hidden', flexShrink: 0, position: 'relative', backgroundColor: '#fff' }}>
                        {p.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>📦</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium leading-snug truncate">{p.name}</div>
                        {displayPrice != null && (
                          <div className="font-mono text-[12px] font-semibold text-coral mt-0.5">
                            ฿{Number(displayPrice).toLocaleString()}
                          </div>
                        )}
                      </div>
                      <a
                        href={`/api/click?product=${p.id}&url=${encodeURIComponent(p.shopee_url)}`}
                        className="bg-ink text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 hover:bg-coral transition-colors"
                      >
                        ซื้อ
                      </a>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
