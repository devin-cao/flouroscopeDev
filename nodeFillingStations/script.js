var width = 1200,
    height = 700,
    centered;

var svg = d3.select("#visualization").append("svg")
    .attr("width", width)
    .attr("height", height)

var projection = d3.geo.albersUsa()
    .scale(1100)
    .translate([(3.2*width) / 5, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

queue()
    .defer(d3.json,"us-10m.json")
    .defer(d3.csv, "renewableStations.csv")
    .await(ready);


function ready(error, us, data) {

    g.append("g")
          .attr("id", "states")
        .selectAll("path")
          .data(topojson.feature(us, us.objects.states).features)
        .enter().append("path")
          .attr("d", path)

      g.append("path")
          .datum(topojson.mesh(us, us.objects.states))
          .attr("id", "state-borders")
          .attr("d", path);


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
                .attr("x", 750)
                .attr("y",100)
                .attr("text-anchor","start")
                .attr("fill","black")
                .attr("font-size", 20)
                .attr("font-family","optima")
        })
        .on("mouseout",function(){
            d3.select(this)
            .transition()
            .duration(400)
            .attr("r",2)

            d3.selectAll("#plantNameText")
                .remove()
        })
}

svg.append("text")
    .text("Alternative Fuel Filling Stations")
    .attr("x", 15)
    .attr("y", 55)
    .attr("text-anchor","start")
    .attr("font-size", 25)
    .attr("font-family","optima")
//Legend and selector stuff!

types = ['BD', 'CNG', 'E85', 'ELEC', 'HY', 'LNG', 'LPG']

var clicked = false

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
    .on("click", function(d){
        if (clicked){ 
            clicked = false

            d3.select(this)
                .transition()
                .attr("r", 15)

            d3.select("g").selectAll("circle")
                .attr("r",4)
                .attr("fill-opacity", 0.3)

        } else {
            clicked = true

            d3.select(this)
                .transition()
                .attr("r", 20)

            var selected = d3.select(this).attr("id") //grab the type so it can be used

            d3.select("g").selectAll("circle")
                //.transition()
                .attr("fill-opacity", 0.01)

            d3.selectAll("." + selected)
                //.attr("r",8)
                .attr("fill-opacity", 0.3)
        } 
    })
    .on("mouseover", function(d){
        if (clicked){
            //do nothing
        } else {
            d3.select(this)
                .transition()
                .attr("r", 20)

            var selected = d3.select(this).attr("id") //grab the type so it can be used

            d3.select("g").selectAll("circle")
                //.transition()
                .attr("fill-opacity", 0.01)

            d3.selectAll("." + selected)
                //.attr("r",8)
                .attr("fill-opacity", 0.3)
        }
    })
    .on("mouseout", function(d){
        if (clicked){
            //do nothing
        } else {
            d3.select(this)
                .transition()
                .attr("r", 15)

            d3.select("g").selectAll("circle")
                .attr("r",4)
                .attr("fill-opacity", 0.3)
        }
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

        })

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
