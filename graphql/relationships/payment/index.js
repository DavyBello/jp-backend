const { JpPaymentTC, JpTestCodeTC } = require('../../composers');

module.exports = () => {
  JpPaymentTC.addRelation('testCode', {
      resolver: () => JpTestCodeTC.getResolver('findOne'),
      prepareArgs: {
        filter: (source) => ({ assignedToPayment: source.paystackReference}),
      },
      projection: { paystackReference: true },
    }
  );
}
