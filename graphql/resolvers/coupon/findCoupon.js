const keystone = require('keystone');
const JpCoupon = keystone.list('JpCoupon').model;
const { JpCouponTC } = require('../../composers');
const moment = require('moment');

if (!process.env.PAYSTACK_SECRET_KEY){
  console.error('PAYSTACK_SECRET_KEY is missing from env');
}
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

// loginWithEmail resolver for user
module.exports = {
  kind: 'mutation',
  name: 'findCoupon',
  description: 'searches the datatbase for a coupon',
  args: { coupon: 'String!' },
  type: JpCouponTC,
  resolve: async ({ args, context }) => {
    const { coupon } = args;
    try {
      const existingCoupon = await JpCoupon.findOne({ coupon });
      if (existingCoupon) {
        if (existingCoupon.isExpirable) {
          if (moment(existingCoupon.expiriesAt).isBefore(Date.now())){
            return Promise.reject('expired coupon');
          }
        }
        return (existingCoupon)
      } else {
        return Promise.reject('coupon not found');
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
}
