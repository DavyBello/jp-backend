const { AffiliateTC } = require('../../../composers');

module.exports = () => {
  AffiliateTC.addResolver(require('./createAccount'))
  AffiliateTC.addResolver(require('./createCoupon'))
}
