const { JpNewsletterSubscriberTC } = require('../../composers');

module.exports = () => {
  // Mutations
  JpNewsletterSubscriberTC.addResolver(require('./subscribe'));
}
