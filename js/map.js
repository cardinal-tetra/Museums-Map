var map;
var markers = [];
var infoWindow;

var options = {
    center: {lat: -37.879791, lng: 145.159387},
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false
};

/*
 * Check if the browser supports geolocation, if it does we will try
 * to obtain the user's position and center our map on it, if there
 * is an error or geolocation is not supported then we will center
 * our map on the default position
 */
function geolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPos, initMap);
    } else {
        initMap();
    }
}

function setPos(position) {
    options.center.lat = position.coords.latitude;
    options.center.lng = position.coords.longitude;
    initMap();
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), options);

    infoWindow = new google.maps.InfoWindow({
        maxWidth: 300
    });
    
    getMuseums();
}

/*
 * Pass our map center coordinates to constructor and use the object
 * to retrieve an array of museums within a 30km radius
 */
function getMuseums() {
    var center = map.getCenter();
    var parameters = new request(center.lat(), center.lng());
    
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(parameters, populate);
}

function request(y, x) {
    this.location = new google.maps.LatLng(y, x);
    this.radius = '30000';
    this.types = ['museum'];
}

/*
 * Iterate through our museums array to populate the map with markers
 * and list with items
 */
function populate(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        // we are aiming for 10 locations, but will make do if less
        var j = 10;
        if (results.length < 10) {
            j = results.length;
        }
        
        for (var i = 0; i < j; i++) {
            createMarker(results[i]);
            // TODO: create list item
        }
    }
}

function createMarker(place) {
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
    });
    
    google.maps.event.addListener(marker, 'click', function() {
        // make an AJAX call to wikipedia here
        infoWindow.setContent(place.name + place.vicinity);
        infoWindow.open(map, this);
    });
    
    markers.push(marker);
}
