const { JpNotificationTC } = require('../../composers');

module.exports = () => {

  JpNotificationTC.addResolver(require('./userNotifications'))

}
