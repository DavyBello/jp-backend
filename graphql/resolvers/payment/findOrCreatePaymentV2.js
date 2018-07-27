const keystone = require('keystone');
const JpPayment = keystone.list('JpPayment').model;
const JpPrice = keystone.list('JpPrice').model;
const JpCoupon = keystone.list('JpCoupon').model;
const JpTestCode = keystone.list('JpTestCode').model;
const { JpPaymentTC } = require('../../composers');

if (!process.env.PAYSTACK_SECRET_KEY){
  console.error('PAYSTACK_SECRET_KEY is missing from env');
}
const paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);

// loginWithEmail resolver for user
module.exports = {
  kind: 'mutation',
  name: 'findOrCreateJpPaymentV2',
  description: 'find or verifies a payment and assign a test code',
  args: { paystackReference: 'String!' },
  type: JpPaymentTC,
  resolve: async ({ args, context, sourceUser }) => {
    const { paystackReference } = args;
    try {
      const existing = await JpPayment.findOne({paystackReference});
      if (existing) {
        return (existing)
      } else {
        //find code and add to payment
        return new Promise((resolve, reject) => {
          paystack.transaction.verify(paystackReference, async (error, body) => {
            if (error) {
              //possible Error - connect ETIMEDOUT 104.16.6.25:443
              reject(error)
            }
            console.log(body);
            if (body.status){
              if (body.data.status=="success") {
                console.log(body.data.metadata);
                if (!body.data.metadata.price_id) {
                  // reject(new Error('invalid payment - no price attached to payment'))
                  reject(new Error('invalid payment'))
                }
                const price = await JpPrice.findById(body.data.metadata.price_id);
                if (!price) {
                  reject(new Error('invalid price attached to payment'))
                }
                const paymentData = {
                  paystackReference,
                  transactionDate: body.data.transaction_date,
                  madeBy: sourceUser._id,
                  amount: body.data.amount,
                  currency: body.data.currency
                }
                let paidPrice = price.jpPrice;
                //find coupon and calculate discount
                if (body.data.metadata.coupon_id) {
                  const coupon = await JpCoupon.findById(body.data.metadata.coupon_id);
                  if (coupon.discount > 0 || coupon.discount < 100){
                    paidPrice = price.jpPrice - ((coupon.discount/100)*price.jpPrice);
                    paymentData.coupon = coupon._id;
                  }
                }
                if (body.data.currency=="NGN"){
                  //convert kobo to naira
                  paymentData.amount = paymentData.amount/100;
                  if (paidPrice != body.data.amount/100) {
                    reject(new Error('invalid payment'))
                  }
                }
                //find code and add to payment
                const assignedCode = await JpTestCode.findOne({assignedToPayment: paystackReference})
                if (assignedCode) {
                  console.log('assignedCode');
                  const newJpPayment = new JpPayment(paymentData)
                  resolve(newJpPayment.save());
                } else {
                  // assign payment reference to test code
                  const testCode = await JpTestCode.findOneAndUpdate({assignedToPayment: null}, {assignedToPayment: paystackReference})
                  if (testCode) {
                    const newJpPayment = new JpPayment(paymentData)
                    resolve(newJpPayment.save());
                  } else {
                    reject(new Error('no available code'))
                  }
                }
              } else {
                console.log(body);
                reject(body.data.status)
              }
            } else {
              reject(body.message);
            }
          });
        });
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
}
