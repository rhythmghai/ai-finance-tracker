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

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export function SpendingPie({ data }) {
  const labels = data.map((d) => d._id || "Other");
  const values = data.map((d) => d.total || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Spend",
        data: values,
        hoverOffset: 6,
      },
    ],
  };

  return <Pie data={chartData} />;
}

export function ForecastBar({ history }) {
  const labels = history.map((h) => h._id || h.month || "");
  const vals = history.map((h) => h.total || 0);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Monthly Expense",
        data: vals,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: 200 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
