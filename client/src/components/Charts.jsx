import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function SpendingPie({ data }) {
  const chart = {
    labels: data.map(d => d._id || 'Other'),
    datasets: [{ label: 'Spend', data: data.map(d=>d.total), hoverOffset: 6 }]
  };
  return <Pie data={chart} />;
}

export function ForecastBar({ history }) {
  const labels = history.map(h => h.month);
  const vals = history.map(h => h.total);
  const chart = {
    labels,
    datasets: [{ label: 'Monthly Expense', data: vals }]
  };
  return <Bar data={chart} />;
}
