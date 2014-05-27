var request		= require('request'),
	cheerio		= require('cheerio');

module.exports.getMeta = function(url, callback) {
	var r = {};
	request.get(url, function (e, res, body) {
		if (res.statusCode == 200) {
			var $		= cheerio.load(body);
			r.title		= $('meta[property="og:title"], meta[name="Title"]').attr('content');
			r.img		= $('meta[property="og:image"]').attr('content');
			r.url		= $('meta[property="og:url"]').attr('content') || res.request.href;
			// r.dsc		= $('meta[property="og:description"], meta[name="description"]').attr('content');
			r.tags		= $('meta[name="keywords"], meta[name="news_keywords"]').attr('content');
			r.author	= $('meta[name="author"]').attr('content');
			r.time		= $('meta[property="og:updated_time"], meta[itemprop="datePublished"]').attr('content');
			if (r.time != undefined)
				r.time = (new Date(r.time)).getTime();
		}
		callback(e, res, body, r);
	});
}