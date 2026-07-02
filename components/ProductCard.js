'use client';

import { useState } from 'react';
import ProductDetailPopup from './ProductDetailPopup';

export default function ProductCard({ product, categoryName, displayMode = 'grid', images = [] }) {
  const [showDetail, setShowDetail] = useState(false);

  const hasDiscount =
    product.discount_price && product.price && product.discount_price < product.price;
  const displayPrice = hasDiscount ? product.discount_price : product.price;
  const clickHref = `/api/click?product=${product.id}&url=${encodeURIComponent(product.shopee_url)}`;

  const squareImgWrap = {
    position: 'relative', width: '100%', paddingBottom: '100%',
    overflow: 'hidden', backgroundColor: '#E2EEEA',
  };
  const squareImgInner = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 };
  const imgStyle = { width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' };

  if (displayMode === 'list') {
    return (
      <>
        <div
          onClick={() => setShowDetail(true)}
          className="flex items-center gap-3 bg-white border border-border rounded-xl p-2.5 hover:border-coral transition-colors group cursor-pointer"
        >
          <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative', backgroundColor: '#E2EEEA', border: '1px solid #E6E4DC' }}>
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image_url} alt={product.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📦</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {categoryName && <div className="font-mono text-[9px] uppercase tracking-wide text-inkSoft mb-0.5">{categoryName}</div>}
            <div className="text-[13px] font-semibold leading-snug truncate">{product.name}</div>
            <div className="flex items-center gap-1.5 mt-1">
              {displayPrice != null && <span className="font-mono text-[12px] font-semibold text-coral">฿{Number(displayPrice).toLocaleString()}</span>}
              {hasDiscount && <span className="font-mono text-[10px] text-inkSoft line-through">฿{Number(product.price).toLocaleString()}</span>}
              {product.is_hit && <span className="font-mono text-[9px] text-coral border border-dashed border-coral rounded-full px-1.5 py-0.5 ml-1">ฮิต</span>}
            </div>
          </div>
          <div className="text-xs font-medium text-inkSoft group-hover:text-coral transition-colors flex-shrink-0 pr-1">ดู →</div>
        </div>
        {showDetail && (
          <ProductDetailPopup
            product={product}
            images={images}
            categoryName={categoryName}
            onClose={() => setShowDetail(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col">
        <div
          onClick={() => setShowDetail(true)}
          style={squareImgWrap}
          className="cursor-pointer"
        >
          <div style={squareImgInner}>
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={product.image_url} alt={product.name} style={imgStyle} />
            ) : (
              <div style={{ ...squareImgInner, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>📦</div>
            )}

            {hasDiscount && (
              <span style={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }} className="bg-ink text-white font-mono text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md">
                -{Math.round((1 - product.discount_price / product.price) * 100)}%
              </span>
            )}
            {product.is_hit && (
              <span style={{ position: 'absolute', top: 6, right: 6, zIndex: 1 }} className="w-[46px] h-[46px] rounded-full border border-dashed border-coral flex items-center justify-center text-center font-mono text-[8.5px] text-coral font-semibold rotate-[9deg] bg-white/85 leading-tight">
                ฮิต<br />ตอนนี้
              </span>
            )}
            {images.length > 1 && (
              <span style={{ position: 'absolute', bottom: 6, right: 6, zIndex: 1 }} className="bg-ink/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                🖼 {images.length}
              </span>
            )}
          </div>
        </div>

        <div className="p-3 flex flex-col gap-2 flex-1">
          {categoryName && <div className="font-mono text-[10px] uppercase tracking-wide text-inkSoft">{categoryName}</div>}
          <h3
            onClick={() => setShowDetail(true)}
            className="text-[13.5px] font-semibold leading-snug cursor-pointer"
          >
            {product.name}
          </h3>
          {displayPrice != null && (
            <div className="flex items-baseline gap-1.5 mt-auto">
              <span className="font-mono text-[15px] font-semibold text-coral">฿{Number(displayPrice).toLocaleString()}</span>
              {hasDiscount && <span className="font-mono text-[11px] text-inkSoft line-through">฿{Number(product.price).toLocaleString()}</span>}
            </div>
          )}
          <a href={clickHref} className="flex items-center justify-center gap-1.5 bg-ink hover:bg-coral text-white text-[12.5px] font-medium py-2.5 rounded-lg transition-colors mt-1">
            ไปที่ Shopee →
          </a>
        </div>
      </div>

      {showDetail && (
        <ProductDetailPopup
          product={product}
          images={images}
          categoryName={categoryName}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
}
