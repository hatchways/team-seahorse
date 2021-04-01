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

  let imageURL;
  let title;
  let price;

  //Update for the edge case of discounted items
  //*[@id="mm-saleDscPrc"]
  try {
    imageURL = await getValue('//*[@id="icImg"]', "src");
    title = await getValue('//*[@id="itemTitle"]/text()', "textContent");
    price = await getValue('//*[@id="prcIsum"]', "textContent");

    price = parseFloat(price.split("$")[1].replace(",", ""));
  } catch (error) {
    console.error(error);
    return Error;
  }
  browser.close();

  return { imageURL, title, price };
};

module.exports = scrapeEbay;
