var closest_array = [makeClose("Closest", 1000), makeClose("Closest", 1000), makeClose("Closest", 1000)];

var markers = [];
var map = null;

var selected_color = 0;
var selected_prices = [];

var masterList = [
  {
    "field": "B/W",
    "list": [8, 9, 10],
  },
  {
    "field": "Color",
    "list": [10, 25],
  }
]

$(document).ready(function(){

  updatePrices();

  readyAgain();

  $('.color').click(function(){
    selected_color = $(this).data("val");
    $('.color').removeClass('active');
    $(this).addClass('active');
    updatePrices();
    showMarkers(); 
    readyAgain();
  });

});

function readyAgain(){

  $('.valid').click(function(){
    $(this).toggleClass('active');
    addSelectedPrices();
    showMarkers();
  });
}

function updatePrices(){
  var list = masterList[selected_color].list;

  $('.valid').removeClass("valid");
  $('.option.price').each(function(index){
    if (itemInList($(this).data("val"), list)){
      $(this).addClass("valid");
    }
  });
}

function itemInList(item, list){
  for (var i = 0; i < list.length; i++){
    if (list[i] == item){
      return true;
    }
  }
}

function addSelectedPrices(){
  selected_prices = [];
  $('.option.price.active.valid').each(function(){
    selected_prices.push($(this).data("val"));
  })
}



// Creates marker and pushes to markers array
function makeMarker(marker){
  var lon = parseFloat(marker.lon);
  
  var mark = new google.maps.Marker({
    position: {lat: parseFloat(marker.lat), lng: lon},
    title: marker.name,
    obj: marker
  });

  markers.push(mark);
}

// Displays appropriate markers
function showMarkers(){
  for (var i = 0; i < markers.length; i++){

    if (isSelectedColor(markers[i]) && itemInList(markers[i].obj.cents, selected_prices)){

      markers[i].setMap(map);
    } else{
      markers[i].setMap(null);
    }
  }
}

function isSelectedColor(marker){
  return  (masterList[selected_color].field == marker.obj.color);
}


function initMap() {
  var cornell = {lat: 42.447909, lng: -76.477998};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: cornell
  });

  var infoWindow = new google.maps.InfoWindow({map: map});

  $.ajax({
    url: "js/printers.json",
    success: function (data) {
      console.log(data);
      geoLocate(infoWindow, map, data);
      for (var i = 0; i < data.length; i++){
        makeMarker(data[i]);
      }
      showMarkers();
    }
  });
}

function geoLocate(infoWindow, map, data){
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      getClosestMarker(data, pos);

      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

// Makes a close object
function makeClose(name, distance){
  return {
    name: name,
    distance: distance
  }
}

function getClosestMarker(data, pos){

  var here = new google.maps.LatLng(pos.lat, pos.lng);

  for (var i = 0; i < data.length; i++){
    var marker = data[i];
    var lon = parseFloat(marker.lon);
    var lat = parseFloat(marker.lat);

    // Create Marker
    var marker_pos = new google.maps.LatLng(lat, lon);

    var dist = google.maps.geometry.spherical.computeDistanceBetween(marker_pos, here);

    updateClosest(dist, marker);
  }

  $("#message").html("<p>Closest printers: </p>");
  for (var i = 0; i < closest_array.length; i ++){
    $("#message").append("<p>" + closest_array[i].name + " in " + pretty(closest_array[i].distance) + " feet.</p>");
  }
}

function updateClosest(dist, marker){
  for (var i = 0; i < closest_array.length; i++){
    if (dist < closest_array[i].distance){
      closest_array[i] = makeClose(marker.name, dist);
      return;
    }
  }
}

function pretty(meters){
  return Math.round(meters * 3.28084);
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}