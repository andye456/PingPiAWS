(function(){
	
	
  //UI configuration
  var itemSize = 10,
    cellSize = itemSize-1,
    width = 800,
    height = itemSize*360+100,
    margin = {top:20,right:20,bottom:20,left:25};

  //formats
  var hourFormat = d3.time.format('%H'),
    minuteFormat = d3.time.format('%M'),
    secondFormat = d3.time.format('%S'),
    dayFormat = d3.time.format('%j'),
    timeFormat = d3.time.format('%Y-%m-%dT%X'),
    monthDayFormat = d3.time.format('%m.%d');

  //data vars for rendering
  var dateExtent = null,
    data = null,
    dayOffset = 0,
    colorCalibration = ['#55ff55','#FEE08B','#FDAE61','#F46D43','#D53E4F','#9E0142', '#ff0000', '#000000'],
    dailyValueExtent = {};

  //axises and scales
  var axisWidth = 0 ,
    axisHeight = itemSize*360,
    xAxisScale = d3.time.scale(),
    xAxis = d3.svg.axis()
      .orient('top')
      .ticks(d3.time.hours,1)
      .tickFormat(hourFormat),
    yAxisScale = d3.scale.linear()
      .range([0,axisHeight])
      .domain([0,60]),
    yAxis = d3.svg.axis()
      .orient('left')
      .ticks(72)
      .tickFormat(d3.format('02d'))
      .scale(yAxisScale);

  initCalibration();

  var svg = d3.select('[role="heatmap"]');
  var heatmap = svg
    .attr('width',width)
    .attr('height',height)
    .append('g')
    .attr('width',width-margin.left-margin.right)
    .attr('height',height-margin.top-margin.bottom)
    .attr('transform','translate('+margin.left+','+margin.top+')');
  var rect = null;
  
  var datepicker=$('.datepicker').datepicker();
  
  datepicker.on('changeDate', function(e) {
	day=d3.select("#selectdate").node().value;
	//day = e.date.valueOf();
	console.log("day = "+day);
	var start=day+'T00:00:00';
	var end  =day+'T23:59:59';
	// Removes grid when date is changed or re-selected
	heatmap.selectAll('rect').remove();
  
	d3.json('http://35.176.56.125:8090/api/pingdata?start='+start+'&end='+end,function(err,data) {

		data.forEach(function(valueObj){
		  valueObj['date'] = timeFormat.parse(valueObj['timestamp']);
		  var day = valueObj['day'] = monthDayFormat(valueObj['date']);
		  var dayData = dailyValueExtent[day] = (dailyValueExtent[day] || [1000,-1]);
		  //var pmValue = valueObj['value']['PM2.5'];
		  var pmValue = valueObj['time'];
		  dayData[0] = d3.min([dayData[0],pmValue]);
		  dayData[1] = d3.max([dayData[1],pmValue]);
		});

		dateExtent = d3.extent(data,function(d){
		  return d.date;
		});


		axisWidth = itemSize*24;

		//render axises
		/*
		xAxis.scale(xAxisScale.range([0,axisWidth]).domain([dateExtent[0],dateExtent[1]]));  
		svg.append('g')
		  .attr('transform','translate('+margin.left+','+margin.top+')')
		  .attr('class','x axis')
		  .call(xAxis)
		.append('text')
		  .text('date')
		  .attr('transform','translate('+axisWidth+',-10)');
		*/
		svg.append('g')
		  .attr('transform','translate('+margin.left+','+margin.top+')')
		  .attr('class','y axis')
		  .call(yAxis)
		.append('text')
		  .text('minutes')
		  .attr('transform','translate(-20,'+axisHeight+') rotate(-90)')
		  ;
		
		//render heatmap rects
		//dayOffset = dayFormat(dateExtent[0]);
		dayOffset = hourFormat(dateExtent[0]);



		rect = heatmap.selectAll('rect')
		  .data(data)
		  .enter().append('rect')
		  .attr('width',cellSize)
		  .attr('height',cellSize)
		  .attr('x',function(d){
			return itemSize*(hourFormat(d.date)-dayOffset);
		  })
		  .attr('y',function(d){            
			secondsPastHour=minuteFormat(d.date)*60;
			seconds=secondFormat(d.date);
			totalSeconds=parseInt(secondsPastHour)+parseInt(seconds);
			return Math.floor(totalSeconds/10)*itemSize;
		  })
		  .attr('fill','#55ff55')
		  .on('click', function(d) {
			$('#dialog').dialog('open');
			$('#dialog').text(d.date+" "+d.time);
		  })
		  ;

		rect.filter(function(d){ return d['time']>0;})
		  .append('title')
		  .text(function(d){
			return timeFormat(d.date)+' '+d['time']+" "+d['outcome'];
		  });

		renderColor();
	});
  });

  function initCalibration(){
	 
    d3.select('[role="calibration"] [role="example"]').select('svg')
      .selectAll('rect').data(colorCalibration).enter()
    .append('rect')
      .attr('width',cellSize)
      .attr('height',cellSize)
      .attr('x',function(d,i){
        return i*20;
      })
      .attr('fill',function(d){
        return d;
      });

    //bind click event
    d3.selectAll('[role="calibration"] [name="displayType"]').on('click',function(){
      renderColor();
    });
  }

  function renderColor(){

    rect
      .filter(function(d){
        return (d['time']>=0);
      })
      .transition()
      .delay(function(d){      
        return (dayFormat(d.date)-dayOffset)*15;
      })
      .duration(500)
      .attrTween('fill',function(d,i,a){
        //choose color dynamicly      
        var colorIndex = d3.scale.quantize()
          .range([0,1,2,3,4,5,6,7])
          .domain([0,1000]);

        return d3.interpolate(a,colorCalibration[colorIndex(d['time'])]);
      });
  }
  
  //extend frame height in `http://bl.ocks.org/`
  d3.select(self.frameElement).style("height", "600px");  
})();
