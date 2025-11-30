const express = require('express');
const Subscription = require('../models/Subscription');
const auth = require('./_auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const s = new Subscription({ ...req.body, user: req.userId });
  await s.save();
  res.json(s);
});

router.get('/', auth, async (req, res) => {
  const list = await Subscription.find({ user: req.userId });
  res.json(list);
});

module.exports = router;
