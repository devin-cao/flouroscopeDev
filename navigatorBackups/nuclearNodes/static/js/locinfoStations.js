console.log("Begining")
var counter = 0

function setBrowserLoc(bllat, bllon, trlat, trlon) {

console.log("Start Func")

counter += 1 //use a counter to distinguish between drawing for the first time and updating. 

var upperLeft   = [bllon,trlat]; //Convert the sluice given coordinate bounds to upper left and bottom right points. 
var bottomRight = [trlon,bllat];

var margin = {top: 0, left: 0, bottom: 0, right: 0}, //Use info from the window size to draw the svg:
    //width = parseInt(d3.select('body').style('width')), 
    width = $( window ).width(), //jquery vs d3
    mapRatio = (10/16.5),
    height = width * mapRatio; //this will need to be set to the default aspect ratio for the WebThing

var svg = d3.select("body").append("svg") //Draw the svg canvas to the DOM. 
    .attr("width", width)
    .attr("height", height)
    .style("border","1px solid red");

var projection = d3.geo.mercator() //Initialize up the projection: 
    .scale(1)
    .translate([0,0]);

var path = d3.geo.path()
    .projection(projection);

var ulPoint = projection(upperLeft),  //Use projection to convert the bounds to pixel positions in the svg
    brPoint = projection(bottomRight),
    s = 1 / Math.max((brPoint[0] - ulPoint[0]) / width, (brPoint[1] - ulPoint[1]) / height), //Do some math to figure out the scale and transformation to the map
    t = [(width - s * (brPoint[0] + ulPoint[0])) / 2, (height - s * (brPoint[1] + ulPoint[1])) / 2];

projection    // Update the projection to use computed scale & translate.
    .scale(s)
    .translate(t);

var g = svg.append("g");

if (counter === 1) {  //Check to see if initialized or not yet:

console.log("Initialize")


g.selectAll("circle") //Append some svg circles to the DOM.
        .data(theData)
        .enter()
        .append("circle")
        .attr("r", 2)
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

} else { //if the points are already initialized:

console.log("Update")
  

d3.selectAll("circle")
        .data(theData)
        .attr("cx",function(d){ //update the positions of the cirlces with the newly computed projection. 
          return projection([d.lon, d.lat])[0]
        })
        .attr("cy",function(d){
          return projection([d.lon, d.lat])[1]
        })

movingCircles()
}



} //closes the setloc function 

console.log("End of Func")

var movingCircles = function(){ //a function to pulse the nodes.
    console.log("function was triggered")
    d3.selectAll("circle")
        .transition()
        .duration(800)
        .ease("sin")
        .attr("r", 10)
        .each("end", function(){
            d3.select(this)
                .transition()
                .duration(800)
                .ease("sin")
                .attr("r", 5)
                .each("end",function(){
                    movingCircles()
                })
        })
}


//var theData = geoData.slice(0,50)
var theData = data

