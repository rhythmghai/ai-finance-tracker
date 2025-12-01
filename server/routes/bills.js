// server/routes/bills.js
const express = require("express");
const Bill = require("../models/Bill");
const auth = require("./_auth");

const router = express.Router();

// CREATE BILL
router.post("/", auth, async (req, res) => {
  try {
    const bill = new Bill({
      ...req.body,
      user: req.userId, // added by _auth.js
    });

    await bill.save();
    return res.json(bill);
  } catch (err) {
    console.error("Error creating bill:", err);
    return res.status(500).json({ error: "Server error while creating bill" });
  }
});

// GET ALL BILLS BY USER
router.get("/", auth, async (req, res) => {
  try {
    const list = await Bill.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    console.error("Error fetching bills:", err);
    return res.status(500).json({ error: "Server error while fetching bills" });
  }
});

module.exports = router;
