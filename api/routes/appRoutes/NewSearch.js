const express = require("express");
const NewSearchRoute = express.Router();

// models
const Searches = require("../../../models/Searches");
const Analytics = require("../../../models/Analytics");
const Accounts = require("../../../models/Accounts");
const AppAccounts = require("../../../models/AppAccounts");
const AppProfiles = require("../../../models/AppProfiles");

// library
const Joi = require("@hapi/joi");

// scrapper
const getJobs = require("../../../scraper/getJobs/index");

const schema = Joi.object({
  uid: Joi.string().max(1024).required(),
  keyword: Joi.string().max(1024).required(),
  country: Joi.string().max(1024).required(),
  platform: Joi.string().max(1024).required(),
  onSite: Joi.string().max(1024).allow(""),
  jobType: Joi.string().max(1024).allow(""),
  salary: Joi.string().max(1024).allow(""),
  underTen: Joi.boolean().allow(""),
  linkedinFilterUri: Joi.string().max(1024).allow(""),
  accountId: Joi.string().max(1024).required(),
  profileId: Joi.string().max(1024).required(),
});

NewSearchRoute.post("/", async (req, res) => {
  const {
    uid,
    keyword,
    country,
    platform,
    onSite,
    jobType,
    salary,
    underTen,
    linkedinFilterUri,
    accountId,
    profileId,
  } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      uid,
      keyword,
      country,
      platform,
      onSite,
      jobType,
      salary,
      underTen,
      linkedinFilterUri,
      accountId,
      profileId,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, code: "bad" });
    return;
  }

  // search for user in db
  const user = await Accounts.findById(uid);

  if (user === null || !user) {
    return res.status(403).json({ message: "account not found", code: "bad" });
  }

  // check if user use linkedin filtered URI or native form inputs

  // if linkedin filter uri
  if (linkedinFilterUri) {
    return;
  }

  // else native form
  //   creating new post
  const search = new Searches({
    ...req.body,
  });

  //   save
  try {
    await search.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error when searching, retry later",
      code: "bad",
    });
  }

  // get user account and profile
  // account
  const singleAppAccount = await AppAccounts.findById(accountId);
  if (singleAppAccount === null || !singleAppAccount) {
    return res
      .status(404)
      .json({ message: "single account not found", status: "bad" });
  }
  // profile
  const singleAppProfile = await AppProfiles.findById(profileId);
  if (singleAppProfile === null || !singleAppProfile) {
    return res
      .status(404)
      .json({ message: "single profile not found", status: "bad" });
  }

  try {
    // launch scrapper
    let credentials = {
      email: singleAppAccount.email,
      password: singleAppAccount.password,
    };
    let job = { keyword, country, platform, onSite, jobType, salary, underTen };
    let searchId = search._id;

    res.status(201).json({
      message: "search started successfully",
      code: "ok",
      payload: { searchId: search._id },
    });

    // if linkedin
    if (platform === "linkedin") {
      return getJobs(credentials, job, searchId);
    }

    // if indeed

    return;
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error starting search",
      code: "bad",
    });
  }
});

module.exports = NewSearchRoute;
