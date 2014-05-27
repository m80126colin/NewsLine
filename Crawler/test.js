var db		= require('./database.js'),
	obj		= {
		title: '外星人回到地球了　ETtoday.net Come home',
		img: 'http://static.ettoday.net/images/0/d2.jpg',
		url: 'http://www.ettoday.net/news/20111003/1.htm',
		tags: [ 'ETtoday', '酷新聞', '見報', '王令麟', 'ETtoday新聞雲' ],
		author: 'ETtoday 新聞雲',
		time: 1317665700000 };

db.insert(obj, 'test');
console.log(obj);