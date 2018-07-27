/*	generates a schema based on the database models for GraphQL using graphql-compose
	NOT YET COMPLETE
*/
const keystone = require('keystone');
const { GQC } = require('graphql-compose');

const addViewers = require('../viewers');
const addResolvers = require('../resolvers');
const addRelationships = require('../relationships');

//Add relationships and resolvers to schema
addViewers();
addResolvers();
addRelationships();

//Add fields and resolvers to rootQuery
GQC.rootQuery().addFields(require('./queries'));

//Add fields and resolvers to rootQuery
GQC.rootMutation().addFields(require('./mutations'));

const schema = GQC.buildSchema();
module.exports = schema;
