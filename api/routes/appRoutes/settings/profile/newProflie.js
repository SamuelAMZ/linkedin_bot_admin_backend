const express = require("express");
const NewAppProfileRoute = express.Router();
const AppProfiles = require("../../../../../models/AppProfiles");
const Accounts = require("../../../../../models/Accounts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
  title: Joi.string().max(1024).required(),
  cv: Joi.string().max(1024).required(),
  cl: Joi.string().max(1024).required(),
  accountLinked: Joi.string().max(1024).required(),
});

NewAppProfileRoute.post("/", async (req, res) => {
  const { uid, title, cv, cl, accountLinked } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      title,
      cv,
      cl,
      accountLinked,
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
  const appProfile = new AppProfiles({
    uid,
    title,
    cv,
    cl,
    accountLinked,
  });

  //   save new account
  try {
    // save user
    await appProfile.save();

    return res.status(201).json({
      message: "profile added successfully",
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error when saving account", status: "bad" });
  }
});

module.exports = NewAppProfileRoute;
