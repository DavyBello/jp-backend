const keystone = require('keystone');

//Create and add id of relationship document (Cloudinary file) to the sourceUser/Self
module.exports = ({ field, TC, managedModelType }) => {
	// console.log(TC.get('$createOne'));
	return TC.get('$removeById').addArgs({
		managedId: 'String!',
		// managedModelType: 'String!'
	}).wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { sourceUser, sourceUserType } = rp
		// const { args: { managedId, managedModelType, _id} } = rp
		const { args: { managedId, _id} } = rp
		try {
			const Model = keystone.list(managedModelType).model;
			const item = await Model.findOne({ _id: managedId})
			if (item) {
				const _field = item[field]
				if (Array.isArray(_field)) {
					//check if relationship to be update is a member of _field array
					let exist = _field.find((fieldId)=>(fieldId==_id));
					if (exist){
						//delete document from db
						const result = await next(rp);
						//delete relationship id from sourcedocument
						item[field] = item[field].filter(e => e != result.recordId);
						try {
							await item.save();
							return result;
						} catch (e) {
							//Placeholder function to stop the field from saving to the db
							result.record.remove().exec();
							return Error(`Unexpected error adding the document to ${sourceUserType.toLowerCase()}`);
						}
					} else {
						return Error(`This ${sourceUserType.toLowerCase()} cannot delete this document`);
					}
				} else {
					return Error(`Field: ${field} is not a collection in ${managedModelType}`);
				}
			} else {
				return Error(`Cannot find "${managedModelType}" with specified _id`);
			}
		} catch (e) {
			// console.log(e);
			if (e.message === `Unknown keystone list "${managedModelType}"`)
				throw new Error(`Unknown model type "${managedModelType}"`);

			if (e.message === `Cast to ObjectId failed for value "${managedId}" at path "_id" for model "${managedModelType}"`)
				throw new Error(`Invalid Id supplied for model type "${managedModelType}"`);

			// console.log(e.message === `Unknown keystoone list "asda"`);
			// throw new Error(`Unexpected error adding the document to ${managedModelType.toLowerCase()}`);
		}
	});
}
