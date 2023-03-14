const express = require("express");
const AllAppProfilesRoute = express.Router();
const AppProfiles = require("../../../../../models/AppProfiles");
const Accounts = require("../../../../../models/Accounts");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
});

AllAppProfilesRoute.post("/", async (req, res) => {
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
  const allAppProfiles = await AppProfiles.find({ uid }, { title: 1, _id: 1 });

  if (allAppProfiles === null || !allAppProfiles) {
    return res.status(200).json({ message: "no profile found", code: "ok" });
  }

  //   send  account details
  return res.status(200).json({
    message: "profiles fetched successfully",
    code: "ok",
    payload: allAppProfiles.reverse(),
  });
});

module.exports = AllAppProfilesRoute;
