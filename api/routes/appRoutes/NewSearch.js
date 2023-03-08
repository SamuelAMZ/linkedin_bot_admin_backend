const express = require("express");
const NewSearchRoute = express.Router();

// models
const Searches = require("../../../models/Searches");
const Analytics = require("../../../models/Analytics");

// library
const Joi = require("@hapi/joi");

// scrapper
const getJobs = require("../../../scraper/getJobs/index");

const schema = Joi.object({
  keyword: Joi.string().max(1024).required(),
  country: Joi.string().max(1024).required(),
  platform: Joi.string().max(1024).required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

NewSearchRoute.post("/", async (req, res) => {
  const { keyword, country, platform, email, password } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      keyword,
      country,
      platform,
      email,
      password,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
    return;
  }

  //   creating new post
  const search = new Searches({
    keyword,
    country,
    platform,
  });

  //   save
  try {
    await search.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "error when scraping",
      code: "500",
      error,
    });
  }

  try {
    // launch scrapper
    let result = [];
    let credentials = { email, password };
    let job = { keyword, country };

    if (platform === "linkedin") {
      let allTabResult = await getJobs(credentials, job);
      result.push(...allTabResult);
    }

    if (!result) {
      await search.updateOne({
        isResultFound: false,
        allResults: result,
        steps: {
          step1: "done!",
          step2: "not started",
        },
      });

      return res.status(201).json({
        message: "step 1 finished successfully",
        code: "ok",
        data: { searchId: search._id },
        isFound: false,
      });
    }

    // update database data
    await search.updateOne({
      isResultFound: true,
      allResults: result,
      steps: {
        step1: "done!",
        step2: "loading...",
      },
      status: "step 2",
    });

    // update analytics
    const analytics = await Analytics.findOne({
      _id: "63bf02470a80c92850af91a6",
    });
    await analytics.updateOne({
      searchCount: analytics.searchCount + 1,
      urlCrawledCount: analytics.urlCrawledCount + result.length,
    });

    return res.status(201).json({
      message: "step 1 finished successfully",
      code: "ok",
      data: { result, searchId: search._id },
      isFound: true,
    });
  } catch (error) {
    console.log(error, "error with scraper");
    return res.status(500).json({
      message: "error when scraping",
      code: "500",
      error,
    });
  }
});

module.exports = NewSearchRoute;
