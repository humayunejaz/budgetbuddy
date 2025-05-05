// src/components/ExpenseChart.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ expenses }) {
  const categoryTotals = {};

  expenses.forEach(({ category, amount }) => {
    categoryTotals[category] = (categoryTotals[category] || 0) + amount;
  });

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Spending by Category",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#6366F1", "#F59E0B", "#EF4444", "#10B981", "#3B82F6",
          "#8B5CF6", "#EC4899", "#F97316", "#14B8A6", "#A855F7"
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 20,
          padding: 10,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 mt-6 rounded-xl shadow max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
        Spending Breakdown
      </h2>
      <div style={{ width: "360px", height: "360px", margin: "0 auto" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default ExpenseChart;