// this file is a helper, that will get the number of pages of the results

const getNumberOfPages = async (page) => {
  let numberOfPage = 1;

  try {
    numberOfPage = await page.evaluate(() => {
      let ulLength = document.querySelector(
        ".artdeco-pagination__pages.artdeco-pagination__pages--number"
      ).children.length;
      let btnText = Array.from(
        document.querySelector(
          ".artdeco-pagination__pages.artdeco-pagination__pages--number"
        ).children
      )[ulLength - 1].innerText;

      return btnText;
    });
  } catch (error) {
    console.log(error);
    console.log("no pagination only one page");
  }

  // return numberOfPage;
  return 2;
};

module.exports = getNumberOfPages;
