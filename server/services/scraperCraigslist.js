const puppeteer = require("puppeteer");

const scrapeCraigslist = async (url) => {
  //TODO: Might want to use something like puppeteer-cluster to cut down on browser instances. Might not matter though.
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  await page.goto(url);
  const data = await page.evaluate(() => {
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
    };
  });
  //wait for 1s, to prevent some cases which might cause abuse of use(optional)
  await page.waitForTimeout(1000);
  browser.close();
  return data;
};

module.exports = scrapeCraigslist;
