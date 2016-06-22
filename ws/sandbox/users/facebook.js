var express = require('express');
var passport = require('passport');

var router = express.Router();
module.exports = router;

var CLIENT_ID = cfg.oauth2FacebookWebClientApp.client_id;
var CLIENT_SECRET = cfg.oauth2FacebookWebClientApp.client_secret;
var REDIRECT_URI = 'http://localhost:8000/ws/sandbox/user/facebook/signin/rd';


var Strategy = require('passport-facebook');

var findOrCreateUser = function(profile, callback) {
	console.log(profile.displayName, ':', profile.tagline);
	console.log('profile: ', profile);
	var login = {
		email: profile.emails[0].value
	};
	users.findOne(login).then(function(user) {
		console.log('findOne result', user);
		if (user == null) {
			user = {
				email: profile.emails[0].value,
				password: 'facebook',
				firstname: profile.name.givenName,
				lastname: profile.name.familyName
			};
			users.insertAsync(user).then(function(result) {
				console.log('Inserted 1 object into the users collection');
				console.log('User created.');
				callback(null, user);
			}).catch(function(error) {
				console.log('error.', error);
				callback(error, null);
			});
		} else {
			console.log('User found.');
			callback(null, user);
		}
		
	}).catch(function(error) {
		console.log('error.', error);
		callback(error, null);
	});
};




passport.use(new Strategy({
	clientID: CLIENT_ID,
	clientSecret: CLIENT_SECRET,
	callbackURL: REDIRECT_URI,
	enableProof: false,
	scope: 'email',
	profileFields: ['emails', 'first_name', 'last_name']
}, function(accessToken, refreshToken, profile, done) {
	console.log('accessToken', accessToken);
	console.log('profile', profile);
	findOrCreateUser(profile, function (err, user) {
		console.log('about to run done.');
		console.log('err', err);
		console.log('user', user);
		return done(err, user);
	});
}));


router.get('/signin', function(req, res, next) {
	console.log('about to authenticate');
	req.session.signin = req.query;
	passport.authenticate('facebook')(req, res, next);
}, function(req, res) {
	console.log('keep going...');
	
});

router.get('/signin/rd', function(req, res, next) {
	return passport.authenticate('facebook', { failureRedirect: req.session.signin.failureUrl })(req, res, next);
	},
	function(req, res) {
		console.log('callback of /signin/rd - succesfull authentication');
		console.log('req.user', req.user);
		var url = req.session.signin.successUrl || '/sandbox/user/';
		res.redirect(url);
	});
