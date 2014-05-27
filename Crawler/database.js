var mongoClient	= require('mongodb').MongoClient;
var url = 'mongodb://news_line:mycourseccspfinalproject1@ds057548.mongolab.com:57548/news_line';

//connect db and save
module.exports.insert = function(data, col) {
	mongoClient.connect(url, function (err, db) {
		if(err) throw err;
		var collection = db.collection(col);
		collection.save(data, function (err, docs) {
			console.log(data._id, 'insert success!');
			db.close();
		});
	});
}