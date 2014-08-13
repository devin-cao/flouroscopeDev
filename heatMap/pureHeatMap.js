//values I expect sluice to give me"
var upperLeft = [-151,58], 
    bottomRight =[-54,10.5];

//////////////////////////////////////////////////////////////////////////////////
//load up the csv with whatever data you are working with: 

//d3.csv("data/randomGeoData.csv",function(data){  //Random Data
d3.csv("data/latLonIfiedData.csv",function(data){ //Natural Gas data
//d3.csv("data/renewableStations.csv",function(data){ //renewable energy stations


//Use info from the window size to draw the svg:
var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , width = parseInt(d3.select('body').style('width'))
  , mapRatio = (9/16)
  , height = width * mapRatio; //this will need to be set to the default aspect ration for the WebThing


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

d3.select(window).on('resize', function(){ resize() });

function resize() {
    width = parseInt(d3.select('body').style('width'));
    height = width * mapRatio;

    d3.select(".heatmap")
            .attr("width", width)
            .attr("height",height)
}

/*
d3.select("body").append("div")
            .attr("id","heatmapContainer")
            .attr("width", width)
            .attr("height",height)
*/

// minimal heatmap instance configuration
var heatmapInstance = h337.create({
  // only container is required, the rest will be defaults
  container: document.querySelector('.heatmapContainer')
});

// now generate some random data
var points = [];
var max = 0;
var width = parseInt(d3.select('body').style('width'))
var height = width * (9/16);
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
heatmapInstance.setData(newData);

})
