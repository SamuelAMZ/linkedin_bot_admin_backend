const puppeteer = require("puppeteer-extra");
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const { executablePath } = require("puppeteer");
// ressource blocker
const blockResourcesPlugin =
  require("puppeteer-extra-plugin-block-resources")();
puppeteer.use(blockResourcesPlugin);

require("dotenv").config();

// models
const Searches = require("../../models/Searches");

// functions
const loginLinkedin = require("./login/index.js");
const paginateJobsResults = require("./paginateJobsResults/index.js");

const getJobs = async (credentials, job, searchId) => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
    args: [`--window-size=1270,800`, "--no-sandbox"],
    defaultViewport: {
      width: 1270,
      height: 800,
    },
  });

  // add browser pid to search doc
  const search = await Searches.findById(searchId);
  if (!search) {
    return false;
  }
  search.pid = browser.process().pid;
  try {
    await search.save();
  } catch (error) {
    console.log(error);
    return false;
  }

  const page = await browser.newPage();

  // page.on("response", async (response) => {
  //   if (
  //     response.url().split("?")[0] ===
  //       "https://www.linkedin.com/mwlite/search/jobs" &&
  //     response.status() === 200
  //   ) {
  //     console.log("XHR response received");

  //     const preData = await response.text();

  //     console.log(preData);
  //   }
  // });

  // login

  // block images and css...
  blockResourcesPlugin.blockedTypes.add("stylesheet");
  blockResourcesPlugin.blockedTypes.add("media");

  const isLogin = await loginLinkedin(page, credentials);
  if (!isLogin) {
    console.log("login failed");
    await browser.close();
  }

  // paginate in results and add jobs to db
  const allResults = await paginateJobsResults(page, job, searchId);

  if (!allResults) {
    console.log("no job found");
    await browser.close();

    search.status = "jobs fetched";
    await search.save();
  }

  // close browser
  await browser.close();

  search.status = "jobs fetched";
  await search.save();

  return allResults;
};

// prevent browser to close anyway
process
  .on("unhandledRejection", (reason, p) => {
    console.error(reason, "Unhandled Rejection at Promise", p);
  })
  .on("uncaughtException", (err) => {
    console.error(err, "Uncaught Exception thrown");
    process.exit(1);
  });

module.exports = getJobs;
