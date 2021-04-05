const express = require("express");
const cron = require("node-cron");
const Queue = require("bull");
const axios = require("axios");
const app = express();
const distributeJob = require("../services/utils/distributeJob");
const checkPriceThenUpdateDb = require("../services/utils/checkPriceThenUpdateDb");
const {
  scrapeEbayProduct,
  scrapeCraigslistProduct,
  scrapeAmazonProduct,
} = require("../services/utils/scrapeProduct");

require("dotenv").config();

const ebayQueue = new Queue("ebay");
const ebayQueue2 = new Queue("ebay2");
const amazonQueue = new Queue("amazon");
const amazonQueue2 = new Queue("amazon2");
const craigslistQueue = new Queue("craigslist");
const craigslistQueue2 = new Queue("craigslist2");

const options = {
  attempts: 2,
};

const scrapeProcess_ = (scrape, companyName, num) => async (job) => {
  const { link, id, currentPrice, name } = job.data;
  console.log(`${companyName} ${num} : Job Starting: ${id}`);
  try {
    let seconds = new Date().getTime() / 1000;
    const results = await scrape(link, id, 1);
    const { data } = await checkPriceThenUpdateDb(
      currentPrice,
      results.price,
      id,
      name
    );

    console.log(data);
    console.log(
      `Process finish at ${parseInt(
        new Date().getTime() / 1000 - seconds
      )} seconds\n`
    );

    await job.moveToCompleted();
  } catch (error) {
    console.error(`${companyName} Product : ${id} Failed`);
    console.log("-----------------");
    console.error(error);
    console.log("-----------------");
    throw new Error(error);
  }
};

//For some reason, I'm getting a Missing lock error when abstracting the
//process. For now, will be placed here to have a working server
//#region Functions or code that will run when a job is pushed in to the respective queue
ebayQueue.process(scrapeProcess_(scrapeEbayProduct, "Ebay", 1));
ebayQueue2.process(scrapeProcess_(scrapeEbayProduct, "Ebay", 2));
amazonQueue.process(scrapeProcess_(scrapeAmazonProduct, "Amazon", 1));
amazonQueue2.process(scrapeProcess_(scrapeAmazonProduct, "Amazon", 2));
craigslistQueue.process(
  scrapeProcess_(scrapeCraigslistProduct, "Craigslist", 1)
);
craigslistQueue2.process(
  scrapeProcess_(scrapeCraigslistProduct, "Craigslist", 2)
);
//#endregion

cron.schedule("*/2 * * * *", async () => {
  const { data: allProducts } = await axios.get(
    process.env.BACKEND_DOMAIN + "/products/get-all",
    {
      headers: {
        password: "password",
      },
    }
  );

  console.log(`Total products acquired: ${allProducts.length}`);

  let switcherEbay = true;
  let switcherAmazon = true;
  let switcherCraigslist = true;

  //#region Show number unfinished job from previous open of server
  console.log(
    `Total number of jobs still in ebayQueue: ${await ebayQueue.count()}`
  );
  console.log(
    `Total number of jobs still in ebayQueue2: ${await ebayQueue2.count()}`
  );
  console.log(
    `Total number of jobs still in amazonQueue: ${await amazonQueue.count()}`
  );
  console.log(
    `Total number of jobs still in amazonQueue2: ${await amazonQueue2.count()}`
  );
  console.log(
    `Total number of jobs still in craigslistQueue: ${await craigslistQueue.count()}`
  );
  console.log(
    `Total number of jobs still in craigslistQueue2: ${await craigslistQueue2.count()} \n`
  );
  //#endregion

  allProducts.forEach(async (product) => {
    product.currentPrice = parseFloat(product.currentPrice);

    if (product.link.includes("ebay")) {
      console.log(`Placing on ebayQueues: ${product.name}`);
      distributeJob(ebayQueue, ebayQueue2, product, switcherEbay, options);

      switcherEbay = !switcherEbay;
    } else if (product.link.includes("amazon")) {
      console.log(`Placing on amazonQueues: ${product.name}`);
      distributeJob(
        amazonQueue,
        amazonQueue2,
        product,
        switcherAmazon,
        options
      );

      switcherAmazon = !switcherAmazon;
    } else if (product.link.includes("craigslist")) {
      console.log(`Placing on craigslistQueue: ${product.name}`);
      distributeJob(
        craigslistQueue,
        craigslistQueue2,
        product,
        switcherCraigslist,
        options
      );

      switcherCraigslist = !switcherCraigslist;
    }
  });
  console.log("\n");
});

app.listen(8000, () => {
  console.log("Running on port 8k");
});
