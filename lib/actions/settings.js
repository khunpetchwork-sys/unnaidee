'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
  const supabase = createClient();
  const { data } = await supabase.from('site_settings').select('*');
  return Object.fromEntries((data || []).map((r) => [r.key, r.value]));
}

export async function setSetting(key, value) {
  const supabase = createClient();
  await supabase.from('site_settings').upsert({ key, value });
  revalidatePath('/');
  revalidatePath('/admin');
}
