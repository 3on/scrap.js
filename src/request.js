
var _ = require('underscore');
var url = require('url');
var http = require('http');
var https = require('https');

var Request = module.exports = function (session, action, path, options, callback) {
	this.session = session;
	this.action = action;
	this.options = {};
	_.extend(this.options, session._options, options);
	this.path = url.resolve(this.options.path, path);
	this.callback = callback;
};

Request.prototype.handle = function () {
	var that = this;

	var urlObj = url.parse(this.path);
	urlObj.method = this.action;
	var h = ({'http:': http, 'https:': https})[urlObj.protocol];
	h.request(urlObj, function (res) {
		res.setEncoding('utf8');

		var buffer = '';
		res.on('data', function (chunk) {
			buffer += chunk;
		});

		res.on('end', function () {
			that.callback(buffer, that.path);
		});
	}).end();
};
