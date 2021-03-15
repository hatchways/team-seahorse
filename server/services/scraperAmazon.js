const puppeteer = require("puppeteer");

function scrapeAmazon(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      const data = await page.evaluate(() => {
        const result = {};
        const title = document.querySelector("#productTitle");
        const price = document.querySelector("#priceblock_ourprice");
        const imageURL = document.querySelector("#landingImage");
        result.title = title.textContent.trim();
        result.price = price.textContent;
        result.imageURL = imageURL.src;
        return result;
      });
      //wait for 1s, to prevent some cases which might cause abuse of use(optional)
      await page.waitForTimeout(1000);
      browser.close();
      return resolve(data);
    } catch (err) {
      return reject(err);
    }
  });
}

module.exports = scrapeAmazon;
