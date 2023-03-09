const express = require("express");
const AllAppAccountsRoute = express.Router();
const AppAccounts = require("../../../../../models/AppAccounts");
const Accounts = require("../../../../../models/Accounts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
});

AllAppAccountsRoute.post("/", async (req, res) => {
  const { uid } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message, code: "bad" });
    return;
  }

  // search for user in db
  const user = await Accounts.findById(uid);

  if (user === null || !user) {
    return res.status(403).json({ message: "account not found", code: "bad" });
  }

  //   search for app account
  const allAppAccounts = await AppAccounts.find(
    { uid },
    { type: 1, name: 1, email: 1 }
  );

  if (allAppAccounts === null || !allAppAccounts) {
    return res.status(200).json({ message: "no account found", code: "ok" });
  }

  //   send  account details
  return res.status(200).json({
    message: "accounts fetched successfully",
    code: "ok",
    payload: allAppAccounts.reverse(),
  });
});

module.exports = AllAppAccountsRoute;
