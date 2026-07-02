import { createClient } from '@/lib/supabase/server';
import { addCategory, deleteCategory } from '@/lib/actions/categories';

export const revalidate = 0;

export default async function CategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">หมวดหมู่สินค้า</h1>

      <form action={addCategory} className="bg-white border border-border rounded-2xl p-5 mb-5 flex gap-3 items-end flex-wrap">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-xs text-inkSoft mb-1">ชื่อหมวดหมู่</label>
          <input name="name" required className="input" placeholder="เช่น ของใช้ในบ้าน" />
        </div>
        <div className="w-28">
          <label className="block text-xs text-inkSoft mb-1">ลำดับ</label>
          <input name="sort_order" type="number" defaultValue={0} className="input" />
        </div>
        <button type="submit" className="bg-coral text-white text-sm font-semibold px-4 py-2.5 rounded-[9px]">
          เพิ่ม
        </button>
      </form>

      <div className="bg-white border border-border rounded-2xl divide-y divide-border">
        {(categories || []).map((c) => (
          <div key={c.id} className="flex items-center justify-between px-5 py-3.5">
            <span className="text-sm">{c.name}</span>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <button type="submit" className="text-xs text-coral hover:underline">
                ลบ
              </button>
            </form>
          </div>
        ))}
        {(!categories || categories.length === 0) && (
          <p className="text-center text-inkSoft text-sm py-8">ยังไม่มีหมวดหมู่</p>
        )}
      </div>
    </div>
  );
}
