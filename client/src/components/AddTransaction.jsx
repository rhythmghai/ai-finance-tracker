// client/src/components/AddTransaction.jsx
import React, { useState } from "react";
import API from "../api";

export default function AddTransaction({ onAdded }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    note: "",
    type: "expense",
  });

  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/api/transactions", {
        ...form,
        amount: Number(form.amount),
        date: new Date().toISOString(), // ✅ CRITICAL FIX
      });

      // Reset form
      setForm({ amount: "", category: "", note: "", type: "expense" });

      // Refresh parent list
      onAdded && onAdded();
    } catch (error) {
      console.error(error);
      alert("Error adding transaction");
    }

    setLoading(false);
  }

  return (
    <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow border pastel-card">
      <h3 className="font-semibold mb-2 text-gray-700">Add Transaction</h3>

      <form onSubmit={submit}>
        <input
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="Amount"
          required
          className="w-full p-2 mb-2 border rounded-md"
        />

        <input
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          placeholder="Category (e.g., Food)"
          required
          className="w-full p-2 mb-2 border rounded-md"
        />

        <input
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Note (optional)"
          className="w-full p-2 mb-2 border rounded-md"
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="w-full p-2 mb-2 border rounded-md"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button
          disabled={loading}
          className="w-full py-2 rounded-full bg-green-200 hover:bg-green-300 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}
