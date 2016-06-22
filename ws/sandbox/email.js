var express = require('express');

var router = express.Router();
module.exports = router;

router.post('/', function(req, res) {
	console.log('sending...');
	var mailOptions = {
		from: global.cfg.email.from, // sender address
		subject: 'Hello', // Subject line
		text: 'Hello world', // plaintext body
		html: '<b>Hello world</b>' // html body
	};
	mailOptions.to = req.body.to;
	var transporter = global.cfg.email.transporter;
	transporter.sendMail(mailOptions, function(error, info) {
		if (error) {
			res.json({error: error});
			return console.log(error);
		}
		res.json({info: info});
		console.log('Message sent: ' + info.response);
	});
});
