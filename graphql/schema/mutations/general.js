//Get logic middleware
const {
	updateSelf,
} = require('../../logic/common');

const { authAccess } = require('../../logic/authentication');

const {
  UserTC,
	CandidateTC,
	AffiliateTC,
} = require('../../composers');

module.exports = {

	// unauthorized User Mutations
	loginUser: UserTC.getResolver('loginWithEmail'),
	userActivateAccount: UserTC.getResolver('activateAccount'),

	// unauthorized Candidate Mutations
	candidateCreateAccount: CandidateTC.getResolver('createAccount'),

	// unauthorized Candidate Mutations
	affiliateCreateAccount: AffiliateTC.getResolver('createAccount'),

	// authorized Candidate Mutations
	...authAccess({sourceUserType: 'Candidate'}, {
		candidateResendActivationLink: UserTC.getResolver('sendUserActivationLink'),
		candidateUpdateSelf: updateSelf({TC: CandidateTC}),
	}),

	// authorized Affiliate Mutations
	...authAccess({sourceUserType: 'Affiliate'}, {
		affiliateResendActivationLink: UserTC.getResolver('sendUserActivationLink'),
		affiliateCreateCoupon: AffiliateTC.getResolver('createCoupon'),
		affiliateUpdateSelf: updateSelf({TC: AffiliateTC}),
	}),
}
