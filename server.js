(function() {
	'use strict';

	var express = require('express'); // charge ExpressJS
	var serveIndex = require('serve-index');

	var app = express();
	
	app.use('/ws/', function(req, res, next) {
		console.log('req.url', req.url);
		setTimeout(function() {
			next();
		}, 2000);
	});

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
