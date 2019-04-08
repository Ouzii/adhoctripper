if (process.env.NODE_ENV === 'dev') {
  require("dotenv").config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI
let secret = process.env.JWT_SECRET
let weatherApiKey = process.env.WEATHER_API_KEY
let googleApiKey = process.env.GOOGLE_API_KEY

module.exports = {
  mongoUrl,
  port,
  secret,
  weatherApiKey,
  googleApiKey
}