angular.module('countries', ['ngRoute', 'ngAnimate'])
	.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		 //delete $httpProvider.defaults.headers.common['X-Requested-With'];

		$routeProvider.when('/', {
			templateUrl: 'home.html'
		})
		.when('/countries', {
			templateUrl: 'countries.html',
			controller: 'CountriesCtrl as countryList'
		})
		.when('/countries/:country/:capital', {
			templateUrl: 'capital.html',
			controller: 'CapitalCtrl as capital'
		})
		.otherwise('/home');
	}])
	.constant('URL_COUNTRYINFO', 'http://api.geonames.org/countryInfoJSON')
	.constant('URL_SEARCH', 'http://api.geonames.org/searchJSON')
	.constant('URL_NEIGHBORS', 'http://api.geonames.org/neighboursJSON')
	.factory('getCountries', ['$http', 'URL_COUNTRYINFO', function ($http, URL_COUNTRYINFO) {
		return function () {
			return $http({
				method: 'GET',
				url: URL_COUNTRYINFO,
				cache: true,
				params: {
					username: 'citen',
					formatted: 'true',
					style: 'full'
				}
			});
		}
	}])
	.factory('getSearch', ['$http', 'URL_SEARCH', function ($http, URL_SEARCH) {
		return function (countryCode, capital) {
			return $http({
				method: 'GET',
				url: URL_SEARCH,
				params: {
					username: 'citen',
					q: capital,
					country: countryCode,
					isNameRequired: true,
					maxRows: 1
				}
			});
		}
	}])
	.factory('getNeighbors', ['$http', 'URL_NEIGHBORS', function ($http, URL_NEIGHBORS) {
		
	}])
	.controller('CountriesCtrl', ['$scope', '$http', '$location', 'getCountries', function ($scope, $http, $location, getCountries) {
		getCountries()
		.success(function (result) {
			$scope.dataSet = result.geonames;
		})
		.error(function() {
			console.log('error');
		});

		$scope.viewCountry = function (countryCode, capital) {
			if (countryCode) {
				$location.path('/countries/' + countryCode + '/' + capital);
			}
		};
	}])
	.controller('CapitalCtrl', ['$scope', '$http', '$q', '$routeParams', 'getSearch', function ($scope, $http, $q, $routeParams, getSearch) {
		var countryCode = $routeParams.country,
		    capital = $routeParams.capital;

		getSearch(countryCode, capital)
		.success(function (result) {
			$scope.dataSet = result;
			console.log($scope.dataSet);
		})
		.error(function() {
			console.log('error');
		});
	}]);