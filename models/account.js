const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  email: String,
  vehicles: [ String ]
});

accountSchema.statics.format = account => {
  return {
    id: account._id,
    username: account.username,
    email: account.email,
    vehicles: account.vehicles
  };
};

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;