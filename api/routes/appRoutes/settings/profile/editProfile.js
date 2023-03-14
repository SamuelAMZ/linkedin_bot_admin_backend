const express = require("express");
const EditAppProfileRoute = express.Router();
const AppProfiles = require("../../../../../models/AppProfiles");
const Accounts = require("../../../../../models/Accounts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
  appProfileId: Joi.string().max(1024).required(),
  title: Joi.string().max(1024).required(),
  cv: Joi.string().max(1024).required(),
  cl: Joi.string().max(1024).required(),
  accountLinked: Joi.string().max(1024).required(),
});

EditAppProfileRoute.post("/", async (req, res) => {
  const { uid, appProfileId, title, cv, cl, accountLinked } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      appProfileId,
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
    return res.status(403).json({ message: "account not found", code: "bad" });
  }

  //   search for app account
  const singleAppProfile = await AppProfiles.findById(appProfileId);

  if (singleAppProfile === null || !singleAppProfile) {
    return res
      .status(403)
      .json({ message: "single profile not found", code: "bad" });
  }

  // update app account
  singleAppProfile.title = title;
  singleAppProfile.cv = cv;
  singleAppProfile.cl = cl;
  singleAppProfile.accountLinked = accountLinked;

  //   save new account
  try {
    // save app account
    await singleAppProfile.save();

    return res.status(200).json({
      message: "profile updated successfully",
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "error when saving account", code: "bad" });
  }
});

module.exports = EditAppProfileRoute;
