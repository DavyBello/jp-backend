const { InstitutionTC } = require('../../composers');

module.exports = () => {
  InstitutionTC.addResolver(require('./createAccount'))
  InstitutionTC.addResolver(require('./activateAccount'))
}
