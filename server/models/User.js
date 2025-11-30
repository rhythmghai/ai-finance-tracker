const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");


const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  monthlyIncome: { type: Number, default: 0 },
  savingsGoal: { type: Number, default: 0 }
});

UserSchema.methods.setPassword = async function(pw) {
  this.passwordHash = await bcrypt.hash(pw, 10);
};

UserSchema.methods.validatePassword = async function(pw) {
  return await bcrypt.compare(pw, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
