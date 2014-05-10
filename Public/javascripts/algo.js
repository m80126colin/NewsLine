// =================================================================
//
//	MyDate Object:
//		judge max days of the specific month, season, and year.
//
// =================================================================
var MyDate = function(msec) {
	var time	= this,
		date	= (msec)? (new Date(msec)): (new Date());
	// basic config
	time.sec	= date.getSeconds();
	time.min	= date.getMinutes();
	time.hr		= date.getHours();
	time.day	= date.getDate();
	time.week	= date.getDay();
	time.month	= date.getMonth() + 1;
	time.year	= date.getYear();
	// time.isleap: leap year or not
	var m = time.month;
	var y = time.year;
	time.isleap	= false;
	if (y % 400 == 0 || (y % 100 && y % 4 == 0))
		time.isleap = true;
	// time.month_maxday: the total days of a month
	time.month_maxday	= 30;
	if (m == 2) {
		time.month_maxday = (time.isleap)? 29: 28;
	}
	else if ((m <= 7 && m % 2) || (m > 7 && m % 2 == 0))
		time.month_maxday = 31;
	// time.season_maxday: the total days of a season
	//		January	- March:		90 or 91
	//		April	- June:			91
	//		July	- September:	92
	//		October	- December:		92
	time.season_maxday = 90 + (m == 2 && time.isleap) + (m > 3) + (m > 6);
	// time.year_maxday
	time.year_maxday = (time.isleap)? 366: 365;
};
var UNIX = new MyDate(0);

// =================================================================
//
//	Unit Object:
//		return the amount of ms of other time units.
//
// =================================================================
var Unit = function() {};
// sec:		1000 ms
Unit.prototype.sec		= function () { return 1000; }
// min:		60 * 1000 ms
Unit.prototype.min		= function () { return 60000; }
// hr:		60 * 60 * 1000 ms
Unit.prototype.hr		= function () { return 3600000; }
// day:		24 * 60 * 60 * 1000 ms
Unit.prototype.day		= function () { return 86400000; }
// week:	7 * 24 * 60 * 60 * 1000 ms
Unit.prototype.week		= function () { return 604800000; }
// month:	[28-31] * 86400 * 1000 ms
Unit.prototype.month	= function (msec) {
	var day = this.day(),
		date = new MyDate(msec),
	return date.month_maxday * day;
}
// season:	[90-92] * 86400 * 1000 ms
Unit.prototype.season	= function (msec) {
	var day = this.day(),
		date = new MyDate(msec),
	return date.season_maxday * day;
}
// year:	[365|366] * 86400 * 1000 ms
Unit.prototype.year		= function (msec) {
	var day = this.day(),
		date = new MyDate(msec),
	return date.year_maxday * day;
}

// =================================================================
//
//	Result Object
//
// =================================================================
var Result = function(n, t, sl) {
	var res = this;
	/* **************************************************** */
	/*														*/
	/*	topic												*/
	/*														*/
	/* **************************************************** */
	res.topic	= t;

	/* **************************************************** */
	/*														*/
	/*	news												*/
	/*														*/
	/* **************************************************** */
	var newsTime = function(newsA, newsB) {
		return newsA.time - newsB.time;
	}
	res.news	= n;
	res.news.sort(newsTime);

	/* **************************************************** */
	/*														*/
	/*	tag													*/
	/*														*/
	/* **************************************************** */
	var tmpTag	= [];
	var revTag	= {};
	for (var i = 0; i < res.news.length; i++) {
		var tmpTags = res.news[i].tag;
		for (var j = 0; j < tmpTags.length; j++) {
			if (revTag[tmpTags[j]] == undefined) {
				tmpTag.push(tmpTags[j]);
				revTag[tmpTags[j]] = 0;
			}
			revTag[tmpTags[j]]++;
		}
	}
	var tagCount = function(tagA, tagB) {
		return -(revTag[tagA] - revTag[tagB]);
	}
	tmpTag.sort(tagCount);
	var tagSelectAlgo = function(tag) {
		// todo
		return tag;
	}
	res.Tag = tagSelectAlgo(tmpTag);

	/* **************************************************** */
	/*														*/
	/*	CALCULATE time block								*/
	/*														*/
	/* **************************************************** */
	var unit = new Unit();
	var time_slice = [
		// (special) 15 min
		function (msec) {
			var slice	= unit.min() * 15;
			return Math.floor(msec / slice);
		},
		// 1 hr
		function (msec) {
			var slice	= unit.hr();
			return Math.floor(msec / slice);
		},
		// 6 hrs
		function (msec) {
			var slice	= unit.hr() * 6;
			return Math.floor(msec / slice);
		},
		// 1 day
		function (msec) {
			var slice	= unit.day();
			return Math.floor(msec / slice);
		},
		// 1 week
		function (msec) {
			var slice	= unit.week();
			msec += UNIX.week * unit.day();
			return Math.floor(msec / slice);
		},
		// 1 month
		function (msec) {
			var date = new MyDate(msec);
			return (date.year - UNIX.year) * 12 + (date.month - 1);
		},
		// 1 season
		function (msec) {
			var date = new MyDate(msec);
			return (date.year - UNIX.year) * 4 + Math.floor((date.month - 1) / 3);
		},
		// 1 year
		function (msec) {
			return date.year - UNIX.year;
		},
		// (special) 2 years
		function (msec) {
			return Math.floor((date.year - UNIX.year) / 2);
		}
	];
	var rev_time_slice = [
		// (special) 15 min
		function (id) {
			var slice	= unit.min() * 15;
			return slice * id;
		},
		// 1 hr
		function (id) {
			var slice	= unit.hr();
			return slice * id;
		},
		// 6 hrs
		function (id) {
			var slice	= unit.hr() * 6;
			return slice * id;
		},
		// 1 day
		function (id) {
			var slice	= unit.day();
			return slice * id;
		},
		// 1 week
		function (id) {
			// todo
			var slice	= unit.week();
			return slice * id - UNIX.week * unit.day();
		},
		// 1 month
		function (id) {
			var y = Math.floor(id / 12) + UNIX.year,
				m = id % 12;
			return Date.UTC(y, m);
		},
		// 1 season
		function (id) {
			var y = Math.floor(id / 4) + UNIX.year,
				m = id % 4;
			return Date.UTC(y, m);
		},
		// 1 year
		function (id) {
			var y = id + UNIX.year;
			return Date.UTC(y, 0);
		},
		// (special) 2 years
		function (id) {
			var y = id * 2 + UNIX.year;
			return Date.UTC(y, 0);
		}
	];
	// setup maximum number of slice
	var slice_limit = 10;
	if (sl) slice_limit = sl;
	/*
		try possible way
	*/
	var count = function(news, slice_func) {
		var info = {};
		info.array	= [];
		info.dist	= {};
		// hash every news in timeline block
		for (var i = 0; i < news.length; i++) {
			var id = slice_func(news[i].time);
			if (info.dist[id] == undefined) {
				info.dist[id] = [];
				info.array.push(id);
			}
			info.dist[id].push(news[i]);
		}
		// sort them with time nondecreasingly
		info.array.sort();
		for (var id in info.dist) {
			info.dist[id].sort(newsTime);
		}
		// count length
		var tmp = [];
		for (var i = 0; i < info.array.length; i++) {
			tmp.push(info.array[i]);
			if (i + 1 < info.array.length &&
				info.array[i + 1] - info.array[i] > 1)
				tmp.push(-1);
		}
		info.array = tmp;
		info.length = info.array.length;
		return info;
	}
	var level = 0;
	for (level = 1; level < time_slice.length; level++) {
		var block_info = count(res.news, time_slice[i]);
		if (block_info.length <= slice_limit)
			break ;
	}
	if (level == time_slice.length)
		throw 'Error: no match time slice!';
	// process block_info into block
	res.block = [];
	for (var i = 0; i < block_info.length; i++) {
		var b = {
			'isdelimeter': false,
			'isopen': false,
			'start': 0,
			'end': 0,
			'level': level,
			'news': [],
			'event': []
		};
		// block with news
		var id = block_info.array[i];
		if (id >= 0) {
			b.start	= rev_time_slice[level](id);
			b.end	= rev_time_slice[level](id);
			b.news	= block_info.dist[id];
		}
		// vacant
		else {
			b.isdelimeter = true;
		}
		res.block.push(b);
	}
}
var result = new Result(news, tag);
