var map;
var markers = [];
var infoWindow;

var options = {
    center: {lat: -37.8142, lng: 144.963},
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

/*
 * For each museum, create and place a marker that when clicked
 * will display an infoWindow featuring information from
 * Google Places and Wikipedia
 */
function createMarker(place) {
    // place the marker
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name
    });
    
    // save the photo url if existing
    var photo = '';
    if (place.photos) {
        photo = place.photos[0].getUrl({'maxHeight': 150});
    }
    
    google.maps.event.addListener(marker, 'click', function() {
        self = this;
        
        // bounce the marker
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.setAnimation(null);
        }, 2000);
        
        // Wikipedia AJAX call
        var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + place.name + '&format=json&callback=WikiCallback';
        
        $.ajax({
            url: wikiUrl,
            dataType: 'jsonp',
            success: function(data) {
                if (data[2].length !== 0) {
                    windowContent(place.name, place.vicinity, data[2][0], photo);
                    infoWindow.open(map, self);
                } else {
                    windowContent(place.name, place.vicinity, '', photo);
                    infoWindow.open(map, self);
                }
            }
        });
    });
    markers.push(marker);
}

function windowContent(name, address, message, photo) {
        infoWindow.setContent('<h4>' + name + '<br><small>' + address + '</small></h4>' + '<p>' + message + '</p>' + '<img src="' + photo + '" class="img-rounded">');
        }
