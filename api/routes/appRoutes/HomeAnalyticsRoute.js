const express = require("express");
const HomeAnalytics = express.Router();

const Analytics = require("../../../models/Analytics");

HomeAnalytics.post("/", async (req, res) => {
  //   search search id
  try {
    const analytics = await Analytics.find();
    // if no search send 400
    if (!analytics) {
      return res.status(400).json({
        message: `error loading analytics`,
        code: "bad",
        payload: "nothing",
      });
    }

    return res.status(200).json({
      message: `analytics fetched successfully`,
      code: "ok",
      payload: analytics,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when searching for analytics`,
    });
  }
});

module.exports = HomeAnalytics;
