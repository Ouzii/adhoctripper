require("dotenv").config()

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI
let secret = process.env.JWT_SECRET

module.exports = {
  mongoUrl,
  port,
  secret
}