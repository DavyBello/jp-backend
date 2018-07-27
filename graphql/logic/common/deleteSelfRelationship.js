//Remove and delete id of relationship document to the sourceUser/Self
module.exports = ({ field, TC }) => {
	return TC.get('$removeById').wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { args, sourceUser, sourceUserType } = rp
		if (sourceUser) {
			const _field = sourceUser[field]
			if (Array.isArray(_field)) {
				//check if relationship to be update is a member of _field array
				let exist = _field.find((fieldId)=>(fieldId==args._id));
				if (exist){
					//delete document from db
					const result = await next(rp);
					//delete relationship id from sourcedocument
					sourceUser[field] = sourceUser[field].filter(e => e != result.recordId);
					try {
						await sourceUser.save();
						return result;
					} catch (e) {
						//Placeholder function to stop the field from saving to the db
						result.record.remove().exec();
						throw new Error(`Unexpected error adding the document to ${sourceUserType.toLowerCase()}`);
					}
				} else {
					throw new Error(`This ${sourceUserType.toLowerCase()} cannot delete this document`);
				}
			} else {
				throw new Error(`Field: ${field} is not a collection`);
			}
		}
	});
}
