'use strict';

var myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);

myApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when(
    	'/view1', 
    	{
    		templateUrl: '/assets/partials/partial1.html',
    		controller: 'MyCtrl1'
    	});
    $routeProvider.when(
    	'/view2', 
    	{
    		templateUrl: '/assets/partials/partial2.html',
    		controller: 'MyCtrl2'
    	});
    $routeProvider.otherwise(
        {
            redirectTo: '/view1'
        });

});
