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

  let imgUrl;
  let title;
  let price;

  try {
    imgUrl = await getValue('//*[@id="icImg"]', "src");
    title = await getValue('//*[@id="itemTitle"]/text()', "textContent");
    price = await getValue('//*[@id="prcIsum"]', "textContent");
  } catch (error) {
    return {
      msg: `Error getting values on product link. Please check if product is still available: ${url}`,
      error,
    };
  }

  browser.close();

  return { imgUrl, title, price };
};

module.exports = scrapeEbay;
