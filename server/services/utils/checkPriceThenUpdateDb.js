const axios = require("axios");

const checkPriceChange = (currentPrice, fetchedPrice, id, name) => {
  console.log(`Product Name ${name}`);
  console.log(`Current Price ${currentPrice}`);
  console.log(`Fetched Price ${fetchedPrice}`);

  if (currentPrice !== fetchedPrice) {
    const body = {
      newPrice: fetchedPrice,
      id,
      name,
    };

    return axios.post("http://localhost:3001/notification/price", body);
  }

  return { data: { msg: "No Price Change" } };
};

module.exports = checkPriceChange;
