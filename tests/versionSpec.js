'use strict';

describe('Unit: MyApp', function() {
    // Load the module with MainController
    beforeEach(angular.mock.module('myApp'));

	var ctrl, scope;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(angular.mock.inject(function($controller, $rootScope) {
      // Create a new scope that's a child of the $rootScope
      scope = $rootScope.$new();
      // Create the controller
      ctrl = $controller('TableCtrl', {
        $scope: scope
      });
    }));
	
	it('should get comments', 
    function() {
	  console.log(scope.orderByField);
  });
    //it('should return current version', inject(function(version) {
    //    expect(version).toEqual('0.1');
    //}));
});