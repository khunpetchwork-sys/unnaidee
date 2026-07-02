'use client';

const PLATFORM_COLOR = {
  YouTube: '#FF0000',
  Instagram: '#E1306C',
  Facebook: '#1877F2',
  Lemon8: '#FFC200',
};

export default function ContentPopup({ content, products, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/50 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[88vh] overflow-y-auto p-5"
      >
        <div className="w-9 h-1 bg-border rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start gap-3 mb-4">
          <div className="w-16 h-16 rounded-lg bg-bg flex-shrink-0 overflow-hidden relative border border-border">
            {content.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.thumbnail_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🎬</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-[15px] leading-snug mb-1">{content.title}</h2>
            <span
              className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full text-white inline-block"
              style={{ backgroundColor: PLATFORM_COLOR[content.platform] || '#1C1B18' }}
            >
              {content.platform}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-inkSoft hover:text-ink text-xs flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {content.video_url && (
          <a
            href={content.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-white text-sm font-semibold py-3 rounded-xl mb-5 transition-opacity hover:opacity-90"
            style={{ backgroundColor: PLATFORM_COLOR[content.platform] || '#1C1B18' }}
          >
            ดูคลิปนี้บน {content.platform}
          </a>
        )}

        <div className="h-px bg-border mb-4" />
        <div className="text-[13px] font-semibold mb-3">สินค้าในคลิปนี้ ({products.length})</div>

        <div className="flex flex-col gap-2">
          {products.map((p) => {
            const hasDiscount = p.discount_price && p.price && p.discount_price < p.price;
            const displayPrice = hasDiscount ? p.discount_price : p.price;
            const clickHref = `/api/click?product=${p.id}&url=${encodeURIComponent(p.shopee_url)}`;
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
                  href={clickHref}
                  className="bg-ink text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 hover:bg-coral transition-colors"
                >
                  ซื้อ
                </a>
              </div>
            );
          })}
          {products.length === 0 && (
            <p className="text-xs text-inkSoft text-center py-4">ยังไม่มีสินค้าผูกกับคลิปนี้</p>
          )}
        </div>
      </div>
    </div>
  );
}
