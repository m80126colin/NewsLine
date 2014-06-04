var fs			= require('fs');
var mongoClient	= require('mongodb').MongoClient,
	format		= require('util').format;
var url		= 'mongodb://news_line:mycourseccspfinalproject1@ds057548.mongolab.com:57548/news_line',
	page	= 0,
	num		= 10;


var re = function(col) {
	col.find().skip(page * num).limit(num).each(function (e, item) {
		console.log(item.id, item.tags);
	});
}

// count tag
var tag = {};
mongoClient.connect(url, function (err, db) {
	if(err) throw err;
	var col = db.collection('ettoday_copy');
	col.count(function (err, count) {
		console.log(count);
		re(col);
	})
});