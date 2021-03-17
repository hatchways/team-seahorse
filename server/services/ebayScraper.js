const puppeteer = require("puppeteer");

const scrape = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const [el] = await page.$x('//*[@id="icImg"]');
  const src = await el.getProperty("src");
  const imageUrl = await src.jsonValue();

  const [el2] = await page.$x('//*[@id="itemTitle"]/text()');
  const title = await el2.getProperty("textContent");
  const titleTxt = await title.jsonValue();

  const [el3] = await page.$x('//*[@id="prcIsum"]');
  const price = await el3.getProperty("textContent");
  const priceTxt = await price.jsonValue();

  console.log({ imageUrl, title: titleTxt, price: priceTxt });

  browser.close();
};

module.exports = scrapeEbay;
