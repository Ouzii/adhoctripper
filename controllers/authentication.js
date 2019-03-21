const authRouter = require("express").Router();
const Account = require("../models/account");
const Trip = require("../models/trip");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const secret = require('../utils/config').secret

authRouter.get("/:id", async (request, response) => {
  try {
    const account = await Account.findById(request.params.id);
    return response.status(200).send(Account.format(account));
  } catch (error) {
    console.log(error);
    response.status(400).send({ error: `Account with id ${request.params.id} not found` });
  }
});

authRouter.post("/login", async (request, response) => {
  try {
    const body = request.body;
    if (body === undefined || (body.constructor === Object && Object.keys(body).length === 0)) {
      return response.status(400).json({ error: "Content missing" });
    }
    if (body.username.length === 0 || body.password.length === 0) {
      return response.status(403).send({ error: "Invalid username or password" })
    }
    const account = await Account.findOne({ username: body.username })
    if (!account) {
      return response.status(403).send({ error: "Invalid username or password" })
    }
    bcrypt.compare(body.password, account.passwordHash, (err, res) => {
      if (err) {
        console.log(err)
        response.status(400).send({ error: "Something went wrong, try again later" })
      }
      if (res) {
        let token = jwt.sign({username: account.username}, secret, {expiresIn: "7d"})
        return response.status(200).send({user: Account.format(account), token: token})
      } else {
        return response.status(403).send({ error: "Invalid username or password" })
      }
    })
  } catch (error) {
    console.log(error);
    response.status(400).send({ error: "Something went wrong, try again later" });
  }
})

authRouter.post("/register", async (request, response) => {
  try {
    const body = request.body;
    if (body === undefined || (body.constructor === Object && (Object.keys(body).length === 0 || Object.values(body).length < 3))) {
      return response.status(400).json({ error: "Content missing" });
    }
    if (body.username.length < 5 || body.email.indexOf("@") === -1 || body.password.length < 8) {
      return response.status(400).json({ error: "Invalid credentials" })
    }
    bcrypt.hash(body.password, 10, async (err, hash) => {
      if (err) {
        console.log(err)
        return response.status(400).send({ error: "Something went wrong, try again later" })
      }
      const account = new Account({
        username: body.username,
        passwordHash: hash,
        email: body.email
      });
      let newAccount = await account.save();
      return response.status(200).send(Account.format(newAccount));
    })

  } catch (error) {
    console.log(error);
    response.status(400).send({ error: "Something went wrong, try again later" });
  }
})

authRouter.delete("/", async (request, response) => {
  try {
    let decoded = jwt.verify(request.headers.token, secret)
    const accountToBeDeleted = await Account.findOne({username: decoded.username});
    if (!accountToBeDeleted) {
      return response.status(404).send({ error: "Account not found" });
    }
    const usersTrips = await Trip.find({user: accountToBeDeleted._id})
    await Promise.all(usersTrips.map(async (trip) => {
      await Trip.findByIdAndDelete(trip._id)
    }))
    await Account.findOneAndDelete(Account.findById(accountToBeDeleted._id));
    response.status(200).send(Account.format(accountToBeDeleted));
  } catch (error) {
    console.log(error);
    response.status(400).send({ error: "Something went wrong, try again later" });
  }
});

module.exports = authRouter;