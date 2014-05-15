angular.module('bootstrap-tagsinput', [])
.directive('tagsinput', [function() {
 
function getItemProperty(scope, property) {
if (!property)
return undefined;
 
if (angular.isFunction(scope.$parent[property]))
return scope.$parent[property];
 
return function(item) {
return item[property];
};
}
 
return {
require: '^ngModel',
restrict: 'A',
link: function(scope, element, attrs, ctrl) {
// view -> model
ctrl.$parsers.unshift(function () {
return $(element).tagsinput('items');
});
 
$(function() {
var select = $(element);
select.tagsinput({
typeahead : {
source : angular.isFunction(scope.$parent[attrs.typeaheadSource]) ? scope.$parent[attrs.typeaheadSource] : null
},
itemValue: getItemProperty(scope, attrs.itemvalue),
itemText : getItemProperty(scope, attrs.itemtext),
tagClass : angular.isFunction(scope.$parent[attrs.tagclass]) ? scope.$parent[attrs.tagclass] : function(item) { return attrs.tagclass; }
});
 
select.on('itemAdded', function(event) {
scope.$apply();
});
 
select.on('itemRemoved', function(event) {
scope.$apply();
});
});
}
};
}]);