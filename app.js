angular.module('countries', ['ngRoute', 'ngAnimate'])
	.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/home', {
			templateUrl: 'home.html'
		})
		.when('/countries', {
			templateUrl: 'countries.html'
		})
		.otherwise('/home');
	}]);