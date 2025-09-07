'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useTheme } from '@/context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend);

type KPIData = { threat_type: string | null; count: number };

interface TypeChartProps {
  data: KPIData[];
}

export default function TypeChart({ data }: TypeChartProps) {
  const { theme } = useTheme();
  const chartData = {
    labels: data.map((d) => d.threat_type || 'Unknown'),
    datasets: [
      {
        label: 'Threats by Type',
        data: data.map((d) => d.count),
        backgroundColor: [
          '#3B82F6', // Blue
          '#FBBF24', // Yellow
          '#F97316', // Orange
          '#EF4444', // Red
          '#14B8A6', // Teal
          '#8B5CF6', // Purple
        ],
        borderColor: [
          '#2563EB',
          '#F59E0B',
          '#EA580C',
          '#DC2626',
          '#0D9488',
          '#7C3AED',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: 'right' as const, labels: { color: theme === 'dark' ? '#e5e7eb' : '#1f2937' } },
      title: {
        display: true,
        text: 'Threats by Type (Last 7 Days)',
        color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
      },
    },
  };

  return (
    <div className="bg-card border border-border p-4 rounded-lg shadow">
      <Pie data={chartData} options={options} />
    </div>
  );
}