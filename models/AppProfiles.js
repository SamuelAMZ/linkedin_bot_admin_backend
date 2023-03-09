const mongoose = require("mongoose");

const appProfiles = new mongoose.Schema(
  {
    uid: {
      type: String,
    },
    title: {
      type: String,
    },
    cv: {
      type: String,
    },
    cl: {
      type: String,
    },
    accountLinked: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AppProfiles", appProfiles);
