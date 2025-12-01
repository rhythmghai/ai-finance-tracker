const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: String,
    amount: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", BillSchema);
