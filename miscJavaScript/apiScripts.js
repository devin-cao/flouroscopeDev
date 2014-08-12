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