var mongoClient	= require('mongodb').MongoClient,
	format		= require('util').format,
	url			= require('./config').getUrl();

module.exports.getTags = function(col, callback) {
	mongoClient.connect(url, function (err, db) {
		if (err) throw err;
		db.collection(col)
		.find()
		.limit(20)
		.sort({ weight: -1 })
		.toArray(function (err, data) {
			console.log(data);
			callback(data);
			db.close();
		});
	});
}

// find tag
module.exports.getNewsByTag = function(tag, col, callback) {
	mongoClient.connect(url, function (err, db) {
		if (err) throw err;
		db.collection(col)
		.find({ 'tags': tag })
		//.limit(200)
		.toArray(function (err, data) {
			console.log(err);
			callback(data);
			db.close();
		});
		
	});
}