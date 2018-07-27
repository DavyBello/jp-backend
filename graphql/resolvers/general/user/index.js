const { UserTC } = require('../../../composers');

module.exports = () => {
  // Queries
  UserTC.addResolver(require('./isAuthenticated'));

  // Mutations
  UserTC.addResolver(require('./loginWithEmail'));
  UserTC.addResolver(require('./activateAccount'));
  UserTC.addResolver(require('./createAccount'));
  UserTC.addResolver(require('./sendUserActivationLink'));
  UserTC.addResolver(require('./changePassword'));
}
