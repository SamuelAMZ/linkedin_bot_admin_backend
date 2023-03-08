const mongoose = require("mongoose");

const analytics = new mongoose.Schema({
  searchCount: {
    type: Number,
    default: 0,
  },
  urlCrawledCount: {
    type: Number,
    default: 0,
  },
  pageVisitedCount: {
    type: Number,
    default: 0,
  },
  emailSentCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Analytics", analytics);
