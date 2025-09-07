import type { Metadata } from "next";
import React from "react";

import { createClient } from '@/utils/supabase/server';
import ThreatsDashboard from '@/components/ThreatsDashboard';

export const revalidate = 0; // Disable caching for real-time data

export const metadata: Metadata = {
  title:
    "Next.js - Threats Analytics Dashboard",
  description: "This is a demo, currently using as a placeholder",
};

export default async function DashboardPage() {
  const supabase = await createClient(); 

  // Fetch initial threats (sorted by timestamp DESC)
  const { data: threats, error: threatsError } = await supabase
    .from('threats')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100);

  // Fetch KPI: Total Active Threats
  const { count: activeThreats, error: activeError } = await supabase
    .from('threats')
    .select('*', { count: 'exact', head: true })
    .in('status', ['detected', 'ongoing']);

  // Fetch KPI: Threats by Severity (last 7 days)
  const { data: severityData, error: severityError } = await supabase
   .rpc('get_threats_by_severity', {
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

  // Fetch KPI: Threats by Type (last 7 days)
  const { data: typeData, error: typeError } = await supabase
    .rpc('get_threats_by_type', {
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

  // Fetch KPI: Top Affected Systems (last 7 days)
  const { data: systemData, error: systemError } = await supabase
     .rpc('get_top_affected_systems', {
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

  if (threatsError || activeError || severityError || typeError || systemError) {
    console.error('Error fetching data:', { threatsError, activeError, severityError, typeError, systemError });
    return <div className="p-4 text-red-500">Error loading dashboard</div>;
  }

  return (
    <ThreatsDashboard
      initialThreats={threats || []}
      initialActiveThreats={activeThreats || 0}
      initialSeverityData={severityData || []}
      initialTypeData={typeData || []}
      initialSystemData={systemData || []}
    />
  );
}
