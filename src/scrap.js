
var _ = require('underscore');
var Request = require('./request.js');
var $ = require('sharedjs');

var Scrap = module.exports = function (options) {
	this._options = {
		path: '',
		cookies: {},
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/535.7 (KHTML, like Gecko) Chrome/16.0.912.77 Safari/535.7'
		},
		filter: function (file) { return file; },
		type: 'string',
		login: function (callback) { callback(); },
		ttl: 60 * 3600
	};
	$.extend(true, this._options, options || {});

	this._requests = [];
};

Scrap.prototype = {
	_add_requests: function () {
		var that = this;
		var requests = this._parse_requests.apply(this, _.toArray(arguments).slice(0));

		requests.forEach(function (request) {
			that._requests.push(request);
		});

//		if (need_login /* todo */) {
//			login();
//		} else if (in_login_phase) {
//			// nothing
//		} else {
			this._flush();
//		}
	},

	// 'file.txt'
	// ['file1.txt', 'file2.txt'], {jsdom: 10}
	// 'file.txt', function () {}
	// ['file.txt'], {}, function () {}
	_parse_requests: function () {
		var that = this;

		// Action
		var args = _.toArray(arguments).slice(0);
		var action = args.shift();

		if (args.length == 0) {
			throw 'Scrap.js: Invalid arguments';
		}

		// Filename(s)
		var filenames = [];
		if (_.isString(args[0])) {
			filenames.push(args.shift());
		} else if (_.isArray(args[0])) {
			filenames = args.shift();
		} else {
			throw 'Scrap.js: Invalid arguments';
		}

		// Options
		var options = _.extend({}, this.options);
		if (args.length > 0 && !_.isFunction(args[0])) {
			_.extend(options, args.shift());
		}

		// Callback
		var callback = function () { };
		if (args.length > 0 && _.isFunction(args[0])) {
			callback = args.shift();
		}

		return filenames.map(function (filename) {
			return new Request(that, action, filename, options, callback)
		})
	},

	_flush: function () {
		var request;
		while (request = this._requests.pop()) {
			request.handle();
		}
	}
};


var actions = ['get', 'post', 'put', 'delete'];
actions.forEach(function (action) {
	Scrap.prototype[action] = function () {
		var args = _.toArray(arguments).slice(0);
		this._add_requests.apply(this, [action].concat(args));
	}
});
