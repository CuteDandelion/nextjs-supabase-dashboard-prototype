import { createClient } from '@/utils/supabase/server';
import ThreatsDashboard from '@/components/custom/ThreatsDashboard';

export const revalidate = 0; // Disable caching for real-time data

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: threats, error } = await supabase
        .from('threats')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

  if (error) {
    console.error('Error fetching threats:', error);
    return <div>Error loading threats</div>;
  }

  return <ThreatsDashboard initialThreats={threats} />;
}