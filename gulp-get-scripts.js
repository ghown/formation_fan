var through = require('through2');
var vfs = require('vinyl-fs');

module.exports = function(pattern) {
	pattern = pattern || '.*<script.*src="(.*?)".*?></script>.*';
	return through.obj(function(file, encoding, callback) {
		//console.log('File ', file, encoding);
		
		var contents = file.contents.toString(encoding);
		//console.log('File content:', contents);
		var lines = contents.split('\n');
		var r = new RegExp(pattern);
		var scripts = [];
		for (var i = 0; i < lines.length; i++) {
			var e = r.exec(lines[i]);
			if (e != null) {
				scripts.push(e[1]);
			}
		}
		//console.log('scripts:', scripts);
		var self = this;
		vfs.src(scripts, {cwd: 'app/'})
			.pipe(through.obj(function(file, enc, cb) {
				//console.log('My scripts:', file.path);
				self.push(file);
				cb(null, file);
			}, function() {
				//console.log('end of stream:', arguments);
				callback();
			}));
	});
};
