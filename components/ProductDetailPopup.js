'use client';

import { useState, useRef } from 'react';

export default function ProductDetailPopup({ product, images, categoryName, onClose }) {
  const [imgIndex, setImgIndex] = useState(0);
  const touchStartX = useRef(null);
  const gallery = images && images.length > 0
    ? images
    : product.image_url ? [{ image_url: product.image_url }] : [];

  const hasDiscount = product.discount_price && product.price && product.discount_price < product.price;
  const displayPrice = hasDiscount ? product.discount_price : product.price;
  const clickHref = `/api/click?product=${product.id}&url=${encodeURIComponent(product.shopee_url)}`;

  function next(e) { e?.stopPropagation(); setImgIndex((i) => (i + 1) % gallery.length); }
  function prev(e) { e?.stopPropagation(); setImgIndex((i) => (i - 1 + gallery.length) % gallery.length); }

  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: 'rgba(28,27,24,0.6)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-md flex flex-col rounded-t-2xl sm:rounded-2xl"
        style={{ maxHeight: '94vh' }}
      >
        {/* ── drag handle (mobile) ── */}
        <div className="flex-shrink-0 flex items-center justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* ── รูปภาพ fixed height ── */}
        <div
          className="flex-shrink-0 relative bg-tealDim overflow-hidden"
          style={{ height: 280 }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {gallery.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={gallery[imgIndex].image_url}
              alt={product.name}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-5xl">📦</div>
          )}

          {/* ปุ่มปิด บนซ้าย */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-ink text-sm shadow"
          >
            ✕
          </button>

          {gallery.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-lg shadow">‹</button>
              <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-lg shadow">›</button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setImgIndex(i); }}
                    className={`h-1.5 rounded-full transition-all ${i === imgIndex ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`}
                  />
                ))}
              </div>
              <span className="absolute top-3 right-3 bg-ink/60 text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                {imgIndex + 1}/{gallery.length}
              </span>
            </>
          )}
        </div>

        {/* ── Info — scroll ได้ ── */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-1 min-h-0">
          {categoryName && (
            <div className="font-mono text-[10px] uppercase tracking-wide text-inkSoft mb-1">{categoryName}</div>
          )}
          <h2 className="font-semibold text-[17px] leading-snug mb-2">{product.name}</h2>

          {displayPrice != null && (
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-mono text-2xl font-bold text-coral">฿{Number(displayPrice).toLocaleString()}</span>
              {hasDiscount && (
                <>
                  <span className="font-mono text-sm text-inkSoft line-through">฿{Number(product.price).toLocaleString()}</span>
                  <span className="bg-ink text-white font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded-md">
                    -{Math.round((1 - product.discount_price / product.price) * 100)}%
                  </span>
                </>
              )}
            </div>
          )}

          {product.description && (
            <p className="text-sm text-inkSoft leading-relaxed whitespace-pre-line mb-2">{product.description}</p>
          )}
        </div>

        {/* ── Footer sticky — ปุ่ม Shopee + ปุ่มปิด ── */}
        <div className="flex-shrink-0 px-5 pt-3 pb-5 border-t border-border bg-white rounded-b-2xl flex flex-col gap-2">
          <a
            href={clickHref}
            className="flex items-center justify-center gap-2 bg-ink hover:bg-coral text-white text-sm font-semibold py-3.5 rounded-xl transition-colors"
          >
            ไปที่ Shopee →
          </a>
          <button
            onClick={onClose}
            className="flex items-center justify-center text-inkSoft text-sm py-2 hover:text-ink transition-colors"
          >
            ✕ ปิด และดูสินค้าอื่น
          </button>
        </div>
      </div>
    </div>
  );
}
