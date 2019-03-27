const authRouter = require("express").Router();
const Account = require("../models/account");
const Trip = require("../models/trip");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../utils/config').secret;

authRouter.post("/login", async (request, response) => {
  try {
    const body = request.body;
    if (body === undefined || (body.constructor === Object && Object.keys(body).length === 0)) {
      return response.status(400).json({ error: "Content missing" });
    }
    if (body.username.length === 0 || body.password.length === 0) {
      return response.status(403).send({ error: "Invalid username or password" })
    }
    const account = await Account.findOne({ usernameUppercase: body.username.toUpperCase() })
    if (!account) {
      return response.status(403).send({ error: "Invalid username or password" })
    }
    bcrypt.compare(body.password, account.passwordHash, (err, res) => {
      if (err) {
        console.log(err)
        response.status(400).send({ error: "Something went wrong, try again later" })
      }
      if (res) {
        const token = jwt.sign(Account.format(account), secret, { expiresIn: "7d" })
        return response.status(200).send({ user: Account.format(account), token: token })
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
    const isTaken = await Account.findOne({ usernameUppercase: body.username.toUpperCase() })

    if (isTaken) {
      return response.status(400).json({ error: "Username already exists" })
    }
    bcrypt.hash(body.password, 10, async (err, hash) => {
      if (err) {
        console.log(err)
        return response.status(400).send({ error: "Something went wrong, try again later" })
      }
      const account = new Account({
        username: body.username,
        usernameUppercase: body.username.toUpperCase(),
        passwordHash: hash,
        email: body.email
      });
      let newAccount = await account.save();
      let token = jwt.sign(Account.format(account), secret, { expiresIn: "7d" })
      return response.status(200).send({ user: Account.format(newAccount), token: token });
    })

  } catch (error) {
    console.log(error);
    response.status(400).send({ error: "Something went wrong, try again later" });
  }
})

authRouter.put("/password", async (request, response) => {
  try {
    if ((request.body.newPassword !== request.body.newPassword2) || !request.body.newPassword || !request.body.newPassword2) {
      return response.status(400).send({ error: "Passwords didn't match" })
    }

    const decoded = jwt.verify(request.headers.token, secret)
    const accountToBeEdited = await Account.findById(decoded.id)
    if (accountToBeEdited) {
      bcrypt.compare(request.body.password, accountToBeEdited.passwordHash, async (err, res) => {
        if (err) {
          console.log(err)
          response.status(400).send({ error: "Something went wrong, try again later" })
        }
        if (res) {
          if (request.body.newPassword) {
            bcrypt.hash(request.body.newPassword, 10, async (err, hash) => {
              if (err) {
                console.log(err)
                return response.status(400).send({ error: "Something went wrong, try again later" })
              }
              const newAccount = await Account.findByIdAndUpdate(decoded.id, { passwordHash: hash }, { new: true })
              return response.status(200).send(Account.format(newAccount))
            })
          }
        } else {
          return response.status(400).json({ error: "Invalid password" })
        }
      })

    }
  } catch (error) {
    console.log(error);
    response.status(400).send({ error: "Something went wrong, try again later" });
  }
})

authRouter.put("/email", async (request, response) => {
  try {
    if (!request.body.newEmail) {
      return response.status(400).send({ error: "No content" })
    }

    const decoded = jwt.verify(request.headers.token, secret)
    const accountToBeEdited = Account.findById(decoded.id)

    if (accountToBeEdited) {
      const newAccount = await Account.findByIdAndUpdate(decoded.id, { email: request.body.newEmail }, { new: true })
      return response.status(200).send(Account.format(newAccount))
    } else {
      return response.status(404).json({ error: "Account not found" })
    }
  } catch (error) {
    console.log(error);
    response.status(400).send({ error: "Something went wrong, try again later" });
  }
})

authRouter.delete("/", async (request, response) => {
  try {
    const decoded = jwt.verify(request.body.token, secret)
    const accountToBeDeleted = await Account.findById(decoded.id)
    if (!accountToBeDeleted) {
      return response.status(404).send({ error: "Account not found" });
    }
    const usersTrips = await Trip.find({ user: accountToBeDeleted._id })
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