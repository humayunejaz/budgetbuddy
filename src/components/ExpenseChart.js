import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ expenses }) {
  const categoryTotals = {};

  expenses.forEach(({ category, amount }) => {
    if (category in categoryTotals) {
      categoryTotals[category] += amount;
    } else {
      categoryTotals[category] = amount;
    }
  });

  const data = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Spending by Category",
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#6366F1", // Indigo
          "#F59E0B", // Amber
          "#EF4444", // Red
          "#10B981", // Green
          "#3B82F6", // Blue
          "#8B5CF6", // Violet
          "#EC4899", // Pink
          "#F97316", // Orange
          "#14B8A6", // Teal
          "#A855F7"  // Purple
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
      },
    },
  };

  return (
    <div className="bg-white p-4 mt-6 rounded shadow-md max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-center">Spending Breakdown</h2>
      <div style={{ width: "360px", height: "360px", margin: "0 auto" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}

export default ExpenseChart;
