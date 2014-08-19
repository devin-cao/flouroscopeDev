//values I expect sluice to give me"
var upperLeft = [-151,58], 
    bottomRight =[-54,10.5];

var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , width = parseInt(d3.select('body').style('width'))
  , mapRatio = (9/16)
  , height = width * mapRatio;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//////////////////////////////////////////////////////////////////////////////////
d3.csv("nuclearPowerPlants.csv",function(data){ //renewable energy stations

//set up the projection: 
var projection = d3.geo.mercator()
    .scale(1)
    .translate([0,0]);

var path = d3.geo.path()
    .projection(projection);

var ulPoint = projection(upperLeft), 
    brPoint = projection(bottomRight),
    s = 1 / Math.max((brPoint[0] - ulPoint[0]) / width, (brPoint[1] - ulPoint[1]) / height),
    t = [(width - s * (brPoint[0] + ulPoint[0])) / 2, (height - s * (brPoint[1] + ulPoint[1])) / 2];

// Update the projection to use computed scale & translate.
projection
    .scale(s)
    .translate(t);

//Code to deal with a resizing of the WebThing:
var g = svg.append("g");

d3.select(window).on('resize', function(){ resize() });

function resize() {
    width = parseInt(d3.select('body').style('width'));
    height = parseInt(d3.select('body').style('height'));
    //height = width * mapRatio;

    // resize the map container
    svg
        .attr('width', width)
        .attr('height', height);

    //move the data-nodes as well
    d3.selectAll("circle")
        .attr("cx",function(d){
            return projection([d.lon, d.lat])[0]
        })
        .attr("cy",function(d){
             return projection([d.lon, d.lat])[1]
        })
}


// load and display the World
d3.json("world-110m2.json", function(error, topology) {
    g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
          .geometries)
    .enter()
      .append("path")
      .attr("d", path)
      .on("click", function(d){

        console.log(projection.invert(path.bounds(d)[0])) //UL corner
        console.log(projection.invert(path.bounds(d)[1])) //BR corner
    })

g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("r", 4)
    .attr("fill-opacity", 0.3)
    .attr("fill", "steelblue")
    .attr("cx",function(d){
      return projection(d['location'])[0]
    })
    .attr("cy",function(d){
      return projection(d['location'])[1]
    })

});


})
