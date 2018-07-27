var keystone = require('keystone');
var Types = keystone.Field.Types;

// const { STATES, GENDERS, CANDIDATE_CATEGORIES, PHONE_REGEX, toCamelCase  } = require('../lib/common');
const RECEIVERS_TYPE = [
	'ALL_EXISTING_USERS_AT_CREATION',
	'ALL_EXISTING_USERS_AFTER_CREATION',
	'ALL_PAST_AND_FUTURE_USERS',
	'CUSTOM'
]
/**
 * JpNotification Model
 * ==========
 */
const JpNotification = new keystone.List('JpNotification', {
	track: true
});
JpNotification.schema.set('usePushEach', true);

JpNotification.add({
	message: { type: Types.Text, initial: true, required: true, index: true },
	url: { type: Types.Url, initial: true },
	receiversType: { type: Types.Select, options: RECEIVERS_TYPE, default: 'ALL_EXISTING_USERS_AT_CREATION', index: true },
	receivers: { type: Types.Relationship, ref: 'User', many: true, dependsOn: { receiversType: 'CUSTOM' }, index: true },
});

/**
 * Relationships
 */
JpNotification.relationship({ ref: 'JpNotificationReadReceipt', path: 'readReceipts', refPath: 'notification' });

/**
 * Registration
 */
JpNotification.defaultColumns = 'message, createdAt, receiversType, receivers';
JpNotification.register();
