'use client';

import { useState } from 'react';
import Image from 'next/image';
import ProductDetailPopup from './ProductDetailPopup';

export default function ProductCard({ product, categoryName, displayMode = 'grid', images = [] }) {
  const [showDetail, setShowDetail] = useState(false);

  const hasDiscount = product.discount_price && product.price && product.discount_price < product.price;
  const displayPrice = hasDiscount ? product.discount_price : product.price;
  const clickHref = `/api/click?product=${product.id}&url=${encodeURIComponent(product.shopee_url)}`;

  if (displayMode === 'list') {
    return (
      <>
        <div className="flex items-center gap-3 bg-white border border-border rounded-xl p-2.5 hover:border-coral transition-colors group">
          <div
            onClick={() => setShowDetail(true)}
            style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative', backgroundColor: '#E2EEEA', border: '1px solid #E6E4DC', cursor: 'pointer' }}
          >
            {product.image_url ? (
              <Image src={product.image_url} alt={product.name} fill sizes="56px" style={{ objectFit: 'cover' }} />
            ) : (
              <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>📦</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {categoryName && <div className="font-mono text-[9px] uppercase tracking-wide text-inkSoft mb-0.5">{categoryName}</div>}
            <div onClick={() => setShowDetail(true)} className="text-[13px] font-semibold leading-snug truncate cursor-pointer hover:text-coral transition-colors">
              {product.name}
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {displayPrice != null && <span className="font-mono text-[12px] font-semibold text-coral">฿{Number(displayPrice).toLocaleString()}</span>}
              {hasDiscount && <span className="font-mono text-[10px] text-inkSoft line-through">฿{Number(product.price).toLocaleString()}</span>}
              {product.is_hit && <span className="font-mono text-[9px] text-coral border border-dashed border-coral rounded-full px-1.5 py-0.5 ml-1">ฮิต</span>}
            </div>
          </div>
          <div className="flex flex-col gap-1 flex-shrink-0 items-end">
            <button onClick={() => setShowDetail(true)} className="text-[9px] text-inkSoft hover:text-ink border border-border rounded-full px-2 py-0.5 transition-colors whitespace-nowrap">
              ดูข้อมูล
            </button>
            <a href={clickHref} className="text-[10px] bg-ink text-white px-2.5 py-1 rounded-lg hover:bg-coral transition-colors whitespace-nowrap font-medium">
              Shopee →
            </a>
          </div>
        </div>
        {showDetail && <ProductDetailPopup product={product} images={images} categoryName={categoryName} onClose={() => setShowDetail(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="bg-white border border-border rounded-2xl overflow-hidden flex flex-col">
        <div onClick={() => setShowDetail(true)} className="relative cursor-pointer" style={{ paddingBottom: '100%' }}>
          <div className="absolute inset-0 bg-tealDim overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, 300px"
                style={{ objectFit: 'cover' }}
                priority={false}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-4xl">📦</div>
            )}

            {hasDiscount && (
              <span className="absolute top-2 left-2 z-10 bg-ink text-white font-mono text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md">
                -{Math.round((1 - product.discount_price / product.price) * 100)}%
              </span>
            )}
            <span className="absolute top-2 right-2 z-10 bg-white/90 text-ink text-[9px] font-semibold px-2 py-1 rounded-full shadow-sm">
              🔍 ดูข้อมูล
            </span>
            {product.is_hit && (
              <span className="absolute bottom-2 right-2 z-10 w-[40px] h-[40px] rounded-full border border-dashed border-coral flex items-center justify-center text-center font-mono text-[8px] text-coral font-semibold rotate-[9deg] bg-white/85 leading-tight">
                ฮิต<br />ตอนนี้
              </span>
            )}
            {images.length > 1 && (
              <span className="absolute bottom-2 left-2 z-10 bg-ink/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full">
                🖼 {images.length}
              </span>
            )}
          </div>
        </div>

        <div className="p-3 flex flex-col gap-2 flex-1">
          {categoryName && <div className="font-mono text-[10px] uppercase tracking-wide text-inkSoft">{categoryName}</div>}
          <h3 onClick={() => setShowDetail(true)} className="text-[13.5px] font-semibold leading-snug cursor-pointer hover:text-coral transition-colors">
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
      {showDetail && <ProductDetailPopup product={product} images={images} categoryName={categoryName} onClose={() => setShowDetail(false)} />}
    </>
  );
}
