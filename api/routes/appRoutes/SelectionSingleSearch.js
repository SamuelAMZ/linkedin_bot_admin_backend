const express = require("express");
const SelectionSingleSearch = express.Router();
const SearchesResults = require("../../../models/SearchResults");

// library
const Joi = require("@hapi/joi");

const schema = Joi.object({
  jobId: Joi.string().max(1024).required(),
  action: Joi.boolean().required(),
});

SelectionSingleSearch.post("/", async (req, res) => {
  const { jobId, action } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      jobId,
      action,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message, code: "bad" });
    return;
  }

  // search for the job
  const job = await SearchesResults.findById(jobId);

  if (job === null || !job) {
    return res.status(403).json({ message: "job not found", code: "bad" });
  }

  // update the job
  job.isSelected = action;

  try {
    await job.save();

    return res.status(200).json({
      message: `job selection updated successfully`,
      code: "ok",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `something wrong when updating job selection, try later`,
      code: "bad",
    });
  }
});

module.exports = SelectionSingleSearch;
