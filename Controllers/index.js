var db = require('../Models');

module.exports.renderIndex = function(req, res) {
	var args	= {
		'title':	'NewsLine'
	};
	res.render('index', args);
}

module.exports.renderTimeLine = function(req, res) {
	var tag		= req.param('tag'),
		args	= {
			'title':	tag + ' - NewsLine',
			'tag':		tag
		};
	res.render('newsline', args);
}

module.exports.getNewsByTag = function(req, res) {
	var tag		= req.param('tag');
	console.log(tag);
	db.getNewsByTag(tag, 'ettoday', function (data) {
		res.json(data);
	});
}

module.exports.getTags = function(req, res) {
	db.getTags('tag_list', function (data) {
		for (var i in data) {
			data[i].weight = Math.floor(data[i].weight / 100000000) - 20000;
		}
		res.json(data);
	});
}