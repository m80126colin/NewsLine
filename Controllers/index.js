var db = require('../Models');

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
		console.log(data);
		res.json(data);
	});
}