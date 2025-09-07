'use client';

import { useEffect, useState } from 'react';
import { supabaseClient } from '@/utils/supabase/client';
import { useTheme } from '@/context/ThemeContext';
import SeverityChart from './charts/SeverityChart';
import TypeChart from './charts/TypeChart';
import SystemChart from './charts/SystemChart';
import ThreatTable from './ThreatTable';

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

type KPIData = {
  severity: string | null;
  threat_type: string | null;
  affected_system: string | null;
  count: number;
};

interface ThreatsDashboardProps {
  initialThreats: Threat[];
  initialActiveThreats: number;
  initialSeverityData: KPIData[];
  initialTypeData: KPIData[];
  initialSystemData: KPIData[];
}

export default function ThreatsDashboard({
  initialThreats,
  initialActiveThreats,
  initialSeverityData,
  initialTypeData,
  initialSystemData,
}: ThreatsDashboardProps) {
  const { theme, toggleTheme } = useTheme();
  const [threats, setThreats] = useState<Threat[]>(initialThreats);
  const [activeThreats, setActiveThreats] = useState(initialActiveThreats);
  const [severityData, setSeverityData] = useState(initialSeverityData);
  const [typeData, setTypeData] = useState(initialTypeData);
  const [systemData, setSystemData] = useState(initialSystemData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const channel = supabaseClient
      .channel('threats-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'threats' },
        (payload) => {
          setThreats((prev) => {
            let updatedThreats = [...prev];
            if (payload.eventType === 'INSERT') {
              updatedThreats = [...prev, payload.new as Threat];
              if (['detected', 'ongoing'].includes(payload.new.status)) {
                setActiveThreats((prev) => prev + 1);
              }
              // Update KPIs for last 7 days
              const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              if (new Date(payload.new.timestamp) >= sevenDaysAgo) {
                setSeverityData((prev) => {
                  const existing = prev.find((d) => d.severity === payload.new.severity);
                  if (existing) {
                    return prev.map((d) =>
                      d.severity === payload.new.severity ? { ...d, count: d.count + 1 } : d
                    );
                  }
                  return [...prev, { severity: payload.new.severity, count: 1 }];
                });
                setTypeData((prev) => {
                  const existing = prev.find((d) => d.threat_type === payload.new.threat_type);
                  if (existing) {
                    return prev.map((d) =>
                      d.threat_type === payload.new.threat_type ? { ...d, count: d.count + 1 } : d
                    );
                  }
                  return [...prev, { threat_type: payload.new.threat_type, count: 1 }];
                });
                setSystemData((prev) => {
                  const existing = prev.find((d) => d.affected_system === payload.new.affected_system);
                  if (existing) {
                    return prev.map((d) =>
                      d.affected_system === payload.new.affected_system
                        ? { ...d, count: d.count + 1 }
                        : d
                    ).sort((a, b) => b.count - a.count).slice(0, 5);
                  }
                  return [...prev, { affected_system: payload.new.affected_system, count: 1 }]
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);
                });
              }
            } else if (payload.eventType === 'UPDATE') {
              updatedThreats = prev.map((threat) =>
                threat.id === payload.new.id ? (payload.new as Threat) : threat
              );
              if (
                ['detected', 'ongoing'].includes(payload.new.status) &&
                !['detected', 'ongoing'].includes(payload.old.status)
              ) {
                setActiveThreats((prev) => prev + 1);
              } else if (
                !['detected', 'ongoing'].includes(payload.new.status) &&
                ['detected', 'ongoing'].includes(payload.old.status)
              ) {
                setActiveThreats((prev) => prev - 1);
              }
            } else if (payload.eventType === 'DELETE') {
              updatedThreats = prev.filter((threat) => threat.id !== payload.old.id);
              if (['detected', 'ongoing'].includes(payload.old.status)) {
                setActiveThreats((prev) => prev - 1);
              }
            }
            return updatedThreats.sort(
              (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
          });
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to Realtime channel');
          setError(null);
        } else if (err) {
          console.error('Realtime subscription error:', err);
          setError(`Failed to connect to Realtime: ${err.message || 'Unknown error'}`);
        }
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-4 bg-background text-foreground min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cybersecurity Threat Dashboard</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded bg-gray-200 dark:bg-gray-700 text-foreground hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Active Threats</h2>
          <p className="text-3xl">{activeThreats}</p>
        </div>
        <SeverityChart data={severityData} />
        <TypeChart data={typeData} />
        <SystemChart data={systemData} />
      </div>
      <h2 className="text-xl font-semibold mb-2">Recent Threats</h2>
      <ThreatTable threats={threats} />
    </div>
  );
}