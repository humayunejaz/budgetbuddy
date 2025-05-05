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
import ExportCSV from "../components/ExportCSV";

function Dashboard() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [monthlyBudget, setMonthlyBudget] = useState(1000);
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
    if (window.confirm("Are you sure you want to delete this expense?")) {
      await deleteDoc(doc(db, "expenses", id));
    }
  };

  const handleBudgetUpdate = () => {
    if (!budgetInput || isNaN(budgetInput)) return;
    setMonthlyBudget(parseFloat(budgetInput));
    setBudgetInput("");
  };

  const currentMonthTotal = expenses.reduce((total, expense) => {
    const date = new Date(expense.timestamp?.seconds * 1000 || expense.timestamp);
    const now = new Date();
    if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()) {
      return total + expense.amount;
    }
    return total;
  }, 0);

  const progressPercent = Math.min(Math.round((currentMonthTotal / monthlyBudget) * 100), 100);

  useEffect(() => {
    const q = query(collection(db, "expenses"), where("uid", "==", user?.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setExpenses(data);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome, {user?.email}</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
          >
            Log Out
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <ExportCSV expenses={expenses} />
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Set Monthly Budget"
              className="px-3 py-2 border rounded-md"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
            <button
              onClick={handleBudgetUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Update Budget
            </button>
          </div>
        </div>

        <div className="mb-6">
          <p className="font-medium text-gray-700 mb-2">This Month's Spending:</p>
          <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
            <div
              className="bg-green-500 h-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            ${currentMonthTotal.toFixed(2)} of ${monthlyBudget} ({progressPercent}%)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div className="flex gap-4">
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="px-4 py-2 border rounded-md w-1/2"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded-md w-1/2"
            >
              <option value="">Select Category</option>
              {defaultCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
          >
            {editingId ? "Update" : "Add"} Expense
          </button>
        </form>

        <ul className="divide-y divide-gray-200">
          {expenses.map((exp) => (
            <li key={exp.id} className="py-3 flex justify-between items-center">
              <span>{exp.category} - ${exp.amount.toFixed(2)}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(exp)}
                  className="px-3 py-1 bg-yellow-400 rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(exp.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <ExpenseChart expenses={expenses} />
      </div>
    </div>
  );
}

export default Dashboard;