var mongoClient	= require('mongodb').MongoClient,
	format		= require('util').format;
var url = 'mongodb://news_line:mycourseccspfinalproject1@ds057548.mongolab.com:57548/news_line';

module.exports.readTags = function(col, callback) {
	mongoClient.connect(url, function (err, db) {
		if (err) throw err;
		db.collection(col)
		.find()
		.limit(10)
		.sort({ weight: -1 })
		.toArray(function (err, data) {
			console.log(data);
			callback(data);
			db.close();
		});
	});
}

// find tag
module.exports.readByTag = function(tag, col, callback) {
	mongoClient.connect(url, function (err, db) {
		if (err) throw err;
		db.collection(col)
		.find({ 'tags': tag })
		.toArray(function (err, data) {
			console.log(err);
			callback(data);
			db.close();
		});
		
	});
}