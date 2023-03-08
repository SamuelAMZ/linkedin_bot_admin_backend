// this file will filter all links saved in db

// models
const SkipedDomains = require("../../models/skipedDomains");
const Searches = require("../../models/Searches");

// imports functions
const pullLinks = require("../helpers/pullLinks");
const detectDomains = require("../helpers/detectDomains");
const filterDomains = require("../helpers/filterDomains");
const filterExactLinks = require("../helpers/filterExactLinks");

const filterLinks = async (docId) => {
  // pull all links based on doc id (helper)
  const allLinks = await pullLinks(docId);
  if (allLinks === "nolink") {
    return { code: "bad", message: "no link found for this keyword" };
  }
  if (allLinks === "error") {
    return { code: "bad", message: "error when pulling links from database" };
  }

  // detect all links domain and return them as an array (helper)
  const linksDomains = await detectDomains(allLinks.allResults);
  if (linksDomains === "nolink") {
    return {
      code: "bad",
      message: "error extrating domains from result links",
    };
  }

  let filterFinalArray = [];
  let afterDomainsFilter = [];
  let afterLinksFilter = [];

  // filter domain
  if (allLinks.domainsLinks[0] !== "" && allLinks.domainsLinks.length >= 1) {
    // filter and skip exact matches (helper)
    const finalFilterResult = await filterDomains(
      linksDomains,
      allLinks.domainsLinks,
      allLinks.allResults
    );
    if (finalFilterResult.length < 1) {
      return { code: "bad", message: "no link left after final filtering 2" };
    }

    // push to final arr
    afterDomainsFilter.push(...finalFilterResult);
  }

  // filter exact links
  if (allLinks.exactLinks[0] !== "" && allLinks.exactLinks.length >= 1) {
    // filter and skip exact matches (helper)
    // links
    const actualLinks = [];
    allLinks.allResults.forEach((lin) => {
      actualLinks.push(lin.link);
    });
    const finalFilterResult = await filterExactLinks(
      afterDomainsFilter.length > 0 ? afterDomainsFilter : actualLinks,
      allLinks.exactLinks
    );
    if (finalFilterResult.length < 1) {
      return { code: "bad", message: "no link left after final filtering 2" };
    }

    // push to final arr
    afterLinksFilter.push(...finalFilterResult);
  }

  // remove duplicates
  // console.log(afterDomainsFilter.length, afterLinksFilter.length);

  if (afterDomainsFilter.length > 0 && afterLinksFilter.length === 0) {
    filterFinalArray = [...afterDomainsFilter, ...afterLinksFilter];
  } else {
    filterFinalArray = [...afterLinksFilter];
  }

  let uniqueChars = [...new Set(filterFinalArray)];

  // update db
  try {
    const search = await Searches.findById(docId);
    await search.updateOne({ filtered: uniqueChars });
  } catch (error) {
    console.log(error);
  }

  return true;
};

module.exports = filterLinks;
