/*
 * Declare global variables
 */
var map;
var markers = [];
var infoWindow;
var geocoder;
var options = {
    center: {lat: -37.8142, lng: 144.963},
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false
};

/*
 * Check if the browser supports geolocation,
 * if so we will try to center our map on the user's location,
 * if there is an error or geolocation is not supported then
 * we will center on the default position
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
        maxWidth: 250,
    });
    geocoder = new google.maps.Geocoder();
    
    getMuseums();
}

/*
 * Pass our map center coordinates to constructor and use the object
 * to retrieve an array of museums within a 30km radius
 */
function getMuseums() {
    var center = map.getCenter();
    var parameters = new request(center.lat(), center.lng());
    clearOld();
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(parameters, populate);
}

function request(y, x) {
    this.location = new google.maps.LatLng(y, x);
    this.radius = '30000';
    this.types = ['museum'];
}

function clearOld() {
    for (var i = 0, j = markers.length; i < j; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    ViewModel.reset();
}

/*
 * Iterate through our museums array to populate the map with markers
 * and list with items
 */
function populate(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        // prefer 8 locations, but will make do with less
        var j = 8;
        if (results.length < j) {
            j = results.length;
        }
        
        for (var i = 0; i < j; i++) {
            createMarker(results[i]);
            ViewModel.items.push(new Item(results[i]));
        }
    }
}

/*
 * For each museum, create and place a marker that when clicked
 * will display an infoWindow featuring information from
 * Google Places and Wikipedia
 */
function createMarker(result) {
    var marker = new google.maps.Marker({
        map: map,
        position: result.geometry.location,
        title: result.name
    });
    
    var photo = '';
    if (result.photos) {
        photo = result.photos[0].getUrl({'maxHeight': 125});
    }
    
    google.maps.event.addListener(marker, 'click', function() {
        self = this;
        map.panTo(self.getPosition());
        
        // Wikipedia AJAX call
        var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + result.name + '&format=json&callback=WikiCallback';
        
        var errorCheck = setTimeout(function() {
            windowContent(result.name, result.vicinity, '', photo);
            infoWindow.open(map, self);
        }, 3000);
        
        $.ajax({
            url: wikiUrl,
            dataType: 'jsonp',
            success: function(data) {
                clearTimeout(errorCheck);
                if (data[2].length !== 0 && data[2][0].search('refer', 'redirect') == -1) {
                    windowContent(result.name, result.vicinity, data[2][0], photo);
                } else {
                    windowContent(result.name, result.vicinity, '', photo);
                }
                infoWindow.open(map, self);
            }
        });
    });
    markers.push(marker);
}

function windowContent(name, address, message, photo) {
            infoWindow.setContent( '<img src="' + photo + '" class="img-rounded photo">' + '<h5>' + name + '<br><small>' + address + '</small></h5>' + '<p><small>' + message + '<small/></p>');
        }