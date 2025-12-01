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
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  } // ← THIS IS THE CORRECT CLOSING BRACE (ONLY ONE!)

  // -------------------------------------------------------
  // DO NOT ADD ANY EXTRA BRACE HERE ❌
  // -------------------------------------------------------

  return (
    <div
      className={`p-6 min-h-screen transition ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-blue-50 via-pink-50 to-green-50"
      }`}
    >
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <h1
          className={`text-3xl font-bold drop-shadow-sm ${
            darkMode ? "text-white" : "text-gray-700"
          }`}
        >
          Finance Tracker 💰
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="py-2 px-3 rounded-full bg-purple-300 hover:bg-purple-400
            dark:bg-purple-600 dark:hover:bg-purple-700 shadow transition"
          >
            {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>

          <button
            onClick={logout}
            className="py-2 px-4 rounded-full bg-pink-200 hover:bg-pink-300 shadow-md transition"
          >
            Logout
          </button>
        </div>
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

          <div
            className={`p-4 rounded-2xl shadow pastel-card border ${
              darkMode
                ? "bg-gray-800/70 text-white border-gray-700"
                : "bg-white/80 backdrop-blur-md"
            }`}
          >
            <h3 className="font-semibold mb-3">Recent Transactions</h3>

            {loading ? (
              <p className="text-sm opacity-70">Loading...</p>
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
                      <div className="text-sm opacity-70">{tx.note}</div>
                    )}
                  </div>

                  <div
                    className={`font-semibold ${
                      tx.type === "expense"
                        ? "text-red-500"
                        : "text-green-500"
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
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div
      className={`p-6 min-h-screen transition ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-b from-blue-50 via-pink-50 to-green-50"
      }`}
    >
      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <h1
          className={`text-3xl font-bold drop-shadow-sm ${
            darkMode ? "text-white" : "text-gray-700"
          }`}
        >
          Finance Tracker 💰
        </h1>

        <div className="flex items-center gap-3">
          {/* DARK MODE TOGGLE */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="py-2 px-3 rounded-full bg-purple-300 hover:bg-purple-400 dark:bg-purple-600 dark:hover:bg-purple-700 shadow transition"
          >
            {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={logout}
            className="py-2 px-4 rounded-full bg-pink-200 hover:bg-pink-300 shadow-md transition"
          >
            Logout
          </button>
        </div>
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
          <div
            className={`p-4 rounded-2xl shadow pastel-card border ${
              darkMode
                ? "bg-gray-800/70 text-white border-gray-700"
                : "bg-white/80 backdrop-blur-md"
            }`}
          >
            <h3 className="font-semibold mb-3">Recent Transactions</h3>

            {loading ? (
              <p className="text-sm opacity-70">Loading...</p>
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
                      <div className="text-sm opacity-70">{tx.note}</div>
                    )}
                  </div>

                  <div
                    className={`font-semibold ${
                      tx.type === "expense"
                        ? "text-red-500"
                        : "text-green-500"
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
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-blue-50 via-pink-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      {/* HEADER */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-100 drop-shadow-sm">
          Finance Tracker 💰
        </h1>

        <div className="flex items-center gap-3">
          {/* DARK MODE TOGGLE */}
          <button
            onClick={() => {
              document.documentElement.classList.toggle("dark");
              localStorage.setItem(
                "theme",
                document.documentElement.classList.contains("dark")
                  ? "dark"
                  : "light"
              );
            }}
            className="py-2 px-4 rounded-full bg-gray-200 hover:bg-gray-300 
                       dark:bg-gray-700 dark:hover:bg-gray-600 
                       text-gray-700 dark:text-gray-200 shadow-md transition"
          >
            Toggle Theme
          </button>

          {/* LOGOUT BUTTON */}
          <button
            onClick={logout}
            className="py-2 px-4 rounded-full bg-pink-200 hover:bg-pink-300 
                       dark:bg-pink-600 dark:hover:bg-pink-500 
                       shadow-md transition"
          >
            Logout
          </button>
        </div>
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
          <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-md p-4 rounded-2xl shadow pastel-card border dark:border-gray-700">
            <h3 className="font-semibold mb-3 text-gray-700 dark:text-gray-100">
              Recent Transactions
            </h3>

            {loading ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            ) : txs.length ? (
              txs.map((tx) => (
                <div
                  key={tx._id}
                  className="flex justify-between items-center border-b dark:border-gray-700 py-2 last:border-b-0"
                >
                  <div>
                    <div className="font-medium capitalize text-gray-800 dark:text-gray-100">
                      {tx.category} • {tx.type}
                    </div>
                    {tx.note && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {tx.note}
                      </div>
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
              <p className="text-sm text-gray-500 dark:text-gray-400">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
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
