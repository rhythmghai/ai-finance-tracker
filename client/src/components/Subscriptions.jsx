import React, { useEffect, useState } from "react";
import API from "../api";

export default function Subscriptions() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    provider: "",
    monthlyCost: "",
  });

  async function load() {
    try {
      const res = await API.get("/api/subscriptions");
      setList(res.data || []);
    } catch (err) {
      console.error("Error loading subscriptions:", err);
    }
    setLoading(false);
  }

  async function add(e) {
    e.preventDefault();
    if (!form.name || !form.provider || !form.monthlyCost) return;

    try {
      await API.post("/api/subscriptions", {
        name: form.name,
        provider: form.provider,
        monthlyCost: Number(form.monthlyCost),
      });

      setForm({ name: "", provider: "", monthlyCost: "" });
      load();
    } catch (err) {
      console.error("Error adding subscription:", err);
      alert("Error adding subscription");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border mb-4">
      <h3 className="font-semibold mb-2 text-gray-700">Subscriptions</h3>

      {/* Add Subscription Form */}
      <form onSubmit={add}>
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name e.g., Netflix"
          className="w-full p-2 mb-2 border rounded-md"
          required
        />

        <input
          value={form.provider}
          onChange={(e) => setForm({ ...form, provider: e.target.value })}
          placeholder="Provider (e.g., OTT platform)"
          className="w-full p-2 mb-2 border rounded-md"
          required
        />

        <input
          value={form.monthlyCost}
          onChange={(e) =>
            setForm({ ...form, monthlyCost: e.target.value })
          }
          placeholder="Monthly cost"
          className="w-full p-2 mb-2 border rounded-md"
          required
        />

        <button className="w-full py-2 rounded-full bg-purple-200 hover:bg-purple-300 transition">
          Add
        </button>
      </form>

      {/* Subscription List */}
      <div className="mt-3">
        {loading ? (
          <p className="text-sm text-gray-500">Loading subscriptions…</p>
        ) : list.length ? (
          list.map((s) => (
            <div key={s._id} className="mt-2 text-sm text-gray-700">
              {s.name} — ₹{s.monthlyCost}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No subscriptions added yet</p>
        )}
      </div>
    </div>
  );
}
