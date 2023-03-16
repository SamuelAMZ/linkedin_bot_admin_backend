// this file add the job individualy to the database
const SearchesResults = require("../../../models/SearchResults");

const addJobToDb = async (job, searchId) => {
  const newJob = new SearchesResults({
    searchId,
    ...job,
  });

  try {
    await newJob.save();
  } catch (error) {
    console.log(error);
  }
};

module.exports = addJobToDb;
