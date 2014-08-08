
var drawIt = function(theData) {
//set height and width parameters
var width = 1000;
var height = 600;

//Data that will be fed in by sluice
var currentCenter = [-119.519,34.401]
var scale = 100

//Draw the svg
var svg = d3.select(".map").append("svg")
				.attr("height",height)
				.attr("width",width)

//set up the projection
var projection = d3.geo.mercator()
    //.scale((width + 1) / 2 / Math.PI)
    .translate([width / 2, height / 2])
    .precision(.1)
    .center(currentCenter)
    .scale(scale)

var path = d3.geo.path()
    .projection(projection);

svg.selectAll("circle")
    .data(theData)
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
    

svg.selectAll("text")
    .data(theData)
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

}

var locationTest = [{"where": "Carpinteria", "lat":34.401, "lon":-119.519},
                    {"where": "Detroit ", "lat":42.4, "lon":-83.14},
                    //{"where": "Milwaukee", "lat":43.07, "lon":-88.02},
                    {"where": "Seattle", "lat":47.65, "lon":-122.37},
                    {"where": "NYC", "lat":41.18, "lon":-73.22},
                    {"where": "Madrid", "lat":40.9, "lon":-3.70},
                    {"where": "Cairo", "lat":30.06, "lon":31.25}
]

drawIt(locationTest)
//-------------------------------------------------------------------------
//API pulling stuff:
//-------------------------------------------------------------------------



jQuery.ajaxSetup({async:false}); //asynchronicity is the devil

var getLatLon = function(where){
    var apiKey = "AIzaSyByolaM8l2clFXLvBhaIRE3daYbFwK8l4Y";
    var output = "json";
    var parameters = where;
    var apiAddress = "https://maps.googleapis.com/maps/api/geocode/" + output + "?address=" + parameters +"&key="+ apiKey;

//query the api
    var latlon 
    $.getJSON(apiAddress,{async: false},function(result){
        latlon = result.results[0].geometry.location
        //var lat = latlon.lat
        //var lon = latlon.lng
        return(latlon);
        
    });
}

//bring in the plant data:
/*
d3.csv("coalPlants.csv", function(d){
    
    var natGasPlants = []

    for (var i = 0; i < d.length; i++) {
        if (d[i]["Secondary Energy Source"] === "NG") {
            
            var location = d[i]["State"]+"+"+d[i]["County"]
            d[i]["latlon"] = getLatLon(location)

            natGasPlants.push(d[i])
        }
    }

    



})
*/
