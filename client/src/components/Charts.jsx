// client/src/components/Charts.jsx
import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

// ---------------------------------------------------
// PIE CHART — Spending Breakdown
// ---------------------------------------------------
export function SpendingPie({ data }) {
  const labels = data.map((d) => d._id || "Other");
  const values = data.map((d) => d.total || 0);

  const colors = [
    "#FF6384", "#36A2EB", "#FFCE56",
    "#4BC0C0", "#9966FF", "#FF9F40",
    "#C9CBCF", "#8ED1FC"
  ];

  const chartData = {
    labels,
    datasets: [
      {
        label: "Spend",
        data: values,
        backgroundColor: colors.slice(0, values.length),
        borderColor: "#fff",
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  return <Pie data={chartData} />;
}

// ---------------------------------------------------
// BAR CHART — Monthly Expense History
// ---------------------------------------------------
export function ForecastBar({ history }) {
  const labels = history.map((h) => h._id || h.month || "Month");
  const vals = history.map((h) => h.total || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Monthly Expense",
        data: vals,
        backgroundColor: "#8E44AD",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: "#666" },
      },
      x: {
        ticks: { color: "#666" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#444" },
      },
    },
  };

  return (
    <div style={{ height: 220 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
