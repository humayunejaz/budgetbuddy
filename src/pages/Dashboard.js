import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import ExpenseChart from "../components/ExpenseChart";

function Dashboard() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(1000); // default budget
  const [budgetInput, setBudgetInput] = useState("");

  const defaultCategories = [
    "Groceries",
    "Rent",
    "Transportation",
    "Utilities",
    "Entertainment",
    "Health",
    "Other",
  ];

  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return alert("Please fill in all fields");

    if (editingId) {
      await updateDoc(doc(db, "expenses", editingId), {
        amount: parseFloat(amount),
        category,
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "expenses"), {
        uid: user.uid,
        amount: parseFloat(amount),
        category,
        timestamp: new Date(),
      });
    }

    setAmount("");
    setCategory("");
  };

  const handleEdit = (expense) => {
    setAmount(expense.amount);
    setCategory(expense.category);
    setEditingId(expense.id);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this expense?");
    if (confirm) {
      await deleteDoc(doc(db, "expenses", id));
    }
  };

  const handleBudgetUpdate = () => {
    if (!budgetInput || isNaN(budgetInput)) return;
    setMonthlyBudget(parseFloat(budgetInput));
    setBudgetInput("");
  };

  // Calculate total for current month
  const currentMonthTotal = expenses.reduce((total, expense) => {
    const date = new Date(expense.timestamp?.seconds * 1000 || expense.timestamp);
    const now = new Date();
    if (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    ) {
      return total + expense.amount;
    }
    return total;
  }, 0);

  const progressPercent = Math.min(
    Math.round((currentMonthTotal / monthlyBudget) * 100),
    100
  );

  useEffect(() => {
    const q = query(
      collection(db, "expenses"),
      where("uid", "==", user?.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(data);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welcome, {user?.email}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Log Out
        </button>
      </div>

      {/* BUDGET TRACKER */}
      <div className="bg-white p-4 rounded shadow-md mb-6 max-w-md">
        <h2 className="text-xl font-semibold mb-2">Monthly Budget</h2>
        <div className="mb-2">
          <input
            type="number"
            placeholder="Enter monthly budget"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="w-full p-2 border mb-2"
          />
          <button
            onClick={handleBudgetUpdate}
            className="bg-green-500 text-white w-full py-2 rounded hover:bg-green-600"
          >
            Set Budget
          </button>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-5 overflow-hidden">
          <div
            className="bg-blue-500 h-5"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-sm mt-1 text-gray-700">
          ${currentMonthTotal.toFixed(2)} spent of ${monthlyBudget.toFixed(2)} (
          {progressPercent}%)
        </p>
      </div>

      {/* Add/Edit Expense Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-4 rounded shadow-md max-w-md"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Expense" : "Add Expense"}
        </h2>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border mb-3"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border mb-3"
        >
          <option value="">Select category</option>
          {defaultCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          {editingId ? "Update Expense" : "Add Expense"}
        </button>
        {editingId && (
          <button
            onClick={() => {
              setEditingId(null);
              setAmount("");
              setCategory("");
            }}
            type="button"
            className="w-full mt-2 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* Grouped Expense List */}
      <div className="max-w-md bg-white p-4 rounded shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">Your Expenses</h2>
        {expenses.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          Object.entries(
            expenses
              .sort(
                (a, b) =>
                  new Date(b.timestamp?.seconds * 1000 || b.timestamp) -
                  new Date(a.timestamp?.seconds * 1000 || a.timestamp)
              )
              .reduce((groups, expense) => {
                const date = new Date(
                  expense.timestamp?.seconds * 1000 || expense.timestamp
                );
                const month = date.toLocaleString("default", { month: "long" });
                const year = date.getFullYear();
                const groupKey = `${month} ${year}`;
                if (!groups[groupKey]) groups[groupKey] = [];
                groups[groupKey].push(expense);
                return groups;
              }, {})
          ).map(([monthYear, group]) => (
            <div key={monthYear} className="mb-4">
              <h3 className="text-md font-bold text-gray-700 mb-2">{monthYear}</h3>
              <ul className="border rounded">
                {group.map((exp) => (
                  <li
                    key={exp.id}
                    className="flex justify-between items-center border-b px-4 py-2"
                  >
                    <div>
                      <span className="font-medium">{exp.category}</span> – $
                      {exp.amount.toFixed(2)}
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEdit(exp)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Chart */}
      <ExpenseChart expenses={expenses} />
    </div>
  );
}

export default Dashboard;
