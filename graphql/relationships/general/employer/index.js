// const { InstitutionTC, JobTC } = require('../../../composers');

// module.exports = () => {
//   InstitutionTC.addRelation('jobs', {
//       resolver: () => JobTC.getResolver('findByIds'),
//       prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
//         _ids: (source) => source.jobs,
//       },
//       projection: { jobs: true }, // point fields in source object, which should be fetched from DB
//     }
//   );
//   InstitutionTC.addRelation('jobsPagination', {
//       resolver: () => JobTC.getResolver('pagination'),
//       prepareArgs: { // resolver `findByIds` has `_ids` arg, let provide value to it
//         filter: (source) => ({ _ids: source.jobs}),
//       },
//       projection: { jobs: true }, // point fields in source object, which should be fetched from DB
//     }
//   );
//   // InstitutionTC.addRelation('jobsSearch', {
//   //     resolver: () => JobTC.getResolver('findMany'),
//   //     // args: { // resolver `findByIds` has `_ids` arg, let provide value to it
//   //     //   filter: (source) => ({ _ids: source.jobs}),
//   //     // },
//   //     projection: { jobs: true }, // point fields in source object, which should be fetched from DB
//   //   }
//   // );
// }
