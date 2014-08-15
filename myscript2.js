//start off hiding divs that are empty
$(document).ready( function(){
	   $('div.tabs').hide();
	   $('#subheadlc').hide();
	   $('#subheadcmd').hide();
	   $('#subheadtab').hide();
	})


//use this button to call the light curve making function
$(document).ready( function() {
	$('button.lc').click( function(){
	     //fetch the user's input
	     var target = $('select option:selected').text();
	     var ischeck = $('input[class="filtercheck"]').is(':checked');
	     var jdstart = $('#jdstart').val();
	     var jdend = $('#jdend').val();
	     var jdallcheck = $('input[id="JDall"]').is(':checked');
             //var jdstart=null, jdend=null, jdallcheck=true;
	     //clear out the error message space and the light curve spaces
	     $('span').empty();
	     $("div.lc").empty();
	     $("h3.lc").empty();
	     //validate the user's input
	     if (((target==="") || (ischeck===false) ) || (target==="Choose...") ||((jdstart==="" || jdend==="") && jdallcheck===false)) {
		$('span').empty();
		$('span').append('<p>please complete the form</p>');
	     }
	     else if (jdstart!="" && jdend!="" && jdallcheck){
		$('span').empty();
		$('span').append('<p>please choose a date range OR the whole data set<p>');
	     }
	     else if (jdstart!="" && jdend!="" && jdstart >= jdend){
		$('span').empty();
	     	$('span').append('<p>please ensure the start date is earlier than the end date</p>');
	     }
	     //if everything checks out, create the plots
	     //one function call per clicked box
	     else{
		$("h3.lc").append(target+" light curves");
		if ($('#checkB').is(":checked"))
		{
			var color="B";
			makeplot(target, color, jdstart, jdend, jdallcheck);
		}
		if ($('#checkV').is(":checked"))
		{
			var color="V";
			makeplot(target, color, jdstart, jdend, jdallcheck);
		}
		if ($('#checkR').is(":checked"))
		{
			var color="R";
			makeplot(target, color, jdstart, jdend, jdallcheck);
		}
		if ($('#checkJ').is(":checked"))
		{
			var color="J";
			makeplot(target, color, jdstart, jdend, jdallcheck);
		}
		if ($('#checkK').is(":checked"))
		{
			var color="K";
			makeplot(target, color, jdstart, jdend, jdallcheck);
		}
	     }
		
	} );
});
//use this button to make CMD
$(document).ready( function () {
	$("button.cmd").click (function(){
	     //fetch the user's input
	     var target = $('select option:selected').text();
	     var jdstart = $('#jdstart').val();
	     var jdend = $('#jdend').val();
	     var jdallcheck = $('input[id="JDall"]').is(':checked');
	     //var jdstart=null, jdend=null, jdallcheck=true;
	     //clear out any old plots, headings, error messages
	     $("div.cmd").empty();
	     $("h3.cmd").empty();
	     $('span').empty();
	     //validate the user's data
	     if (((target==="Choose...") ) || ((jdstart==="" || jdend==="") && jdallcheck===false)){
		$('span').empty();
		$('span').append('<p>please complete the form</p>');
	     }// end if
	     else if (jdstart!="" && jdend!="" && jdallcheck){
		$('span').empty();
		$('span').append('<p>please choose a date range OR the whole data set<p>');
	     }
	     else if (jdstart!="" && jdend!="" && jdstart >= jdend){
		$('span').empty();
	     	$('span').append('<p>please ensure the start date is earlier than the end date</p>');
	     }
	     //if everything is okay, then make a plot. just one call
	     else{
	     	$("h3.cmd").append(target+" Color Magnitude Diagram");
	     	cmdplot(target, jdstart, jdend, jdallcheck);
	     }	
	});
})
//use this button to make text tables
$(document).ready( function () {
	$("button.txtab").click(function () {
	     //clear out any old tables and error messages
	     $('#tabletitle').empty();
	     $('table').empty();
             $('div.text').empty()
	     $('span').empty();
	     //read in user input
	     var target = $('select option:selected').text();
	     var jdstart = $('#jdstart').val();
	     //var jdstart = null;
	     //var jdend = null;
	     var jdend = $('#jdend').val();
	     var ischeck = $('input[class="filtercheck"]').is(':checked');
	     var bcheck=$('input[id="checkB"]').is(':checked'), vcheck=$('input[id="checkV"]').is(':checked');
	     var rcheck=$('input[id="checkR"]').is(':checked'), jcheck=$('input[id="checkJ"]').is(':checked');
	     var kcheck=$('input[id="checkK"]').is(':checked'); 
	     var jdallcheck = $('input[id="JDall"]').is(':checked');
	     var formatcheck = $('input[type="radio"]').is(':checked');
	     //var jdallcheck = true;
	     //validate the user's input
	     if (((target==="") || (ischeck===false) ) || (target==="Choose...") || ((jdstart==="" || jdend==="") && jdallcheck===false) || formatcheck===false){
		$('span').empty();
		$('span').append('<p>please complete the form</p>');
	     }// end if
	     else if (jdstart!="" && jdend!="" && jdallcheck){
		$('span').empty();
		$('span').append('<p>please choose a date range OR the whole data set<p>');
	     }
	     else if (jdstart!="" && jdend!="" && jdstart >= jdend){
		$('span').empty();
	     	$('span').append('<p>please ensure the start date is earlier than the end date</p>');
	     }
	     //if everything is okay, then make the table
	     else {
		var format = $('input[type="radio"]:checked').val();
		//console.log(format);
	     	maketable(target, jdstart, jdend, jdallcheck, bcheck, vcheck, rcheck, jcheck, kcheck, format);
	     }//end else
	}) // end click
})

/*this function makes the data table requested by the user when 'view table' is clicked
it makes a json call over to yale's server to get requested data set, and then prints it as an html table
input: parameters are all passed from the html form. target: blazar name; jdstart: beginning date for data
	jdend: end date for data; whole: bool, yes-give me entire data set, no-use the specified date range
	from jdstart-jdend; bbool, vbool, rbool, jbool, kbool all boolians, use that filter's data or not
output: an html table, with observation date, filtermagnitude, and filter error for all selected filters
	if an observation for a filter is missing, it is printed as 'null'
*/
function maketable(target, jdstart, jdend, whole, bbool, vbool, rbool, jbool, kbool, format){
	$.getJSON("tables/"+target+".json", function(data){
        //we're ready to show the div that holds the tables now
		$('div.tabs').show();
		$('#subheadtab').show()
		$("body").animate({scrollTop: $('h3#tabletitle').offset().top}, 1000);
	//print the head of the table
	//this is not efficent, but whatever
	//alert(data.time[0]);
		$('#tabletitle').append(target+" Photometry");
		if (whole)
		     {
			jdend=new Date().getTime()/86400000 + 2440587.5;
			jdstart=0;
		     }
		if (format==="html"){
			var addtohead = "<thead><tr><th>Obs Date (JD)</th>";
		     if (bbool){
			addtohead += "<th>Bmag</th><th>Berr</th>";
		     }
		     if (vbool){
			addtohead += "<th>Vmag</th><th>Verr</th>";
		     }
		     if (rbool){
			addtohead += "<th>Rmag</th><th>Rerr</th>";
		     }
		     if (jbool){
			addtohead += "<th>Jmag</th><th>Jerr</th>";}
		     if (kbool){
			addtohead += "<th>Kmag</th><th>Kerr</th>";
		     }
		     addtohead += "</tr></thead>";
		     $('table').append(addtohead);
			//console.log(addtohead);
		     //print the data
		     //this is not a very efficent way of printing the data, but whatever
		     for (i=0;i<data.time.length;i++){
			var addtotab = "<tr>";
			if ((data.time[i] > jdstart) && (data.time[i] <= jdend)){
				addtotab +="<td>"+data.time[i]+"</td>";
				if (bbool)
				{
					addtotab += '<td>'+data.Bmag[i]+'</td><td>'+data.Berr[i]+'</td>';
				}
				if (vbool)
				{
					addtotab += '<td>'+data.Vmag[i]+'</td><td>'+data.Verr[i]+'</td>';
				}
				if (rbool)
				{
				addtotab += '<td>'+data.Rmag[i]+'</td><td>'+data.Rerr[i]+'</td>';
				}
				if (jbool)
				{
					addtotab += '<td>'+data.Jmag[i]+'</td><td>'+data.Jerr[i]+'</td>';
				}
				if (kbool)
				{
					addtotab += '<td>'+data.Kmag[i]+'</td><td>'+data.Kerr[i]+'</td>';
				}
				//alert(addtotab);
				addtotab += "</tr>"
				$('table').append(addtotab);
			}// close if
		     }//close for
	     }//close if html
	     if (format==="csv"){
		     var addtohead = "#Obs Date (JD)";
		     if (bbool){
			addtohead += ",Bmag,Berr";
		     }
		     if (vbool){
			addtohead += ",Vmag,Verr";
		     }
		     if (rbool){
			addtohead += ",Rmag,Rerr";
		     }
		     if (jbool){
			addtohead += ",Jmag,Jerr";
		     }
		     if (kbool){
			addtohead += ",Kmag,Kerr";
		     }
		     addtohead += "<br>";
		     $('div.text').append(addtohead);
		     //print the data
		     //this is not a very efficent way of printing the data, but whatever
		     for (i=0;i<data.time.length;i++){
			if ((data.time[i] > jdstart) && (data.time[i] <= jdend)){
				var addtotab = data.time[i];
				if (bbool)
				{
					addtotab += ','+data.Bmag[i]+','+data.Berr[i];
				}
				if (vbool)
				{
					addtotab += ','+data.Vmag[i]+','+data.Verr[i];
				}
				if (rbool)
				{
					addtotab += ','+data.Rmag[i]+','+data.Rerr[i];
				}
				if (jbool)
				{
					addtotab += ','+data.Jmag[i]+','+data.Jerr[i];
				}
				if (kbool)
				{
					addtotab += ','+data.Kmag[i]+','+data.Kerr[i];
				}
				//alert(addtotab);
				addtotab += "<br>"
				$('div.text').append(addtotab);
			}// close if
		     }//close for
	     }//close if csv
	})//close json
}
/*this function makes light curves requested by the user when 'view light curves' is clicked on html page
it makes a json call over to yale's server to get requested data set, and then plots it using d3 library
input: parameters are all passed from the html form. target: blazar name; jdstart: beginning date for data
	jdend: end date for data; jdcheckall: bool, yes-give me entire data set, no-use the specified date range
	from jdstart-jdend
output: an svg element that is appended to the form page. the svg contains the entire plot, and interactive abilities
*/
function makeplot(target, color, jdstart, jdend, jdcheckall){
	d3.json("tables/"+target+".json",function(data){
		$('#subheadlc').show();
		$("body").animate({scrollTop: $('h3.lc').offset().top}, 1000);
		//set the data
		if (color==="B"){
			//var xdom=d3.extent(data.Btime);
			var ydom=d3.extent(data.Bmag);
			var xdat=data.Btime;
			var ydat=data.Bmag;
			var timeB = d3.zip(xdat,ydat);
		}
		if (color==="V"){
			//var xdom=d3.extent(data.Vtime);
			var ydom=d3.extent(data.Vmag);
			var xdat=data.Vtime;
			var ydat=data.Vmag;
			var timeB = d3.zip(xdat,ydat);
		}
		if (color==="R"){
			//var xdom=d3.extent(data.Rtime);
			var ydom=d3.extent(data.Rmag);
			var xdat=data.Rtime;
			var ydat=data.Rmag;
			var timeB = d3.zip(xdat,ydat);
		}
		if (color==="J"){
			//var xdom=d3.extent(data.Jtime);
			var ydom=d3.extent(data.Jmag);
			var xdat=data.Jtime;
			var ydat=data.Jmag;
			var timeB = d3.zip(xdat,ydat);
		}
		if (color==="K"){
			//var xdom=d3.extent(data.Ktime);
			var ydom=d3.extent(data.Kmag);
			var xdat=data.Ktime;
			var ydat=data.Kmag;
			var timeB = d3.zip(xdat,ydat);
		}
		if (jdcheckall){
			//now all filter's light curves have same x scale
			var xmin=d3.min([d3.min(data.Btime),d3.min(data.Vtime),d3.min(data.Rtime),d3.min(data.Jtime),d3.min(data.Ktime)]);
			var xmax=d3.max([d3.max(data.Btime),d3.max(data.Vtime),d3.max(data.Rtime),d3.max(data.Jtime),d3.max(data.Ktime)]);
			var xdom=[xmin,xmax];
		}
		else {
			var xmin = jdstart;
			var xmax = jdend;
			var xdom=[xmin,xmax];
		}
		//find the earliest date and latest date for which 
		//there is data, use to set domain
		//alert(jdcheckall+" "+xdom+" "+jdstart+" "+jdend);		
		//create our canvas
		var margin = {top: 20, right: 20, bottom:40, left:40}
		var width = 700 - margin.left - margin.right;
		var height = 400 - margin.top - margin.bottom;

		var x = d3.scale.linear()
			.domain(xdom)
			.range([0,width]);
		
		var y = d3.scale.linear()
			.domain(ydom)
			.range([0,height]);

		var xAxis = d3.svg.axis()
			.ticks(7)
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
		
		var zoom = d3.behavior.zoom()
		    .x(x)
		    .y(y)
 		   .scaleExtent([1, 10])
		    .on("zoom", zoomed);

		var brush = d3.svg.brush()
		    .x(x)
		    .y(y)
		    .on("brushend", brushend)

		//there is a div set aside for lc
		var svg = d3.select("div.lc")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		   .append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		//rect for catching clicks w/ mouse
		svg.append("rect")
    		   .attr("class", "overlay")
		   .attr("fill","none")
    		   .attr("width", width+5)
    		   .attr("height", height+5);

		//this is the clip path
		//stuff thats tied to this clip path
		//also has these values.  		
		svg.append("defs").append("clipPath")
		    .attr("id", "clip")
		  .append("rect")
		    .attr("x",-2.5)
		    .attr("y",-2.5)
		    .attr("width", width+5)
		    .attr("height", height+5);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
		        .attr("class", "label")
		        .attr("x", width)
  		        .attr("y", -6)
      			.style("text-anchor", "end")
      			.text("Julian Date");
		
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		   .append("text")
			.attr("class", "label")
			.attr("y", 6)
			.attr("dy", ".71em")
			.attr("transform", "rotate(-90)")
			.style("text-anchor", "end")
     			.text(color+" Magnitude");

		//create the data points as circles in a group
		//tie the clip path to the group. 
		//Points outside domain are not rendered
		var circs = svg.append("g")
			.attr("id", "circs")
			.attr("clip-path","url(#clip)")
			.selectAll(".dot")
			.data(timeB)
			.enter().append("circle")
			.attr("class", "dot")
			.attr("fill","red")
			.attr("r",2.5)
			.attr("cx",function(d){return x(d[0])})
			.attr("cy",function(d){return y(d[1])});

		//these buttons activate different behaviors of the plots
		//restore the plot to initial view
		get_button = d3.select(".clear-button");
		    clear_button = svg.append('text')
		      .attr("y", -10)
		      .attr("x", 10)
		      .attr("class", "clear-button")
		      .attr("id","lc-reset-button")
		      .attr("fill","grey")
		      .text("reset");
		
		//enable mouse zoom + panning
		get_button2 = d3.select(".clear-button");
 		   clear_button2 = svg.append('text')
 		     .attr("y", -10)
 		     .attr("x", 55)
 		     .attr("class", "clear-button")
 		     .attr("id", "lc-zoom-button")
 		     .attr("fill","grey")
 		     .text("zoom");
	
		//enable box zoom
		get_button3 = d3.select(".clear-button");
 		   clear_button3 = svg.append('text')
 		     .attr("y", -10)
 		     .attr("x", 105)
 		     .attr("class", "clear-button")
 		     .attr("id", "lc-boxzoom-button")
 		     .attr("fill","grey")
 		     .text("box-zoom");

		//these variables help keep track of when the buttons are clicked
		//helps us determine when to toggle behaviors on and off
		var zoomclick=0;
		
		var boxzoomclick=0;

		//attach functions whic actually enable functions to their buttons
		//they are now methods of the buttons
		//reset, togglezoom, toggleboxzoom described below in detail
		clear_button.on('click', reset);

		clear_button2.on('click',togglezoom);

		clear_button3.on('click',toggleboxzoom);

		function togglezoom() {
			//disable the box zoom so they dont interfear
			//alert(zoomclick);
			svg.selectAll("g.brush").remove();
			svg.select('#lc-boxzoom-button').attr("fill","grey");
			svg.select('#lc-multi-boxzoom-button').attr("fill","grey");
			if (boxzoomclick%2!=0)
				boxzoomclick+=1;
			//redefine the behavior and rebind.
			//allows us to turn zoom on and off
			if (zoomclick%2===0){
				zoom = d3.behavior.zoom()
		    			.x(x)
		    			.y(y)
 		  			.scaleExtent([1, 10])
		    			.on("zoom", zoomed);
				svg.call(zoom);
				d3.select(this).attr("fill","black");
			}
			else{
				svg.on('.zoom',null);
				d3.select(this).attr("fill","grey");
			}
			zoomclick += 1;
		}

		//restore the plot to its initial view
		function reset() {
		  d3.transition().duration(500).tween("zoom", function() {
		    var ix = d3.interpolate(x.domain(), [xmin, xmax]),
		        iy = d3.interpolate(y.domain(), [d3.min(ydat), d3.max(ydat)]);
		    return function(t) {
		      zoom.x(x.domain(ix(t))).y(y.domain(iy(t)));
		      zoomed();
		    };
		  });
		}
		
		//toggle the box zoom function on/off. Uses brush behavior
		//grabs domain of brush, uses interpolate to change axis to new domain
		function toggleboxzoom() {
			//turn off mouse zoom, and remove any existing brush
			svg.on('.zoom',null);
			svg.selectAll("g.brush").remove()
			svg.select('#lc-zoom-button').attr("fill","grey");
			svg.select('#lc-multi-boxzoom-button').attr("fill","grey");
			if (zoomclick%2!=0)
				zoomclick+=1;
			if (boxzoomclick%2===0){
				svg.append("g")
    				   .attr("class", "brush")
    				   .call(brush);
				d3.select(this).attr("fill","black");
			}
			else{
				svg.selectAll("g.brush").remove();
				d3.select(this).attr("fill","grey");
			}
			boxzoomclick += 1;
		}

		//this actually changes the scale and domain of view, and zooms
		function brushend() {
  		   var extent = brush.extent();
		   console.log(extent);
  		   if (extent[1][0]-extent[0][0] != 0 && extent[0][1]-extent[1][1]!=0){
     			x.domain([extent[0][0],extent[1][0]]);
     			y.domain([extent[0][1],extent[1][1]]);
     			//zoomed();
     			svg.selectAll('.dot')
				.data(timeB)
				.transition().duration(500)
				.attr("cx",function(d){return x(d[0])})
				.attr("cy",function(d){return y(d[1])});
     			svg.select(".brush").call(brush.clear());
     			circs.classed("selected", false);
     			svg.transition().duration(500).select(".x.axis").call(xAxis);
     			svg.transition().duration(500).select(".y.axis").call(yAxis);
  		   }
		}

		//does actual zooming for mouse zoom
		//redraw points and rescale axis after recieving mouse input
		function zoomed() {
			svg.selectAll(".dot")
			   .attr("cx",function(d){return x(d[0])})
			   .attr("cy",function(d){return y(d[1])});
			svg.select(".x.axis").call(xAxis);
    			svg.select(".y.axis").call(yAxis);
		}
	});
}
/*this function makes color magnitude diagram requested by the user when'view color magnitude diagram'
button is clicked on html page. it makes a json call over to yale's server to get requested data set
and then plots it using d3 library
input: parameters are all passed from the html form. target: blazar name; jdstart: beginning date for data
	jdend: end date for data; jdcheckall: bool, yes-give me entire data set, no-use the specified date range
	from jdstart-jdend
output: an svg element that is appended to the form page. the svg contains the entire plot, and interactive abilities
*/
function cmdplot(target, jdstart, jdend, jdcheckall){
	d3.json("tables/"+target+".json",function(data){
		$('#subheadcmd').show()
		$("body").animate({scrollTop: $('h3.cmd').offset().top}, 1000);
		var color = [], cred=[], ctime=[], blue = data.Bmag, red = data.Jmag, time= data.time;
		//calculate the b-j color from the smarts data
		if (jdcheckall){
		     for(i = 0; i < blue.length; i++){
			if ((blue[i] != null) && (red[i] != null)){
				color.push(blue[i]-red[i]);
				cred.push(red[i]);
				ctime.push(time[i]);
			}
		     }//end for
		}
		else {
		     for(i = 0; i < blue.length; i++){
			if ((blue[i] != null) && (red[i] != null) && ((time[i] > jdstart) && (time[i] <= jdend))){
				color.push(blue[i]-red[i]);
				cred.push(red[i]);
				ctime.push(time[i]);
			}
		     }//end for
		}

		//gather up the data
		var xdom=d3.extent(cred);
		var ydom=d3.extent(color);
		var brvsr = d3.zip(cred,color,ctime);

		//create our canvas
		var margin = {top: 20, right: 20, bottom:40, left:40}
		var width = 700 - margin.left - margin.right;
		var height = 500 - margin.top - margin.bottom;

		//the color scale will describe what color each point gets
		//given the observation time
		var colorscale = d3.scale.linear().domain(d3.extent(ctime));
		colorscale.domain([0.0,0.2,0.4,0.6,0.8,1.0].map(colorscale.invert));
		colorscale.range(["red","orange","yellow","green","blue","purple"]);

		var x = d3.scale.linear()
			.domain(xdom)
			.range([width,0]);
		
		var y = d3.scale.linear()
			.domain(ydom)
			.range([height,0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");

		//zoom behavior, same as in light curve
		var zoom = d3.behavior.zoom()
		    .x(x)
		    .y(y)
		    .scaleExtent([1, 10])
		    .on("zoom", zoomed);

		var svg = d3.select("div.cmd")
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		   .append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
		//this is the clip path
		//stuff thats tied to this clip path 		
		svg.append("defs").append("clipPath")
		    	.attr("id", "clipcolor")
		    	.append("rect")
			.attr("x",-3)
			.attr("y",-3)
    		    	.attr("width", width+6)
		    	.attr("height", height+6);

		//rect to catch mouse input
		svg.append("rect")
    			.attr("class", "overlay")
    			.attr("width", width)
    			.attr("height", height);

		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)
			.append("text")
		        .attr("class", "label")
		        .attr("x", width)
  		        .attr("y", -6)
      			.style("text-anchor", "end")
      			.text("J Magnitude");
		
		svg.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		   	.append("text")
			.attr("class", "label")
			.attr("y", 6)
			.attr("dy", ".71em")
			.attr("transform", "rotate(-90)")
			.style("text-anchor", "end")
     			.text("B-J color");

		var div = d3.select("div.cmd").append("div")   
    			.attr("class", "tooltip")               
    			.style("opacity", 0);		

		//draw, scale, and place data on canvas
		var circs = svg.append("g")
			.attr("id","colcircs")
			.attr("clip-path","url(#clipcolor)")
			.selectAll(".cdot")
			.data(brvsr)
			.enter().append("circle")
			.attr("class", "cdot")
			.attr("fill",function(d) {return colorscale(d[2]);})
			.attr("r",3)
			.attr("transform", transform);

		//buttons that add behaviors when clicked
		//reset's view depending on time domain selected
		get_button = d3.select(".clear-button");
		    clear_button = svg.append('text')
		      .attr("y", -10)
		      .attr("x", 10)
		      .attr("class", "clear-button")
		      .attr("id","reset-button")
		      .attr("fill","grey")
		      .text("reset");
		
		//mouse zoom + pan
		get_button2 = d3.select(".clear-button");
		    clear_button2 = svg.append('text')
		      .attr("y", -10)
		      .attr("x", 55)
		      .attr("class", "clear-button")
		      .attr("id", "zoom-button")
		      .attr("fill","grey")
		      .text("zoom");

		//tooltips, shows info of point when you hover over it
		get_button3 = d3.select(".clear-button");
		    clear_button3 = svg.append('text')
		      .attr("y", -10)
		      .attr("x", 100)
		      .attr("class", "clear-button")
		      .attr("id", "tooltips-button")
		      .attr("fill","grey")
		      .text("tooltips");

		//add second svg element to hold our sider
		//this will show the time scale
		//the slider enables interactively setting time domain
		var width = 700 - margin.left - margin.right;
		height2 = 90 - margin.top - margin.bottom;

		var timescale = d3.scale.linear()
			.domain(d3.extent(ctime))
			.range([0,width]);

		//brush behavior for slider
		var brush = d3.svg.brush()
		    	.x(timescale)
		    	.extent(d3.extent(ctime))
			.on("brush",brushend);

		//the ends for the slider
		var arc = d3.svg.arc()
    			.outerRadius(height2 / 2)
    			.startAngle(0)
    			.endAngle(function(d, i) { return i ? -Math.PI : Math.PI; });

		//canvas to hold the slider and data. color of dots
		//reflects time of observation
		var svg2 = d3.select("div.cmd").append("svg")
    			.attr("width", width + margin.left + margin.right)
    			.attr("height", height2 + margin.top + margin.bottom)
  		     .append("g")
    			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		//time axis for slider
		svg2.append("g")
    			.attr("class", "x axis")
    			.attr("transform", "translate(0," + height2 + ")")
    		     .call(d3.svg.axis().scale(timescale).orient("bottom").tickSize(8).ticks(7))
    		     .append("text")
   			.attr("class", "label")
    			.attr("x", width)
    			.attr("y", 38)
    		     .style("text-anchor", "end")
    		     .text("Julian Date Color Scale");

		//lay down points across the time scale
		//shows what data was taken when
		var timecircs = svg2.append("g")
			.attr("id","timecircs")
			.selectAll(".timedot")
		     .data(brvsr)
		     .enter().append("circle")
			.attr("class", "timedot")
			.attr("fill",function(d) {return colorscale(d[2]);})
			.attr("cx", function(d) { return timescale(d[2]); })
			.attr("cy", 10)
			.attr("r",3);

		var brushg = svg2.append("g")
    			.attr("class", "brush")
    		     .call(brush);

		brushg.selectAll(".resize").append("path")
    			.attr("transform", "translate(0," +  height2 / 2 + ")")
    			.attr("d", arc);

		brushg.selectAll("rect")
    			.attr("height", height2);

		function brushstart() {
  			svg2.classed("selecting", true);
		}

		function brushmove() {
  			var s = brush.extent();
  			circs.classed("selected", function(d) { return s[0] <= d && d <= s[1]; });
		}

		function brushend() {
		  svg.classed("selecting", !d3.event.target.empty());
		  //remove the old cmd and make a new one
		  var s = brush.extent();
		  d3.select("#colcircs").remove();
		  color = [], cred=[], ctime=[], blue = data.Bmag, red = data.Jmag, time= data.time;
		  for(i = 0; i < blue.length; i++){
			if ((blue[i] != null) && (red[i] != null) && ((time[i] > s[0]) && (time[i] <= s[1]))){
				color.push(blue[i]-red[i]);
				cred.push(red[i]);
				ctime.push(time[i]);
			}//endif
		  }//end for
		  xdom=d3.extent(cred);
		  ydom=d3.extent(color);
		  brvsr = d3.zip(cred,color,ctime);
		  var circs = svg.append("g")
			.attr("id","colcircs")
			.attr("clip-path","url(#clipcolor)")
			.selectAll(".cdot")
			.data(brvsr)
			.enter().append("circle")
			.attr("class", "cdot")
			.attr("fill",function(d) {return colorscale(d[2]);})
			.attr("r",3)
			.attr("transform", transform);
			//if tooltips were selected, restore them 
		  if (tooltipsclick%2===1){
			d3.selectAll('.cdot').on("mouseover", function(d) {      
		             div.transition()        
		               	.duration(100)      
		               	.style("opacity", .9);      
            	     	     div.html("JD:"+parseFloat(d[2]).toFixed(2)+"<br>"+"Jmag:"+parseFloat(d[0]).toFixed(3)+"<br>"+"Bmag:"+parseFloat(d[0]+d[1]).toFixed(3))  
                		.style("left", (d3.event.pageX) + "px")     
                		.style("top", (d3.event.pageY - 42) + "px");    
           		})                  
        		d3.selectAll('.cdot').on("mouseout", function(d) {       
            	     		div.transition()        
                		   .duration(100)      
                		   .style("opacity", 0);   
        		});
	     	  }//close if tooltipsclick
	        }//close brushend()

		//keep track of number of clicks on buttons
		var zoomclick=0;

		var tooltipsclick=0;

		//make buttons
		clear_button.on('click', reset);

		clear_button2.on('click',togglezoom);

		clear_button3.on('click',toggletooltips);

		//when you hover your mouse over a point
		//a div is made over that point, and filled in with
		//more info of that data point
		function toggletooltips() {
			if (tooltipsclick%2===0){
				d3.selectAll('.cdot').on("mouseover", function(d) {      
            			     div.transition()        
                			.duration(100)      
                			.style("opacity", .9);      
            			     div.html("JD:"+parseFloat(d[2]).toFixed(2)+"<br>"+"Jmag:"+parseFloat(d[0]).toFixed(3)+"<br>"+"Bmag:"+parseFloat(d[0]+d[1]).toFixed(3))  
                			.style("left", (d3.event.pageX) + "px")     
                			.style("top", (d3.event.pageY - 42) + "px");    
           			})                  
        			d3.selectAll('.cdot').on("mouseout", function(d) {       
            			     div.transition()        
                			.duration(100)      
                			.style("opacity", 0);   
        			});
				//alert("you clicked it");
				d3.select(this).attr("fill","black");
			}
			else{
				d3.selectAll('.cdot').on("mouseover",null);
				d3.selectAll('.cdot').on("mouseout",null);
				d3.select(this).attr("fill","grey");
				//$('#zoom-button').toggleClass('clicked-button');
			}
			tooltipsclick += 1;
		}

		function togglezoom() {
			if (zoomclick%2===0){
				svg.call(zoom);
				//alert("you clicked it");
				d3.select(this).attr("fill","black");
			}
			else{
				svg.on('.zoom',null);
				d3.select(this).attr("fill","grey");
				//$('#zoom-button').toggleClass('clicked-button');
			}
			zoomclick += 1;
		}

		function reset() {
		  d3.transition().duration(750).tween("zoom", function() {
		    var ix = d3.interpolate(x.domain(), [d3.min(cred), d3.max(cred)]),
		        iy = d3.interpolate(y.domain(), [d3.min(color), d3.max(color)]);
		    return function(t) {
		      zoom.x(x.domain(ix(t))).y(y.domain(iy(t)));
		      zoomed();
		    };
		  });
		}	

		function zoomed() {
			//circs.attr("transform", transform);
			svg.selectAll(".cdot").attr("transform",transform);
			svg.select(".x.axis").call(xAxis);
			svg.select(".y.axis").call(yAxis);
		}

		function transform(d) {
		  return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
		}
	});//close json
}
