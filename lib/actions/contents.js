'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function upsertContent(formData) {
  const supabase = createClient();
  const id = formData.get('id') || undefined;

  const payload = {
    title:         formData.get('title'),
    thumbnail_url: formData.get('thumbnail_url') || null,
    video_url:     formData.get('video_url') || null,
    platform:      formData.get('platform') || null,
    active:        true,
    rank:          formData.get('rank') ? Number(formData.get('rank')) : 0,
  };

  let contentId = id;

  if (id) {
    await supabase.from('contents').update(payload).eq('id', id);
  } else {
    const { data } = await supabase.from('contents').insert(payload).select('id').single();
    contentId = data?.id;
  }

  // บันทึกสินค้าที่เลือก
  if (contentId) {
    const productIds = formData.getAll('product_ids');
    await supabase.from('content_products').delete().eq('content_id', contentId);
    if (productIds.length > 0) {
      await supabase.from('content_products').insert(
        productIds.map((pid, i) => ({ content_id: contentId, product_id: pid, rank: i }))
      );
    }
  }

  revalidatePath('/admin/contents');
  revalidatePath('/');
}

export async function deleteContent(formData) {
  const supabase = createClient();
  await supabase.from('contents').delete().eq('id', formData.get('id'));
  revalidatePath('/admin/contents');
  revalidatePath('/');
}

export async function updateContentRanksBatch(items) {
  const supabase = createClient();
  await Promise.all(items.map(({ id, rank }) =>
    supabase.from('contents').update({ rank }).eq('id', id)
  ));
  revalidatePath('/admin/contents');
  revalidatePath('/');
}
