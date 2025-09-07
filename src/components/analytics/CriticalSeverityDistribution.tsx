'use client'; // Required for Next.js client-side component

import { ApexOptions } from "apexcharts";

import dynamic from "next/dynamic";
import React from 'react';
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const CriticalDistChart = () => {
  const options = {
    chart: {
      type: 'donut',
    },
    series: [75, 25], // Example data: 75% progress, 25% remaining
    labels: ['Progress', 'Remaining'],
    colors: ['#4BC0C0', '#E8ECEF'], // Progress color, Remaining (light gray)
    plotOptions: {
      pie: {
        startAngle: -90, // Start from top
        endAngle: 90,   // End at 180 degrees
        donut: {
          size: '70%', // Thickness of the donut
        },
      },
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      position: 'bottom',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
  };

  return (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
    <div style={{ width: '300px', height: '300px' }}>
      <Chart
        options={options}
        series={options.series}
        type="donut"
        width="100%"
        height="100%"
      />
    </div>
  </div>
  );
};

export default CriticalDistChart;