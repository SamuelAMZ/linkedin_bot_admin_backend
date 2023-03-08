const express = require("express");
const PaginationRoute = express.Router();

// validation lib
const Joi = require("@hapi/joi");

// helpers
const searchPagination = require("../../helpers/searchPagination");

const schema = Joi.object({
  page: Joi.string().max(1024).required(),
  perPage: Joi.string().max(1024).required(),
  searchKeyword: Joi.string().max(1024).allow(""),
  target: Joi.string().max(1024).required(),
});

PaginationRoute.post("/", async (req, res) => {
  const { page, perPage, searchKeyword, target } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      page,
      perPage,
      searchKeyword,
      target,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  // if table is not registered yet return error
  if (target !== "linkedin-jobs") {
    return res.status(400).json({
      message: `error listing searches`,
      code: "bad",
      payload: "table conf error",
    });
  }

  //   search search id
  try {
    let dataReturned = null;

    if (target === "linkedin-jobs") {
      dataReturned = await searchPagination(searchKeyword, page, perPage);
    }

    // all result found
    const list = dataReturned?.list;

    // get total result
    const totalItems = dataReturned?.total;

    // if no search send 400
    if (!list || !totalItems) {
      return res.status(400).json({
        message: `error listing searches`,
        code: "bad",
        payload: "nothing",
      });
    }

    return res.status(200).json({
      message: `single search fetched successfully`,
      code: "ok",
      payload: { list, totalItemsLength: totalItems },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when searching for single search`,
    });
  }
});

module.exports = PaginationRoute;
