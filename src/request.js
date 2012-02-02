
var _ = require('underscore');
var jsdom = require('jsdom');
var url = require('url');
var http = require('http');
var https = require('https');
var querystring = require('querystring');
require('bufferjs/concat');
var jquery_path = '../lib/jquery-1.7.1.min.js';
var html5 = require('html5')
var Script = process.binding('evals').Script
var $ = require('sharedjs');

var Cookies = require('./cookies.js');

var Request = module.exports = function (session, action, path, options, callback) {
	this.session = session;
	this.action = action;
	this.options = {};
	if (action === 'post') {
		this.options.headers = {
			'Content-Type': 'application/x-www-form-urlencoded'
		};
	}
	$.extend(true, this.options, session._options, options);
	if (this.options.postdata && !_.isString(this.options.postdata)) {
		this.options.postdata = querystring.stringify(this.options.postdata);
	}
	this.path = url.resolve(this.options.path, path);
	this.callback = callback;
};

Request.prototype.handle = function () {
	var that = this;

	var urlObj = url.parse(this.path);
	urlObj.method = this.action.toUpperCase();
	var h = ({'http:': http, 'https:': https})[urlObj.protocol];
	var req = h.request(urlObj, function (res) {

		var chunks = [];
		res.on('data', function (chunk) {
			chunks.push(chunk);
		});

		res.on('end', function () {
			Cookies.parse(that.options.cookies, res.headers['set-cookie']);

//			console.log(res.headers);

			if (res.headers.location) {
				that.path = url.resolve(that.options.path, res.headers.location);
				that.handle();
				return;
			}

			var data;
			if (that.options.type === 'binary') {
				data = Buffer.concat(chunks);
			} else {
				data = chunks.join('');
			}

			data = that.options.filter(data);

			if (that.options.type === 'html') {
				jsdom.env({html: data, scripts: [jquery_path]},
					function (err, data) {
						that.callback(data, that.path);
					}
				);
			} else if (that.options.type === 'html5') {
				var window = jsdom.jsdom(null, null, {parser: html5}).createWindow();
				new html5.Parser({document: window.document}).parse(data);
				jsdom.jQueryify(window, jquery_path, function (window, $) {
					that.callback(window, that.path);
				});
			} else {
				that.callback(data, that.path);
			}
		});
	});

	_.each(this.options.headers, function (value, key) {
		req.setHeader(key, value);
	});
	req.setHeader('Cookie', Cookies.stringify(this.options.cookies));

	if (this.options.postdata) {
		req.setHeader('Content-Length', this.options.postdata.length);
		req.write(this.options.postdata);
	}
	req.end();
};
