//values I expect sluice to give me
var upperLeft = [-151,58], 
    bottomRight =[-54,10.5];

//////////////////////////////////////////////////////////////////////////////////
//load up the csv with whatever data you are working with: 

//d3.csv("data/randomGeoData.csv",function(data){  //Random Data
//d3.csv("data/latLonIfiedData.csv",function(data){ //Natural Gas data
//d3.csv("data/renewableStations.csv",function(data){ //renewable energy stations

//Use info from the window size to draw the svg:
var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , width = parseInt(d3.select('body').style('width'))
  //, width = 600
  , mapRatio = (9/16)
  , height = width * mapRatio; //this will need to be set to the default aspect ration for the WebThing
  //, height = 400

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//set up the projection: 
var projection = d3.geo.mercator()
    .scale(1)
    .translate([0,0]);

var path = d3.geo.path()
    .projection(projection);

var //ulPoint = projection([-85,24]), //trying cuba for a sec
    //brPoint = projection([-74,19]),
    ulPoint = projection(upperLeft), 
    brPoint = projection(bottomRight),
    s = 1 / Math.max((brPoint[0] - ulPoint[0]) / width, (brPoint[1] - ulPoint[1]) / height),
    t = [(width - s * (brPoint[0] + ulPoint[0])) / 2, (height - s * (brPoint[1] + ulPoint[1])) / 2];

// Update the projection to use computed scale & translate.
projection
    .scale(s)
    .translate(t);

//Code to deal with a resizing of the WebThing:
var g = svg.append("g");

/*
d3.select(window).on('resize', function(){ resize() });

function resize() {
    width = parseInt(d3.select('body').style('width'));
    height = parseInt(d3.select('body').style('height'));
    //height = width * mapRatio;

    // resize the map container
    svg
        .attr('width', width)
        .attr('height', height);

    // update projection
    var ulPoint = projection(upperLeft), 
        brPoint = projection(bottomRight),
        s = 1 / Math.max((brPoint[0] - ulPoint[0]) / width, (brPoint[1] - ulPoint[1]) / height),
        t = [(width - s * (brPoint[0] + ulPoint[0])) / 2, (height - s * (brPoint[1] + ulPoint[1])) / 2];

// Update the projection to use computed scale & translate.
    projection
        .scale(s)
        .translate(t);t. 

    // resize the map
    g.selectAll('path').attr('d', path);
   
    //move the data-nodes as well
    d3.selectAll("circle")
        .attr("cx",function(d){
            return projection([d.lon, d.lat])[0]
        })
        .attr("cy",function(d){
             return projection([d.lon, d.lat])[1]
        })
}


//Pulsating points: 
var movingCircles = function(){
    g.selectAll("circle")
        .transition()
        .duration(800)
        .ease("log")
        .attr("r", 5)
        .attr("fill", "blue")
        .each("end", function(){
            d3.select(this)
                .transition()
                .duration(800)
                .ease("log")
                .attr("r", 3)
                //.attr("fill", "red")
                .each("end",function(){
                    movingCircles()
                })
        })
}

*/

// load and display the World
d3.json("world-110m2.json", function(error, topology) {
    g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
          .geometries)
    .enter()
      .append("path")
      .attr("d", path)
/*
    g.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        //.attr("cx", 0)
        //.attr("cy", 0)
        .on("mouseover",function(d){
            d3.select(this)
            .transition()
            .duration(400)
            .attr("r", 6)

            svg.append("text")
                //.text(d["Plant Name"])
                .text(d['Street Address'] + ", " + d['City'] + ", " + d["State"])
                .attr("id", "plantNameText")
                .attr("x",d3.select(this).attr("cx") - 10)
                .attr("y",d3.select(this).attr("cy"))
                .attr("text-anchor","end")
                .attr("fill","blue")
        })
        .on("mouseout",function(){
            d3.select(this)
            .transition()
            .duration(400)
            .attr("r",1)

            d3.selectAll("#plantNameText")
                .remove()
        })
        .attr("r", 5)
        .attr("fill","blue")
        .attr("fill-opacity",0.2)
        .attr("cx",function(d){
          return projection([d.lon, d.lat])[0]
        })
        .attr("cy",function(d){
          return projection([d.lon, d.lat])[1]
        })
        //.each("end",function(d,i){ movingCircles() })
*/
//});


})

