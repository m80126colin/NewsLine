var meta	= require('./meta.js'),
	db		= require('./database.js'),
	cheerio	= require('cheerio');

var i = 0,
	limit = 100,
	fin = [];

// var i = 1;
var getET = function() {
	if (i < limit) {
		meta.getMeta('http://www.ettoday.net/news/0/' + i + '.htm', function (e, res, body, mdata) {
			if (res.statusCode == 200) {
				var $		= cheerio.load(body),
					valid	= $('article').length;
				if (valid) {
					mdata.id	= 'ettoday-' + i;
					mdata.tags	= mdata.tags.split(',');
					fin.push(mdata);
					// console.log(mdata);
				}
				else console.log('none.');
				i++;
				getET();
			}
		});
	}
	else {
		db.insert(fin, 'test');
	}
}

getET();