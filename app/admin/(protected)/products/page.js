import { createClient } from '@/lib/supabase/server';
import ProductsTable from '@/components/admin/ProductsTable';

export const revalidate = 0;

export default async function ProductsPage() {
  const supabase = createClient();

  const [{ data: products }, { data: categories }, { data: allImages }] = await Promise.all([
    supabase.from('products').select('*').order('rank'),
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('product_images').select('*').order('rank'),
  ]);

  // จัดกลุ่มรูปตาม product_id
  const imagesByProduct = {};
  (allImages || []).forEach((img) => {
    if (!imagesByProduct[img.product_id]) imagesByProduct[img.product_id] = [];
    imagesByProduct[img.product_id].push(img);
  });

  return (
    <ProductsTable
      products={products || []}
      categories={categories || []}
      imagesByProduct={imagesByProduct}
    />
  );
}
