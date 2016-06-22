var express = require('express');
var session = require('express-session');
var passport = require('passport');

passport.serializeUser(function(user, done) {
	console.log('user.js: serializeUser user', user);
	if (user._id == undefined) {
		done('pass', false);
		return;
	}
	done(null, user._id);
});

passport.deserializeUser(function(id, done) {
	console.log('user.js: deserializeUser user', id);
	var _id;
	try {
		_id = ObjectId(id);
	} catch(e) {
		return done('pass', undefined);
    }
	users.findOne({_id: _id}).then(function(user) {
		console.log('findOne result', user);
		if (user == null) {
			done('pass', false);
		} else {
			console.log('User found.');
			done(null, user);
		}
	}).catch(function(error) {
		console.log('error.', error);
		done('pass', undefined);
	});
});

var router = express.Router();
module.exports = router;

var local = require('./users/local.js');
router.use('/local', local);

var google = require('./users/google.js');
router.use('/google', google);

var facebook = require('./users/facebook.js');
router.use('/facebook', facebook);

var linkedin = require('./users/linkedin.js');
router.use('/linkedin', linkedin);

var googleApi = require('./users/googleApi.js');
router.use('/googleApi', googleApi);

router.get('/getUser', function(req, res) {
	console.log('getUser');
	if (req.user) {
		res.json(req.user);
		return;
	}
	res.status(401).end();	
});

router.post('/signup', function(req, res) {
	console.log('signup req.body', req.body);
	var user = req.body;
	users.insertAsync(user).then(function(result) {
		console.log('Inserted 1 object into the users collection', result);
		console.log('User created.');
		user = result.ops[0];
		req.login(user, function() {});
		res.json(user);
	}).catch(function(error) {
		var result = {
			message: 'User not created',
			error: error
		};
		console.log('error.', error);
		if (error.code == 11000) {
			result.message = 'email already taken';
		}
		res.statusCode = 403;
		res.json(result);
	});
	
});

router.get('/logout', function(req, res) {
	console.log('logout');
	req.logout();
	res.json({});
});

var guid = function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
};

router.get('/getLoginToken', function(req, res) {
	console.log('getLoginToken');
	req.session.token = guid();
	res.json({token: req.session.token});
});

