var keystone = require('keystone');
var async = require('async');
var State = keystone.list('State');
var LocalGovernment = keystone.list('LocalGovernment');

const states = require('./data/nigeria-states');

let createState = (state, done)=>{
	let stateName = state.state.name;

	let newState = new State.model({name: stateName});
	newState.save((err, savedState)=>{
		if (err) {
			console.log(err);
			done(err);
		} else {
			state.state.locals.forEach((local)=>{
				let newLocalGovernment = new LocalGovernment.model({name: local.name, state: savedState.id});
				newLocalGovernment.save(function (err, localGov) {
					if (err) {
						console.error('Error adding lG: ' + localGov.name + ' to the database:');
						console.error(err);
						done(err);
					}
				})
			})
			done();
		}
	})
}

exports = module.exports = function (done) {
	async.forEach(states, createState, done);
};
