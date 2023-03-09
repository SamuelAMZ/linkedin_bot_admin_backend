const express = require("express");
const NewAppAccountRoute = express.Router();
const AppAccounts = require("../../../../../models/AppAccounts");
const Accounts = require("../../../../../models/Accounts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
  type: Joi.string().max(1024).required(),
  name: Joi.string().max(1024).required(),
  email: Joi.string().max(1024).required(),
  password: Joi.string().max(1024).required(),
});

NewAppAccountRoute.post("/", async (req, res) => {
  const { uid, type, name, email, password } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
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
    return res
      .status(403)
      .json({ message: "account not found", status: "bad" });
  }

  // add new account to appAccount collection with his id
  const appAccount = new AppAccounts({
    uid,
    type,
    name,
    email,
    password,
  });

  //   save new account
  try {
    // save user
    await appAccount.save();

    return res.status(201).json({
      message: "account added successfully",
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error when saving account", status: "bad" });
  }
});

module.exports = NewAppAccountRoute;
