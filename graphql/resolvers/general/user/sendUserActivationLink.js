const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const User = keystone.list('User').model;
const { UserTC } = require('../../../composers');
const { TypeComposer } = require('graphql-compose');

const ActivationLinkResponseType = TypeComposer.create({
  name: 'ActivationLinkResponse',
  fields: {
    status: 'String',
    email: 'String'
  },
})

// activateAccount resolver for user
module.exports = {
  kind: 'mutation',
  name: 'sendUserActivationLink',
  description: 'Send account activation link to user email',
  // args: {code: 'String'},
  type: ActivationLinkResponseType,
  resolve: async ({ args, context, sourceUserType, sourceUser }) => {
    if (sourceUser.sendActivationLink) {
      try {
        await sourceUser.sendActivationLink();
        return ({
          status: "success",
          email: sourceUser.email
        })
      } catch(e) {
        return Promise.reject(e);
      }
    } else {
      return Promise.reject('this user cannot run this mutation');
    }
  },
}
