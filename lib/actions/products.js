'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertProduct(formData) {
  const supabase = createClient();
  const id = formData.get('id') || undefined;

  const payload = {
    name: formData.get('name'),
    shopee_url: formData.get('shopee_url'),
    image_url: formData.get('image_url') || null, // รูปปก (รูปแรก) — ใช้แสดงในการ์ด/list
    price: formData.get('price') ? Number(formData.get('price')) : null,
    discount_price: formData.get('discount_price') ? Number(formData.get('discount_price')) : null,
    category_id: formData.get('category_id') || null,
    description: formData.get('description') || null,
    is_hit: formData.get('is_hit') === 'on',
    rank: formData.get('rank') ? Number(formData.get('rank')) : 0,
  };

  let productId = id;

  if (id) {
    await supabase.from('products').update(payload).eq('id', id);
  } else {
    const { data } = await supabase.from('products').insert(payload).select('id').single();
    productId = data?.id;
  }

  // ── บันทึกรูปทั้งหมด (gallery) ──
  if (productId) {
    const imagesRaw = formData.get('images_json');
    if (imagesRaw) {
      const images = JSON.parse(imagesRaw); // [{url}, ...]
      await supabase.from('product_images').delete().eq('product_id', productId);
      if (images.length > 0) {
        await supabase.from('product_images').insert(
          images.map((img, i) => ({ product_id: productId, image_url: img.url, rank: i }))
        );
      }
    }
  }

  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function deleteProduct(formData) {
  const supabase = createClient();
  const id = formData.get('id');
  await supabase.from('products').delete().eq('id', id);
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function toggleActive(id, current) {
  const supabase = createClient();
  await supabase.from('products').update({ active: !current }).eq('id', id);
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function toggleHit(id, current) {
  const supabase = createClient();
  await supabase.from('products').update({ is_hit: !current }).eq('id', id);
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function updateRank(id, rank) {
  const supabase = createClient();
  await supabase.from('products').update({ rank }).eq('id', id);
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function updateRanksBatch(items) {
  const supabase = createClient();
  await Promise.all(
    items.map(({ id, rank }) => supabase.from('products').update({ rank }).eq('id', id))
  );
  revalidatePath('/admin/products');
  revalidatePath('/');
}
