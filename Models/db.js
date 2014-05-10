var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient, format = require('util').format;

  

module.exports.readByTag = function(tag, callback) {
	//var data = '';
	//var query = {'tag':tag};
	var str=""+tag;
	// mongodb query news
	MongoClient.connect('mongodb://127.0.0.1:27017/testdb', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_Apple');
    
      // Locate all the entries using find
      collection.find({tag:{$in:[str]}}).toArray(function(err, data) {
        console.log(data);
        		
		callback(data);
        db.close();
      });
    
  });
	
	
	
	
}