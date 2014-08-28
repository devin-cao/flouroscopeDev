var counter = 0 //counter to tell if intialized or not.

var margin = {top: 0, left: 0, bottom: 0, right: 0}, //Use info from the window size to draw the svg:
    width = $( window ).width(), //jquery vs d3
    mapRatio = (10/16),
    height = width * mapRatio; //this will need to be set to the default aspect ratio for the WebThing

var svg = d3.select("body").append("svg") //Draw the svg canvas to the DOM. 
    // .attr("width", width)
    // .attr("height", height)
    // .style("border","1px solid red");

function setBrowserLoc(bllat, bllon, trlat, trlon) {

counter += 1 

var projection = d3.geo.mercator() //Initialize up the projection: 
    .scale(1)
    .translate([0,0]);

var path = d3.geo.path()
    .projection(projection);

var upperLeft   = [bllon,trlat]; //Convert the sluice given coordinate bounds to upper left and bottom right points. 
var bottomRight = [trlon,bllat];

var ulPoint = [projection(upperLeft)[0],projection(upperLeft)[1]],  //Use projection to convert the bounds to pixel positions in the svg
    brPoint = [projection(bottomRight)[0],projection(bottomRight)[1]],
    s = 1 / Math.max((brPoint[0] - ulPoint[0]) / width, (brPoint[1] - ulPoint[1]) / height), //Do some math to figure out the scale and transformation to the map
    t = [(width - s * (brPoint[0] + ulPoint[0])) / 2, (height - s * (brPoint[1] + ulPoint[1])) / 2];

var hexRadius = 15

var hexbin = d3.hexbin() //Set up hexbin to browswer window (if the size of the window ends up changing this will have to be re-initialized.)
    .size([width, height])
    .radius(hexRadius);

var brightness = d3.scale.sqrt() //Gold = more sunlight
    .domain( [2, 8.2] ) //hard coded max values, should probably be added automatically. 
    .range(["black", "gold"])

projection    // Update the projection to use computed scale & translate.
	    .scale(s)
	    .translate(t);

if (counter === 1) {  //Check to see if initialized or not yet, if not, Initialize:

	data.forEach(function(d){  //convert the latlon points [0] is lon to xy coordinates to draw. Hexbins is not a geospacial specific package. 
	    var p = projection(d);
	    d[0] = p[0], d[1] = p[1]; 
	  });

	svg.append("g")                    //append a g to the dom and then start drawing some paths. 
	      .attr("class", "hexagons")
	    .selectAll("path")
	      .data(hexbin(data).sort(function(a,b){return b.length - a.length; }))
	    .enter().append("path")
	      .attr("d", hexbin.hexagon(0.1))
	      .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")"; })
	      .style("fill", function(d){ return brightness(d3.mean(d, function(d){return +d.annualAverage; }))})
	      //.style("fill-opacity", 0.8)
	      .on("mouseover", function(d){
	          d3.select(this)
	            .transition()
	            .duration(50)
	            .style("fill", "blue")
	      })
	      .on("mouseout", function(d){
	          d3.select(this)
	            .transition()
	            .duration(2500)
	            .style("fill", function(d){ return brightness(d3.mean(d, function(d){return +d.annualAverage; }))})
	      })
	      .transition()    //useless, but pretty enter animation. 
	      .duration(1000)
	      .attr("d", hexbin.hexagon(hexRadius - 1.3))

     oldUpperLeft   = upperLeft; //upper left in pixels  Needed for scaling and transforming later. 
	 oldBottomRight = bottomRight;//bottom right ""

} else { //if the points are already initialized, Update:

	var xTrans   = (projection(oldUpperLeft)[0] - projection(upperLeft)[0]),      //all sorts of lovely values need to be computer to figure out how to scale the elements in the dom based upon window movement. 
		yTrans   = (projection(oldUpperLeft)[1] - projection(upperLeft)[1] ),
		orgXDif  = (projection(oldBottomRight)[0] - projection(oldUpperLeft)[0]),
		orgYDif  = (projection(oldBottomRight)[1] - projection(oldUpperLeft)[1] ),
		xDif     = (projection(bottomRight)[0]    - projection(upperLeft)[0]),
		yDif     = (projection(bottomRight)[1]    - projection(upperLeft)[1] ),
		transVal = [xTrans,yTrans],
		scaleVal = (orgXDif/xDif);

	// console.log("x Pixel difference  = " + scaleVal ) //never can put too many console.logs in for debugging. 

	d3.selectAll(".hexagons")
	      .attr("transform","translate(" + transVal.join(",") + ")scale(" + scaleVal +")");  //the magic. 

	    
} //closes else statement

} //closes the setloc function 

// var theData = [
//   {
//     "place": "MCT Headquarters",
//     "lat":34.39402,
//     "lon":-119.51157
//   },
//   {
//     "place": "46 King St.",
//     "lat":44.47479800000001,
//     "lon":-73.21682899999999
//   },
//   {
//     "place": "1705 Concord Dr.",
//     "lat":40.555019,
//     "lon":-105.108286
//   },
//   {
//     "place": "2121 Medford Rd.",
//     "lat":42.2572886,
//     "lon":-83.7135017
//   }
// ]

