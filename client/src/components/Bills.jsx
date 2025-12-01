import React, { useEffect, useState } from "react";
import API from "../api";

export default function Bills() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    amount: "",
  });

  async function load() {
    try {
      const res = await API.get("/bills");
      setList(res.data || []);
    } catch (err) {
      console.error("Error loading bills:", err);
    }
    setLoading(false);
  }

  async function add(e) {
    e.preventDefault();
    if (!form.name || !form.amount) return;

    try {
      await API.post("/bills", {
        name: form.name,
        amount: Number(form.amount),
      });

      setForm({ name: "", amount: "" });
      load();
    } catch (err) {
      console.error("Error adding bill:", err);
      alert("Error adding bill");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow border pastel-card mb-4">
      <h3 className="font-semibold mb-2 text-gray-700">Bills</h3>

      {/* Add Bill Form */}
      <form onSubmit={add}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Bill name"
          className="w-full p-2 mb-2 border rounded-md"
          required
        />

        <input
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          placeholder="Amount"
          className="w-full p-2 mb-2 border rounded-md"
          required
        />

        <button className="w-full py-2 rounded-full bg-red-200 hover:bg-red-300">
          Add
        </button>
      </form>

      {/* Bill List */}
      <div className="mt-3">
        {loading ? (
          <p className="text-sm text-gray-500">Loading…</p>
        ) : list.length ? (
          list.map((b) => (
            <div key={b._id} className="mt-2 text-sm text-gray-700">
              {b.name} — ₹{b.amount}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No bills added yet</p>
        )}
      </div>
    </div>
  );
}
