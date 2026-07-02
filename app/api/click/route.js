import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get('product');
  const target = searchParams.get('url');

  // ถ้าข้อมูลไม่ครบ ไม่ log อะไร แค่พากลับหน้าแรกกันลิงก์พัง
  if (!productId || !target) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const supabase = createClient();
    await supabase.from('clicks').insert({
      product_id: productId,
      referrer: request.headers.get('referer') || null,
      user_agent: request.headers.get('user-agent') || null,
    });
  } catch {
    // แม้ log ไม่สำเร็จ ก็ต้องพาไปหน้า Shopee ให้ได้ก่อน ไม่ให้ลูกค้าเสียประสบการณ์
  }

  return NextResponse.redirect(target);
}
