describe('Unit: MyApp', function() {
    // Load the module with MainController
    beforeEach(module('myApp'));

	var ctrl, scope;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope) {
      // Create a new scope that's a child of the $rootScope
      scope = $rootScope.$new();
      // Create the controller
      ctrl = $controller('CommentsCtrl', {
        $scope: scope
      });
    }));
	
	it('should get comments', 
    function() {
      expect(scope.comments).toBeUndefined();
      scope.getComments();
      expect(scope.comments).toBe(null);
  });
    //it('should return current version', inject(function(version) {
    //    expect(version).toEqual('0.1');
    //}));
});