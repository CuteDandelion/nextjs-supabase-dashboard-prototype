'use client';

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

interface ThreatTableProps {
  threats: Threat[];
}

export default function ThreatTable({ threats }: ThreatTableProps) {
  return (
    <div className="bg-card border border-border rounded-lg shadow overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="border border-border p-2 text-left">Timestamp</th>
            <th className="border border-border p-2 text-left">Threat Type</th>
            <th className="border border-border p-2 text-left">Severity</th>
            <th className="border border-border p-2 text-left">Source IP</th>
            <th className="border border-border p-2 text-left">Destination IP</th>
            <th className="border border-border p-2 text-left">Description</th>
            <th className="border border-border p-2 text-left">Status</th>
            <th className="border border-border p-2 text-left">Affected System</th>
          </tr>
        </thead>
        <tbody>
          {threats.map((threat) => (
            <tr key={threat.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
              <td className="border border-border p-2">{new Date(threat.timestamp).toLocaleString()}</td>
              <td className="border border-border p-2">{threat.threat_type}</td>
              <td className="border border-border p-2">{threat.severity}</td>
              <td className="border border-border p-2">{threat.source_ip}</td>
              <td className="border border-border p-2">{threat.destination_ip}</td>
              <td className="border border-border p-2">{threat.description}</td>
              <td className="border border-border p-2">{threat.status}</td>
              <td className="border border-border p-2">{threat.affected_system}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}