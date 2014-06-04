// =================================================================
//
//	MyDate Object:
//		judge max days of the specific month, season, or year.
//
//	Arguments:
//		msec	- UNIX time in UTC+0
//
//	Public Members:
//		sec				- the seconds (0-59),
//							according to your UTC timezone
//		min				- the minutes (0-59),
//							according to your UTC timezone
//		hr				- the hours (0-23),
//							according to your UTC timezone
//		day				- the date (1-31),
//							according to your UTC timezone
//		week			- the day (0-6),
//							according to your UTC timezone
//		month			- the month (1-12),
//							according to your UTC timezone
//		year			- the year (4 digits),
//							according to your UTC timezone
//		isleap			- leap year or not
//		month_maxday	- the number of days of this month
//		season_maxday	- the number of days of this season
//							January	to March	- 90 or 91 days
//							April to June		- 91 days
//							July to September	- 92 days
//							October	to December	- 92 days
//		year_maxday		- the number of days of this year
//							leap year	- 366 days
//							common year	- 365 days
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
	time.season_maxday = 90 + (m == 2 && time.isleap) + (m > 3) + (m > 6);
	// time.year_maxday
	time.year_maxday = (time.isleap)? 366: 365;
};

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
		date = new MyDate(msec);
	return date.month_maxday * day;
}
// season:	[90-92] * 86400 * 1000 ms
Unit.prototype.season	= function (msec) {
	var day = this.day(),
		date = new MyDate(msec);
	return date.season_maxday * day;
}
// year:	[365|366] * 86400 * 1000 ms
Unit.prototype.year		= function (msec) {
	var day = this.day(),
		date = new MyDate(msec);
	return date.year_maxday * day;
}

// =================================================================
//
//	Result Object:
//		Process raw data of news and pass this object to present
//
//	Arguments:
//		n	- raw data of news
//		t	- tag name (topic)
//		sl	- maximum number of slice, default is set to be 10
//
//	Public Members:
//
// =================================================================
var Result = function(n, t, sl) {
	/* **************************************************** */
	/*														*/
	/*	useful private variable								*/
	/*														*/
	/* **************************************************** */
	/*
		alias & declare
	*/
	var res			= this,
		UNIX		= new MyDate(0),
		unit		= new Unit(),
		tag_info	= undefined,
		block_info	= undefined,
		inci_info	= undefined;
	/*
		config
	*/
	var TAG_LIMIT	= 10,
		SLICE_LIMIT = 10;
	// custom slice limit
	if (sl) SLICE_LIMIT = sl;

	/* **************************************************** */
	/*														*/
	/*	time slice:											*/
	/*		15 min (special)								*/
	/*		1 hr											*/
	/*		6 hrs											*/
	/*		1 day											*/
	/*		1 week											*/
	/*		1 month											*/
	/*		1 season (3 months)								*/
	/*		1 year											*/
	/*		2 years (special)								*/
	/*	has:												*/
	/*		look_func	- from time to id					*/
	/*		rev_func	- from id to time					*/
	/*														*/
	/* **************************************************** */
	var time_slice = [
		// (special) 15 min
		{
			look_func: function (msec) {
				var slice = unit.min() * 15;
				return Math.floor(msec / slice);
			},
			rev_func: function (id) {
				var slice = unit.min() * 15;
				return slice * id;
			}
		},
		// 1 hr
		{
			look_func: function (msec) {
				var slice = unit.hr();
				return Math.floor(msec / slice);
			},
			rev_func: function (id) {
				var slice = unit.hr();
				return slice * id;
			}
		},
		// 6 hrs
		{
			look_func: function (msec) {
				var slice = unit.hr() * 6;
				return Math.floor(msec / slice);
			},
			rev_func: function (id) {
				var slice = unit.hr() * 6;
				return slice * id;
			}
		},
		// 1 day
		{
			look_func: function (msec) {
				var slice = unit.day();
				return Math.floor(msec / slice);
			},
			rev_func: function (id) {
				var slice = unit.day();
				return slice * id;
			}
		},
		// 1 week
		{
			look_func: function (msec) {
				var slice = unit.week();
				msec += UNIX.week * unit.day();
				return Math.floor(msec / slice);
			},
			rev_func: function (id) {
				var slice = unit.week();
				return slice * id - UNIX.week * unit.day();
			}
		},
		// 1 month
		{
			look_func: function (msec) {
				var date = new MyDate(msec);
				return (date.year - UNIX.year) * 12 +
							(date.month - 1);
			},
			rev_func: function (id) {
				var y = Math.floor(id / 12) + UNIX.year,
					m = id % 12;
				return Date.UTC(y, m);
			}
		},
		// 1 season
		{
			look_func: function (msec) {
				var date = new MyDate(msec);
				return (date.year - UNIX.year) * 4 +
							Math.floor((date.month - 1) / 3);
			},
			rev_func: function (id) {
				var y = Math.floor(id / 4) + UNIX.year,
					m = id % 4;
				return Date.UTC(y, m);
			}
		},
		// 1 year
		{
			look_func: function (msec) {
				return date.year - UNIX.year;
			},
			rev_func: function (id) {
				var y = id + UNIX.year;
				return Date.UTC(y, 0);
			}
		},
		// 2 years
		{
			look_func: function (msec) {
				return Math.floor((date.year - UNIX.year) / 2);
			},
			rev_func: function (id) {
				var y = id * 2 + UNIX.year;
				return Date.UTC(y, 0);
			}
		}
	];

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
	/*
		sort news with time nondecreasingly
	*/
	var newsTime = function(newsA, newsB) {
		return newsA.time - newsB.time;
	}
	res.news	= n;
	res.news.sort(newsTime);
	for (var i = 0; i < res.news.length; i++)
		if (typeof(res.news[i].time) == 'string') {
			var tmp = res.news[i].time.match(/\d+/g);
			var t = (new Date(
				tmp[0], tmp[1], tmp[2], tmp[3], tmp[4])).getTime();
			if (isNaN(t)) t = (new Date(
				tmp[0], tmp[1], tmp[2])).getTime();
			res.news[i].time = t;
		}

	/* **************************************************** */
	/*														*/
	/*	tag													*/
	/*														*/
	/* **************************************************** */
	/*
		tag preprocess and return message
	*/
	var getTagInfo = function(news) {
		// tag info
		var info = {
			'array':	[],	// save tag information
							//		topic: tag name
							//		first: a news where the tag
							//				appears first time
			'revTag':	{},	// lookup from tag to array's position
			'length':	0	// the number of tags
		};
		info.constructor.prototype.tagCount = function(tagA, tagB) {
			return - (info.revTag[tagA] - info.revTag[tagB]);
		}
		// build reverse key of the tags
		var revTag	= info.revTag;
		for (var i = 0; i < news.length; i++) {
			var tags = news[i].tag;
			for (var j = 0; j < tags.length; j++) {
				if (revTag[tags[j]] == undefined) {
					info.array.push({
						'topic':	tags[j],
						'first':	res.news[i]
					});
					revTag[tags[j]] = 0;
				}
				revTag[tags[j]]++;
			}
		}
		info.array.sort(info.tagCount);
		info.length = info.array.length;
		return info;
	}
	/*
		tag selection algorithm
	*/
	var tagSelectAlgo = function(tag) {
		// todo
		return tag;
	}
	/*
		process tag
	*/
	tag_info	= getTagInfo(res.news);
	res.tag		= tagSelectAlgo(tag_info.array);

	/* **************************************************** */
	/*														*/
	/*	CALCULATE time block								*/
	/*														*/
	/* **************************************************** */
	var getBlockInfo = function(news, slice_func) {
		var info = {
			'array':	[],
			'dist':		{}
		};
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
		var isInt = function isInt(n) {
		   return typeof (n === 'number') && (n % 1 == 0);
		}
		for (var id in info.dist) {
			if (isInt(id))
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
	/*
		try possible way
	*/
	var count = function(news, tsl) {
		var info;
		for (var i = 1; i + 1 < tsl.length; i++) {
			info = getBlockInfo(news, tsl[i].look_func);
			if (info.length <= SLICE_LIMIT) {
				info['level']		= i;
				info['spec_slice']	= tsl[i];
				info['revBlock']	= {};
				for (var j = 0; j < info.length; j++) {
					if (info.array[j] >= 0)
						info.revBlock[info.array[j]] = j;
				}
				return info;
			}
		}
		info.level = tsl.length;
		return info;
	}
	block_info = count(res.news, time_slice);
	if (block_info.level == time_slice.length)
		throw 'Error: no match time slice!';
	// process block_info into block
	res.block = [];
	for (var i = 0; i < block_info.length; i++) {
		var b = {
			'isdelimeter':	false,
			'isopen':		false,
			'start':		0,
			'end':			0,
			'level':		block_info.level,
			'news':			[],
			'incident':		[]
		};
		// block with news
		var id = block_info.array[i];
		if (id >= 0) {
			b.start	= time_slice[b.level].rev_func(id);
			b.end	= time_slice[b.level].rev_func(id + 1);
			b.news	= block_info.dist[id];
		}
		// vacant
		else {
			b.isdelimeter = true;
		}
		res.block.push(b);
	}
	/* **************************************************** */
	/*														*/
	/*	incident											*/
	/*														*/
	/* **************************************************** */
	/*
		incident selection algorithm
	*/
	var incidentSelectAlgo = function(tinfo, binfo) {
		// todo
		var info = [];
		for (var i = 0; i < tinfo.length && i < TAG_LIMIT; i++) {
			var tmp = tinfo.array[i];
			var id = time_slice[b.level].look_func(tmp.first.time);
			var inci = {
				'bid': binfo.revBlock[id],
				'incident': {
					'isbranch': false,
					'time': tmp.first.time,
					'topic': tmp.topic
				}
			};
			if (TAG_LIMIT / 2 <= i)
				inci.incident.isbranch = true;
			info.push(inci);
		}
		return info;
	}
	console.log(block_info.revBlock);
	inci_info = incidentSelectAlgo(tag_info, block_info);
	for (var i = 0; i < inci_info.length; i++) {
		// console.log(inci_info[i].bid, res.block);
		res.block[inci_info[i].bid].incident.push(
			inci_info[i].incident
		);
	}
}
var result = new Result(data, tag);
