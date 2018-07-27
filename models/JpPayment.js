var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * JpPayment Model
 * ==========
 */
var JpPayment = new keystone.List('JpPayment');

JpPayment.add({
  createdAt: { type: Types.Datetime, index: true, default: Date.now(), noedit: true },
  transactionDate: { type: Types.Datetime, index: true, noedit: true },
  paystackReference: { type: Types.Text, required: true, index: true, initial: true, unique: true },
  price: { type: Types.Relationship, ref: 'JpPrice', initial: true, required: true },
  madeBy: { type: Types.Relationship, ref: 'User', many: false, required: true, initial: true },
  coupon: { type: Types.Relationship, ref: 'JpCoupon', initial: true},
  amount: { type: Types.Number, required: true, initial: true },
  currency: { type: Types.Text, required: false, initial: true },
});

/**
 * Registration
 */
JpPayment.defaultSort = '-createdAt';
JpPayment.defaultColumns = 'createdAt, paystackReference, madeBy';
JpPayment.register();
