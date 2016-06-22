(function() {
	'use strict';

	var express = require('express'); // charge ExpressJS
	var serveIndex = require('serve-index');
	var session = require('express-session');
	var MongoStore = require('connect-mongo')(session);
	
	var mongodb = require('mongodb');
	var MongoClient = mongodb.MongoClient;
	var Collection = mongodb.Collection;
	global.ObjectId = mongodb.ObjectID;
	
	Promise.promisifyAll(MongoClient);
	Promise.promisifyAll(Collection.prototype);

	var app = express();
	
	app.use('/ws/', function(req, res, next) {
		console.log('req.url', req.url);
		setTimeout(function() {
			next();
		}, 2000);
	});
	
	MongoClient.connect(cfg.mongodb.url + '?maxPoolSize=7', function(err, database) {
		if (err) {
			throw err;
		}

		global.db = database;
		global.users = db.collection('users');
		global.groups = db.collection('groups');
		//console.log('db', db);
		//console.log('db.s.topology.poolSize', db.s.topology.poolSize);

		app.listen(cfg.port, function() {
			console.log('server started on port ' + cfg.port);
		});
	});

	var options = {
		server: { poolSize: 6 }
	}
	
	app.use(session({
		secret: 'cpw!4321!',
		resave: false,
		saveUninitialized: true,
		store: new MongoStore({ url: global.cfg.mongodb.url })
	}));

	app.use(express.static('.'));
	app.use(serveIndex('.', {icons: true}));
	
	app.use('/app/*', function(req, res, next) {
		console.log('404: Page not Found', req.url);
		next();
	});

	app.use(function(req, res, next) {
		res.sendFile('./app/index.html', { root: __dirname });
	});
	
	app.use(function(req, res, next) {
		res.sendFile('./dist/index.html', { root: __dirname });
	});

	app.listen(666, function() {
		console.log('server started on port 666');
	});
})();
