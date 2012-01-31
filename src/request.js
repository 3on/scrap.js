
var http = require('http');
var https = require('https');

var Request = module.exports = function (session, action, filename, options, callback) {
  this.session = session;
  this.action = action;
  this.filename = filename;
  this.options = options;
  this.callback = callback;
};

Request.prototype.handle = function () {
	var that = this;
	http.request(options, function (res) {
		res.setEncoding('utf8');

		var buffer = '';

		res.on('data', function (chunk) {
			buffer += chunk;
		});

		res.on('end', function () {
			that.callback(buffer);
		});
	});

	console.log('handle!', this.action, this.filename, this.options);
};
