// server/routes/budget.js
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction"); // adjust path
const User = require("../models/User"); // if needed

// helper to get monthly aggregates for the last 6 months
async function getMonthlyHistory(userId, months = 6) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);
  const pipeline = [
    { $match: { user: userId, createdAt: { $gte: start } } },
    {
      $project: {
        amount: 1,
        type: 1,
        month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", { $multiply: ["$amount", -1] }] } }
      },
    },
    { $sort: { _id: 1 } },
  ];
  const rows = await Transaction.aggregate(pipeline);
  return rows;
}

// POST /api/budget/generate
router.post("/generate", async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId; // depending on your auth middleware
    const { targetSavings = 0 } = req.body; // amount the user wants to save monthly (or percent)
    if (!userId) return res.status(400).json({ error: "User required" });

    // 1) compute historical avg income & expense
    const months = await getMonthlyHistory(userId, 6);
    // compute average expense over months (if none, fallback)
    const totals = months.map(m => m.total || 0);
    const avgExpense = totals.length ? Math.round(totals.reduce((a,b)=>a+b,0)/totals.length) : 0;

    // 2) get user's monthly income if stored in profile
    const user = await User.findById(userId);
    const income = user?.monthlyIncome || Math.max(avgExpense * 1.2, 0); // fallback heuristic

    // 3) Determine suggested allocation: sample heuristic
    // Start with recommended savings = targetSavings (if provided) otherwise 20% of income
    const suggestedSavings = targetSavings || Math.round(income * 0.2);

    const available = Math.max(income - suggestedSavings, 0);

    // Simple mapping: fixed bills (40%), essentials (30%), discretionary (30%)
    const suggested = {
      fixed: Math.round(available * 0.4),
      essentials: Math.round(available * 0.3),
      discretionary: Math.round(available * 0.3),
    };

    // Also create category level suggestion from historic categories
    const catAgg = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 8 }
    ]);

    // Map category totals proportionally into available
    const catTotal = catAgg.reduce((s, c) => s + c.total, 0) || 1;
    const suggestedByCategory = {};
    catAgg.forEach(c => {
      suggestedByCategory[c._id] = Math.round((c.total / catTotal) * available);
    });

    // Store prediction in DB? optional. For now return computed object.
    const result = {
      income,
      avgExpense,
      suggestedSavings,
      available,
      suggested,
      suggestedByCategory,
      history: months
    };

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
