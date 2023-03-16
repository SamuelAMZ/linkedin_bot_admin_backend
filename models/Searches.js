const mongoose = require("mongoose");

const searches = new mongoose.Schema(
  {
    uid: {
      type: String,
    },
    pid: {
      type: String,
    },
    accountId: {
      type: String,
    },
    profileId: {
      type: String,
    },
    keyword: {
      type: String,
    },
    platform: {
      type: String,
    },
    isResultFound: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "loading",
    },
    country: {
      type: String,
    },
    onSite: {
      type: String,
    },
    jobType: {
      type: String,
    },
    salary: {
      type: String,
    },
    underTen: {
      type: Boolean,
    },
    linkedinFilterUri: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Searches", searches);
