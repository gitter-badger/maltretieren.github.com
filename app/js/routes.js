'use strict';


var myApp = angular.module('myApp', ['ngRoute', 'ui.bootstrap', '$locationProvider']);


myApp.config(function($routeProvider, $locationProvider) {
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
	$locationProvider {
		// turning on html5Mode to have access to the parameters of the url
		$locationProvider.html5Mode(true);
	});
});
