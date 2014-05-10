var MongoClient = require('mongodb').MongoClient, format = require('util').format;

  MongoClient.connect('mongodb://127.0.0.1:27017/testdb', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_222222');
    collection.save({_id:1,a:"hihi"}, function(err, docs) {
		db.close();
    });
  });