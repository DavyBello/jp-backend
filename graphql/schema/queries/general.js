const { authAccess } = require('../../logic/authentication');
const {
  UserTC,
  ViewerCandidateTC,
  ViewerAffiliateTC
} = require('../../composers');

module.exports = {
	...authAccess({sourceUserType: 'User'}, {
		userIsAuthenticated: UserTC.getResolver('isAuthenticated'),
	}),
	...authAccess({sourceUserType: 'Candidate'}, {
		candidateIsAuthenticated: UserTC.getResolver('isAuthenticated'),
    viewerCandidate: ViewerCandidateTC.getResolver('candidateAccess'),
	}),
	...authAccess({sourceUserType: 'Candidate', isActivated: true}, {
    isActivatedViewerCandidate: ViewerCandidateTC.getResolver('candidateAccess'),
	}),
	...authAccess({sourceUserType: 'Affiliate'}, {
		affiliateIsAuthenticated: UserTC.getResolver('isAuthenticated'),
		viewerAffiliate: ViewerAffiliateTC.getResolver('affiliateAccess'),
	}),
	currentTime: {
		type: 'Date',
		resolve: () => new Date().toISOString(),
	},
}
