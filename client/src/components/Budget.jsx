import React, { useEffect, useState } from "react";
import API from "../api";
import { SpendingPie, ForecastBar } from "./Charts";

export default function Budget() {
  const [budget, setBudget] = useState(null);
  const [summary, setSummary] = useState([]);
  const [predict, setPredict] = useState(null);
  const [loading, setLoading] = useState(true);

  // AI Budget States
  const [targetSavings, setTargetSavings] = useState("");
  const [aiBudget, setAiBudget] = useState(null);

  async function load() {
    try {
      const b = await API.get("/api/budget");
      setBudget(b.data);

      const s = await API.get("/api/transactions/summary");
      setSummary(s.data || []);

      const p = await API.get("/api/budget/predict");
      setPredict(p.data);
    } catch (err) {
      console.error("Error loading budget data", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // AI Budget Generator
  async function generateAIBudget() {
    try {
      const res = await API.post("/api/budget/generate", {
        targetSavings: Number(targetSavings),
      });

      setAiBudget(res.data);
    } catch (err) {
      console.error("AI budget error", err);
    }
  }

  if (loading)
    return (
      <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border">
        Loading budget…
      </div>
    );

  if (!budget)
    return (
      <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border">
        Unable to load budget data.
      </div>
    );

  return (
    <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border dark:bg-gray-800/60 dark:border-gray-700">
      
      {/* AI SMART BUDGET PANEL */}
      <div className="p-4 mb-4 rounded-2xl shadow-lg bg-gradient-to-br from-pink-100 to-blue-100 dark:from-gray-700 dark:to-gray-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
          AI Monthly Budget Planner 🤖✨
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Enter how much you want to save each month.  
          Our model will generate a smart budget with recommended spending categories.
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

        {aiBudget && (
          <div className="mt-3 text-sm">
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              Income: ₹{aiBudget.income}
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Avg Monthly Expense: ₹{aiBudget.avgExpense}
            </p>

            <h4 className="font-semibold text-gray-800 dark:text-gray-100">
              Suggested Allocation:
            </h4>

            <ul className="ml-3 text-gray-700 dark:text-gray-300">
              {Object.entries(aiBudget.suggested).map(([k, v]) => (
                <li key={k}>{k}: ₹{v}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Standard Budget Panel */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-gray-700 dark:text-gray-100">
            Smart Budget
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Income: ₹{budget.income} • Fixed: ₹{budget.fixed} • Remaining: ₹{budget.remaining}
          </p>
        </div>

        <div className="text-right max-w-xs">
          <p className="text-sm text-gray-500 dark:text-gray-400">Savings advice</p>
          <p className="text-xs text-gray-600 dark:text-gray-300 break-words">
            {budget.advice || "—"}
          </p>
        </div>
      </div>

      {/* Allocation + Charts */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-100">
            Recommended Allocation
          </h4>

          <ul className="text-sm text-gray-700 dark:text-gray-300">
            {Object.entries(budget.suggested || {}).map(([k, v]) => (
              <li key={k} className="mb-1 capitalize">
                {k}: ₹{v}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-100">
            Spending Breakdown (30d)
          </h4>

          {summary.length > 0 ? (
            <SpendingPie data={summary} />
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent spending data.
            </p>
          )}
        </div>
      </div>

      {/* Forecast */}
      <div className="mt-6">
        <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-100">
          Monthly History
        </h4>

        {predict?.history ? (
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
