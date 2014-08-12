d3.csv("randomGeoData.csv",function(data){

//for (var i = 0; i < data.length; i++){console.log(data[i].lat + data[i].lon)}

var drawIt = function(data) {
//set height and width parameters
var width = 1000;
var height = 600;


//Pulsating points: 

var movingCircles = function(){
    d3.selectAll("circle")
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
                .attr("fill", "red")
                .each("end",function(){
                    movingCircles()
                })
        })
}

//Data that will be fed in by sluice
var currentCenter = [-100,30]
var scale = 120

//Draw the svg
var svg = d3.select(".map").append("svg")
				.attr("height",height)
				.attr("width",width)

//set up the projection
var projection = d3.geo.mercator()
    .center([0, 5 ])
    //.center(currentCenter)
    .scale(150)
    .rotate([-180,0]);

var path = d3.geo.path()
    .projection(projection);


d3.json("geoJson.json", function(error, world) {
  svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);


svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .on("mouseover",function(){
        d3.select(this)
        .transition()
        .duration(400)
        .attr("r", 10)
    })
    .on("mouseout",function(){
        d3.select(this)
        .transition()
        .duration(400)
        .attr("r",2)
    })
    .transition()
    .duration(1000)
    .attr("r", 2)
    .attr("cx",function(d){
      return projection([d.lon, d.lat])[0]
    })
    .attr("cy",function(d){
      return projection([d.lon, d.lat])[1]
    })
    .each("end",function(d,i){
            movingCircles()
    })


});



//lets get this ball rolling:   

    
/*
svg.selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d){return d.where})
    .attr("x", 0)
    .attr("y", 0)
    .transition()
    .duration(1000)
    .attr("x",function(d){
      return projection([d.lon, d.lat])[0]
    })
    .attr("y",function(d){
      return projection([d.lon, d.lat])[1]
    })
    .attr("text-anchor", "end")
*/
}

var locationTest = [{"where": "Carpinteria", "lat":34.401, "lon":-119.519},
                    {"where": "Detroit ", "lat":42.4, "lon":-83.14},
                    //{"where": "Milwaukee", "lat":43.07, "lon":-88.02},
                    {"where": "Seattle", "lat":47.65, "lon":-122.37},
                    {"where": "NYC", "lat":41.18, "lon":-73.22},
                    {"where": "Madrid", "lat":40.9, "lon":-3.70},
                    {"where": "Cairo", "lat":30.06, "lon":31.25}
]

drawIt(data)

})
