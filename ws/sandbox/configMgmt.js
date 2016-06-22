var express = require('express');


var router = express.Router();
module.exports = router;

router.get('/get', function(req, res) {
	res.json(global.cfg);
});

var assign = function(cfg, key, value) {
	if (key.indexOf('.') == -1) {
		cfg[key] = value;
		return;
	}
	var prefix = key.substring(0, key.indexOf('.'));
	var rest = key.substring(key.indexOf('.') + 1);
	if (cfg[prefix] == undefined || cfg[prefix] == null || (typeof cfg[prefix] != 'object')) {
		cfg[prefix] = {};
		assign(cfg[prefix], rest, value);
	}

};

router.post('/update', function(req, res) {
	console.log('req.body', req.body);
	for (var i = 0; i < req.body.length; i++) {
		var pair = req.body[i];
		assign(global.cfg, pair.key, pair.value);
	}
	
	console.log('global.cfg', global.cfg);
	res.json(global.cfg);
});
