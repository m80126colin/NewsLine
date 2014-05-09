var db = require('../Models/db.js');

module.exports.getTag = function(req, res) {
	var args = {};
	db.readByTag(req.param('tag'), function (data) {
		args['news_list'] = data;
	});
	res.render('newsline', args);
}