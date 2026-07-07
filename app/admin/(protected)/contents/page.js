import { createClient } from '@/lib/supabase/server';
import ContentsTable from '@/components/admin/ContentsTable';

export const revalidate = 0;

export default async function ContentsPage() {
  const supabase = createClient();

  const [{ data: contents }, { data: products }, { data: contentProducts }] = await Promise.all([
    supabase.from('contents').select('*').order('rank'),
    supabase.from('products').select('id, name, image_url').order('name'),
    supabase.from('content_products').select('*'),
  ]);

  const selectedByContent = {};
  (contentProducts || []).forEach((cp) => {
    if (!selectedByContent[cp.content_id]) selectedByContent[cp.content_id] = [];
    selectedByContent[cp.content_id].push(cp.product_id);
  });

  return (
    <ContentsTable
      contents={contents || []}
      products={products || []}
      selectedByContent={selectedByContent}
    />
  );
}
