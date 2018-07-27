module.exports = ({ field, TC }) => {
	return TC.get('$createOne').wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { sourceUser, sourceUserType } = rp
		if (sourceUser) {
			const _field = sourceUser[field]
			if (Array.isArray(_field)) {
				//add field to db and get result of createOne resolver
				const result = await next(rp);
				sourceUser[field].push(result.recordId);
				try {
					await sourceUser.save();
					return result;
				} catch (e) {
					//Placeholder function to stop the field from saving to the db
					result.record.remove().exec();
					throw new Error(`Unexpected error adding the document to ${sourceUserType.toLowerCase()}`);
				}
			} else {
				throw new Error(`Field: ${field} is not a collection`);
			}
		}
	});
}
