'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function CategoriesClient({ categories: initial }) {
  const [categories, setCategories] = useState(initial);
  const [newName, setNewName] = useState('');
  const [newOrder, setNewOrder] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editOrder, setEditOrder] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function add() {
    if (!newName.trim()) return;
    setLoading(true);
    const sb = createClient();
    await sb.from('categories').insert({ name: newName.trim(), sort_order: Number(newOrder) });
    setNewName('');
    setNewOrder(0);
    setLoading(false);
    router.refresh();
  }

  async function save(id) {
    if (!editName.trim()) return;
    setLoading(true);
    const sb = createClient();
    await sb.from('categories').update({ name: editName.trim(), sort_order: Number(editOrder) }).eq('id', id);
    setEditingId(null);
    setLoading(false);
    router.refresh();
  }

  async function remove(id) {
    if (!confirm('ลบหมวดหมู่นี้? สินค้าที่อยู่ในหมวดนี้จะไม่มีหมวดหมู่')) return;
    setLoading(true);
    const sb = createClient();
    await sb.from('categories').delete().eq('id', id);
    setLoading(false);
    router.refresh();
  }

  function startEdit(c) {
    setEditingId(c.id);
    setEditName(c.name);
    setEditOrder(c.sort_order ?? 0);
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">หมวดหมู่สินค้า</h1>

      {/* ── เพิ่มหมวดหมู่ ── */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-5">
        <div className="text-sm font-semibold mb-3">เพิ่มหมวดหมู่ใหม่</div>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs text-inkSoft mb-1">ชื่อหมวดหมู่</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && add()}
              className="input"
              placeholder="เช่น ของใช้ในบ้าน"
            />
          </div>
          <div className="w-28">
            <label className="block text-xs text-inkSoft mb-1">ลำดับ (น้อย = ขึ้นก่อน)</label>
            <input
              type="number"
              value={newOrder}
              onChange={(e) => setNewOrder(e.target.value)}
              className="input"
            />
          </div>
          <button
            onClick={add}
            disabled={loading || !newName.trim()}
            className="bg-coral text-white text-sm font-semibold px-4 py-2.5 rounded-[9px] disabled:opacity-50"
          >
            + เพิ่ม
          </button>
        </div>
      </div>

      {/* ── รายการหมวดหมู่ ── */}
      <div className="bg-white border border-border rounded-2xl divide-y divide-border">
        {categories.length === 0 && (
          <p className="text-center text-inkSoft text-sm py-8">ยังไม่มีหมวดหมู่</p>
        )}
        {categories.map((c) => (
          <div key={c.id} className="px-5 py-3.5">
            {editingId === c.id ? (
              /* ── โหมดแก้ไข ── */
              <div className="flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-[180px]">
                  <label className="block text-xs text-inkSoft mb-1">ชื่อ</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && save(c.id)}
                    className="input"
                    autoFocus
                  />
                </div>
                <div className="w-28">
                  <label className="block text-xs text-inkSoft mb-1">ลำดับ</label>
                  <input
                    type="number"
                    value={editOrder}
                    onChange={(e) => setEditOrder(e.target.value)}
                    className="input"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => save(c.id)}
                    disabled={loading}
                    className="bg-ink text-white text-xs font-semibold px-3 py-2 rounded-[7px] disabled:opacity-50"
                  >
                    บันทึก
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="border border-border text-xs px-3 py-2 rounded-[7px]"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              /* ── โหมดปกติ ── */
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{c.name}</span>
                  <span className="text-[10px] text-inkSoft font-mono ml-2">ลำดับ {c.sort_order ?? 0}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(c)}
                    className="text-xs text-inkSoft hover:text-ink"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    className="text-xs text-coral hover:underline"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
