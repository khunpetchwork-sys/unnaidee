import { createClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/actions/settings';
import DashboardClient from '@/components/admin/DashboardClient';

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = createClient();

  const [
    { data: clicks },
    { data: pageViews },
    { data: products },
    settings,
  ] = await Promise.all([
    supabase.from('clicks').select('id, product_id, clicked_at, referrer').order('clicked_at', { ascending: false }),
    supabase.from('page_views').select('visited_at').order('visited_at', { ascending: false }),
    supabase.from('products').select('id, name').order('rank'),
    getSettings(),
  ]);

  return (
    <DashboardClient
      clicks={clicks || []}
      pageViews={pageViews || []}
      products={products || []}
      displayMode={settings.display_mode || 'grid'}
      headerStyle={settings.header_style || 'minimal'}
      headerBannerUrl={settings.header_banner_url || ''}
    />
  );
}
