//creating the background tile layer
var basemap = L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
    {
    maxZoom: 19,
    attribution:
        'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

//Create map object with zoom
var map = L.map("map", {
    center: [
        40.7, -94.5
    ],
    zoom: 3
});

//Adding our basemap to the map
basemap.addTo(map);

//Retrive geojson data
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    console.log(data)

    //Establish style of markers
    function styleInfo(feature) {
        return {
            opacity: 1,
        fillOpacity: 0.5,
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: "#000000",
        radius: getRadius(feature.properties.mag),
        stroke: true,
        weight: 0.5
        };
    }

    //Color of the markers
    function getColor(depth) {
        switch (true) {
        case depth > 100:
          return "#3647b4";
        case depth > 80:
          return "#3647b4";
        case depth > 60:
          return "#60b0fb";
        case depth > 40:
          return "#97daf5";
        case depth > 20:
          return "#ffccdf";
        case depth > 0:
          return "#f97bab";
        default:
          return "#ba7acf";
        }
    }

    //Size of markers
    function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }

  //Add geojason data to the map
  L.geoJson(data, {
    pointToLayer: function (feature,latlng) {
        return L.circleMarker(latlng);
    },

    //Popups for each marker
    style: styleInfo,
    onEachFeature: function(feature,layer) {
        layer.bindPopup(
            "Magnitude: "
            + feature.properties.mag
            + "<br>Depth: "
            + feature.geometry.coordinates[2]
            + "<br>Location: "
            + feature.properties.place
        );
    }
  }).addTo(map);

  //Create a legend
  var legend = L.control({
    position: "bottomright"
  });

  //Legend details
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += "<h3>Depth in kilometers</h3>";
    div.innerHTML += '<i style="background: #ba7acf"></i><span>-20 to 0</span><br>';
    div.innerHTML += '<i style="background: #f97bab"></i><span>0 to 20</span><br>';
    div.innerHTML += '<i style="background: #ffccdf"></i><span>20 to 40</span><br>';
    div.innerHTML += '<i style="background: #97daf5"></i><span>40 to 60</span><br>';
    div.innerHTML += '<i style="background: #60b0fb"></i><span>60 to 80</span><br>';
    div.innerHTML += '<i style="background: #3647b4"></i><span>80 to 100</span><br>';
    div.innerHTML += '<i style="background: #3647b4"></i><span>100+</span><br>';

  return div;
  };

//Add the legend to the map
legend.addTo(map);
});
