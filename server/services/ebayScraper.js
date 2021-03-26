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

    price = parsePrice(price);
  } catch (error) {
    return Error;
  }
  browser.close();

  return { imageURL, title, price };
};

const parsePrice = (str) => {
  let priceString = "";
  let decimalFound = false;
  for (let i = 0; i < str.length; i++) {
    if (isCharNumber(str[i])) {
      for (let x = i; x < str.length; x++) {
        if (isCharNumber(str[x])) {
          priceString += str[x];
        } else {
          if (!decimalFound) {
            priceString += ".";
            decimalFound = true;
          } else {
            return parseFloat(priceString);
          }
        }
      }

      return parseFloat(priceString);
    }
  }

  return { msg: "No Number found" };
};

function isCharNumber(c) {
  return c >= "0" && c <= "9";
}

module.exports = scrapeEbay;
