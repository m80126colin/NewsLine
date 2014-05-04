var express = require("express");
var app = express();
app.listen(8800);
var config = {
    "hostname":"localhost",
    "port":27017,
    "db":"newsLine_ver0"
}

var dbURL = "mongodb://" + config.hostname + ":" + config.port + "/" + config.db;
var collections = ["test_news"];
var db = require("mongojs").connect(dbURL, collections);

//create
app.get("/create",function  (req, res) {


			// rewrite here to create some test data
            db.test_news.save({title: "I am example title", author: "Jeremy Lin", time:"00:00:00", content:"hi! hello, fuck you!", link:"http://google.com", tag:["高","富","帥"]}, function(err, saved) {
			//end rewrite
			
			if( err || !saved ) console.log("news not saved");
                else{
                        res.send("news saved");
					}
                  res.end();
            });
});

//read
app.get("/read",function  (req, res) {
    db.test_news.find({}, function(err, news) {
      if( err || !news) console.log("No news found");
      else news.forEach( function(news) {
	  
		//rewrite here to extract data
        res.send(JSON.stringify(news)+"\n");
		//end rewrite
		
      });
      res.end();
    });
});

//update 
//useless now
app.get("/update",function  (req, res) {
    db.users.update({name: "Michael"}, {$set: {name: "James"}}, function(err, updated) {
      if( err || !updated ) console.log("User not updated");
      else {
          res.send("User updated");
          res.end();
      }
    });
});


//remove
//useless now
app.get("/remove",function  (req, res) {

    db.users.remove({gender: "Male"});
    res.send("removed ");
    res.end();

});


