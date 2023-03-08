// this file login to linkedin

const loginLinkedin = async (page, credentials) => {
  console.log("login...");

  // visit from the top of the archives
  await page.goto("https://www.linkedin.com/login", {
    waitUntil: "networkidle2",
    timeout: 120000,
  });

  //   typing the logins
  await page.waitForSelector("#username");
  await page.type("#username", credentials.email, {
    delay: 100,
  });

  await page.waitForSelector("#password");
  await page.type("#password", credentials.password, {
    delay: 100,
  });

  //   click for search
  const launchSearchBtn = await page.$(
    "[data-litms-control-urn='login-submit']"
  );
  await launchSearchBtn.evaluate((b) => b.click());

  //   wait
  await page.waitForTimeout(3000);

  // return true if login is successful
  return true;
};

module.exports = loginLinkedin;
