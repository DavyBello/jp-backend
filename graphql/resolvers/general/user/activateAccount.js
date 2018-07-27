const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const User = keystone.list('User').model;
const { UserTC } = require('../../../composers');
const moment = require('moment');

// activateAccount resolver for user
module.exports = {
  kind: 'mutation',
  name: 'activateAccount',
  description: 'Activate a User account',
  args: {code: 'String!'},
  type: UserTC,
  resolve: async ({ args, context }) => {
    // console.log('user activate');
    const { code } = args;
    try {
      const data = jwt.verify(code, process.env.ACTIVATION_JWT_SECRET);
      const { id, createdAt } = data;
      if (id) {
        if (createdAt && moment(createdAt).isAfter(moment().subtract(24, 'hours'))) {
          const user = await User.findOne({_id: id});
          console.log(user);
          if (user.isActivated) {
            return Promise.reject('activated account')
          } else {
            user.isActivated = true;
            await user.save();
            const token = jwt.sign({
              id: user.id,
              type: user.__t ? user.__t : 'User',
              // email: user.email,
              //passwordVersion: user.passwordVersion,
            }, process.env.JWT_SECRET);
            // user.jwt = token;
            // context.user = Promise.resolve(user);
            return {
              name: user.name,
              jwt: token,
              userType:  user.__t || 'user'
            };
          }
        } else {
          return Promise.reject('expired token')
        }
      } else {
        return Promise.reject('invalid token')
      }
    } catch (e) {
      throw e;
    }
  },
}
