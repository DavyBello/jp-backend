const keystone = require('keystone');
var Types = keystone.Field.Types;
const jwt = require('jsonwebtoken');

const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * keystoneJpAdmin Model
 * ==========
 */
const keystoneJpAdmin = new keystone.List('keystoneJpAdmin', {
	track: true,
});

keystoneJpAdmin.add({
	name: { type: Types.Text, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	passwordVersion: { type: Types.Text, initial: false, required: true, default: 1},
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	recieveAffiliateGuestEnquiries: { type: Boolean, label: 'receives notification email when an equiry is made', index: true },
	recieveAffiliateAffiliateNotifications: { type: Boolean, label: 'receives notification email when an affiliate registers', index: true },
});

// Provide access to Keystone
keystoneJpAdmin.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Relationships
 */
// keystoneJpAdmin.relationship({ ref: 'AffiliatePayment', path: 'payments', refPath: 'madeBy' });


/**
 * Registration
 */
keystoneJpAdmin.defaultColumns = 'name, email, isAdmin, recieveAffiliateGuestEnquiries, recieveAffiliateAffiliateNotifications';
keystoneJpAdmin.register();
