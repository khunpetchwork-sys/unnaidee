'use client';

import { useState } from 'react';
import ProductGrid from './ProductGrid';
import ContentsGrid from './ContentsGrid';

export default function HomeTabs({ categories, products, displayMode, imagesByProduct, contents, productsByContent }) {
  const [tab, setTab] = useState('products');

  return (
    <div>
      <div className="flex gap-2 mb-6 bg-bg border border-border rounded-xl p-1">
        <button
          onClick={() => setTab('products')}
          className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${
            tab === 'products' ? 'bg-white text-ink shadow-sm' : 'text-inkSoft'
          }`}
        >
          🛍 สินค้า
        </button>
        <button
          onClick={() => setTab('contents')}
          className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-colors ${
            tab === 'contents' ? 'bg-white text-ink shadow-sm' : 'text-inkSoft'
          }`}
        >
          🎬 คลิป
        </button>
      </div>

      {tab === 'products' ? (
        <ProductGrid
          categories={categories}
          products={products}
          displayMode={displayMode}
          imagesByProduct={imagesByProduct}
        />
      ) : (
        <ContentsGrid contents={contents} productsByContent={productsByContent} />
      )}
    </div>
  );
}
