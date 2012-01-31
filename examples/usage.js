
var Scrap = require('../src/session.js');
var match = require('match');

var battlenet = new Scrap({
	path: 'http://us.battle.net/',
	type: 'string',
	cookies: {},
	login: function (callback) {
		this.post('/login', {login: 'dude', password: 12345}, callback);
	},
	ttl: 60 * 3600
});

battlenet.get('/wow/en/profession/first-aid/recipes', function (file, url) {
	var urls = match.all(file, 'a href="(/wow/en/item/[0-9]+)"');
	var urls = match.all(file, 'url\\("(http:\\/\\/us.media.blizzard.com\\/wow\\/icons\\/[^"]+)"');

	battlenet.get(urls, {type: 'binary'}, function (file, url) {
		console.log(file, url);
	});

/*
	var $files = doc.query('a[title="download"]');
	var files = $files.map(function (element) {
	return element.attr('href');
	});
	playnet.get(files, {}, function (data, filename) {
	// do something with data
	});
*/
});






/*


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

*/