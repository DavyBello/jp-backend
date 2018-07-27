const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const User = keystone.list('User').model;
const { UserTC } = require('../../../composers');

// loginWithEmail resolver for user
module.exports = {
  kind: 'mutation',
  name: 'loginWithEmail',
  description: 'login a user',
  args: {email: 'String!', password: 'String!'},
  type: UserTC,
  resolve: async ({ args, context }) => {
    // console.log('user login this ----');
    const { email, password } = args;
    try {
      const user = await User.findOne({email});
      if (user) {
        // validate password
        return new Promise((resolve, reject)=>{
          user._.password.compare(password, (err, isMatch) => {
            if (err) {
              reject(err);
            }
            if (isMatch) {
              // create jwt
              const token = jwt.sign({
                id: user._id,
                type: user.__t ? user.__t : 'User',
                // email: user.email,
                //passwordVersion: user.passwordVersion,
              }, process.env.JWT_SECRET);
              resolve({
                name: user.name,
                jwt: token,
                userType:  user.__t || 'user'
              });
            }
            reject('password incorrect');
          });
        });
      }
      return Promise.reject('email/user not found');
    } catch (e) {
      return Promise.reject(e);
    }
  },
}
