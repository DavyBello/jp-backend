const { JpPriceTC } = require('../../composers');
const keystone = require('keystone');
const JpPrice = keystone.list('JpPrice').model;

module.exports = {
  kind: 'query',
  name: 'latestJpPrice',
  description: 'returns the most recent price in the database',
  type: JpPriceTC,
  resolve: () => JpPrice.findOne().sort({createdAt: -1})
}
