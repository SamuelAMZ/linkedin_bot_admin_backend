require("dotenv").config();
const jwt = require("jsonwebtoken");
const Accounts = require("../models/Accounts");

// check user token and know if it s valid token of a valid user or not
const checkUToken = (req, res, next) => {
  const uToken = req.cookies.uToken;

  if (!uToken)
    return res.status(403).json({ message: "need to login first 'code 003'" });

  // check if token is valid
  jwt.verify(uToken, process.env.JWT_U_SECRET, async (err, decodedToken) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "need to login first 'code 004'" });
    } else {
      // check if token uid is found in the user database
      const uId = decodedToken.id;
      const idExist = await Accounts.findById(uId);

      if (idExist === null || !idExist) {
        return res
          .status(403)
          .json({ message: "need to login first 'code 004'" });
      } else {
        // check for pages
        next();
      }
    }
  });
};

module.exports = checkUToken;
