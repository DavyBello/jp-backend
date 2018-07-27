const keystone = require('keystone');
const { JpNewsletterSubscriberTC } = require('../../composers');
const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

module.exports = {
  kind: 'mutation',
  name: 'subscribe',
  description: 'subscribe from newsletter',
  args: { address: 'String!'},
  type: JpNewsletterSubscriberTC,
  resolve: async ({ args }) => {
    const { address } = args;
    const user = {
      subscribed: true,
      address,
      // name: 'Bob Bar',
      // vars: {age: 26}
    };

    const list = mailgun.lists('subscribers@mycareerchoice.global');
    return new Promise(function(resolve, reject) {
      list.members().create(user, function (err, data) {
        if (err) {
          delete user.address
          list.members(address).update({subscribed: 'true'}, function (err, updateData) {
            if (err) {
              reject(err)
            }
            resolve(updateData.member)
          });
        } else {
          // `data` is the member details
          resolve(data.member)
        }
      });

    });
  }
}
