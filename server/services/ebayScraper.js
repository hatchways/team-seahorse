const puppeteer = require("puppeteer");

const scrapeEbay = async (url) => {
  const getValue = async (XPath, property) => {
    const [el] = await page.$x(XPath);
    const data = await el.getProperty(property);
    const parsedData = await data.jsonValue();

    return parsedData;
  };

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const imgUrl = await getValue('//*[@id="icImg"]', "src");
  const title = await getValue('//*[@id="itemTitle"]/text()', "textContent");
  const price = await getValue('//*[@id="prcIsum"]', "textContent");

  browser.close();

  return { imgUrl, title, price };
};

module.exports = scrapeEbay;
