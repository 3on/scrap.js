
var _ = require('underscore');

var Session = function () {
  this._requests = [];
};

var actions = ['get', 'post', 'put', 'delete'];
actions.forEach(function (action) {
  Session.prototype[action] = function () {
    this._add_requests(action, arguments);
  }
});

Session.prototype = {
  _add_requests: function (a, b, c) {
    var requests = this._parse_requests.apply(this, arguments);

    requests.forEach(function (request) {
      this._requests.push(request);
    });
    
    if (need_login /* todo */) {
      login();
    } else if (in_login_phase) {
      // nothing
    } else {
      this._flush();
    }
  },
  
  // 'file.txt'
  // ['file1.txt', 'file2.txt'], {jsdom: 10}
  // 'file.txt', function () {}
  // ['file.txt'], {}, function () {}
  _parse_requests: function () {
      // Action
      var action = arguments.shift();
      
      if (arguments.length == 0) {
        throw 'Invalid arguments';
      }
      
      // Filename(s)
      var filenames = [];
      if (_.isString(arguments[0])) {
        filenames.push(arguments.shift());
      } else if (_.isArray(arguments[0])) {
        filenames = arguments.shift();
      } else {
        throw 'Invalid arguments';
      }
      
      // Options
      var options = _.extend({}, this.options);
      if (arguments.length > 0 && !_.isFunction(arguments[0])) {
        _.extend(options, arguments.shift());
      }
      
      // Callback
      var callback = function () { };
      if (arguments.length > 0 && _.isFunction(arguments[0])) {
        callback = arguments.shift();
      }
      
      return filenames.map(function (filename) {
        return new Request(this, action, filename, options, callback)
      })
  },
  
  _flush: function () {
    this._requests.forEach(function (request) {
      request.handle();
    });
  }
};
