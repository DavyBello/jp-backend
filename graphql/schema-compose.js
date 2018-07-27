/*	generates a schema based on the database models for GraphQL using graphql-compose
	NOT YET COMPLETE
*/
const keystone = require('keystone');
const { GQC } = require('graphql-compose');

const typeComposers = require('./composers');
const addViewers = require('./viewers');
const addResolvers = require('./resolvers');
const addRelationships = require('./relationships');

//Get logic middleware
const {
	updateSelf,
} = require('./logic/common');

const { authAccess } = require('./logic/authentication');

const {
	UserTC,
	CandidateTC,
	AffiliateTC,
	ViewerCandidateTC,
	ViewerAffiliateTC,

	JpPaymentTC,
	JpCouponTC,
	JpPriceTC,
	JpGuestEnquiryTC,
	JpNewsletterSubscriberTC,
} = typeComposers;

//Add relationships and resolvers to schema
addViewers();
addResolvers();
addRelationships();

//Add fields and resolvers to rootQuery
GQC.rootQuery().addFields({
	...authAccess({sourceUserType: 'User'}, {
		price: JpPriceTC.getResolver('latestJpPrice'),
		userIsAuthenticated: UserTC.getResolver('isAuthenticated'),
	}),
	...authAccess({sourceUserType: 'Candidate'}, {
		candidateIsAuthenticated: UserTC.getResolver('isAuthenticated'),
    viewerCandidate: ViewerCandidateTC.getResolver('candidateAccess'),
		candidateFindCoupon: JpCouponTC.getResolver('findCoupon')
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
});

//Add fields and resolvers to rootQuery
GQC.rootMutation().addFields({

	// unauthorized User Mutations
	createEnquiry: JpGuestEnquiryTC.getResolver('createOne'),
	subscribeToJpNewsletter: JpNewsletterSubscriberTC.getResolver('subscribe'),

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
		candidateFindOrCreateJpPaymentRecord: JpPaymentTC.getResolver('findOrCreateJpPaymentV2'),
	}),

	// authorized Affiliate Mutations
	...authAccess({sourceUserType: 'Affiliate'}, {
		affiliateResendActivationLink: UserTC.getResolver('sendUserActivationLink'),
		affiliateCreateCoupon: AffiliateTC.getResolver('createCoupon'),
		affiliateUpdateSelf: updateSelf({TC: AffiliateTC}),
	}),
});

const schema = GQC.buildSchema();
module.exports = schema;
