var db = require('../Models');

module.exports.getTag = function(req, res) {
	var tag		= req.param('tag'),
		args	= {
			'title':		tag + ' - NewsLine',
			'news_data':	''
		};
	console.log(tag);
	db.readByTag(tag, 'ettoday', function (data) {
		console.log(data);
		args['news_data'] = data;
		res.render('newsline', args);
	});
}