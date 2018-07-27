var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * JpGuestEnquiry Model
 * =============
 */

var JpGuestEnquiry = new keystone.List('JpGuestEnquiry', {
	nocreate: true,
	noedit: true,
});

JpGuestEnquiry.add({
	name: { type: Types.Text, required: true },
	email: { type: Types.Email, required: true },
	message: { type: Types.Textarea, required: true },
	createdAt: { type: Date, default: Date.now },
});

JpGuestEnquiry.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

JpGuestEnquiry.schema.post('save', function () {
	if (this.wasNew) {
		try {
			this.sendJpNotificationEmail();
			this.sendConfirmationEmail();
		} catch (e) {
			console.log(e);
		}
	}
});

JpGuestEnquiry.schema.methods.sendJpNotificationEmail = function () {
	var enquiry = this;

	return new Promise(function(resolve, reject) {
		console.log("sending enquiry confirmation email");

		if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
			console.log('Unable to send email - no mailgun credentials provided');
			return callback(new Error('could not find mailgun credentials'));
		}

		var brand = keystone.get('brand');

		keystone.list('keystoneJpAdmin').model.find({isAdmin: true, recieveJpGuestEnquiries: true}).exec(function (err, admins) {
			if (err) reject(err);
			new keystone.Email({
				templateName: 'guest-enquiry-notification',
				transport: 'mailgun',
			}).send({
				to: admins,
				from: {
					name: 'MCC',
					email: 'contact@mycareerchoice.global',
				},
				subject: 'New Guest Enquiry for MCC',
				enquiry,
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

// guest-enquiry-confirmation
JpGuestEnquiry.schema.methods.sendConfirmationEmail = function () {
	const enquiry = this;
	return new Promise(function(resolve, reject) {
		console.log("sending enquiry confirmation email");

		if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
			console.log('Unable to send email - no mailgun credentials provided');
			reject(new Error('could not find mailgun credentials'));
		}

		const brandDetails = keystone.get('brandDetails');

		new keystone.Email({
			templateName: 'guest-enquiry-confirmation',
			transport: 'mailgun',
		}).send({
			to: [enquiry.email],
			from: {
				name: 'MCC',
				email: 'no-reply@mycarrerchoice.global',
			},
			subject: 'MCC Enquiry',
			enquiry,
			brandDetails
		}, (err)=>{
			if (err) {
				console.log(err);
				reject(err);
			}
		});
		resolve();
	});
}

JpGuestEnquiry.defaultSort = '-createdAt';
JpGuestEnquiry.defaultColumns = 'name, email, createdAt';
JpGuestEnquiry.register();
