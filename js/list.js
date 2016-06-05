/*
 * Item formats raw data returned by Google Places into an
 * object containing observables that is appended to the 
 * ViewModel's observable array
 */

function Item(result) {
    this.name = ko.observable(result.name);
    this.visible = ko.observable(true);
    this.rating = ko.observable('Rating: ' + result.rating);
    
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
    }
};

ko.applyBindings(ViewModel);