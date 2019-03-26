const accountRouter = require("express").Router();
const Account = require("../models/account");
const jwt = require('jsonwebtoken');
const secret = require('../utils/config').secret;

accountRouter.get("/:id", async (request, response) => {
    try {
      const account = await Account.findById(request.params.id);
      return response.status(200).send(Account.format(account));
    } catch (error) {
      console.log(error);
      response.status(400).send({ error: `Account with id ${request.params.id} not found` });
    }
  });

  accountRouter.put("/fuel/:id/", async (request, response) => {
    try {
      let decoded = jwt.verify(request.headers.token, secret)
      if (!request.body.estFuelPrice) {
        return response.status(400).send({ error: "Content missing" })
      }
  
      const updatedAccount = {
        estFuelPrice: request.body.estFuelPrice
      }
  
      const savedAccount = await Account.findByIdAndUpdate(decoded.id, updatedAccount, { new: true })
      return response.status(200).send(Account.format(savedAccount))
    } catch (error) {
      console.log(error)
      response.status(400).send({ error: "Something went wrong, try again later" });
    }
  })
  
  accountRouter.put("/vehicles/:id", async (request, response) => {
    try {
      let decoded = jwt.verify(request.headers.token, secret)
      if (!request.body.vehicles) {
        return response.status(400).send({ error: "Content missing" })
      }
  
      let errors = false
      request.body.vehicles.forEach(vehicle => {
        if (vehicle.name === '' || vehicle.consumption === '' || !vehicle.name || !vehicle.consumption) {
          errors = true
        }
      });
  
      if (errors) {
        return response.status(400).send({ error: "Vehicle needs a name and consumption" })
      }
  
      const updatedAccount = {
        vehicles: JSON.stringify(request.body.vehicles)
      }
  
      const savedAccount = await Account.findByIdAndUpdate(decoded.id, updatedAccount, { new: true })
      return response.status(200).send(Account.format(savedAccount))
    } catch (error) {
      console.log(error)
      response.status(400).send({ error: "Something went wrong, try again later" });
    }
  })

  module.exports = accountRouter;