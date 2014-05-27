var cheerio		= require('cheerio'),
	server		= require('./curl.js'),
	request		= require('request'),
	mongodb		= require('mongodb'),
	MongoClient	= require('mongodb').MongoClient,
	format		= require('util').format;

for (var p = 1; p <= 1; p++) {
	request.post(
		'http://www.appledaily.com.tw/appledaily/search', 
		//rewrite
		{
			form: { 
				searchMode:	'',
				searchType:	'text',
				ExtFilter:	'',
				sorttype:	'1',
				keyword:	'自經區',
				rangedate:	'[20130101 TO 20140523999:99]',
				totalpage:	'',
				page:		p
			}
		},
		function (err, response, body) {
			if (!err && response.statusCode == 200) {
				// parse every search page, find url of every new
				var $ = cheerio.load(body);
				$('ol li h2').each(function (i, element) {
					var url = $(this).find('a').attr('href');
					url = '' + 'http://www.appledaily.com.tw' + url;
					var pagenum = $('#pageNumber li span').text();
					// parse every news
					server.download(url, function (data) {
						if (data) {
							var $ = cheerio.load(data);
							var num = i + 1;
							// incomplete
							// var id = '' + pagenum + '-' + num + '自經區';
							var dstr = $('.gggs time').text();
							var year = dstr.substr(0, 4);
							var month = dstr.substr(5, 2);
							var day = dstr.substr(8, 2);
							var hour = dstr.substr(11, 2);
							var min = dstr.substr(14, 2);
							var newsdate = new Date(year, month, day, hour, min);
								dstr = newsdate.getTime();
							//incomplete for author and site
							//var content=$('p#summary').text();
							//var arr=[];
							//arr=content.split("/");
							//console.log(arr[1]);
							//content=arr[0];
							//var author=""+arr[1];
							//arr=author.split("(");
							
							//author=arr[0];
							//var site=arr[1];
							
							//console.log(content+"\n");
							//console.log(author+"\n");
							//console.log(site+"\n");
							var str = {
								_id:dstr+"_apple",
								title:$('hgroup #h1').text(),
								media:"蘋果日報",
								author:"",
								site:"",
								time:dstr,
								content:$('p#summary').text(),
								link:url,
								//rewrite
								tag:["自經區","蘋果",$('#rt_headpic').find('header').attr('class')]
							};
							//console.log(pagenum + "-" + num + "done" +str.title);
							// connect db and save
							MongoClient.connect('mongodb://127.0.0.1:27017/testdb', function (err, db) {
									if(err) throw err;
									var collection = db.collection('test_Apple');
									collection.save(str, function (err, docs) {
										console.log(str._id+"insert success: "+str.title);
										db.close();
									});
							});
						} else {
							console.log('error');
						}
					});
					} else {
						console.log('error');
					}
				});
			});	
		}
	});
}


