// client/src/components/Budget.jsx
import React, { useEffect, useState } from "react";
import API from "../api";
import { SpendingPie, ForecastBar } from "./Charts";

export default function Budget() {
  const [budget, setBudget] = useState(null);
  const [summary, setSummary] = useState([]);
  const [predict, setPredict] = useState(null);
  const [loading, setLoading] = useState(true);

  const [targetSavings, setTargetSavings] = useState("");
  const [aiBudget, setAiBudget] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");

  // ----------------------------
  // LOAD INITIAL DATA
  // ----------------------------
  async function load() {
    try {
      const b = await API.get("/api/budget");
      setBudget(b.data || null);

      const s = await API.get("/api/transactions/summary");
      setSummary(s.data || []);

      const p = await API.get("/api/budget/predict");
      setPredict(p.data || null);
    } catch (err) {
      console.error("Error loading budget data:", err);
      setStatusMsg("Failed to load budget data.");
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // ---------------------------------------------------------
  // 🔥 FRONTEND HEURISTIC AI BUDGET GENERATOR
  // ---------------------------------------------------------
  async function generateAIBudget() {
    setStatusMsg("Analyzing your expenses with AI… 🤖");

    await new Promise((r) => setTimeout(r, 1200));

    // ✔ Fetch bills directly
    const billRes = await API.get("/api/bills");
    const subRes = await API.get("/api/subscriptions");

    const bills = billRes.data.reduce((sum, b) => sum + b.amount, 0);
    const subscriptions = subRes.data.reduce(
      (sum, s) => sum + s.monthlyCost,
      0
    );

    const income = budget?.income || 50000;
    const fixedCosts = bills + subscriptions;

    const avgExpense =
      predict?.history?.length
        ? Math.round(
            predict.history.reduce((a, b) => a + b.total, 0) /
              predict.history.length
          )
        : fixedCosts + 5000;

    const savings = Number(targetSavings) || 0;
    const available = Math.max(income - fixedCosts - savings, 0);

    const aiFactor = 0.9 + Math.random() * 0.25;

    const suggested = {
      fixed: fixedCosts,
      essentials: Math.round(available * 0.5 * aiFactor),
      discretionary: Math.round(available * 0.5 * aiFactor),
    };

    // AI financial heuristics (insight logic)
    let advice = "Your spending appears balanced.";

    if (subscriptions > income * 0.15)
      advice = "Your subscription spending is relatively high.";
    if (bills > income * 0.3)
      advice = "Bills consume a large portion of your income.";
    if (available < income * 0.2)
      advice = "Your fixed costs limit flexible spending.";

    const result = {
      income,
      avgExpense,
      bills,
      subscriptions,
      fixedCosts,
      suggested,
      advice,
      aiPie: [
        { category: "Bills", amount: bills },
        { category: "Subscriptions", amount: subscriptions },
        { category: "Essentials", amount: suggested.essentials },
        { category: "Discretionary", amount: suggested.discretionary },
        { category: "Savings", amount: savings },
      ],
    };

    setAiBudget(result);
    setBudget((prev) => ({ ...(prev || {}), ...result }));
    setStatusMsg("AI budget generated.");
  }

  // ----------------------------
  // UI RENDER
  // ----------------------------
  if (loading)
    return (
      <div className="bg-white/80 p-4 rounded-2xl shadow border">
        Loading budget…
      </div>
    );

  if (!budget)
    return (
      <div className="bg-white/80 p-4 rounded-2xl shadow border">
        Unable to load budget data.
      </div>
    );

  return (
    <div className="bg-white/80 p-4 rounded-2xl shadow border dark:bg-gray-800/60 dark:border-gray-700">

      {/* ------------------------------------------------ */}
      {/* 🌟 AI MONTHLY BUDGET PLANNER */}
      {/* ------------------------------------------------ */}
      <div className="relative p-6 mb-6 rounded-3xl shadow-xl 
        bg-gradient-to-br from-purple-100/70 via-pink-100/70 to-blue-100/70 
        dark:from-gray-700/60 dark:via-gray-800/60 dark:to-gray-900/60 
        border border-purple-300/40 dark:border-gray-600/40">

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            🤖 AI Monthly Budget Planner
          </h3>
          <span className="text-xs px-3 py-1 rounded-full bg-purple-600 text-white">
            AI Active
          </span>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Let AI analyze your income, bills, and subscriptions to generate a personalized budget.
        </p>

        {/* Savings input */}
        <div className="flex gap-3 mb-4">
          <div className="flex items-center flex-1 bg-white/50 dark:bg-gray-700/60 border rounded-xl px-3 py-2">
            <span className="text-gray-600 dark:text-gray-300 mr-2">₹</span>
            <input
              type="number"
              value={targetSavings}
              onChange={(e) => setTargetSavings(e.target.value)}
              className="w-full bg-transparent text-gray-800 dark:text-gray-200 focus:outline-none"
              placeholder="Enter monthly savings goal"
            />
          </div>
          <button
            onClick={generateAIBudget}
            className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700"
          >
            Generate
          </button>
        </div>

        {statusMsg && (
          <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
            {statusMsg}
          </p>
        )}

        {/* AI OUTPUT */}
        {aiBudget && (
          <>
            {/* METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">

              <div className="p-4 rounded-2xl bg-black/30 shadow text-center">
                <p className="text-xs text-gray-300">Income</p>
                <p className="text-xl font-bold text-white">₹{aiBudget.income}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/30 shadow text-center">
                <p className="text-xs text-gray-300">Avg Expense</p>
                <p className="text-xl font-bold text-white">₹{aiBudget.avgExpense}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/30 shadow text-center">
                <p className="text-xs text-gray-300">Bills</p>
                <p className="text-xl font-bold text-white">₹{aiBudget.bills}</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/30 shadow text-center">
                <p className="text-xs text-gray-300">Subscriptions</p>
                <p className="text-xl font-bold text-white">₹{aiBudget.subscriptions}</p>
              </div>

            </div>

            {/* Suggested Allocation */}
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Suggested Allocation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              {Object.entries(aiBudget.suggested).map(([k, v]) => (
                <div key={k} className="p-4 bg-gray-900/40 text-white rounded-xl shadow">
                  <p className="text-xs text-gray-400 uppercase">{k}</p>
                  <p className="text-xl font-bold">₹{v}</p>
                </div>
              ))}
            </div>

            {/* Fixed expenses */}
            <div className="mt-4 bg-gray-200/50 dark:bg-gray-900/60 p-4 rounded-2xl shadow">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                Fixed Expenses
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white/80 dark:bg-gray-900/40 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Bills</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    ₹{aiBudget.bills}
                  </p>
                </div>
                <div className="p-3 bg-white/80 dark:bg-gray-900/40 rounded-xl shadow">
                  <p className="text-xs text-gray-500">Subscriptions</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    ₹{aiBudget.subscriptions}
                  </p>
                </div>
              </div>
            </div>

            {/* AI PIE */}
            <h4 className="mt-6 font-semibold text-gray-800 dark:text-gray-100">
              AI Spending Distribution
            </h4>
            <SpendingPie
              data={aiBudget.aiPie.map((i) => ({ _id: i.category, total: i.amount }))}
            />

            {/* Insights */}
            <div className="mt-6 p-4 rounded-xl bg-white/80 dark:bg-gray-900/50 border-l-4 border-purple-500 shadow">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-purple-700 dark:text-purple-300">AI Insight:</span>{" "}
                {aiBudget.advice}
              </p>
            </div>

          </>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* SMART BUDGET SUMMARY (Non-AI) */}
      {/* ------------------------------------------------ */}
      <div>
        <h3 className="font-bold text-lg text-gray-700 dark:text-gray-100">
          Smart Budget
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Income: ₹{budget.income} • Fixed: ₹{budget.fixed} • Remaining: ₹{budget.remaining}
        </p>
      </div>

      {/* EXPENSE BREAKDOWN */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-100">
            Recommended Allocation
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300">
            {budget.suggested &&
              Object.entries(budget.suggested).map(([k, v]) => (
                <li key={k} className="capitalize">
                  {k}: ₹{v}
                </li>
              ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-100">
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
        <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-100">
          Monthly History
        </h4>

        {predict?.history?.length > 0 ? (
          <ForecastBar history={predict.history} />
        ) : (
          <p className="text-sm text-gray-500">No history available.</p>
        )}

        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          Predicted next month:{" "}
          <span className="font-semibold">₹{predict?.predicted ?? "—"}</span>
        </p>
      </div>

    </div>
  );
}
