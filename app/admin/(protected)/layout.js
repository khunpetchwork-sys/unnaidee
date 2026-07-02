import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from '@/components/SignOutButton';

export default async function AdminLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-bg">
      <div className="border-b border-border bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-5 py-3.5 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-5 flex-wrap">
            <span className="font-display font-bold">Unnaidee Admin</span>
            <Link href="/admin" className="text-sm text-inkSoft hover:text-ink transition-colors">
              แดชบอร์ด
            </Link>
            <Link href="/admin/products" className="text-sm text-inkSoft hover:text-ink transition-colors">
              สินค้า
            </Link>
            <Link href="/admin/categories" className="text-sm text-inkSoft hover:text-ink transition-colors">
              หมวดหมู่
            </Link>
            <Link href="/admin/contents" className="text-sm text-inkSoft hover:text-ink transition-colors">
              คอนเทนต์
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-inkSoft font-mono">{user?.email}</span>
            <SignOutButton />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-5 py-8">{children}</div>
    </div>
  );
}
