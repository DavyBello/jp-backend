var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * JpTestCode Model
 * ==========
 */
var JpTestCode = new keystone.List('JpTestCode', {
  map: { name: 'code' }
});

JpTestCode.add({
  code: { type: Types.Text, required: true, index: true, initial: true, unique: true },
  isExpired: { type: Boolean, index: true, default: false },
  createdAt: { type: Types.Datetime, index: true, default: Date.now(), noedit: true },
  // paystackReference
  assignedToPayment: { type: Types.Text, index: true, noedit: true, unique: true, sparse: true },
});

// JpTestCode.relationship({ ref: 'JpPayment', path: 'payment', refPath: 'testCode' });

/**
 * Registration
 */
JpTestCode.defaultSort = '-createdAt';
JpTestCode.defaultColumns = 'code, assignedToPayment, createdAt, isExpired';
JpTestCode.register();
