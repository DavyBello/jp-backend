module.exports = ({ field, TC }) => {
	return TC.get('$updateById').wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { args, sourceUser, sourceUserType } = rp
		const _field = sourceUser[field]
		if (Array.isArray(_field)) {
			//check if relationship to be update is a member of _field array
			let exist = _field.find((fieldId)=>(fieldId==args.record._id));
			if (exist){
				//add field to db and get result of createOne resolver
				const result = await next(rp);
				return result;
			} else {
				throw new Error(`This ${sourceUserType.toLowerCase()} cannot edit this field`);
			}
		} else {
			throw new Error(`Field: ${field} is not an collection field`);
		}
	});
}
