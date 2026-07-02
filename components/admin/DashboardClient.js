'use client';

import { useState, useCallback } from 'react';
import { setSetting } from '@/lib/actions/settings';

export default function DashboardClient({ clicks, pageViews, products, displayMode: initialMode }) {
  const [displayMode, setDisplayMode] = useState(initialMode);
  const [savingMode, setSavingMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);

  const today = new Date().toISOString().split('T')[0];
  const todayClicks = clicks.filter((c) => c.clicked_at?.startsWith(today));
  const todayViews = pageViews.filter((v) => v.visited_at?.startsWith(today));

  // top products by clicks
  const clickMap = {};
  clicks.forEach((c) => { if (c.product_id) clickMap[c.product_id] = (clickMap[c.product_id] || 0) + 1; });
  const topProducts = products
    .map((p) => ({ ...p, clicks: clickMap[p.id] || 0 }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 6);

  // clicks per hour (today)
  const hourMap = {};
  todayClicks.forEach((c) => {
    const h = new Date(c.clicked_at).getHours();
    hourMap[h] = (hourMap[h] || 0) + 1;
  });
  const hours = Object.entries(hourMap).sort((a, b) => Number(a[0]) - Number(b[0]));
  const maxHour = Math.max(...hours.map(([, n]) => n), 1);

  async function handleModeChange(mode) {
    if (mode === displayMode) return;
    setSavingMode(true);
    setDisplayMode(mode);
    await setSetting('display_mode', mode);
    setSavingMode(false);
    // refresh preview
    setPreviewKey((k) => k + 1);
  }

  function refreshPreview() {
    setPreviewKey((k) => k + 1);
  }

  return (
    <div className="relative">
      {/* ── STATS ── */}
      <h1 className="font-display text-2xl font-bold mb-5">ภาพรวม</h1>

      <div className="grid grid-cols-2 gap-3 mb-7 sm:grid-cols-4">
        <Stat label="คลิกทั้งหมด" value={clicks.length.toLocaleString()} />
        <Stat label="คลิกวันนี้" value={todayClicks.length.toLocaleString()} />
        <Stat label="ผู้เข้าชมวันนี้" value={todayViews.length.toLocaleString()} />
        <Stat label="สินค้าทั้งหมด" value={products.length.toLocaleString()} />
      </div>

      {/* ── DISPLAY MODE TOGGLE ── */}
      <div className="bg-white border border-border rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="font-semibold text-sm mb-0.5">รูปแบบการแสดงสินค้า</div>
            <div className="text-xs text-inkSoft">เปลี่ยนได้เลย ลูกค้าจะเห็นผลทันที</div>
          </div>
          <div className="flex items-center gap-2">
            {savingMode && <span className="text-xs text-inkSoft">กำลังบันทึก…</span>}
            <button
              onClick={() => handleModeChange('grid')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] border text-sm font-medium transition-colors ${
                displayMode === 'grid'
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-inkSoft border-border hover:border-ink'
              }`}
            >
              <GridIcon /> ตาราง
            </button>
            <button
              onClick={() => handleModeChange('list')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] border text-sm font-medium transition-colors ${
                displayMode === 'list'
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-inkSoft border-border hover:border-ink'
              }`}
            >
              <ListIcon /> รายการ
            </button>
          </div>
        </div>
      </div>

      {/* ── PREVIEW TOGGLE ── */}
      <div className="mb-5">
        <button
          onClick={() => { setShowPreview((v) => !v); if (!showPreview) setPreviewKey((k) => k + 1); }}
          className="flex items-center gap-2 bg-tealDim text-teal border border-teal/30 rounded-[10px] px-4 py-2.5 text-sm font-semibold"
        >
          {showPreview ? '✕ ปิดพรีวิว' : '👁 ดูตัวอย่างหน้าลูกค้า (real-time)'}
        </button>
      </div>

      {showPreview && (
        <div className="mb-7 border border-border rounded-2xl overflow-hidden bg-white">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-bg">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              </div>
              <span className="font-mono text-[11px] text-inkSoft ml-1">หน้าลูกค้า</span>
            </div>
            <button
              onClick={refreshPreview}
              className="text-xs text-inkSoft hover:text-ink flex items-center gap-1"
            >
              ↺ รีเฟรช
            </button>
          </div>
          <div className="h-[520px]">
            <iframe
              key={previewKey}
              src="/?preview=1"
              className="w-full h-full border-none"
              title="Customer preview"
            />
          </div>
        </div>
      )}

      {/* ── TOP PRODUCTS ── */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="font-semibold text-sm mb-3">สินค้าที่คนกดมากสุด</div>
          {topProducts.length === 0 ? (
            <p className="text-inkSoft text-xs">ยังไม่มีข้อมูล</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {topProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{p.name}</div>
                    <div className="h-1.5 bg-bg rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-coral rounded-full"
                        style={{ width: `${Math.round((p.clicks / (topProducts[0]?.clicks || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="font-mono text-xs font-semibold text-inkSoft w-8 text-right flex-shrink-0">
                    {p.clicks}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-border rounded-2xl p-4">
          <div className="font-semibold text-sm mb-3">คลิกตามชั่วโมง (วันนี้)</div>
          {hours.length === 0 ? (
            <p className="text-inkSoft text-xs">ยังไม่มีคลิกวันนี้</p>
          ) : (
            <div className="flex items-end gap-1 h-24">
              {Array.from({ length: 24 }, (_, h) => {
                const n = hourMap[h] || 0;
                return (
                  <div key={h} className="flex flex-col items-center gap-0.5 flex-1">
                    <div
                      className="w-full bg-coral/70 rounded-sm"
                      style={{ height: `${Math.round((n / maxHour) * 80)}px` }}
                      title={`${h}:00 — ${n} คลิก`}
                    />
                  </div>
                );
              })}
            </div>
          )}
          {hours.length > 0 && (
            <div className="flex justify-between mt-1 font-mono text-[9px] text-inkSoft">
              <span>00:00</span><span>12:00</span><span>23:00</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white border border-border rounded-xl p-3.5">
      <div className="text-xs text-inkSoft mb-1">{label}</div>
      <div className="font-display font-bold text-2xl">{value}</div>
    </div>
  );
}

function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="0" y="0" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="8" y="0" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="0" y="8" width="6" height="6" rx="1.5" fill="currentColor" />
      <rect x="8" y="8" width="6" height="6" rx="1.5" fill="currentColor" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="0" y="1" width="4" height="4" rx="1" fill="currentColor" />
      <rect x="6" y="2" width="8" height="2" rx="1" fill="currentColor" />
      <rect x="0" y="7" width="4" height="4" rx="1" fill="currentColor" />
      <rect x="6" y="8" width="8" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}
