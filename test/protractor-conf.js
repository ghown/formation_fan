exports.config = {
	allScriptsTimeout: 11000,

	specs: [
		'e2e/*.js'
	],

	capabilities: {
		browserName: 'chrome'
	},

	chromeOnly: true,

	baseUrl: 'http://localhost:666/app/',

	framework: 'jasmine',

	jasmineNodeOpts: {
		defaultTimeoutInterval: 30000
	}
};
