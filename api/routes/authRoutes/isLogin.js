const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const isLoginRoute = express.Router();

// models
const Accounts = require("../../../models/Accounts");

// check user token and know if it s valid token of a valid user or not
isLoginRoute.get("/", async (req, res) => {
  const uToken = req.cookies.uToken;

  if (uToken) {
    // check if token is valid
    jwt.verify(uToken, process.env.JWT_U_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        res.status(403).json({ message: "isNotLogin err", status: "false" });
      } else {
        // check if token uid is found in the user database
        const uId = decodedToken.id;
        const idExist = await Accounts.findById(uId);

        if (idExist === null || !idExist) {
          res.locals.user = null;
          res.status(403).json({ message: "isNotLogin id", status: "false" });
        } else {
          // check for pages
          res.locals.user = idExist;

          res.status(200).json({
            message: "isLogin",
            status: "true",
            user: {
              name: idExist.name,
              id: idExist._id,
              email: idExist.email,
              date: idExist.createdAt,
            },
          });
        }
      }
    });
  } else {
    res.locals.user = null;
    res.status(403).json({ message: "isNotLogin else", status: "false" });
  }
});

module.exports = isLoginRoute;
