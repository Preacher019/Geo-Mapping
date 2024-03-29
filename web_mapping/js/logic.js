var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 4
});

var colors = ["#FFBE33", "#FFA833", "#FF9333", "#FF5833", "#FF4933","#FF3333"]

function getColor(magnitude){
  if (magnitude < 1){
    color = colors[0];
  } else if (magnitude >= 1 && magnitude < 2){
    color = colors[1];
  } else if (magnitude >= 2 && magnitude < 3){
    color = colors[2];
  } else if (magnitude >= 3 && magnitude < 4){
    color = colors[3];
  } else if (magnitude >= 4 && magnitude < 5){
    color = colors[4];
  } else {
    color = colors[5];
  }
  return color;
}
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" + API_KEY)

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl, function(data) {
  var features = data["features"];

for (var i = 0; i < features.length; i++) {
  var geometry = features[i]["geometry"]["coordinates"];
  var magnitude = features[i]["properties"]["mag"];
  var title = features[i]["properties"]["title"];
  var coords = {
    longitude: geometry["0"],
    latitude: geometry["1"]
  };

  var latlng = L.latLng(coords.latitude, coords.longitude);
    var circle = L.circle(latlng, {
      color: getColor(magnitude),
      fillOpacity: 0.50,
      radius: magnitude * 40000
    }).addTo(myMap);

    L.circle(latlng)
      .bindPopup("<h1>" + title + "</h1> <hr> <h3>Magnitude: " + magnitude + "</h3><h3>Latitude: " + coords.latitude + "</h3><h3>Longitude: " + coords.longitude + "</h3>")
      .addTo(myMap);
}

var legend = L.control({position: 'bottomright'});
legend.onAdd = function (myMap){
  var div = L.DomUtil.create('div', 'info legend'),
    grades = [0,1,2,3,4,5];
    div.innerHTML = '<h3>Earthquake Magnitude</h3>'

  for (var i = 0; i < grades.length; i++){
    div.innerHTML +=
      '<i class="legend" style="background:' + colors[i] + '; color:' + colors[i] + ';">....</i>' +
      grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '++');
  }
  return div;
};

legend.addTo(myMap);

});
