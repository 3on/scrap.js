
var Cookies = module.exports = {
	parse: function (cookies, headers) {
		(headers || []).forEach(function (header) {
			header.split(';').forEach(function (line) {
				var parts = line.trim().split('=');
				cookies[parts[0]] = parts[1];
			});
		});
		return cookies;
	},

	stringify: function (cookies) {
		var lines = [];
		for (var key in cookies) {
			lines.push(key + '=' + cookies[key]);
		}
		return lines.join('; ');
	}
}