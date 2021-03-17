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
      const galleryElement = document.querySelector(".gallery");
      return {
        title: document.querySelector("#titletextonly").textContent,
        price: document.querySelector(".price").textContent,
        imageUrl:
          //If there isn't a given image, we use the URL of the placeholder image Craigslist uses.
          galleryElement != null
            ? document.querySelector(".gallery").children[3].firstElementChild
                .firstElementChild.firstElementChild.src
            : "https://craigslist.org/images/peace.jpg",
        isStillAvailable: false,
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

scrapeCraigslist("https://stlouis.craigslist.org/vgm/5639115690.html").then(
  console.log
);

module.exports = scrapeCraigslist;
