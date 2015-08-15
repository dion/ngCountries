describe("countries tests", function () {
	//beforeEach(module('countries'));
	beforeEach(function () {
		module('countries');
	});

	it("getCountries should return true", function () {
		inject(function (getCountries, $rootScope, $httpBackend) {
			$httpBackend.expect('GET', 'http://api.geonames.org/countryInfoJSON?formatted=true&style=full&username=citen').respond(200);
			var status = false;
			getCountries().success(function () {
				status = true;
			});
			$rootScope.$digest();
			$httpBackend.flush()
			expect(status).toBe(true);
			$httpBackend.verifyNoOutstandingRequest();
			console.log(status);
			//expect(getCountries).toBeDefined();
		});
	});

	describe("CountryCtrl" , function () {
		var ctrl, scope;

		beforeEach(inject(function ($controller, $rootScope) {
			scope = $rootScope.$new();
			ctrl = $controller('CountryCtrl', {
				$scope: scope,
				xgetCountries: function () {
					scope.parentCountry = 'hello';
				}
			});
		}));

		it("should get countries listing", function () {
			expect(scope.parentCountry).not.toBe(null);
		});
	});

	describe("/countries route", function () {
		it("should load the route template and controller", inject(function($location, $rootScope, $httpBackend, $route) {
			$httpBackend.whenGET('countries.html').respond('...');
			//$httpBackend.expectGet('/api/current-user').respond({});

			$rootScope.$apply(function () {
				$location.path('/countries');
			});

			expect($route.current.controller).toBe("CountriesCtrl as countryList");
			expect($route.current.loadedTemplateUrl).toBe("countries.html");

			//$httpBackend.verifyNoOutstandingRequest();
			//$httpBackend.verifyNoOutstandingExpectation();

		}));
	});

});