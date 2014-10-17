'use strict';

describe('Unit tests for CommentsCtrl', function() {
    var $rootScope, $scope, $controller;

	// prepare angular for being testable
    beforeEach(angular.mock.module('myApp'));
    beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_){
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        $controller('CommentsCtrl', {
            '$rootScope' : $rootScope,
            '$scope': $scope
        });
    }));

    // this has a dependency to config.js
    it('test availabilty of comments url in config'), function() {
        $scope.commentsUrl.not.toBeUndefined();
    }

    it('should call the function getComments', function () {
        spyOn($scope, 'getComments');
        $scope.getComments();
        expect($scope.getComments).toHaveBeenCalled();
    });

    it('should call the function submit', function () {
        spyOn($scope, 'submit');
        $scope.submit();
        expect($scope.submit).toHaveBeenCalled();
    });

    it('should call the function deleteComment', function () {
        spyOn($scope, 'deleteComment');
        $scope.deleteComment();
        expect($scope.deleteComment).toHaveBeenCalled();
    });
	
	it('should test if the more functionality is working', function () {
        var quantity = $scope.quantity;
		expect(quantity).toEqual(3)
        $scope.more();
        expect($scope.quantity).toBeGreaterThan(quantity);
	});
});