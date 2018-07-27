module.exports = (options = {}, resolvers) => {
	const { sourceUserType, isActivated = false } = options;
	Object.keys(resolvers).forEach((k) => {
		resolvers[k] = resolvers[k].wrapResolve(next => async (rp) => {
			//const { source, args, context, info } = resolveParams = rp
			try {
				const sourceUser = await rp.context[sourceUserType]; //eg rp.context.Candidate
				if (!sourceUserType){
					throw new Error(`Provide a source Type for this Auth wrapper`)
				}
				if (!sourceUser){
					// Unauthorized request
					if (resolvers[k].parent.name == `isAuthenticated`) {
						return false
					}
					throw new Error(`You must be signed in as a ${sourceUserType.toLowerCase()} to have access to this action.`)
				}
				if (isActivated){
					if (!sourceUser.isActivated) {
						throw new Error(`account has not been activated`)
					}
				}
				//console.log('authorized');
				//add signed-In sourceUser to the resolver parameters
				rp.sourceUser = sourceUser || null;
				rp.sourceUserType = sourceUserType || null;
				return next(rp);
			} catch (e) {
				return e;
			}
		});
	});
	return resolvers;
}
