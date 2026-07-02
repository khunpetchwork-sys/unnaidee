'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ categories, products, displayMode = 'grid', imagesByProduct = {} }) {
  const [active, setActive] = useState('all');
  const filtered =
    active === 'all' ? products : products.filter((p) => p.category_id === active);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5 no-scrollbar">
        <button onClick={() => setActive('all')} className={`tab ${active === 'all' ? 'tab-active' : ''}`}>
          ทั้งหมด
        </button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActive(c.id)} className={`tab ${active === c.id ? 'tab-active' : ''}`}>
            {c.name}
          </button>
        ))}
      </div>

      {displayMode === 'list' ? (
        <div className="flex flex-col gap-2">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              categoryName={categories.find((c) => c.id === p.category_id)?.name}
              displayMode="list"
              images={imagesByProduct[p.id] || []}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              categoryName={categories.find((c) => c.id === p.category_id)?.name}
              displayMode="grid"
              images={imagesByProduct[p.id] || []}
            />
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-inkSoft text-sm mt-10">ยังไม่มีสินค้าในหมวดนี้</p>
      )}
    </div>
  );
}
