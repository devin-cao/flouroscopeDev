//values I expect sluice to give me
var upperLeft   = [-136.72485,42.42576], 
    bottomRight = [-113.17017,32.08723];


//////////////////////////////////////////////////////////////////////////////////
//load up the csv with whatever data you are working with: 

//d3.csv("data/randomGeoData.csv",function(data){  //Random Data
//d3.csv("data/latLonIfiedData.csv",function(data){ //Natural Gas data
//d3.csv("data/renewableStations.csv",function(data){ //renewable energy stations
d3.csv("data/caPowerPlantData.csv",function(data){

//Use info from the window size to draw the svg:
var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , width = parseInt(d3.select('body').style('width'))
  , mapRatio = (10/16)
  , height = width * mapRatio; //this will need to be set to the default aspect ration for the WebThing

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

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

//scaling function for node size: 
nodeScale = d3.scale.sqrt()
    .domain([   d3.min( data  ,function(d){ return +d.ONLINE_MW; }), 
                d3.max( data  ,function(d){ return +d.ONLINE_MW; })
             ])    
    .range([1,20]);

//Code to deal with a resizing of the WebThing:
var g = svg.append("g");


// // // load and display the World
// d3.json("world-110m2.json", function(error, topology) {
//     g.selectAll("path")
//       .data(topojson.object(topology, topology.objects.countries).geometries)
//     .enter()
//       .append("path")
//       .attr("d", path)
//       .on("click", function(d){

//         console.log(projection.invert(path.bounds(d)[0])) //UL corner
//         console.log(projection.invert(path.bounds(d)[1])) //BR corner
//     })

d3.json("us-10m.json", function(error, us) {
  g.append("g")
      .attr("id", "states")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path)

  g.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
      .attr("id", "state-borders")
      .attr("d", path);


g.selectAll("circle")
    .data(data, function(d){return d["Unnamed: 0"]})
    .enter()
    .append("circle")
    .attr("r", function(d){
        return nodeScale(d.ONLINE_MW)
    })
    .attr("fill",function(d){
        return colorChooser(d.FACILITY)
    })
    .attr("fill-opacity",0.3)
    .attr("cx",function(d){
      return projection([d.lon, d.lat])[0]
    })
    .attr("cy",function(d){
      return projection([d.lon, d.lat])[1]
    })
    .on("mouseover",function(d){
        d3.select(this)
            .attr("fill-opacity",1)

        svg.append("text")
            .attr("class","info")
            .text(d.PLANT_NAME)
            .attr("x",125)
            .attr("y",height - 250)
            .attr("font-family", "optima")
            .attr("font-size", "20px")
            .attr("text-anchor", "start")

        
        svg.append("text")
            .attr("class","info")
            .text(plantType(d.FACILITY))
            .attr("x",125)
            .attr("y",height - 200)
            .attr("font-family", "optima")
            .attr("font-size", "20px")
            .attr("text-anchor", "start")

        svg.append("text")
            .attr("class","info")
            .text(d.ONLINE_MW + " MW")
            .attr("x",125)
            .attr("y",height - 150)
            .attr("font-family", "optima")
            .attr("font-size", "20px")
            .attr("text-anchor", "start")   

        svg.append("text")
            .attr("class","info")
            .text(d.address)
            .attr("x",125)
            .attr("y",height - 100)
            .attr("font-family", "optima")
            .attr("font-size", "20px")
            .attr("text-anchor", "start")   
    })
    .on("mouseout",function(){
        d3.select(this)
            .transition()
            .duration(500)
            .attr("fill-opacity",0.3)

        d3.selectAll(".info")
            .remove()
    })

//Information about the plants: 

//Plant Name
svg.append("text")
    .text("Plant Name:")
    .attr("id","name")
    .attr("x",120)
    .attr("y",height - 250)
    .attr("font-family", "optima")
    .attr("font-size", "20px")
    .attr("text-anchor", "end")

//Plant Type
svg.append("text")
    .text("Type:")
    .attr("id","plantType")
    .attr("x",120)
    .attr("y",height - 200)
    .attr("font-family", "optima")
    .attr("font-size", "20px")
    .attr("text-anchor", "end")

//Plant Capacity in MW
svg.append("text")
    .text("Capacity:")
    .attr("id","capacity")
    .attr("x",120)
    .attr("y",height - 150)
    .attr("font-family", "optima")
    .attr("font-size", "20px")
    .attr("text-anchor", "end")

//Plant Address 
svg.append("text")
    .text("Address:")
    .attr("id","address")
    .attr("x",120)
    .attr("y",height - 100)
    .attr("font-family", "optima")
    .attr("font-size", "20px")
    .attr("text-anchor", "end")

//Title
svg.append("text")
    //.text("Natural Gas wells")
    .text("California power plants")
    .attr("x", 15)
    .attr("y", 40)
    .attr("text-anchor","start")
    .attr("font-size", 25)
    .attr("font-family", "optima")

})

//Legend: 
var types = ['Coal',
 'Geothermal',
 'Hydroelectric',
 'Nuclear',
 'Oil/Gas',
 'Solar',
 'Wind',
 'Wte']


//difference from title to info: 
var legendHeight = (height - 250) - 50
var legendSpace = legendHeight / (types.length + 3)

function colorChooser(type) {
    if            (type === "Hydroelectric"){
            return "cornflowerblue"
        } else if (type === "Wind"){
            return "forestgreen"
        } else if (type === "Solar"){
            return "gold"
        } else if (type === "Geothermal"){
            return "cadetblue"
        } else if (type === "Wte"){
            return "firebrick"
        } else if (type === "Nuclear"){
            return "yellow"
        } else if (type === "Coal"){
            return "saddlebrown"
        } else { //coal is left
            return "black"
        }
}

function plantType(type) {
            if (type === "Wte"){
                return "Waste to energy"
            } else {
                return type
            }
        }

svg.selectAll("text")
    .data(types, function(d){return d}) 
    .enter()
    .append("text")
    .text(function(d){
        return plantType(d)})
    .attr("class","legend")
    .attr("x", 50)
    .attr("y", function (d,i){
        return (115 + (i * legendSpace))
    })
    // .attr("fill", function(d){
    //     return colorChooser(d)
    // })
    .attr("text-anchor","start")
    .attr("font-size", 10)
    .attr("font-family", "optima")


svg.selectAll("circle")
    .data(types, function(d){return d}) 
    .enter()
    .append("circle")
    .attr("class","legend")
    .attr("r",10)
    .attr("cx", 25)
    .attr("cy", function (d,i){
        return (110 + (i * legendSpace))
    })
    .attr("fill", function(d){
        return colorChooser(d)
    })
    .on("mouseover", function(d){
        d3.select(this)
            .transition()
            .attr("r", 20)
    })
    .on("mouseout", function(d){
        d3.select(this)
            .transition()
            .attr("r", 10)
    })

// zoom and pan
var zoom = d3.behavior.zoom()
    .on("zoom",function() {
        g.attr("transform","translate("+ 
            d3.event.translate.join(",")+")scale("+d3.event.scale+")");
        g.selectAll("circle")
            .attr("d", path.projection(projection));
        g.selectAll("path")  
            .attr("d", path.projection(projection)); 

  });

svg.call(zoom)

});


var movingCircles = function(){
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