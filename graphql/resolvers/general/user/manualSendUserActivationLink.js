const keystone = require('keystone');
const jwt = require('jsonwebtoken');
const User = keystone.list('User').model;
const { UserTC } = require('../../../composers');
const moment = require('moment');

// activateAccount resolver for user
module.exports = {
  kind: 'mutation',
  name: 'sendUserActivationLink',
  description: 'Send account activation link to user email',
  args: {code: 'String'},
  type: UserTC,
  resolve: async ({ args, context, sourceUserType, sourceUser }) => {
    const user = sourceUser;
    try {
      console.log("sending email");
    	if (user.isActivated) {
    		console.log('Account is already activated');
    		return Promise.reject('Account is already activated');
    	}

      if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
      	console.log('Unable to send email - no mailgun credentials provided');
      	return Promise.reject('could not find mailgun credentials');
      }

      if (!process.env.ACTIVATION_JWT_SECRET) {
      	console.log('Unable to generate activation code - no ACTIVATION_JWT_SECRET provided');
      	return Promise.reject('could not find ACTIVATION_JWT_SECRET');
      }

    	const brand = keystone.get('brand');

    	const code = jwt.sign({
    		id: user._id,
    		createdAt: Date.now(),
    	}, process.env.ACTIVATION_JWT_SECRET);
      const baseURL = process.env.BASE_URL || `http://localhost:${ process.env.PORT || '3000' }`
    	const activationLink = `${baseURL}/activate?code=${code}`

      return new Promise((resolve, reject)=>{
        new keystone.Email({
          templateName: 'activate-account',
          transport: 'mailgun',
        }).send({
          to: [user.email],
          from: {
            name: 'MCC',
            email: 'no-reply@mycareerchoice.global',
          },
          subject: 'MCC Account Activation',
          user,
          brand,
          activationLink
        }, (err) => {
          if (err) {
            reject(err)
          }
          resolve(user)
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  },
}
