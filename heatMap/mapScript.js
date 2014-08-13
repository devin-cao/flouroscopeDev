//Use info from the window size to draw the svg:
var margin = {top: 0, left: 0, bottom: 0, right: 0}
  , width = parseInt(d3.select('body').style('width'))
  , mapRatio = (9/16)
  , height = width * mapRatio; //this will need to be set to the default aspect ration for the WebThing

d3.select("body").append("div")
	.attr("id","#map")
	.attr("height",height)
	.attr("width",width)

$(document).ready(function(){
var map = L.map('map',{
	zoomControl: false

}).fitBounds([ [22.17694, -129.23561], [52.58283, -53.73756] ]);
        mapLink = 
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);

	/* Initialize the SVG layer */
	map._initPathRoot()    

	/* We simply pick up the SVG from the map object */
	var svg = d3.select("#map").select("svg"),
	g = svg.append("g");

// Disable drag and zoom handlers.
map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();

	
/*	
	d3.json("circles.json", function(collection) {
		
		collection.objects.forEach(function(d) {
			d.LatLng = new L.LatLng(d.circle.coordinates[0],
									d.circle.coordinates[1])
		})
		
		var feature = g.selectAll("circle")
			.data(collection.objects)
			.enter().append("circle")
			.style("stroke", "black")  
			.style("opacity", .6) 
			.style("fill", "red")
			.attr("r", 20);  
		
		map.on("viewreset", update);
		update();

		function update() {
			feature.attr("transform", 
			function(d) { 
				return "translate("+ 
					map.latLngToLayerPoint(d.LatLng).x +","+ 
					map.latLngToLayerPoint(d.LatLng).y +")";
				}
			)
		}
	})	
	*/ 	

})	 
