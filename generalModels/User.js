var keystone = require('keystone');
var Types = keystone.Field.Types;

const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');

/**
 * User Model
 * ==========
 */
const User = new keystone.List('User');
// User.schema.set('usePushEach', true);

User.add({
	name: { type: Types.Text, index: true },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
	passwordVersion: { type: Types.Text, initial: false, required: true, default: 1},
	isActivated: { type: Boolean, default: false, noedit: true },
});

// Model Hooks
User.schema.pre('save', function (next) {
	// console.log('saving user');
	this.wasNew = this.isNew;

	if (this.name) this.name = toCamelCase(this.name);

	if (this.phone) {
		if (PHONE_REGEX.test(this.phone)){
			next();
		} else {
			next(new Error('Invalid Phone Number'));
		}
	} else {
		next();
	}
});

/**
 * Relationships
 */
// User.relationship({ ref: 'Post', path: 'posts', refPath: 'author' });
User.relationship({ ref: 'NotificationReadReceipt', path: 'readReceipts', refPath: 'user' });


/**
 * Registration
 */
User.defaultColumns = 'name, email, canAccessKeystone, isAdmin';
User.register();
