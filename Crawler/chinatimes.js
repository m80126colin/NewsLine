var cheerio		= require("cheerio"),
	server		= require("./curl.js"),
	request		= require("request"),
	mongodb		= require('mongodb'),
	MongoClient	= require('mongodb').MongoClient,
	format		= require('util').format;

for (var p=1;p<=1;p++){
	
	request.get("http://www.chinatimes.com/realtimenews/",
				{page:p},
				function(err,response,body){
					if(!err&&response.statusCode==200){
						
						var $ = cheerio.load(body);
						//console.log('success');
						$(".listRight ul li").each(function(i,element){
							
							var url="http://www.chinatimes.com"+$(this).find('h2 a').attr('href');
							//console.log(url);
							
							
							
							request.get(url,function(err,response,body){
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
									
									//console.log(author[0]);
									
									var taglist=[];
									$('.a_k a').each(function(i,element){
										taglist.push($(this).text());
									});

									var temt=$('.page_index').find('li').last().find('h6 span').text();
									temt=temt.trim();
									taglist.push(temt);
									
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
							
							
							
						});
						
						
					}else{
						console.log("error");
					}
					
					
					
					
				}
	);
	
}