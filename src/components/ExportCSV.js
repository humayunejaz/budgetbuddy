import React from "react";
import { CSVLink } from "react-csv";

function ExportCSV({ expenses }) {
  const headers = [
    { label: "Date", key: "date" },
    { label: "Category", key: "category" },
    { label: "Amount", key: "amount" },
  ];

  const data = expenses.map((exp) => ({
    date: new Date(exp.timestamp?.seconds * 1000 || exp.timestamp).toLocaleDateString(),
    category: exp.category,
    amount: exp.amount.toFixed(2),
  }));

  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={`budgetbuddy-report-${new Date().toISOString().slice(0, 10)}.csv`}
      className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
    >
      Download CSV Report
    </CSVLink>
  );
}

export default ExportCSV;
