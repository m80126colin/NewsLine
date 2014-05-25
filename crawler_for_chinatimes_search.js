var cheerio = require("cheerio");
var server = require("./Controllers/curl.js");
var request= require("request");
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient, format = require('util').format;

//rewrite p depending on how many page you need
for(var p=0;p<=0;p++){
	
	//rewrite the key word	and tag list
	var url="https://www.google.com.tw/search?q=http://www.chinatimes.com+"
			+"核四"
			+"+中時&es_sm=122&ei=EDWCU4_uFcLZkAX59IDwBg&start="
			+p*10
			+"&sa=N&biw=1242&bih=347";		
			
	request.get(url,function(err,response,body){
		if(!err&&response.statusCode==200){
			var $ = cheerio.load(body);
			//console.log('success');
			//console.log($('li .r').html());
			
			$('li .r').each(function(i,element){
				//console.log('each'+i);
				var title=""+$(this).find('a').attr('href');
				
				
				if(title.indexOf("www.chinatimes.com")>-1){
					//console.log('contain www.chinatimes.com');
					var suburl="https://www.google.com.tw"+title;
				
					//console.log(suburl);
				
					request.get(suburl,function(err,response,body){
								if(!err&&response.statusCode==200){
									var $ = cheerio.load(body);
									
									
									
									var dstr=$('.reporter time').text();
									dstr=dstr.trim();
									//console.log(dstr);
									var year=dstr.substr(0,4);
									var month=dstr.substr(5,2);
									var day=dstr.substr(8,2);
									var hour=dstr.substr(12,2);
									//console.log(hour);
									var min=dstr.substr(15,2);
									//console.log(min);
									var newsdate=new Date(year,month,day,hour,min);
									dstr=newsdate.getTime();
									
									
									
									var content="";
									$('article p').each(function(i,element){
										content=content+$(this).text();
									});
									//console.log(content);
									
									var authorlist=[];
									$('.reporter li').each(function(i,element){
										authorlist.push($(this).find('cite a').text());
									});
									
									//console.log(authorlist[0]);
									
									var taglist=[];
									$('.a_k a').each(function(i,element){
										taglist.push($(this).text());
									});

									var temt=$('.page_index').find('li').last().find('h6 span').text();
									temt=temt.trim();
									taglist.push(temt);
									
									//re wirte for key word
									taglist.push("核四");
									
									//console.log(taglist[0]);
									
									
									
									
									var str={
									_id:dstr+"_chinatimes",
									title:$('article header h1').text(),
									media:"中國時報",
									author:authorlist,
									site:"",
									time:dstr,
									content:content,
									link:url,
									tag:taglist
								};
									
									//console.log(str._id);
									//connect db and save
								MongoClient.connect('mongodb://127.0.0.1:27017/testdb', function(err, db) {
									if(err) throw err;

									var collection = db.collection('test_chinatimes');
									collection.save(str, function(err, docs) {
										console.log(str._id+" insert success: "+str.title);
										db.close();
									});
								  });
								
									
								
								
								}else{
									console.log('page error');
								}
						});
				
					}else{
						console.log('did not contain www.chinatimes.com');
					}
				
				
			});
		
		
		}else{
			console.log("error");
		}
		
		
	});

}