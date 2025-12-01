// server/routes/budget.js
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User");

// -----------------------------------------------------
//  Helper: Monthly aggregates (past 6 months)
// -----------------------------------------------------
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
        total: {
          $sum: {
            $cond: [
              { $eq: ["$type", "expense"] },
              "$amount",
              { $multiply: ["$amount", -1] }
            ]
          }
        }
      }
    },
    { $sort: { _id: 1 } },
  ];

  return await Transaction.aggregate(pipeline);
}

// -----------------------------------------------------
//  FIX: GET /api/budget  (REQUIRED BY FRONTEND)
// -----------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const userId = req.user?._id || req.query.userId;

    if (!userId)
      return res.status(400).json({ error: "User required" });

    // Basic fallback budget so UI does not break
    const history = await getMonthlyHistory(userId, 3);

    res.json({
      income: 0,
      fixed: 0,
      remaining: 0,
      suggested: {},
      advice: "Generate an AI budget to get insights!",
      history: history || []
    });

  } catch (err) {
    console.error("GET /api/budget error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------
//  POST /api/budget/generate (AI MODEL)
// -----------------------------------------------------
router.post("/generate", async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { targetSavings = 0 } = req.body;

    if (!userId)
      return res.status(400).json({ error: "User required" });

    // 1) Monthly history
    const months = await getMonthlyHistory(userId, 6);
    const totals = months.map(m => m.total || 0);
    const avgExpense = totals.length
      ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length)
      : 0;

    // 2) Income
    const user = await User.findById(userId);
    const income = user?.monthlyIncome || Math.max(avgExpense * 1.2, 0);

    // 3) Savings + Available money
    const suggestedSavings = targetSavings || Math.round(income * 0.2);
    const available = Math.max(income - suggestedSavings, 0);

    // 4) Basic distribution
    const suggested = {
      fixed: Math.round(available * 0.4),
      essentials: Math.round(available * 0.3),
      discretionary: Math.round(available * 0.3),
    };

    // 5) Category suggestions
    const catAgg = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
      { $limit: 8 }
    ]);

    const catTotal = catAgg.reduce((s, c) => s + c.total, 0) || 1;
    const suggestedByCategory = {};
    catAgg.forEach(c => {
      suggestedByCategory[c._id] =
        Math.round((c.total / catTotal) * available);
    });

    res.json({
      income,
      avgExpense,
      suggestedSavings,
      available,
      suggested,
      suggestedByCategory,
      history: months
    });

  } catch (err) {
    console.error("POST /api/budget/generate error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
