const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const User = keystone.list('User').model;
const { UserTC } = require('../../../composers');

// loginWithEmail resolver for user
module.exports = {
  kind: 'mutation',
  name: 'changePassword',
  description: 'login a user',
  args: {oldPassword: 'String!', newPassword: 'String!'},
  type: UserTC,
  resolve: async ({ args, context, sourceUser, sourceUserType }) => {
    const { oldPassword, newPassword } = args;
    if (sourceUser) {
      try {
        // validate password
        return new Promise((resolve, reject)=>{
          sourceUser._.password.compare(oldPassword, async (err, isMatch) => {
            if (err) {
              reject(err);
            }
            if (isMatch) {
              // change password
              sourceUser.password = newPassword;
              const user = await sourceUser.save();
              resolve(user);
            }
            reject('WrongPassword');
          });
        });
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject('no user in context not found');
  },
}
