'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

/**
 * ช่องอัพโหลดรูปภาพ — รองรับ: กดเลือกไฟล์ / ลากวาง / Ctrl+V paste
 * onUploaded(url) จะถูกเรียกเมื่ออัพโหลดสำเร็จ
 */
export default function ImageUploadField({ value, onChange, aspectSquare = true, label = 'รูปภาพ' }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  async function uploadFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = (file.type.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from('product-images')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (error) {
        alert('อัพรูปไม่ได้: ' + error.message);
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
      onChange(urlData.publicUrl);
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e) {
    uploadFile(e.target.files[0]);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    uploadFile(e.dataTransfer.files[0]);
  }

  // ── Ctrl+V paste รูปภาพ ──
  function onPaste(e) {
    const items = e.clipboardData?.items || [];
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          uploadFile(file);
        }
        break;
      }
    }
  }

  const wrapClass = aspectSquare
    ? 'w-full aspect-square'
    : 'w-full aspect-video';

  return (
    <div>
      <label className="block text-xs text-inkSoft mb-1.5">{label}</label>

      {value ? (
        <div className="relative mb-1">
          <div className={`${wrapClass} rounded-xl border border-border overflow-hidden bg-bg relative`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 w-7 h-7 bg-ink/70 text-white rounded-full text-xs flex items-center justify-center hover:bg-coral transition-colors"
          >
            ✕
          </button>
        </div>
      ) : (
        <div
          ref={dropZoneRef}
          tabIndex={0}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onPaste={onPaste}
          onClick={() => fileInputRef.current?.click()}
          className={`${wrapClass} rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors outline-none ${
            dragOver ? 'border-coral bg-coralDim' : 'border-border bg-bg hover:border-inkSoft focus:border-coral'
          }`}
        >
          {uploading ? (
            <p className="text-sm text-inkSoft">กำลังอัพโหลด...</p>
          ) : (
            <>
              <div className="text-3xl mb-2">📸</div>
              <p className="text-sm font-medium text-ink">กดเพื่อเลือกรูป</p>
              <p className="text-xs text-inkSoft mt-0.5">ลากวาง หรือ วางคลิกแล้วกด Ctrl+V</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      {!value && (
        <input
          type="url"
          placeholder="หรือวาง URL รูปภาพ..."
          onChange={(e) => onChange(e.target.value)}
          className="input text-xs mt-2"
        />
      )}
    </div>
  );
}
