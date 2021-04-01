const distributeJob = (queue1, queue2, product, bool, options) => {
  if (bool) {
    queue1.add(product, options);
  } else {
    queue2.add(product, options);
  }
};

module.exports = distributeJob;
