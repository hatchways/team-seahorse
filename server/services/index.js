const scrapeAmazon = require("./scraperAmazon");
const scrapeEbay = require("./ebayScraper");
const scrapeCraigslist = require("./scraperCraigslist");
const getCompany = require("./getCompany");

module.exports = {
  scrapeAmazon,
  scrapeEbay,
  scrapeCraigslist,
  getCompany,
};
