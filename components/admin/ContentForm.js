'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertContent } from '@/lib/actions/contents';
import ImageUploadField from './ImageUploadField';

const PLATFORMS = ['YouTube', 'Instagram', 'Facebook', 'Lemon8'];

export default function ContentForm({ content, products, selectedProductIds = [], onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(content?.thumbnail_url || '');
  const [selected, setSelected] = useState(selectedProductIds);

  function handleClose() {
    if (loading) return;
    onClose();
  }

  function toggleProduct(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    if (content) formData.set('id', content.id);
    formData.set('thumbnail_url', thumbnail);
    selected.forEach((id) => formData.append('product_ids', id));

    await upsertContent(formData);
    setLoading(false);
    onClose();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">
            {content ? 'แก้ไขคอนเทนต์' : 'เพิ่มคอนเทนต์ใหม่'}
          </h3>
          <button type="button" onClick={handleClose} className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-inkSoft hover:text-ink text-sm">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <ImageUploadField
            value={thumbnail}
            onChange={setThumbnail}
            aspectSquare={false}
            label="รูปปกคลิป (thumbnail)"
          />
        </div>

        <Field label="ชื่อคลิป/โพสต์ *">
          <input name="title" required defaultValue={content?.title} className="input" />
        </Field>

        <Field label="แพลตฟอร์ม *">
          <select name="platform" required defaultValue={content?.platform || 'YouTube'} className="input">
            {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Field>

        <Field label="ลิงก์คลิป/โพสต์ *">
          <input name="video_url" required defaultValue={content?.video_url} placeholder="https://..." className="input" />
        </Field>

        <div className="mb-1">
          <label className="block text-xs text-inkSoft mb-1.5">เลือกสินค้าในคลิปนี้ ({selected.length})</label>
          <div className="border border-border rounded-xl max-h-52 overflow-y-auto divide-y divide-border">
            {products.map((p) => (
              <label key={p.id} className="flex items-center gap-2.5 p-2.5 cursor-pointer hover:bg-bg">
                <input
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                  className="accent-coral"
                />
                <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', flexShrink: 0, position: 'relative', backgroundColor: '#E2EEEA' }}>
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>📦</span>
                  )}
                </div>
                <span className="text-xs flex-1 truncate">{p.name}</span>
              </label>
            ))}
            {products.length === 0 && (
              <p className="text-xs text-inkSoft text-center py-4">ยังไม่มีสินค้าในระบบ</p>
            )}
          </div>
        </div>

        <input type="hidden" name="rank" value={content?.rank ?? 0} />

        <div className="flex gap-2 mt-5">
          <button type="button" onClick={handleClose} disabled={loading} className="flex-1 border border-border rounded-[9px] py-2.5 text-sm disabled:opacity-50">
            ยกเลิก
          </button>
          <button disabled={loading} type="submit" className="flex-1 bg-ink text-white rounded-[9px] py-2.5 text-sm font-semibold disabled:opacity-60">
            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="mb-3">
      <label className="block text-xs text-inkSoft mb-1">{label}</label>
      {children}
    </div>
  );
}
