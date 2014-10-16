'use strict';

describe('Unit: MyApp', function() {
    var $rootScope, $scope, $controller;

    beforeEach(angular.mock.module('myApp'));
    beforeEach(inject(function(_$rootScope_, _$controller_){
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        $controller('CommentsCtrl', {
            '$rootScope' : $rootScope,
            '$scope': $scope
        });
    }));

    it('should call the function getComments', function () {
        spyOn($scope, 'getComments');
        $scope.getComments();
        expect($scope.getComments).toHaveBeenCalled();
    });
});