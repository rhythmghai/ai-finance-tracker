// server/routes/auth.js
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Use env or fallback
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// -------------------------------
// REGISTER
// -------------------------------
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      monthlyIncome = 0,
      savingsGoal = 0,
    } = req.body;

    // Check duplicate
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "User already exists" });

    // Create user
    const user = new User({
      name,
      email,
      monthlyIncome,
      savingsGoal,
    });

    // Hash password
    await user.setPassword(password);
    await user.save();

    // Sign token (adds expiry)
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
        savingsGoal: user.savingsGoal,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// -------------------------------
// LOGIN
// -------------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid credentials" });

    // Validate password
    const valid = await user.validatePassword(password);
    if (!valid)
      return res.status(400).json({ error: "Invalid credentials" });

    // Sign token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
        savingsGoal: user.savingsGoal,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
