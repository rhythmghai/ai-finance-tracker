const express = require('express');
const Transaction = require('../models/Transaction');
const auth = require('./_auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const tx = new Transaction({ ...req.body, user: req.userId });
  await tx.save();
  res.json(tx);
});

router.get('/', auth, async (req, res) => {
  const txs = await Transaction.find({ user: req.userId }).sort({ date: -1 });
  res.json(txs);
});

// get summary: totals by category last 30 days
router.get('/summary', auth, async (req, res) => {
  const { from } = req.query;
  const since = from ? new Date(from) : new Date(Date.now() - 30*24*60*60*1000);
  const agg = await Transaction.aggregate([
    { $match: { user: req.userId, date: { $gte: since }, type: 'expense' } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
    { $sort: { total: -1 } }
  ]);
  res.json(agg);
});

module.exports = router;
