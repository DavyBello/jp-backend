const { CandidateTC, JpPaymentTC, JpNotificationTC } = require('../../../composers');

module.exports = () => {
  CandidateTC.addRelation('payments', {
      resolver: () => JpPaymentTC.getResolver('findMany'),
      prepareArgs: {
        filter: (source) => ({ madeBy: source._id}),
      },
      projection: { madeBy: 1 },
    }
  );
  CandidateTC.addRelation('notifications', {
    resolver: () => JpNotificationTC.getResolver('userJpNotifications'),
    prepareArgs: {
      filter: (source) => ({ userId: source._id, userCreatedAt: source.createdAt}),
    },
    projection: { _id: true, createdAt: true },
  });
}
