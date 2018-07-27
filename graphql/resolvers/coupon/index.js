const { JpCouponTC } = require('../../composers');

module.exports = () => {
  // Mutations
  JpCouponTC.addResolver(require('./findCoupon'));
}
