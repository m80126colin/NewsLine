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
		for (var i = 0; i < data.length; i++) {
			var time		= new Date(data[i].time);
			result.timeline.date.push({
				'startDate':	time,
				'endDate':		time,
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
		console.log(result);
		createStoryJS({
			type:		'timeline',
			width:		'100%',
			height:		'80%',
			lang:		'zh-tw',
			source:		result,
			embed_id:	'timeline'
		});
});