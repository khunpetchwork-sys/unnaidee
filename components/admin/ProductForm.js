'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { upsertProduct } from '@/lib/actions/products';
import MultiImageUploadField from './MultiImageUploadField';

export default function ProductForm({ product, existingImages = [], categories, onClose }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(
    existingImages.length > 0
      ? existingImages.map((img) => ({ url: img.image_url }))
      : product?.image_url ? [{ url: product.image_url }] : []
  );

  async function handleSubmit(e) {
    e.preventDefault();
    if (images.length === 0) { alert('กรุณาใส่รูปภาพอย่างน้อย 1 รูป'); return; }
    setLoading(true);
    const formData = new FormData(e.target);
    if (product) formData.set('id', product.id);
    formData.set('image_url', images[0].url);
    formData.set('images_json', JSON.stringify(images));
    await upsertProduct(formData);
    setLoading(false);
    onClose();
    // รีเฟรชหน้าอัตโนมัติ
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
            {product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
          </h3>
          <button type="button" onClick={onClose} disabled={loading}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-inkSoft hover:text-ink text-sm">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <MultiImageUploadField images={images} onChange={setImages} />
        </div>

        <Field label="ชื่อสินค้า *">
          <input name="name" required defaultValue={product?.name} className="input" />
        </Field>
        <Field label="ลิงก์ Shopee (affiliate) *">
          <input name="shopee_url" required defaultValue={product?.shopee_url} className="input" />
        </Field>
        <Field label="คำอธิบายสั้นๆ">
          <textarea name="description" rows={3} defaultValue={product?.description || ''}
            placeholder="เช่น เช็ดสะอาดกว่าผ้าทั่วไป ซักได้ 200 ครั้ง"
            className="input resize-none" />
        </Field>
        <div className="flex gap-3">
          <div className="flex-1">
            <Field label="ราคาปกติ">
              <input name="price" type="number" step="0.01" defaultValue={product?.price ?? ''} className="input" />
            </Field>
          </div>
          <div className="flex-1">
            <Field label="ราคาลด">
              <input name="discount_price" type="number" step="0.01" defaultValue={product?.discount_price ?? ''} className="input" />
            </Field>
          </div>
        </div>
        <Field label="หมวดหมู่">
          <select name="category_id" defaultValue={product?.category_id || ''} className="input">
            <option value="">ไม่ระบุ</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <div className="flex items-center gap-2 mb-4">
          <input type="checkbox" name="is_hit" id="is_hit" defaultChecked={product?.is_hit} className="accent-coral" />
          <label htmlFor="is_hit" className="text-sm">ตั้งเป็นสินค้าฮิต</label>
        </div>
        <input type="hidden" name="rank" value={product?.rank ?? 0} />

        <div className="flex gap-2 mt-5">
          <button type="button" onClick={onClose} disabled={loading}
            className="flex-1 border border-border rounded-[9px] py-2.5 text-sm disabled:opacity-50">
            ยกเลิก
          </button>
          <button disabled={loading} type="submit"
            className="flex-1 bg-ink text-white rounded-[9px] py-2.5 text-sm font-semibold disabled:opacity-60">
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
