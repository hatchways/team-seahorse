const scrapeEbay = require("./ebayScraper");
const scrapeAmazon = require("./scraperAmazon");
const scrapeCraigslist = require("./scraperCraigslist");

const getCompany = (url) => {
  if (url.includes("amazon")) return [scrapeAmazon, "amazon"];
  if (url.includes("ebay")) return [scrapeEbay, "ebay"];
  if (url.includes("craigslist")) return [scrapeCraigslist, "craigslist"];
  else return "unknow company";
};

module.exports = getCompany;
