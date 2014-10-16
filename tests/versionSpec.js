'use strict';

describe('Unit: MyApp', function() {
    // Load the module with MainController
    beforeEach(angular.mock.module('myApp'));

	var ctrl, scope, q;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(angular.mock.inject(function($controller, $rootScope, $q) {
      // Create a new scope that's a child of the $rootScope
      scope = $rootScope.$new();
      q = $q
      // Create the controller
      ctrl = $controller('CommentsCtrl', {
        $scope: scope
      });
    }));

	it('should get comments', 
    function() {
      //expect(scope.comments).toEqual({  });
        var data;

        // set up a deferred
        var deferred = q.defer();
        // get promise reference
        var promise = deferred.promise;

        // set up promise resolve callback
        promise.then(function (response) {
            data = response.success;
        });

        scope.getComments().then(function(response) {
            // resolve our deferred with the response when it returns
            deferred.resolve(response);
        });

        // force `$digest` to resolve/reject deferreds
        scope.$digest();

        // make your actual test
        expect(data).toEqual([something]);
      //expect(scope.comments).not.toMatch("{  }");
  });
    //it('should return current version', inject(function(version) {
    //    expect(version).toEqual('0.1');
    //}));
});