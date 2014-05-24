var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

  MongoClient.connect('mongodb://127.0.0.1:27017/testdb', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_Apple');
    
      // Locate all the entries using find
      collection.find({tag:{$in:["finance"]}}).toArray(function(err, results) {
        console.log(results);
        // Let's close the db
        db.close();
      });
    
  })