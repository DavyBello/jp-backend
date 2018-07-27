const { composeWithMongoose } = require('graphql-compose-mongoose');
const keystone = require('keystone');
const { GQC } = require('graphql-compose');

/**
* Mongoose Models
*/
const User = keystone.list('User').model;
const LocalGovernment = keystone.list('LocalGovernment').model;
const State = keystone.list('State').model;
const Candidate = keystone.list('Candidate').model;
const Affiliate = keystone.list('Affiliate').model;

const privateUserFields = [
  'password', 'passwordVersion','isAdmin'
]

const UserTCOptions = {
  fields : {
    remove: ['password', 'passwordVersion','isAdmin']
  },
  resolvers : {
    updateById: {
      record: {
        removeFields: [
          'phone', 'password','passwordVersion'
        ]
      }
    }
  }
};
const CandidateTCOptions = {
  fields:{
    remove: [
      'password', 'passwordVersion'
     ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'phone', 'password','passwordVersion','isActivated'
        ]
      }
    }
  }
};
const AffiliateTCOptions = {
  fields:{
    remove: [
      'password', 'passwordVersion'
     ]
  },
  resolvers:{
    updateById: {
      record: {
        removeFields: [
          'phone', 'password','passwordVersion','isActivated'
        ]
      }
    }
  }
};


/**
* Exports
*/
const UserTC = exports.UserTC = composeWithMongoose(User, UserTCOptions);
const LocalGovernmentTC = exports.LocalGovernmentTC = composeWithMongoose(LocalGovernment);
const StateTC = exports.StateTC = composeWithMongoose(State);
const CandidateTC = exports.CandidateTC = composeWithMongoose(Candidate, CandidateTCOptions);
const AffiliateTC = exports.AffiliateTC = composeWithMongoose(Affiliate, AffiliateTCOptions);

/**
* Add JWT to user models for login
*/
UserTC.addFields({jwt: 'String', userType: 'String'})
CandidateTC.addFields({jwt: 'String'})
AffiliateTC.addFields({jwt: 'String'})

/**
* Viewer Fields for authentication and authorization
*/
const ViewerCandidateTC = exports.ViewerCandidateTC = GQC.getOrCreateTC('ViewerCandidate');
const ViewerAffiliateTC = exports.ViewerAffiliateTC = GQC.getOrCreateTC('ViewerAffiliate');

const PlaceHolderTC = exports.PlaceHolderTC = GQC.getOrCreateTC('PlaceHolder');
