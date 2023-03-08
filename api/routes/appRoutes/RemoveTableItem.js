const express = require("express");
const RemoveTableItemRoute = express.Router();
const Joi = require("@hapi/joi");

const schema = Joi.object({
  id: Joi.string().max(1024).required(),
  target: Joi.string().max(1024).required(),
});

RemoveTableItemRoute.post("/", async (req, res) => {
  const { id, target } = req.body;

  // joi validation sbody data
  try {
    const validation = await schema.validateAsync({
      id,
      target,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message });
    return;
  }

  //   search search id
  try {
    let itemToRemove;

    // if no search send 400
    if (!itemToRemove) {
      return res.status(400).json({
        message: `domain not found`,
        code: "bad",
        payload: "nothing",
      });
    }

    // remove search
    try {
      await itemToRemove.remove();

      return res.status(200).json({
        message: `domain removed successfully`,
        code: "ok",
        payload: "removed",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message: `error removing domain`,
        code: "bad",
        payload: "nothing",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: `server error when searching for domain`,
    });
  }
});

module.exports = RemoveTableItemRoute;
