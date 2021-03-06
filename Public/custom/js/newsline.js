var tagSelectAlgo = function(data) {
	var tags = {};
	var res = [];
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].tags.length; j++) {
			var t = data[i].tags[j];
			if (tags[t] == undefined)
				tags[t] = { 'tag': t, 'count': 0, 'time': 0 };
			tags[t].count++;
			if (tags[t].count == 1 || tags[t].time > data[i].time)
				tags[t].time = data[i].time;
		}
	}
	for (var tag in tags) {
		res.push(tags[tag]);
	}
	res.sort(function (L, R) { return -(L.count - R.count); });
	var sel = [];
	for (var i = 0; i < res.length; i++)
		if (res[i].count > 1)
			sel.push(res[i]);
	return sel.slice(0, 10);
}

var makeNews = function(data) {
	res = [];
	for (var i = 0; i < data.length; i++) {
		res.push({
			// group: 1,
			start: new Date(data[i].time),
			content: '<a href="' + data[i].url + '">#' + i + '</a> ' + data[i].title,
			type: 'point'
		});
	}
	return res;
}

var makeEvents = function(data) {
	res = [];
	for (var i = 0; i < data.length; i++) {
		res.push({
			group: 1,
			start: new Date(data[i].time),
			content: data[i].tag + '<span style="color:#97B0F8;">(' + data[i].count + ')</span>',
			type: 'box'
		});
	}
	return res;
}

var setTimeLine = function(tag, id) {
	$.get('/api/newsline/' + tag, '', function (data) {
		data.sort(function (L, R) {
			return L.time - R.time;
		});
		var container = document.getElementById(id);
		var groups = new vis.DataSet([
			{id: 1, content: tag}
		]);
		var items = new vis.DataSet();
		items.add(makeNews(data));
		// items.add(makeEvents(tagSelectAlgo(data)));
		var mnDate, mxDate, yr, mon;
		for (var i = 0; i < data.length; i++) {
			if (i) {
				if (mnDate > data[i].time) mnDate = data[i].time;
				if (mxDate < data[i].time) mxDate = data[i].time;
			}
			else mnDate = mxDate = data[i].time;
		}
		mnDate = new Date(mnDate);
		yr = mnDate.getFullYear();
		mon = mnDate.getMonth();
		if (mon - 6 < 0) mnDate = new Date(yr - 1, mon + 6);
		else mnDate = new Date(yr, mon - 6);
		mxDate = new Date(mxDate);
		yr = mxDate.getFullYear();
		mon = mxDate.getMonth();
		if (mon + 6 > 11) mxDate = new Date(yr + 1, mon - 6);
		else mxDate = new Date(yr, mon + 6);
		var options = {
			showCurrentTime: true,
			height: '200px',
			//stack: false,
			max: mxDate,
			min: mnDate,
			zoomMax: 10512000000,
			zoomMin: 36000000
		};
		var timeline = new vis.Timeline(container, null, options);
		// timeline.setGroups(groups);
		timeline.setItems(items);
		/*
		 *
		 */
		 var t = new Date(data[0].time);
		$('#firsttime').text(t.getFullYear() + '年'
			+ (t.getMonth() + 1) + '月' + t.getDate() + '日'
			+ t.getHours() + '時' + t.getMinutes() + '分');
		$('#total').text(data.length);
		var t3 = tagSelectAlgo(data);
		for (var i = 1; i <= 3; i++) {
			$('#tag' + i).text(t3[i].tag + '(' + t3[i].count + ')');
		}
	});
}