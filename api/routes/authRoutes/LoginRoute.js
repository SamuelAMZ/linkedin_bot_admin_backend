const express = require("express");
const LoginRoute = express.Router();

// model
const Accounts = require("../../../models/Accounts");
// validation
const Joi = require("@hapi/joi");
// dehashing pass
const bcrypt = require("bcrypt");
// jwt
const { createToken } = require("./jwt");

const schema = Joi.object({
  email: Joi.string().lowercase().required(),
  password: Joi.string().max(1024).required(),
});

LoginRoute.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // joi validation sbody data
    const validation = await schema.validateAsync({
      email,
      password,
    });
  } catch (error) {
    res.status(400).json({ message: error.details[0].message, code: "bad" });
    return;
  }

  // validation
  if (!email || !password) {
    res.status(400).json({ message: "verify your inputs", code: "bad" });
    return;
  }

  // push data to it if username or email found
  const verifier = [];
  let userFound;

  // check for the email address in the db
  const checkUser = await Accounts.findOne({
    email: email.toLowerCase().trim(),
  });
  if (checkUser) {
    verifier.push(1);
    userFound = checkUser;
  }

  if (verifier.length === 0) {
    res.status(400).json({ message: "email not found", code: "bad" });
    return;
  } else {
    // dehash pass and try to match them
    if (await bcrypt.compare(password, userFound.password)) {
      // generate user token
      const token = createToken(userFound.id);
      // pass token to cookie
      res.cookie("uToken", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).json({
        message: "login successfully",
        code: "ok",
        id: userFound.id,
        name: userFound.name,
      });
    } else {
      res
        .status(400)
        .json({ message: "verify email or password", code: "bad" });
      return;
    }
  }
});

module.exports = LoginRoute;
