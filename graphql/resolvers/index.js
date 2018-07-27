
module.exports = addResolvers = () => {
  require('./general')();
  require('./coupon')();
  require('./payment')();
  require('./price')();
  require('./newsletterSubscriber')();
  require('./notification')();
}
