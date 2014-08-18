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
d3.csv("renewableStations.csv",function(data){ //renewable energy stations

// //Use info from the window size to draw the svg:
// var margin = {top: 0, left: 0, bottom: 0, right: 0}
//   , width = parseInt(d3.select('body').style('width'))
//   , mapRatio = (9/16)
//   , height = width * mapRatio; //this will need to be set to the default aspect ration for the WebThing



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
/*
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
 */   
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
        .attr("class", function(d){
            return d['Fuel Type Code']
        })
        .attr("fill",function(d){
            return colorChooser(d['Fuel Type Code'])
        })
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

        //.each("end",function(d,i){ movingCircles() })
});


svg.append("text")
    .text("Renewable energy filling stations")
    .attr("x", 15)
    .attr("y", 55)
    .attr("text-anchor","start")
    .attr("font-size", 25)

})

//Legend and selector stuff!

types = ['BD', 'CNG', 'E85', 'ELEC', 'HY', 'LNG', 'LPG']

//Makes legend circles!
svg.selectAll("circle")
    .data(types, function(d){return d}) 
    .enter()
    .append("circle")
    .attr("class","legend")
    .attr("id", function(d){
        return d
    })
    .attr("r",15)
    .attr("cx", 50)
    .attr("cy", function(d,i){
        return 200 + (i * 50)})
    .attr("fill", function(d){
        return colorChooser(d)
    })
    .on("mouseover", function(d){
        d3.select(this)
            .transition()
            .attr("r", 20)

        var selected = d3.select(this).attr("id") //grab the type so it can be used

        d3.select("g").selectAll("circle")
            //.transition()
            .attr("fill-opacity", 0.01)

        d3.selectAll("." + selected)
            //.transition()
            .attr("r",8)
            .attr("fill-opacity", 0.3)
    })

    .on("mouseout", function(d){
        d3.select(this)
            .transition()
            .attr("r", 15)

        d3.select("g").selectAll("circle")
            //.transition()
            .attr("r",4)
            .attr("fill-opacity", 0.3)
    })

svg.selectAll("text")
    .data(types, function(d){return d}) 
    .enter()
    .append("text")
    .text(function(d){
        return stationType(d) })
    .attr("x", 75)
    .attr("y", function(d,i){
        return 200 + (i * 50)})
    .attr("text-anchor","start")
    .attr("font-size", 15)
    .attr("font-family", "optima")

function colorChooser(type) {
    if            (type ===  "BD"){
            return "brown"
        } else if (type === "CNG"){
            return "blue"
        } else if (type === "LNG"){
            return "mediumturquoise"
        } else if (type === "E85"){
            return "gold"
        } else if (type === "ELEC"){
            return "darkmagenta"
        } else if (type === "HY"){
            return "red"
        } else { 
            return "black"
        }
}

function stationType(type) {
    if            (type ===  "BD"){
            return "Bio Diesel"
        } else if (type === "CNG"){
            return "Compressed Natural Gas"
        } else if (type === "LNG"){
            return "Liquid Natural Gas"
        } else if (type === "E85"){
            return "Corn Ethanol"
        } else if (type === "ELEC"){
            return "Electric"
        } else if (type === "HY"){
            return "Hydrogen"
        } else { 
            return "Liquid Propane"
        }
}
