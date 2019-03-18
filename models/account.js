const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  username: String,
  passwordHash: String,
  email: String
});

accountSchema.statics.format = account => {
  return {
    username: account.username,
    email: account.email
  };
};

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;