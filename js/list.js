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
    
    if (result.opening_hours) {
        this.open = ko.observable(result.opening_hours.open_now);
    }
}

/*
 * ViewModel holds the array of museums that are rendered
 * on our list view.
 */
var ViewModel = {
    items : ko.observableArray(''),
    
    reset : function() {
        this.items([]);
    },
    
    marker: function(data, event) {
        var index = ko.contextFor(event.target).$index();
        google.maps.event.trigger(markers[index], 'click');
    }
};

ko.applyBindings(ViewModel);