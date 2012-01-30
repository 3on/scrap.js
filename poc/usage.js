
var Session = require('Session');

var playnet = new Session('http://play-net.net/', {
  jsdom: true,
  html5: true,
  pre_lex: function () {
    
  },
  cookies: {},
  login: function (callback) {
    this.post('/login', {login: 'dude', password: 12345}, callback);
  },
  ttl: 60 * 3600
});

playnet.get('/serverlist.html', function (doc) {
  var $files = doc.query('a[title="download"]');
  var files = $files.map(function (element) {
    return element.attr('href');
  });
  playnet.get(files, {}, function (data, filename) {
    // do something with data
  });
});





 



var isLogged = false;
var requests = [];

function get(rq) {
  requests.push(rq);
}

function flush() {
  for (var i = 0; i < requests.length; ++i) {
    requests[i].handle();
  }
}

function login() {
  real_login(flush)
}
