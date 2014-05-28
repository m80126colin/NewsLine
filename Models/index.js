var mongoClient	= require('mongodb').MongoClient,
	format		= require('util').format;
var url = 'mongodb://news_line:mycourseccspfinalproject1@ds057548.mongolab.com:57548/news_line';

// find tag
module.exports.readByTag = function(tag, col, callback) {
	mongoClient.connect(url, function (err, db) {
		if(err) throw err;
		db.collection(col)
		.find({
			'tags': tag
		})
		.toArray(function (err, data) {
			callback(data);
			db.close();
		});
	});
}