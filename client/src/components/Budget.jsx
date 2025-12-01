import React, { useEffect, useState } from "react";
import API from "../api";
import { SpendingPie, ForecastBar } from "./Charts";

export default function Budget() {
  const [budget, setBudget] = useState(null);
  const [summary, setSummary] = useState([]);
  const [predict, setPredict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingGoal, setSavingGoal] = useState("");

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

  // --- AI Budget Generation ---
  async function generateBudget() {
    if (!savingGoal) {
      alert("Please enter a saving goal");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await API.post("/api/budget/generate", {
        targetSavings: Number(savingGoal),
        userId: user.id,
      });

      setBudget(res.data);
      alert("AI Budget generated successfully!");

    } catch (err) {
      console.error(err);
      alert("Error generating budget");
    }
  }

  if (loading) {
    return (
      <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border">
        Loading budget…
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border">
        Unable to load budget data.
      </div>
    );
  }

  return (
    <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border">

      {/* Ask Saving Goal */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-1">How much do you want to save monthly?</p>

        <div className="flex gap-2">
          <input
            type="number"
            value={savingGoal}
            onChange={(e) => setSavingGoal(e.target.value)}
            placeholder="Enter amount"
            className="border p-2 rounded-md w-full"
          />
          <button
            onClick={generateBudget}
            className="px-4 py-2 bg-pink-200 hover:bg-pink-300 rounded-md"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-gray-700">AI Smart Budget</h3>
          <p className="text-sm text-gray-600">
            Income: ₹{budget.income} • Savings: ₹{budget.suggestedSavings} • Remaining: ₹{budget.remaining}
          </p>
        </div>
      </div>

      {/* Distribution + Pie */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Distribution */}
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700">Recommended Allocation</h4>
          <ul className="text-sm text-gray-700">
            {Object.entries(budget.suggested || {}).map(([k, v]) => (
              <li key={k} className="mb-1 capitalize">{k}: ₹{v}</li>
            ))}
          </ul>
        </div>

        {/* Spending Pie */}
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700">
            Spending Breakdown (30 days)
          </h4>
          {summary.length > 0 ? (
            <SpendingPie data={summary} />
          ) : (
            <p className="text-sm text-gray-500">No recent spending data.</p>
          )}
        </div>
      </div>

      {/* Prediction */}
      <div className="mt-6">
        <h4 className="font-semibold text-sm mb-2 text-gray-700">Monthly Forecast</h4>

        {predict?.history ? (
          <ForecastBar history={predict.history} />
        ) : (
          <p className="text-sm text-gray-500">No history available.</p>
        )}

        <p className="mt-2 text-sm text-gray-700">
          Predicted next month: <span className="font-semibold">₹{predict?.predicted ?? "—"}</span>
        </p>
      </div>

    </div>
  );
}
    );
  }

  if (!budget) {
    return (
      <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border">
        Unable to load budget data.
      </div>
    );
  }

  return (
    <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-gray-700">Smart Budget</h3>
          <p className="text-sm text-gray-600">
            Income: ₹{budget.income} • Fixed: ₹{budget.fixed} • Remaining: ₹{budget.remaining}
          </p>
        </div>

        <div className="text-right max-w-xs">
          <p className="text-sm text-gray-500">Savings advice</p>
          <p className="text-xs text-gray-600 break-words">
            {budget.advice || "—"}
          </p>
        </div>
      </div>

      {/* Distribution + Spending Pie */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SUGGESTED DISTRIBUTION */}
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700">
            Recommended Allocation
          </h4>
          <ul className="text-sm text-gray-700">
            {Object.entries(budget.suggested || {}).map(([k, v]) => (
              <li key={k} className="mb-1 capitalize">
                {k}: ₹{v}
              </li>
            ))}
          </ul>
        </div>

        {/* SPENDING PIE */}
        <div>
          <h4 className="font-semibold text-sm mb-2 text-gray-700">
            Spending Breakdown (30d)
          </h4>
          {summary.length > 0 ? (
            <SpendingPie data={summary} />
          ) : (
            <p className="text-sm text-gray-500">No recent spending data.</p>
          )}
        </div>
      </div>

      {/* FORECAST */}
      <div className="mt-6">
        <h4 className="font-semibold text-sm mb-2 text-gray-700">
          Monthly History
        </h4>

        {predict?.history ? (
          <ForecastBar history={predict.history} />
        ) : (
          <p className="text-sm text-gray-500">No history available.</p>
        )}

        <p className="mt-2 text-sm text-gray-700">
          Predicted next month:{" "}
          <span className="font-semibold">
            ₹{predict?.predicted ?? "—"}
          </span>
        </p>
      </div>
    </div>
  );
}
