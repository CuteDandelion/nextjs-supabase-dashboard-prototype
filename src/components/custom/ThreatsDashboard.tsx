'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/utils/supabase/client';

type Threat = {
  id: number;
  timestamp: string;
  threat_type: string;
  severity: string;
  source_ip: string;
  destination_ip: string;
  description: string;
  status: string;
  affected_system: string;
};

interface ThreatsDashboardProps {
  initialThreats: Threat[];
}

export default function ThreatsDashboard({ initialThreats }: ThreatsDashboardProps) {
  const [threats, setThreats] = useState<Threat[]>(initialThreats);

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabaseClient
      .channel('threats-channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'threats' },
        (payload) => {
          setThreats((prev) => [payload.new as Threat, ...prev]);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cybersecurity Threat Dashboard</h1>
      <table className="min-w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Timestamp</th>
            <th className="border p-2">Threat Type</th>
            <th className="border p-2">Severity</th>
            <th className="border p-2">Source IP</th>
            <th className="border p-2">Destination IP</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Affected System</th>
          </tr>
        </thead>
        <tbody>
          {threats.map((threat) => (
            <tr key={threat.id}>
              <td className="border p-2">{new Date(threat.timestamp).toLocaleString()}</td>
              <td className="border p-2">{threat.threat_type}</td>
              <td className="border p-2">{threat.severity}</td>
              <td className="border p-2">{threat.source_ip}</td>
              <td className="border p-2">{threat.destination_ip}</td>
              <td className="border p-2">{threat.description}</td>
              <td className="border p-2">{threat.status}</td>
              <td className="border p-2">{threat.affected_system}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}