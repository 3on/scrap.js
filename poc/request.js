
var Request = function (session, action, filename, options, callback) {
  this.session = session;
  this.action = action;
  this.filename = filename;
  this.options = options;
  this.callback = callback;
};

Request.prototype.handle = function () {
  
};
