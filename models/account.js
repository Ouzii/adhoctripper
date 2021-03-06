const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  username: String,
  usernameUppercase: String,
  passwordHash: String,
  email: String,
  vehicles: { type: String, default: "[]" },
  estFuelPrice: { type: Number, default: 0 }
});

accountSchema.statics.format = account => {
  return {
    id: account._id,
    username: account.username,
    email: account.email,
    vehicles: JSON.parse(account.vehicles),
    estFuelPrice: account.estFuelPrice
  };
};

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;