const { StateTC,LocalGovernmentTC } = require('../../composers');

module.exports = () => {
  StateTC.addRelation('locals', {
      resolver: () => LocalGovernmentTC.getResolver('findByIds'),
      prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
        _ids: (source) => source.locals,
      },
      projection: { locals: true }, // point fields in source object, which should be fetched from DB
    }
  );
}
