const puppeteer = require("puppeteer");

//Returns title, price, and image URL if item is still up. If the item isn't still up, returns isStillAvailable as false.
const scrapeCraigslist = async (url) => {
  //TODO: Might want to use something like puppeteer-cluster to cut down on browser instances. Might not matter though.
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  const res = await page.goto(url);
  let productInfo = undefined;
  if (res.status() == "200") {
    productInfo = await page.evaluate(() => {
      const imageContainer = document.querySelector('*[id^="1_image"]');
      const priceElement = document.querySelector(".price");
      if (priceElement == null) {
        throw "no price";
      }
      return {
        title: document.querySelector("#titletextonly").textContent,
        //Removes currency symbol (e.g. "$25" -> "25")
        price: priceElement.textContent.substr(1),
        imageURL:
          //If there isn't a given image, we use the URL of the placeholder image Craigslist uses.
          imageContainer != null
            ? imageContainer.firstElementChild.src
            : "https://craigslist.org/images/peace.jpg",
        isStillAvailable: true,
      };
    });
  } else {
    productInfo = { isStillAvailable: false };
  }

  //wait for 1s, to prevent some cases which might cause abuse of use(optional)
  await page.waitForTimeout(1000);
  browser.close();
  return productInfo;
};

module.exports = scrapeCraigslist;
