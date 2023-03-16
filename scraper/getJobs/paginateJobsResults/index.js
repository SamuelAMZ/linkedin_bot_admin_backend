// this file paginate through the results of the search

// helpers
const autoScroll = require("../../helpers/autoScroll");
const getNumberOfPages = require("./getNumberOfPages");
const grabJobs = require("./grabJobs");
const addJobToDb = require("./addJobsToDb");

const paginateJobsResults = async (page, job, searchId) => {
  // link  to the results pages
  let jobSearch = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
    job.keyword
  )}&location=${encodeURIComponent(job.country)}&f_AL=true`;

  // navigate to result pages
  try {
    await page.goto(jobSearch, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });
  } catch (error) {
    console.log(error.mesage);
  }

  // scroll top then to bottom
  await page.evaluate(() => {
    window.scroll(0, 0);
  });
  await autoScroll(page);

  // get number of pages
  const numerOfPage = await getNumberOfPages(page);

  for (let index = 0; index < numerOfPage; index++) {
    // link  to the results pages
    let jobSearch = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
      job.keyword
    )}&location=${encodeURIComponent(job.country)}&f_AL=true&start=${
      index * 25
    }`;

    try {
      await page.goto(jobSearch, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });
    } catch (error) {
      console.log(error.message);
    }

    // scroll top then to bottom
    await page.evaluate(() => {
      window.scroll(0, 0);
    });
    await autoScroll(page);

    // grad the jobs
    const jobs = await grabJobs(page);

    // add to db
    for (let y = 0; y < jobs.length; y++) {
      await addJobToDb(jobs[y], searchId);
    }
  }
};

module.exports = paginateJobsResults;
