const { authAccess } = require('../../logic/authentication');

const {
	JpPaymentTC,
	JpGuestEnquiryTC,
	JpNewsletterSubscriberTC,
} = require('../../composers');

module.exports = {
  ...require('./general'),

	// unauthorized User Mutations
	createEnquiry: JpGuestEnquiryTC.getResolver('createOne'),
  subscribeToJpNewsletter: JpNewsletterSubscriberTC.getResolver('subscribe'),

	// authorized Candidate Mutations
	...authAccess({sourceUserType: 'Candidate'}, {
		candidateFindOrCreateJpPaymentRecord: JpPaymentTC.getResolver('findOrCreateJpPaymentV2'),
	}),
}
