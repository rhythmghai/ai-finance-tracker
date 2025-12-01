// server/routes/budget.js
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const auth = require("./_auth");

// ----------------------------------------------
// Helper: Monthly aggregates
// ----------------------------------------------
async function getMonthlyHistory(userId, months = 6) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  return await Transaction.aggregate([
    {
      $match: {
        user: userId,
        $or: [
          { createdAt: { $gte: start } },
          { date: { $gte: start } }
        ]
      }
    },
    {
      $project: {
        amount: 1,
        type: 1,
        month: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
      }
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
    { $sort: { _id: 1 } }
  ]);
}

// ----------------------------------------------
// GET /api/budget
// ----------------------------------------------
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const income = user?.monthlyIncome || 0;

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const expenses = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: "expense",
          $or: [
            { createdAt: { $gte: since } },
            { date: { $gte: since } }
          ]
        }
      },
      {
        $group: { _id: null, total: { $sum: "$amount" } }
      }
    ]);

    const totalExpense = expenses[0]?.total || 0;
    const remaining = income - totalExpense;

    const suggested = {
      fixed: Math.round(income * 0.4),
      essentials: Math.round(income * 0.3),
      discretionary: Math.round(income * 0.3)
    };

    let advice = "Healthy spending pattern.";
    if (remaining < 0) advice = "You are overspending this month.";
    else if (remaining < income * 0.1)
      advice = "Try increasing savings.";

    res.json({
      income,
      fixed: totalExpense,
      remaining,
      suggested,
      advice
    });

  } catch (err) {
    console.error("GET /budget error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------------------------------
// GET /api/budget/predict
// ----------------------------------------------
router.get("/predict", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const months = await getMonthlyHistory(userId, 6);

    let predicted = 0;
    if (months.length >= 2) {
      const last = months[months.length - 1].total;
      const prev = months[months.length - 2].total;
      predicted = Math.round(last * 1.05 + (last - prev) * 0.5);
    }

    res.json({
      history: months,
      predicted
    });

  } catch (err) {
    console.error("GET /predict error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ----------------------------------------------
// POST /api/budget/generate
// ----------------------------------------------
router.post("/generate", auth, async (req, res) => {
  try {
    const userId = req.userId;
    const { targetSavings = 0 } = req.body;

    const months = await getMonthlyHistory(userId, 6);
    const totals = months.map(m => m.total || 0);
    const avgExpense = totals.length
      ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length)
      : 0;

    const user = await User.findById(userId);
    const income = user?.monthlyIncome || Math.max(avgExpense * 1.2, 0);

    const suggestedSavings = targetSavings || Math.round(income * 0.2);
    const available = Math.max(income - suggestedSavings, 0);

    const suggested = {
      fixed: Math.round(available * 0.4),
      essentials: Math.round(available * 0.3),
      discretionary: Math.round(available * 0.3)
    };

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
    console.error("POST /generate error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
