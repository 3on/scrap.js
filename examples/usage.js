
var Scrap = require('../src/scrap.js');
var match = require('match');
var fs = require('fs');

var battlenet = new Scrap({
	path: 'http://us.battle.net/',
	type: 'string',
	cookies: {},
	login: function (callback) {
		this.post('/login', {login: 'dude', password: 12345}, callback);
	},
	ttl: 60 * 3600
});

battlenet.get('/wow/en/profession/first-aid/recipes', {type: 'dom'}, function (file, url) {
	var $ = file.$;

	var urls = []
	$('.item-link').each(function () {
		urls.push($(this).attr('href'));
	});

	console.log(urls);
	return;
	var urls = match.all(file, 'a href="(/wow/en/item/[0-9]+)"');
	var urls = match.all(file, 'url\\("(http:\\/\\/us.media.blizzard.com\\/wow\\/icons\\/[^"]+)"');

	battlenet.get(urls, {type: 'binary'}, function (file, url) {
		console.log(url);
		fs.writeFileSync(url.replace(/[^a-zA-Z\.]/g, ''), file);
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


