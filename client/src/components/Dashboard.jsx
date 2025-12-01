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
  const [darkMode, setDarkMode] = useState(false);

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
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    loadTxs();

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleTheme() {
    const newTheme = !darkMode;
    setDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div
      className={`p-6 min-h-screen transition 
      ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-b from-blue-50 via-pink-50 to-green-50"}`}
    >
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold drop-shadow-sm">
          Finance Tracker 💰
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="py-2 px-4 rounded-full bg-gray-200 hover:bg-gray-300 
              dark:bg-gray-700 dark:hover:bg-gray-600 
              text-gray-700 dark:text-gray-200 shadow-md transition"
          >
            {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>

          <button
            onClick={logout}
            className="py-2 px-4 rounded-full bg-pink-200 hover:bg-pink-300 
              dark:bg-pink-600 dark:hover:bg-pink-500 shadow-md transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4 md:col-span-1">
          <AddTransaction onAdded={loadTxs} />
          <Subscriptions />
          <Bills />
        </div>

        <div className="md:col-span-2 space-y-4">
          <Budget />

          <div
            className={`p-4 rounded-2xl shadow border pastel-card 
              ${darkMode ? "bg-gray-800/60 border-gray-700" : "bg-white/80 backdrop-blur-md"}`}
          >
            <h3 className="font-semibold mb-3">
              Recent Transactions
            </h3>

            {loading ? (
              <p className="text-sm opacity-70">Loading...</p>
            ) : txs.length ? (
              txs.map((tx) => (
                <div
                  key={tx._id}
                  className="flex justify-between items-center border-b dark:border-gray-700 py-2 last:border-b-0"
                >
                  <div>
                    <div className="font-medium capitalize">
                      {tx.category} • {tx.type}
                    </div>
                    {tx.note && (
                      <div className="text-sm opacity-70">{tx.note}</div>
                    )}
                  </div>

                  <div
                    className={`font-semibold ${
                      tx.type === "expense" ? "text-red-500" : "text-green-500"
                    }`}
                  >
                    ₹{tx.amount}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm opacity-70">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
