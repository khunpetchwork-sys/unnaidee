'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { deleteContent, updateContentRanksBatch } from '@/lib/actions/contents';
import ContentForm from './ContentForm';

const PLATFORM_COLOR = {
  YouTube: '#FF0000',
  Instagram: '#E1306C',
  Facebook: '#1877F2',
  Lemon8: '#FFC200',
};

export default function ContentsTable({ contents: initial, products, selectedByContent }) {
  const [contents, setContents] = useState(initial);
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
    const reordered = [...contents];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(i, 0, moved);
    setContents(reordered);
    setOverIndex(null);
    dragIndex.current = null;
    setSaving(true);
    await updateContentRanksBatch(reordered.map((c, idx) => ({ id: c.id, rank: idx })));
    setSaving(false);
  }

  function onDragEnd() { setOverIndex(null); dragIndex.current = null; }

  return (
    <div>
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold">คอนเทนต์ทั้งหมด ({contents.length})</h1>
          {saving && <span className="text-xs text-inkSoft bg-bg border border-border rounded-full px-2.5 py-1">กำลังบันทึกลำดับ…</span>}
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-coral text-white text-sm font-semibold px-4 py-2.5 rounded-[9px]"
        >
          + เพิ่มคอนเทนต์
        </button>
      </div>

      <p className="text-xs text-inkSoft mb-3 flex items-center gap-1.5"><span>⠿</span> ลากขึ้น-ลงเพื่อเรียงลำดับ</p>

      {showForm && (
        <ContentForm
          content={editing}
          products={products}
          selectedProductIds={editing ? (selectedByContent[editing.id] || []) : []}
          onClose={() => { setShowForm(false); router.refresh(); }}
        />
      )}

      <div className="flex flex-col gap-2">
        {contents.map((c, i) => (
          <div
            key={c.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDrop={(e) => onDrop(e, i)}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-3 bg-white border border-border rounded-xl p-3 transition-colors ${
              overIndex === i ? 'bg-coralDim' : ''
            } ${dragIndex.current === i ? 'opacity-40' : ''}`}
          >
            <span className="text-inkSoft cursor-grab active:cursor-grabbing select-none text-lg">⠿</span>

            <div style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0, position: 'relative', backgroundColor: '#1C1B18' }}>
              {c.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.thumbnail_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🎬</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{c.title}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="text-[9px] font-semibold text-white px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: PLATFORM_COLOR[c.platform] || '#1C1B18' }}
                >
                  {c.platform}
                </span>
                <span className="text-[10px] text-inkSoft">
                  {(selectedByContent[c.id] || []).length} สินค้า
                </span>
              </div>
            </div>

            <button onClick={() => { setEditing(c); setShowForm(true); }} className="text-xs text-inkSoft hover:text-ink mr-1">แก้ไข</button>
            <form action={deleteContent}>
              <input type="hidden" name="id" value={c.id} />
              <button type="submit" className="text-xs text-coral hover:underline">ลบ</button>
            </form>
          </div>
        ))}
        {contents.length === 0 && (
          <p className="text-center text-inkSoft text-sm py-8 bg-white border border-border rounded-2xl">
            ยังไม่มีคอนเทนต์ กด &quot;+ เพิ่มคอนเทนต์&quot; เพื่อเริ่มเลย
          </p>
        )}
      </div>
    </div>
  );
}
