var START		= 0,
	NEWS_LIMIT	= 0,
	FILE		= '';

if (process.argv[2])
	START		= parseInt(process.argv[2]);
else throw 'enter start';
if (process.argv[3])
	NEWS_LIMIT	= parseInt(process.argv[3]);
else throw 'enter limit';
if (process.argv[4])
	FILE		= process.argv[4];
else throw 'enter filename';

var fs			= require('fs'),
	request		= require('request'),
	cheerio		= require('cheerio'),
	url			= 'http://www.ettoday.net/news/0/',
	count		= 0,
	visited		= new Array(NEWS_LIMIT),
	record		= new Array(NEWS_LIMIT);

for (var i = 0; i <= NEWS_LIMIT; i++)
	visited[i] = 0;

var crawler		= function() {
	if (count < NEWS_LIMIT) {
		var id		= START + count,
			tmp		= url + id + '.htm',
			re		= false;
		request.get(tmp, function (e, res, body) {
			record[count]	= {};
			if (res.statusCode == 200) {
				var $			= cheerio.load(body);
				console.log('Reach:', id);
				visited[count]	= 1;
				record[count].valid	= $('article').length;
				if (record[count].valid) {
					var art		= $('article'),
						d		= $('.news-time').text()
									.match(/(\d+)/g),
						r_tag	= $('#news-keywords strong', art),
						r_cont	= $('sectione>p', art),
						tags	= [],
						date	= '',
						cont	= [];
					for (var i = 0; i < r_tag.length; i++)
						tags.push($(r_tag[i]).text());
					// date
					date	= (d.length > 3)?
						(new Date(d[0], d[1] - 1, d[2], d[3], d[4])):
						(new Date(d[0], d[1] - 1, d[2]));
					// content
					for (var i = 0; i < r_cont.length; i++)
						cont[i] = $(r_cont[i]).text();
					// set
					record[count].id		= id;
					record[count].link		= res.request.href;
					record[count].media		= 'ETtoday',
					record[count].author	= '',
					record[count].site		= '',
					record[count].content	= cont.join('\n'),
					record[count].title		= $('header h2', art).text();
					record[count].time		= date.getTime();
					record[count].tag		= tags;
				}
			}
			else {
				record[count].error	= res.statusCode;
			}
			count++;
			crawler();
		});
	}
	else {
		var result = [];
		console.log('Complete Scan.');
		for (var i = 0; i < NEWS_LIMIT; i++) {
			if (visited[i] == 0)
				console.log('News', START + i, 'unload.');
			else if (record[i].valid)
				result.push(record[i]);
		}
		fs.writeFile(FILE, JSON.stringify(result), function (e) {
			if (e) throw e;
		});
	}
}

crawler();