var express = require('express');
var Hashes = require('jshashes');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var router = express.Router();
module.exports = router;

var doLoginChallenge = function(hash, token) {
	return new Hashes.SHA1().hex(hash + token);
};

passport.use(
	new Strategy({
		usernameField: 'email',
		passwordField: 'password'
	}, function(email, password, done) {
		done(null, {email: email, password: password});

	}
));

router.post('/signin', function(req, res, next) {
	passport.authenticate('local', function(err, obj, info) {
		console.log('authenticate');
		var login = {
			email: obj.email
		};
		users.findOne(login).then(function(user) {
			console.log('findOne result', user);
			if (user == null) {
				res.statusCode = 401;
				res.json({ message: 'Incorrect password.' });
				return;
			}
			var loginChallenge = doLoginChallenge(user.password, req.session.token);
			if (loginChallenge != obj.password) {
				res.statusCode = 401;
				res.json({ message: 'Incorrect password.' });
				return;
			}
			// if user wants to keep his session
			if (req.body.keepLogged) {
				req.session.cookie.expires = new Date(Date.now() + (1000*3600*24*30));
			} else {
				req.session.cookie.expires = false;
			}
			req.logIn(user, function(err) {
				if (err) { 
					return next(err); 
				}
				return res.json(user);
			});
		}).catch(function(error) {
			console.log('error.', error);
			return done(error, false, { message: 'database error.' });
		});
	})(req, res, next);
});
