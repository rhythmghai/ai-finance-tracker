// client/src/components/Budget.jsx
import React, { useEffect, useState } from "react";
import API from "../api";
import { SpendingPie, ForecastBar } from "./Charts";

console.log("BASE URL:", API.defaults.baseURL);

export default function Budget() {
  const [budget, setBudget] = useState(null);
  const [summary, setSummary] = useState([]);
  const [predict, setPredict] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI Budget States
  const [targetSavings, setTargetSavings] = useState("");
  const [aiBudget, setAiBudget] = useState(null);

  // Debug / status
  const [statusMsg, setStatusMsg] = useState("");

  // Load initial budget + charts + prediction
  async function load() {
    setLoading(true);
    setStatusMsg("");
    try {
      const b = await API.get("/api/budget");
      setBudget(b.data || null);

      const s = await API.get("/api/transactions/summary");
      setSummary(s.data || []);

      const p = await API.get("/api/budget/predict");
      setPredict(p.data || null);

    } catch (err) {
      console.error("Error loading budget data", err);
      setStatusMsg(
        (err?.response && `${err.response.status} ${err.response.statusText}`) ||
        "Network error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // AI Budget Generator (OFFLINE SMART BUDGET)
  async function generateAIBudget() {
    setStatusMsg("");
    try {
      const res = await API.post("/api/budget/generate", {
        targetSavings: Number(targetSavings) || 0,
      });

      setAiBudget(res.data);

      // Optionally sync the main budget section
      setBudget((prev) => ({ ...(prev || {}), ...res.data }));

      setStatusMsg("AI budget generated.");
    } catch (err) {
      console.error("AI budget error", err);
      setStatusMsg(
        err?.response?.data?.error ||
        (err?.response && `${err.response.status} ${err.response.statusText}`) ||
        "Error generating AI budget"
      );
    }
  }

  // Manual API test helper
  async function checkApi() {
    try {
      const r = await API.get("/api/budget");
      setStatusMsg("API OK: /api/budget returned");
      console.log("/api/budget", r.data);
    } catch (e) {
      console.error("API check failed", e);
      setStatusMsg(
        (e?.response &&
          `${e.response.status} ${e.response.data?.error || e.response.statusText}`) ||
        "Network error"
      );
    }
  }

  // Loading Screen
  if (loading)
    return (
      <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border">
        Loading budget…
      </div>
    );

  // No budget fallback
  if (!budget)
    return (
      <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border">
        Unable to load budget data.
        <div className="mt-2">
          <button
            onClick={checkApi}
            className="mt-2 px-3 py-1 rounded bg-pink-200 hover:bg-pink-300"
          >
            Check API
          </button>
          <div className="text-sm text-red-500 mt-1">{statusMsg}</div>
        </div>
      </div>
    );

  // --------------------
  // MAIN UI RENDER
  // --------------------
  return (
    <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border dark:bg-gray-800/60 dark:border-gray-700">

      {/* AI SMART BUDGET PANEL */}
      <div className="p-4 mb-4 rounded-2xl shadow-lg bg-gradient-to-br from-pink-100 to-blue-100 dark:from-gray-700 dark:to-gray-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
          AI Monthly Budget Planner 🤖✨
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Enter how much you want to save each month. Our model will generate a smart budget with recommended spending categories.
        </p>

        <div className="flex gap-2 mb-3">
          <input
            type="number"
            value={targetSavings}
            onChange={(e) => setTargetSavings(e.target.value)}
            placeholder="Savings goal (₹)"
            className="flex-1 p-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
          />

          <button
            onClick={generateAIBudget}
            className="px-4 py-2 rounded-md bg-purple-400 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-700 text-white"
          >
            Generate
          </button>
        </div>

        {statusMsg && <div className="text-sm text-red-500 mb-2">{statusMsg}</div>}

        {/* AI BUDGET OUTPUT */}
        {aiBudget ? (
          <div className="mt-3 text-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              Income: ₹{aiBudget.income ?? "—"}
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Avg Monthly Expense: ₹
              {aiBudget.avgExpense ?? aiBudget.avgMonthlyExpense ?? "—"}
            </p>

            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              Suggested Allocation:
            </h4>

            <ul className="ml-3 text-gray-700 dark:text-gray-300">
              {aiBudget.suggested
                ? Object.entries(aiBudget.suggested).map(([k, v]) => (
                    <li key={k}>{k}: ₹{v}</li>
                  ))
                : "—"}
            </ul>
          </div>
        ) : (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Income: ₹{budget.income ?? 0}
            <br />
            Avg Monthly Expense: ₹{budget.avgExpense ?? 0}
            <br />
            Suggested Allocation: (Generate AI to see suggestion)
          </div>
        )}
      </div>

      {/* STANDARD BUDGET SUMMARY */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-gray-700 dark:text-gray-100">
            Smart Budget
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Income: ₹{budget.income ?? 0} • Fixed: ₹{budget.fixed ?? 0} • Remaining: ₹{budget.remaining ?? 0}
          </p>
        </div>

        <div className="text-right max-w-xs">
          <p className="text-sm text-gray-500 dark:text-gray-400">Savings advice</p>
          <p className="text-xs text-gray-600 dark:text-gray-300 break-words">
            {budget.advice || "—"}
          </p>
        </div>
      </div>

      {/* RECOMMENDED ALLOCATION + PIE CHART */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-100">
            Recommended Allocation
          </h4>

          <ul className="text-sm text-gray-700 dark:text-gray-300">
            {Object.entries(budget.suggested || {}).length ? (
              Object.entries(budget.suggested).map(([k, v]) => (
                <li key={k} className="mb-1 capitalize">
                  {k}: ₹{v}
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-500">No allocation yet</li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-100">
            Spending Breakdown (30d)
          </h4>

          {summary && summary.length > 0 ? (
            <SpendingPie data={summary} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent spending data.</p>
          )}
        </div>
      </div>

      {/* FORECAST SECTION */}
      <div className="mt-6">
        <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-100">
          Monthly History
        </h4>

        {predict?.history && predict.history.length > 0 ? (
          <ForecastBar history={predict.history} />
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No history available.</p>
        )}

        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Predicted next month: <span className="font-semibold">₹{predict?.predicted ?? "—"}</span>
        </p>
      </div>
    </div>
  );
}
