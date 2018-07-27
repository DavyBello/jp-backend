
exports.updateSelf = require('./updateSelf')

exports.isSelf = require('./isSelf')

exports.containSelf = require('./containSelf')

exports.findSelfRelationship = require('./findSelfRelationship')

//Create and add id of relationship document to the sourceUser/Self
exports.createSelfRelationship = require('./createSelfRelationship')

exports.updateSelfRelationship = require('./updateSelfRelationship')

//Remove and delete id of relationship document to the sourceUser/Self
exports.deleteSelfRelationship = require('./deleteSelfRelationship')

//Create and add id of relationship document (Cloudinary file) to the sourceUser/Self
exports.createManagedRelationship = require('./createManagedRelationship')

//Create and add id of relationship document (Cloudinary file) to the sourceUser/Self
exports.deleteManagedRelationship = require('./deleteManagedRelationship')

exports.createModelRelationship = require('./createModelRelationship')
