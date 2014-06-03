$(function(){
	
	var width=647,
		height=625;
	var color= d3.scale.category20c();
	
	var canvas=d3.select('#bubble').append('svg')
				.attr('width',width)
				.attr('height',height)
				
				
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
						.attr('transform',function(d){return "translate("+d.x+','+d.y+')';});
						
		
		node.append("circle")
			.attr("r",function(d){ return d.r; })
			.attr("fill",function(d){return d.children? "#fff" : color(d.className); })
			.attr("opacity",0.5)
			.attr("stroke", function(d){ return d.children? "#fff" : "#ADADAD"; })
			.attr("stroke-width","1")
			.on("click", function(d){d.children? console.log('base') : window.open("http://google.com.tw","_self");});
		
		node.append("text")
			.attr("dy", ".3em")
			.style("text-anchor", "middle")
			.style('font', function(d){ var str=d.className+"";var len=6-(str.length);return (d.r*len/6)+"px sans-serif" ;})
			.text(function(d){ return d.children ? "" : d.className; })
			.on("click", function(d){d.children? console.log('base') : window.open("http://google.com.tw","_self");});
		
	});
	
		
});