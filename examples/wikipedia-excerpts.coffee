
Scrap = require '../src/scrap.js'
match = require 'match'

# Create a new Scrap with the base for all the following requests
wikipedia = new Scrap
	path: 'http://en.wikipedia.org/'

# Download the front page as string
wikipedia.get '/', (page) ->

	# Get all the wiki pages using a regex
	urls = match.all(page, '<a href="(/wiki/[^:"]+)"')

	# Request all the urls at once
	wikipedia.get urls, (page, url) ->

		# Display useful information from the page
		console.log
			url: url
			title: match(page, '<h1[^>]+>(.*?)<\/h1>')
			excerpt: match(page, '<p>(.*?)<\/p>').replace(/<[^>]+>/g, '')
