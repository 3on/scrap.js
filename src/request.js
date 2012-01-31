
var _ = require('underscore');
var jsdom = require('jsdom');
var url = require('url');
var http = require('http');
var https = require('https');
require('bufferjs/concat');

var Cookies = require('./cookies.js');

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
	var req = h.request(urlObj, function (res) {
//		res.setEncoding('utf8');

		var chunks = [];
		res.on('data', function (chunk) {
			chunks.push(chunk);
		});

		res.on('end', function () {
			Cookies.parse(that.options.cookies, res.headers['set-cookie']);

			var data;
			if (that.options.type === 'binary') {
				data = Buffer.concat(chunks);
			} else {
				data = chunks.join('');
			}
			if (that.options.type === 'dom') {
				jsdom.env({
						html: data,
						scripts: ['../lib/jquery-1.7.1.min.js']
					},
					function (err, data) {
						that.callback(data, that.path);
					});
			} else {
				that.callback(data, that.path);
			}
		});
	})

	req.setHeader('cookies', Cookies.stringify(this.options.cookies));
	req.end();
};
