const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  provider: String,
  monthlyCost: Number,
  billingCycle: { type: String, enum: ['monthly','yearly'], default: 'monthly' },
  nextBillingDate: Date,
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
