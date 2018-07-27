const keystone = require('keystone');
const { InstitutionTC } = require('../../composers');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const Institution = keystone.list('Institution').model;

module.exports = {
  kind: 'mutation',
  name: 'activateAccount',
  description: 'Activate Institution account',
  args: {code: 'String!'},
  type: InstitutionTC,
  resolve: async ({ args, context }) => {
    // console.log('institution activate');
    const { code } = args;
    try {
      const data = jwt.verify(code, process.env.ACTIVATION_JWT_SECRET);
      const { id, createdAt } = data;
      if (id) {
        if (createdAt && moment(createdAt).isAfter(moment().subtract(24, 'hours'))) {
          const institution = await Institution.findOne({_id: id});
          if (institution.isActivated) {
            return Promise.reject('activated account')
          } else {
            institution.isActivated = true;
            await institution.save();
            const token = jwt.sign({
              id: institution.id,
              email: institution.email,
              type: 'Institution',
              //passwordVersion: institution.passwordVersion,
            }, process.env.JWT_SECRET);
            institution.jwt = token;
            context.institution = Promise.resolve(institution);
            return institution;
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
  }
}
