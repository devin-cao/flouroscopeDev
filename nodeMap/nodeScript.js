//values I expect sluice to give me"
var upperLeft = [-151,58], 
    bottomRight =[-54,10.5];


//Use info from the window size to draw the svg:
var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , width = parseInt(d3.select('body').style('width'))
  , mapRatio = (9/16)
  , height = width * mapRatio; //this will need to be set to the default aspect ration for the WebThing

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

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

//////////////////////////////////////////////////////////////////////////////////
//load up the csv woith whatever data you are working with: 
//d3.csv("renewableStations.csv",function(data){ //renewable energy stations

d3.csv("solarLevelsCounty.csv",function(data){

var minVal = d3.min(data,function(d){return d.annualAverage})  
var maxVal = d3.max(data,function(d){return d.annualAverage})

var brightness = d3.scale.log()
    .domain( [minVal, maxVal] ) 
    .range(["black", "gold"])

    // load and display the World
    d3.json("world-110m2.json", function(error, topology) {
        g.selectAll("path")
          .data(topojson.object(topology, topology.objects.countries)
              .geometries)
        .enter()
          .append("path")
          .attr("d", path)

        g.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("fill", function(d){return brightness(d.annualAverage)})
            .attr("r", 7)
            .attr("cx",function(d){
              return projection([d.lon, d.lat])[0]
            })
            .attr("cy",function(d){
              return projection([d.lon, d.lat])[1]
            })


    });//closes .json load

})//closes csv load

