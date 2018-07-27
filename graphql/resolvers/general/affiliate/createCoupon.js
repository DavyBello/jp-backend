const keystone = require('keystone');
const { JpCouponTC } = require('../../../composers');
const jwt = require('jsonwebtoken');
const JpCoupon = keystone.list('JpCoupon').model;
const { InputTypeComposer } = require('graphql-compose')

InputTypeComposer.create({
  name: 'createAffiliateCouponInput',
  type: 'input',
  fields: {
    coupon: 'String!',
  }
});

module.exports = {
  kind: 'mutation',
  name: 'createCoupon',
  description: 'create an mcc coupon',
  args: { input: 'createAffiliateCouponInput!' },
  type: JpCouponTC,
  resolve: async ({ args: {input}, context, sourceUser }) => {
    const { coupon } = input;
    return JpCoupon.findOne({coupon}).then((existing) => {
      if (!existing) {
        // hash password and create user
        const newJpCoupon = new JpCoupon({
          coupon,
          discount: 10,
          affiliate: sourceUser._id
        })
        return newJpCoupon.save().then((coupon)=>{
          // const { id, coupon } = coupon;
          return coupon;
        }).catch((err) => {
          // console.log(err);
          return Promise.reject(err);
        })
      }
      return Promise.reject('coupon already exists');
    })
  }
};
