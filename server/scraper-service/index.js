const express = require("express");
const cron = require("node-cron");
const Queue = require("bull");
const { scrapeAmazon, scrapeEbay } = require("../services");
const http = require("http");
const axios = require("axios");

var seconds = new Date().getTime() / 1000;
const app = express();

const ebayQueue = new Queue("ebay");
const ebayQueue2 = new Queue("ebay2");
const amazonQueue = new Queue("amazon");
const craigslistQueue = new Queue("craigslist");

const options = {
  // delay: 60000, // 1 min in ms
  attempts: 1,
};

ebayQueue.process(async (job) => {
  const { link, id, currentPrice, previousPrice } = job.data;
  console.log(`1 : Job Starting: ${id}`);

  try {
    const results = await scrapeEbay(link);
    if (results === Error) {
      console.log(`1 : JOB FAILED: ${id}`);
      throw new Error();
    }

    const { data } = await checkPriceChange(
      currentPrice,
      previousPrice,
      results.price,
      id
    );

    console.log(data);

    console.log(new Date().getTime() / 1000 - seconds);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

ebayQueue2.process(async (job) => {
  const { link, id, currentPrice, previousPrice } = job.data;
  console.log(`2 : Job Starting: ${id}`);

  try {
    const results = await scrapeEbay(link);
    if (results === Error) {
      console.log(`2 : JOB FAILED: ${id}`);
      throw new Error();
    }

    console.log(results);

    //check for price change
    const { data } = await checkPriceChange(
      currentPrice,
      previousPrice,
      results.price,
      id
    );
    console.log(data);
    console.log(new Date().getTime() / 1000 - seconds);
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

const checkPriceChange = (
  currentPrice,
  fetchedPrice,
  productId
) => {
  if (currentPrice !== fetchedPrice) {
    const body = {
      currentPrice,
      id: productId,
      newPrice: fetchedPrice,
    };

    return axios.put("http://localhost:3001/products/update", body);
  }

  return { data: { msg: "No Price Change" } };
};

const wrapper = async () => {
  const { data: allProducts } = await axios.get(
    "http://localhost:3001/products/getAll"
  );
  let alt = true;
  console.log("WRAPPER FUNCTION EXECUTED ------------------------");
  //add check if which scraper function
  console.log(await ebayQueue.count());
  if (true) {
    allProducts.forEach(async (product) => {
      if (alt) {
        ebayQueue.add(product, options);
      } else {
        ebayQueue2.add(product, options);
      }
      alt = !alt;
    });
  }
};

wrapper();

app.listen(8000, () => {
  console.log("Running on port 8k");
});
