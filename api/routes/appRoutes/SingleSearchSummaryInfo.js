const express = require("express");
const SingleSearchSummaryInfo = express.Router();
const Searches = require("../../../models/Searches");
const AppAccounts = require("../../../models/AppAccounts");
const AppProfiles = require("../../../models/AppProfiles");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  id: Joi.string().max(1024).required(),
});

SingleSearchSummaryInfo.post("/", async (req, res) => {
  const { id } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      id,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   search search id
  try {
    const search = await Searches.find(
      {
        _id: id,
      },
      { accountId: 1, profileId: 1, status: 1 }
    );

    // if no search send 400
    if (!search) {
      return res.status(400).json({
        message: `error getting summary info data`,
        code: "bad",
      });
    }

    const appAccount = await AppAccounts.find(
      {
        _id: search[0].accountId,
      },
      { type: 1, email: 1 }
    );
    const appProfile = await AppProfiles.find(
      {
        _id: search[0].profileId,
      },
      { title: 1 }
    );

    return res.status(200).json({
      message: `summary info fetched successfully`,
      code: "ok",
      payload: {
        account: appAccount[0],
        profile: appProfile[0],
        status: search[0].status,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when searching for single search summary data`,
      code: "bad",
    });
  }
});

module.exports = SingleSearchSummaryInfo;
