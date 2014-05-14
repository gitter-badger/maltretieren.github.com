'use strict';

// ngSantinize: for confirm dialogs -> https://github.com/m-e-conroy/angular-dialog-service
// bootstrap-tagsinput: http://timschlechter.github.io/bootstrap-tagsinput/examples/
var myApp = angular.module('myApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'dialogs', 'bootstrap-tagsinput', 'ngResource', 'ui.bootstrap', 'toaster']);

myApp.config(function ($routeProvider) {

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

	// turning on html5Mode to have access to the parameters of the url
	// see also: http://johan.driessen.se/posts/Manipulating-history-with-the-HTML5-History-API-and-AngularJS

});
