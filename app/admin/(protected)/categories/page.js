import { createClient } from '@/lib/supabase/server';
import CategoriesClient from '@/components/admin/CategoriesClient';

export const revalidate = 0;

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');

  return <CategoriesClient categories={categories || []} />;
}
