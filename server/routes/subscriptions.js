// server/routes/subscriptions.js
const express = require('express');
const Subscription = require('../models/Subscription');
const auth = require('./_auth');
const router = express.Router();

// -----------------------------------------
// POST /api/subscriptions   (Create)
// -----------------------------------------
router.post('/', auth, async (req, res) => {
  try {
    const sub = new Subscription({
      ...req.body,
      user: req.userId,   // <-- pulled from _auth.js
    });

    await sub.save();
    res.json(sub);

  } catch (err) {
    console.error("Subscription POST error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------
// GET /api/subscriptions   (Fetch user’s subs)
// -----------------------------------------
router.get('/', auth, async (req, res) => {
  try {
    const list = await Subscription.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(list);

  } catch (err) {
    console.error("Subscription GET error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------
// DELETE /api/subscriptions/:id
// (Optional but useful in dashboard)
// -----------------------------------------
router.delete('/:id', auth, async (req, res) => {
  try {
    const removed = await Subscription.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!removed)
      return res.status(404).json({ error: "Subscription not found" });

    res.json({ success: true });

  } catch (err) {
    console.error("Subscription DELETE error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
