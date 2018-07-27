const keystone = require('keystone');
var Types = keystone.Field.Types;
const jwt = require('jsonwebtoken');

const { GENDERS, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * Affiliate Model
 * ==========
 */
const Affiliate = new keystone.List('Affiliate', {
	track: true,
	inherits: keystone.list('User')
});

Affiliate.add('Affiliate', {
	firstName: { type: Types.Text, required: false, initial: true, index: true },
	lastName: { type: Types.Text, required: false, initial: true, index: true },
	phone: { type: Types.Text, required: true, initial: true },
	workAddress: { type: Types.Text, initial: true },
	physicalAddress: { type: Types.Text, initial: true, required: true },
	referee1name: { type: Types.Text, required: true, initial: true, noedit: true },
	referee1phone: { type: Types.Text, required: true, initial: true, noedit: true },
	referee2name: { type: Types.Text, required: true, initial: true, noedit: true },
	referee2phone: { type: Types.Text, required: true, initial: true, noedit: true },
	comments: { type: Types.Html, wysiwyg: true, height: 250 },
}, 'Status', {
	isActivated: { type: Boolean, default: false, noedit: true, label: 'email is confirmed' },
	isApproved: { type: Boolean, default: false },
	isActive: { type: Boolean, default: false },
});

//Model Hooks
Affiliate.schema.pre('save',async function (next) {
	if (this.firstName) this.firstName = toCamelCase(this.firstName);
	if (this.lastName) this.lastName = toCamelCase(this.lastName);
	// this.name = `${this.lastName} ${this.firstName}`
	if (this.isModified("isApproved")) {
		if (this.isApproved) this.sendVerificationConfirmationMail()
	}
	if (this.isModified("isActive")) {
		if (this.isActive) {
			this.sendActiveConfirmationMail()
			//TODO generate MccCoupon
		}
	}
	next();
})

Affiliate.schema.post('save',async function () {
	try {
		if (this.wasNew) {
			this.sendActivationLink();
			this.sendAdminNotificationEmail();
		}
	} catch (e) {
		console.log(e);
	}
});

// Methods
Affiliate.schema.methods.sendActivationLink = function () {
	const user = this;
	return new Promise(function(resolve, reject) {
		console.log("sending user activation email");
		if (user.isActivated) {
			// console.log('Account is already activated');
			reject(new Error('Account is already activated'));
		} else {
			if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
				console.log('Unable to send email - no mailgun credentials provided');
				reject(new Error('could not find mailgun credentials'));
			}

			const brandDetails = keystone.get('brandDetails');

			const code = jwt.sign({
				id: user._id,
				createdAt: Date.now(),
			}, process.env.ACTIVATION_JWT_SECRET);
			const activationLink = `${process.env.FRONT_END_URL}/activate?code=${code}`

			new keystone.Email({
				templateName: 'activate-affiliate-account',
				transport: 'mailgun',
			}).send({
				to: [user.email],
				from: {
					name: 'MCC',
					email: 'no-reply@mycarrerchoice.global',
				},
				subject: 'MCC Account Activation',
				user,
				brandDetails,
				activationLink
			}, (err)=>{
				if (err) {
					console.log(err);
					reject(err);
				}
			});
			resolve();
		}
	});
}

Affiliate.schema.methods.sendAdminNotificationEmail = function () {
	var affiliate = this;

	return new Promise(function(resolve, reject) {
		console.log("sending affiliate notification email");

		if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
			console.log('Unable to send email - no mailgun credentials provided');
			return callback(new Error('could not find mailgun credentials'));
		}

		var brand = keystone.get('brand');

		keystone.list('keystoneMccAdmin').model.find({isAdmin: true, recieveAffiliateNotifications: true}).exec(function (err, admins) {
			if (err) reject(err);
			new keystone.Email({
				templateName: 'affiliate-registration-notification',
				transport: 'mailgun',
			}).send({
				to: admins,
				from: {
					name: 'MCC',
					email: 'contact@mycareerchoice.global',
				},
				subject: 'New Afilliate Registration for MCC',
				affiliate,
				brand,
			}, (err)=>{
				if (err) {
					console.log(err);
					reject(err);
				}
			});
			resolve();
		});
	})
};

Affiliate.schema.methods.sendVerificationConfirmationMail = function () {
	const affiliate = this;
	return new Promise(function(resolve, reject) {
		console.log("sending Verification Confirmation email");
		if (!affiliate.isApproved) {
			// console.log('Account is already activated');
			reject(new Error('Account is not approved'));
		} else {
			if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
				console.log('Unable to send email - no mailgun credentials provided');
				reject(new Error('could not find mailgun credentials'));
			}

			const brandDetails = keystone.get('brandDetails');

			new keystone.Email({
				templateName: 'affiliate-verification-confirmation',
				transport: 'mailgun',
			}).send({
				to: [affiliate.email],
				from: {
					name: 'MCC',
					email: 'no-reply@mycarrerchoice.global',
				},
				subject: 'MCC Affiliate Verification',
				affiliate,
				brandDetails,
			}, (err)=>{
				if (err) {
					console.log(err);
					reject(err);
				}
			});
			resolve();
		}
	});
}

Affiliate.schema.methods.sendActiveConfirmationMail = function () {
	const affiliate = this;
	return new Promise(function(resolve, reject) {
		console.log("sending Activation Confirmation email");
		if (!affiliate.isApproved) {
			// console.log('Account is already activated');
			reject(new Error('Account is not approved'));
		} else {
			if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
				console.log('Unable to send email - no mailgun credentials provided');
				reject(new Error('could not find mailgun credentials'));
			}

			const brandDetails = keystone.get('brandDetails');

			new keystone.Email({
				templateName: 'affiliate-active-confirmation',
				transport: 'mailgun',
			}).send({
				to: [affiliate.email],
				from: {
					name: 'MCC',
					email: 'no-reply@mycarrerchoice.global',
				},
				subject: 'MCC Affiliate Verification',
				affiliate,
				brandDetails,
			}, (err)=>{
				if (err) {
					console.log(err);
					reject(err);
				}
			});
			resolve();
		}
	});
}


/**
 * Relationships
 */
Affiliate.relationship({ ref: 'JpCoupon', path: 'Coupon', refPath: 'affiliate' });
// Affiliate.relationship({ ref: 'Payment', path: 'payments', refPath: 'madeBy' });


/**
 * Registration
 */
Affiliate.defaultColumns = 'name, phone, email, isApproved, isActive';
Affiliate.register();
