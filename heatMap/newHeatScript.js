//values I expect sluice to give me"
var upperLeft = [-151,58], 
    bottomRight =[-54,10.5];


//////////////////////////////////////////////////////////////////////////////////
//load up the csv woith whatever data you are working with: 

//d3.csv("data/randomGeoData.csv",function(data){  //Random Data
d3.csv("data/latLonIfiedData.csv",function(data){ //Natural Gas data
//d3.csv("data/renewableStations.csv",function(data){ //renewable energy stations

//set up gradient 
var minVal = d3.min(data, function(d){return +d["Nameplate Capacity (MW)"]})
var maxVal = d3.max(data, function(d){return +d["Nameplate Capacity (MW)"]})


//Use info from the window size to draw the svg:
var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , width = parseInt(d3.select('body').style('width'))
  , mapRatio = (9/16)
  , height = width * mapRatio; //this will need to be set to the default aspect ration for the WebThing

var div = d3.select("body").append("div")
                            .attr("id", "container")
                            .attr("width", width)
                            .attr("height", height)
                            
var svg =  div
            .append("svg")
            .attr("width", width)
            .attr("height", height)

//set up blur for heatmap
var filter = svg.append("defs")
  .append("filter")
    .attr("id", "blur")
    //.attr("width",200)
    //.attr("height",200)
  .append("feGaussianBlur")
    .attr("stdDeviation", 2)

//set up gradient for heatmap
var color = d3.scale.linear()
    .domain([minVal, maxVal])
    .range(["green", "red"]);


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
        .attr("r", 20)
        .attr("fill", function(d){return color(+d["Nameplate Capacity (MW)"])})
        .attr("fill-opacity", 0.02)
        .attr("filter","url(#blur)")
        .attr("cx",function(d){
          return projection([d.lon, d.lat])[0]
        })
        .attr("cy",function(d){
          return projection([d.lon, d.lat])[1]
        })
        .on("mouseover",function(d){
            d3.select(this)
            .transition()
            .duration(400)
            .attr("r", 10)

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
            .attr("r",2)

            d3.selectAll("#plantNameText")
                .remove()
        })
});


svg.append("text")
    .text("Natural Gas wells")
    .attr("x", 15)
    .attr("y", 40)
    .attr("text-anchor","start")
    .attr("font-size", 25)

/*
var mapContainer = div.append("div")
                        .attr("id","mapContainer")
                        .attr("class","heatmap")
                        .attr("width", width)
                        .attr("height",height)

mapContainer.append("div")
            .attr("class","heatmap")
            .attr("width", width)
            .attr("height",height)

// minimal heatmap instance configuration
var heatmapInstance = h337.create({
  // only container is required, the rest will be defaults
  container: document.querySelector('.heatmap')
});

// now generate some random data
var points = [];
var max = 0;
var len = 200;

while (len--) {
  var val = Math.floor(Math.random()*100);
  max = Math.max(max, val);
  var point = {
    x: Math.floor(Math.random()*width),
    y: Math.floor(Math.random()*height),
    value: val
  };
  points.push(point);
}
// heatmap data format
var newData = { 
  max: max, 
  data: points 
};
// if you have a set of datapoints always use setData instead of addData
// for data initialization
heatmapInstance.addData(newData);
*/
})
