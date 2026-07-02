import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = createClient();
    await supabase.from('page_views').insert({
      path: body.path || '/',
      referrer: body.referrer || 'direct',
    });
  } catch {
    // ไม่ให้ error ของการ log ไปกระทบผู้ใช้
  }

  return NextResponse.json({ ok: true });
}
