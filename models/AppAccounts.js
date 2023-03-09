const mongoose = require("mongoose");

const appAccounts = new mongoose.Schema(
  {
    uid: {
      type: String,
    },
    type: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppAccounts", appAccounts);
