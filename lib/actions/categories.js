'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addCategory(formData) {
  const supabase = createClient();
  await supabase.from('categories').insert({
    name: formData.get('name'),
    sort_order: Number(formData.get('sort_order') || 0),
  });

  revalidatePath('/admin/categories');
  revalidatePath('/');
}

export async function deleteCategory(formData) {
  const supabase = createClient();
  const id = formData.get('id');
  await supabase.from('categories').delete().eq('id', id);

  revalidatePath('/admin/categories');
  revalidatePath('/');
}
