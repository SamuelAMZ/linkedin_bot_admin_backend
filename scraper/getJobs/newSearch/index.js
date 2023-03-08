// this file search on linkedin for the new job title and country
// and return the jobs in an array

const newJobSearch = async (page, job) => {
  console.log("searching jobs...");

  //  build job link
  const jobSearch = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
    job.keyword
  )}&location=${encodeURIComponent(job.country)}&f_AL=true`;
  // &start=50

  // go to it
  // visit from the top of the archives
  await page.goto(jobSearch, {
    waitUntil: "networkidle2",
    timeout: 120000,
  });

  // wait for the page to load
  await page.waitForTimeout(2000);
};

module.exports = newJobSearch;
