
Scrap = require '../src/scrap.js'
match = require 'match'

scrap = new Scrap
	path: 'http://www.hd-bits.net/'
	filter: (file) ->
		file.replace /\\/g, '/'

getInt = (x) ->
	+match x, '([0-9]+)'

options =
	postdata:
		take_login: 1
		username: process.argv[2]
		password: process.argv[3]

scrap.post 'login.php', options, ->
	scrap.get 'browse.php', type: 'html5', (file) ->
		$ = file.$
		for line in $('#browse_table tr')[1...]
			console.log
				title: $(line).find('td').eq(1).find('a').html().trim()
				id: getInt $(line).find('td').eq(1).find('a').attr('href')
				category: getInt $(line).find('td').eq(0).find('a').attr('href')
