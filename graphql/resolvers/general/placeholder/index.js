const { PlaceHolderTC } = require('../../../composers');

module.exports = () => {
  PlaceHolderTC.addResolver(require('./success'))
  PlaceHolderTC.addResolver(require('./underDevelopment'))
}
