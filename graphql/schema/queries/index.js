const { authAccess } = require('../../logic/authentication');
const {
  JpPriceTC,
  JpCouponTC,
  ViewerCandidateTC,
} = require('../../composers');

module.exports = {
  ...require('./general'),
	...authAccess({sourceUserType: 'User'}, {
		price: JpPriceTC.getResolver('latestJpPrice'),
	}),
	...authAccess({sourceUserType: 'Candidate'}, {
		candidateFindCoupon: JpCouponTC.getResolver('findCoupon')
	}),
	...authAccess({sourceUserType: 'Candidate', isActivated: true}, {
    isActivatedViewerCandidate: ViewerCandidateTC.getResolver('candidateAccess'),
	}),
}
