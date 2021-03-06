'use strict'

app.controller('HomeCtrl', function ($scope, $http) {
  var map = L.map('map');

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IjZjNmRjNzk3ZmE2MTcwOTEwMGY0MzU3YjUzOWFmNWZhIn0.Y8bhBaUMqFiPrDRW9hieoQ', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(map);

  function onLocationFound(e) {
    var geojson = {
      'type': 'Location',
      'coordinates': e.latitude + ', ' + e.longitude,
    }

    $http.post('https://radish-backend.herokuapp.com/location', geojson)
      .then(function (data) {
        var radius = e.accuracy / 2;
        if (!data.data.speed) {
          L.marker(e.latlng).addTo(map)
            .bindPopup("Oops, it doesn't look like you're moving. Start driving to get your speed!").openPopup();

          L.circle(e.latlng, radius).addTo(map);
        } else {
          if (data.data.speed > 0) {
            L.marker(e.latlng).addTo(map)
              .bindPopup("You are traveling " + data.data.speed + " mph heading " + data.data.direction).openPopup();
          } else {
            L.marker(e.latlng).addTo(map)
              .bindPopup("Oops, it doesn't look like you're moving. Start driving to get your speed!").openPopup();
          }
        }
      }, function (err) {
        console.log(err);
      })

  }

  function onLocationError(e) {
    alert(e.message);
  }

  map.on('locationfound', onLocationFound);
  map.on('locationerror', onLocationError);

  map.locate({
    setView: true,
    watch: true,
    maxZoom: 16
  });
});
