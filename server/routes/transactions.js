const express = require("express");
const Transaction = require("../models/Transaction");
const auth = require("./_auth");
const router = express.Router();

// CREATE TRANSACTION
router.post("/", auth, async (req, res) => {
  const tx = new Transaction({
    ...req.body,
    user: req.userId,
    date: req.body.date || new Date()
  });

  await tx.save();
  res.json(tx);
});

// GET ALL TRANSACTIONS
router.get("/", auth, async (req, res) => {
  const txs = await Transaction.find({ user: req.userId })
    .sort({ date: -1 });

  res.json(txs);
});

// SUMMARY (USE `date`, NOT createdAt)
router.get("/summary", auth, async (req, res) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const agg = await Transaction.aggregate([
    {
      $match: {
        user: req.userId,
        type: "expense",
        date: { $gte: since }
      }
    },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } }
  ]);

  res.json(agg);
});

module.exports = router;
