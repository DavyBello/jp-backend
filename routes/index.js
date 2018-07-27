const keystone = require('keystone');
const cors = require('cors');
const jwt = require('express-jwt');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});

const schema = require('../graphql/schema');

const User = keystone.list('User').model;
const Candidate = keystone.list('Candidate').model;
const Affiliate = keystone.list('Affiliate').model;

// Setup Route Bindings
exports = module.exports = function (app) {
	//Configure CORS -- Remove localhost in final version
	var whitelist = ['http://localhost']
	var corsOptions = {
	  origin: function (origin, callback) {
	    if (whitelist.indexOf(origin) !== -1) {
	      callback(null, true)
	    } else {
	      callback(new Error('Not allowed by CORS'))
	    }
	  }
	}

	//
	// Register API middleware
	// -------------------------------------------------------------------------

	app.use('/graphql', cors(), bodyParser.json(), jwt({
	  secret: process.env.JWT_SECRET,
	  credentialsRequired: false,
	}), graphqlExpress(req => {
		//req.user is provided by jwt from the authorization header provided
		let context = {};
		if (req.user) {
			context = {
				//user: req.user ? User.findOne({ _id: req.user._id || req.user.id, version: req.user.version}) : Promise.resolve(null),
				User: req.user.type ? Promise.resolve(req.user) : Promise.resolve(null),
				Candidate: req.user.type==='Candidate' ?
					Candidate.findById(req.user.id) : Promise.resolve(null),
				Affiliate: req.user.type==='Affiliate' ?
					Affiliate.findById(req.user.id) : Promise.resolve(null),
			}
		}
		return ({
		  schema: schema,
		  context: context
		})}
	));

	app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // if you want GraphiQL enabled

	// Views
	app.get('/admin', (req, res) => {res.redirect('/keystone')});
	app.get('/', (req, res) => {res.redirect('/keystone')});

	app.get('/testnewsletter', (req, res) => {
		keystone.list('AffiliateNewsletter').model.findOne().exec(function (err, newsletter) {
			const brandDetails = keystone.get('brandDetails');

			new keystone.Email({
				templateName: 'newsletter',
				transport: 'mailgun',
			}).render({
				to: 'subscribers@mycareerchoice.global',
				from: {
					name: 'MCC',
					email: 'contact@mycareerchoice.global',
				},
				subject: newsletter.subject,
				newsletter,
				brandDetails,
			}, (err, { html, text }) => res.send(html));
		});
	});
	app.get('/maillist', (req, res) => {
		const list = mailgun.lists('subscribers@mycareerchoice.global');
		list.members().list(function (err, members) {
		  // `members` is the list of members
		  res.json(members);
		});
	});

	//routes for testing in development
	if (process.env.NODE_ENV == 'development') {
		/*app.all('/test', routes.views.tests.test);
		app.get('/blog/:category?', routes.views.blog);
		app.get('/blog/post/:post', routes.views.post);
		app.get('/gallery', routes.views.gallery);
		app.all('/contact', routes.views.contact);*/
	}

};
