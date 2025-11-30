const express = require('express');
const Bill = require('../models/Bill');
const auth = require('./_auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  const b = new Bill({ ...req.body, user: req.userId });
  await b.save();
  res.json(b);
});

router.get('/', auth, async (req, res) => {
  const list = await Bill.find({ user: req.userId });
  res.json(list);
});

module.exports = router;
