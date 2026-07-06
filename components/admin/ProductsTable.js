'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { deleteProduct, toggleHit, toggleActive, updateRanksBatch } from '@/lib/actions/products';
import ProductForm from './ProductForm';

export default function ProductsTable({ products: initial, categories, imagesByProduct = {} }) {
  const [products, setProducts] = useState(initial);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const dragIndex = useRef(null);
  const [overIndex, setOverIndex] = useState(null);

  function onDragStart(i) { dragIndex.current = i; }
  function onDragOver(e, i) { e.preventDefault(); setOverIndex(i); }

  async function onDrop(e, i) {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === i) { setOverIndex(null); return; }
    const reordered = [...products];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(i, 0, moved);
    setProducts(reordered);
    setOverIndex(null);
    dragIndex.current = null;
    setSaving(true);
    await updateRanksBatch(reordered.map((p, idx) => ({ id: p.id, rank: idx })));
    setSaving(false);
  }

  function onDragEnd() { setOverIndex(null); dragIndex.current = null; }

  async function handleToggleHit(id, current) {
    await toggleHit(id, current);
    router.refresh();
  }

  async function handleToggleActive(id, current) {
    // อัพเดต UI ทันทีก่อน (optimistic)
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, active: !current } : p));
    await toggleActive(id, current);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold">สินค้าทั้งหมด ({products.length})</h1>
          {saving && (
            <span className="text-xs text-inkSoft bg-bg border border-border rounded-full px-2.5 py-1">
              กำลังบันทึกลำดับ…
            </span>
          )}
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-coral text-white text-sm font-semibold px-4 py-2.5 rounded-[9px]"
        >
          + เพิ่มสินค้า
        </button>
      </div>

      <p className="text-xs text-inkSoft mb-3 flex items-center gap-1.5">
        <span>⠿</span> ลากขึ้น-ลงเพื่อเรียงลำดับ
      </p>

      {showForm && (
        <ProductForm
          product={editing}
          existingImages={editing ? (imagesByProduct[editing.id] || []) : []}
          categories={categories}
          onClose={() => { setShowForm(false); router.refresh(); }}
        />
      )}

      <div className="bg-white border border-border rounded-2xl overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2.5 px-2 w-8" />
              <th className="py-2.5 px-3 font-mono text-[10.5px] uppercase text-inkSoft">สินค้า</th>
              <th className="py-2.5 px-3 font-mono text-[10.5px] uppercase text-inkSoft">หมวดหมู่</th>
              <th className="py-2.5 px-3 font-mono text-[10.5px] uppercase text-inkSoft">ราคา</th>
              <th className="py-2.5 px-3 font-mono text-[10.5px] uppercase text-inkSoft text-center">โชว์หน้าหลัก</th>
              <th className="py-2.5 px-3 font-mono text-[10.5px] uppercase text-inkSoft text-center">ฮิต</th>
              <th className="py-2.5 px-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => {
              const isActive = p.active !== false; // default true ถ้ายังไม่มี column
              return (
                <tr
                  key={p.id}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => onDragOver(e, i)}
                  onDrop={(e) => onDrop(e, i)}
                  onDragEnd={onDragEnd}
                  className={`border-b border-border last:border-none transition-colors ${
                    overIndex === i ? 'bg-coralDim' : isActive ? 'hover:bg-bg' : 'bg-bg/60 opacity-60 hover:opacity-80'
                  } ${dragIndex.current === i ? 'opacity-40' : ''}`}
                >
                  <td className="py-2.5 px-2 text-inkSoft cursor-grab active:cursor-grabbing select-none text-lg">⠿</td>

                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2.5">
                      {p.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.image_url} alt="" className="w-9 h-9 rounded-lg object-cover border border-border flex-shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-bg border border-border flex items-center justify-center text-base flex-shrink-0">📦</div>
                      )}
                      <div>
                        <div className="font-medium leading-snug">{p.name}</div>
                        {!isActive && (
                          <div className="text-[9px] text-inkSoft font-mono mt-0.5">ซ่อนอยู่</div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-2.5 px-3 text-inkSoft">
                    {categories.find((c) => c.id === p.category_id)?.name || '-'}
                  </td>

                  <td className="py-2.5 px-3 font-mono">
                    {p.discount_price ?? p.price ? `฿${(p.discount_price ?? p.price).toLocaleString()}` : '-'}
                  </td>

                  {/* toggle โชว์/ซ่อนหน้าหลัก */}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => handleToggleActive(p.id, isActive)}
                      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                        isActive
                          ? 'bg-tealDim text-teal border-teal/30 hover:bg-red-50 hover:text-red-500 hover:border-red-300'
                          : 'bg-bg text-inkSoft border-border hover:bg-tealDim hover:text-teal hover:border-teal/30'
                      }`}
                      title={isActive ? 'คลิกเพื่อซ่อน' : 'คลิกเพื่อแสดง'}
                    >
                      {isActive ? '👁 โชว์' : '🙈 ซ่อน'}
                    </button>
                  </td>

                  {/* toggle ฮิต */}
                  <td className="py-2.5 px-3 text-center">
                    <button
                      onClick={() => handleToggleHit(p.id, p.is_hit)}
                      className={`w-8 h-[18px] rounded-full relative transition-colors ${p.is_hit ? 'bg-teal' : 'bg-[#E6E4DC]'}`}
                    >
                      <span className={`absolute top-[2px] w-[14px] h-[14px] bg-white rounded-full transition-all ${p.is_hit ? 'left-4' : 'left-[2px]'}`} />
                    </button>
                  </td>

                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    <button onClick={() => { setEditing(p); setShowForm(true); }} className="text-xs text-inkSoft hover:text-ink mr-3">
                      แก้ไข
                    </button>
                    <form action={deleteProduct} className="inline">
                      <input type="hidden" name="id" value={p.id} />
                      <button type="submit" className="text-xs text-coral hover:underline">ลบ</button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center text-inkSoft text-sm py-8">
            ยังไม่มีสินค้า กด &quot;+ เพิ่มสินค้า&quot; เพื่อเริ่มเลย
          </p>
        )}
      </div>
    </div>
  );
}
