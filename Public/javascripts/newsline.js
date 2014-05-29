// javascript jQuery

$(document).ready(function() {
 
    //執行 getData();
    getData();
     
    //定義 getData Function
    function getData(){
        $.ajax({
        	url:"data.json",
        	success: function(data) {
             
            	//取得 json 取得所有的 dataset
        	    news_set = JSON.parse(data);
            
            	var dataObject = {
            		"timeline": {
            			"headline":"NewsLine Test",
            			"type":"default",
            			"text":"<p>CCSP Project</p>",
            			"asset": {
            				"media":"111242941.gif",
            				"credit":"min",
            				"caption":"2014.05.29"
            			},
            			"date": [],
            			"era": []
            		}
            	};
            	
            	for (var i=0; i<news_set.length; i++) {
            		// Convert time format
            		var time = new Date(news_set[i].time);
            		var year = time.getUTCFullYear(),
            			month = time.getUTCMonth()+1,
            			date = time.getUTCDate(),
            			hr = time.getUTCHours(),
            			minute = time.getUTCMinutes(),
            			sec = time.getUTCSeconds(),
            			msec = time.getUTCMilliseconds();
            		var timeFormat = year+','+month+','+date+','+hr+','+minute+','+sec+','+msec;
            		
            		// add news
            		var _date, _era;
            		_date = {
            			"startDate":timeFormat,
            			"endDate":timeFormat,
            			"headline":news_set[i].title,
            			"text":news_set[i].url,
            			"tag":i%6+1,
            			"classname":news_set[i].id,
            			"asset": {
            				"media":news_set[i].img,
            				"thumbnail":"",
            				"credit":"相關圖片",
            				"caption":news_set[i].author
            			}
            		};
            		_era = {
            			"startDate":timeFormat,
            			"endDate":timeFormat,
            			"headline":"",
            			"tag":"This is _era Optional"
            		};
            		
            		dataObject.timeline.date.push(_date);
            		//dataObject.timeline.era.push(_era);
            	}
            	
            	createStoryJS({
            		type:       'timeline',
            		width:      '100%',
            		height:     '80%',
            		lang:		'zh-tw',
            		source:     dataObject,
            		embed_id:   'main'
            	});
        	}
    	});
	}
});
