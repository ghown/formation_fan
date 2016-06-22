(function() {
	'use strict';

	describe('ors-services', function() {
	
		beforeEach(module('ors-services'));
		jasmine.getJSONFixtures().fixturesPath = 'base/test/mock';	
		
		describe('ors-services.Ctrl', function() {
			var $scope;
			var $http;
			var $controller;
			var $rootScope;
		
			beforeEach(inject(['$injector', function($injector) {
				$http = $injector.get('$httpBackend');
				$controller = $injector.get('$controller');
				$rootScope = $injector.get('$rootScope');
				
				$scope = $rootScope.$new();
				$controller('ors-services.Ctrl', {$scope: $scope});
				
				$http.when('GET', '../ws/releve.csv').respond(getJSONFixture('releve.csv'));
			}]));
				
			it('should show correctly the csv file', function() {
				$http.expectGET('../ws/releve.csv');
				$http.flush();
				expect($scope.lines.length).toEqual(3);
			});
		});
	});
})();

