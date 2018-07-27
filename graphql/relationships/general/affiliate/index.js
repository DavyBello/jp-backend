const { AffiliateTC, CandidateTC, JpCouponTC } = require('../../../composers');

module.exports = () => {
  AffiliateTC.addRelation('customers', {
      resolver: () => CandidateTC.getResolver('pagination'),
      prepareArgs: {
        filter: (source) => ({ coupon: source.coupon}),
      },
      projection: { coupon: 1 },
    }
  );
  AffiliateTC.addRelation('coupon', {
      resolver: () => JpCouponTC.getResolver('findOne'),
      prepareArgs: {
        filter: (source) => ({ affiliate: source._id}),
      },
      projection: { _id: 1 },
    }
  );
}
