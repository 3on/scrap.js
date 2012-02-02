Scrap.js
========

Scrapping websites made easy. It handles redirections, cookies, get/post, string/binary/dom, jquery ... for you!


Examples
========

```
npm install Scrap
```


Download images from Wikipedia front-page
-----------------------------------------

This example makes use of jQuery to traverse the page, and shows how to download binary files.

```coffeescript
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
```

Download all the excerpts from Wikipedia front-page links
---------------------------------------------------------

This example shows how to download the page as string and use regular expressions with [jsMatch](https://github.com/vjeux/jsMatch) to extract meaningful parts.

```coffeescript
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
```

Thanks to NodeJS asynchronous download, this example runs 3 times faster than the [same version written synchronously in php](https://gist.github.com/1724677).

API
===

API
---

- **new Scrap**([options])
- **scrap.get**(url, [options], [callback])

All the 4 HTTP methods ```get```, ```put```, ```post``` and ```delete``` share the same definition.

Options
-------

- **path**: Base path of the website. The following request paths will be relative to this path.
- **type**: You can chose several post filters 
  - ```'string'```(default) Raw string.
  - ```'binary'``` [NodeJS Buffer](http://nodejs.org/docs/latest/api/buffers.html).
  - ```'html'``` [jsdom](https://github.com/tmpvar/jsdom) using [htmlparser](https://github.com/tautologistics/node-htmlparser).
  - ```'html5'``` [jsdom](https://github.com/tmpvar/jsdom) using [html5 parser](https://github.com/aredridel/html5). Beware, it is very slow.
- **filter**: A function used to edit the html string before it is parsed.
- **cookies**: An object to provide additional cookies.
- **headers**: An object to provide additional headers.
- **data**: The content of a POST request.
  - String: The content as-is.
  - Object: Converted to text with [querystring](http://nodejs.org/docs/latest/api/querystring.html).

