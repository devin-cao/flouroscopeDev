//values I expect sluice to give me"
var upperLeft = [-151,58], 
    bottomRight =[-54,10.5];

//Use info from the window size to draw the svg:
var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , width = parseInt(d3.select('body').style('width'))
  , mapRatio = (9/16)
  , height = width * mapRatio; //this will need to be set to the default aspect ration for the WebThing

var container = d3.select("body").append("div")
								.attr("class","container")
								.attr("height",height)
								.attr("width", width)
container.append("canvas")
		.attr("id","canvas")
		.attr("height",height)
		.attr("width", width)

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
    
//Data Manipulation!///////////////////////
var data = [], max = 0;

for (var i = 0; i<datafied.length; i++) {
	max = Math.max(max, datafied[i]["Nameplate Capacity (MW)"] )
	data.push([projection(datafied[i]['latlons'])[0],projection(datafied[i]['latlons'])[1],datafied[i]["Nameplate Capacity (MW)"]])
}
///////////////////////////////////////////

var heat = simpleheat('canvas').data(data).max(18),
    frame;

function draw() {
    console.time('draw');
    heat.draw();
    console.timeEnd('draw');
    frame = null;
}

draw();
