const express = require("express");
const SingleAppProfileRoute = express.Router();
const AppProfiles = require("../../../../../models/AppProfiles");
const Accounts = require("../../../../../models/Accounts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
  appProfileId: Joi.string().max(1024).required(),
});

SingleAppProfileRoute.post("/", async (req, res) => {
  const { uid, appProfileId } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      appProfileId,
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
      .json({ message: "profile not found", status: "bad" });
  }

  //   search for app account
  const singleAppProfile = await AppProfiles.findById(appProfileId);

  if (singleAppProfile === null || !singleAppProfile) {
    return res
      .status(403)
      .json({ message: "single profile not found", status: "bad" });
  }

  //   remove password from response for security
  const { title, cl, cv, accountLinked } = singleAppProfile;

  //   send  account details
  return res.status(200).json({
    message: "profile fetched successfully",
    code: "ok",
    payload: { title, cl, cv, accountLinked },
  });
});

module.exports = SingleAppProfileRoute;
