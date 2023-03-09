const express = require("express");
const EditAppAccountRoute = express.Router();
const AppAccounts = require("../../../../../models/AppAccounts");
const Accounts = require("../../../../../models/Accounts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
  appAccountId: Joi.string().max(1024).required(),
  type: Joi.string().max(1024).required(),
  name: Joi.string().max(1024).required(),
  email: Joi.string().max(1024).required(),
  password: Joi.string().max(1024).required(),
});

EditAppAccountRoute.post("/", async (req, res) => {
  const { uid, appAccountId, type, name, email, password } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      appAccountId,
      type,
      name,
      email,
      password,
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
  const singleAppAccount = await AppAccounts.findById(appAccountId);

  if (singleAppAccount === null || !singleAppAccount) {
    return res
      .status(403)
      .json({ message: "single account not found", code: "bad" });
  }

  // update app account
  singleAppAccount.type = type;
  singleAppAccount.name = name;
  singleAppAccount.email = email;
  singleAppAccount.password = password;

  //   save new account
  try {
    // save app account
    await singleAppAccount.save();

    return res.status(200).json({
      message: "account updated successfully",
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error when saving account", code: "bad" });
  }
});

module.exports = EditAppAccountRoute;
