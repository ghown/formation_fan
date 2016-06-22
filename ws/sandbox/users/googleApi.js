var express = require('express');
var google = require('googleapis');



var router = express.Router();
module.exports = router;

var OAuth2Client = google.auth.OAuth2;
var plus = google.plus('v1');

var CLIENT_ID = cfg.oauth2GoogleWebClientApp.client_id;
var CLIENT_SECRET = cfg.oauth2GoogleWebClientApp.client_secret;
var REDIRECT_URI = 'http://localhost:8000/ws/sandbox/user/googleApi/signin/rd';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);



router.get('/signin', function(req, res) {
	console.log('connect with google');
	console.log('req.query', req.query);
	console.log('req.session', req.session);
	req.session.signin = req.query;
	var url = oauth2Client.generateAuthUrl({
		access_type: 'offline',
		scope: [
			'https://www.googleapis.com/auth/plus.login', 
			'https://www.googleapis.com/auth/plus.profile.emails.read'
		]
	});
	res.json({url: url});
	
});


router.get('/signin/rd', function(req, res) {
	console.log('redirect_uri with google');
	console.log('req.query: ', req.query);
	var url = req.session.signin.successUrl || '/sandbox/user/';
	var failureUrl = req.session.signin.failureUrl || '/sandbox/user/';
	var code = req.query.code;
	console.log('code: ', code);
	oauth2Client.getToken(code, function(err, tokens) {
		if (err) {
			console.log('err: ', err);
			res.redirect(failureUrl);
		}
		console.log('tokens: ', tokens);
		oauth2Client.setCredentials(tokens);
		plus.people.get({ userId: 'me', auth: oauth2Client }, function(err, profile) {
			if (err) {
				console.log('An error occured', err);
				res.redirect(failureUrl);
				return;
			}
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
						password: 'google',
						firstname: profile.name.givenName,
						lastname: profile.name.familyName
					};
					users.insertAsync(user).then(function(result) {
						console.log('Inserted 1 object into the users collection');
						console.log('User created.');
						return user;
					});
				}
				return user;
			}).then(function(user) {
				console.log('try to log user.');
				req.logIn(user, function() {});
				res.redirect(url);
			}).catch(function(error) {
				console.log('error.', error);
				res.redirect(failureUrl);
			});
			
		});
		
	});
});
