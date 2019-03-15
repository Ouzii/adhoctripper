require("dotenv").config();

let port = process.env.PORT;
let mongoUrl = process.env.MONGODB_URI;

module.exports = {
  mongoUrl,
  port
};