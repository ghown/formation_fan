var express = require('express');
var passport = require('passport');

var router = express.Router();
module.exports = router;

var CLIENT_ID = cfg.oauth2LinkedinWebClientApp.client_id;
var CLIENT_SECRET = cfg.oauth2LinkedinWebClientApp.client_secret;
var REDIRECT_URI = cfg.oauth2LinkedinWebClientApp.redirect_uris[0];


var Strategy = require('passport-linkedin');

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
				password: 'linkedin',
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
	consumerKey: CLIENT_ID,
    consumerSecret: CLIENT_SECRET,
    callbackURL: REDIRECT_URI,
	profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
}, function(token, tokenSecret, profile, done) {
	console.log('token', token);
	console.log('tokenSecret', tokenSecret);
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
	passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] })(req, res, next);
}, function(req, res) {
	console.log('keep going...');
	
});

router.get('/signin/rd', function(req, res, next) {
		return passport.authenticate('linkedin', {failureRedirect: req.session.signin.failureUrl})(req, res, next);
	},
	function(req, res) {
		console.log('callback of /signin/rd - succesfull authentication');
		console.log('req.user', req.user);
		var url = req.session.signin.successUrl || '/sandbox/user/';
		res.redirect(url);
	});
