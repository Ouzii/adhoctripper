const mongoose = require("mongoose");
const config = require("./utils/config");
const sslRedirect = require("heroku-ssl-redirect");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const tripRouter = require("./controllers/trip");
const authRouter = require("./controllers/authentication");
const accountRouter = require("./controllers/account")
const weatherRouter = require('./controllers/weather')
const googleServicesRouter = require('./controllers/googleServices')


mongoose
    .connect(config.mongoUrl, { useNewUrlParser: true })
    .then(() => {
        console.log("connected to database", config.mongoUrl);
    })
    .catch(err => {
        console.log(err);
    });

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});

app.on("close", () => {
    mongoose.connection.close();
});

app.use(cors());
app.use(sslRedirect());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static("build"));
app.use("/api/trips", tripRouter);
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);
app.use("/api/weather", weatherRouter);
app.use("/api/maps", googleServicesRouter);

const error = (request, response) => {
    response.status(404).send({ error: "Unknown endpoint" });
};

app.use(error);

module.exports = {
    app
};