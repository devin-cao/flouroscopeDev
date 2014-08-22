//Set the initial view bounds: 
var upperLeft   = [-136,42.5], 
    bottomRight = [-114.5,31.5];


//////////////////////////////////////////////////////////////////////////////////
//load up the csv: 
d3.csv("caPowerPlantData.csv",function(data){

var width = 1200,
    height = 700,
    centered;

var svg = d3.select("#visaulization").append("svg")
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
    .range([3,25]);

var g = svg.append("g");

//Load up the map.
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
    .attr("class",function(d){
        if (d.FACILITY === "Oil/Gas"){
            return "Oil"
        } else{
        return d.FACILITY
    }
    })
    // .attr("r", function(d){
    //     return nodeScale(d.ONLINE_MW)
    // })
    .attr("r", 0)
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
    .attr("font-size", 30)
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
        } else {                        //coal is left
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
    .attr("text-anchor","start")
    .attr("font-size", 14)
    .attr("font-family", "optima")


svg.selectAll("circle")
    .data(types, function(d){return d}) 
    .enter()
    .append("circle")
    .attr("class","legend")
    .attr("id",function(d){
        if(d === "Oil/Gas"){
            return "Oil"
        } else {
            return d
    }
    })
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

        d3.select("g").selectAll("circle")
            .attr("fill-opacity", 0.01)

        d3.selectAll("."+d3.select(this).attr("id"))
            .attr("fill-opacity", 1)
    })
    .on("mouseout", function(d){
        d3.select(this)
            .transition()
            .attr("r", 10)

        d3.select("g").selectAll("circle")
            .attr("fill-opacity", 0.3)
    })

// // zoom and pan
// var zoom = d3.behavior.zoom()
//     .on("zoom",function() {
//         g.attr("transform","translate("+ 
//             d3.event.translate.join(",")+")scale("+d3.event.scale+")");
//         g.selectAll("circle")
//             .attr("d", path.projection(projection));
//         g.selectAll("path")  
//             .attr("d", path.projection(projection)); 

//   });

// svg.call(zoom)

svg.classed("blurred",true)

var intro = d3.select("#intro")
                .attr("width", 400)

//Define a blur filter 
var filter = svg.append("defs")
  .append("filter")
    .attr("id", "blur")
  .append("feGaussianBlur")
    .attr("stdDeviation", 5);

//Allow user to move forward on click.  
d3.select("#continueText")
    .on("click", function(d){
        svg.classed("blurred", false)
        intro.remove()

        d3.selectAll("g").selectAll("circle")
            .transition()
            .duration(1000)
            .attr("r", function(d){
                return nodeScale(d.ONLINE_MW)
            })

    })

});


