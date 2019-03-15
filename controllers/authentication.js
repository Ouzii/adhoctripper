const authRouter = require("express").Router();
const Account = require("../models/account");

authRouter.get("/:id", async (request, response) => {
  try {
    const account = await Account.findById(request.params.id);
    return response.status(200).send(Account.format(account));
  } catch (error) {
    console.log(error);
    response.status(400).send({ error: `Account with id ${request.params.id} not found` });
  }
});

authRouter.post("/", async (request, response) => {
  try {
    const body = request.body;
    if (body === undefined || (body.constructor === Object && Object.keys(body).length === 0)) {
      return response.status(400).json({ error: "Content missing" });
    }
    const account = new Account({
      username: body.username,
      passwordHash: body.passwordHash,
      email: body.email
    });
    let newAccount = await account.save();

    response.status(200).send(Account.format(newAccount));
  } catch (error) {
    console.log(error);
    response.status(400).send({ error: "Something went wrong, try again later" });
  }
});

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