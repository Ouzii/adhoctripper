const authRouter = require("express").Router();
const Account = require("../models/account");
const bcrypt = require('bcrypt')

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
    const account = await Account.findOne({ username: body.username })
    bcrypt.compare(body.password, account.passwordHash, (err, res) => {
      if (err) {
        console.log(err)
        return response.status(400).send({ error:  "Something went wrong, try again later"})
      }
      if (res) {
        return response.status(200).send(Account.format(account))
      } else {
        return response.status(403).send({ error: "Invalid username or password"})
      }
    })
  } catch (error) {
    console.log(error);
    response.status(400).send({ error: "Something went wrong, try again later"});
  }
})

authRouter.post("/register", async (request, response) => {
  try {
    const body = request.body;
    if (body === undefined || (body.constructor === Object && (Object.keys(body).length === 0 || Object.values(body).length < 3))) {
      return response.status(400).json({ error: "Content missing" });
    }
    bcrypt.hash(body.password, 10, async (err, hash) => {
      if (err) {
        console.log(err)
        return response.status(400).send({ error:  "Something went wrong, try again later"})
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

authRouter.delete("/:id", async (request, response) => {
  try {
    const accountToBeDeleted = await Account.findById(request.params.id);
    if (!accountToBeDeleted) {
      return response.status(404).send({ error: "Account not found" });
    }
    await Account.findOneAndDelete(Account.findById(request.params.id));
    response.status(200).send(Account.format(accountToBeDeleted));
  } catch (error) {
    console.log(error);
    response.status(400).send({ error: "Something went wrong, try again later" });
  }
});

module.exports = authRouter;