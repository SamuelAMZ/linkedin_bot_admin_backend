// this file will grab the jobs details
const grabJobs = async (page) => {
  let results = [];

  await page.waitForTimeout(1000);

  try {
    results = await page.evaluate(() => {
      let dataFound = [];

      Array.from(
        document.querySelector("ul.scaffold-layout__list-container").children
      ).forEach((elm) => {
        dataFound.push({
          url: elm.querySelector("a").href,
          img: elm.querySelector("a > img").src,
          title: elm
            .querySelector(
              ".flex-grow-1.artdeco-entity-lockup__content.ember-view"
            )
            .innerText.split("\n")[0],
          company: elm
            .querySelector(
              ".flex-grow-1.artdeco-entity-lockup__content.ember-view"
            )
            .innerText.split("\n")[1],
          location: elm
            .querySelector(
              ".flex-grow-1.artdeco-entity-lockup__content.ember-view"
            )
            .innerText.split("\n")[2],
        });
      });

      return dataFound;
    });
  } catch (error) {
    console.log(error);
  }

  console.log(results);
  return results;
};

module.exports = grabJobs;
