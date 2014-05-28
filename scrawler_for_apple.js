var cheerio = require("cheerio");
var server = require("./Controllers/curl.js");
var request= require("request");
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient, format = require('util').format;



//post every search page
for(var p=1;p<=10;p++){
	request.post(
				'http://www.appledaily.com.tw/appledaily/search', 
				{form: { 
						searchMode:"",
						searchType:"text",
						ExtFilter:"",
						sorttype:"1",
						keyword:"學運",
						rangedate:"[20130101 TO 20140510999:99]",
						totalpage:"3735",
						page:p
						}
				},
				function(err,response,body){
					if(!err&&response.statusCode==200){
						

						//parse every search page, find url of every new
						var $ = cheerio.load(body);
						$("ol li h2").each(function(i,element){
							var url=$(this).find('a').attr('href');
							url=""+"http://www.appledaily.com.tw"+url;
							var pagenum=$('#pageNumber li span').text();
							
							
							//pase every news
							server.download(url, function(data){
								if(data){
								var $=cheerio.load(data);
								
								var num=i+1;
								var id="" + pagenum + "-" + num;
								
								var str={
									_id:id,
									title:$('hgroup #h1').text(),
									media:"蘋果日報",
									author:"作者",
									site:"地點",
									time:$('.gggs time').text(),
									content:$('p#summary').text(),
									link:url,
									tag:["學運","蘋果",$('#rt_headpic').find('header').attr('class')]
								};
						
								
								//console.log(pagenum + "-" + num + "done" +str.title);
								
								//connect db and save
								MongoClient.connect('mongodb://127.0.0.1:27017/testdb', function(err, db) {
									if(err) throw err;

									var collection = db.collection('test_Apple');
									collection.save(str, function(err, docs) {
										console.log(str._id+"insert success: "+str.title);
										db.close();
									});
								  });
								
								
								}else{
								console.log("error");
								}
							});
							
						});
						
						
					}
				}
	);

}


