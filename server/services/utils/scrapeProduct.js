const {
  scrapeAmazon,
  scrapeEbay,
  scrapeCraigslist,
} = require("../../services");

const scrapeEbayProduct = async (link, id, queueNumber) => {
  const results = await scrapeEbay(link);
  if (results === Error) {
    console.log(`Ebay Product Queue #${queueNumber} : JOB FAILED: ${id}`);
    throw new Error();
  }

  return results;
};

const scrapeAmazonProduct = async (link, id, queueNumber) => {
  const results = await scrapeAmazon(link);
  if (results === Error) {
    console.log(`Amazon Product Queue #${queueNumber} : JOB FAILED: ${id}`);
    throw new Error();
  }

  return results;
};

const scrapeCraigslistProduct = async (link) => {
  const results = await scrapeCraigslist(link);
  if (results === Error) {
    console.log(`Craigslist Product Queue #${queueNumber} : JOB FAILED: ${id}`);
    throw new Error();
  }

  return results;
};

module.exports = {
  scrapeEbayProduct,
  scrapeAmazonProduct,
  scrapeCraigslistProduct,
};
