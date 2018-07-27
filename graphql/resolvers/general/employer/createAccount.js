const keystone = require('keystone');
const { InstitutionTC } = require('../../composers');
const jwt = require('jsonwebtoken');
const Institution = keystone.list('Institution').model;
const User = keystone.list('User').model;

module.exports = {
  kind: 'mutation',
  name: 'createAccount',
  description: 'create a institution account',
  args: {name: 'String!', email: 'String!', password: 'String!'},
  type: InstitutionTC,
  resolve: async ({ args, context }) => {
    // console.log('institution signUp this ----');
    const { name, email, password } = args;
    return User.findOne({email}).then((existing) => {
      if (!existing) {
        // hash password and create user
        const newInstitution = new Institution({
          email,
          password,
          name,
        })
        return newInstitution.save().then((institution)=>{
          const { id, email } = institution;
          const token = jwt.sign({
            id: institution._id,
            // email: institution.email,
            type: 'Institution',
            //passwordVersion: institution.passwordVersion,
          }, process.env.JWT_SECRET);
          return {
            name: institution.name,
            jwt: token
          };
        }).catch((err) => {
          return Promise.reject('Cannot create record, Please try again');
        })
      }
      return Promise.reject('Email already exists');
    })
  }
};
