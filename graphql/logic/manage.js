const authAccess = exports.authAccess = (sourceType, resolvers) => {
	Object.keys(resolvers).forEach((k) => {
		resolvers[k] = resolvers[k].wrapResolve(next => async (rp) => {
			//const { source, args, context, info } = resolveParams = rp
			try {
				const sourceUser = await rp.context[sourceType]; //eg rp.context.Candidate
				if (!sourceUser){
					console.log('Unauthorized request');
					//console.log(new Error('You must be signed in as a candidate, to have access to this action.'));
					throw new Error(`You must be signed in as a ${sourceType.toLowerCase()} to have access to this action.`)
				}
				if (!sourceType){
					//console.log('Unauthorized request');
					throw new Error(`Provide a source Type for this Auth wrapper`)
				}
				//console.log('authorized');
				//add signed-In sourceUser to the resolver parameters
				rp.sourceUser = sourceUser || null;
				rp.sourceType = sourceType || null;
				return next(rp);
			} catch (e) {
				console.log(e);
				return e;
			}
		});
	});
	return resolvers;
}

const updateSelf = exports.updateSelf = ( TC ) => {
	return TC.get('$updateById').wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { args, sourceUser, sourceType } = rp
		if (sourceUser._id == args.record._id){
			const result = await next(rp);
			return result;
		} else {
			throw new Error(`This ${sourceType.toLowerCase()} can only edit itself`);
		}
	});
}

const isSelf = exports.isSelf = ( TC, resolver ) => {
	return TC.get(resolver).wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { args, sourceUser, sourceType } = rp
		if (sourceUser._id == args.record._id){
			const result = await next(rp);
			return result;
		} else {
			throw new Error(`This ${sourceType.toLowerCase()} can only edit itself`);
		}
	});
}

const containSelf = exports.containSelf = ( TC, resolver ) => {
	return TC.get(resolver).wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { args, sourceUser, sourceType } = rp
		if (sourceUser._id == args.record._id){
			const result = await next(rp);
			return result;
		} else {
			throw new Error(`This ${sourceType.toLowerCase()} can only edit itself`);
		}
	});
}

const findSelfRelationship = exports.findSelfRelationship = ( field, TC ) => {
	return TC.get('$findById').wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { args, sourceUser, sourceType } = rp
		const _field = sourceUser[field]
		if (Array.isArray(_field)) {
			//check if relationship to be update is a member of _field array
			let exist = _field.find((fieldId)=>(fieldId==args._id));
			if (exist){
				//add field to db and get result of createOne resolver
				const result = await next(rp);
				return result;
			} else {
				throw new Error(`This ${sourceType.toLowerCase()} cannot view this document`);
			}
		} else {
			throw new Error(`Field: ${field} is not an collection field`);
		}
	});
}

//Create and add id of relationship document to the sourceUser/Self
const createSelfRelationship = exports.createSelfRelationship =  ( field, TC ) => {
	return TC.get('$createOne').wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { sourceUser, sourceType } = rp
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
					throw new Error(`Unexpected error adding the document to ${sourceType.toLowerCase()}`);
				}
			} else {
				throw new Error(`Field: ${field} is not a collection`);
			}
		}
	});
}

const updateSelfRelationship = exports.updateSelfRelationship = ( field, TC ) => {
	return TC.get('$updateById').wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { args, sourceUser, sourceType } = rp
		const _field = sourceUser[field]
		if (Array.isArray(_field)) {
			//check if relationship to be update is a member of _field array
			let exist = _field.find((fieldId)=>(fieldId==args.record._id));
			if (exist){
				//add field to db and get result of createOne resolver
				const result = await next(rp);
				return result;
			} else {
				throw new Error(`This ${sourceType.toLowerCase()} cannot edit this field`);
			}
		} else {
			throw new Error(`Field: ${field} is not an collection field`);
		}
	});
}

//Remove and delete id of relationship document to the sourceUser/Self
const deleteSelfRelationship = exports.deleteSelfRelationship =  ( field, TC ) => {
	return TC.get('$removeById').wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { args, sourceUser, sourceType } = rp
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
						throw new Error(`Unexpected error adding the document to ${sourceType.toLowerCase()}`);
					}
				} else {
					throw new Error(`This ${sourceType.toLowerCase()} cannot delete this document`);
				}
			} else {
				throw new Error(`Field: ${field} is not a collection`);
			}
		}
	});
}

//Create and add id of relationship document (Cloudinary file) to the sourceUser/Self
const createSelfFileRelationship = exports.createSelfFileRelationship =  ( field, TC ) => {
	return TC.get('$createOne').wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { sourceUser, sourceType } = rp
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
					throw new Error(`Unexpected error adding the document to ${sourceType.toLowerCase()}`);
				}
			} else {
				throw new Error(`Field: ${field} is not a collection`);
			}
		}
	});
}

const createModelRelationship = exports.createModelRelationship =  ( field, TC ) => {
	return TC.get('$createOne').wrapResolve(next => async (rp) => {
		//get sourceUser from resolveParams (rp)
		const { sourceUser, sourceType } = rp
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
					throw new Error(`Unexpected error adding the document to ${sourceType.toLowerCase()}`);
				}
			} else {
				throw new Error(`Field: ${field} is not a collection`);
			}
		}
	});
}
