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

// functions
const loginLinkedin = require("./login/index.js");
const newJobSearch = require("./newSearch/index.js");
const paginateJobsResults = require("./paginateJobsResults/index.js");

// details
// const credentials = {
//   email: "samuelthedev09@gmail.com",
//   password: "Afiwa18hp@@@",
// };
// const job = {
//   title: "Software Engineer",
//   country: "United States",
// };

const getJobs = async (credentials, job) => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: executablePath(),
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 400,
    height: 700,
    deviceScaleFactor: 1,
  });

  // login
  const isLogin = await loginLinkedin(page, credentials);
  if (!isLogin) {
    console.log("login failed");
    await browser.close();
  }

  // search for the job
  const jobs = await newJobSearch(page, job);

  // paginate in results and add jobs to db
  const allResults = await paginateJobsResults(page, job);

  if (!allResults) {
    console.log("failed to add jobs to db");
    await browser.close();
  }

  // close browser
  await browser.close();

  return allResults;
};

module.exports = getJobs;
