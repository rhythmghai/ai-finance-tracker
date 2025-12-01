const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: String,
    provider: String,
    monthlyCost: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subscription", SubscriptionSchema);
