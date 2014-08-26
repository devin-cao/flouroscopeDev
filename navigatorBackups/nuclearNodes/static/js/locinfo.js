var counter = 0 //counter to tell if intialized or not.

var margin = {top: 0, left: 0, bottom: 0, right: 0}, //Use info from the window size to draw the svg:
    width = $( window ).width(), //jquery vs d3
    mapRatio = (10/16.5),
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

var ulPoint = [projection(upperLeft)[0] + .1,projection(upperLeft)[1] + 0.1],  //Use projection to convert the bounds to pixel positions in the svg
    brPoint = [projection(bottomRight)[0] - 0.1 ,projection(bottomRight)[1] - 0.1],
    s = 1 / Math.max((brPoint[0] - ulPoint[0]) / width, (brPoint[1] - ulPoint[1]) / height), //Do some math to figure out the scale and transformation to the map
    t = [(width - s * (brPoint[0] + ulPoint[0])) / 2, (height - s * (brPoint[1] + ulPoint[1])) / 2];

console.log("Upper left: " + ulPoint)
console.log("Bottom Right: " + brPoint)
console.log("width     " + $( window ).width())

var g = svg.append("g");

projection    // Update the projection to use computed scale & translate.
	    .scale(s)
	    .translate(t);


if (counter === 1) {  //Check to see if initialized or not yet, if not, Initialize:

	g.selectAll("circle") //Append some svg circles to the DOM.
	      .data(theData)
	      .enter()
	      .append("circle")												
	      .attr("r", 5)
	      .attr("fill","blue")
	      .attr("cx",function(d){
	        return projection([d.lon, d.lat])[0]
	      })
	      .attr("cy",function(d){
	        return projection([d.lon, d.lat])[1]
	      })
	      .on("mouseover",function(d){
	        d3.select(this)
	          .attr("r",15)
	      })
	      .on("mouseout",function(d){
	        d3.select(this)
	          .attr("r",2)
	      })

} else { //if the points are already initialized, Update:

    d3.selectAll("circle")
          .data(theData)
          .attr("cx",function(d){ //update the positions of the cirlces with the newly computed projection. 
            return projection([d.lon, d.lat])[0]
          })
          .attr("cy",function(d){											//working solar data code
            return projection([d.lon, d.lat])[1]
          })

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

