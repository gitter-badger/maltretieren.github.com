"use strict";

myApp.filter('interpolate', function (version) {
    return function(text) {
       return String(text).replace(/\%VERSION\%/mg, version);
     }
});

/**
 * orderBy doesn't work for objects
 * http://justinklemm.com/angularjs-filter-ordering-objects-ngrepeat/
 */
myApp.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field]);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});

// just copy paste the example above to add more filters

