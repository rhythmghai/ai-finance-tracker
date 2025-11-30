const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  amount: Number,
  dueDate: Date,
  recurring: { type: Boolean, default: true }
});

module.exports = mongoose.model('Bill', BillSchema);
