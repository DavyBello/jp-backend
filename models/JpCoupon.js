var keystone = require('keystone');
var Types = keystone.Field.Types;

const Joi = require('joi');
/**
 * JpCoupon Model
 * ==========
 */
var JpCoupon = new keystone.List('JpCoupon', {
    track: true,
    map: {name: 'coupon'}
});

JpCoupon.add({
  coupon: { type: Types.Text, required: true, index: true, initial: true },
  affiliate: { type: Types.Relationship, ref: 'Affiliate', required: false, initial: true},
  description: { type: Types.Text, index: true, initial: true },
  discount: { type: Types.Number, label: 'discount(in %)', required: true, initial: true },
  isExpirable: { type: Types.Boolean, index: true, default: false},
  expiriesAt: { type: Types.Date, index: true, dependsOn: { isExpirable: true} }
});
const schema = Joi.object().keys({
    coupon: Joi.string().alphanum().min(6).max(10).required(),
    discount: Joi.number().integer().min(0).max(100),
})
JpCoupon.schema.pre('save',async function (next) {
  if (this.isModified("isExpirable")) {
		if (this.expiriesAt == null) this.expiriesAt = Date.now()
	}
  const {error, value} = Joi.validate({
    coupon: this.coupon,
    discount: this.discount
  }, schema);
  if (error) {
    switch (error.details[0].context.key) {
      case 'coupon':
        return next(new Error('your coupon must be between six(6) and ten(10) characters in length'));
      break;
      case 'discount':
        return next(new Error('discount must be an integer between 0 and 100'))
      break;
    }
  }
  next();
})

JpCoupon.relationship({ ref: 'JpPayment', path: 'payments', refPath: 'coupon' });

/**
 * Registration
 */
JpCoupon.defaultSort = 'createdAt';
JpCoupon.defaultColumns = 'coupon, description, createdAt';
JpCoupon.register();
