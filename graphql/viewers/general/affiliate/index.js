const { AffiliateTC, ViewerAffiliateTC } = require('../../../composers');

module.exports = () => {
  ViewerAffiliateTC.addResolver({
  	kind: 'query',
    name: 'affiliateAccess',
    type: ViewerAffiliateTC,
    resolve: ({ args, context , sourceUser}) => {
  		//affiliate from jwt to response
      return { affiliate: sourceUser }
    },
  })

  const ViewerAffiliateTCFields = {
  	affiliate: AffiliateTC.getType()
  	//add other exclusive to pretJp fields here
  }
  ViewerAffiliateTC.addFields(ViewerAffiliateTCFields);
}
