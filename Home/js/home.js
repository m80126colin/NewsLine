$(function(){
	
	var width=647,
		height=625;
	var color= d3.scale.category10();
	
	var canvas=d3.select('#bubble').append('svg')
				.attr('width',width)
				.attr('height',600)
				.style('margin-left','20px');
	
	var tooltip = d3.select("body")
				.append("div")
				.attr('class','fuck')
				.style("position", "absolute")
				.style('height','0px')
				.style("z-index", "10")
				.style("visibility", "hidden")
				.text("a simple tooltip");
	
				
	var pack=d3.layout.pack()
				.sort(null)
				.size([width,height])
				.padding(5);
		
	
	d3.json('./test.json',function(data){
		//console.log(JSON.stringify(data));
		
		var jsonobj=[];
		for(var i=0;i<data.length;i++){
			jsonobj.push({className:data[i].tag,value:data[i].weight});
		}
		
		var parsedata={"name":"taglist","children":jsonobj};
		
		var nodes=pack.nodes(parsedata);
		
		var node=canvas.selectAll('.node')
						.data(nodes)
						.enter()
						.append('g')
						.attr('class','node')
						.attr('transform',function(d){return "translate("+d.x+','+(d.y-50)+')';});
						
		
		node.append("circle")
			.attr("r",function(d){ return d.r; })
			.attr("fill",function(d){return d.children? "#fff" : color(d.className); })
			.attr("opacity",0.55)
			.attr("stroke", function(d){ return d.children? "#fff" : "#ADADAD"; })
			.attr("stroke-width","0")
			.style('cursor','pointer')
			.on("click", function(d){return d.children? console.log('base') : window.open("http://google.com.tw","_self");});
			//.on("mouseover", function(){return tooltip.style("visibility", "visible");})
			//.on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
			//.on("mouseout", function(){return tooltip.style("visibility", "hidden");});
			
			
		node.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.style('cursor','pointer')
			.style('font', function(d){ var str=d.className+"";var len=6-(str.length);return (d.r*len/6)+"px 微軟雅黑體,Microsoft YaHei,微軟正黑體,Microsoft JhengHei,Comic Sans MS,sans-serif" ;})
			.style('font-weight',function(d){var str=d.className+"";var len=6-(str.length); return (d.r*len/6)<=40? "bold" : "normal"; })
			.text(function(d){ return d.children ? "" : d.className; })
			.on("click", function(d){d.children? console.log('base') : window.open("http://google.com.tw","_self");});
		
		
	});
	
	var backcircleDelete = setTimeout(function(){$('g:first').remove();},100);
	
	var hover=setTimeout(function(){
		$('.node').hover(
			function(){
				var $circle=$(this).find('circle');
				var r=parseFloat($circle.attr('r'));
				$circle.attr('r',r*1.1);
				$circle.attr('opacity',0.8);
				var $text=$(this).find('text');
				var s=parseFloat($text.css('font-size'));
				//alert(s);
				$text.css('font-size',s*1.1*1.1);
			},
			function(){
				var $circle=$(this).find('circle');
				var r=parseFloat($circle.attr('r'));
				$circle.attr('r',r/1.1);
				$circle.attr('opacity',0.55);
				var $text=$(this).find('text');
				var s=parseFloat($text.css('font-size'));
				$text.css('font-size',s);
			}
		);
	},200);
	
	
	
	
});