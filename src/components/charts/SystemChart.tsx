'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '@/context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type KPIData = { affected_system: string | null; count: number };

interface SystemChartProps {
  data: KPIData[];
}

export default function SystemChart({ data }: SystemChartProps) {
  const { theme } = useTheme();
  const chartData = {
    labels: data.map((d) => d.affected_system || 'Unknown'),
    datasets: [
      {
        label: 'Top Affected Systems',
        data: data.map((d) => d.count),
        backgroundColor: '#3B82F6',
        borderColor: '#2563EB',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    scales: {
      x: { beginAtZero: true, title: { display: true, text: 'Number of Threats' } },
      y: { title: { display: true, text: 'System' } },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Top Affected Systems (Last 7 Days)',
        color: theme === 'dark' ? '#e5e7eb' : '#1f2937',
      },
    },
  };

  return (
    <div className="bg-card border border-border p-4 rounded-lg shadow">
      <Bar data={chartData} options={options} />
    </div>
  );
}