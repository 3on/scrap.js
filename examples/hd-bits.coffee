
Scrap = require '../src/scrap.js'
match = require 'match'

scrap = new Scrap
	path: 'http://www.hd-bits.net/'
	filter: (file) ->
		file.replace /\\/g, '/'

getInt = (x) ->
	+x.replace /[^0-9]+/g, ''

options =
	postdata:
		take_login: 1
		username: process.argv[2]
		password: process.argv[3]

scrap.post 'login.php', options, (file) ->
	scrap.get 'browse.php', type: 'html5', (file) ->
		$ = file.$
		for line, i in $('#browse_table tr')[1...]
			console.log $(line).find('td').eq(1).find('a').html()
			console.log $(line).find('td').eq(1).find('a').attr('href')
			console.log getInt $(line).find('td').eq(0).find('a').attr('href')
