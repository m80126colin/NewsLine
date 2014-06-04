var fs			= require('fs');
var mongoClient	= require('mongodb').MongoClient,
	format		= require('util').format;
var url = 'mongodb://news_line:mycourseccspfinalproject1@ds057548.mongolab.com:57548/news_line';

// count tag
var tag = {};
mongoClient.connect(url, function (err, db) {
	if(err) throw err;
	db.collection('ettoday')
	.find()
	.toArray(function (err, data) {
		console.log('read data complete.');
		for (var i = 0; i < data.length; i++) {
			if (i % 1000 == 0) {
				console.log('process', i, 'th data ...');
			}
			var tmp = data[i].tags;
			for (var j = 0; j < tmp.length; j++) {
				if (tag[tmp[j]] == undefined)
					tag[tmp[j]] = {
						'tag':		tmp[j],
						'count':	0,
						'time':		0,
						'weight':	0
					}
				tag[tmp[j]].count++;
				if (tag[tmp[j]].time < data[i].time)
					tag[tmp[j]].time = data[i].time;
			}
		}
		var result = [];
		for (var i in tag) {
			tag[i].weight = tag[i].count * 1000000000 + tag[i].time;
			result.push(tag[i]);
		}
		console.log('process complete!');
		db.collection('tag_list')
		.insert(result, function (err, docs) {
			console.log('done.');
			db.close();
		});
	});
});