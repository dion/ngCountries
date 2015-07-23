angular.module('countries', ['ngRoute', 'ngAnimate'])
	.run(function($rootScope, $location, $timeout) {
	    $rootScope.$on('$routeChangeError', function() {
	        $location.path("/error");
	    });
	    $rootScope.$on('$routeChangeStart', function() {
	        $rootScope.isLoading = true;
	    });
	    /*$rootScope.$on('$routeChangeSuccess', function() {
	      $timeout(function() {
	      //  $rootScope.isLoading = false;
	      }, 1000);
	    });*/
	})
	.config(['$routeProvider', '$httpProvider', function ($routeProvider, $httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		 //delete $httpProvider.defaults.headers.common['X-Requested-With'];

		$routeProvider.when('/', {
			templateUrl: 'home.html',
			controller: 'HomeCtrl as home'
		})
		.when('/countries', {
			templateUrl: 'countries.html',
			controller: 'CountriesCtrl as countryList'
		})
		.when('/countries/:country', {
			templateUrl: 'country.html',
			controller: 'CountryCtrl as country'
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
				cache: true,
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
		return function (countryCode) {
			return $http({
				method: 'GET',
				url: URL_NEIGHBORS,
				cache: true,
				params: {
					username: 'citen',
					country: countryCode
				}
			});
		}
	}])
	.factory('getCountry', [function () { 
		return function (list, countryCode, capital) {
			for (var i = 0, len = list.length; i < len; ++i) {
				if (countryCode != undefined && capital != undefined) {
					if (list[i].countryCode == countryCode && list[i].capital == capital) {
						return list[i];
					}
				} else if (countryCode && capital == undefined) {
					if (list[i].countryCode == countryCode) {
						return list[i];
					}
				} 
			}
		}
	}])
	.controller('HomeCtrl', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
		$timeout(function() {
			$rootScope.isLoading = false;
		}, 100);
	}])
	.controller('CountryCtrl', ['$rootScope', '$scope', '$routeParams', 
								'getCountry', 'getCountries', function ($rootScope, $scope, $routeParams, getCountry, getCountries) {
		var countryCode = $routeParams.country;

		getCountries()
		.success(function (result) {
			$scope.parentCountry = getCountry(result.geonames, countryCode);
			$rootScope.isLoading = false;
		})
		.error(function() {
			console.log('error');
		});
	}])
	.controller('CountriesCtrl', ['$rootScope', '$scope', '$http', 
								  '$location', 'getCountries', function ($rootScope, $scope, $http, $location, getCountries) {
		getCountries()
		.success(function (result) {
			$scope.dataSet = result.geonames;
			$rootScope.isLoading = false;

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
	.controller('CapitalCtrl', ['$rootScope', '$scope', '$http', '$q', 
								'$routeParams', 'getSearch', 
								'getCountries', 'getNeighbors', 'getCountry',
		function ($rootScope, $scope, $http, $q, $routeParams, getSearch, getCountries, getNeighbors, getCountry) {
			var countryCode = $routeParams.country,
			    capital = $routeParams.capital;

			function errorMsg (err) {
				console.log(error);
			}

			getCountries()
			.success(function (result) {
				$scope.parentCountry = getCountry(result.geonames, countryCode, capital);
				$rootScope.isLoading = false;

				//console.log($scope.parentCountry);
			})
			.error(errorMsg);

			getSearch(countryCode, capital)
			.success(function (result) {
				$scope.dataSet = result.geonames[0];
				//console.log($scope.dataSet);
			})
			.error(errorMsg);

			getNeighbors(countryCode)
			.success(function (result) {
				console.log(result);
				$scope.neighbors = result;
			})
			.error(errorMsg);

	}]);