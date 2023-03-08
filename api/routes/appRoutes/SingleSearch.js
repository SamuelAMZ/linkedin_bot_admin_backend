const express = require("express");
const SingleSearchRoute = express.Router();
const Searches = require("../../../models/Searches");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  id: Joi.string().max(1024).required(),
});

SingleSearchRoute.post("/", async (req, res) => {
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
    const search = await Searches.findOne({ _id: id });
    // if no search send 400
    if (!search) {
      return res.status(400).json({
        message: `single search not found`,
        code: "bad",
        payload: "nothing",
      });
    }

    return res.status(200).json({
      message: `single search fetched successfully`,
      code: "ok",
      payload: search,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when searching for single search`,
    });
  }
});

module.exports = SingleSearchRoute;
