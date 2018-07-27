const keystone = require('keystone');
var Types = keystone.Field.Types;
const jwt = require('jsonwebtoken');

const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * Candidate Model
 * ==========
 */
const Candidate = new keystone.List('Candidate', {
	track: true,
	inherits: keystone.list('User')
});

Candidate.add('Candidate', {
	name: { type: Types.Text, index: true },
	firstName: { type: Types.Text, required: true, initial: true, index: true },
	lastName: { type: Types.Text, required: true, initial: true, index: true },
	phone: { type: Types.Text, initial: true, unique: true, sparse: true },
	isActivated: { type: Boolean, default: false, noedit: true },	
});

//Model Hooks
Candidate.schema.pre('save',async function (next) {
	if (this.firstName) this.firstName = toCamelCase(this.firstName);
	if (this.lastName) this.lastName = toCamelCase(this.lastName);
	this.name = `${this.lastName} ${this.firstName}`
	next();
})

Candidate.schema.post('save',async function () {
	if (this.wasNew) {
		try {
			this.sendActivationLink();
		} catch (e) {
			console.log(e);
		}
	}
});

// Methods
Candidate.schema.methods.sendActivationLink = function () {
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
				templateName: 'activate-account',
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

/**
 * Relationships
 */
Candidate.relationship({ ref: 'Payment', path: 'payments', refPath: 'madeBy' });


/**
 * Registration
 */
Candidate.defaultColumns = 'name, phone, email';
Candidate.register();
