var db = require('../Models');

module.exports.index = function(req, res) {
	var args	= {
		'title':	'NewsLine',
		'topic':	''
	};
	db.readTags('tag_list', function (data) {
		args['topic'] = data;
		res.render('index', args);
	});
}

module.exports.renderTimeLine = function(req, res) {
	var tag		= req.param('tag'),
		args	= {
			'title':	tag + ' - NewsLine',
			'tag':		tag
		};
	res.render('newsline', args);
}

module.exports.getTag = function(req, res) {
	var tag		= req.param('tag');
	console.log(tag);
	db.readByTag(tag, 'ettoday', function (data) {
		res.json(data);
	});
}