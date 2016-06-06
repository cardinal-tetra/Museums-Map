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
    // store array of museum items which can be emptied
    items : ko.observableArray(''),
    
    reset : function() {
        this.items([]);
    },
    
    // find new array of museums when element clicked
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
            }
        }
        
        if (this.filterTerm() == '') {
            for (var i = 0; i < j; i++) {
                this.items()[i].visible(true);
            }
        }
    }
};

ko.applyBindings(ViewModel);