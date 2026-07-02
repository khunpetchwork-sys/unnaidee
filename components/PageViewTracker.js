'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PageViewTracker() {
  const searchParams = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  useEffect(() => {
    // ไม่นับ pageview ถ้าเปิดจาก admin preview
    if (isPreview) return;

    fetch('/api/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: window.location.pathname,
        referrer: document.referrer || 'direct',
      }),
    }).catch(() => {});
  }, [isPreview]);

  return null;
}
