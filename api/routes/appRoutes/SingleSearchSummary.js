const express = require("express");
const SingleSearchSummaryRoute = express.Router();
const SearchesResults = require("../../../models/SearchResults");
const Searches = require("../../../models/Searches");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  id: Joi.string().max(1024).required(),
});

SingleSearchSummaryRoute.post("/", async (req, res) => {
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
    const count = await SearchesResults.countDocuments({
      searchId: id,
      isSelected: false,
    });

    // if no search send 400
    if (!count) {
      return res.status(200).json({
        message: `error getting summary data`,
        code: "bad",
        payload: 0,
      });
    }

    return res.status(200).json({
      message: `summary data fetched successfully`,
      code: "ok",
      payload: count,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when searching for single search summary data`,
      code: "bad",
    });
  }
});

module.exports = SingleSearchSummaryRoute;
