const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: Number,
    category: String,
    note: String,
    type: { type: String } // "expense" or "income"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
