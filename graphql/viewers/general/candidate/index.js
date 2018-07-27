const { CandidateTC, ViewerCandidateTC } = require('../../../composers');

module.exports = () => {
  ViewerCandidateTC.addResolver({
  	kind: 'query',
    name: 'candidateAccess',
    type: ViewerCandidateTC,
    resolve: ({ args, context , sourceUser}) => {
  		//assign candidate from jwt to response
      return { candidate: sourceUser }
    },
  })

  const ViewerCandidateTCFields = {
  	candidate: CandidateTC.getType()
  	//add other exclusive to candidate fields here
  }
  ViewerCandidateTC.addFields(ViewerCandidateTCFields);
}
