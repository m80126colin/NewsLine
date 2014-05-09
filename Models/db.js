var mongojs = require('mongojs');

module.exports.readByTag = function(tag, callback) {
	var data = '';
	var query = { 'tag': tag };
	// mongodb query news
	callback(data);
}