var express = require('express');
var router = express.Router();

var hello = require('./hello.js');
router.use('/hello', hello);

var sandbox = require('./sandbox.js');
router.use('/sandbox', sandbox);

var admin = require('./admin.js');
router.use('/admin', admin);

router.get('/now', function(req, res) {
	res.json({now: new Date()});
});

module.exports = router;
