const express = require("express");
const RemoveAppAccountRoute = express.Router();
const AppAccounts = require("../../../../../models/AppAccounts");
const Accounts = require("../../../../../models/Accounts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
  appAccountId: Joi.string().max(1024).required(),
});

RemoveAppAccountRoute.post("/", async (req, res) => {
  const { uid, appAccountId } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      appAccountId,
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

  //   search for app account
  const singleAppAccount = await AppAccounts.findById(appAccountId);

  if (singleAppAccount === null || !singleAppAccount) {
    return res
      .status(403)
      .json({ message: "single account not found", status: "bad" });
  }

  // remove app account
  try {
    // save app account
    await singleAppAccount.remove();

    return res.status(200).json({
      message: "account removed successfully",
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error when saving account", status: "bad" });
  }
});

module.exports = RemoveAppAccountRoute;
