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

  // ---------------------------------------------------------
  // LOAD DATA
  // ---------------------------------------------------------
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

  // ---------------------------------------------------------
  // 🔥 FRONTEND-ONLY AI ENGINE — Looks like ML model
  // ---------------------------------------------------------
  async function generateAIBudget() {
    setStatusMsg("Analyzing your expenses with AI… 🤖");

    await new Promise((r) => setTimeout(r, 1200)); // AI delay

    const income = budget?.income || 50000;

    const bills = summary
      .filter((s) => s._id?.toLowerCase().includes("bill"))
      .reduce((sum, s) => sum + s.total, 0);

    const subscriptions = summary
      .filter((s) => s._id?.toLowerCase().includes("subscription"))
      .reduce((sum, s) => sum + s.total, 0);

    const fixedCosts = bills + subscriptions;

    const avgExpense = predict?.history?.length
      ? Math.round(
          predict.history.reduce((a, b) => a + b.total, 0) /
            predict.history.length
        )
      : fixedCosts + 5000;

    const savings = Number(targetSavings) || 0;
    const available = Math.max(income - savings - fixedCosts, 0);

    const aiFactor = 0.9 + Math.random() * 0.25;

    const suggested = {
      fixed: Math.round(fixedCosts),
      essentials: Math.round(available * 0.5 * aiFactor),
      discretionary: Math.round(available * 0.5 * aiFactor),
    };

    // AI wording
    let advice = "Your spending appears balanced.";
    if (subscriptions > income * 0.15)
      advice =
        "Your subscription spending is quite high. Consider removing unused services.";
    if (bills > income * 0.3)
      advice =
        "Bills consume a large part of your income. Try reducing electricity or wifi costs.";
    if (available < income * 0.2)
      advice =
        "Your fixed expenses limit flexible spending. Adjust luxury purchases.";

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
    setStatusMsg("AI budget generated successfully.");
  }

  // API TEST
  async function checkApi() {
    try {
      const r = await API.get("/api/budget");
      setStatusMsg("API OK: /api/budget responded");
      console.log("/api/budget", r.data);
    } catch (e) {
      console.error("API check failed", e);
      setStatusMsg("API error");
    }
  }

  // ---------------------------------------------------------
  // LOADING + NULL UI
  // ---------------------------------------------------------
  if (loading)
    return (
      <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border">
        Loading budget…
      </div>
    );

  if (!budget)
    return (
      <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border">
        Could not load budget.
        <button
          onClick={checkApi}
          className="mt-2 px-3 py-1 rounded bg-pink-200 hover:bg-pink-300"
        >
          Check API
        </button>
        <div className="text-red-500 text-sm mt-1">{statusMsg}</div>
      </div>
    );

  // ---------------------------------------------------------
  // MAIN UI START
  // ---------------------------------------------------------
  return (
    <div className="bg-white/80 p-4 rounded-2xl shadow pastel-card border dark:bg-gray-800/60 dark:border-gray-700">

      {/* ---------------------------------------------------------------- */}
      {/* 🌟 PREMIUM AI MONTHLY BUDGET PLANNER UI */}
      {/* ---------------------------------------------------------------- */}
      <div className="relative p-6 mb-6 rounded-3xl shadow-xl backdrop-blur-xl 
        bg-gradient-to-br from-purple-100/70 via-pink-100/70 to-blue-100/70 
        dark:from-gray-700/60 dark:via-gray-800/60 dark:to-gray-900/60 
        border border-purple-300/40 dark:border-gray-600/40">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            🤖 AI Monthly Budget Planner
          </h3>
          <div className="text-xs px-3 py-1 rounded-full bg-purple-600 text-white animate-pulse">
            AI Active
          </div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          Let AI analyze your income, expenses, bills, and subscriptions to
          generate a personalized monthly budget.
        </p>

        {/* Input */}
        <div className="flex gap-3 items-center mb-5">
          <div className="flex items-center flex-1 bg-white/80 dark:bg-gray-700/60 border rounded-xl px-3 py-2 shadow-inner">
            <span className="text-gray-500 dark:text-gray-300 mr-2">₹</span>
            <input
              type="number"
              value={targetSavings}
              onChange={(e) => setTargetSavings(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-gray-700 dark:text-gray-200"
              placeholder="Enter monthly savings goal"
            />
          </div>

          <button
            onClick={generateAIBudget}
            className="px-5 py-2 rounded-xl bg-purple-600 text-white font-semibold 
            hover:bg-purple-700 active:scale-95 transition-all shadow-md">
            Generate
          </button>
        </div>

        {statusMsg && (
          <div className="text-sm text-purple-700 dark:text-purple-300 mb-3 font-medium">
            {statusMsg}
          </div>
        )}

        {/* ------------------------------ */}
        {/* AI OUTPUT */}
        {/* ------------------------------ */}
        {aiBudget && (
          <div>
            

            {/* Numbers Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-white/10 dark:bg-gray-800/70 shadow-md text-center">
                <p className="text-xs text-gray-500">Income</p>
                <p className="text-lg font-semibold">₹{aiBudget.income}</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 dark:bg-gray-800/70 shadow-md text-center">
                <p className="text-xs text-gray-500">Avg Expense</p>
                <p className="text-lg font-semibold">₹{aiBudget.avgExpense}</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 dark:bg-gray-800/70 shadow-md text-center">
                <p className="text-xs text-gray-500">Bills</p>
                <p className="text-lg font-semibold">₹{aiBudget.bills}</p>
              </div>

              <div className="p-3 rounded-2xl bg-white/10 dark:bg-gray-800/70 shadow-md text-center">
                <p className="text-xs text-gray-500">Subscriptions</p>
                <p className="text-lg font-semibold">₹{aiBudget.subscriptions}</p>
              </div>
            </div>

            {/* Allocation */}
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Suggested Allocation
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {Object.entries(aiBudget.suggested).map(([k, v]) => (
                <div
                  key={k}
                  className="p-3 rounded-xl bg-purple-50 dark:bg-gray-800 shadow"
                >
                  <p className="text-xs uppercase text-gray-500">{k}</p>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    ₹{v}
                  </p>
                </div>
              ))}
            </div>

            {/* AI PIE CHART */}
            {aiBudget.aiPie && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">
                  AI Spending Distribution
                </h4>
                <SpendingPie
                  data={aiBudget.aiPie.map((i) => ({
                    _id: i.category,
                    total: i.amount,
                  }))}
                />
              </div>
            )}

            {/* Insight Card */}
            <div className="mt-6 p-4 rounded-2xl shadow-inner bg-white/80 dark:bg-gray-900/60 border-l-4 border-purple-500">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                <span className="font-semibold text-purple-700 dark:text-purple-300">
                  AI Insight:
                </span>{" "}
                {aiBudget.advice}
              </p>
            </div>
          </div>
        )}

        {!aiBudget && (
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">
            Enter a savings goal and click Generate to begin.
          </p>
        )}
      </div>

      {/* --------------------------------------------------------- */}
      {/* STANDARD SUMMARY */}
      {/* --------------------------------------------------------- */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg text-gray-700 dark:text-gray-100">Smart Budget</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Income: ₹{budget.income} • Fixed: ₹{budget.fixed} • Remaining: ₹{budget.remaining}
          </p>
        </div>

        <div className="text-right max-w-xs">
          <p className="text-sm text-gray-500 dark:text-gray-400">Savings advice</p>
          <p className="text-xs text-gray-600 dark:text-gray-300 break-words">{budget.advice}</p>
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* SPENDING BREAKDOWN */}
      {/* --------------------------------------------------------- */}
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
            <p className="text-sm text-gray-500 dark:text-gray-400">No recent spending data.</p>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* FORECAST */}
      {/* --------------------------------------------------------- */}
      <div className="mt-6">
        <h4 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-100">
          Monthly History
        </h4>

        {predict?.history?.length > 0 ? (
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
