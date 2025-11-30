const express = require('express');
const auth = require('./_auth');
const User = require('../models/User');
const Bill = require('../models/Bill');
const Subscription = require('../models/Subscription');
const Transaction = require('../models/Transaction');
const { heuristicBudget, openaiRefineBudget } = require('../utils/budget');
const { simplePredictNext, openaiEnhancePrediction } = require('../utils/predict');

const router = express.Router();

// GET /api/budget -> heuristic or OpenAI-refined
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const bills = await Bill.find({ user: req.userId });
    const subs = await Subscription.find({ user: req.userId });
    const tx = await Transaction.find({ user: req.userId }).sort({ date: -1 }).limit(500);

    // try OpenAI refine if key present
    const data = await openaiRefineBudget({ income: user.monthlyIncome || 0, bills, subs, transactions: tx });
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/budget/predict -> predict next month total expense
router.get('/predict', auth, async (req, res) => {
  try {
    const tx = await Transaction.find({ user: req.userId }).sort({ date: 1 }).limit(1000);
    // openai enhanced if available
    const data = await openaiEnhancePrediction(tx);
    res.json(data);
  } catch (e){
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
