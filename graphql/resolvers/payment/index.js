const { JpPaymentTC } = require('../../composers');

module.exports = () => {
  // Mutations
  JpPaymentTC.addResolver(require('./findOrCreatePayment'));
  JpPaymentTC.addResolver(require('./findOrCreatePaymentV2'));
}
