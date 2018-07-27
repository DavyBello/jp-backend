const { JpPriceTC } = require('../../composers');

module.exports = () => {
  // Queries
  JpPriceTC.addResolver(require('./latestPrice'));
}
