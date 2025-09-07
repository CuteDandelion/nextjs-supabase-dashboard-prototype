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

type KPIData = { severity: string | null; count: number };

interface SeverityChartProps {
  data: KPIData[];
}

export default function SeverityChart({ data }: SeverityChartProps) {
  const { theme } = useTheme();
  const chartData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [
      {
        label: 'Threats by Severity',
        data: [
          data.find((d) => d.severity === 'low')?.count || 0,
          data.find((d) => d.severity === 'medium')?.count || 0,
          data.find((d) => d.severity === 'high')?.count || 0,
          data.find((d) => d.severity === 'critical')?.count || 0,
        ],
        backgroundColor: ['#3B82F6', '#FBBF24', '#F97316', '#EF4444'],
        borderColor: ['#2563EB', '#F59E0B', '#EA580C', '#DC2626'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Threats' } },
      x: { title: { display: true, text: 'Severity' } },
    },
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Threats by Severity (Last 7 Days)',
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