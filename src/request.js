
var _ = require('underscore');
var url = require('url');
var http = require('http');
var https = require('https');
require('bufferjs/concat');

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

		var chunks = [];
		res.on('data', function (chunk) {
			chunks.push(chunk);
		});

		res.on('end', function () {
			var data;
			if (that.options.type === 'binary') {
				data = Buffer.concat(chunks);
			} else {
				data = chunks.join('');
			}
			that.callback(data, that.path);
		});
	}).end();
};
