// this file is a helper, that will get the number of pages of the results

const getNumberOfPages = async (page) => {
  let numberOfPage = 1;

  try {
    await page.waitForSelector(".artdeco-pagination__pages", { timeout: 5000 });
  } catch (error) {
    console.log(error.message);
    console.log("cant find the selector");
  }

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

      return Number(btnText);
    });
  } catch (error) {
    console.log(error);
    console.log("no pagination only one page");
  }

  console.log(numberOfPage);
  return numberOfPage;
};

module.exports = getNumberOfPages;
