const keystone = require('keystone');
const { CandidateTC } = require('../../../composers');
const jwt = require('jsonwebtoken');
const Candidate = keystone.list('Candidate').model;
const User = keystone.list('User').model;

module.exports = {
  kind: 'mutation',
  name: 'createAccount',
  description: 'create a candidate account',
  args: {firstName: 'String!', lastName: 'String!', email: 'String!', password: 'String!'},
  type: CandidateTC,
  resolve: async ({ args, context }) => {
    // console.log('candidate signUp this ----');
    const { firstName, lastName, email, password } = args;
    return User.findOne({email}).then((existing) => {
      if (!existing) {
        // hash password and create user
        const newCandidate = new Candidate({
          email,
          password,
          firstName,
          lastName
        })
        return newCandidate.save().then((candidate)=>{
          const { id, email } = candidate;
          const token = jwt.sign({
            id: candidate._id,
            // email: candidate.email,
            type: 'Candidate',
            //passwordVersion: candidate.passwordVersion,
          }, process.env.JWT_SECRET);
          return {
            name: candidate.name,
            jwt: token,
          };
        }).catch((err) => {
          return Promise.reject('Cannot create record, Please try again');
        })
      }
      return Promise.reject('Email already exists');
    })
  }
};
