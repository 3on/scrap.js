
Scrap = require '../src/scrap.js'
fs = require 'fs'
path = require 'path'


fs.mkdirSync 'images'

# Create a new Scrap with the base for all the following requests
wikipedia = new Scrap
	path: 'http://en.wikipedia.org/'

# Download the front page as HTML
wikipedia.get '/', type: 'html', (window) ->

	# We get a window element with jQuery
	$ = window.$

	# Using jQuery we iterate over all the images
	$('img').each ->

		# We get the url and basename
		url = $(this).attr('src')
		basename = path.basename url

		# We get the image as binary
		wikipedia.get url, type: 'binary', (file) ->

			# And save it to the disk
			fs.writeFile 'images/' + basename, file
