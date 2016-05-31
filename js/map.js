var map;

var options = {
    center: {lat: -37.879791, lng: 145.159387},
    zoom: 16,
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
}


/*
 * Find map center's coordinates and use that to make an API call
 * retrieving XML object with data about nearby famous places
 */
function retrievePlaces() {
    
}