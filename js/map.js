var map;

var options = {
    center: {lat: -37.879791, lng: 145.159387},
    zoom: 14,
    mapTypeControl: false,
    streetViewControl: false
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), options);
}