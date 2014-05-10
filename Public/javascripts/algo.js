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
	/*	title												*/
	/*														*/
	/* **************************************************** */
	res.title	= t;

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
	res.tag		= [];
	var revTag	= {};
	for (var i = 0; i < res.news.length; i++) {
		var tmpTags = res.news[i].tag;
		for (var j = 0; j < tmpTags.length; j++) {
			if (revTag[tmpTags[j]] == undefined) {
				res.tag.push(tmpTags[j]);
				revTag[tmpTags[j]] = 0;
			}
			revTag[tmpTags[j]]++;
		}
	}
	var tagCount = function(tagA, tagB) {
		return -(revTag[tagA] - revTag[tagB]);
	}
	res.tag.sort(tagCount);

	/* **************************************************** */
	/*														*/
	/*	CALCULATE time block								*/
	/*														*/
	/* **************************************************** */
	var unit = new Unit();
	var time_slice = [
		// (special) 15 min
		function () { return unit.min() * 15; },
		// 1 hr
		function () { return unit.hr(); },
		// 6 hrs
		function () { return unit.hr() * 6; },
		// 1 day
		function () { return unit.day(); },
		// 1 week
		function () { return unit.week(); },
		// 1 month
		function (msec) { return unit.month(msec); },
		// 1 season
		function (msec) { return unit.season(msec); },
		// 1 year
		function (msec) { return unit.year(msec); },
		// (special) 2 years
		function (msec) { return unit.year(msec) * 2; },
	];
	var slice_limit = 10;
	if (sl) slice_limit = sl;
	/*
		try possible way
	*/
	var count = function(news, time_func) {
		var offset = 0;
		if (time_func(0) == unit.week()) // test week
			offset = 3 * unit.day();
	}
	for (var level = 1; level < time_slice.length; level++) {
		var block_info = count(res.news, time_slice[i]);
		if (block_info.length <= slice_limit)
			break;
	}
	if (level == time_slice.length)
		throw 'Error: no match time slice!';
	//
}
var result = new Result(news, tag);
