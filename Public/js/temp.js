$(document).ready(function() {
	// process timeline format
	var result = {
		'timeline': {
			'headline':	'腥聞',
			'type':		'default',
			'text':		'身體',
			'asset': {
				'media': '',
				'credit': '',
				'caption': ''
			},
			'date': [],
			'era': []
		}
	};
	$.getJSON('data.json', function (data) {
		$.each(data, function (key, val) {
			console.log(key, val);
		});
		for (var i = 0; i < data.length; i++) {
			var time		= new Date(data[i].date);
			var time_str	= [
				time.getFullYear(),
				time.getMonth() + 1,
				time.getDate()
				].join(',');
			result.date.push({
				'startDate':	time_str,
				'endDate':		time_str,
				'headline':		data[i].title,
				'text':			'haha',
				'asset': {
					'media':		data[i].img,
					'thumbnail':	data[i].img,
					'credit':		'',
					'caption':		data[i].id
				}
			});
		}
		createStoryJS({
			type:		'timeline',
			width:		'100%',
			height:		'80%',
			lang:		'zh-tw',
			source:		result,
			embed_id:	'timeline'
		});
	});
});