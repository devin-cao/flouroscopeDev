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

queue()
        .defer(d3.json,"world-110m2.json")
        .defer(d3.csv, "nuclearReactorsWorld.csv")
        .await(ready);

function ready(error, topology, data) {

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
    .attr("r", 4)
    .attr("fill-opacity", 0.8)
    .attr("fill","gold")
    .attr("cx",function(d){
      return projection([d.lon, d.lat])[0]
    })
    .attr("cy",function(d){
      return projection([d.lon, d.lat])[1]
    })
    .on("mouseover", function(d){
        d3.select(this)
            .attr("r",6)

        // console.log(d3.select(this).attr("cx"))

        // g.append("text")
        //     .attr("id","reactorInfo")
        //     .attr("x", d3.select(this).attr("cx"))
        //     .attr("y", d3.select(this).attr("cy"))
        //     .text(d.Facility)
    })
    .on("mouseout", function(d){
        d3.select(this)
            .attr("r",4)

        // d3.select("#reactorInfo")
        // .remove()
    })

}

// zoom and pan
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        // g.selectAll("circle")
        //     .attr("d", path.projection(projection));
        // g.selectAll("path")  
        //     .attr("d", path.projection(projection)); 

  });

svg.call(zoom)
//////////////////////////////////////////////////////////////////////////////////
