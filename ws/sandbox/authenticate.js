var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;

var router = express.Router();
module.exports = router;

var users = [{name: 'Julien', password: '1234'}, {name: 'JLG', password: '4321'}];

var strategy = new Strategy({
		usernameField: 'name',
		passwordField: 'password'
	}, function(name, password, done) {
		console.log('authenticate.js: authenticating name', name);
		done(null, {name: name, password: password});
	});
strategy.name = 'local-try';

passport.use(strategy);

passport.serializeUser(function(user, done) {
	console.log('authenticate.js: serializeUser user', user);
	if (user.name == undefined) {
		done('pass', false);
		return;
	}
	done(null, 'local-try_' + user.name);
});



passport.deserializeUser(function(id, done) {
	console.log('authenticate.js: deserializeUser user', id);
	if (id.substring(0, 'local-try_'.length) !== 'local-try_') {
		console.log('authenticate.js: deserializeUser cannot do it');
		return done('pass', undefined);
	}
	var name = id.substring('local-try_'.length);
	console.log('authenticate.js: name', name);
	for (var i = 0; i < users.length; i++) {
		if (users[i].name == name) {
			console.log('authenticate.js: user found');
			return done(null, users[i]);
		}
	}
	console.log('authenticate.js: deserializeUser user not found');
	done('pass', false);
});

router.post('/', function(req, res, next) {
	passport.authenticate('local-try', function(err, obj, info) {
		console.log('authenticate.js: authenticating obj.name', obj.name);
		for (var i = 0; i < users.length; i++) {
			if (users[i].name == obj.name) {
				if (users[i].password == obj.password) {
					req.logIn(users[i], function(err) {
						if (err) { 
							return next(err); 
						}
						console.log('authenticate.js: ok');
						return res.json({user: users[i]});
					});
					return;
				}
				res.statusCode = 401;
				res.json({ message: 'Incorrect password.' });
				return;
			}
		}
		res.statusCode = 401;
		res.json({ message: 'Incorrect password.' });
		return;
	})(req, res, next);
});

var checkLogged = function(req, res, next) {
	console.log('checkLogged...', req.isAuthenticated);
    if (req.isAuthenticated && req.isAuthenticated()) {
		return next();
    }
	res.sendStatus(401);
}

router.get('/check', checkLogged, function(req, res) {
	console.log('checking...');
	res.json({user: req.user});
});

router.get('/logout', checkLogged, function(req, res) {
	console.log('logout...');
	req.logout();
	res.json({});
});


