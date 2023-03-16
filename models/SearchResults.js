const mongoose = require("mongoose");

const searchesResults = new mongoose.Schema(
  {
    searchId: {
      type: String,
    },
    jobUrl: {
      type: String,
    },
    company: {
      type: String,
    },
    location: {
      type: String,
    },
    title: {
      type: String,
    },
    logo: {
      type: String,
    },
    isSelected: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SearchesResults", searchesResults);
