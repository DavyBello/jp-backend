const { composeWithMongoose } = require('graphql-compose-mongoose');
const keystone = require('keystone');
const { GQC } = require('graphql-compose');

/**
* Mongoose Models
*/
const JpCoupon = keystone.list('JpCoupon').model;
const JpPayment = keystone.list('JpPayment').model;
const JpPrice = keystone.list('JpPrice').model;
const JpTestCode = keystone.list('JpTestCode').model;
const JpNotification = keystone.list('JpNotification').model;
const JpNotificationReadReceipt = keystone.list('JpNotificationReadReceipt').model;

const JpGuestEnquiry = keystone.list('JpGuestEnquiry').model;

/**
* Config
*/
const JpGuestEnquiryTCOptions = {
  resolvers:{
    createOne: {
      record: {
        removeFields: [
          'createdAt', '_id', 'unsubcribeCode', 'isActive'
        ]
      }
    }
  }
};

/**
* Exports
*/
const JpCouponTC = exports.JpCouponTC = composeWithMongoose(JpCoupon);
const JpPaymentTC = exports.JpPaymentTC = composeWithMongoose(JpPayment);
const JpPriceTC = exports.JpPriceTC = composeWithMongoose(JpPrice);
const JpTestCodeTC = exports.JpTestCodeTC = composeWithMongoose(JpTestCode);
const JpGuestEnquiryTC = exports.JpGuestEnquiryTC = composeWithMongoose(JpGuestEnquiry, JpGuestEnquiryTCOptions);
const JpNotificationTC = exports.JpNotificationTC = composeWithMongoose(JpNotification);
const JpNotificationReadReceiptTC = exports.JpNotificationReadReceiptTC = composeWithMongoose(JpNotificationReadReceipt);

/**
* Viewer Fields for authentication and authorization
*/
const JpNewsletterSubscriberTC = exports.JpNewsletterSubscriberTC = GQC.getOrCreateTC('JpNewsletterSubscriber');
JpNewsletterSubscriberTC.addFields({address: 'String', subscribed: 'Boolean', name: 'String'})
