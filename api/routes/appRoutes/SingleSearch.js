const express = require("express");
const SingleSearchRoute = express.Router();
const SearchesResults = require("../../../models/SearchResults");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  id: Joi.string().max(1024).required(),
  perPage: Joi.string().max(1024).required(),
  page: Joi.string().max(1024).required(),
});

SingleSearchRoute.post("/", async (req, res) => {
  const { id, perPage, pageNumber: page } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      id,
      perPage,
      page,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   search search id
  try {
    const search = await SearchesResults.find(
      { searchId: id },
      { jobUrl: 1, company: 1, logo: 1, isSelected: 1, title: 1, location: 1 }
    )
      .sort([["createdAt", -1]])
      .skip(Number(page) * Number(perPage))
      .limit(Number(perPage));

    const count = await SearchesResults.countDocuments({ searchId: id });

    // if no search send 400
    if (!search) {
      return res.status(400).json({
        message: `single search not found`,
        code: "bad",
      });
    }

    return res.status(200).json({
      message: `single search fetched successfully`,
      code: "ok",
      payload: search,
      length: count ? count : 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when searching for single search`,
      code: "bad",
    });
  }
});

module.exports = SingleSearchRoute;
