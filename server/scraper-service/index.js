const express = require("express");
const cron = require("node-cron");
const Queue = require("bull");
const { scrapeAmazon, scrapeEbay, amazonScraper } = require("../services");
const axios = require("axios");

var seconds = new Date().getTime() / 1000;
const app = express();

const ebayQueue = new Queue("ebay");
const ebayQueue2 = new Queue("ebay2");

const amazonQueue = new Queue("amazon");
const amazonQueue2 = new Queue("amazon2");

const craigslistQueue = new Queue("craigslist");
const craigslistQueue2 = new Queue("craigslist2");

const options = {
  attempts: 2,
};

ebayQueue.process(async (job) => {
  const { link, id, currentPrice, name } = job.data;
  console.log(`Ebay 1 : Job Starting: ${id}`);

  try {
    const results = await scrapeEbayProduct(link, id, 1);
    const { data } = await checkPriceChange(
      currentPrice,
      results.price,
      id,
      name
    );

    console.log(data);
    console.log(new Date().getTime() / 1000 - seconds);

    await job.moveToCompleted();
  } catch (error) {
    console.error(`Product : ${id} Failed`);
    throw new Error(error);
  }
});

ebayQueue2.process(async (job) => {
  const { link, id, currentPrice, name } = job.data;
  console.log(`Ebay 2 : Job Starting: ${id}`);

  try {
    const results = await scrapeEbayProduct(link, id, 2);
    const { data } = await checkPriceChange(
      currentPrice,
      results.price,
      id,
      name
    );

    console.log(data);
    console.log(new Date().getTime() / 1000 - seconds);

    await job.moveToCompleted();
  } catch (error) {
    console.error(`Product : ${id} Failed`);
    throw new Error(error);
  }
});

amazonQueue2.process(async (job) => {
  const { link, id, currentPrice, name } = job.data;

  console.log(`Amazon 2 : Job Starting: ${id}`);

  try {
    const results = await scrapeAmazonProduct(link, id, 2);
    console.log(results);

    await job.moveToCompleted();
  } catch (error) {
    console.error(`Product : ${id} Failed`);
    throw new Error(error);
  }
});

const checkPriceChange = (currentPrice, fetchedPrice, productId, name) => {
  console.log(name);

  if (currentPrice !== fetchedPrice) {
    const body = {
      currentPrice,
      newPrice: fetchedPrice,
      id: productId,
      name,
    };

    return axios.post("http://localhost:3001/notification/price", body);
  }

  return { data: { msg: "No Price Change" } };
};

const wrapper = async () => {
  const { data: allProducts } = await axios.get(
    "http://localhost:3001/products/getAll"
  );

  let switcherEbay = true;
  let switcherAmazon = true;
  let switcherCraigslist = true;

  console.log("WRAPPER FUNCTION EXECUTED ------------------------");
  console.log(await ebayQueue.count());

  allProducts.forEach(async (product) => {
    product.currentPrice = parseFloat(product.currentPrice);

    if (product.link.includes("ebay")) {
      console.log("ebay prod");
      distributeJob(ebayQueue, ebayQueue2, switcherEbay);

      switcherEbay = !switcherEbay;
    } else if (product.link.includes("amazon")) {
      console.log("amazon prod");
      distributeJob(amazonQueue, amazonQueue2, switcherAmazon);

      switcherAmazon = !switcherAmazon;
    } else if (product.link.includes("craigslist")) {
      console.log("craigslist prod");
      distributeJob(craigslistQueue, craigslistQueue2, switcherCraigslist);

      switcherCraigslist = !switcherCraigslist;
    }
  });
};

const distributeJob = (queue1, queue2, bool) => {
  if (bool) {
    queue1.add(product, options);
  } else {
    queue2.add(product, options);
  }
};

const scrapeEbayProduct = async (link, id, queueNumber) => {
  const results = await scrapeEbay(link);
  if (results === Error) {
    console.log(`${queueNumber} : JOB FAILED: ${id}`);
    throw new Error();
  }

  return results;
};

const scrapeAmazonProduct = async (link, id, queueNumber) => {
  const results = await scrapeAmazon(link);
  if (results === Error) {
    console.log(`${queueNumber} : JOB FAILED: ${id}`);
    throw new Error();
  }

  return results;
};

// wrapper();

const wrapper2 = async () => {
  const results = await amazonScraper(
    "https://www.amazon.com/Lenovo-Computer-Touchscreen-Display-Quad-Core-i5-1035G1/dp/B08HGQP26V/ref=sr_1_1_sspa?dchild=1&keywords=laptop&qid=1616763457&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzTk1WR1lDUVNKV1JBJmVuY3J5cHRlZElkPUEwNzg4OTYyMU0yVUFSRFlIMlEwWiZlbmNyeXB0ZWRBZElkPUEwNTQ4MjI3MUkwSEdCUTdCWVFFNSZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU="
  );

  console.log(results);
};

wrapper2();

app.listen(8000, () => {
  console.log("Running on port 8k");
});
