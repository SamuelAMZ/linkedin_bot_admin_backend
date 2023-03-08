// this file paginate through the results of the search

// helpers
const autoScroll = require("../../helpers/autoScroll");
const getNumberOfPages = require("./getNumberOfPages");
const grabJobs = require("./grabJobs");

const paginateJobsResults = async (page, job) => {
  // scroll to bottom
  await autoScroll(page);
  let allJobs = [];

  // get results total pages count
  const count = await getNumberOfPages(page);

  for (let index = 0; index < count; index++) {
    // link  to the results pages
    let jobSearch = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
      job.keyword
    )}&location=${encodeURIComponent(job.country)}&f_AL=true&start=${
      index * 25
    }`;

    // navigate to result pages
    await page.goto(jobSearch, {
      waitUntil: "networkidle2",
      timeout: 120000,
    });

    // scroll to bottom
    await autoScroll(page);

    // grad the jobs
    const jobs = await grabJobs(page);

    // add to alljobs array
    allJobs.push(...jobs);
  }

  return allJobs;
};

module.exports = paginateJobsResults;
