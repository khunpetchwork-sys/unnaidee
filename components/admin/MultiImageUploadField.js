'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * อัพโหลดได้หลายรูป — รองรับ Ctrl+V paste ทีละรูป, ลากวางหลายไฟล์พร้อมกัน
 * images = [{ url }, ...]
 */
export default function MultiImageUploadField({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  async function uploadOne(file) {
    const supabase = createClient();
    const ext = (file.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
    return urlData.publicUrl;
  }

  async function uploadFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = [];
      for (const f of files) {
        urls.push(await uploadOne(f));
      }
      onChange([...images, ...urls.map((url) => ({ url }))]);
    } catch (err) {
      alert('อัพรูปไม่ได้: ' + err.message);
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e) {
    uploadFiles(e.target.files);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }

  function onPaste(e) {
    const items = e.clipboardData?.items || [];
    const imgFiles = [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) imgFiles.push(file);
      }
    }
    if (imgFiles.length) {
      e.preventDefault();
      uploadFiles(imgFiles);
    }
  }

  function removeAt(idx) {
    onChange(images.filter((_, i) => i !== idx));
  }

  function moveImage(from, to) {
    if (to < 0 || to >= images.length) return;
    const arr = [...images];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    onChange(arr);
  }

  return (
    <div>
      <label className="block text-xs text-inkSoft mb-1.5">
        รูปภาพสินค้า (เลื่อนดูได้หลายรูป — รูปแรกเป็นรูปปก)
      </label>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-2">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border bg-bg group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-ink/70 text-white text-[9px] text-center py-0.5">ปก</span>
              )}
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-ink/70 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-coral"
              >
                ✕
              </button>
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => moveImage(i, i - 1)}
                  className="absolute top-1 left-1 w-5 h-5 bg-ink/70 text-white rounded-full text-[10px] flex items-center justify-center hover:bg-teal"
                  title="เลื่อนไปข้างหน้า"
                >
                  ‹
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        tabIndex={0}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onPaste={onPaste}
        onClick={() => fileInputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors outline-none py-5 ${
          dragOver ? 'border-coral bg-coralDim' : 'border-border bg-bg hover:border-inkSoft focus:border-coral'
        }`}
      >
        {uploading ? (
          <p className="text-sm text-inkSoft">กำลังอัพโหลด...</p>
        ) : (
          <>
            <div className="text-2xl mb-1">📸</div>
            <p className="text-xs font-medium text-ink">เพิ่มรูป — เลือกไฟล์ / ลากวาง / Ctrl+V</p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onFileChange}
        className="hidden"
      />
    </div>
  );
}
