module.exports = ({ TC, refPath }) => {
	return TC.get('$createOne').wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { sourceUser, sourceUserType } = rp;
		if (TC.hasField(refPath)){
			rp.args.record[refPath] = sourceUser._id;
			rp.args.record.createdAt = Date.now();
			//run createOne resolver
			return next(rp);
		}
		return Promise.reject(`invalid refPath`)
	});
}
