const express = require("express");
const StopSearchRoute = express.Router();
const Searches = require("../../../models/Searches");
const Joi = require("@hapi/joi");

const schema = Joi.object({
  searchId: Joi.string().max(1024).required(),
});

StopSearchRoute.post("/", async (req, res) => {
  const { searchId } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      searchId,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message, code: "bad" });
    return;
  }

  //   search for search
  const search = await Searches.findById(searchId);
  if (!search) {
    return res.status(400).json({ message: "search not found", code: "bad" });
  }

  try {
    // kill browser
    process.kill(search.pid);

    // edit status
    search.status = "jobs fetched";
    await search.save();

    return res
      .status(200)
      .json({ message: "search stopped successfully", code: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "something wrong when stopping the process, retry later",
      code: "bad",
    });
  }
});

module.exports = StopSearchRoute;
