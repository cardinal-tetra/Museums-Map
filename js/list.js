/*
 * Item formats raw data returned by Google Places into an
 * object containing observables that is appended to the
 * ViewModel's observable array
 */
function Item(result) {
    this.name = ko.observable(result.name);
    this.visible = ko.observable(true);
    
    if (result.rating !== undefined) {
        this.rating = ko.observable('Rating: ' + result.rating);
    } else {
        this.rating = ko.observable('Rating: None');
    }
}

/*
 * ViewModel contains a range of data and methods bound to
 * elements in the View
 */
var ViewModel = {
    // store array of museum items which can be emptied
    items : ko.observableArray(''),
    
    reset : function() {
        this.items([]);
    },
    
    // clicking icon retrieves new museums data
    refresh: function() {
        getMuseums();
    },
    
    // activate marker event when corresponding item clicked
    marker: function(data, event) {
        var index = ko.contextFor(event.target).$index();
        google.maps.event.trigger(markers[index], 'click');
    },
    
    // filter items and markers
    filterTerm: ko.observable(''),
    
    filter : function(data, event) {
        this.term = new RegExp(this.filterTerm(), 'gi');
        var j = this.items().length;
        
        for (var i = 0; i < j; i++) {
            if (this.items()[i].name().match(this.term) == null) {
                this.items()[i].visible(false);
                markers[i].setMap(null);
            }
        }
        
        if (this.filterTerm() == '') {
            for (var i = 0; i < j; i++) {
                this.items()[i].visible(true);
                markers[i].setMap(map);
            }
        }
    },
    
    // recenter map on chosen location, a new set of markers and list items will be generated
    location: ko.observable(''),
    
    recenter : function(data, event) {
        if (event.keyCode == 13 || event.type == 'click') {
            geocoder.geocode({'address': this.location()}, function(result, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    map.panTo(result[0].geometry.location);
                    map.setZoom(12);
                    getMuseums();
                }
            })
        }
    }
};

ko.applyBindings(ViewModel);