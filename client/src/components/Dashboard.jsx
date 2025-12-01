import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import AddTransaction from "./AddTransaction";
import Subscriptions from "./Subscriptions";
import Bills from "./Bills";
import Budget from "./Budget";

export default function Dashboard() {
  const navigate = useNavigate();

  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadTxs() {
    try {
      const res = await API.get("/api/transactions");
      setTxs(res.data || []);
    } catch (e) {
      console.log("Error loading transactions", e);
    }
    setLoading(false);
  }

  useEffect(() => {
    // redirect if not logged in
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }

    loadTxs();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 via-pink-50 to-green-50">
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700 drop-shadow-sm">
          Finance Tracker 💰
        </h1>

        <button
          onClick={logout}
          className="py-2 px-4 rounded-full bg-pink-200 hover:bg-pink-300 shadow-md transition"
        >
          Logout
        </button>
      </header>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-4 md:col-span-1">
          <AddTransaction onAdded={loadTxs} />
          <Subscriptions />
          <Bills />
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-2 space-y-4">
          <Budget />

          {/* TRANSACTIONS CARD */}
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow pastel-card border">
            <h3 className="font-semibold mb-3 text-gray-700">
              Recent Transactions
            </h3>

            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : txs.length ? (
              txs.map((tx) => (
                <div
                  key={tx._id}
                  className="flex justify-between items-center border-b py-2 last:border-b-0"
                >
                  <div>
                    <div className="font-medium capitalize">
                      {tx.category} • {tx.type}
                    </div>
                    {tx.note && (
                      <div className="text-sm text-gray-500">{tx.note}</div>
                    )}
                  </div>

                  <div
                    className={`font-semibold ${
                      tx.type === "expense"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    ₹{tx.amount}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
