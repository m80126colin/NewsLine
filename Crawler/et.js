var meta	= require('./meta.js'),
	db		= require('./database.js'),
	cheerio	= require('cheerio');

for (var i = 0; i < 361550; i++) {
	meta.getMeta('http://www.ettoday.net/news/20140527/' + i + '.htm', function (e, res, body, mdata) {
		if (res.statusCode == 200) {
			var $		= cheerio.load(body),
				valid	= $('article').length;
			if (valid) {
				mdata.id	= 'ettoday-' + i;
				mdata.tags	= mdata.tags.split(',');
				db.insert(mdata, 'ettoday');
				console.log(mdata);
			}
			else console.log('none.');
		}
	});
}