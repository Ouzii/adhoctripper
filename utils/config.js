console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'dev') {
  require("dotenv").config()
}


let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI
let secret = process.env.JWT_SECRET

module.exports = {
  mongoUrl,
  port,
  secret
}