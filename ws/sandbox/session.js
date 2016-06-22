var express = require('express');
var session = require('express-session');

var router = express.Router();
module.exports = router;

router.get('/', function(req, res) {

	if (req.session.sessionCounter == undefined) {
		req.session.sessionCounter = 0;
	} else {
		req.session.sessionCounter++;
	}
	res.json({sessionCounter: req.session.sessionCounter});
});
