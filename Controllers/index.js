var db = require('../Models/db.js');

module.exports.getTag = function(req, res) {
	var tag		= req.param('tag'),
		args	= {
			'title':		tag + ' - NewsLine',
			'news_tag':		tag,
			'news_list':	[]
		};
	console.log(tag);
	db.readByTag(tag, function (data) {
		console.log(data);
		args['news_list'] = data;
		res.render('newsline', args);
	});
}